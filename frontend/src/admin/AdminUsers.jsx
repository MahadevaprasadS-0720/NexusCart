import React, { useState, useEffect } from 'react';
import { Users, Shield, User, Key } from 'lucide-react';
import { api } from '../services/api';
import { initialUsers } from '../data/mockData';

const AdminUsers = () => {
  const [users, setUsers] = useState(initialUsers);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.getAllUsers();
      if (res.success && res.users.length > 0) {
        setUsers(res.users);
      }
    } catch (err) {
      setUsers(initialUsers);
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await api.updateUserRole(userId, nextRole);
    } catch (e) {}

    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, role: nextRole } : u))
    );
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff', marginBottom: '1.5rem' }}>
        Registered Marketplace Accounts ({users.length})
      </h2>

      <div className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>USER ID</th>
              <th>NAME</th>
              <th>EMAIL ADDRESS</th>
              <th>ROLE</th>
              <th>ACCOUNT CREATED</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ fontWeight: '700', color: '#38bdf8' }}>{u.id}</td>
                <td style={{ fontWeight: '700' }}>{u.name}</td>
                <td style={{ color: '#cbd5e1' }}>{u.email}</td>
                <td>
                  <span
                    style={{
                      background: u.role === 'admin' ? '#0369a1' : '#334155',
                      color: u.role === 'admin' ? '#38bdf8' : '#e2e8f0',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      textTransform: 'uppercase'
                    }}
                  >
                    {u.role}
                  </span>
                </td>
                <td style={{ color: '#94a3b8' }}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <button
                    onClick={() => handleToggleRole(u.id, u.role)}
                    style={{
                      background: '#334155',
                      color: '#f8fafc',
                      border: 'none',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Set as {u.role === 'admin' ? 'Customer' : 'Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
