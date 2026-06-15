import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import { SkeletonCard, SkeletonRow } from '../components/Skeleton';
import api from '../services/api';
import { getSocket, joinRoom, leaveRoom } from '../services/socket';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// MUI Icons
import LinkIcon from '@mui/icons-material/Link';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimerIcon from '@mui/icons-material/Timer';
import TimerOffIcon from '@mui/icons-material/TimerOff';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import QrCodeIcon from '@mui/icons-material/QrCode';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(null);

  // Form states
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  // Fetch all URLs on mount
  const fetchUrls = async () => {
    try {
      const res = await api.get('/urls');
      setUrls(res.data.data);
    } catch (err) {
      toast.error('Failed to load short URLs.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();

    // WebSocket Real-time sync setup
    if (user?.id) {
      const roomName = `user_${user.id}`;
      joinRoom(roomName);

      const socket = getSocket();
      socket.on('visit_logged', (visitData) => {
        // Increment url click counts instantly
        setUrls((prevUrls) =>
          prevUrls.map((u) => {
            if (u.id === visitData.url_id) {
              return { ...u, click_count: parseInt(u.click_count || 0) + 1 };
            }
            return u;
          })
        );
        toast(`🔗 Link /${visitData.short_code} was clicked!`, {
          icon: '⚡',
          style: {
            borderRadius: '16px',
            background: '#1e293b',
            color: '#fff',
          },
        });
      });

      return () => {
        socket.off('visit_logged');
        leaveRoom(roomName);
      };
    }
  }, [user?.id]);

  // Create handler
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!originalUrl.trim()) {
      return toast.error('Original URL is required.');
    }

    try {
      const res = await api.post('/urls', {
        originalUrl,
        customAlias: customAlias || undefined,
        expiresAt: expiresAt || undefined,
      });

      setUrls((prev) => [res.data.data, ...prev]);
      toast.success('URL shortened successfully!');
      setIsCreateOpen(false);
      
      // Clear forms
      setOriginalUrl('');
      setCustomAlias('');
      setExpiresAt('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to shorten link.';
      toast.error(msg);
    }
  };

  // Edit handler
  const handleEdit = async (e) => {
    e.preventDefault();
    if (!selectedUrl.original_url.trim()) {
      return toast.error('Original URL is required.');
    }

    try {
      const res = await api.put(`/urls/${selectedUrl.id}`, {
        originalUrl: selectedUrl.original_url,
        expiresAt: selectedUrl.expires_at || undefined,
      });

      setUrls((prev) =>
        prev.map((u) => (u.id === selectedUrl.id ? { ...u, ...res.data.data } : u))
      );
      toast.success('URL updated successfully!');
      setIsEditOpen(false);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update URL details.';
      toast.error(msg);
    }
  };

  // Delete handler
  const handleDelete = async (urlId) => {
    if (!window.confirm('Are you sure you want to delete this short URL? All analytics history will be lost.')) {
      return;
    }

    try {
      await api.delete(`/urls/${urlId}`);
      setUrls((prev) => prev.filter((u) => u.id !== urlId));
      toast.success('URL deleted successfully.');
    } catch (err) {
      toast.error('Failed to delete URL.');
    }
  };

  // Copy click utility
  const handleCopy = (code) => {
    const fullUrl = `http://localhost:5000/${code}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Link copied to clipboard!');
  };

  // Aggregated totals
  const totalUrls = urls.length;
  const totalClicks = urls.reduce((sum, u) => sum + parseInt(u.click_count || 0), 0);
  const activeUrls = urls.filter((u) => !u.expires_at || new Date(u.expires_at) > new Date()).length;
  const expiredUrls = urls.filter((u) => u.expires_at && new Date(u.expires_at) <= new Date()).length;

  // Search Filtered urls
  const filteredUrls = urls.filter((u) => {
    const s = search.toLowerCase();
    return (
      u.short_code.toLowerCase().includes(s) ||
      (u.custom_alias && u.custom_alias.toLowerCase().includes(s)) ||
      u.original_url.toLowerCase().includes(s)
    );
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Sidebar />

      {/* Main dashboard viewport */}
      <main className="flex-1 p-6 md:p-10 relative z-10 max-w-7xl mx-auto w-full">
        {/* Glow Element */}
        <div className="glow-element top-[-50px] right-[-50px] w-[300px] h-[300px] bg-brand-500"></div>

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-light mt-1">
              Shorten links, generate QR codes, and monitor redirection clicks in real-time.
            </p>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center justify-center space-x-2 px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-semibold text-sm shadow-lg shadow-brand-500/25 hover:shadow-brand-500/35 transition-all w-full md:w-auto -translate-y-0.5 active:translate-y-0"
          >
            <AddIcon className="w-5 h-5" />
            <span>Shorten New Link</span>
          </button>
        </header>

        {/* Metrics Overview Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              {/* Stat card 1 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-6 rounded-3xl flex justify-between items-start"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Links</span>
                  <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{totalUrls}</h3>
                </div>
                <div className="p-3 bg-brand-500/10 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400 rounded-2xl">
                  <LinkIcon className="w-6 h-6" />
                </div>
              </motion.div>

              {/* Stat card 2 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="glass-panel p-6 rounded-3xl flex justify-between items-start"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Clicks</span>
                  <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{totalClicks}</h3>
                </div>
                <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 rounded-2xl">
                  <BarChartIcon className="w-6 h-6" />
                </div>
              </motion.div>

              {/* Stat card 3 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-panel p-6 rounded-3xl flex justify-between items-start"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Links</span>
                  <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">{activeUrls}</h3>
                </div>
                <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-2xl">
                  <TimerIcon className="w-6 h-6" />
                </div>
              </motion.div>

              {/* Stat card 4 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass-panel p-6 rounded-3xl flex justify-between items-start"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Expired Links</span>
                  <h3 className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-2">{expiredUrls}</h3>
                </div>
                <div className="p-3 bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 rounded-2xl">
                  <TimerOffIcon className="w-6 h-6" />
                </div>
              </motion.div>
            </>
          )}
        </section>

        {/* Links listing and Search bar */}
        <section className="glass-panel rounded-3xl p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Shortened Links</h2>
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <SearchIcon className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="Search shortcode, alias, or target..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="glass-input !pl-10 bg-slate-100/50 dark:bg-slate-900/50"
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </div>
          ) : filteredUrls.length === 0 ? (
            <div className="text-center py-16 text-slate-500 dark:text-slate-400">
              <span className="text-4xl">📭</span>
              <h4 className="text-lg font-bold mt-4">No matching links found</h4>
              <p className="text-sm font-light mt-1">Shorten a new link to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase">
                    <th className="py-4">Short Code & Alias</th>
                    <th className="py-4">Original URL</th>
                    <th className="py-4">Created At</th>
                    <th className="py-4">Expiration</th>
                    <th className="py-4 text-center">Clicks</th>
                    <th className="py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-850 text-sm">
                  {filteredUrls.map((url) => {
                    const isExpired = url.expires_at && new Date(url.expires_at) <= new Date();
                    return (
                      <tr key={url.id} className="hover:bg-slate-100/30 dark:hover:bg-slate-900/10">
                        {/* Short code & Alias */}
                        <td className="py-4">
                          <div className="font-bold text-brand-600 dark:text-brand-400 flex items-center space-x-1.5">
                            <span>/{url.short_code}</span>
                            <a
                              href={`http://localhost:5000/${url.short_code}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                            >
                              <OpenInNewIcon className="w-3.5 h-3.5" />
                            </a>
                          </div>
                          {url.custom_alias && (
                            <span className="text-xs text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full mt-1 inline-block">
                              Alias: {url.custom_alias}
                            </span>
                          )}
                        </td>

                        {/* Original URL target */}
                        <td className="py-4 max-w-xs truncate pr-4 text-slate-600 dark:text-slate-400" title={url.original_url}>
                          {url.original_url}
                        </td>

                        {/* Created Date */}
                        <td className="py-4 text-slate-500">
                          {new Date(url.created_at).toLocaleDateString()}
                        </td>

                        {/* Expiry Details */}
                        <td className="py-4">
                          {url.expires_at ? (
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                                isExpired
                                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'
                                  : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                              }`}
                            >
                              {isExpired ? 'Expired' : new Date(url.expires_at).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">Never</span>
                          )}
                        </td>

                        {/* Click Count */}
                        <td className="py-4 text-center font-semibold text-slate-800 dark:text-slate-200">
                          {url.click_count || 0}
                        </td>

                        {/* Control Actions */}
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {/* Copy button */}
                            <button
                              onClick={() => handleCopy(url.short_code)}
                              className="p-1.5 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
                              title="Copy Short URL"
                            >
                              <ContentCopyIcon className="w-4 h-4" />
                            </button>

                            {/* QR code button */}
                            <button
                              onClick={() => {
                                setSelectedUrl(url);
                                setIsQrOpen(true);
                              }}
                              className="p-1.5 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
                              title="View QR Code"
                            >
                              <QrCodeIcon className="w-4 h-4" />
                            </button>

                            {/* Stats page redirect */}
                            <Link
                              to={`/analytics/${url.id}`}
                              className="p-1.5 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
                              title="Analytics Details"
                            >
                              <VisibilityIcon className="w-4 h-4" />
                            </Link>

                            {/* Edit button */}
                            <button
                              onClick={() => {
                                setSelectedUrl({
                                  id: url.id,
                                  original_url: url.original_url,
                                  expires_at: url.expires_at ? url.expires_at.split('T')[0] : '',
                                });
                                setIsEditOpen(true);
                              }}
                              className="p-1.5 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
                              title="Edit destination"
                            >
                              <EditIcon className="w-4 h-4" />
                            </button>

                            {/* Delete button */}
                            <button
                              onClick={() => handleDelete(url.id)}
                              className="p-1.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/35"
                              title="Delete Link"
                            >
                              <DeleteIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* MODAL 1: CREATE URL */}
        <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Shorten Target Link">
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Original Destination URL *</label>
              <input
                type="url"
                required
                placeholder="https://example.com/very-long-product-id-987"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className="glass-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Custom Alias (Optional)</label>
              <input
                type="text"
                placeholder="e.g. promo2026"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                className="glass-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Expiration Date (Optional)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                  <CalendarMonthIcon className="w-5 h-5" />
                </span>
                <input
                  type="date"
                  value={expiresAt}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="glass-input !pl-10"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-semibold text-sm transition-all"
            >
              Generate Short URL
            </button>
          </form>
        </Modal>

        {/* MODAL 2: EDIT URL */}
        <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Short Link Details">
          {selectedUrl && (
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Original Destination URL *</label>
                <input
                  type="url"
                  required
                  value={selectedUrl.original_url}
                  onChange={(e) => setSelectedUrl({ ...selectedUrl, original_url: e.target.value })}
                  className="glass-input"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Expiration Date (Optional)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <CalendarMonthIcon className="w-5 h-5" />
                  </span>
                  <input
                    type="date"
                    value={selectedUrl.expires_at}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedUrl({ ...selectedUrl, expires_at: e.target.value })}
                    className="glass-input !pl-10 pl-10"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-semibold text-sm transition-all"
              >
                Save Changes
              </button>
            </form>
          )}
        </Modal>

        {/* MODAL 3: QR CODE DISPLAY */}
        <Modal isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} title="Share QR Code">
          {selectedUrl && (
            <div className="text-center p-4">
              {selectedUrl.qr_code ? (
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-3xl inline-block shadow-inner">
                    <img src={selectedUrl.qr_code} alt="Shortlink QR Code" className="w-48 h-48 mx-auto" />
                  </div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Short URL: <span className="font-bold text-brand-600">http://localhost:5000/{selectedUrl.short_code}</span>
                  </div>
                  <a
                    href={selectedUrl.qr_code}
                    download={`qrcode-${selectedUrl.short_code}.png`}
                    className="inline-block px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-semibold text-sm transition-all w-full"
                  >
                    Download QR Code Image
                  </a>
                </div>
              ) : (
                <div className="py-8 text-slate-400">QR Code could not be loaded.</div>
              )}
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
};

export default Dashboard;
