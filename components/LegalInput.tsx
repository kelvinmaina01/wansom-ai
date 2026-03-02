
import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { 
  Paperclip, 
  Globe, 
  Zap, 
  Folder, 
  Send,
  Mic,
  Square,
  Wrench
} from 'lucide-react';

import { motion } from 'motion/react';

interface LegalInputProps {
  onSendMessage: (msg: string) => void;
  isLoading: boolean;
  variant?: 'initial' | 'compact';
}

const LegalInput: React.FC<LegalInputProps> = ({ onSendMessage, isLoading, variant = 'initial' }) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const isCompact = variant === 'compact';

  const fullPlaceholder = "Ask Lawlify anything... (e.g., 'Help me draft a contract')";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setPlaceholder(fullPlaceholder.slice(0, i));
      i++;
      if (i > fullPlaceholder.length) {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setInput("Summarize the Kenyan Land Registration Act regarding conveyancing requirements.");
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <motion.div 
      initial={false}
      animate={{ 
        maxWidth: isCompact ? '1400px' : '1024px',
        padding: isCompact ? '0px' : '0px' 
      }}
      className="relative w-full mx-auto"
    >
      <div className={`bg-white rounded-[2rem] border transition-all duration-500 ${isCompact ? 'p-4 shadow-lg shadow-black/[0.03] border-black/10' : 'p-8 shadow-2xl shadow-black/5 border-primary/40 border-2'}`}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className={`w-full text-black placeholder-gray-400 focus:outline-none resize-none border-none p-0 font-medium tracking-tight transition-all duration-500 ${isCompact ? 'h-12 text-base' : 'h-24 text-lg'}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        
        <div className={`flex items-center justify-between transition-all duration-500 ${isCompact ? 'mt-2' : 'mt-6'}`}>
          <div className="flex items-center gap-2 md:gap-3">
            <ToolButton icon={<Paperclip className={`${isCompact ? 'w-4 h-4' : 'w-5 h-5'}`} />} />
            <button className={`flex items-center gap-2 font-bold text-black bg-gray-50 border border-gray-200 rounded-xl hover:bg-black hover:text-white hover:border-black transition-all ${isCompact ? 'px-3 py-1.5 text-[10px]' : 'px-4 py-2 text-xs'}`}>
              <Wrench className={`${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} />
              Tools
            </button>
            <ToolButton icon={<Globe className={`${isCompact ? 'w-4 h-4' : 'w-5 h-5'}`} />} />
            <ToolButton icon={<Zap className={`${isCompact ? 'w-4 h-4' : 'w-5 h-5'}`} />} />
            <ToolButton icon={<Folder className={`${isCompact ? 'w-4 h-4' : 'w-5 h-5'}`} />} />
          </div>

          <div className="flex items-center gap-2 md:gap-4">
             <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`rounded-2xl transition-all shadow-lg ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'} ${isCompact ? 'p-2.5' : 'p-4'}`}
            >
              {isRecording ? <Square className={`${isCompact ? 'w-4 h-4' : 'w-6 h-6'}`} /> : <Mic className={`${isCompact ? 'w-4 h-4' : 'w-6 h-6'}`} />}
            </button>
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className={`bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20 ${isCompact ? 'p-2.5' : 'p-4'}`}
            >
              <Send className={`${isCompact ? 'w-4 h-4' : 'w-6 h-6'}`} />
            </button>
          </div>
        </div>
      </div>
      
      {isRecording && (
        <div className="absolute -top-16 left-0 right-0 flex justify-center">
          <div className="bg-red-500 text-white px-6 py-2 rounded-full text-xs font-bold shadow-xl animate-bounce">
            Lawlify is listening...
          </div>
        </div>
      )}
    </motion.div>
  );
};

const ToolButton = ({ icon, onClick }: { icon: React.ReactNode, onClick?: () => void }) => (
  <button onClick={onClick} className="p-2.5 text-gray-400 hover:text-black transition-all border border-transparent hover:border-gray-200 hover:bg-gray-50 rounded-xl">
    {icon}
  </button>
);

export default LegalInput;
