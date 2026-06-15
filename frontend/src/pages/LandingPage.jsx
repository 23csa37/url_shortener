import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AssessmentIcon from '@mui/icons-material/Assessment';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import BoltIcon from '@mui/icons-material/Bolt';
import ShieldIcon from '@mui/icons-material/Shield';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();
  const [lookupCode, setLookupCode] = useState('');

  const handleLookup = (e) => {
    e.preventDefault();
    if (!lookupCode.trim()) return;

    // Handle full URLs pasted or just code
    let code = lookupCode.trim();
    if (code.includes('/')) {
      const parts = code.split('/');
      code = parts[parts.length - 1] || parts[parts.length - 2];
    }
    
    navigate(`/stats/${code}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 grid-bg relative overflow-x-hidden flex flex-col">
      {/* Background glow elements */}
      <div className="glow-element top-[-100px] left-[-100px] w-[350px] h-[350px] bg-brand-500"></div>
      <div className="glow-element top-[400px] right-[-100px] w-[400px] h-[400px] bg-indigo-500"></div>

      <Navbar />

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center relative z-10 flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 bg-brand-500/10 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-wide"
        >
          <BoltIcon className="w-4 h-4" />
          <span>Real-time link analytics tool</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6"
        >
          Shorten Links. <br />
          <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-brand-400 dark:to-violet-400">
            Track Clicks Live.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-light"
        >
          ZipLink is the premium SaaS URL shortener built for developers and marketing teams. Generate smart links, custom aliases, QR codes, and monitor redirection analytics instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-20"
        >
          <button
            onClick={() => navigate('/signup')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl text-base font-medium shadow-lg shadow-brand-500/20 hover:shadow-brand-500/35 -translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <span>Start Shortening Free</span>
            <ArrowForwardIcon className="w-4 h-4" />
          </button>
          <a
            href="#stats-check"
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/80 dark:border-slate-800 dark:text-slate-200 rounded-2xl text-base font-medium transition-all text-center"
          >
            Public Link Lookup
          </a>
        </motion.div>
      </header>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            Packed with Enterprise Features
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-xl mx-auto font-light">
            Everything you need to configure redirect endpoints, track performance, and engage customers.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Card 1 */}
          <motion.div variants={itemVariants} className="glass-panel glass-panel-hover p-6 rounded-3xl">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400 flex items-center justify-center mb-5">
              <BoltIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Instant Redirects</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-light">
              Powered by native database mapping to ensure ultra-low latency redirection globally.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={itemVariants} className="glass-panel glass-panel-hover p-6 rounded-3xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 flex items-center justify-center mb-5">
              <QrCode2Icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">QR Code Generation</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-light">
              Generate pixel-perfect downloadable QR codes instantly for any shortened destination link.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={itemVariants} className="glass-panel glass-panel-hover p-6 rounded-3xl">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400 flex items-center justify-center mb-5">
              <AssessmentIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Live Tracking</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-light">
              Websocket channels stream telemetry live browser/device details to your dashboard.
            </p>
          </motion.div>

          {/* Card 4 */}
          <motion.div variants={itemVariants} className="glass-panel glass-panel-hover p-6 rounded-3xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center mb-5">
              <ShieldIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">RBAC Security</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-light">
              Restricted owner lookups combined with comprehensive administrator safety blocks.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Public Search Lookup Section */}
      <section id="stats-check" className="max-w-3xl mx-auto px-4 sm:px-6 py-20 relative z-10 w-full">
        <div className="glass-panel rounded-3xl p-8 md:p-12 border border-brand-500/20 dark:border-brand-500/10 shadow-2xl">
          <div className="text-center mb-8">
            <span className="text-3xl">📊</span>
            <h2 className="text-2xl md:text-3xl font-extrabold mt-3 text-slate-900 dark:text-white">
              Public Redirect Lookup
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 font-light">
              Check redirect statistics, safety status, and configuration details for any shortcode.
            </p>
          </div>

          <form onSubmit={handleLookup} className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <input
              type="text"
              required
              placeholder="Enter short code or full link (e.g. expgh)"
              value={lookupCode}
              onChange={(e) => setLookupCode(e.target.value)}
              className="flex-1 glass-input focus:ring-2 focus:ring-brand-500 bg-white/50 dark:bg-slate-900/50"
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-semibold text-sm transition-all shadow-md shadow-brand-500/25 shrink-0"
            >
              Analyze Link
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/55 py-8 text-center text-xs text-slate-500 dark:border-slate-900 dark:text-slate-600 mt-auto bg-white/30 dark:bg-slate-950/30">
        <p className="mb-2">© 2026 ZipLink Platform. All rights reserved.</p>
        <p>This project is a part of a hackathon run by <a href="https://katomaran.com" target="_blank" rel="noreferrer" className="underline hover:text-brand-500">https://katomaran.com</a></p>
      </footer>
    </div>
  );
};

export default LandingPage;
