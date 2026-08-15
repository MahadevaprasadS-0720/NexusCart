import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const res = await signup(name, email, password, role);
    setLoading(false);

    if (res.success) {
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError(res.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '3.5rem auto', background: '#ffffff', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 25px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.6rem', fontWeight: '800', fontFamily: 'Outfit', color: '#0f172a' }}>
          <ShoppingBag color="#febd69" size={28} /> NexusCart <span style={{ color: '#febd69' }}>Prime</span>
        </div>
        <h2 style={{ fontSize: '1.15rem', fontWeight: '700', marginTop: '0.8rem', color: '#334155' }}>
          Create Your NexusCart Account
        </h2>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.2rem', textAlign: 'center', fontWeight: '600' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <User size={16} /> Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.3rem', fontSize: '0.95rem' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Mail size={16} /> Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.3rem', fontSize: '0.95rem' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Lock size={16} /> Password (Min 6 characters)
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.3rem', fontSize: '0.95rem' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.4rem', display: 'block' }}>
            Account Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: '600', background: '#f8fafc' }}
          >
            <option value="user">Regular Customer (User)</option>
            <option value="admin">Store Administrator (Admin)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            background: 'linear-gradient(180deg, #f8e3a0 0%, #eab308 100%)',
            border: '1px solid #d97706',
            padding: '0.8rem',
            borderRadius: '6px',
            fontWeight: '800',
            fontSize: '1rem',
            color: '#0f172a',
            cursor: 'pointer',
            marginTop: '0.5rem'
          }}
        >
          {loading ? 'Creating Account...' : 'Sign Up & Create Account'}
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
        Already have a NexusCart account? <Link to="/login" style={{ color: '#2874f0', fontWeight: '700' }}>Sign in here</Link>
      </div>
    </div>
  );
};

export default Signup;
