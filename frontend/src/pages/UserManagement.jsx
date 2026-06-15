import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { SkeletonRow } from '../components/Skeleton';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShieldIcon from '@mui/icons-material/Shield';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { motion } from 'framer-motion';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load registered users database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const s = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(s) ||
      u.email.toLowerCase().includes(s) ||
      u.role.toLowerCase().includes(s)
    );
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Sidebar />

      {/* Main panel */}
      <main className="flex-1 p-6 md:p-10 relative z-10 max-w-7xl mx-auto w-full">
        {/* Glow Element */}
        <div className="glow-element top-[-50px] right-[-50px] w-[300px] h-[300px] bg-violet-600"></div>

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              User Management
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-light mt-1">
              Analyze all registered platform users, view their role parameters and link generation activity.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
              <SearchIcon className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search user name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input !pl-10 bg-white dark:bg-slate-900/50"
            />
          </div>
        </header>

        {/* Users list table card */}
        <section className="glass-panel rounded-3xl p-6 md:p-8">
          {loading ? (
            <div className="space-y-4">
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <span className="text-4xl">👥</span>
              <h4 className="text-lg font-bold mt-4">No users found</h4>
              <p className="text-sm font-light mt-1">Refine your search parameters and try again.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase">
                    <th className="py-4">User Details</th>
                    <th className="py-4">Email Address</th>
                    <th className="py-4">Access Role</th>
                    <th className="py-4">Date Joined</th>
                    <th className="py-4 text-center">Short Links</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-850 text-sm">
                  {filteredUsers.map((userObj) => (
                    <tr key={userObj.id} className="hover:bg-slate-100/30 dark:hover:bg-slate-900/10">
                      {/* Name & Avatar */}
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 text-white text-xs font-bold shadow-sm">
                            {userObj.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">{userObj.name}</span>
                            <span className="text-[10px] text-slate-400 block font-mono">ID: {userObj.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 text-slate-600 dark:text-slate-400 font-mono text-xs">
                        <div className="flex items-center space-x-1">
                          <AlternateEmailIcon className="w-3.5 h-3.5 opacity-60" />
                          <span>{userObj.email}</span>
                        </div>
                      </td>

                      {/* Role indicator */}
                      <td className="py-4">
                        <span
                          className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full ${
                            userObj.role === 'ADMIN'
                              ? 'bg-violet-50 text-violet-600 dark:bg-violet-950/20 dark:text-violet-400'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400'
                          }`}
                        >
                          {userObj.role}
                        </span>
                      </td>

                      {/* Date joined */}
                      <td className="py-4 text-slate-500 text-xs">
                        <div className="flex items-center space-x-1">
                          <CalendarMonthIcon className="w-3.5 h-3.5 opacity-60" />
                          <span>{new Date(userObj.created_at).toLocaleDateString()}</span>
                        </div>
                      </td>

                      {/* Links count */}
                      <td className="py-4 text-center font-bold text-slate-800 dark:text-slate-200">
                        {userObj.url_count || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default UserManagement;
