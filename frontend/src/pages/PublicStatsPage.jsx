import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LinkIcon from '@mui/icons-material/Link';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimerIcon from '@mui/icons-material/Timer';
import TimerOffIcon from '@mui/icons-material/TimerOff';
import { motion } from 'framer-motion';

const PublicStatsPage = () => {
  const { shortCode } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicStats = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/public/stats/${shortCode}`);
        setData(res.data.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Link details could not be found.');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicStats();
  }, [shortCode]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 grid-bg flex flex-col justify-center items-center p-4 relative overflow-hidden text-center">
      {/* Glow Backdrops */}
      <div className="glow-element top-[-150px] right-[-150px] w-[350px] h-[350px] bg-brand-500"></div>
      <div className="glow-element bottom-[-150px] left-[-150px] w-[350px] h-[350px] bg-indigo-500"></div>

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
        className="w-full max-w-lg glass-panel rounded-3xl p-8 md:p-10 shadow-2xl border border-slate-200/50 dark:border-slate-800/40 relative z-10"
      >
        {loading ? (
          <div className="flex flex-col items-center py-10">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent mb-4"></div>
            <p className="text-sm text-slate-500">Retrieving link parameters...</p>
          </div>
        ) : error ? (
          <div className="space-y-6">
            <span className="text-4xl">❌</span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Lookup Failed</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-light">{error}</p>
            <Link
              to="/"
              className="inline-block px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold"
            >
              Search Another Link
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header info */}
            <div>
              <span className="text-4xl">🔗</span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">Public Redirect Details</h2>
              <p className="text-sm text-brand-500 font-bold mt-1">/{data.short_code}</p>
            </div>

            {/* Metrics parameters grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Click count */}
              <div className="bg-slate-100/55 dark:bg-slate-900/40 border border-slate-200/30 dark:border-slate-800/30 p-4 rounded-2xl flex flex-col justify-center">
                <div className="text-slate-400 flex justify-center mb-1"><BarChartIcon className="w-5 h-5" /></div>
                <span className="text-xs text-slate-400 font-medium">Click Count</span>
                <span className="text-xl font-extrabold text-slate-800 dark:text-white mt-1">{data.click_count}</span>
              </div>

              {/* Status */}
              <div className="bg-slate-100/55 dark:bg-slate-900/40 border border-slate-200/30 dark:border-slate-800/30 p-4 rounded-2xl flex flex-col justify-center">
                <div className="text-slate-400 flex justify-center mb-1">
                  {data.expires_at && new Date(data.expires_at) <= new Date() ? <TimerOffIcon className="w-5 h-5 text-rose-500" /> : <TimerIcon className="w-5 h-5 text-emerald-500" />}
                </div>
                <span className="text-xs text-slate-400 font-medium">Status</span>
                <span className={`text-xs font-bold mt-2 py-0.5 rounded-full inline-block ${data.expires_at && new Date(data.expires_at) <= new Date() ? 'text-rose-600 bg-rose-500/10' : 'text-emerald-600 bg-emerald-500/10'}`}>
                  {data.expires_at && new Date(data.expires_at) <= new Date() ? 'EXPIRED' : 'ACTIVE'}
                </span>
              </div>
            </div>

            {/* Destination parameters */}
            <div className="text-left space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Destination URL</span>
                <a
                  href={data.original_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-brand-600 dark:text-brand-400 break-all hover:underline block mt-1"
                >
                  {data.original_url}
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Created Date</span>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-350 block mt-1">
                    {new Date(data.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Expiration Date</span>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-355 block mt-1">
                    {data.expires_at ? new Date(data.expires_at).toLocaleDateString() : 'Never'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PublicStatsPage;
