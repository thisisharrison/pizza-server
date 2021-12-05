import validator from "validator";
import { Topping } from "../models/Order";
import type { OrderI } from "../models/Order";

export function validateTopping(data: OrderI) {
    let errors: Partial<Record<keyof OrderI, string>> = {};

    let { toppings } = data;

    if (toppings.length === 0 || !Array.isArray(toppings)) {
        errors.toppings = "Toppings cannot be empty";
    } else {
        const toppingError = toppings.some((topping) => !validator.isIn(topping, Object.values(Topping)));
        if (toppingError) {
            errors.toppings = "Invalid toppings";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    };
}
