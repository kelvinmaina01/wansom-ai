import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Brain, Eye, Download, FolderInput, Trash2, X, File as FileIcon, Zap, Library, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ActionSidePanelProps {
  isOpen: boolean;
  selectedCount: number;
  files: any[]; // The currently selected file objects
  onClose: () => void;
  onMove: () => void;
  onDelete: () => void;
}

export const ActionSidePanel: React.FC<ActionSidePanelProps> = ({
  isOpen,
  selectedCount,
  files,
  onClose,
  onMove,
  onDelete
}) => {
  const navigate = useNavigate();

  const isSingle = selectedCount === 1;
  const singleFileId = isSingle ? files[0]?.id : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 bottom-0 w-[420px] bg-white border-l border-gray-100 shadow-[-20px_0_40px_-15px_rgba(0,0,0,0.08)] z-[60] flex flex-col pt-16"
        >
          {/* Header */}
          <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 backdrop-blur-sm shrink-0 mt-4">
             <div className="flex items-center gap-5">
               <div className="w-14 h-14 bg-black rounded-[18px] flex items-center justify-center text-white shadow-xl shadow-black/10">
                 <Scale className="w-7 h-7" />
               </div>
               <div>
                 <span className="text-2xl font-black text-gray-900 tracking-tighter leading-none">{selectedCount} Selected</span>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 px-1">Ready for Action</p>
               </div>
             </div>
             <button
               onClick={onClose}
               className="p-3 text-gray-400 hover:text-black hover:bg-gray-100 rounded-2xl transition-all"
             >
               <X className="w-6 h-6" />
             </button>
          </div>

          {/* Action List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 relative">
            
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 mb-4 flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> Intelligence Core
              </h4>
              <button
                disabled={!isSingle}
                onClick={() => singleFileId && navigate(`/app/insights/${singleFileId}?mode=savre`)}
                className="w-full relative overflow-hidden group p-5 flex items-center gap-5 border border-red-200 bg-red-50 hover:bg-red-600 rounded-[20px] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:bg-white/20 relative z-10 transition-colors">
                   <Zap className="w-5 h-5 text-red-600 group-hover:text-white" />
                </div>
                <div className="flex flex-col text-left relative z-10">
                  <span className="font-black text-red-900 group-hover:text-white transition-colors tracking-tight">Document Intelligence</span>
                  <span className="text-[10px] font-bold text-red-600 group-hover:text-white/70 uppercase tracking-wider">Strategic Document Scan</span>
                </div>
              </button>

              <button
                disabled={!isSingle}
                onClick={() => singleFileId && navigate(`/app/insights/${singleFileId}`)}
                className="w-full flex items-center gap-5 p-5 border border-gray-100 bg-white hover:bg-gray-50 rounded-[20px] transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors border border-gray-100">
                   <Brain className="w-5 h-5 text-gray-500 group-hover:text-black" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-black text-gray-700 group-hover:text-black tracking-tight">Analyse with AI</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Automated Forensic Analysis</span>
                </div>
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 mb-3">Management</h4>
              
              <button
                disabled={!isSingle}
                onClick={() => singleFileId && window.open(`/api/files/${singleFileId}/view`, '_blank')}
                className="w-full flex items-center justify-between p-4 border border-gray-100 bg-white hover:bg-gray-50 rounded-[15px] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white border border-gray-100">
                    <Eye className="w-4 h-4 text-gray-400 group-hover:text-gray-900" />
                  </div>
                  <span className="text-sm font-bold text-gray-700 group-hover:text-black">View Document</span>
                </div>
              </button>

              <button
                disabled={!isSingle}
                onClick={() => singleFileId && window.open(`/api/files/${singleFileId}/download`, '_blank')}
                className="w-full flex items-center justify-between p-4 border border-gray-100 bg-white hover:bg-gray-50 rounded-[15px] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white border border-gray-100">
                    <Download className="w-4 h-4 text-gray-400 group-hover:text-gray-900" />
                  </div>
                  <span className="text-sm font-bold text-gray-700 group-hover:text-black">Download File</span>
                </div>
              </button>

              <button
                onClick={onMove}
                className="w-full flex items-center justify-between p-4 border border-gray-100 bg-white hover:bg-gray-50 rounded-[15px] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white border border-gray-100">
                    <FolderInput className="w-4 h-4 text-gray-400 group-hover:text-gray-900" />
                  </div>
                  <span className="text-sm font-bold text-gray-700 group-hover:text-black">Move to Folder</span>
                </div>
              </button>
            </div>

          </div>
          
          <div className="p-6 border-t border-gray-100 bg-white shrink-0">
            <button
                onClick={onDelete}
                className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 hover:bg-red-500 border border-red-100 hover:border-red-500 rounded-[15px] text-red-600 hover:text-white font-bold transition-all group shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete {selectedCount > 1 ? `${selectedCount} Files` : 'File'}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
