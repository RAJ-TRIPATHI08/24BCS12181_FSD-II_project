import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
dotenv.config();

const img = (id) => `https://picsum.photos/seed/${id}/400/300`;
const products = [
  { name: 'Wireless Headphones', price: 2499, category: 'Electronics', countInStock: 25, image: img('headphones'), description: 'Bluetooth over-ear headphones with 30-hour battery.' },
  { name: 'Smart Watch', price: 3999, category: 'Electronics', countInStock: 15, image: img('watch'), description: 'Fitness tracking, heart-rate monitor and notifications.' },
  { name: 'Running Shoes', price: 1799, category: 'Fashion', countInStock: 40, image: img('shoes'), description: 'Lightweight breathable shoes for daily running.' },
  { name: 'Backpack', price: 999, category: 'Fashion', countInStock: 30, image: img('backpack'), description: 'Water-resistant 25L backpack with laptop sleeve.' },
  { name: 'Coffee Mug Set', price: 499, category: 'Home', countInStock: 50, image: img('mug'), description: 'Set of 4 ceramic mugs.' },
  { name: 'Desk Lamp', price: 799, category: 'Home', countInStock: 20, image: img('lamp'), description: 'LED lamp with adjustable brightness.' },
];

await mongoose.connect(process.env.MONGO_URI);
await Promise.all([User.deleteMany(), Product.deleteMany(), Order.deleteMany()]);
await User.create({ name: 'Admin', email: 'admin@shop.com', password: 'admin123', isAdmin: true });
await User.create({ name: 'Demo User', email: 'user@shop.com', password: 'user123' });
await Product.insertMany(products);
console.log('Seeded. Admin: admin@shop.com / admin123   User: user@shop.com / user123');
process.exit();
