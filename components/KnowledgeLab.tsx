import React, { useState, useEffect } from 'react';
import { 
  Database, Upload, Search, Filter, Play, CheckCircle2, 
  Clock, AlertCircle, Trash2, Globe, FileText, Sparkles, 
  RefreshCcw, ChevronRight, BookOpen, Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface LegalDoc {
  id: string;
  title: string;
  country: string;
  category: string;
  year: number;
  status: 'pending' | 'cooking' | 'live' | 'failed';
  created_at: string;
}

export const KnowledgeLab: React.FC = () => {
  const navigate = useNavigate();
  const [docs, setDocs] = useState<LegalDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Stats
  const stats = {
    total: docs.length,
    live: docs.filter(d => d.status === 'live').length,
    pending: docs.filter(d => d.status === 'pending').length,
    failed: docs.filter(d => d.status === 'failed').length,
  };

  const fetchDocs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/knowledge`);
      if (!response.ok) throw new Error(`Backend error: ${response.statusText}`);
      const data = await response.json();
      setDocs(data);
    } catch (error: any) {
      console.error('Error fetching docs:', error);
      setError(error.message || 'Failed to connect to backend service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleCook = async (id: string) => {
    try {
      setDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'cooking' } : d));
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/knowledge/cook/${id}`, {
        method: 'POST'
      });
      if (response.ok) {
        fetchDocs(); // Refresh
      }
    } catch (error) {
      console.error('Error cooking doc:', error);
    }
  };

  const statusColors = {
    pending: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    cooking: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    live: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    failed: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-500" />
            Knowledge Lab 
            <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Admin Cockpit
            </span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">Manage high-precision legal document ingestion and PageIndex training.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/kockpit/knowledge-lab/ingest')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg shadow-blue-900/20 font-medium whitespace-nowrap"
          >
            <Upload className="w-4 h-4" />
            Ingest Document
          </button>
          <button 
            onClick={fetchDocs}
            className="p-2 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Law', value: stats.total, icon: BookOpen, color: 'text-blue-500' },
          { label: 'Live Engines', value: stats.live, icon: Sparkles, color: 'text-emerald-500' },
          { label: 'Pending Cook', value: stats.pending, icon: Clock, color: 'text-amber-500' },
          { label: 'Failed Checks', value: stats.failed, icon: AlertCircle, color: 'text-rose-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl relative overflow-hidden group">
             <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
                  <h4 className="text-2xl font-bold text-white mt-1">{stat.value}</h4>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color} opacity-80`} />
             </div>
             <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-gradient-to-br from-transparent to-slate-800/20 group-hover:scale-110 transition-transform duration-500`} />
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by Title, Country, or Year..."
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors">
            <Globe className="w-4 h-4" /> Country
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors">
            <Filter className="w-4 h-4" /> Category
          </button>
        </div>
      </div>

      {/* Document Table */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/20">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Document</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Jurisdiction</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              <AnimatePresence>
                {error ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-rose-500 bg-rose-500/5">
                       <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                       <p className="text-lg font-bold">Fetch Error</p>
                       <p className="text-sm opacity-80">{error}</p>
                       <p className="text-xs mt-4 text-slate-500">Ensure the backend service is running on {import.meta.env.VITE_BACKEND_URL}</p>
                    </td>
                  </tr>
                ) : docs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                       <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                       <p className="text-lg">No documents ingested yet.</p>
                       <p className="text-sm">Upload your first legal PDF to start building your AI brain.</p>
                    </td>
                  </tr>
                ) : (
                  docs.filter(d => 
                    d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    d.country.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((doc) => (
                    <motion.tr 
                      key={doc.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-bold">
                            PDF
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">{doc.title}</p>
                            <p className="text-xs text-slate-500">{doc.year} Ingestion</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-300 flex items-center gap-2">
                           <Globe className="w-3 h-3 text-slate-500" />
                           {doc.country}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-400">{doc.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[doc.status]}`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {doc.status === 'pending' && (
                            <button 
                              onClick={() => handleCook(doc.id)}
                              className="p-2 bg-blue-500/10 hover:bg-blue-500/30 text-blue-500 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold"
                              title="Start PageIndex Cooking"
                            >
                              <Play className="w-4 h-4 fill-current" />
                              COOK
                            </button>
                          )}
                          {doc.status === 'live' && (
                            <button className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg cursor-default flex items-center gap-2 text-xs font-bold">
                              <CheckCircle2 className="w-4 h-4" /> LIVE
                            </button>
                          )}
                          <button className="p-2 hover:bg-rose-500/10 text-slate-600 hover:text-rose-500 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
