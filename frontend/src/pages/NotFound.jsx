import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from 'framer-motion';

const NotFound = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleReturn = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 grid-bg flex flex-col items-center justify-center p-4 relative overflow-hidden text-center">
      {/* Glow Backdrops */}
      <div className="glow-element top-[-150px] right-[-150px] w-[350px] h-[350px] bg-brand-500"></div>
      <div className="glow-element bottom-[-150px] left-[-150px] w-[350px] h-[350px] bg-indigo-500"></div>

      <div className="relative z-10 space-y-6 max-w-lg">
        {/* Animated 404 illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative inline-block"
        >
          <h1 className="text-9xl font-black tracking-tight text-slate-200 dark:text-slate-900 select-none">
            404
          </h1>
          <span className="absolute inset-0 flex items-center justify-center text-5xl">
            🔍
          </span>
        </motion.div>

        {/* Text descriptions */}
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Short URL Not Found
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-light text-sm max-w-sm mx-auto leading-relaxed">
            The short link or alias you entered might have expired, been deleted by its owner, or never existed in our directory.
          </p>
        </div>

        {/* CTA Return button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="pt-4"
        >
          <button
            onClick={handleReturn}
            className="inline-flex items-center space-x-2 px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-semibold text-sm shadow-lg shadow-brand-500/25 hover:shadow-brand-500/35 transition-all -translate-y-0.5 active:translate-y-0"
          >
            <ArrowBackIcon className="w-4 h-4" />
            <span>Return to Safety</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
