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
        res.status(400).json({ ...validationErrors.errors, ...errors });
        return;
    }

    if (!isValid) {
        res.status(400).json({ toppings: errors });
        return;
    }

    newOrder.save().then(
        (response) => {
            res.status(201).json(response);
            return;
        },
        (error) => {
            res.status(400).json(error);
            return;
        }
    );
});

export default router;
