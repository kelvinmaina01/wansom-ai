import React, { useState, useMemo, useEffect } from 'react';
import { apiClient } from '../lib/apiClient';
import { 
  Search, 
  Gavel, 
  Scale, 
  BookOpen, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft,
  User,
  Calendar,
  FileText,
  BarChart3,
  Building,
  ArrowRight,
  Share2,
  Download,
  ExternalLink,
  ChevronDown,
  Globe,
  Sparkles,
  Clock,
  Award,
  Hash,
  Layers,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer,
  Label,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';

// --- Types ---
interface JudgeProfile {
  id: string;
  name: string;
  title: string;
  court: string;
  division: string;
  jurisdiction: string;
  image: string;
  yearsExperience: number;
  totalCases: number;
  winRate: number;
  rulingTendencies: {
    category: string;
    allowed: number;
    dismissed: number;
  }[];
  commonCitations: {
    caseName: string;
    count: number;
    type: string;
  }[];
  insights: string[];
  recentRulings: {
    id: string;
    date: string;
    caseName: string;
    outcome: 'Allowed' | 'Dismissed' | 'Partial';
    summary: string;
    caseType: string;
  }[];
  bio?: string;
}

const JURISDICTIONS = ['All Regions', 'Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Ethiopia'];
const COURTS = ['All Courts', 'High Court', 'Court of Appeal', 'Supreme Court', 'Environment & Land Court'];
const CASE_TYPES = [
  'Commercial / contract dispute',
  'Land / property',
  'Employment / labour',
  'Civil (general)',
  'Constitutional petition',
  'Criminal'
];

const CITATION_COLORS = ['#fbbf24', '#3b82f6', '#10b981', '#6366f1', '#8b5cf6', '#f59e0b'];

// --- Action Icons ---
const GoogleDriveIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.74 3.513L4.545 9.043L11.758 21.536H18.148L21.343 16.006L14.13 3.513H7.74Z" fill="#FFC107" />
    <path d="M14.13 3.513L11.758 7.625L18.971 20.118L21.343 16.006L14.13 3.513Z" fill="#1976D2" />
    <path d="M11.758 7.625L4.545 9.043L1.35 14.574L8.563 21.536L11.758 7.625Z" fill="#4CAF50" />
  </svg>
);

const OneDriveIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.5 19C15.01 19 13 16.99 13 14.5C13 12.01 15.01 10 17.5 10C18.17 10 18.8 10.15 19.37 10.42C18.88 7.39 16.2 5 13 5C10.74 5 8.76 6.19 7.66 8.04C7.14 7.69 6.52 7.5 5.85 7.5C4.28 7.5 3 8.78 3 10.35C3 10.57 3.03 10.78 3.09 10.98C1.29 11.96 0 13.9 0 16.15C0 19.38 2.62 22 5.85 22H17.5C20.54 22 23 19.54 23 16.5C23 13.46 20.54 11 17.5 11" fill="#0078D4" />
  </svg>
);

// --- Sub-Components ---

const StatCard = ({ label, value, subtext, icon: Icon, colorClass, gradient }: any) => (
  <div className={`bg-slate-50 border border-slate-200 rounded-xl p-10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group flex flex-col justify-between overflow-hidden relative`}>
    <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 ${gradient}`}></div>
    <div className="flex justify-between items-start mb-6 relative z-10">
      <div className={`p-4 rounded-2xl bg-slate-50 group-hover:bg-white group-hover:shadow-lg transition-all duration-500`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
      <p className="text-[11px] font-black text-slate-800/40 uppercase tracking-[0.2em]">{label}</p>
    </div>
    <div className="relative z-10">
      <h3 className="text-5xl font-bold tracking-tighter text-slate-900 leading-none mb-3">{value}</h3>
      <p className={`text-[11px] font-bold uppercase tracking-widest ${colorClass} opacity-80`}>{subtext}</p>
    </div>
  </div>
);

const OutcomePredictor = ({ judge }: { judge: JudgeProfile }) => {
  const [selectedType, setSelectedType] = useState('');
  
  const prediction = useMemo(() => {
    if (!selectedType) return null;
    const stats = judge.rulingTendencies.find(t => 
      selectedType.toLowerCase().includes(t.category.toLowerCase()) || 
      t.category.toLowerCase().includes(selectedType.toLowerCase().split(' ')[0])
    );
    return stats || { allowed: 48, dismissed: 52 }; // Default
  }, [selectedType, judge]);

  return (
    <div className="space-y-6 w-full">
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Predict outcome for your case type</h3>
          <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] mb-10">Select a matter category to see historical favorability</p>
          
          <div className="relative max-w-sm mb-12">
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-8 py-5 text-sm appearance-none focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Select case type...</option>
              {CASE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>

          <AnimatePresence mode="wait">
            {prediction && (
              <motion.div 
                key="prediction"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-left"
              >
                <div className="bg-white rounded-xl p-12 border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="relative w-48 h-48 flex items-center justify-center mb-8 bg-white rounded-full shadow-inner border border-slate-100">
                     <svg className="w-full h-full -rotate-90 p-2">
                      <circle cx="80" cy="80" r="70" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                      <circle 
                        cx="80" cy="80" r="70" 
                        stroke={prediction.allowed > 60 ? '#10b981' : (prediction.allowed > 40 ? '#fbbf24' : '#ef4444')} 
                        strokeWidth="12" 
                        fill="transparent" 
                        strokeDasharray={440} 
                        strokeDashoffset={440 - (440 * prediction.allowed) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-black text-slate-900 tracking-tighter">{prediction.allowed}%</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Success Rate</span>
                    </div>
                  </div>
                  <div className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${prediction.allowed > 50 ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-primary text-white shadow-primary/20'}`}>
                    {prediction.allowed > 65 ? 'Favorable Bench' : (prediction.allowed > 35 ? 'Neutral Bench' : 'Hostile Bench')}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                   <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm flex gap-6 items-start hover:shadow-md transition-all">
                      <div className="p-4 bg-primary/5 rounded-2xl">
                        <TrendingUp className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h5 className="text-base font-bold text-slate-900 mb-2">Statistical Insights</h5>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                          Historical analysis shows a higher success probability relative to the average {selectedType.split(' ')[0]} outcomes at this level.
                        </p>
                      </div>
                   </div>
                   <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm flex gap-6 items-start hover:shadow-md transition-all">
                      <div className="p-4 bg-amber-50 rounded-2xl">
                        <Gavel className="w-6 h-6 text-amber-500" />
                      </div>
                      <div>
                        <h5 className="text-base font-bold text-slate-900 mb-2">Counsel Recommendation</h5>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                          {prediction.allowed > 60 
                            ? "Maximize use of binding precedents. This bench shows high responsiveness to historically consistent arguments." 
                            : "Prioritize procedural compliance above all. Technical dismissals are common; focus on ensuring every filing is ironclad."}
                        </p>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-slate-900 text-white rounded-2xl p-12 relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10 flex gap-10 items-start">
          <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md">
            <Sparkles className="w-8 h-8 text-amber-300 animate-pulse" />
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-bold mb-3 tracking-tight">System Guidance</h4>
            <p className="text-sm text-slate-300/90 leading-relaxed font-medium pr-10">
              The Outcome Predictor leverages millions of data points from East African court registries. Use these metrics to quantify risk and advise clients with data-backed confidence.
            </p>
            <div className="grid grid-cols-2 gap-12 mt-10 pt-10 border-t border-white/10">
               <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl border border-white/20 flex items-center justify-center p-1 bg-red-500/20 text-red-400 text-[10px] font-black tracking-tighter italic">!</div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wide leading-relaxed">Below 30% is flagged as "Hostile" — Negotiate settlements where possible.</p>
               </div>
               <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl border border-white/20 flex items-center justify-center p-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black">✓</div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wide leading-relaxed">Above 65% is flagged as "Favorable" — Proceed with tactical rigor.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

interface JudicialAnalyticsProps {
  activeSubView?: string;
}

const JudicialAnalytics: React.FC<JudicialAnalyticsProps> = ({ activeSubView = 'Judge directory' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJudge, setSelectedJudge] = useState<JudgeProfile | null>(null);
  const [courtFilter, setCourtFilter] = useState('All Courts');
  const [jurisdictionFilter, setJurisdictionFilter] = useState('All Regions');
  const [activeTab, setActiveTab] = useState<'tendencies' | 'insights' | 'citations' | 'predictor'>('tendencies');
  const [judgesData, setJudgesData] = useState<JudgeProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Perspective State
  const [graphPerspective, setGraphPerspective] = useState<'career' | 'recent' | 'jurisdiction'>('career');

  // Drawer Hub State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);

  // AI Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    {role: 'assistant', content: 'Hello! I am analytical intelligence for Lawlify. Ask me deep questions about this judge\'s judicial philosophy.'}
  ]);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');
    // Contextual Mock Response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Based on my analysis, the judge heavily scrutinizes ' + userMsg.split(' ').pop() + ' and enforces strict procedural timelines on these matters.' }]);
    }, 1000);
  };

  useEffect(() => {
    const fetchJudges = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get('/api/analytics/judges');
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const data = await res.json();
        setJudgesData(data);
      } catch (err) {
        console.error("Judicial analytics error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJudges();
  }, []);

  const filteredJudges = useMemo(() => {
    return judgesData.filter(judge => {
      const name = judge.name || '';
      const court = judge.court || '';
      const jurisdiction = judge.jurisdiction || '';
      
      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        court.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCourt = courtFilter === 'All Courts' || court.includes(courtFilter);
      
      // Fix: Normalize jurisdiction check (backend might return "Kenya" but filter is "Kenya")
      const matchesJurisdiction = jurisdictionFilter === 'All Regions' || 
        jurisdiction.toLowerCase().includes(jurisdictionFilter.toLowerCase());
        
      return matchesSearch && matchesCourt && matchesJurisdiction;
    });
  }, [searchTerm, courtFilter, jurisdictionFilter, judgesData]);

  const outcomeData = useMemo(() => {
    if (!selectedJudge) return [];
    
    // Perspective logic: simulate different data slices
    let baseRate = selectedJudge.winRate;
    if (graphPerspective === 'recent') baseRate = Math.min(95, selectedJudge.winRate + 8);
    if (graphPerspective === 'jurisdiction') baseRate = Math.max(10, selectedJudge.winRate - 12);

    return [
      { name: 'Allowed', value: baseRate, color: '#10b981' },
      { name: 'Dismissed', value: Math.max(0, 100 - baseRate - 15), color: '#ef4444' },
      { name: 'Partial', value: 15, color: '#fbbf24' },
    ];
  }, [selectedJudge, graphPerspective]);

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Skeleton header */}
        <div className="flex items-center gap-4 animate-pulse">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl" />
          <div className="space-y-2">
            <div className="h-5 w-48 bg-slate-100 rounded-full" />
            <div className="h-3 w-72 bg-slate-50 rounded-full" />
          </div>
        </div>
        {/* Skeleton stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-8 animate-pulse min-h-[140px]">
              <div className="h-4 w-20 bg-slate-100 rounded-full mb-6" />
              <div className="h-8 w-16 bg-gray-200 rounded-lg mb-2" />
              <div className="h-3 w-24 bg-slate-100 rounded-full" />
            </div>
          ))}
        </div>
        {/* Skeleton judge cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-6 animate-pulse">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-gray-200 rounded-full shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-36 bg-gray-200 rounded-full" />
                  <div className="h-3 w-28 bg-slate-100 rounded-full" />
                </div>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full mb-4" />
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-slate-100 rounded-full" />
                <div className="h-5 w-20 bg-slate-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (selectedJudge) return renderProfile();

    switch (activeSubView) {
      case 'Court insights':
        return renderCourtInsights();
      case 'Case tracker':
        return renderCaseTracker();
      case 'Judge directory':
      default:
        return renderDirectory();
    }
  };

  const renderDirectory = () => (
    <motion.div 
      key="directory"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="p-8 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-primary rounded-xl shadow-md">
              <Gavel className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Know Your Judge</h1>
          </div>
          <p className="text-lg text-blue-900 font-bold max-w-2xl leading-relaxed">
            Behavioral analytics and outcome forecasting for the East African Bench.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center w-full xl:w-auto">
          {/* Filters in Dropdowns */}
          <div className="flex gap-3 w-full sm:w-auto">
            <select 
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all w-full sm:w-40"
              value={jurisdictionFilter}
              onChange={(e) => setJurisdictionFilter(e.target.value)}
            >
              {JURISDICTIONS.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
            
            <select 
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all w-full sm:w-40"
              value={courtFilter}
              onChange={(e) => setCourtFilter(e.target.value)}
            >
              {COURTS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search by judge name or court..."
              className="pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 w-full font-bold shadow-sm transition-all text-slate-900 placeholder:text-slate-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Judge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredJudges.length > 0 ? filteredJudges.map((judge, idx) => (
          <motion.div
            key={judge.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => setSelectedJudge(judge)}
            className="group bg-slate-50 border border-slate-200 rounded-2xl p-10 cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:border-primary/20 transition-all duration-500 relative overflow-hidden flex flex-col"
          >
            {/* Top row: avatar + name */}
            <div className="flex items-start gap-6 mb-8">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden border-4 border-slate-50 group-hover:border-primary/20 transition-all shadow-md">
                  <img src={judge.image} alt={judge.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                {judge.winRate > 60 && (
                  <div className="absolute -top-2 -right-2 bg-emerald-500 rounded-xl p-2 border-2 border-white shadow-lg z-20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors tracking-tight leading-tight">{judge.name}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5">{judge.title}</p>
                {/* Jurisdiction badge */}
                <span className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-[9px] font-black text-blue-600 uppercase tracking-widest">
                  <Globe className="w-3 h-3" />
                  {judge.jurisdiction}
                </span>
              </div>
            </div>

            {/* Win rate progress bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Historical Favorability</span>
                <span className={`text-2xl font-black tracking-tighter ${judge.winRate > 60 ? 'text-emerald-500' : judge.winRate > 45 ? 'text-amber-500' : 'text-primary'}`}>{judge.winRate}%</span>
              </div>
              <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${judge.winRate}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: idx * 0.05 + 0.3 }}
                  className={`h-full rounded-full shadow-lg ${judge.winRate > 60 ? 'bg-emerald-500 shadow-emerald-500/20' : judge.winRate > 45 ? 'bg-amber-400 shadow-amber-400/20' : 'bg-primary shadow-primary/20'}`}
                />
              </div>
              <div className="flex justify-between mt-3 text-slate-400">
                <span className="text-[9px] font-black uppercase tracking-widest">{judge.totalCases} Judgments</span>
                <span className="text-[9px] font-black uppercase tracking-widest">{judge.court}</span>
              </div>
            </div>

            {/* Specialty tags */}
            {judge.rulingTendencies && judge.rulingTendencies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-auto pt-8 border-t border-slate-50">
                {judge.rulingTendencies.slice(0, 2).map(t => (
                  <span key={t.category} className="px-3 py-1.5 bg-slate-50 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-100">
                    {t.category}
                  </span>
                ))}
              </div>
            )}

            <div className="absolute bottom-8 right-10 p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-300 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-300">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

        )) : (
          <div className="col-span-full py-32 text-center bg-white border border-dashed border-slate-200 rounded-2xl">
            <Scale className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No results found</p>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderCourtInsights = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 max-w-7xl mx-auto space-y-10"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-xl shadow-md text-white">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Court Insights</h1>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Institutional analysis & Bench metrics</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm">
          <Globe className="w-4 h-4 text-slate-400" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">East African Community (EAC)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: 'Total Benches', value: '42', detail: '+4 New divisions', color: 'text-slate-900', icon: Scale, accent: 'border-l-blue-500' },
          { label: 'Matter Volume', value: '1.2M', detail: '8% Annual growth', color: 'text-slate-900', icon: FileText, accent: 'border-l-purple-500' },
          { label: 'Avg. Lead Time', value: '14m', detail: '-15% Efficiency gain', color: 'text-emerald-600', icon: Clock, accent: 'border-l-emerald-500' },
          { label: 'Clearance Rate', value: '94%', detail: 'Gold Standard', color: 'text-primary', icon: CheckCircle2, accent: 'border-l-primary' },
        ].map((stat, i) => (
          <div key={i} className={`bg-slate-50 border border-slate-200 rounded-xl p-8 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all min-h-[140px] flex flex-col justify-between`}>
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-slate-50 rounded-xl"><stat.icon className="w-4 h-4 text-slate-400" /></div>
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{stat.label}</span>
            </div>
            <div>
              <p className={`text-3xl font-bold tracking-tight leading-none mb-1 ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{stat.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recharts BarChart: Court Favorability */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" /> Court Favorability Comparison
          </h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Commercial HC', value: 72 },
                  { name: 'Land Court', value: 58 },
                  { name: 'Employment', value: 84 },
                  { name: 'Constitutional', value: 45 },
                ]}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
                <Tooltip
                  formatter={(v) => [`${v}%`, 'Favorability']}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: 12 }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {[72, 58, 84, 45].map((val, i) => (
                    <Cell key={i} fill={val >= 70 ? '#10b981' : val >= 55 ? '#ef4444' : '#f59e0b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recharts AreaChart: Procedural Efficiency */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Procedural Efficiency</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Days from filing to first hearing</p>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={[
                  { div: 'DIV-1', days: 45 },
                  { div: 'DIV-2', days: 120 },
                  { div: 'DIV-3', days: 30 },
                  { div: 'DIV-4', days: 90 },
                  { div: 'DIV-5', days: 60 },
                  { div: 'DIV-6', days: 150 },
                ]}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="effGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="div" tick={{ fontSize: 11, fontWeight: 700, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} unit="d" />
                <Tooltip
                  formatter={(v) => [`${v} days`, 'Lead Time']}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: 12 }}
                />
                <Area type="monotone" dataKey="days" stroke="#ef4444" strokeWidth={2.5} fill="url(#effGrad)" dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
            <p className="text-[10px] text-blue-900 font-bold">Data based on last 5,000 filings</p>
            <button className="text-[9px] font-bold text-primary uppercase tracking-widest border-b border-primary/20 hover:border-primary transition-all pb-0.5">Full Audit Log</button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderCaseTracker = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-7xl mx-auto space-y-10"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-900 rounded-xl shadow-md text-white">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Case Tracker</h1>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Live updates from Registry</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all">Export Report</button>
          <button className="px-5 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">Add new case</button>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Hash className="w-4 h-4 text-slate-400" />
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Monitored Cases</h3>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Live Monitoring</span>
             </div>
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {[
            { id: 'MA-001', name: 'Alber & Co vs State Dept', status: 'Hearing Set', date: 'Mar 28, 2026', judge: 'Hon. Justice Mabeya', priority: 'High' },
            { id: 'CS-442', name: 'Digital Rights Initiative vs Telco-X', status: 'Judgment Date', date: 'Apr 05, 2026', judge: 'Hon. Justice Thande', priority: 'Medium' },
            { id: 'ELC-102', name: 'Greenway Estate vs Municipal Council', status: 'Submissions', date: 'Mar 25, 2026', judge: 'Hon. Justice Angote', priority: 'Low' },
            { id: 'APP-099', name: 'Central Bank vs Forex Bureau Ltd', status: 'Final Review', date: 'Apr 12, 2026', judge: 'Justice Murgor', priority: 'High' },
          ].map((item) => (
            <div key={item.id} className="p-8 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-6 mb-4 sm:mb-0">
                <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-[10px] group-hover:border-primary/20 group-hover:text-primary shadow-sm transition-all">
                  {item.id}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors">{item.name}</h4>
                  <div className="flex items-center gap-3 mt-1.5">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{item.judge}</p>
                    <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${item.priority === 'High' ? 'text-primary' : 'text-slate-400'}`}>
                      {item.priority} Priority
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-12">
                <div className="text-right">
                   <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                     item.status === 'Judgment Date' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                     item.status === 'Hearing Set' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                     'bg-slate-50 text-gray-600 border-slate-100'
                   }`}>{item.status}</span>
                   <div className="flex items-center justify-end gap-2 mt-2.5">
                      <Clock className="w-3 h-3 text-slate-300" />
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.date}</p>
                   </div>
                </div>
                <button className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-primary hover:border-primary/20 hover:shadow-md transition-all">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-10 bg-primary/5 rounded-3xl border border-primary/10 flex items-center gap-8 group">
          <div className="p-4 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Registry Monitoring</h3>
            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              Real-time synchronization with Kenya Law (eKLR) and Uganda Legal Information Institute.
            </p>
          </div>
        </div>
        <div className="p-10 bg-gray-900 rounded-3xl border border-gray-800 flex items-center gap-8 group">
          <div className="p-4 bg-gray-800 text-amber-400 rounded-2xl shadow-xl group-hover:scale-105 transition-transform">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Automated Alerts</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Get notified via WhatsApp or Email as soon as a ruling is uploaded or dates are changed.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderProfile = () => {
    if (!selectedJudge) return null;
    return (
      <motion.div 
        key="profile"
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: 10 }}
        className="pb-32"
      >
        {/* Action Hub Top Bar */}
        <div className="bg-white border-b border-slate-100 sticky top-0 z-50 px-10 py-6 shadow-sm">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-8">
              <button 
                onClick={() => setSelectedJudge(null)}
                className="flex items-center gap-3 group px-4 py-2 hover:bg-slate-50 rounded-xl transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-900">Return to Directory</span>
              </button>
              <div className="h-8 w-px bg-slate-100"></div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-slate-900 leading-tight flex items-center gap-3">
                  {selectedJudge.name}
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-100">Verified Bench Data</span>
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{selectedJudge.court}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                <button className="px-5 py-2.5 bg-white shadow-sm rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 border border-slate-100 hover:shadow-md transition-all flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                  Live Analysis
                </button>
              </div>

              <div className="h-6 w-px bg-slate-200 mx-2"></div>
              
              <div className="flex gap-2">
                <button className="h-11 px-6 bg-slate-900 text-white rounded-xl flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                  <FileText className="w-4 h-4" /> Save to Vault
                </button>
                <button className="h-11 px-6 bg-white border border-slate-200 text-slate-900 rounded-xl flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">
                  <Share2 className="w-4 h-4" /> Share
                </button>
                
                {/* Cloud Drive Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <button className="h-11 w-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-all group relative">
                    <GoogleDriveIcon />
                    <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900 text-white text-[9px] font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all">Google Drive</span>
                  </button>
                  <button className="h-11 w-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-all group relative">
                    <OneDriveIcon />
                    <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900 text-white text-[9px] font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all">OneDrive</span>
                  </button>
                </div>

                <button 
                  onClick={() => setIsDrawerOpen(true)}
                  className="h-11 px-6 bg-primary text-white rounded-xl flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 ml-4"
                >
                  <Sparkles className="w-4 h-4" /> Ask Insight AI
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto p-10">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
             
             {/* Left Profile Panel (3 Cols) */}
             <div className="xl:col-span-3 space-y-10">
                <div className="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-sm text-center relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                   <div className="relative w-40 h-40 mx-auto mb-8">
                      <img src={selectedJudge.image} alt="" className="w-full h-full object-cover rounded-[2rem] border-8 border-slate-50 shadow-xl group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute -bottom-3 -right-3 bg-emerald-500 p-3.5 rounded-2xl border-4 border-white shadow-2xl">
                         <Scale className="w-5 h-5 text-white" />
                      </div>
                   </div>

                   <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">{selectedJudge.name}</h2>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">{selectedJudge.jurisdiction} · {selectedJudge.court}</p>
                   
                   <div className="flex flex-wrap justify-center gap-3 mb-10">
                      <span className="px-4 py-1.5 rounded-xl bg-slate-50 text-slate-900 text-[10px] font-black uppercase tracking-widest border border-slate-100">Appellate Rank</span>
                      <span className="px-4 py-1.5 rounded-xl bg-slate-50 text-slate-900 text-[10px] font-black uppercase tracking-widest border border-slate-100">Civil Chamber</span>
                   </div>

                   <div className="text-left bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 relative">
                      <div className="absolute top-4 right-6 p-2 bg-white rounded-lg shadow-sm">
                        <Award className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <p className="text-[10px] font-black text-slate-900/30 uppercase tracking-[0.2em] mb-4">Professional Biography</p>
                      <p className="text-sm text-slate-900 leading-relaxed font-medium">
                        {selectedJudge.bio || `Senior jurist with specialized expertise in commercial litigation. Known for strict adherence to procedural timelines and evidence-based rulings.`}
                      </p>
                   </div>
                </div>

                {/* Outcome DNA Breakdown (Now with Perspective Switcher) */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <p className="text-[11px] font-black text-slate-900/30 uppercase tracking-[0.3em]">Outcome DNA</p>
                    <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                      {[
                        { id: 'career', label: 'All' },
                        { id: 'recent', label: '24M' },
                        { id: 'jurisdiction', label: 'Reg' }
                      ].map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setGraphPerspective(p.id as any)}
                          className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${
                            graphPerspective === p.id 
                              ? 'bg-white text-slate-900 shadow-sm border border-slate-100' 
                              : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                   <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 text-center">Outcome DNA Breakdown</h3>
                   <div className="h-56 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={outcomeData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={75}
                            paddingAngle={6}
                            dataKey="value"
                            stroke="none"
                          >
                            {outcomeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                            <Label 
                              value={`${selectedJudge.winRate}%`} 
                              position="center" 
                              className="text-2xl font-bold fill-gray-900" 
                            />
                          </Pie>
                          <Tooltip 
                            contentStyle={{ borderRadius: '0.75rem', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                            itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="grid grid-cols-3 gap-2 mt-6">
                      {outcomeData.map(item => (
                        <div key={item.name} className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full mb-1.5" style={{ backgroundColor: item.color }}></div>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider text-center">{item.name}</span>
                          <span className="text-xs font-bold text-slate-900 mt-0.5">{item.value}%</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
             {/* Middle Panel */}
             <div className="xl:col-span-9 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <StatCard label="Analyzed Judgments" value={selectedJudge.totalCases} subtext="Deep Intelligence Data" icon={BookOpen} colorClass="text-primary" gradient="bg-primary" />
                   <StatCard label="Judicial Tenure" value={`${selectedJudge.yearsExperience}Y`} subtext="Years on the Bench" icon={Calendar} colorClass="text-purple-600" gradient="bg-purple-600" />
                </div>

                {/* Tab Switcher */}
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-3 flex gap-2 shadow-sm">
                   {[
                     { id: 'tendencies', label: 'Tendency', icon: TrendingUp },
                     { id: 'insights', label: 'Tactics', icon: Zap },
                     { id: 'citations', label: 'Citations', icon: BookOpen },
                     { id: 'predictor', label: 'Predictor', icon: Sparkles }
                   ].map((tab) => (
                     <button
                       key={tab.id}
                       onClick={() => setActiveTab(tab.id as any)}
                       className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all ${
                         activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                       }`}
                     >
                       <tab.icon className="w-4 h-4" />
                       {tab.label}
                     </button>
                   ))}
                </div>

                <div className="min-h-[500px]">
                   <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {activeTab === 'insights' && (
                          <div className="space-y-8">
                             {selectedJudge.insights.map((insight, i) => (
                               <div key={i} className="bg-white border border-slate-100 rounded-[2rem] p-10 shadow-sm flex flex-col md:flex-row gap-10 items-start group">
                                  <div className={`p-5 rounded-2xl ${i % 2 === 0 ? 'bg-primary/5 text-primary' : 'bg-emerald-50 text-emerald-600'} transition-colors group-hover:bg-white group-hover:shadow-lg border border-transparent group-hover:border-slate-100`}>
                                     {i % 2 === 0 ? <Sparkles className="w-6 h-6" /> : <Gavel className="w-6 h-6" />}
                                  </div>
                                  <div className="flex-1">
                                     <p className="text-[10px] font-black text-slate-900/30 uppercase tracking-[0.3em] mb-4">{i % 2 === 0 ? 'Bench Insight' : 'Procedural Pattern'}</p>
                                     <p className="text-lg text-slate-900 font-bold leading-relaxed">{insight}</p>
                                  </div>
                                  <button className="self-center px-6 py-3 bg-slate-50 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-900 hover:text-white transition-all border border-slate-100">
                                     View Precedents
                                  </button>
                               </div>
                             ))}
                          </div>
                        )}

                        {activeTab === 'predictor' && <OutcomePredictor judge={selectedJudge} />}

                        {activeTab === 'tendencies' && (
                          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-12 shadow-sm">
                             <h3 className="text-xl font-bold text-slate-900 mb-10 flex items-center gap-3">
                                <TrendingUp className="w-6 h-6 text-primary" />
                                Matter Category Favorability
                             </h3>
                             <div className="space-y-10">
                                {selectedJudge.rulingTendencies.map((tendency, i) => (
                                  <div key={i} className="space-y-3">
                                     <div className="flex justify-between items-end">
                                        <div>
                                           <p className="text-sm font-bold text-slate-900 mb-1">{tendency.category}</p>
                                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tendency.allowed + tendency.dismissed} Related Matters</p>
                                        </div>
                                        <div className="text-right">
                                           <span className="text-2xl font-bold text-slate-900">{Math.round((tendency.allowed / (tendency.allowed + tendency.dismissed)) * 100)}%</span>
                                           <span className="text-[10px] font-black text-emerald-600 uppercase ml-2 tracking-widest">Favorable</span>
                                        </div>
                                     </div>
                                     <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${(tendency.allowed / (tendency.allowed + tendency.dismissed)) * 100}%` }} className="h-full bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/20" />
                                     </div>
                                  </div>
                                ))}
                             </div>
                          </div>
                        )}

                        {activeTab === 'citations' && (
                          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-12 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-900 mb-10 flex items-center gap-3">
                               <BookOpen className="w-6 h-6 text-primary" />
                               Frequently Cited Authorities
                            </h3>
                            <div className="space-y-10">
                                {selectedJudge.commonCitations.map((cite, idx) => (
                                  <div key={idx} className="space-y-4">
                                     <div className="flex justify-between items-center">
                                        <div>
                                           <p className="text-lg font-bold text-slate-900 mb-1">{cite.caseName}</p>
                                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cite.type}</p>
                                        </div>
                                        <span className="text-3xl font-bold text-slate-900">{cite.count}×</span>
                                     </div>
                                     <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${(cite.count / 50) * 100}%` }} className="h-full bg-primary rounded-full shadow-lg shadow-primary/20" />
                                     </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                   </AnimatePresence>
                </div>

                {/* High Impact Decisions */}
                <div className="space-y-8 pt-10 border-t border-slate-100">
                   <div className="flex items-center justify-between px-4">
                      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                         <FileText className="w-6 h-6 text-primary" />
                         High-Impact Decisions
                      </h3>
                      <button className="text-[11px] font-black text-primary uppercase tracking-[0.2em] hover:underline">View All Registry</button>
                   </div>
                   <div className="space-y-6">
                      {selectedJudge.recentRulings.map((ruling) => (
                        <div key={ruling.id} className="bg-white border border-slate-100 rounded-[2rem] p-10 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
                            <div className="flex items-center gap-6">
                              <div className={`p-4 rounded-2xl ${ruling.outcome === 'Allowed' ? 'bg-emerald-50 text-emerald-600' : 'bg-primary/5 text-primary'} transition-all group-hover:scale-110`}>
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-primary transition-colors mb-1">{ruling.caseName}</h4>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{ruling.date} · {ruling.caseType}</span>
                              </div>
                            </div>
                            <div className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${ruling.outcome === 'Allowed' ? 'bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-500/20' : 'bg-primary text-white border-primary-hover shadow-lg shadow-primary/20'}`}>
                              {ruling.outcome}
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed font-medium mb-8 relative z-10 pr-10 border-l-4 border-slate-100 pl-6">
                            {ruling.summary}
                          </p>
                          <div className="flex items-center justify-between pt-8 border-t border-slate-100 relative z-10">
                             <div className="flex items-center gap-6">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                   <Globe className="w-3.5 h-3.5" /> Published Authority
                                </span>
                             </div>
                             <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 group/btn hover:translate-x-1 transition-transform">
                                Full Analysis <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                             </button>
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* --- Branded Side Drawer (Ask Insight AI) --- */}
        <AnimatePresence>
          {isDrawerOpen && (
            <>
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDrawerOpen(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
              />
              
              {/* Drawer */}
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-[101] flex flex-col border-l border-slate-100 transition-all duration-500 ${
                  isDrawerExpanded ? 'w-2/3' : 'w-[450px]'
                }`}
              >
                {/* Drawer Header */}
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/20">
                         <Scale className="w-5 h-5" />
                      </div>
                      <div>
                         <div className="flex items-center gap-2">
                           <span className="text-sm font-black uppercase tracking-widest text-slate-900">Lawlify AI</span>
                           <span className="text-[10px] font-bold text-slate-400">Insight Hub</span>
                         </div>
                         <h4 className="text-xs font-bold text-slate-500">context: {selectedJudge.name}</h4>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setIsDrawerExpanded(!isDrawerExpanded)}
                        className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"
                      >
                        <Layers className={`w-4 h-4 text-slate-400 ${isDrawerExpanded ? 'rotate-90' : ''}`} />
                      </button>
                      <button 
                        onClick={() => setIsDrawerOpen(false)}
                        className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"
                      >
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </button>
                   </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                   {chatMessages.map((msg, i) => (
                     <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-5 rounded-2xl text-sm font-medium leading-relaxed ${
                          msg.role === 'user' 
                            ? 'bg-primary text-white shadow-lg shadow-primary/20 rounded-br-none' 
                            : 'bg-slate-50 text-slate-900 border border-slate-100 rounded-bl-none'
                        }`}>
                           {msg.content}
                        </div>
                     </div>
                   ))}
                </div>

                {/* Chat Input */}
                <div className="p-8 border-t border-slate-100 bg-white">
                   <form onSubmit={handleChatSubmit} className="relative">
                      <input 
                        type="text"
                        placeholder="Ask about biases, tactics, specific cases..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-6 pr-16 py-5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                      />
                      <button 
                        type="submit"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center hover:scale-105 transition-all shadow-lg shadow-primary/20"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                   </form>
                   <p className="text-[10px] text-center mt-6 font-bold text-slate-400 uppercase tracking-widest">
                      Powered by Lawlify Judicial Engine
                   </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="h-full bg-slate-50 overflow-y-auto no-scrollbar selection:bg-primary/10">
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-12 py-12 border-t border-slate-100 flex flex-col items-center opacity-30">
         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Lawlify Judicial Analytics v2.6</p>
      </div>
    </div>
  );
};

export default JudicialAnalytics;
