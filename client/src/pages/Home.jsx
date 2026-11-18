import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';

const CATEGORIES = ['', 'Electronics', 'Fashion', 'Home'];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const { add } = useCart();

  useEffect(() => {
    const t = setTimeout(() => {
      api.get('/products', { params: { q, category } }).then((r) => setProducts(r.data));
    }, 300); // debounce search
    return () => clearTimeout(t);
  }, [q, category]);

  return (
    <>
      <div className="filters">
        <input placeholder="Search products..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c || 'All categories'}</option>)}
        </select>
      </div>
      <div className="grid">
        {products.map((p) => (
          <div className="card" key={p._id}>
            <Link to={`/product/${p._id}`}><img src={p.image} alt={p.name} /></Link>
            <h3>{p.name}</h3>
            <p className="price">₹{p.price}</p>
            <button disabled={p.countInStock === 0} onClick={() => add(p)}>
              {p.countInStock === 0 ? 'Out of stock' : 'Add to cart'}
            </button>
          </div>
        ))}
        {!products.length && <p>No products found.</p>}
      </div>
    </>
  );
}
