import React, { useState } from 'react';
import { X, Search, Settings, Filter, Plus, Puzzle, ChevronLeft, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectSkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateSkills: (skills: string[]) => void;
  currentSkills: string[];
  availableSkills: any[];
}

const ProjectSkillsModal: React.FC<ProjectSkillsModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpdateSkills, 
  currentSkills,
  availableSkills
}) => {
  const [view, setView] = useState<'main' | 'manage'>('main');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredSkills = availableSkills.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl min-h-[500px] flex flex-col"
        >
          {/* Header */}
          <div className="p-8 pb-4 flex items-center justify-between">
             <div className="flex items-center gap-3">
               {view === 'manage' && (
                 <button onClick={() => setView('main')} className="p-2 hover:bg-gray-50 rounded-full transition-colors mr-2">
                    <ChevronLeft className="w-5 h-5" />
                 </button>
               )}
               <h2 className="text-2xl font-black text-black tracking-tight leading-none">
                  {view === 'main' ? 'Project Skills' : 'Manage project Skills'}
               </h2>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-400" />
             </button>
          </div>

          <div className="px-8 pb-4 border-b border-gray-50">
             <p className="text-gray-400 font-medium text-xs leading-relaxed">
                Trigger added skills manually using / (e.g. /skill-creator) • <span className="underline cursor-pointer">View my Skills</span>
             </p>
          </div>

          {/* Controls */}
          <div className="p-8 py-6 flex items-center gap-3">
             <div className="p-3 border border-gray-100 rounded-xl bg-gray-50/50">
                <Filter className="w-4 h-4 text-gray-400" />
             </div>
             <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input 
                  type="text" 
                  placeholder="Search Skill"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full h-12 bg-gray-50/50 border border-gray-100 rounded-xl pl-11 pr-4 font-bold text-sm text-black focus:outline-none focus:ring-1 focus:ring-black transition-all"
                />
             </div>
             {view === 'main' ? (
                <button 
                  onClick={() => setView('manage')}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-xl font-bold text-sm text-black hover:bg-gray-50 transition-all ml-4"
                >
                   <Settings className="w-4 h-4" />
                   Manage
                </button>
             ) : (
                <div className="flex items-center gap-3 ml-4">
                   <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl">
                      <Check className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-bold text-gray-400">Official</span>
                   </div>
                </div>
             )}
             <div className="p-3 border border-gray-100 rounded-xl bg-gray-50/50">
                <Settings className="w-4 h-4 text-gray-400" />
             </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto px-8 pb-8 flex flex-col items-center justify-center">
             {view === 'main' && currentSkills.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-12">
                   <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-8">
                      <Puzzle className="w-10 h-10 text-gray-400" />
                   </div>
                   <h3 className="text-xl font-black text-black mb-2">No skills available</h3>
                   <p className="text-gray-400 font-medium text-sm mb-8">
                      Get started by creating or importing a skill.
                   </p>
                   <button className="flex items-center gap-2 px-10 py-4 bg-black text-white rounded-[20px] font-black uppercase tracking-widest text-xs hover:bg-gray-900 transition-all shadow-xl shadow-black/10">
                      <Plus className="w-5 h-5" />
                      Add <span className="opacity-40">⌄</span>
                   </button>
                </div>
             ) : (
                <div className="w-full space-y-3">
                   {/* In a real scenario, we'd list current or available skills here */}
                </div>
             )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectSkillsModal;
