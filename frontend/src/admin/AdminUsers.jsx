import React, { useState, useEffect } from 'react';
import { Users, Shield, User, Key, CheckCircle, RefreshCw, Search, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { initialUsers } from '../data/mockData';

const AdminUsers = () => {
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.getAllUsers();
      if (res.success && res.users && res.users.length > 0) {
        setUsers(res.users);
      }
    } catch (err) {
      setUsers(initialUsers);
    } finally {
      setLoading(false);
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
    setStatusMsg(`✅ Role for user ${userId} changed to "${nextRole.toUpperCase()}"!`);
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const filteredUsers = users.filter(u => {
    const name = (u.name || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const id = (u.id || '').toLowerCase();
    return name.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase()) || id.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 font-['Inter']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-['Outfit']">
            Customer & Admin Accounts ({users.length})
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Cloud Firestore authenticated users and permission access controls
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="neu-btn px-4 py-2.5 rounded-2xl text-xs font-black text-slate-700 hover:text-amber-600 flex items-center gap-2 cursor-pointer transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 text-amber-500 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Users</span>
        </button>
      </div>

      {/* Notification Toast */}
      {statusMsg && (
        <div className="neu-card p-4 rounded-2xl text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 shadow-sm">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="neu-card p-4 rounded-3xl flex items-center justify-between">
        <div className="w-full md:w-80 neu-input flex items-center px-3 py-2">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search by name, email, or user ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="neu-card p-6 rounded-3xl overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-300/80 text-[11px] font-black text-slate-500 uppercase tracking-wider">
              <th className="pb-3 px-3">User</th>
              <th className="pb-3 px-3">User ID</th>
              <th className="pb-3 px-3">Email Address</th>
              <th className="pb-3 px-3">Current Role</th>
              <th className="pb-3 px-3">Registered Date</th>
              <th className="pb-3 px-3 text-right">Access Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs font-semibold">
            {filteredUsers.map(u => (
              <tr key={u.id} className="hover:bg-slate-100/50 transition-colors">
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl neu-btn-circle bg-amber-500 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                      {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900">{u.name}</div>
                      <div className="text-[10px] text-slate-400">Verified Customer</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3 font-mono font-bold text-amber-600">{u.id}</td>
                <td className="py-3.5 px-3 text-slate-700">{u.email}</td>
                <td className="py-3.5 px-3">
                  <span
                    className={`neu-badge px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                      u.role === 'admin' ? 'text-sky-700 bg-sky-50' : 'text-slate-600'
                    }`}
                  >
                    {u.role || 'user'}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-slate-500">
                  {new Date(u.createdAt || Date.now()).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </td>
                <td className="py-3.5 px-3 text-right">
                  <button
                    onClick={() => handleToggleRole(u.id, u.role)}
                    className="neu-btn px-4 py-2 rounded-xl text-xs font-black text-slate-800 hover:text-amber-600 transition-all cursor-pointer"
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
