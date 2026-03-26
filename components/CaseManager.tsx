import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, Users, FileText, Calendar, Clock, 
  DollarSign, BarChart3, Settings, Bell, ChevronLeft, 
  Search, Filter, Plus, MoreVertical, PlayCircle, 
  MessageSquare, Play, Edit3, Trash2, ShieldCheck,
  CheckCircle2, AlertCircle, ArrowLeft, Gavel, 
  Mail, Link as LinkIcon, Download, Minus, Check, Scale,
  Brain
} from 'lucide-react';

interface Case {
  id: string;
  title: string;
  client: string;
  type: string;
  status: 'New' | 'Active' | 'Pending' | 'Closed';
  priority: 'High' | 'Medium' | 'Low';
  updatedAt: string;
  dueDate?: string;
  initials: string;
  revenue: string;
  expenses: string;
  description: string;
}

const MOCK_CASES: Case[] = [
  {
    id: '1',
    title: 'Kelvin Maina vs Zenith Bank Plc',
    client: 'Faith',
    type: 'Other',
    status: 'New',
    priority: 'Medium',
    updatedAt: '3h ago',
    initials: 'AO',
    revenue: '0',
    expenses: '0',
    description: 'Breach of contract (Suit No: LD/2345/2026) at the Lagos State High Court, Ikeja Division, before Hon. Justice Tunde Ojo.'
  },
  {
    id: '2',
    title: 'Template',
    client: 'Baderu',
    type: 'Other',
    status: 'New',
    priority: 'Medium',
    updatedAt: '4h ago',
    initials: 'TE',
    revenue: '0',
    expenses: '0',
    description: 'General legal template for corporate filing and documentation.'
  },
  {
    id: '3',
    title: 'Workflow test case',
    client: 'Workflow Test Client',
    type: 'Other',
    status: 'New',
    priority: 'Medium',
    updatedAt: '3d ago',
    initials: 'WT',
    revenue: '0',
    expenses: '0',
    description: 'Automated testing for AI-driven litigation workflows.'
  },
  {
    id: '4',
    title: 'test UI server action',
    client: 'Morpheus',
    type: 'Corporate',
    status: 'New',
    priority: 'Medium',
    updatedAt: '4d ago',
    dueDate: '12 Mar',
    initials: 'TU',
    revenue: '0',
    expenses: '0',
    description: 'Testing the integration between frontend UI triggers and backend server actions.'
  }
];

interface CaseManagerProps {
  activeSubView?: string;
}

const CaseManager: React.FC<CaseManagerProps> = ({ activeSubView = 'Cases' }) => {
  const [selectedCaseId, setSelectedCaseId] = useState(MOCK_CASES[0].id);
  const [activeTab, setActiveTab] = useState('Details');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCase = MOCK_CASES.find(c => c.id === selectedCaseId) || MOCK_CASES[0];

  const TABS = [
    'Details', 'Expenses', 'Billable Time', 'Invoicing', 
    'Tasks', 'Notes', 'Documents', 'Calendar', 'Hearing Log'
  ];

  return (
    <div className="flex h-full bg-[#f8fafc] text-gray-900 font-sans selection:bg-red-500/30 overflow-hidden relative">
      {activeSubView !== 'Cases' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-white h-full text-gray-900 text-center w-full">
          <div className="w-20 h-20 mb-6 bg-red-600/10 text-red-600 rounded-[15px] flex items-center justify-center shadow-lg shadow-red-600/10">
            <Scale className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black mb-4 tracking-tighter">{activeSubView}</h1>
          <p className="text-gray-500 font-medium text-lg">Integrated subsystem coming soon or managed centrally.</p>
        </div>
      )}

      {activeSubView === 'Cases' && (
        <>
          {/* Middle Panel: Case List */}
          <div className="w-[420px] border-r border-gray-200 flex flex-col shrink-0 h-full bg-[#f8fafc]">
            <div className="p-6 space-y-4">
              <button className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-[15px] transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2">
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
              {MOCK_CASES.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedCaseId(item.id)}
                  className={`w-full p-4 rounded-[15px] border transition-all text-left relative group ${
                    selectedCaseId === item.id 
                    ? 'bg-gray-50 border-red-600/50 shadow-xl' 
                    : 'bg-white border-gray-200 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg ${
                      selectedCaseId === item.id ? 'bg-red-600' : 'bg-blue-600'
                    }`}>
                      {item.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-sm truncate pr-2">{item.title}</h3>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-widest">{item.status}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500 font-medium">
                          {item.client} • {item.type}
                        </p>
                        {item.dueDate && (
                          <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {item.dueDate}
                          </span>
                        )}
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-500/20 uppercase tracking-widest">{item.priority}</span>
                        <span className="text-[10px] text-gray-600 font-medium">Updated {item.updatedAt}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
              <div className="flex gap-2">
                <button className="p-1 hover:text-gray-900">←</button>
                <button className="p-1 hover:text-gray-900">→</button>
              </div>
              <span>1-10 of 12</span>
            </div>
          </div>

      {/* 3. Right Panel: Case Details */}
      <div className="flex-1 flex flex-col min-w-0 bg-white h-full">
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
              { label: 'Revenue', value: 'N:0', color: 'text-emerald-500' },
              { label: 'Expenses', value: 'N:0', color: 'text-red-500' },
              { label: 'Status', value: selectedCase.status, color: 'text-emerald-500' },
              { label: 'Priority', value: selectedCase.priority, color: 'text-yellow-500' },
              { label: 'Updated', value: selectedCase.updatedAt, color: 'text-gray-500' },
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
                <div className="bg-white border border-gray-200 rounded-[15px] p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <Briefcase className="w-5 h-5 text-gray-500" />
                    <h2 className="text-xl font-bold">Case Overview</h2>
                  </div>
                  <div className="grid grid-cols-4 gap-8 mb-10">
                    {[
                      { label: 'Filing Date', value: 'Not set' },
                      { label: 'Due Date', value: selectedCase.dueDate || 'Not set' },
                      { label: 'Case Type', value: selectedCase.type },
                      { label: 'Case Number', value: 'N/A' },
                    ].map((item, i) => (
                      <div key={i} className="bg-[#f8fafc] border border-gray-200 rounded-[15px] p-6 text-center">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">{item.label}</p>
                        <p className="text-sm font-bold">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#f8fafc] border border-gray-200 rounded-[15px] p-6">
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em] mb-4">Description</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{selectedCase.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-white border border-gray-200 rounded-[15px] p-8">
                    <div className="flex items-center gap-3 mb-8">
                      <Users className="w-5 h-5 text-emerald-500" />
                      <h2 className="text-xl font-bold">Client Information</h2>
                    </div>
                    <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Name</p>
                          <p className="font-bold">{selectedCase.client}</p>
                        </div>
                        <div className="col-span-1">
                          <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Email</p>
                          <p className="font-bold truncate">client@example.com</p>
                        </div>
                        <div className="col-span-1">
                          <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Phone</p>
                          <p className="font-bold group-hover:text-gray-900 transition-colors cursor-pointer">+234 XXX XXX XXX</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-[15px] p-8">
                    <div className="flex items-center gap-3 mb-8">
                      <ShieldCheck className="w-5 h-5 text-blue-500" />
                      <h2 className="text-xl font-bold">Team</h2>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-3 p-3 bg-[#f8fafc] rounded-[15px] border border-gray-200 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-xs uppercase">KO</div>
                        <div>
                          <p className="text-sm font-bold">Kelvin Ogodo</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">Lead Agent</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-[#f8fafc] rounded-[15px] border border-gray-200 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-xs uppercase">MN</div>
                        <div>
                          <p className="text-sm font-bold">Michael Numa</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">Associate</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-[15px] p-8 pb-4">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-yellow-500" />
                      <h2 className="text-xl font-bold">Recent Activity</h2>
                    </div>
                    <button className="text-xs font-bold text-red-500 hover:text-gray-900 transition-colors">View All History</button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { icon: Edit3, user: 'Abiola', action: 'updated Note ID: 69b93...', time: 'about 3 hours ago', content: 'Placeholder note' },
                      { icon: FileText, user: 'System', action: 'added Judicial Filing', time: '5 hours ago', content: 'Supreme Court submission' },
                      { icon: CheckCircle2, user: 'Kelvin', action: 'completed Task', time: '1 day ago', content: 'Draft initial summary' },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 hover:bg-white rounded-[15px] transition-all group border border-transparent hover:border-gray-200">
                        <div className="p-2 bg-white rounded-xl border border-gray-200 text-gray-500 group-hover:text-gray-900 group-hover:bg-red-600/20 group-hover:border-red-600/30 transition-all">
                          <activity.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            <span className="font-bold text-gray-900">{activity.user}</span> {activity.action}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 italic">"{activity.content}"</p>
                        </div>
                        <span className="text-[10px] text-gray-600">{activity.time}</span>
                      </div>
                    ))}
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
                    <h2 className="text-2xl font-bold text-gray-900">Invoices</h2>
                    <p className="text-gray-500 text-sm">Managed billing and Paystack payments for this case.</p>
                  </div>
                  <button className="px-6 py-3 bg-red-600 text-white rounded-[15px] font-bold flex items-center gap-2 shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all">
                    <Plus className="w-5 h-5" />
                    Create Invoice
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'INV-2026-001', date: '24 Mar 2026', amount: 'NGN 150,000', status: 'Pending', client: 'Faith' },
                    { id: 'INV-2026-002', date: '10 Mar 2026', amount: 'NGN 45,000', status: 'Paid', client: 'Faith' },
                  ].map((inv, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-[15px] p-6 hover:border-red-600/30 transition-all flex items-center justify-between group">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-[15px] bg-white border border-gray-200 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-gray-900 transition-all">
                          <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                             <h3 className="font-bold text-gray-900">{inv.id}</h3>
                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${
                               inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                             }`}>
                               {inv.status}
                             </span>
                          </div>
                          <p className="text-xs text-gray-500">{inv.date} · Due in 5 days</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-12">
                         <div className="text-right">
                           <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 text-right">Amount</p>
                           <p className="text-lg font-black text-gray-900">{inv.amount}</p>
                         </div>
                         <div className="flex items-center gap-2">
                           <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-500" title="Download PDF">
                             <Download className="w-5 h-5" />
                           </button>
                           <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-500" title="Email to Client">
                             <Mail className="w-5 h-5" />
                           </button>
                           {inv.status !== 'Paid' && (
                             <button className="px-4 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2">
                               <LinkIcon className="w-3 h-3" />
                               Paystack Link
                             </button>
                           )}
                         </div>
                      </div>
                    </div>
                  ))}
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
                <div className="w-20 h-20 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-6">
                  <PlayCircle className="w-10 h-10 text-gray-700 opacity-50" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{activeTab} Interface</h3>
                <p className="text-gray-500 max-w-sm">This module is currently being optimized for the East African legal system. Check back shortly for fully managed {activeTab.toLowerCase()}.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
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
