import React from 'react';
import { 
  FileText, Link as LinkIcon, Puzzle, 
  ChevronRight, Brain, Zap, Shield,
  MessageSquare, Settings, Info, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MatterInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
  onEditInstructions: () => void;
  onManageSkills: () => void;
  onManageFiles: () => void;
  onManageConnectors: () => void;
}

const MatterInspector: React.FC<MatterInspectorProps> = ({
  isOpen,
  onClose,
  project,
  onEditInstructions,
  onManageSkills,
  onManageFiles,
  onManageConnectors
}) => {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="w-96 h-full bg-white border-l border-gray-100 flex flex-col shadow-2xl z-40 fixed right-0 top-0 overflow-y-auto no-scrollbar"
    >
      <div className="p-8 space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Matter Inspector</span>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400">
              <ChevronRight className="w-6 h-6" />
           </button>
        </div>

        {/* Project Info Summary */}
        <div className="space-y-2">
           <h2 className="text-3xl font-black text-black tracking-tighter leading-none">{project?.title}</h2>
           <p className="text-gray-400 font-medium text-sm">Matter for <span className="text-black font-bold">{project?.client_name}</span></p>
        </div>

        {/* Action Modules */}
        <div className="space-y-4">
           {/* Instructions */}
           <div 
             onClick={onEditInstructions}
             className="p-6 bg-gray-50/50 border border-gray-100 rounded-[24px] hover:border-black transition-all cursor-pointer group"
           >
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm">
                       <Brain className="w-5 h-5 text-black" />
                    </div>
                    <span className="text-sm font-black text-black uppercase tracking-widest text-[10px]">Instructions</span>
                 </div>
                 <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" />
              </div>
              <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed">
                 {project?.description || "No specific instructions added yet."}
              </p>
           </div>

           {/* Skills */}
           <div 
             onClick={onManageSkills}
             className="p-6 bg-gray-50/50 border border-gray-100 rounded-[24px] hover:border-black transition-all cursor-pointer group"
           >
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm">
                       <Puzzle className="w-5 h-5 text-black" />
                    </div>
                    <span className="text-sm font-black text-black uppercase tracking-widest text-[10px]">Skills</span>
                 </div>
                 <div className="px-3 py-1 bg-black text-white text-[9px] font-black rounded-lg uppercase tracking-widest">
                    {project?.metadata?.skills?.length || 0} Enabled
                 </div>
              </div>
              <div className="flex flex-wrap gap-2">
                 {(project?.metadata?.skills || []).slice(0, 3).map((s: string) => (
                    <span key={s} className="px-2 py-1 bg-white border border-gray-100 rounded text-[9px] font-bold text-gray-400 uppercase tracking-wider">{s.split('-')[1] || s}</span>
                 ))}
                 {(project?.metadata?.skills?.length > 3) && (
                    <span className="text-[9px] font-bold text-gray-300 ml-1">+{project.metadata.skills.length - 3} More</span>
                 )}
              </div>
           </div>

           {/* Connectors */}
           <div 
             onClick={onManageConnectors}
             className="p-6 bg-gray-50/50 border border-gray-100 rounded-[24px] hover:border-black transition-all cursor-pointer group"
           >
              <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm">
                       <LinkIcon className="w-5 h-5 text-black" />
                    </div>
                    <span className="text-sm font-black text-black uppercase tracking-widest text-[10px]">Connectors</span>
                 </div>
                 <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" />
              </div>
              <div className="flex items-center gap-1">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg" className="w-4 h-4 grayscale opacity-30" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" className="w-4 h-4 grayscale opacity-30" />
              </div>
           </div>

           {/* Files */}
           <div 
             onClick={onManageFiles}
             className="p-6 bg-gray-50/50 border border-gray-100 rounded-[24px] hover:border-black transition-all cursor-pointer group"
           >
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm">
                       <FileText className="w-5 h-5 text-black" />
                    </div>
                    <span className="text-sm font-black text-black uppercase tracking-widest text-[10px]">Files</span>
                 </div>
                 <span className="text-gray-300 text-xs font-bold">0 Uploaded</span>
              </div>
           </div>
        </div>

        {/* Footer Settings */}
        <div className="pt-10 border-t border-gray-50 flex items-center justify-between">
           <button className="flex items-center gap-2 text-[10px] font-black text-gray-300 hover:text-black transition-all uppercase tracking-widest">
              <Settings className="w-4 h-4" />
              Project Settings
           </button>
           <button className="flex items-center gap-2 text-[10px] font-black text-gray-300 hover:text-black transition-all uppercase tracking-widest">
              <Info className="w-4 h-4" />
              Activity Log
           </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MatterInspector;
