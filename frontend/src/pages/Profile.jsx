import React from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShieldIcon from '@mui/icons-material/Shield';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Sidebar />

      {/* Main Panel */}
      <main className="flex-1 p-6 md:p-10 relative z-10 max-w-7xl mx-auto w-full">
        {/* Glow Element */}
        <div className="glow-element top-[-50px] right-[-50px] w-[300px] h-[300px] bg-brand-500"></div>

        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            User Profile
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-light mt-1">
            Manage your account credentials, security levels, and display preferences.
          </p>
        </header>

        {/* Profile Card details */}
        <section className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 rounded-3xl"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-slate-200/55 dark:border-slate-800/55 mb-6 text-center sm:text-left">
              <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-600 to-violet-600 text-white font-extrabold text-3xl shadow-lg shadow-brand-500/20">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
                <div className="inline-block text-xs font-semibold text-brand-700 bg-brand-500/10 dark:text-brand-400 px-3 py-1 rounded-full uppercase tracking-wider">
                  {user?.role} ACCOUNT
                </div>
              </div>
            </div>

            {/* Profile fields details grid */}
            <div className="space-y-6">
              {/* Field 1: Name */}
              <div className="flex items-center space-x-4">
                <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl text-slate-400 shrink-0">
                  <PersonIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Display Name</span>
                  <p className="text-base font-medium text-slate-900 dark:text-slate-100 mt-0.5">{user?.name}</p>
                </div>
              </div>

              {/* Field 2: Email */}
              <div className="flex items-center space-x-4">
                <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl text-slate-400 shrink-0">
                  <AlternateEmailIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</span>
                  <p className="text-base font-medium text-slate-900 dark:text-slate-100 mt-0.5">{user?.email}</p>
                </div>
              </div>

              {/* Field 3: Permissions */}
              <div className="flex items-center space-x-4">
                <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl text-slate-400 shrink-0">
                  <ShieldIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Access Scope</span>
                  <p className="text-base font-medium text-slate-900 dark:text-slate-100 mt-0.5">
                    {user?.role === 'ADMIN'
                      ? 'Global Platform Read-Write Administration privileges'
                      : 'Personal URL Creation and analytics read access'}
                  </p>
                </div>
              </div>

              {/* Field 4: Registration date */}
              <div className="flex items-center space-x-4">
                <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl text-slate-400 shrink-0">
                  <CalendarMonthIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Date Registered</span>
                  <p className="text-base font-medium text-slate-900 dark:text-slate-100 mt-0.5">
                    {user?.created_at ? new Date(user.created_at).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Field 5: Display Preference */}
              <div className="pt-6 border-t border-slate-200/55 dark:border-slate-800/55 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Toggle Theme Mode</h4>
                  <span className="text-xs text-slate-400 font-light mt-0.5 block">Choose light or dark visual layouts.</span>
                </div>
                <button
                  onClick={toggleTheme}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-200 hover:bg-slate-350 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all shadow"
                >
                  {isDark ? <LightModeIcon className="w-4 h-4" /> : <DarkModeIcon className="w-4 h-4" />}
                  <span>Switch to {isDark ? 'Light' : 'Dark'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default Profile;
