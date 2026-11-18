import { Router } from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/auth.js';

const router = Router();

// Place order: prices & stock are verified on the server (never trust the client)
router.post('/', protect, async (req, res, next) => {
  try {
    const { items, address } = req.body;
    if (!items?.length) return res.status(400).json({ message: 'Cart is empty' });
    if (!address) return res.status(400).json({ message: 'Shipping address required' });

    const orderItems = [];
    let total = 0;
    for (const it of items) {
      const p = await Product.findById(it.product);
      if (!p) return res.status(404).json({ message: 'A product no longer exists' });
      if (p.countInStock < it.qty) return res.status(400).json({ message: `Not enough stock for ${p.name}` });
      orderItems.push({ product: p._id, name: p.name, price: p.price, qty: it.qty });
      total += p.price * it.qty;
    }
    for (const it of orderItems) await Product.findByIdAndUpdate(it.product, { $inc: { countInStock: -it.qty } });

    const order = await Order.create({ user: req.user._id, items: orderItems, address, total });
    res.status(201).json(order);
  } catch (e) { next(e); }
});

router.get('/mine', protect, async (req, res, next) => {
  try { res.json(await Order.find({ user: req.user._id }).sort('-createdAt')); } catch (e) { next(e); }
});

router.get('/', protect, admin, async (req, res, next) => {
  try { res.json(await Order.find().populate('user', 'name email').sort('-createdAt')); } catch (e) { next(e); }
});

router.put('/:id/status', protect, admin, async (req, res, next) => {
  try {
    const o = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    if (!o) return res.status(404).json({ message: 'Order not found' });
    res.json(o);
  } catch (e) { next(e); }
});

export default router;
