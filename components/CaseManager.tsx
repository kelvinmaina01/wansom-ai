import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, Users, FileText, Calendar, Clock, 
  DollarSign, BarChart3, Settings, Bell, ChevronLeft, 
  Search, Filter, Plus, MoreVertical, PlayCircle, 
  MessageSquare, Play, Edit3, Trash2, ShieldCheck,
  CheckCircle2, AlertCircle, ArrowLeft, Gavel, 
  Mail, Link as LinkIcon, Download, Minus, Check, Scale,
  Brain, Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import NewCaseModal from './NewCaseModal';
import PaymentSimulationModal from './PaymentSimulationModal';

interface Case {
  id: string;
  title: string;
  client_name: string;
  case_type: string;
  status: 'New' | 'Active' | 'Pending' | 'Closed';
  priority: 'High' | 'Medium' | 'Low';
  description: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

interface Invoice {
  id: string;
  case_id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: 'Pending' | 'Paid' | 'Void';
  due_date: string;
  created_at: string;
}

interface CaseManagerProps {
  activeSubView?: string;
}

const CaseManager: React.FC<CaseManagerProps> = ({ activeSubView = 'Cases' }) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activeTab, setActiveTab] = useState('Details');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Modal States
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    fetchUserAndCases();
  }, []);

  useEffect(() => {
    if (selectedCaseId) {
      fetchInvoices(selectedCaseId);
    }
  }, [selectedCaseId]);

  const fetchUserAndCases = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('updated_at', { ascending: false });

      if (data) {
        setCases(data);
        if (data.length > 0) setSelectedCaseId(data[0].id);
      }
    }
    setLoading(false);
  };

  const fetchInvoices = async (caseId: string) => {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('case_id', caseId)
      .order('created_at', { ascending: false });

    if (data) setInvoices(data);
  };

  const handlePaymentSuccess = async () => {
    if (!selectedInvoice) return;
    
    const { error } = await supabase
      .from('invoices')
      .update({ status: 'Paid' })
      .eq('id', selectedInvoice.id);

    if (!error) {
      fetchInvoices(selectedCaseId!);
    }
  };

  const createDemoInvoice = async () => {
    if (!selectedCaseId || !user) return;
    
    const newInvoice = {
      case_id: selectedCaseId,
      user_id: user.id,
      invoice_number: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      amount: Math.floor(Math.random() * 200000) + 50000,
      currency: 'NGN',
      status: 'Pending',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    const { error } = await supabase.from('invoices').insert([newInvoice]);
    if (!error) fetchInvoices(selectedCaseId);
  };

  const selectedCase = cases.find(c => c.id === selectedCaseId);

  const TABS = [
    'Details', 'Expenses', 'Billable Time', 'Invoicing', 
    'Tasks', 'Notes', 'Documents', 'Calendar', 'Hearing Log'
  ];

  const filteredCases = cases.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.client_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full bg-[#f8fafc] text-gray-900 font-sans selection:bg-red-500/30 overflow-hidden relative">
      {activeSubView !== 'Cases' && activeSubView !== 'Registry Tracker' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-white h-full text-gray-900 text-center w-full">
          <div className="w-20 h-20 mb-6 bg-red-600/10 text-red-600 rounded-[15px] flex items-center justify-center shadow-lg shadow-red-600/10">
            <Scale className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black mb-4 tracking-tighter">{activeSubView}</h1>
          <p className="text-gray-500 font-medium text-lg">Integrated subsystem coming soon or managed centrally.</p>
        </div>
      )}

      {activeSubView === 'Registry Tracker' && (
        <div className="flex-1 flex flex-col h-full bg-white animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-10 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tighter">Registry Tracker</h1>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Live updates from Kenya Law & ULII</p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-black transition-all">Sync Registry</button>
              <button className="px-6 py-3 bg-red-600 text-white border-2 border-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-600/20 hover:bg-black transition-all">Export Monitor</button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Active Monitors', value: '12', color: 'text-blue-600' },
                { label: 'Judgment Alerts', value: '04', color: 'text-red-600' },
                { label: 'Registry Sync', value: 'Live', color: 'text-emerald-600' },
              ].map((s, i) => (
                <div key={i} className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{s.label}</p>
                  <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
              <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Tracked Matters</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  { id: 'MA-001', name: 'Alber & Co vs State Dept', status: 'Hearing Set', date: 'Mar 28, 2026', judge: 'Hon. Justice Mabeya', priority: 'High' },
                  { id: 'CS-442', name: 'Digital Rights Initiative vs Telco-X', status: 'Judgment Date', date: 'Apr 05, 2026', judge: 'Hon. Justice Thande', priority: 'Medium' },
                  { id: 'ELC-102', name: 'Greenway Estate vs Municipal Council', status: 'Submissions', date: 'Mar 25, 2026', judge: 'Hon. Justice Angote', priority: 'Low' },
                ].map((item) => (
                  <div key={item.id} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold text-[10px] shadow-sm tracking-tighter">
                        {item.id}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900">{item.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{item.judge}</p>
                          <span className={`text-[8px] font-black uppercase tracking-widest ${item.priority === 'High' ? 'text-red-600' : 'text-slate-400'}`}>
                            {item.priority} Priority
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-10">
                      <div className="text-right">
                         <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                           item.status === 'Judgment Date' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                           item.status === 'Hearing Set' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                           'bg-slate-50 text-gray-600 border-slate-100'
                         }`}>{item.status}</span>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">{item.date}</p>
                      </div>
                      <button className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-red-600 transition-all">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubView === 'Cases' && (
        <>
          {/* Middle Panel: Case List */}
          <div className="w-[420px] border-r border-gray-200 flex flex-col shrink-0 h-full bg-[#f8fafc]">
            <div className="p-6 space-y-4">
              <button 
                onClick={() => setIsNewCaseModalOpen(true)}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-[15px] transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Case
              </button>

              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Search cases..." 
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-gray-900">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-3 custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-40 gap-3 text-gray-400">
                   <Loader2 className="w-6 h-6 animate-spin" />
                   <span className="text-xs font-bold uppercase tracking-widest">Loading cases...</span>
                </div>
              ) : filteredCases.length === 0 ? (
                <div className="p-12 text-center">
                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="w-8 h-8 text-gray-300" />
                   </div>
                   <h3 className="font-bold text-gray-500">No cases found</h3>
                   <p className="text-xs text-gray-400 mt-1">Start by adding a new legal matter.</p>
                </div>
              ) : (
                filteredCases.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedCaseId(item.id)}
                    className={`w-full p-4 rounded-[15px] border transition-all text-left relative group ${
                      selectedCaseId === item.id 
                      ? 'bg-gray-50 border-red-600/50 shadow-xl' 
                      : 'bg-white border-gray-200 hover:border-gray-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg text-white ${
                        selectedCaseId === item.id ? 'bg-red-600' : 'bg-blue-600'
                      }`}>
                        {item.client_name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-sm truncate pr-2">{item.title}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-widest ${
                            item.status === 'New' ? 'text-blue-600 bg-blue-50 border-blue-500/20' : 'text-emerald-600 bg-emerald-50 border-emerald-500/20'
                          }`}>{item.status}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500 font-medium">
                            {item.client_name} • {item.case_type}
                          </p>
                          {item.due_date && (
                            <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(item.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </span>
                          )}
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-widest ${
                             item.priority === 'High' ? 'text-red-600 bg-red-50 border-red-500/20' : 
                             item.priority === 'Medium' ? 'text-yellow-600 bg-yellow-50 border-yellow-500/20' : 
                             'text-blue-600 bg-blue-50 border-blue-500/20'
                          }`}>{item.priority}</span>
                          <span className="text-[10px] text-gray-600 font-medium italic">Updated recently</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
              <div className="flex gap-2">
                <button className="p-1 hover:text-gray-900 cursor-not-allowed">←</button>
                <button className="p-1 hover:text-gray-900 cursor-not-allowed">→</button>
              </div>
              <span>{filteredCases.length} matters total</span>
            </div>
          </div>

      {/* 3. Right Panel: Case Details */}
      <div className="flex-1 flex flex-col min-w-0 bg-white h-full">
        {!selectedCase ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
             <div className="w-24 h-24 bg-gray-50 rounded-[30px] flex items-center justify-center mb-6 border border-gray-100 shadow-sm transition-all animate-pulse">
                <Gavel className="w-10 h-10 text-gray-200" />
             </div>
             <h2 className="text-2xl font-black tracking-tight text-gray-300">No Case Selected</h2>
             <p className="text-gray-400 mt-2 max-w-xs font-medium">Select a matter from the sidebar or register a new one to view intelligence and billing.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-8 pb-4">
              <div className="flex items-start justify-between mb-8">
                <h1 className="text-3xl font-black tracking-tighter">{selectedCase.title}</h1>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    Playbook
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all">
                    <Brain className="w-4 h-4 text-blue-500" />
                    Ask Lawlify
                  </button>
                  <button className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
                    <PlayCircle className="w-4 h-4" />
                    Run Workflow
                  </button>
                  <div className="flex items-center gap-2 ml-2">
                    <button className="p-2 border border-gray-200 rounded-xl hover:bg-white transition-all">
                      <Edit3 className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-2 border border-gray-200 rounded-xl hover:bg-white transition-all">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 mb-8 overflow-x-auto no-scrollbar pb-2">
                {[
                  { label: 'Revenue', value: invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString(), color: 'text-emerald-500' },
                  { label: 'Pending', value: invoices.filter(i => i.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString(), color: 'text-amber-500' },
                  { label: 'Status', value: selectedCase.status, color: 'text-emerald-500' },
                  { label: 'Priority', value: selectedCase.priority, color: 'text-yellow-500' },
                  { label: 'Jurisdiction', value: 'East Africa', color: 'text-gray-500' },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full whitespace-nowrap">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}:</span>
                    <span className={`text-[10px] font-bold ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex border-b border-gray-200 gap-8 overflow-x-auto no-scrollbar">
                {TABS.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-bold relative transition-colors whitespace-nowrap ${
                      activeTab === tab ? 'text-gray-900' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 rounded-t-full shadow-[0_-4px_10px_rgba(220,38,38,0.5)]" 
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 pt-4 custom-scrollbar">
              <AnimatePresence mode="wait">
                {activeTab === 'Details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div className="bg-white border border-gray-200 rounded-[15px] p-8 shadow-sm">
                      <div className="flex items-center gap-3 mb-8">
                        <Briefcase className="w-5 h-5 text-gray-500" />
                        <h2 className="text-xl font-bold">Case Overview</h2>
                      </div>
                      <div className="grid grid-cols-4 gap-8 mb-10">
                        {[
                          { label: 'Filing Date', value: 'Recent' },
                          { label: 'Due Date', value: selectedCase.due_date ? new Date(selectedCase.due_date).toLocaleDateString() : 'Not set' },
                          { label: 'Case Type', value: selectedCase.case_type },
                          { label: 'Case Number', value: selectedCase.title.match(/LD\/\d+\/\d+/) ? selectedCase.title.match(/LD\/\d+\/\d+/)[0] : 'N/A' },
                        ].map((item, i) => (
                          <div key={i} className="bg-[#f8fafc] border border-gray-200 rounded-[15px] p-6 text-center shadow-sm">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">{item.label}</p>
                            <p className="text-sm font-bold">{item.value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="bg-[#f8fafc] border border-gray-200 rounded-[15px] p-6">
                        <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em] mb-4">Description</p>
                        <p className="text-gray-500 text-sm leading-relaxed">{selectedCase.description || 'No description provided.'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="bg-white border border-gray-200 rounded-[15px] p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                          <Users className="w-5 h-5 text-emerald-500" />
                          <h2 className="text-xl font-bold">Client Information</h2>
                        </div>
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                               <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Name</p>
                               <p className="font-bold text-lg">{selectedCase.client_name}</p>
                            </div>
                            <div>
                               <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Managed By</p>
                               <p className="font-bold text-gray-400">Firm Administrator</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-[15px] p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                          <ShieldCheck className="w-5 h-5 text-blue-500" />
                          <h2 className="text-xl font-bold">Assigned Agents</h2>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex items-center gap-3 p-3 bg-[#f8fafc] rounded-[15px] border border-gray-200 flex-1">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center font-bold text-xs uppercase text-white">AI</div>
                            <div>
                              <p className="text-sm font-bold">Litigation AI</p>
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">Senior Counsel</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'Invoicing' && (
                  <motion.div
                    key="invoicing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between mb-8">
                       <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Billing & Payments</h2>
                        <p className="text-gray-500 text-sm font-medium">Manage Paystack-linked invoices for {selectedCase.client_name}.</p>
                      </div>
                      <button 
                        onClick={createDemoInvoice}
                        className="px-6 py-3.5 bg-gray-900 text-white rounded-[15px] font-bold flex items-center gap-2 shadow-xl hover:bg-black transition-all"
                      >
                        <Plus className="w-5 h-5" />
                        Create Invoice
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {invoices.length === 0 ? (
                        <div className="py-20 bg-gray-50 rounded-[25px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                              <DollarSign className="w-8 h-8 text-gray-300" />
                           </div>
                           <h3 className="font-bold text-gray-400">No invoices generated yet</h3>
                           <button onClick={createDemoInvoice} className="mt-4 text-sm font-bold text-red-600 hover:underline">Generate first invoice</button>
                        </div>
                      ) : (
                        invoices.map((inv, i) => (
                          <div key={inv.id} className="bg-white border border-gray-200 rounded-[20px] p-6 hover:border-red-600/30 transition-all flex items-center justify-between group shadow-sm">
                            <div className="flex items-center gap-6">
                              <div className={`w-14 h-14 rounded-[18px] border flex items-center justify-center transition-all ${
                                inv.status === 'Paid' 
                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                                : 'bg-red-500/10 text-red-500 border-red-500/20'
                              }`}>
                                <DollarSign className="w-7 h-7" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                   <h3 className="font-black text-gray-900">{inv.invoice_number}</h3>
                                   <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors ${
                                     inv.status === 'Paid' 
                                     ? 'bg-emerald-500 text-white border-emerald-600' 
                                     : 'bg-amber-500 text-white border-amber-600'
                                   }`}>
                                     {inv.status}
                                   </span>
                                </div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">
                                  {new Date(inv.created_at).toLocaleDateString()} · Due in {Math.ceil((new Date(inv.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-12">
                               <div className="text-right">
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-right">Amount Due</p>
                                 <p className="text-2xl font-black text-gray-900">{inv.currency} {inv.amount.toLocaleString()}</p>
                               </div>
                               <div className="flex items-center gap-2">
                                 <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-900" title="Download Statement">
                                   <Download className="w-5 h-5" />
                                 </button>
                                 {inv.status !== 'Paid' ? (
                                   <button 
                                     onClick={() => {
                                       setSelectedInvoice(inv);
                                       setIsPaymentModalOpen(true);
                                     }}
                                     className="px-6 py-3 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30 uppercase tracking-widest"
                                   >
                                     <LinkIcon className="w-3" />
                                     Pay via Paystack
                                   </button>
                                 ) : (
                                   <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-600">
                                      <CheckCircle2 className="w-4 h-4" />
                                      Receipt Issued
                                   </div>
                                 )}
                               </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
                
                {(activeTab !== 'Details' && activeTab !== 'Invoicing') && (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full py-20 text-center"
                  >
                    <div className="w-20 h-20 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-6 shadow-sm">
                      <PlayCircle className="w-10 h-10 text-gray-700 opacity-50" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{activeTab} Interface</h3>
                    <p className="text-gray-500 max-w-sm">This module is currently being optimized for the East African legal system. Check back shortly for fully managed {activeTab.toLowerCase()}.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </>
  )}

      {/* Modals */}
      <NewCaseModal 
        isOpen={isNewCaseModalOpen} 
        onClose={() => setIsNewCaseModalOpen(false)} 
        onSuccess={fetchUserAndCases}
        userId={user?.id || ''}
      />

      <PaymentSimulationModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
        amount={selectedInvoice?.amount || 0}
        currency={selectedInvoice?.currency}
        email={user?.email || 'user@lawlify.ai'}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(220, 38, 38, 0.4);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CaseManager;
