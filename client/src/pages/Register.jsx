import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const nav = useNavigate();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try { await register(f.name, f.email, f.password); nav('/'); } catch (err) { setError(errMsg(err)); }
  };

  return (
    <form className="form" onSubmit={submit}>
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <input placeholder="Name" value={f.name} onChange={set('name')} required />
      <input type="email" placeholder="Email" value={f.email} onChange={set('email')} required />
      <input type="password" placeholder="Password (min 6)" minLength={6} value={f.password} onChange={set('password')} required />
      <button>Create account</button>
    </form>
  );
}
