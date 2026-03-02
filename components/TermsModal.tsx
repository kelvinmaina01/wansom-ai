import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy';
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, type }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 flex items-center justify-center"
          >
            <div className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 shadow-2xl w-full h-full flex flex-col overflow-hidden">
              <div className="flex items-center justify-between p-8 border-b border-white/10">
                <h2 className="text-3xl font-bold text-white tracking-tight">
                  {type === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
                </h2>
                <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition-colors text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 text-gray-300 leading-relaxed no-scrollbar">
                {type === 'terms' ? <TermsContent /> : <PrivacyContent />}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TermsModal;
