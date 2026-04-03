import React, { useState } from 'react';
import { X, Folder, Link as LinkIcon, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  project: {
    title: string;
    description?: string;
    metadata?: {
      connectors?: string[];
    };
  };
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ isOpen, onClose, onSave, project }) => {
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description || '',
    connectors: project.metadata?.connectors || []
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl"
        >
          <div className="p-8 space-y-10">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-black text-black tracking-tight">Edit project</h2>
               <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
               </button>
            </div>

            <div className="flex justify-center">
               <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center">
                  <Folder className="w-10 h-10 text-gray-900" />
               </div>
            </div>

            <div className="space-y-8">
               <div className="space-y-2">
                  <label className="text-sm font-black text-black tracking-tight ml-1">Project name</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 font-bold text-black focus:outline-none focus:ring-1 focus:ring-black transition-all"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-sm font-black text-black tracking-tight ml-1">Instructions <span className="text-gray-400 font-medium">(optional)</span></label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder='e.g. "Focus on Python best practices", "Maintain a professional tone", or "Always provide sources for important conclusions".'
                    className="w-full h-40 bg-gray-50 border border-gray-100 rounded-2xl p-6 font-medium text-gray-600 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-black transition-all resize-none"
                  />
               </div>

               <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-black transition-all">
                  <div className="flex items-center gap-3">
                     <span className="text-sm font-black text-black">Connectors <span className="text-gray-400 font-medium">(optional)</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="flex -space-x-1">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center p-1 shadow-sm border border-gray-100">
                           <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg" className="w-full h-full object-contain" />
                        </div>
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center p-1 shadow-sm border border-gray-100">
                           <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" className="w-full h-full object-contain" />
                        </div>
                     </div>
                     <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
               </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
               <button 
                 onClick={onClose}
                 className="px-8 py-3 bg-white border border-gray-100 rounded-xl font-bold text-black hover:bg-gray-50 transition-all"
               >
                 Cancel
               </button>
               <button 
                 onClick={() => onSave(formData)}
                 className="px-10 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-900 transition-all opacity-100 disabled:opacity-50"
               >
                 Save
               </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditProjectModal;
