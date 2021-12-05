import server from "../src";
import request from "supertest";
import mongoose from "mongoose";

afterAll((done) => {
    mongoose.connection.close();
    server.close();
    done();
});

// Happy path with right keys and values
const rightOrder = {
    name: "Pizza Name 1",
    quantity: 1,
    price: 99,
    size: "Pizza Size #1",
    toppings: ["Pizza Topping #9", "Pizza Topping #8"],
};

// Remove keys in the tests below
const missingOrder = {
    name: "Pizza Name 1",
    quantity: 1,
    price: 99,
    size: "Pizza Size #1",
    toppings: [],
};

// Update more keys below
const wrongOrder = {
    name: "Pizza Name 1",
    quantity: 1,
    price: 99,
    size: "Extra Extra Extra Large",
    toppings: ["Pizza Topping #9", "Pizza Topping #8"],
};

describe("POST /api/orders", () => {
    describe("given the right parameters", () => {
        // should save the order to the database

        test("should response with a json object containing order and _id", async () => {
            const response = await request(server).post("/api/orders").send(rightOrder);
            expect(response.body._id).toBeDefined();
        });

        test("should response with status code 201", async () => {
            const response = await request(server).post("/api/orders").send(rightOrder);
            expect(response.statusCode).toBe(201);
        });

        test("should specify json in the content type header", async () => {
            const response = await request(server).post("/api/orders").send(rightOrder);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
    });

    describe("given the missing parameters", () => {
        test("should respond with status code 400", async () => {
            let response = await request(server).post("/api/orders").send(missingOrder);
            expect(response.statusCode).toBe(400);

            let updateMissing = delete Object.assign({}, missingOrder).quantity;
            response = await request(server).post("/api/orders").send(missingOrder);
            expect(response.statusCode).toBe(400);

            updateMissing = delete Object.assign({}, missingOrder).price;
            response = await request(server).post("/api/orders").send(missingOrder);
            expect(response.statusCode).toBe(400);

            updateMissing = delete Object.assign({}, missingOrder).size;
            response = await request(server).post("/api/orders").send(missingOrder);
            expect(response.statusCode).toBe(400);

            updateMissing = delete Object.assign({}, missingOrder).name;
            response = await request(server).post("/api/orders").send(missingOrder);
            expect(response.statusCode).toBe(400);
        });

        test("should display error message", async () => {
            let response = await request(server).post("/api/orders").send(missingOrder);
            expect(response.body).toHaveProperty("toppings");

            delete missingOrder.price;
            response = await request(server).post("/api/orders").send(missingOrder);
            expect(response.body).toHaveProperty("toppings");
            expect(response.body).toHaveProperty("price");
        });
    });

    describe("given the wrong parameters", () => {
        test("should respond with status code 400", async () => {
            let response = await request(server).post("/api/orders").send(wrongOrder);
            expect(response.statusCode).toBe(400);

            let copy = Object.assign({}, rightOrder);
            copy.name = "Terrible";
            response = await request(server).post("/api/orders").send(copy);
            expect(response.statusCode).toBe(400);
        });

        test("should display error message", async () => {
            let response = await request(server).post("/api/orders").send(wrongOrder);
            expect(response.body).toHaveProperty("size");

            let copy = Object.assign({}, rightOrder);
            copy.name = "Terrible";
            response = await request(server).post("/api/orders").send(copy);
            expect(response.body).toHaveProperty("name");

            copy.toppings.push("Bad Topping");
            response = await request(server).post("/api/orders").send(copy);
            expect(response.body).toHaveProperty("toppings");
        });
    });
});
