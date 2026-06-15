import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

// MUI Icons
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      return toast.error('Please enter all required fields.');
    }

    setSubmitting(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      // Fetch express-validator or customized errors formatted by our backend error handler
      const message = err.response?.data?.message || 'Authentication failed. Please verify credentials.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 grid-bg flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Glow Backdrops */}
      <div className="glow-element top-[-150px] right-[-150px] w-[400px] h-[400px] bg-brand-500"></div>
      <div className="glow-element bottom-[-150px] left-[-150px] w-[400px] h-[400px] bg-indigo-500"></div>

      {/* Back button */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors"
      >
        <ArrowBackIcon className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="w-full max-w-md glass-panel rounded-3xl p-8 md:p-10 shadow-2xl border border-slate-200/50 dark:border-slate-800/40 relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🔗</div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-light">
            Sign in to manage your short links and view analytics.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <EmailIcon className="w-5 h-5" />
              </span>
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input !pl-10 bg-slate-100/50 dark:bg-slate-900/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <LockIcon className="w-5 h-5" />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input !pl-10 bg-slate-100/50 dark:bg-slate-900/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Redirect */}
        <div className="text-center mt-8 pt-6 border-t border-slate-200/55 dark:border-slate-800/50 text-sm text-slate-500 dark:text-slate-400">
          <span>Don't have an account? </span>
          <Link to="/signup" className="text-brand-500 font-semibold hover:underline">
            Register Here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
