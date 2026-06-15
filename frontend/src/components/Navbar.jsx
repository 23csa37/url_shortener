import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// MUI Icons
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/70 border-b border-slate-200/50 backdrop-blur-md dark:bg-slate-950/70 dark:border-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-2xl">🔗</span>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent dark:from-brand-400 dark:to-violet-400">
              ZipLink
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 transition-colors">
              Features
            </a>
            <a href="#stats-check" className="text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 transition-colors">
              Public Lookup
            </a>
            <a href="file:///c:/Users/arulp/OneDrive/Desktop/url_project/api-documentation.md" target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 transition-colors">
              API Docs
            </a>
          </div>

          {/* User actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all"
              aria-label="Toggle Theme"
            >
              {isDark ? <LightModeIcon className="w-5 h-5" /> : <DarkModeIcon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/dashboard"
                  className="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl text-sm font-medium transition-all"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl text-sm font-medium transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl"
            >
              {isDark ? <LightModeIcon className="w-5 h-5" /> : <DarkModeIcon className="w-5 h-5" />}
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl"
            >
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 px-4 py-4 space-y-3">
          <a
            href="#features"
            onClick={() => setIsOpen(false)}
            className="block text-slate-700 dark:text-slate-300 font-medium py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            Features
          </a>
          <a
            href="#stats-check"
            onClick={() => setIsOpen(false)}
            className="block text-slate-700 dark:text-slate-300 font-medium py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            Public Lookup
          </a>
          <a
            href="file:///c:/Users/arulp/OneDrive/Desktop/url_project/api-documentation.md"
            target="_blank"
            rel="noreferrer"
            className="block text-slate-700 dark:text-slate-300 font-medium py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            API Docs
          </a>
          <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex flex-col space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full text-center px-4 py-2.5 text-rose-500 bg-rose-50 dark:bg-rose-950/20 rounded-xl text-sm font-medium"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center px-4 py-2.5 border border-slate-200 dark:border-slate-850 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
