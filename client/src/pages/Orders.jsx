import { useEffect, useState } from 'react';
import api from '../api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { api.get('/orders/mine').then((r) => setOrders(r.data)); }, []);

  return (
    <>
      <h2>My Orders</h2>
      {!orders.length && <p>No orders yet.</p>}
      {orders.map((o) => (
        <div className="card order" key={o._id}>
          <b>#{o._id.slice(-6)}</b> · {new Date(o.createdAt).toLocaleDateString()} · <span className={`badge ${o.status}`}>{o.status}</span>
          <ul>{o.items.map((i) => <li key={i.product}>{i.name} × {i.qty} — ₹{i.price * i.qty}</li>)}</ul>
          <b>Total: ₹{o.total}</b>
        </div>
      ))}
    </>
  );
}
