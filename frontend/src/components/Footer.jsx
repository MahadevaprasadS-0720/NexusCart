import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Headphones, Lock } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ background: '#131921', color: '#e2e8f0', marginTop: 'auto' }}>
      {/* Back to top banner */}
      <div
        onClick={scrollToTop}
        style={{
          background: '#232f3e',
          textAlign: 'center',
          padding: '0.8rem',
          cursor: 'pointer',
          fontSize: '0.88rem',
          fontWeight: '600',
          color: '#ffffff'
        }}
      >
        Back to top ↑
      </div>

      {/* Value props banner */}
      <div style={{ background: '#0f172a', padding: '1.5rem 2rem', borderBottom: '1px solid #1e293b' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
          <div>
            <Truck size={28} color="#febd69" style={{ margin: '0 auto 0.4rem auto' }} />
            <h4 style={{ fontSize: '0.95rem', color: '#fff' }}>Free NexusCart Delivery</h4>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>On orders over ₹499</p>
          </div>
          <div>
            <RotateCcw size={28} color="#febd69" style={{ margin: '0 auto 0.4rem auto' }} />
            <h4 style={{ fontSize: '0.95rem', color: '#fff' }}>10 Days Easy Return</h4>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Hassle free replacement guarantee</p>
          </div>
          <div>
            <Lock size={28} color="#febd69" style={{ margin: '0 auto 0.4rem auto' }} />
            <h4 style={{ fontSize: '0.95rem', color: '#fff' }}>100% Safe Payments</h4>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>UPI, Cards, EMI & COD supported</p>
          </div>
          <div>
            <Headphones size={28} color="#febd69" style={{ margin: '0 auto 0.4rem auto' }} />
            <h4 style={{ fontSize: '0.95rem', color: '#fff' }}>24x7 Customer Support</h4>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Dedicated customer helpline</p>
          </div>
        </div>
      </div>

      {/* Main footer links */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem' }}>
        <div>
          <h4 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1rem' }}>Get to Know Us</h4>
          <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: '#94a3b8', lineHeight: '2' }}>
            <li>About NexusCart</li>
            <li>Careers & Press</li>
            <li>Corporate Responsibility</li>
            <li>NexusCart Prime Marketplace</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1rem' }}>Connect with Us</h4>
          <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: '#94a3b8', lineHeight: '2' }}>
            <li>Facebook</li>
            <li>Twitter / X</li>
            <li>Instagram</li>
            <li>Official Blog</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1rem' }}>Make Money with Us</h4>
          <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: '#94a3b8', lineHeight: '2' }}>
            <li>Sell on NexusCart</li>
            <li>Protect & Build Your Brand</li>
            <li>Become an Affiliate</li>
            <li>Fulfillment by NexusCart</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1rem' }}>Let Us Help You</h4>
          <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: '#94a3b8', lineHeight: '2' }}>
            <li>COVID-19 and Shopping</li>
            <li>Your Account & Orders</li>
            <li>Returns & Refund Center</li>
            <li>100% Purchase Protection</li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div style={{ textAlign: 'center', borderTop: '1px solid #232f3e', padding: '1.5rem', fontSize: '0.82rem', color: '#64748b' }}>
        © 2026 NexusCart Inc. All rights reserved. Your Ultimate Shopping Destination.
      </div>
    </footer>
  );
};

export default Footer;
