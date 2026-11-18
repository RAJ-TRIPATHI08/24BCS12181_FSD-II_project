import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const nav = useNavigate();

  useEffect(() => { api.get(`/products/${id}`).then((r) => setP(r.data)).catch(() => nav('/')); }, [id]);
  if (!p) return <p>Loading...</p>;

  return (
    <div className="detail">
      <img src={p.image} alt={p.name} />
      <div>
        <h2>{p.name}</h2>
        <p className="price">₹{p.price}</p>
        <p>{p.description}</p>
        <p>Category: {p.category} | In stock: {p.countInStock}</p>
        {p.countInStock > 0 && (
          <>
            <select value={qty} onChange={(e) => setQty(+e.target.value)}>
              {[...Array(Math.min(p.countInStock, 10)).keys()].map((n) => <option key={n + 1}>{n + 1}</option>)}
            </select>{' '}
            <button onClick={() => { add(p, qty); nav('/cart'); }}>Add to cart</button>
          </>
        )}
      </div>
    </div>
  );
}
