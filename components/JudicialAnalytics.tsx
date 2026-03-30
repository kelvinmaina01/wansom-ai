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
  Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer,
  Label
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

// --- Sub-Components ---

const StatCard = ({ label, value, subtext, icon: Icon, colorClass }: any) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-md hover:-translate-y-1 flex flex-col justify-between hover:shadow-md transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2.5 rounded-xl bg-gray-50`}>
        <Icon className={`w-5 h-5 ${colorClass}`} />
      </div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
    </div>
    <div>
      <h3 className="text-4xl font-bold tracking-tight text-gray-900 leading-none">{value}</h3>
      <p className="text-xs text-blue-800 mt-2 font-bold">{subtext}</p>
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
      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-gray-900 mb-1">Predict outcome for your case type</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-8">Select a matter category to see historical favorability</p>
          
          <div className="relative max-w-sm mb-10">
            <select 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-6 py-3 text-sm appearance-none focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold text-gray-900"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Select case type...</option>
              {CASE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          <AnimatePresence mode="wait">
            {prediction && (
              <motion.div 
                key="prediction"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left"
              >
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 flex flex-col items-center justify-center">
                  <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                     <svg className="w-full h-full -rotate-90">
                      <circle cx="80" cy="80" r="70" stroke="#e5e7eb" strokeWidth="10" fill="transparent" />
                      <circle 
                        cx="80" cy="80" r="70" 
                        stroke={prediction.allowed > 60 ? '#10b981' : (prediction.allowed > 40 ? '#fbbf24' : '#ef4444')} 
                        strokeWidth="10" 
                        fill="transparent" 
                        strokeDasharray={440} 
                        strokeDashoffset={440 - (440 * prediction.allowed) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-gray-900">{prediction.allowed}%</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Success Rate</span>
                    </div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${prediction.allowed > 50 ? 'bg-emerald-100 text-emerald-700' : 'bg-primary/10 text-primary'}`}>
                    {prediction.allowed > 65 ? 'Favorable Bench' : (prediction.allowed > 35 ? 'Neutral Bench' : 'Hostile Bench')}
                  </div>
                </div>

                <div className="space-y-4">
                   <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex gap-4 items-start">
                      <div className="p-2.5 bg-primary/5 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-gray-900 mb-1 leading-none">Statistical Insights</h5>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          Success probability relative to general court average for {selectedType.split(' ')[0]} matters.
                        </p>
                      </div>
                   </div>
                   <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex gap-4 items-start">
                      <div className="p-2.5 bg-amber-50 rounded-lg">
                        <Gavel className="w-4 h-4 text-amber-500" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-gray-900 mb-1 leading-none">Counsel Recommendation</h5>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {prediction.allowed > 60 
                            ? "Leverage strong precedents. The court responds well to historical appellate decisions." 
                            : "Prioritize oral advocacy. Attempt to humanize the case as the purely technical merit has a high dismissal rate."}
                        </p>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-primary text-white rounded-2xl p-8 relative overflow-hidden group shadow-lg border border-white/10">
        <div className="relative z-10 flex gap-6 items-start">
          <div className="p-3 bg-white/10 rounded-xl border border-white/20">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold mb-2 tracking-tight">How to use this tool</h4>
            <p className="text-sm text-white/80 leading-relaxed font-medium pr-6">
              The outcome predictor shows the historical success rate of similares matters before this officer. Use this to inform your filing strategy and client advisory.
            </p>
            <div className="grid grid-cols-2 gap-8 mt-6 pt-6 border-t border-white/10">
               <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center p-1 bg-gray-900 text-[9px] font-bold">!</div>
                  <p className="text-[10px] text-white/60 font-medium">Below 30% is "hostile" — consider negotiating.</p>
               </div>
               <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center p-1 bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">✓</div>
                  <p className="text-[10px] text-white/60 font-medium">Above 65% is "favorable" — proceed with confidence.</p>
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

  // AI Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    {role: 'assistant', content: 'Hello! I am analyzing this judge. Ask me questions about their tendencies, specific rulings, or precedents.'}
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
    return [
      { name: 'Allowed', value: selectedJudge.winRate, color: '#10b981' },
      { name: 'Dismissed', value: Math.max(0, 100 - selectedJudge.winRate - 15), color: '#ef4444' },
      { name: 'Partial', value: 15, color: '#fbbf24' },
    ];
  }, [selectedJudge]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
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
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Know Your Judge</h1>
          </div>
          <p className="text-lg text-blue-900 font-bold max-w-2xl leading-relaxed">
            Behavioral analytics and outcome forecasting for the East African Bench.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center w-full xl:w-auto">
          {/* Filters in Dropdowns */}
          <div className="flex gap-3 w-full sm:w-auto">
            <select 
              className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all w-full sm:w-40"
              value={jurisdictionFilter}
              onChange={(e) => setJurisdictionFilter(e.target.value)}
            >
              {JURISDICTIONS.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
            
            <select 
              className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all w-full sm:w-40"
              value={courtFilter}
              onChange={(e) => setCourtFilter(e.target.value)}
            >
              {COURTS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="relative w-full sm:w-64 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search judge..."
              className="pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 w-full font-bold shadow-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Judge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJudges.length > 0 ? filteredJudges.map((judge, idx) => (
          <motion.div
            key={judge.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => setSelectedJudge(judge)}
            className="group bg-white border border-gray-100 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 relative overflow-hidden"
          >
            <div className="flex items-center gap-5 mb-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 group-hover:border-primary/20 transition-all">
                  <img src={judge.image} alt={judge.name} className="w-full h-full object-cover" />
                </div>
                {judge.winRate > 60 && (
                  <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 rounded-full p-1 border-2 border-white shadow-sm z-20">
                    <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors tracking-tight">{judge.name}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">{judge.title}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Success Rate</p>
                <span className={`text-2xl font-bold ${judge.winRate > 50 ? 'text-emerald-500' : 'text-primary'}`}>{judge.winRate}%</span>
              </div>
              <div className="pl-4 border-l border-gray-50">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Cases</p>
                <span className="text-2xl font-bold text-gray-900">{judge.totalCases}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                 <Globe className="w-3 h-3 text-gray-300" />
                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{judge.jurisdiction}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full py-32 text-center bg-white border border-dashed border-gray-200 rounded-2xl">
            <Scale className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No results found</p>
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
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Court Insights</h1>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Institutional analysis & Bench metrics</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm">
          <Globe className="w-4 h-4 text-gray-400" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">East African Community (EAC)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Benches', value: '42', detail: '+4 New divisions', color: 'text-gray-900', icon: Scale },
          { label: 'Matter Volume', value: '1.2M', detail: '8% Annual growth', color: 'text-gray-900', icon: FileText },
          { label: 'Avg. Lead Time', value: '14m', detail: '-15% Efficiency gain', color: 'text-emerald-600', icon: Clock },
          { label: 'Clearance Rate', value: '94%', detail: 'Gold Standard', color: 'text-primary', icon: CheckCircle2 },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-md hover:-translate-y-1 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-gray-50 rounded-lg"><stat.icon className="w-4 h-4 text-gray-400" /></div>
              <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{stat.label}</span>
            </div>
            <p className={`text-3xl font-bold tracking-tight ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-wide">{stat.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" /> Court Favorability Comparison
          </h3>
          <div className="space-y-8">
            {[
              { name: 'Commercial High Court', value: 72, color: 'bg-emerald-500' },
              { name: 'Environment & Land Court', value: 58, color: 'bg-primary' },
              { name: 'Employment Court', value: 84, color: 'bg-amber-500' },
              { name: 'Constitutional Division', value: 45, color: 'bg-purple-500' },
            ].map((court) => (
              <div key={court.name} className="group">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">{court.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900">{court.value}%</span>
                    <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">Favorability</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${court.value}%` }}
                    className={`h-full ${court.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Procedural Efficiency</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-10">Days from filing to first hearing</p>
          
          <div className="relative h-64 flex items-end justify-between px-2">
            {[45, 120, 30, 90, 60, 150].map((val, i) => (
              <div key={i} className="flex flex-col items-center gap-4 w-full">
                <div className="relative w-full px-2 flex flex-col items-center">
                   <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    className={`w-full max-w-[40px] rounded-t-lg shadow-sm ${val > 100 ? 'bg-primary/20' : 'bg-primary'}`}
                   />
                   <span className="text-[10px] font-bold text-gray-900 mt-2">{val}d</span>
                </div>
                <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">DIV-{i+1}</span>
              </div>
            ))}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gray-100"></div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center">
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
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Case Tracker</h1>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Live updates from Registry</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-gray-50 transition-all">Export Report</button>
          <button className="px-5 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">Add new case</button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Hash className="w-4 h-4 text-gray-400" />
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Monitored Cases</h3>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Live Monitoring</span>
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
            <div key={item.id} className="p-8 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-6 mb-4 sm:mb-0">
                <div className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 font-bold text-[10px] group-hover:border-primary/20 group-hover:text-primary shadow-sm transition-all">
                  {item.id}
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors">{item.name}</h4>
                  <div className="flex items-center gap-3 mt-1.5">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{item.judge}</p>
                    <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${item.priority === 'High' ? 'text-primary' : 'text-gray-400'}`}>
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
                     'bg-gray-50 text-gray-600 border-gray-100'
                   }`}>{item.status}</span>
                   <div className="flex items-center justify-end gap-2 mt-2.5">
                      <Clock className="w-3 h-3 text-gray-300" />
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.date}</p>
                   </div>
                </div>
                <button className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-300 hover:text-primary hover:border-primary/20 hover:shadow-md transition-all">
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">Registry Monitoring</h3>
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
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
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
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-50 px-8 py-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button 
              onClick={() => setSelectedJudge(null)}
              className="flex items-center gap-2.5 group"
            >
              <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-900">Directory</span>
            </button>
            
            <div className="flex items-center gap-6">
              <div className="flex gap-2">
                <button className="w-9 h-9 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-all border border-gray-100">
                  <Share2 className="w-3.5 h-3.5 text-gray-500" />
                </button>
                <button className="w-9 h-9 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-all border border-gray-100">
                  <Download className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>
              <div className="h-4 w-px bg-gray-100"></div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900 block leading-none">{selectedJudge.name}</span>
                <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest block mt-1">Verified Data</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-8">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
             
             {/* Left Panel */}
             <div className="xl:col-span-3 space-y-8">
                <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm text-center">
                   <div className="relative w-32 h-32 mx-auto mb-6">
                      <img src={selectedJudge.image} alt="" className="w-full h-full object-cover rounded-2xl border-4 border-gray-50 shadow-md" />
                      <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2.5 rounded-lg border-2 border-white shadow-md">
                         <Scale className="w-4 h-4 text-white" />
                      </div>
                   </div>

                   <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedJudge.name}</h2>
                   <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-6">{selectedJudge.jurisdiction} · {selectedJudge.court}</p>
                   
                   <div className="flex flex-wrap justify-center gap-2 mb-8">
                      <span className="px-3 py-1 rounded-lg bg-gray-50 text-gray-600 text-[9px] font-bold uppercase tracking-widest border border-gray-100">Appellate Rank</span>
                      <span className="px-3 py-1 rounded-lg bg-gray-50 text-gray-600 text-[9px] font-bold uppercase tracking-widest border border-gray-100">Civil Chamber</span>
                   </div>

                   <div className="text-left bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Professional Biography</p>
                      <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                        {selectedJudge.bio || `Senior jurist with specialized expertise in commercial litigation. Known for strict adherence to procedural timelines and evidence-based rulings.`}
                      </p>
                   </div>
                </div>

                {/* DNA */}
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                   <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8 text-center">Outcome DNA Breakdown</h3>
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
                          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider text-center">{item.name}</span>
                          <span className="text-xs font-bold text-gray-900 mt-0.5">{item.value}%</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Middle Panel */}
             <div className="xl:col-span-5 space-y-8">
                
                {/* Metrics */}
                <div className="grid grid-cols-2 gap-6">
                  <StatCard 
                    label="Analyzed" 
                    value={selectedJudge.totalCases} 
                    subtext="Judgments in Database"
                    icon={Building} 
                    colorClass="text-primary"
                  />
                  <StatCard 
                    label="Tenure" 
                    value={`${selectedJudge.yearsExperience}Y`} 
                    subtext="Years on the Bench"
                    icon={Calendar} 
                    colorClass="text-emerald-500"
                  />
                </div>

                {/* Tabs / Toggles - Professional Style */}
                <div className="bg-gray-100 p-1.5 rounded-xl flex shadow-inner">
                  {[
                    { id: 'tendencies', label: 'Tendency', icon: BarChart3 },
                    { id: 'insights', label: 'Tactics', icon: TrendingUp },
                    { id: 'citations', label: 'Citations', icon: BookOpen },
                    { id: 'predictor', label: 'Predictor', icon: Sparkles },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-lg transition-all ${
                        activeTab === tab.id 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-primary' : ''}`} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="min-h-[450px]"
                  >
                    {activeTab === 'tendencies' && (
                       <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                         <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-10 text-center">Ruling Probability by Legal Matter</h3>
                         <div className="space-y-8">
                           {selectedJudge.rulingTendencies.map((tendency, idx) => (
                             <div key={tendency.category}>
                               <div className="flex justify-between items-end mb-2">
                                 <span className="text-base font-bold text-gray-900 tracking-tight">{tendency.category}</span>
                                 <div className="text-right">
                                   <span className={`text-xl font-bold ${tendency.allowed > 50 ? 'text-emerald-500' : 'text-primary'}`}>{tendency.allowed}%</span>
                                   <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest ml-1.5">Allowed</span>
                                 </div>
                               </div>
                               <div className="h-2.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                 <motion.div 
                                   initial={{ width: 0 }}
                                   animate={{ width: `${tendency.allowed}%` }}
                                   className={`h-full rounded-full ${tendency.allowed > 60 ? 'bg-emerald-500' : (tendency.allowed > 40 ? 'bg-amber-500' : 'bg-primary')}`}
                                 />
                               </div>
                             </div>
                           ))}
                         </div>
                       </div>
                    )}

                    {activeTab === 'insights' && (
                      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                         <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8 text-center">Procedural Tactics and Patterns</h3>
                         <div className="grid grid-cols-1 gap-4">
                          {selectedJudge.insights.map((insight, i) => (
                            <div key={i} className="bg-gray-50 border border-gray-100 p-6 rounded-xl flex gap-6 items-start">
                              <div className={`p-3 rounded-lg shrink-0 ${i % 2 === 0 ? 'bg-primary/10 text-primary' : 'bg-emerald-50 text-emerald-600'}`}>
                                <Sparkles className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Bench Insight</p>
                                <p className="text-sm font-bold text-gray-900 leading-snug">{insight}</p>
                              </div>
                            </div>
                          ))}
                         </div>
                      </div>
                    )}

                    {activeTab === 'citations' && (
                      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-10 text-center">Frequently Cited Authorities</h3>
                        <div className="space-y-8">
                          {selectedJudge.commonCitations.map((cite, idx) => (
                            <div key={cite.caseName}>
                              <div className="flex justify-between items-center mb-3">
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-gray-900 tracking-tight">{cite.caseName}</span>
                                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{cite.type}</span>
                                </div>
                                <span className="text-3xl font-bold text-gray-900">{cite.count}×</span>
                              </div>
                              <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(cite.count / 40) * 100}%` }}
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: CITATION_COLORS[idx % CITATION_COLORS.length] }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-10 pt-6 border-t border-gray-50 flex justify-center">
                           <button className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-lg font-bold text-[9px] uppercase tracking-widest hover:bg-primary transition-all">
                              <FileText className="w-3.5 h-3.5 text-emerald-400" /> Full Registry <ExternalLink className="w-3 h-3 ml-1 opacity-40" />
                           </button>
                        </div>
                      </div>
                    )}

                    {activeTab === 'predictor' && (
                       <div className="w-full">
                          <OutcomePredictor judge={selectedJudge} />
                       </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Recent Rulings */}
                <div className="space-y-6">
                   <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">High-Impact Decisions</h3>
                   <div className="space-y-4">
                      {selectedJudge.recentRulings.map((ruling) => (
                        <div key={ruling.id} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-md hover:-translate-y-1 hover:shadow-md transition-all group">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3.5">
                              <div className={`p-2.5 rounded-xl ${ruling.outcome === 'Allowed' ? 'bg-emerald-50 text-emerald-600' : 'bg-primary/5 text-primary'}`}>
                                <FileText className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-base font-bold text-gray-900 tracking-tight group-hover:text-primary transition-colors">{ruling.caseName}</h4>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{ruling.date} · {ruling.caseType}</span>
                              </div>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${ruling.outcome === 'Allowed' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-primary/10 text-primary border-primary/20'}`}>
                              {ruling.outcome}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed font-medium mb-5">
                            {ruling.summary}
                          </p>
                          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                               <Globe className="w-3 h-3" /> Published Authority
                            </span>
                            <button className="text-[9px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5 hover:underline transition-all">
                              Source <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Right Panel - AI Follow Up Chat */}
             <div className="xl:col-span-4 space-y-6 flex flex-col h-[800px] bg-white rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="p-6 bg-gradient-to-br from-gray-900 to-black border-b border-gray-800">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                      <Sparkles className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white leading-none mb-1.5">Ask Insight AI</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Context: {selectedJudge.name}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-[20px] px-5 py-4 ${msg.role === 'user' ? 'bg-primary text-white text-sm font-medium shadow-md shadow-primary/20 rounded-tr-sm' : 'bg-gray-50 border border-gray-100 text-sm font-medium text-gray-800 shadow-sm rounded-tl-sm'}`}>
                         {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-5 bg-white border-t border-gray-100">
                  <form onSubmit={handleChatSubmit} className="relative group">
                    <input 
                      type="text"
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      placeholder="Ask about biases, tactics..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-5 pr-14 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-xl text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-primary-hover active:scale-95 transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
             </div>

          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-full bg-gray-50 overflow-y-auto no-scrollbar selection:bg-primary/10">
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-12 py-12 border-t border-gray-100 flex flex-col items-center opacity-30">
         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Lawlify Judicial Analytics v2.6</p>
      </div>
    </div>
  );
};

export default JudicialAnalytics;
