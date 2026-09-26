# Week 1-2 ShoppingCart API Lab

This cumulative lab implementation covers:

- Week 1 Lab 2, Exercise 1: an Express `Hello World` route.
- Week 1 Lab 2, Exercise 4: ShoppingCart CRUD endpoints.
- Week 1 Lab 2, Exercise 5: calculated cart totals.
- Week 2 Lab 1, Exercise 1: Joi request validation.
- Week 2 Lab 1, Exercise 2: SQLite persistence.
- Week 2 Lab 1, Exercise 3: MVC-style routes, controllers, and models.

## Install and run

```powershell
npm install
npm run dev
```

The server listens on `http://localhost:3333` by default.

## Test

```powershell
npm test
```

## Endpoints

| Method | Route | Request body | Success response |
| --- | --- | --- | --- |
| GET | `/` | - | `Hello World!` |
| GET | `/cart` | - | Cart totals and `items` array |
| POST | `/cart` | `item_name`, `item_price`, `quantity` | Created item, status 201 |
| GET | `/cart/:id` | - | One item |
| PATCH | `/cart/:id` | `quantity` | Updated item |
| DELETE | `/cart/:id` | - | `<Item name> Deleted` |

Example POST body:

```json
{
  "item_name": "Keyboard",
  "item_price": 49.99,
  "quantity": 2
}
```

The final Week 1 Exercise 5 response format is used for `GET /cart`:

```json
{
  "number_of_items": 2,
  "total_price": 99.98,
  "items": []
}
```

`number_of_items` is the sum of item quantities. `total_price` is the sum of `item_price * quantity`.
