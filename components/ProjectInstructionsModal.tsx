import React, { useState } from 'react';
import { X, Link as LinkIcon, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (instructions: string) => void;
  instructions: string;
}

const ProjectInstructionsModal: React.FC<ProjectInstructionsModalProps> = ({ isOpen, onClose, onSave, instructions }) => {
  const [value, setValue] = useState(instructions);

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
          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-black text-black tracking-tight leading-none mb-1">Project instructions</h2>
               <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
               </button>
            </div>
            
            <p className="text-gray-400 font-medium text-sm leading-relaxed mb-4">
               Applies to all chats in this project. Customize behavior, context, style and more.
            </p>

            <div className="space-y-6">
               <textarea 
                 value={value}
                 onChange={e => setValue(e.target.value)}
                 placeholder='e.g. "Focus on Python best practices", "Maintain a professional tone", or "Always provide sources for important conclusions".'
                 className="w-full h-80 bg-gray-50 border border-gray-100 rounded-2xl p-6 font-medium text-gray-600 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-black transition-all resize-none leading-relaxed"
               />

               <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-black transition-all">
                  <div className="flex items-center gap-3">
                     <span className="text-sm font-black text-black">Connectors <span className="text-gray-400 font-medium">(optional)</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="flex items-center gap-1">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg" className="w-5 h-5 grayscale opacity-50" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" className="w-5 h-5" />
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
                 onClick={() => onSave(value)}
                 className="px-10 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-900 transition-all"
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

export default ProjectInstructionsModal;
