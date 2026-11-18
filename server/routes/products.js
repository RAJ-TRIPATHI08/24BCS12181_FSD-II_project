import { Router } from 'express';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/auth.js';

const router = Router();

// GET /api/products?q=phone&category=Electronics
router.get('/', async (req, res, next) => {
  try {
    const { q, category } = req.query;
    const filter = {};
    if (q) filter.name = { $regex: q, $options: 'i' };
    if (category) filter.category = category;
    res.json(await Product.find(filter).sort('-createdAt'));
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json(p);
  } catch (e) { next(e); }
});

router.post('/', protect, admin, async (req, res, next) => {
  try { res.status(201).json(await Product.create(req.body)); } catch (e) { next(e); }
});

router.put('/:id', protect, admin, async (req, res, next) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json(p);
  } catch (e) { next(e); }
});

router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed' });
  } catch (e) { next(e); }
});

export default router;
