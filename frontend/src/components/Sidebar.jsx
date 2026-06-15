import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

// MUI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import LinkIcon from '@mui/icons-material/Link';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <DashboardIcon className="w-5 h-5" /> },
    { name: 'Profile', path: '/profile', icon: <PersonIcon className="w-5 h-5" /> },
  ];

  const adminLinks = [
    { name: 'Admin Hub', path: '/admin', icon: <AdminPanelSettingsIcon className="w-5 h-5" /> },
    { name: 'Users List', path: '/admin/users', icon: <PeopleIcon className="w-5 h-5" /> },
    { name: 'All Links', path: '/admin/urls', icon: <LinkIcon className="w-5 h-5" /> },
  ];

  const toggleMobileSidebar = () => setIsOpen(!isOpen);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 dark:bg-slate-950 border-r border-slate-800 p-4 w-64">
      {/* Brand Logo */}
      <div className="flex items-center justify-between pb-8 pt-2">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <span className="text-2xl">🔗</span>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            ZipLink
          </span>
        </div>
        <button onClick={toggleMobileSidebar} className="md:hidden text-slate-400 hover:text-white">
          <CloseIcon />
        </button>
      </div>

      {/* Profile Summary Card */}
      <div className="flex items-center space-x-3 bg-slate-800/50 border border-slate-700/30 rounded-xl p-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-violet-500 text-white font-bold">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="truncate">
          <h4 className="text-sm font-semibold truncate text-slate-200">{user?.name}</h4>
          <span className="text-xs text-brand-400 font-medium tracking-wider uppercase">{user?.role}</span>
        </div>
      </div>

      {/* Main Nav Links */}
      <div className="flex-1 space-y-1.5">
        <span className="px-3 text-[10px] font-bold text-slate-500 tracking-widest uppercase">General</span>
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`
            }
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}

        {/* Admin Section (RBAC protected) */}
        {isAdmin && (
          <div className="pt-6 space-y-1.5">
            <span className="px-3 text-[10px] font-bold text-slate-500 tracking-widest uppercase">Admin Operations</span>
            {adminLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`
                }
              >
                {link.icon}
                <span>{link.name}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-slate-800/60 pt-4 space-y-2">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 transition-all text-sm font-medium"
        >
          <div className="flex items-center space-x-3">
            {isDark ? <LightModeIcon className="w-5 h-5" /> : <DarkModeIcon className="w-5 h-5" />}
            <span>Theme Mode</span>
          </div>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md uppercase">
            {isDark ? 'Dark' : 'Light'}
          </span>
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-all text-sm font-medium"
        >
          <LogoutIcon className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Navbar Trigger */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 text-white px-4 py-3 border-b border-slate-800 w-full">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🔗</span>
          <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            ZipLink
          </span>
        </div>
        <button onClick={toggleMobileSidebar} className="text-slate-300 hover:text-white">
          <MenuIcon />
        </button>
      </div>

      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile Modal Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileSidebar}
              className="fixed inset-0 bg-black"
            />
            {/* Sidebar drawer content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative z-10 h-full flex"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
