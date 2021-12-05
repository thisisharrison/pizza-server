import { Schema, model, Document } from "mongoose";
import { validateTopping } from "../validation";

export interface OrderI extends Document {
    name: Name;
    quantity: number;
    price: number;
    toppings: Topping[];
    size: Size;
}

export enum Size {
    PizzaSize1 = "Pizza Size #1",
    PizzaSize2 = "Pizza Size #2",
    PizzaSize3 = "Pizza Size #3",
}

export enum Topping {
    PizzaTopping1 = "Pizza Topping #1",
    PizzaTopping2 = "Pizza Topping #2",
    PizzaTopping3 = "Pizza Topping #3",
    PizzaTopping4 = "Pizza Topping #4",
    PizzaTopping5 = "Pizza Topping #5",
    PizzaTopping6 = "Pizza Topping #6",
    PizzaTopping7 = "Pizza Topping #7",
    PizzaTopping8 = "Pizza Topping #8",
    PizzaTopping9 = "Pizza Topping #9",
}

export enum Name {
    PizzaName1 = "Pizza Name 1",
    PizzaName2 = "Pizza Name 2",
    PizzaName3 = "Pizza Name 3",
    PizzaName4 = "Pizza Name 4",
    PizzaName5 = "Pizza Name 5",
    PizzaName6 = "Pizza Name 6",
}

const OrderSchema = new Schema<OrderI>(
    {
        name: { type: String, required: true, enum: { values: Object.values(Name), message: `{VALUE} is not a valid pizza` } },
        quantity: { type: Number, required: [true, "Must include at least 1 unit"] },
        price: { type: Number, required: [true, "Price cannot be left empty"] },
        size: { type: String, required: true, enum: { values: Object.values(Size), message: `{VALUE} is not a valid size` } },
        toppings: {
            type: [String],
            required: true,
            validate: {
                validator: function (toppings: string[]) {
                    const { isValid } = validateTopping(toppings);
                    return isValid;
                },
                message: () => `Toppings contain invalid toppings or was left empty`,
            },
        },
    },
    { timestamps: true }
);

export const Order = model<OrderI>("Order", OrderSchema);
