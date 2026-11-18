import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, setQty, remove, clear, total } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();

  const checkout = async () => {
    if (!user) return nav('/login');
    try {
      await api.post('/orders', { items: items.map((i) => ({ product: i._id, qty: i.qty })), address });
      clear();
      nav('/orders');
    } catch (e) { setError(errMsg(e)); }
  };

  if (!items.length) return <p>Your cart is empty. <Link to="/">Go shopping</Link></p>;

  return (
    <>
      <h2>Shopping Cart</h2>
      <table>
        <thead><tr><th>Item</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr></thead>
        <tbody>
          {items.map((i) => (
            <tr key={i._id}>
              <td>{i.name}</td>
              <td>₹{i.price}</td>
              <td>
                <input type="number" min="1" max={i.countInStock} value={i.qty} style={{ width: 60 }}
                  onChange={(e) => setQty(i._id, Math.max(1, Math.min(+e.target.value, i.countInStock)))} />
              </td>
              <td>₹{i.price * i.qty}</td>
              <td><button className="danger" onClick={() => remove(i._id)}>✕</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Total: ₹{total}</h3>
      <textarea placeholder="Shipping address" value={address} onChange={(e) => setAddress(e.target.value)} />
      {error && <p className="error">{error}</p>}
      <button onClick={checkout}>Place Order</button>
    </>
  );
}
