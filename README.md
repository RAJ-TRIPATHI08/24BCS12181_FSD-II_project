# MERN E-Commerce Store

Full-stack shopping app: **MongoDB + Express + React (Vite) + Node.js**

## Features
- User registration / login (JWT + bcrypt password hashing)
- Product listing with search and category filter, product detail page
- Shopping cart (persisted in localStorage)
- Checkout: server re-checks price and stock, reduces stock, saves order
- "My Orders" page for customers
- Admin dashboard: add / edit / delete products, view all orders, update order status
- Role-based access control (`protect` and `admin` middleware)

## Setup
Prerequisites: Node 18+, MongoDB running locally (or a MongoDB Atlas URI).

```bash
# 1. Backend
cd server
npm install
# edit .env if needed (MONGO_URI, JWT_SECRET)
npm run seed      # creates sample products + demo accounts
npm run dev       # http://localhost:5000

# 2. Frontend (new terminal)
cd client
npm install
npm run dev       # http://localhost:5173
```

Demo logins: `admin@shop.com / admin123` (admin), `user@shop.com / user123` (customer)

## REST API
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | Public |
| GET | /api/auth/me | Logged in |
| GET | /api/products?q=&category= | Public |
| GET | /api/products/:id | Public |
| POST / PUT / DELETE | /api/products(/:id) | Admin |
| POST | /api/orders | Logged in |
| GET | /api/orders/mine | Logged in |
| GET | /api/orders | Admin |
| PUT | /api/orders/:id/status | Admin |

## Folder structure
```
server/  models/ (User, Product, Order)  routes/  middleware/auth.js  server.js  seed.js
client/  src/ pages/  context/ (Auth, Cart)  api.js  App.jsx
```

## Viva cheat-sheet
**How does authentication work?** On login the server verifies the bcrypt hash and returns a signed JWT (7 days). The React app stores it and an axios interceptor sends it as `Authorization: Bearer <token>`. The `protect` middleware verifies it and loads the user; `admin` checks `isAdmin`.

**Why recalculate the total on the server?** The client can be tampered with. The server reads real prices and stock from MongoDB, so users can't fake prices.

**Why Context API?** Auth and cart state are needed on many pages; Context avoids prop drilling. (Redux would be the scalable alternative.)

**Why Vite proxy?** It forwards `/api` to port 5000 in development, which avoids CORS issues. The `cors` package is also enabled on the server.

**How are passwords stored?** Hashed with bcrypt (10 salt rounds) in a Mongoose `pre('save')` hook. Never stored in plain text.

**Database design:** Order embeds item snapshots (name, price, qty), so old orders stay correct even if a product's price changes later. `user` and `product` are references (`ref`) to other collections.

**Possible future improvements:** payment gateway (Razorpay/Stripe), image upload (Multer/Cloudinary), pagination, reviews and ratings, refresh tokens, input validation with Joi/Zod, MongoDB transactions for orders.
