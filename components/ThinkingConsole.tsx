
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Cpu, Search, Sparkles } from 'lucide-react';

interface ThinkingConsoleProps {
  thinking: string;
  isExpanded?: boolean;
}

const ThinkingConsole: React.FC<ThinkingConsoleProps> = ({ thinking, isExpanded = true }) => {
  if (!thinking) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-8 w-full max-w-4xl"
    >
      <div className="bg-white/40 backdrop-blur-md border border-black/5 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="px-6 py-3 bg-black/[0.02] border-b border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Brain className="w-4 h-4 text-primary" />
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-primary/20 rounded-full"
              />
            </div>
            <span className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em]">Agent Reasoning Chain</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500/50 animate-pulse" />
            <span className="text-[10px] font-bold text-black/20 uppercase tracking-widest">Live Engine</span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-1 mt-1">
              <div className="w-0.5 h-full bg-gradient-to-b from-primary/20 via-primary/10 to-transparent rounded-full" />
            </div>
            <div className="flex-1 text-sm text-black/60 font-medium leading-relaxed italic font-serif">
              {thinking.split('\n').map((line, i) => (
                <motion.p 
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="mb-2 last:mb-0"
                >
                  {line}
                </motion.p>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-2 bg-black/[0.01] flex items-center gap-4 text-[9px] font-bold text-black/30 uppercase tracking-widest border-t border-black/[0.02]">
          <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> DeepSeek R1</span>
          <span className="flex items-center gap-1"><Search className="w-3 h-3" /> PageIndex</span>
          <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Hybrid Engine</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ThinkingConsole;
