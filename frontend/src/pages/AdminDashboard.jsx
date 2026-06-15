import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { SkeletonCard, SkeletonChart, SkeletonRow } from '../components/Skeleton';
import api from '../services/api';
import { getSocket, joinRoom, leaveRoom } from '../services/socket';
import { toast } from 'react-hot-toast';
import { Line, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';

// MUI Icons
import PeopleIcon from '@mui/icons-material/People';
import LinkIcon from '@mui/icons-material/Link';
import BarChartIcon from '@mui/icons-material/BarChart';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// Register ChartJS
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch admin stats
  const fetchData = async () => {
    try {
      const [statsRes, insightsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/insights')
      ]);
      setStats(statsRes.data.data);
      setInsights(insightsRes.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load admin metrics data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // WebSocket Admin Activity Monitor
    joinRoom('admin');
    const socket = getSocket();
    
    socket.on('visit_logged', (visitData) => {
      // Append visit details to the live activity feed list
      setInsights((prev) => {
        if (!prev) return prev;
        
        const newFeed = [
          {
            id: visitData.id,
            visited_at: visitData.visited_at,
            ip_address: visitData.ip_address,
            browser: visitData.browser,
            device_type: visitData.device_type,
            short_code: visitData.short_code,
            original_url: visitData.original_url
          },
          ...prev.liveFeed.slice(0, 19) // Keep last 20
        ];

        // Increment stats clicks counts in real time
        setStats((prevStats) => {
          if (!prevStats) return prevStats;
          return {
            ...prevStats,
            totalClicks: prevStats.totalClicks + 1
          };
        });

        return {
          ...prev,
          liveFeed: newFeed
        };
      });

      toast(`⚡ Live Click: Redirection /${visitData.short_code} occurred`, {
        icon: '🔔',
        style: {
          borderRadius: '16px',
          background: '#4c1d95',
          color: '#fff',
        },
      });
    });

    return () => {
      socket.off('visit_logged');
      leaveRoom('admin');
    };
  }, []);

  // Charts parameters
  const lineChartData = {
    labels: insights?.dailyTrends?.map((t) => t.date) || [],
    datasets: [
      {
        label: 'Platform Clicks',
        data: insights?.dailyTrends?.map((t) => parseInt(t.count)) || [],
        borderColor: '#a78bfa',
        backgroundColor: 'rgba(167, 139, 250, 0.15)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#a78bfa',
        pointBorderColor: '#fff'
      }
    ]
  };

  const deviceChartData = {
    labels: insights?.devices?.map((d) => d.device_type) || [],
    datasets: [
      {
        data: insights?.devices?.map((d) => parseInt(d.count)) || [],
        backgroundColor: ['#10b981', '#6366f1', '#f59e0b'],
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
      }
    ]
  };

  const browserChartData = {
    labels: insights?.browsers?.map((b) => b.browser) || [],
    datasets: [
      {
        data: insights?.browsers?.map((b) => parseInt(b.count)) || [],
        backgroundColor: ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#64748b'],
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 10, padding: 10, font: { size: 10 } }
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Sidebar />

      {/* Main admin viewport */}
      <main className="flex-1 p-6 md:p-10 relative z-10 max-w-7xl mx-auto w-full">
        {/* Glow Element */}
        <div className="glow-element top-[-50px] right-[-50px] w-[350px] h-[350px] bg-violet-600"></div>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Admin Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
              Platform Admin
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-light mt-1">
            Monitor deployments metrics, view users databases, investigate URLs, and track server click-traffic feeds.
          </p>
        </header>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <SkeletonChart />
          </div>
        ) : (
          <div className="space-y-10">
            {/* Platform metrics grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel p-6 rounded-3xl flex justify-between items-center">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Users</span>
                  <h3 className="text-3xl font-extrabold mt-1 text-slate-950 dark:text-white">{stats?.totalUsers}</h3>
                </div>
                <div className="p-3 bg-violet-500/10 text-violet-600 rounded-2xl"><PeopleIcon /></div>
              </div>

              <div className="glass-panel p-6 rounded-3xl flex justify-between items-center">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Shortened Links</span>
                  <h3 className="text-3xl font-extrabold mt-1 text-slate-950 dark:text-white">{stats?.totalUrls}</h3>
                </div>
                <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-2xl"><LinkIcon /></div>
              </div>

              <div className="glass-panel p-6 rounded-3xl flex justify-between items-center">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Redirect clicks</span>
                  <h3 className="text-3xl font-extrabold mt-1 text-slate-950 dark:text-white">{stats?.totalClicks}</h3>
                </div>
                <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl"><BarChartIcon /></div>
              </div>
            </section>

            {/* Trends and splits charts */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="glass-panel p-6 rounded-3xl lg:col-span-2 min-h-[300px] flex flex-col">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">Cumulative click trends</h3>
                <div className="flex-1 relative min-h-[250px]">
                  <Line data={lineChartData} options={lineChartOptions} />
                </div>
              </div>

              <div className="glass-panel p-6 rounded-3xl flex flex-col">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Device breakdown</h3>
                <div className="flex-1 relative min-h-[200px]">
                  <Doughnut data={deviceChartData} options={doughnutOptions} />
                </div>
              </div>
            </section>

            {/* Platform Insights row */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top links */}
              <div className="glass-panel p-6 rounded-3xl">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Top Links</h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {insights?.topUrls?.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">No clicks recorded yet.</div>
                  ) : (
                    insights?.topUrls?.map((u) => (
                      <div key={u.id} className="flex justify-between items-start text-xs pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                        <div className="truncate flex-1 pr-2">
                          <span className="font-bold text-brand-600 truncate block">/{u.short_code}</span>
                          <span className="text-slate-400 block truncate font-light mt-0.5">{u.original_url}</span>
                        </div>
                        <span className="font-bold text-slate-850 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                          {u.click_count} clicks
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Active users */}
              <div className="glass-panel p-6 rounded-3xl">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Most Active Users</h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {insights?.activeUsers?.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 font-light">No URLs generated yet.</div>
                  ) : (
                    insights?.activeUsers?.map((user) => (
                      <div key={user.id} className="flex justify-between items-center text-xs pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                        <div>
                          <span className="font-bold text-slate-800 dark:text-slate-200 block">{user.name}</span>
                          <span className="text-slate-400 block font-light mt-0.5">{user.email}</span>
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 px-2.5 py-1 rounded-lg">
                          {user.url_count} links
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Live activity feed */}
              <div className="glass-panel p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Live Activity</h3>
                  <div className="flex items-center space-x-1.5 text-xs text-brand-600 dark:text-brand-400 font-bold uppercase tracking-wider">
                    <FiberManualRecordIcon className="w-3.5 h-3.5 animate-pulse text-rose-500" />
                    <span>Real-time</span>
                  </div>
                </div>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {insights?.liveFeed?.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 font-light">Waiting for redirection clicks...</div>
                  ) : (
                    insights?.liveFeed?.map((visit) => (
                      <div key={visit.id} className="text-xs pb-3 border-b border-slate-150 dark:border-slate-850 last:border-0 last:pb-0">
                        <div className="flex justify-between font-semibold">
                          <span className="text-brand-600">/{visit.short_code}</span>
                          <span className="text-slate-400 font-light">
                            {new Date(visit.visited_at).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400 font-light">
                          <span>{visit.ip_address}</span>
                          <span className="bg-slate-100 dark:bg-slate-800 text-[10px] px-1.5 py-0.5 rounded text-slate-500 font-semibold uppercase">
                            {visit.browser} • {visit.device_type}
                          </span>
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

export default AdminDashboard;
