import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Lock, Mail, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [searchParams] = useSearchParams();
  const isAdminInitial = searchParams.get('admin') === 'true';

  const [email, setEmail] = useState(isAdminInitial ? 'admin@ecommerce.com' : 'alex@example.com');
  const [password, setPassword] = useState(isAdminInitial ? 'admin123' : 'password123');
  const [loginType, setLoginType] = useState(isAdminInitial ? 'admin' : 'user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const isAdmin = loginType === 'admin';
    const res = await login(email, password, isAdmin);
    setLoading(false);

    if (res.success) {
      if (res.user && res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError(res.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '3.5rem auto', background: '#ffffff', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 25px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.6rem', fontWeight: '800', fontFamily: 'Outfit', color: '#0f172a' }}>
          <ShoppingBag color="#febd69" size={28} /> NexusCart <span style={{ color: '#febd69' }}>Prime</span>
        </div>
        <h2 style={{ fontSize: '1.15rem', fontWeight: '700', marginTop: '0.8rem', color: '#334155' }}>
          {loginType === 'admin' ? 'NexusCart Admin Portal' : 'NexusCart Customer Sign-In'}
        </h2>
      </div>

      {/* Login Type Switcher Tabs */}
      <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '4px', marginBottom: '1.5rem' }}>
        <button
          type="button"
          onClick={() => { setLoginType('user'); setEmail('alex@example.com'); setPassword('password123'); }}
          style={{
            flex: 1,
            padding: '0.55rem',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '700',
            fontSize: '0.85rem',
            cursor: 'pointer',
            background: loginType === 'user' ? '#ffffff' : 'transparent',
            color: loginType === 'user' ? '#0f172a' : '#64748b',
            boxShadow: loginType === 'user' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem'
          }}
        >
          <UserCheck size={16} /> User Login
        </button>
        <button
          type="button"
          onClick={() => { setLoginType('admin'); setEmail('admin@ecommerce.com'); setPassword('admin123'); }}
          style={{
            flex: 1,
            padding: '0.55rem',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '700',
            fontSize: '0.85rem',
            cursor: 'pointer',
            background: loginType === 'admin' ? '#0284c7' : 'transparent',
            color: loginType === 'admin' ? '#ffffff' : '#64748b',
            boxShadow: loginType === 'admin' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem'
          }}
        >
          <ShieldCheck size={16} /> Admin Login
        </button>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.2rem', textAlign: 'center', fontWeight: '600' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Mail size={16} /> {loginType === 'admin' ? 'Admin Email Address' : 'Email Address'}
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={loginType === 'admin' ? 'admin@ecommerce.com' : 'user@example.com'}
            style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.3rem', fontSize: '0.95rem' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Lock size={16} /> Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.3rem', fontSize: '0.95rem' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            background: loginType === 'admin' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'linear-gradient(180deg, #f8e3a0 0%, #eab308 100%)',
            border: loginType === 'admin' ? 'none' : '1px solid #d97706',
            padding: '0.8rem',
            borderRadius: '6px',
            fontWeight: '800',
            fontSize: '1rem',
            color: loginType === 'admin' ? '#ffffff' : '#0f172a',
            cursor: 'pointer',
            marginTop: '0.5rem'
          }}
        >
          {loading ? 'Authenticating...' : loginType === 'admin' ? 'Sign In as Admin' : 'Sign In to NexusCart'}
        </button>

        {/* Quick Demo Pre-fill helper */}
        <div style={{ background: '#f8fafc', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '0.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '0.4rem' }}>Quick Demo Logins:</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => { setLoginType('user'); setEmail('alex@example.com'); setPassword('password123'); }}
              style={{ flex: 1, padding: '4px', fontSize: '0.72rem', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
            >
              Customer Demo
            </button>
            <button
              type="button"
              onClick={() => { setLoginType('admin'); setEmail('admin@ecommerce.com'); setPassword('admin123'); }}
              style={{ flex: 1, padding: '4px', fontSize: '0.72rem', background: '#e0f2fe', border: '1px solid #7dd3fc', color: '#0369a1', borderRadius: '4px', cursor: 'pointer', fontWeight: '700' }}
            >
              Admin Demo
            </button>
          </div>
        </div>
      </form>

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
        New to NexusCart? <Link to="/signup" style={{ color: '#2874f0', fontWeight: '700' }}>Create your account</Link>
      </div>
    </div>
  );
};

export default Login;
