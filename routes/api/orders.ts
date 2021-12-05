import express from "express";
import { Order } from "../../models/Order";

const router = express.Router();

router.get("/test", (req, res) => res.json({ msg: "Testing order route" }));

router.post("/", async (req, res) => {
    // Client may send an array of pizza orders
    if (Array.isArray(req.body)) {
        try {
            const response = await Order.create(req.body);
            res.status(201).json(response);
            return;
        } catch (error) {
            console.error(error);
            res.status(400).json(error);
            return;
        }
    }

    // To handle single pizza order
    const newOrder = new Order({
        name: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price,
        size: req.body.size,
        toppings: req.body.toppings,
    });

    console.log(`newOrder`, newOrder);

    const validationErrors = newOrder.validateSync();

    if (validationErrors) {
        res.status(400).json({ ...validationErrors.errors });
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
