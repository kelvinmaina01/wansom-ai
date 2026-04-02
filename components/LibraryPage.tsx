import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Clock, 
  Filter, 
  MoreVertical, 
  Download, 
  Trash2, 
  Eye, 
  ArrowRight,
  Scale,
  Loader2,
  CheckCircle2,
  Library,
  Grid,
  List as ListIcon,
  Share2,
  FileCode,
  FileJson,
  FileImage,
  ExternalLink,
  Save,
  Cloud,
  FileDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/apiClient';
import { Draft } from '../types';

// Extended type for mock data grouping
interface LibraryDraft extends Draft {
  projectName?: string;
  category?: string;
  isFavorite?: boolean;
}

const LibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState<LibraryDraft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Recent'>('All');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const res = await apiClient.get('/api/drafts');
        if (res.ok) {
           const data: any[] = await res.json();
           // Add some project grouping fields for high-fidelity look if missing
           const enhancedData = data.map((d, i) => ({
             ...d,
             projectName: d.projectName || (i % 2 === 0 ? "Smart Screen Time Analytics and Behavioral Insights" : "Hotel Analysis: Rates, Reviews, Amenities, and Revenue Strategies"),
             isFavorite: d.isFavorite || false
           }));
           setDrafts(enhancedData);
        }
      } catch (e) {
        console.error("Failed to fetch drafts", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDrafts();
  }, []);

  const filteredDrafts = drafts.filter(draft => {
    const matchesSearch = draft.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (draft.projectName?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTab = activeTab === 'All';
    return matchesSearch && matchesTab;
  });

  // Grouping logic
  const groupedDrafts: Record<string, LibraryDraft[]> = {};
  filteredDrafts.forEach(draft => {
    const project = draft.projectName || "Uncategorized";
    if (!groupedDrafts[project]) groupedDrafts[project] = [];
    groupedDrafts[project].push(draft);
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document': return <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center text-blue-600"><FileText className="w-4 h-4" /></div>;
      case 'advice': return <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center text-orange-600"><FileCode className="w-4 h-4" /></div>;
      case 'image': return <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center text-yellow-600"><FileImage className="w-4 h-4" /></div>;
      default: return <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-gray-600"><FileText className="w-4 h-4" /></div>;
    }
  };

  const ContextMenu = ({ draftId }: { draftId: string }) => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute right-0 top-10 w-64 bg-white border border-black rounded-[17px] z-50 py-2 overflow-hidden"
    >
      <MenuAction icon={<ExternalLink className="w-4 h-4" />} label="Locate in task" />
      <MenuAction icon={<Share2 className="w-4 h-4" />} label="Share" />
      <div className="h-[2px] bg-gray-100 my-1" />
      <MenuAction 
        icon={<div className="w-4 h-4 bg-red-600 rounded flex items-center justify-center text-[7px] font-black text-white">pptx</div>} 
        label="Download as pptx" 
      />
      <MenuAction 
        icon={<div className="w-4 h-4 bg-black rounded flex items-center justify-center text-[7px] font-black text-white">pdf</div>} 
        label="Download as pdf" 
      />
      <div className="h-[2px] bg-gray-100 my-1" />
      <MenuAction icon={<Cloud className="w-4 h-4" />} label="Convert to Google Slides" />
      <MenuAction icon={<div className="w-4 h-4 bg-black rounded-full" />} label="Save to Google Drive" />
      <MenuAction icon={<Cloud className="w-4 h-4 text-black" />} label="Save to OneDrive (personal)" />
      <MenuAction icon={<Cloud className="w-4 h-4 text-black" />} label="Save to OneDrive (work/school)" />
    </motion.div>
  );

  const MenuAction = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <button className="w-full flex items-center gap-3 px-4 py-2 text-[13px] font-bold text-gray-600 hover:bg-gray-50 hover:text-black transition-colors text-left group/item">
      {icon} 
      <span className="flex-1">{label}</span>
      {label === "Share" && <ChevronRight className="w-3 h-3 text-gray-300 group-hover/item:text-black" />}
    </button>
  );

  const ChevronRight = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-white p-10 select-none" onClick={() => setActiveMenuId(null)}>
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="flex items-center gap-6">
            <h1 className="text-4xl font-black tracking-tight text-black">Library</h1>
            <div className="flex items-center bg-white p-1 rounded-[17px] border border-black">
               <button 
                onClick={() => setActiveTab('All')}
                className={`px-6 py-2 rounded-[17px] text-xs font-bold transition-all ${activeTab === 'All' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
               >
                 All
               </button>
               <button 
                onClick={() => setActiveTab('Recent')}
                className={`px-6 py-2 rounded-[17px] text-xs font-bold transition-all ${activeTab === 'Recent' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
               >
                 Recent
               </button>
            </div>
          </div>

          <div className="flex items-center gap-6 flex-1 md:flex-initial">
            <div className="relative group flex-1 md:w-[450px]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
              <input
                type="text"
                placeholder="Search collection"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-black rounded-[17px] py-4 pl-14 pr-6 text-sm font-bold focus:ring-0 outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-1 border border-black rounded-[17px] p-1.5 bg-white">
               <button 
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-[17px] transition-all ${viewMode === 'grid' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
               >
                 <Grid className="w-5 h-5" />
               </button>
               <button 
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-[17px] transition-all ${viewMode === 'list' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
               >
                 <ListIcon className="w-5 h-5" />
               </button>
            </div>
          </div>
        </div>

        {/* Categories / Project Groups */}
        <div className="space-y-16 pb-32">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border border-gray-100 shadow-sm">
              <div className="w-16 h-16 border-t-4 border-black rounded-full animate-spin mb-8 opacity-20"></div>
              <p className="text-xs font-bold text-gray-400 tracking-widest">Syncing archives</p>
            </div>
          ) : Object.keys(groupedDrafts).length === 0 ? (
            <div className="text-center py-32 bg-white border border-dashed border-gray-200 rounded-[40px] shadow-sm">
              <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-10">
                 <Library className="w-12 h-12 text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tighter">Knowledge base is empty</h3>
              <p className="text-gray-500 font-bold max-w-sm mx-auto leading-relaxed">AI-generated legal documents, briefs, and research will be organized here as your personal knowledge base.</p>
            </div>
          ) : (
            Object.entries(groupedDrafts).map(([projectName, docs]) => (
              <div key={projectName} className="relative">
                <div className="flex items-center justify-between pb-4 mb-6 border-b-4 border-black">
                  <h3 className="text-xl font-black text-black tracking-tight flex items-center gap-4">
                    {projectName}
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className="px-4 py-1 bg-black rounded-[17px] text-[10px] font-bold text-white tracking-widest">{docs.length} entries</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-1">
                  {docs.map((doc) => (
                    <div 
                      key={doc.id}
                      className="group flex items-center justify-between p-5 rounded-[17px] hover:bg-black hover:text-white transition-all duration-300 cursor-pointer border border-transparent hover:border-black"
                    >
                      <div className="flex items-center gap-6 flex-1">
                        <div className="group-hover:invert transition-all duration-300">
                          {getFileIcon(doc.type)}
                        </div>
                        <div>
                          <span className="text-base font-black tracking-tight block">{doc.title}</span>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[10px] font-bold tracking-widest bg-gray-100 px-2 py-0.5 rounded-[17px] group-hover:bg-white/10 group-hover:text-white transition-colors">{doc.type}</span>
                            <span className="text-[10px] font-bold opacity-40">Modified {new Date(doc.lastModified).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        <div className="relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === doc.id ? null : doc.id);
                            }}
                            className="p-3 text-black group-hover:text-white transition-colors rounded-[17px] hover:bg-white/10"
                          >
                            <MoreVertical className="w-6 h-6" />
                          </button>
                          {activeMenuId === doc.id && <ContextMenu draftId={doc.id} />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          {/* Premium Bottom Banner Overlay */}
          <div 
            onClick={() => navigate('/app/specialists', { state: { editSpecialistId: 'doc-prep' } })}
            className="group relative overflow-hidden bg-red-600 rounded-[17px] p-16 flex flex-col lg:flex-row items-center justify-between gap-12 transition-all duration-500 cursor-pointer mt-32 border border-black"
          >
            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10 w-full lg:w-auto">
              <div className="w-32 h-32 bg-white rounded-[17px] flex items-center justify-center text-red-600 border border-black shrink-0 group-hover:scale-105 transition-transform">
                <Library className="w-16 h-16" />
              </div>
              <div className="text-center md:text-left flex-1 max-w-lg">
                <h5 className="text-5xl font-black text-white tracking-tighter leading-[0.9] mb-6">Start New AI Draft</h5>
                <p className="text-xl text-white font-bold leading-relaxed opacity-90">Architect briefs, contracts, and legal research in one place — your personal AI-powered knowledge base.</p>
              </div>
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                navigate('/app/specialists', { state: { editSpecialistId: 'doc-prep' } });
              }}
              className="w-full lg:w-auto px-16 py-8 bg-white text-black border border-black rounded-[17px] text-sm font-bold transition-all relative z-10 active:translate-x-1 active:translate-y-1"
            >
              Initialize AI Composer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;
