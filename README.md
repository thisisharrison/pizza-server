# Pizza Store Server

---

## Development

###1. Use correct node version

```
nvm use 16
```

###2. Install Dependencies

```
yarn
```

###3. Start development Server using MongoDB

a. Install MongoDB if you do not have it

```bash
$ brew tap mongodb/brew
$ brew install mongodb-community
$ brew services start mongodb-community
If you have a previous version of mongodb
$ brew services stop mongodb
$ brew uninstall mongodb
$ brew tap mongodb/brew
$ brew install mongodb-community
$ brew services start mongodb-community
```

b. Create directory to store data

```bash
// in root directory
$ mkdir -p /data/db
```

c. Start MongoDB as a service

```bash
$ brew services start mongodb
```

d. Create DB called `pizza`

```bash
$ mongo
> use cinema
switched to db pizza
```

e. Keys for development is already configured for you. If you want to change them, you can update in `config/keys_dev.ts`

```js
export default {
    mongoURI: "mongodb://127.0.0.1:27017/pizza",
    allowedOrigin: "http://localhost:3000",
};
```

###4. Testing the service

a. Start the server

```bash
yarn start
```

b. Use `postman` or `cURL`. Generate a pizza order in JSON format.

Eg. Successful Order

```bash
$ curl -d '{"name": "Pizza Name #1","quantity": 1,"price": 99,"size": "Small","toppings": ["Pizza Topping #9","Pizza Topping #8"]}' -H 'Content-Type: application/json' http://localhost:8080/api/orders

{"name":"Pizza Name #1","quantity":1,"price":99,"size":"Small","toppings":["Pizza Topping #9","Pizza Topping #8"],"_id":"61ac8d86aa91a2a887492c48","createdAt":"2021-12-05T09:59:34.435Z","updatedAt":"2021-12-05T09:59:34.435Z","__v":0}%
```

Eg. Failed Order (missing quantity and price)

```bash
$ curl -d '{"name": "Pizza Name #1","size": "Small","toppings": ["Pizza Topping #9","Pizza Topping #8"]}' -H 'Content-Type: application/json' http://localhost:8080/api/orders

{"quantity":{"name":"ValidatorError","message":"Must include at least 1 unit","properties":{"message":"Must include at least 1 unit","type":"required","path":"quantity"},"kind":"required","path":"quantity"},"price":{"name":"ValidatorError","message":"Price cannot be left empty","properties":{"message":"Price cannot be left empty","type":"required","path":"price"},"kind":"required","path":"price"}}
```
