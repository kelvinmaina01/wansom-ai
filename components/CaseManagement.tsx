import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Calendar, 
  FileText, 
  Clock, 
  MoreVertical, 
  Upload, 
  User, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Settings,
  Trash2,
  X,
  Scale
} from 'lucide-react';
import { Case, CaseType } from '../types';

const MOCK_CASE_TYPES: CaseType[] = [
  { id: '1', name: 'Criminal Defense', color: 'red', description: 'Defense against criminal charges' },
  { id: '2', name: 'Civil Litigation', color: 'blue', description: 'Non-criminal legal disputes' },
  { id: '3', name: 'Probate & Administration', color: 'green', description: 'Estate management' },
  { id: '4', name: 'Corporate Law', color: 'purple', description: 'Business related legal matters' },
  { id: '5', name: 'Family Law', color: 'pink', description: 'Divorce, custody, and family matters' }
];

const MOCK_CASES: Case[] = [
  {
    id: '1',
    title: 'Republic v. John Doe',
    clientName: 'John Doe',
    status: 'Open',
    practiceArea: 'Criminal Defense',
    nextHearingDate: new Date('2024-04-15'),
    documents: [
      { name: 'Charge Sheet.pdf', type: 'PDF', date: new Date('2024-03-01') },
      { name: 'Witness Statement.docx', type: 'DOCX', date: new Date('2024-03-05') }
    ]
  },
  {
    id: '2',
    title: 'Smith vs. Wesson Corp',
    clientName: 'Jane Smith',
    status: 'Pending',
    practiceArea: 'Civil Litigation',
    nextHearingDate: new Date('2024-05-20'),
    documents: [
      { name: 'Plaint.pdf', type: 'PDF', date: new Date('2024-02-10') }
    ]
  },
  {
    id: '3',
    title: 'Estate of Late Mzee Jomo',
    clientName: 'Family of Jomo',
    status: 'Open',
    practiceArea: 'Probate & Administration',
    nextHearingDate: new Date('2024-06-01'),
    documents: []
  }
];

const CaseManagement: React.FC = () => {
  const [cases, setCases] = useState<Case[]>(MOCK_CASES);
  const [caseTypes, setCaseTypes] = useState<CaseType[]>(MOCK_CASE_TYPES);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeDesc, setNewTypeDesc] = useState('');
  const [newTypeColor, setNewTypeColor] = useState('blue');

  const filteredCases = cases.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreateModalOpen(false);
  };

  const handleAddType = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTypeName) {
      const newType: CaseType = {
        id: Date.now().toString(),
        name: newTypeName,
        description: newTypeDesc,
        color: newTypeColor
      };
      setCaseTypes([...caseTypes, newType]);
      setNewTypeName('');
      setNewTypeDesc('');
      setNewTypeColor('blue');
    }
  };

  const handleDeleteType = (id: string) => {
    setCaseTypes(caseTypes.filter(t => t.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-700';
      case 'Closed': return 'bg-gray-100 text-gray-700';
      case 'Pending': return 'bg-amber-100 text-amber-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white bg-dots p-8 h-full relative">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {selectedCase ? (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col"
          >
            <button 
              onClick={() => setSelectedCase(null)}
              className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-6 group w-fit"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-widest">Back to Cases</span>
            </button>

            <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-black/5 overflow-hidden flex-1 flex flex-col">
              <div className="p-8 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(selectedCase.status)}`}>
                      {selectedCase.status}
                    </span>
                    <span className="text-gray-400 text-xs font-medium flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {selectedCase.practiceArea}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-black tracking-tight mb-1">{selectedCase.title}</h1>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <User className="w-4 h-4" />
                    Client: <span className="font-semibold text-black">{selectedCase.clientName}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm">
                    Edit Case
                  </button>
                  <button className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-900 transition-colors shadow-lg shadow-black/10 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Document
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <section>
                      <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Case Documents
                      </h3>
                      <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                        {selectedCase.documents.length > 0 ? (
                          <div className="divide-y divide-gray-100">
                            {selectedCase.documents.map((doc, idx) => (
                              <div key={idx} className="p-4 flex items-center justify-between hover:bg-white transition-colors group cursor-pointer">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-red-500 shadow-sm">
                                    <FileText className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-bold text-black">{doc.name}</h4>
                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{doc.type} • {doc.date.toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <button className="p-2 text-gray-300 hover:text-black transition-colors opacity-0 group-hover:opacity-100">
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-8 text-center">
                            <p className="text-gray-400 text-sm">No documents uploaded yet.</p>
                          </div>
                        )}
                      </div>
                    </section>

                    <section>
                      <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        Timeline & Activity
                      </h3>
                      <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                        <div className="relative">
                          <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-primary border-2 border-white shadow-sm"></div>
                          <p className="text-xs text-gray-400 font-bold mb-1">Today</p>
                          <p className="text-sm text-black">Case viewed by Advocate Kelvin Maina</p>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-gray-200 border-2 border-white"></div>
                          <p className="text-xs text-gray-400 font-bold mb-1">Mar 01, 2024</p>
                          <p className="text-sm text-black">Document "Charge Sheet.pdf" uploaded</p>
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                      <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Upcoming Deadlines
                      </h4>
                      {selectedCase.nextHearingDate ? (
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-primary/10">
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Next Hearing</p>
                          <p className="text-lg font-bold text-black mb-1">
                            {selectedCase.nextHearingDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {Math.ceil((selectedCase.nextHearingDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No upcoming deadlines.</p>
                      )}
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                      <h4 className="text-sm font-bold text-black mb-4">Quick Actions</h4>
                      <div className="space-y-2">
                        <button className="w-full py-2 px-3 text-left text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                          <Plus className="w-4 h-4" /> Add Note
                        </button>
                        <button className="w-full py-2 px-3 text-left text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                          <Calendar className="w-4 h-4" /> Schedule Hearing
                        </button>
                        <button className="w-full py-2 px-3 text-left text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                          <User className="w-4 h-4" /> Contact Client
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-4xl font-bold text-black tracking-tighter mb-2">Case Management</h1>
                <p className="text-gray-400 text-sm font-medium">Organize your cases, documents, and deadlines.</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsTypeModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 text-black rounded-xl text-xs font-bold hover:bg-gray-50 transition-all shadow-sm"
                >
                  <Settings className="w-4 h-4" />
                  Manage Types
                </button>
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-900 transition-all shadow-lg shadow-black/20 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  New Case
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search cases, clients..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all shadow-sm"
                />
              </div>
              <div className="flex gap-2">
                <select className="bg-white border border-gray-100 rounded-xl py-3 px-4 text-sm font-medium text-gray-600 focus:outline-none cursor-pointer hover:border-gray-200">
                  <option>All Statuses</option>
                  <option>Open</option>
                  <option>Closed</option>
                  <option>Pending</option>
                </select>
                <select className="bg-white border border-gray-100 rounded-xl py-3 px-4 text-sm font-medium text-gray-600 focus:outline-none cursor-pointer hover:border-gray-200">
                  <option>All Types</option>
                  {caseTypes.map(type => (
                    <option key={type.id} value={type.name}>{type.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCases.map((c) => (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedCase(c)}
                  className="bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-xl hover:shadow-black/5 transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getStatusColor(c.status)} bg-opacity-10`}>
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getStatusColor(c.status)}`}>
                      {c.status}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-black mb-1 group-hover:text-primary transition-colors line-clamp-1">{c.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{c.clientName}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                      <Scale className="w-3.5 h-3.5" />
                      {c.practiceArea}
                    </div>
                    {c.nextHearingDate && (
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        Next: {c.nextHearingDate.toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-gray-500">KM</div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-300 group-hover:text-primary transition-colors flex items-center gap-1">
                      View Details <ArrowLeft className="w-3 h-3 rotate-180" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Manage Types Modal */}
        <AnimatePresence>
          {isTypeModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsTypeModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-black">Manage Case Types</h2>
                  <button onClick={() => setIsTypeModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="mb-8">
                  <h3 className="text-sm font-bold text-black mb-4">Add New Type</h3>
                  <form onSubmit={handleAddType} className="space-y-4">
                    <div>
                      <input 
                        type="text" 
                        placeholder="Type Name (e.g., Cybercrime)" 
                        value={newTypeName}
                        onChange={e => setNewTypeName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        required
                      />
                    </div>
                    <div>
                      <input 
                        type="text" 
                        placeholder="Description (Optional)" 
                        value={newTypeDesc}
                        onChange={e => setNewTypeDesc(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <div className="flex gap-2">
                      {['red', 'blue', 'green', 'purple', 'pink', 'orange'].map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewTypeColor(color)}
                          className={`w-8 h-8 rounded-full border-2 ${newTypeColor === color ? 'border-black' : 'border-transparent'}`}
                          style={{ backgroundColor: `var(--color-${color}-500, ${color})` }}
                        />
                      ))}
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-3 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-900 transition-all shadow-lg shadow-black/10"
                    >
                      Add Type
                    </button>
                  </form>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-black mb-4">Existing Types</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {caseTypes.map(type => (
                      <div key={type.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full bg-${type.color}-500`} />
                          <div>
                            <p className="text-sm font-bold text-black">{type.name}</p>
                            {type.description && <p className="text-[10px] text-gray-400">{type.description}</p>}
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteType(type.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CaseManagement;
