import React, { useState, useEffect, useRef } from 'react';
import {
  Upload, ChevronLeft, ShieldCheck, AlertCircle, ArrowRight,
  Database, CheckCircle2, RefreshCcw, Zap, FileSearch,
  Brain, HardDrive, Flame, Clock, AlertTriangle, Eye, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const COUNTRIES = ['Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Burundi', 'South Sudan'];
const CATEGORIES = [
  'Constitution', 'Statutes (Acts)', 'Case Law', 'Subsidiary Legislation',
  'Gazette Notices', 'Legal Articles', 'Practice Notes', 'Treaties', 'Legal Forms'
];

const COOK_STEPS = [
  { id: 'upload',    icon: Upload,     label: 'Vaulting Document',          desc: 'Uploading PDF to secure storage' },
  { id: 'register',  icon: Database,   label: 'Registering in Knowledge Base', desc: 'Creating metadata entry in Supabase' },
  { id: 'cook',      icon: Flame,      label: 'PageIndex Cooking',           desc: 'Chunking & embedding document pages' },
  { id: 'index',     icon: Brain,      label: 'Building Vector Index',       desc: 'PageIndex building semantic search index' },
  { id: 'verify',    icon: FileSearch, label: 'Verifying Index Integrity',   desc: 'Running test query to confirm index works' },
  { id: 'ready',     icon: ShieldCheck, label: 'Document Ready',             desc: 'Live in the Legal AI Knowledge Base' },
];

type StepStatus = 'idle' | 'running' | 'done' | 'error';

interface StepState {
  status: StepStatus;
  detail?: string;
}

// ── Live Cooking Monitor for existing documents ──
const CookingMonitor: React.FC<{ docId: string; docTitle: string; onDone: () => void }> = ({ docId, docTitle, onDone }) => {
  const [steps, setSteps] = useState<Record<string, StepState>>({
    cook: { status: 'running' },
    index: { status: 'idle' },
    verify: { status: 'idle' },
    ready: { status: 'idle' },
  });
  const [elapsed, setElapsed] = useState(0);
  const [isFailed, setIsFailed] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const pollRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const startRef = useRef(Date.now());

  useEffect(() => {
    // Elapsed timer
    intervalRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);

    // Poll PageIndex /status
    const poll = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const res = await fetch(`${backendUrl}/api/knowledge/status/${docId}`);
        const data = await res.json();
        const st = data.status as string;

        if (st === 'ready') {
          setSteps({ cook: { status: 'done' }, index: { status: 'done' }, verify: { status: 'done' }, ready: { status: 'done' } });
          clearInterval(pollRef.current);
          clearInterval(intervalRef.current);
          onDone();
        } else if (st?.startsWith('error')) {
          setIsFailed(true);
          setSteps(s => ({ ...s, cook: { status: 'error', detail: st } }));
          clearInterval(pollRef.current);
          clearInterval(intervalRef.current);
        } else if (st === 'indexing') {
          setSteps(s => ({ ...s, cook: { status: 'done' }, index: { status: 'running' } }));
        } else if (st === 'verifying') {
          setSteps(s => ({ ...s, cook: { status: 'done' }, index: { status: 'done' }, verify: { status: 'running' } }));
        }
      } catch { /* backend might be slow */ }
    };

    pollRef.current = setInterval(poll, 3000);
    poll();

    return () => { clearInterval(intervalRef.current); clearInterval(pollRef.current); };
  }, [docId]);

  const monitorSteps = [
    { id: 'cook',   icon: Flame,      label: 'PageIndex Cooking' },
    { id: 'index',  icon: Brain,      label: 'Building Vector Index' },
    { id: 'verify', icon: FileSearch, label: 'Verifying Integrity' },
    { id: 'ready',  icon: ShieldCheck,label: 'Document Ready' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/60 border border-slate-700 rounded-[2rem] p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Ingestion Pipeline</h3>
          <p className="text-slate-400 text-sm mt-1 truncate max-w-xs">{docTitle}</p>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-sm font-mono">
          <Clock className="w-4 h-4" />
          {elapsed}s
        </div>
      </div>

      {/* Progress bar */}
      {!isFailed && (
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full"
            animate={{ width: ['0%', '95%'] }}
            transition={{ duration: 45, ease: 'easeInOut' }}
          />
        </div>
      )}

      {/* Steps */}
      <div className="space-y-3">
        {monitorSteps.map((step) => {
          const s = steps[step.id] || { status: 'idle' };
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                s.status === 'running' ? 'bg-blue-500/10 border-blue-500/40' :
                s.status === 'done'    ? 'bg-emerald-500/10 border-emerald-500/30' :
                s.status === 'error'   ? 'bg-red-500/10 border-red-500/30' :
                'bg-white/[0.02] border-white/5 opacity-40'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                s.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                s.status === 'done'    ? 'bg-emerald-500/20 text-emerald-400' :
                s.status === 'error'   ? 'bg-red-500/20 text-red-400' :
                'bg-white/5 text-slate-600'
              }`}>
                {s.status === 'running' ? <RefreshCcw className="w-5 h-5 animate-spin" /> :
                 s.status === 'done'    ? <CheckCircle2 className="w-5 h-5" /> :
                 s.status === 'error'   ? <AlertTriangle className="w-5 h-5" /> :
                 <step.icon className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{step.label}</p>
                {s.detail && <p className="text-xs text-red-400 mt-0.5">{s.detail}</p>}
              </div>
              {s.status === 'running' && (
                <div className="flex gap-1">
                  {[0,1,2].map(i => (
                    <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400"
                      animate={{ scale: [1, 1.8, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {isFailed && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <p className="text-sm font-bold text-red-400">Cooking Failed</p>
            <p className="text-xs text-slate-400 mt-1">{steps.cook.detail || 'The PageIndex microservice encountered an error processing this PDF.'}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// ── Document Queue (live list of all knowledge_base entries) ──
const DocumentQueue: React.FC = () => {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cooking, setCooking] = useState<string | null>(null);

  const fetchDocs = async () => {
    setLoading(true);
    const { data } = await supabase.from('knowledge_base').select('*').order('created_at', { ascending: false });
    if (data) setDocs(data);
    setLoading(false);
  };

  useEffect(() => { fetchDocs(); }, []);

  const retriggerCook = async (doc: any) => {
    setCooking(doc.id);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/knowledge/recook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document_id: doc.id, file_path: doc.file_path }),
      });
      if (res.ok) {
        await supabase.from('knowledge_base').update({ status: 'cooking' }).eq('id', doc.id);
        fetchDocs();
      }
    } catch (e) {
      console.error('Recook failed', e);
    } finally {
      setCooking(null);
    }
  };

  const statusMeta: Record<string, { color: string; bg: string; label: string }> = {
    pending:  { color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20', label: 'Pending' },
    cooking:  { color: 'text-blue-400',  bg: 'bg-blue-500/10 border-blue-500/20',   label: 'Cooking' },
    ready:    { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Ready' },
    error:    { color: 'text-red-400',   bg: 'bg-red-500/10 border-red-500/20',     label: 'Error' },
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-slate-500">
      <RefreshCcw className="w-6 h-6 animate-spin mr-3" /> Loading queue...
    </div>
  );

  if (docs.length === 0) return (
    <div className="text-center py-20 text-slate-500">
      <Database className="w-12 h-12 mx-auto mb-4 opacity-20" />
      <p className="font-bold">No documents ingested yet.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Ingestion Queue</h3>
        <button onClick={fetchDocs} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white">
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>
      {docs.map(doc => {
        const meta = statusMeta[doc.status] || statusMeta.pending;
        const isCooking = doc.status === 'cooking';
        return (
          <motion.div key={doc.id} layout
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-white/20 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white truncate">{doc.title}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] text-slate-500 font-mono uppercase">{doc.category}</span>
                <span className="text-[10px] text-slate-600">·</span>
                <span className="text-[10px] text-slate-500">{doc.country} · {doc.year}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border flex items-center gap-1.5 ${meta.bg} ${meta.color}`}>
                {isCooking && <RefreshCcw className="w-3 h-3 animate-spin" />}
                {meta.label}
              </span>
              {(doc.status === 'error' || doc.status === 'pending' || doc.status === 'cooking') && (
                <button
                  onClick={() => retriggerCook(doc)}
                  disabled={cooking === doc.id}
                  title="Re-trigger cook"
                  className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 flex items-center justify-center transition-all disabled:opacity-40"
                >
                  {cooking === doc.id ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                </button>
              )}
            </div>
            {isCooking && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div className="h-full bg-blue-500 rounded-full"
                  animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

// ── Main KnowledgeIngest ──
export const KnowledgeIngest: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [country, setCountry] = useState('Kenya');
  const [category, setCategory] = useState('Statutes (Acts)');
  const [year, setYear] = useState(new Date().getFullYear().toString());

  // Pipeline state
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [stepStates, setStepStates] = useState<Record<string, StepState>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [cookingDocId, setCookingDocId] = useState<string | null>(null);
  const [cookingDocTitle, setCookingDocTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [view, setView] = useState<'form' | 'queue'>('form');

  const setStep = (id: string, s: StepState) => setStepStates(p => ({ ...p, [id]: s }));

  const handleIngest = async () => {
    if (!file || !title) {
      setErrorMessage('Please provide both a title and a file.');
      return;
    }
    setIsRunning(true);
    setErrorMessage('');
    setActiveStepIndex(0);

    try {
      // Step 1: Upload
      setStep('upload', { status: 'running' });
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('raw-documents').upload(fileName, file);
      if (uploadError) throw uploadError;
      setStep('upload', { status: 'done' });

      // Step 2: Register
      setActiveStepIndex(1);
      setStep('register', { status: 'running' });
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/knowledge/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, country, category, year: parseInt(year), file_path: fileName }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Registration failed');
      }
      const regData = await res.json();
      setStep('register', { status: 'done' });

      // Steps 3-6: handed off to monitor
      setActiveStepIndex(2);
      setStep('cook',   { status: 'running' });
      setStep('index',  { status: 'idle' });
      setStep('verify', { status: 'idle' });
      setStep('ready',  { status: 'idle' });
      setCookingDocId(regData.data?.id || regData.id);
      setCookingDocTitle(title);

    } catch (err: any) {
      setErrorMessage(err.message || 'Unexpected error during ingestion');
      const currentId = COOK_STEPS[activeStepIndex]?.id;
      if (currentId) setStep(currentId, { status: 'error', detail: err.message });
      setIsRunning(false);
    }
  };

  const overallProgress = isDone ? 100 :
    Object.values(stepStates).filter(s => s.status === 'done').length / COOK_STEPS.length * 100;

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.button
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/kockpit/knowledge-lab')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Knowledge Lab
        </motion.button>
        <div className="flex items-center gap-2">
          <button onClick={() => setView('form')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'form' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}>
            <Upload className="w-4 h-4 inline mr-2" />Ingest New
          </button>
          <button onClick={() => setView('queue')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'queue' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}>
            <Eye className="w-4 h-4 inline mr-2" />View Queue
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'queue' ? (
          <motion.div key="queue" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <DocumentQueue />
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
              {/* Header Banner */}
              <div className="p-10 border-b border-slate-800 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-500">
                    <Database className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Legal Ingestion Console</h2>
                    <p className="text-slate-400 mt-1">Upload and index legal documents for AI-powered retrieval.</p>
                  </div>
                </div>
                {/* Overall progress */}
                {isRunning && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pipeline Progress</span>
                      <span className="text-xs font-mono text-slate-400">{Math.round(overallProgress)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        animate={{ width: `${overallProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-10 space-y-8">
                {/* Form or active pipeline */}
                {!isRunning ? (
                  <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Document Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                          placeholder="e.g. Kenya Finance Act 2024"
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Jurisdiction</label>
                          <select value={country} onChange={e => setCountry(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:border-blue-500 focus:outline-none transition-all appearance-none cursor-pointer">
                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Document Type</label>
                          <select value={category} onChange={e => setCategory(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:border-blue-500 focus:outline-none transition-all appearance-none cursor-pointer">
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Legislation Year</label>
                        <input type="number" value={year} onChange={e => setYear(e.target.value)}
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:border-blue-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Source File (PDF)</label>
                      <div className="flex-1 relative group">
                        <input type="file" accept="application/pdf" onChange={e => e.target.files?.[0] && setFile(e.target.files[0])}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`h-full border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center p-8 transition-all duration-300 ${
                          file ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-slate-800/30 border-slate-700 group-hover:border-blue-500/50 group-hover:bg-blue-500/5'
                        }`}>
                          {file ? (
                            <>
                              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
                                <CheckCircle2 className="w-8 h-8" />
                              </div>
                              <p className="text-white font-bold text-center break-all px-4">{file.name}</p>
                              <p className="text-slate-500 text-xs mt-2">{(file.size / 1024 / 1024).toFixed(2)} MB · Ready</p>
                            </>
                          ) : (
                            <>
                              <div className="w-20 h-20 rounded-3xl bg-slate-800/50 flex items-center justify-center text-slate-500 group-hover:text-blue-500 group-hover:scale-110 transition-all mb-4">
                                <Upload className="w-10 h-10" />
                              </div>
                              <p className="text-slate-300 font-semibold text-lg text-center px-6">Drop PDF here or click to browse</p>
                              <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mt-4">Max 50MB</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                ) : (
                  // Step pipeline view
                  <div className="space-y-3">
                    {COOK_STEPS.map((step, idx) => {
                      const s = stepStates[step.id] || { status: idx > activeStepIndex ? 'idle' : 'idle' };
                      const isActive = idx === activeStepIndex;
                      return (
                        <motion.div key={step.id} layout
                          className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                            s.status === 'running' || isActive ? 'bg-blue-500/10 border-blue-500/40' :
                            s.status === 'done'    ? 'bg-emerald-500/10 border-emerald-500/30' :
                            s.status === 'error'   ? 'bg-red-500/10 border-red-500/30' :
                            'bg-white/[0.02] border-white/5 opacity-40'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            s.status === 'running' || isActive ? 'bg-blue-500/20 text-blue-400' :
                            s.status === 'done'    ? 'bg-emerald-500/20 text-emerald-400' :
                            s.status === 'error'   ? 'bg-red-500/20 text-red-400' :
                            'bg-white/5 text-slate-600'
                          }`}>
                            {(s.status === 'running' || isActive) ? <RefreshCcw className="w-5 h-5 animate-spin" /> :
                             s.status === 'done'  ? <CheckCircle2 className="w-5 h-5" /> :
                             s.status === 'error' ? <AlertTriangle className="w-5 h-5" /> :
                             <step.icon className="w-5 h-5" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-white">{step.label}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                            {s.detail && <p className="text-xs text-red-400 mt-0.5">{s.detail}</p>}
                          </div>
                          {(s.status === 'running' || isActive) && (
                            <div className="flex gap-1">
                              {[0,1,2].map(i => (
                                <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400"
                                  animate={{ scale: [1, 1.8, 1], opacity: [0.5, 1, 0.5] }}
                                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                />
                              ))}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Cooking monitor (steps 3-6 after backend responds) */}
                {cookingDocId && !isDone && (
                  <CookingMonitor
                    docId={cookingDocId}
                    docTitle={cookingDocTitle}
                    onDone={() => {
                      setIsDone(true);
                      setIsRunning(false);
                      setStep('cook',   { status: 'done' });
                      setStep('index',  { status: 'done' });
                      setStep('verify', { status: 'done' });
                      setStep('ready',  { status: 'done' });
                      setActiveStepIndex(5);
                    }}
                  />
                )}

                {/* Error */}
                {errorMessage && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-medium">{errorMessage}</p>
                  </motion.div>
                )}

                {/* Success */}
                {isDone && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-6 rounded-2xl flex items-center gap-4"
                  >
                    <Zap className="w-7 h-7 shrink-0" />
                    <div>
                      <p className="font-bold text-lg">Document is Live!</p>
                      <p className="text-sm text-slate-400 mt-1">Your document is now indexed and queryable in the Legal AI.</p>
                    </div>
                  </motion.div>
                )}

                {/* Action button */}
                {!isRunning && !isDone && (
                  <button onClick={handleIngest} disabled={!file || !title}
                    className="w-full py-5 rounded-[1.5rem] font-black text-lg uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white shadow-2xl shadow-blue-600/30 hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <ArrowRight className="w-6 h-6" /> Confirm Ingestion
                  </button>
                )}
                {isDone && (
                  <button onClick={() => setView('queue')}
                    className="w-full py-5 rounded-[1.5rem] font-black text-lg uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white">
                    <Eye className="w-6 h-6" /> View Queue
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
