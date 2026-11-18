<<<<<<< HEAD
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
