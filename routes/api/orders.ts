import express from "express";
import { Order } from "../../models/Order";
import { validateTopping } from "../../validation";

const router = express.Router();

router.get("/test", (req, res) => res.json({ msg: "Testing order route" }));

router.post("/", async (req, res) => {
    const newOrder = new Order({
        name: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price,
        size: req.body.size,
        toppings: req.body.toppings,
    });

    console.log(`newOrder`, newOrder);

    const validationErrors = newOrder.validateSync();

    const { errors, isValid } = validateTopping(newOrder);

    if (validationErrors) {
        return res.status(400).json({ ...validationErrors.errors, ...errors });
    }

    if (!isValid) {
        return res.status(400).json({ toppings: errors });
    }

    newOrder.save().then(
        (response) => {
            return res.status(201).json(response);
        },
        (error) => {
            return res.status(400).json(error);
        }
    );
});

export default router;
