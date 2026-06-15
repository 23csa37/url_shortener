import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { SkeletonChart, SkeletonCard, SkeletonRow } from '../components/Skeleton';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { Line, Doughnut } from 'react-chartjs-2';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { motion } from 'framer-motion';

// Register Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const { urlId } = useParams();

  // State
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      // Execute parallel calls
      const [statsRes, trendsRes] = await Promise.all([
        api.get(`/analytics/${urlId}`),
        api.get(`/analytics/trends/${urlId}`)
      ]);

      setStats(statsRes.data.data);
      setTrends(trendsRes.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load link analytics data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [urlId]);

  // Chart 1: Daily Click Trends (Line)
  const lineChartData = {
    labels: trends.map((t) => t.date),
    datasets: [
      {
        label: 'Clicks',
        data: trends.map((t) => parseInt(t.count)),
        borderColor: '#8b5cf6', // brand-500
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#fff',
        pointHoverRadius: 6
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  };

  // Chart 2: Browser split (Doughnut)
  const browserLabels = stats?.browsers?.map((b) => b.browser) || [];
  const browserData = stats?.browsers?.map((b) => parseInt(b.count)) || [];
  
  const browserChartData = {
    labels: browserLabels,
    datasets: [
      {
        data: browserData,
        backgroundColor: [
          '#8b5cf6', // Indigo
          '#3b82f6', // Blue
          '#10b981', // Emerald
          '#f59e0b', // Amber
          '#ec4899', // Pink
          '#64748b'  // Slate
        ],
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
      }
    ]
  };

  // Chart 3: Device split (Doughnut)
  const deviceLabels = stats?.devices?.map((d) => d.device_type) || [];
  const deviceData = stats?.devices?.map((d) => parseInt(d.count)) || [];

  const deviceChartData = {
    labels: deviceLabels,
    datasets: [
      {
        data: deviceData,
        backgroundColor: [
          '#10b981', // Emerald
          '#8b5cf6', // Violet
          '#f59e0b'  // Amber
        ],
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 15,
          font: { size: 11 }
        }
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Sidebar />

      {/* Viewport */}
      <main className="flex-1 p-6 md:p-10 relative z-10 max-w-7xl mx-auto w-full">
        {/* Glow Element */}
        <div className="glow-element top-[-50px] right-[-50px] w-[350px] h-[350px] bg-brand-500"></div>

        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            <ArrowBackIcon className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <SkeletonChart />
          </div>
        ) : !stats ? (
          <div className="text-center py-20 text-slate-500">
            <h4 className="text-lg font-bold">Analytics not found</h4>
            <p className="text-sm font-light mt-1">This link might not exist or you lack ownership permissions.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header info */}
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Link Analytics
              </h1>
              <p className="text-sm text-brand-600 dark:text-brand-400 font-bold mt-1.5 flex items-center space-x-2">
                <span>/{stats.short_code}</span>
                <span className="text-slate-400 font-light">redirects to</span>
                <a href={stats.original_url} target="_blank" rel="noreferrer" className="underline truncate max-w-md hover:text-brand-700">
                  {stats.original_url}
                </a>
              </p>
            </div>

            {/* Quick Metrics */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total clicks */}
              <div className="glass-panel p-6 rounded-3xl">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Redirects</span>
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{stats.click_count}</h3>
              </div>

              {/* Created Date */}
              <div className="glass-panel p-6 rounded-3xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Created Date</span>
                  <h3 className="text-lg font-bold text-slate-950 dark:text-white mt-2">
                    {new Date(stats.created_at).toLocaleDateString()}
                  </h3>
                </div>
                <CalendarMonthIcon className="text-brand-500 w-8 h-8 opacity-70" />
              </div>

              {/* Last Visited */}
              <div className="glass-panel p-6 rounded-3xl">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Visited</span>
                <h3 className="text-lg font-bold text-slate-950 dark:text-white mt-2">
                  {stats.last_visited ? new Date(stats.last_visited).toLocaleString() : 'No clicks logged yet'}
                </h3>
              </div>
            </section>

            {/* Daily Trends and QR */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Line chart container */}
              <div className="glass-panel p-6 rounded-3xl lg:col-span-2 flex flex-col">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">Daily Redirect Trends</h3>
                <div className="flex-1 min-h-[300px] relative">
                  {trends.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-light">
                      No redirection history logged.
                    </div>
                  ) : (
                    <Line data={lineChartData} options={lineChartOptions} />
                  )}
                </div>
              </div>

              {/* QR Code static panel */}
              <div className="glass-panel p-6 rounded-3xl flex flex-col justify-center items-center text-center">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Share Link QR Code</h3>
                {stats.qr_code ? (
                  <div className="space-y-4">
                    <div className="bg-white p-3 rounded-2xl inline-block shadow-inner">
                      <img src={stats.qr_code} alt="QR Code" className="w-40 h-40 mx-auto" />
                    </div>
                    <a
                      href={stats.qr_code}
                      download={`qrcode-${stats.short_code}.png`}
                      className="block px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold text-xs transition-all"
                    >
                      Save QR Image
                    </a>
                  </div>
                ) : (
                  <span className="text-slate-400 text-sm">QR Code not available.</span>
                )}
              </div>
            </section>

            {/* Pie splits and Visitor Telemetry */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Browser split doughnut */}
              <div className="glass-panel p-6 rounded-3xl">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">Browsers Share</h3>
                <div className="h-[250px]">
                  {browserData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-400 font-light">
                      No browser metrics.
                    </div>
                  ) : (
                    <Doughnut data={browserChartData} options={doughnutOptions} />
                  )}
                </div>
              </div>

              {/* Device split doughnut */}
              <div className="glass-panel p-6 rounded-3xl">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">Devices Share</h3>
                <div className="h-[250px]">
                  {deviceData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-400 font-light">
                      No device metrics.
                    </div>
                  ) : (
                    <Doughnut data={deviceChartData} options={doughnutOptions} />
                  )}
                </div>
              </div>

              {/* Recent Click logs */}
              <div className="glass-panel p-6 rounded-3xl">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Recent Visits</h3>
                <div className="overflow-y-auto max-h-[250px] pr-1 space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
                  {stats.recent_visits?.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 font-light text-sm">No recent visits logged.</div>
                  ) : (
                    stats.recent_visits?.map((visit, i) => (
                      <div key={visit.id} className={`pt-3 flex flex-col ${i === 0 ? 'border-none' : ''}`}>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{visit.ip_address}</span>
                          <span className="text-slate-400">{new Date(visit.visited_at).toLocaleTimeString()}</span>
                        </div>
                        <div className="flex space-x-2 mt-1.5 text-[11px] text-brand-600 font-medium">
                          <span className="bg-brand-500/10 px-1.5 py-0.5 rounded">{visit.browser}</span>
                          <span className="bg-indigo-500/10 px-1.5 py-0.5 rounded">{visit.device_type}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default Analytics;
