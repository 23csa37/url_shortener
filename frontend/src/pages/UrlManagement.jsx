import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { SkeletonRow } from '../components/Skeleton';
import api from '../services/api';
import { toast } from 'react-hot-toast';

// MUI Icons
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const UrlManagement = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchAllUrls = async () => {
    try {
      const res = await api.get('/admin/urls');
      setUrls(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load system URL directories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUrls();
  }, []);

  const handleDelete = async (urlId) => {
    if (!window.confirm('Are you sure you want to force-delete this URL? All redirection clicks will be deleted permanently.')) {
      return;
    }

    try {
      await api.delete(`/urls/${urlId}`);
      setUrls((prev) => prev.filter((u) => u.id !== urlId));
      toast.success('URL force-deleted successfully.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete URL.');
    }
  };

  const handleCopy = (code) => {
    const fullUrl = `http://localhost:5000/${code}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Link copied to clipboard!');
  };

  const filteredUrls = urls.filter((u) => {
    const s = search.toLowerCase();
    return (
      u.short_code.toLowerCase().includes(s) ||
      (u.custom_alias && u.custom_alias.toLowerCase().includes(s)) ||
      u.original_url.toLowerCase().includes(s) ||
      (u.owner_name && u.owner_name.toLowerCase().includes(s)) ||
      (u.owner_email && u.owner_email.toLowerCase().includes(s))
    );
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Sidebar />

      {/* Main viewport */}
      <main className="flex-1 p-6 md:p-10 relative z-10 max-w-7xl mx-auto w-full">
        {/* Glow Element */}
        <div className="glow-element top-[-50px] right-[-50px] w-[300px] h-[300px] bg-violet-600"></div>

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Link Directory
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-light mt-1">
              Investigate and moderate shortened links generated across the entire platform.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
              <SearchIcon className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search code, target, or owner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input !pl-10 bg-white dark:bg-slate-900/50"
            />
          </div>
        </header>

        {/* Table Card */}
        <section className="glass-panel rounded-3xl p-6 md:p-8">
          {loading ? (
            <div className="space-y-4">
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </div>
          ) : filteredUrls.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <span className="text-4xl">🔗</span>
              <h4 className="text-lg font-bold mt-4">No matching links found</h4>
              <p className="text-sm font-light mt-1">Refine your search parameters and try again.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase">
                    <th className="py-4">Short Code</th>
                    <th className="py-4">Original Destination</th>
                    <th className="py-4">Owner Identity</th>
                    <th className="py-4">Created At</th>
                    <th className="py-4 text-center">Clicks</th>
                    <th className="py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-850 text-sm">
                  {filteredUrls.map((url) => {
                    return (
                      <tr key={url.id} className="hover:bg-slate-100/30 dark:hover:bg-slate-900/10">
                        {/* Short code */}
                        <td className="py-4 font-bold text-brand-600 dark:text-brand-400">
                          <div className="flex items-center space-x-1.5">
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
                            <span className="text-[10px] text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full mt-1 inline-block">
                              Alias: {url.custom_alias}
                            </span>
                          )}
                        </td>

                        {/* Destination */}
                        <td className="py-4 max-w-xs truncate pr-4 text-slate-650 dark:text-slate-400" title={url.original_url}>
                          {url.original_url}
                        </td>

                        {/* Owner details */}
                        <td className="py-4">
                          {url.owner_name ? (
                            <div>
                              <span className="font-semibold text-slate-700 dark:text-slate-350 block text-xs">{url.owner_name}</span>
                              <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{url.owner_email}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Anonymous Guest</span>
                          )}
                        </td>

                        {/* Date Created */}
                        <td className="py-4 text-slate-500 text-xs">
                          <div className="flex items-center space-x-1">
                            <CalendarMonthIcon className="w-3.5 h-3.5 opacity-60" />
                            <span>{new Date(url.created_at).toLocaleDateString()}</span>
                          </div>
                        </td>

                        {/* Clicks count */}
                        <td className="py-4 text-center font-bold text-slate-800 dark:text-slate-200">
                          {url.click_count || 0}
                        </td>

                        {/* Actions */}
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {/* Copy Short URL */}
                            <button
                              onClick={() => handleCopy(url.short_code)}
                              className="p-1.5 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
                              title="Copy Short URL"
                            >
                              <ContentCopyIcon className="w-4.5 h-4.5" />
                            </button>

                            {/* View Stats Details */}
                            <Link
                              to={`/analytics/${url.id}`}
                              className="p-1.5 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
                              title="View Analytics"
                            >
                              <VisibilityIcon className="w-4.5 h-4.5" />
                            </Link>

                            {/* Force Delete */}
                            <button
                              onClick={() => handleDelete(url.id)}
                              className="p-1.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/35"
                              title="Force Delete Link"
                            >
                              <DeleteIcon className="w-4.5 h-4.5" />
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
      </main>
    </div>
  );
};

export default UrlManagement;
