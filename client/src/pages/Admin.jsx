import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';

const empty = { name: '', price: '', category: '', countInStock: '', image: '', description: '' };

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    api.get('/products').then((r) => setProducts(r.data));
    api.get('/orders').then((r) => setOrders(r.data));
  };
  useEffect(load, []);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    const body = { ...form, price: +form.price, countInStock: +form.countInStock };
    try {
      editId ? await api.put(`/products/${editId}`, body) : await api.post('/products', body);
      setForm(empty); setEditId(null); setError(''); load();
    } catch (err) { setError(errMsg(err)); }
  };
  const edit = (p) => { setEditId(p._id); setForm(p); window.scrollTo(0, 0); };
  const del = async (id) => { if (confirm('Delete product?')) { await api.delete(`/products/${id}`); load(); } };
  const status = async (id, s) => { await api.put(`/orders/${id}/status`, { status: s }); load(); };

  return (
    <>
      <h2>Admin Dashboard</h2>
      <form className="form wide" onSubmit={save}>
        <h3>{editId ? 'Edit product' : 'Add product'}</h3>
        {error && <p className="error">{error}</p>}
        <input placeholder="Name" value={form.name} onChange={set('name')} required />
        <input type="number" placeholder="Price" value={form.price} onChange={set('price')} required />
        <input placeholder="Category" value={form.category} onChange={set('category')} />
        <input type="number" placeholder="Stock" value={form.countInStock} onChange={set('countInStock')} />
        <input placeholder="Image URL" value={form.image} onChange={set('image')} />
        <textarea placeholder="Description" value={form.description} onChange={set('description')} />
        <button>{editId ? 'Update' : 'Add'}</button>
      </form>

      <h3>Products</h3>
      <table>
        <thead><tr><th>Name</th><th>Price</th><th>Stock</th><th></th></tr></thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td><td>₹{p.price}</td><td>{p.countInStock}</td>
              <td><button onClick={() => edit(p)}>Edit</button> <button className="danger" onClick={() => del(p._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>All Orders</h3>
      <table>
        <thead><tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>#{o._id.slice(-6)}</td><td>{o.user?.name}</td><td>₹{o.total}</td>
              <td>
                <select value={o.status} onChange={(e) => status(o._id, e.target.value)}>
                  {['Pending', 'Shipped', 'Delivered', 'Cancelled'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
