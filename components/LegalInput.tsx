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
  Wrench,
  Search,
  Sparkles
} from 'lucide-react';

import { motion } from 'motion/react';

interface LegalInputProps {
  onSendMessage: (msg: string) => void;
  isLoading: boolean;
  variant?: 'initial' | 'compact';
  activeSpecialistName?: string;
  isCoworkMode?: boolean;
  setIsCoworkMode?: (val: boolean) => void;
  mode: 'fast' | 'thinking' | 'research';
  setMode: (mode: 'fast' | 'thinking' | 'research') => void;
  webSearchEnabled: boolean;
  setWebSearchEnabled: (val: boolean) => void;
  onVaultClick?: () => void;
}

const LegalInput: React.FC<LegalInputProps> = ({ 
  onSendMessage, 
  isLoading, 
  variant = 'initial', 
  activeSpecialistName,
  isCoworkMode = false,
  setIsCoworkMode,
  mode,
  setMode,
  webSearchEnabled,
  setWebSearchEnabled,
  onVaultClick
}) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const [isModeOpen, setIsModeOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isCompact = variant === 'compact';

  const fullPlaceholder = activeSpecialistName 
    ? `Ask ${activeSpecialistName} anything...` 
    : "Ask Lawlify anything... (e.g., 'Help me draft a contract')";

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
  }, [fullPlaceholder]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsModeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setInput(`Analyze this document: ${file.name}\n\n[System: File "${file.name}" attached for analysis]`);
    // Here we would typically upload the file to Supabase/Backend
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
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

  const getModeIcon = () => {
    switch (mode) {
      case 'research': return <Search className="w-4 h-4" />;
      case 'thinking': return <Sparkles className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <motion.div 
      initial={false}
      animate={{ 
        maxWidth: isCompact ? '1400px' : '1024px',
        padding: isCompact ? '0px' : '0px' 
      }}
      className="relative w-full mx-auto"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className={`bg-white rounded-[15px] border transition-all duration-500 relative ${isDragging ? 'border-primary ring-4 ring-primary/10' : ''} ${isCompact ? 'p-5 shadow-lg shadow-black/[0.03] border-gray-200' : 'p-8 shadow-2xl shadow-black/5 border-primary/20 border-2'}`}>
        
        {isDragging && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center border-4 border-dashed border-primary/30 rounded-[2.5rem] animate-in fade-in zoom-in duration-200">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Paperclip className="w-10 h-10 text-primary" />
            </div>
            <p className="text-xl font-bold text-black tracking-tight">Drop documents here for instant analysis</p>
            <p className="text-gray-400 text-sm font-medium mt-1">PDF, DOCX, or Images</p>
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className={`w-full text-black placeholder-gray-400 focus:outline-none resize-none border-none p-0 font-medium tracking-tight transition-all duration-200 min-h-[48px] max-h-[400px] overflow-y-auto no-scrollbar ${isCompact ? 'text-base' : 'text-lg'}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        
        <div className={`flex items-center justify-between transition-all duration-500 ${isCompact ? 'mt-4' : 'mt-8'}`}>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            
            {/* Mode Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsModeOpen(!isModeOpen)}
                className={`flex items-center gap-2 font-bold transition-all rounded-xl p-2.5 border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 ${isModeOpen ? 'border-primary shadow-sm ring-2 ring-primary/5' : ''}`}
              >
                {getModeIcon()}
                <span className="text-[10px] uppercase tracking-widest hidden sm:inline">{mode}</span>
              </button>
              
              <AnimatePresence>
                {isModeOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: -12, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-full left-0 mb-6 w-56 bg-white border border-gray-100 rounded-[15px] shadow-2xl p-2.5 z-[100]"
                  >
                    <button 
                      onClick={(e) => { e.stopPropagation(); setMode('fast'); setIsModeOpen(false); }}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl hover:bg-red-50/50 transition-all ${mode === 'fast' ? 'bg-red-50 text-red-600 border border-red-100' : 'text-gray-500 hover:text-black'}`}
                    >
                      <Zap className="w-4 h-4" />
                      <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-tight">Fast</p>
                        <p className="text-[9px] font-medium opacity-60">Instant legal definitions</p>
                      </div>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setMode('thinking'); setIsModeOpen(false); }}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl hover:bg-gray-50/50 transition-all ${mode === 'thinking' ? 'bg-primary/5 text-primary border border-primary/10' : 'text-gray-500 hover:text-black'}`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-tight">Thinking</p>
                        <p className="text-[9px] font-medium opacity-60">Deep reasoning chains</p>
                      </div>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setMode('research'); setWebSearchEnabled(true); setIsModeOpen(false); }}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl hover:bg-gray-50/50 transition-all ${mode === 'research' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}`}
                    >
                      <Search className="w-4 h-4" />
                      <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-tight">Research</p>
                        <p className="text-[9px] font-medium opacity-60">Live web searching</p>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-6 w-px bg-gray-100"></div>

            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={(e) => handleFileUpload(e.target.files)} 
            />
            <ToolButton 
              icon={<Paperclip className={`${isCompact ? 'w-4 h-4' : 'w-5 h-5'}`} />} 
              onClick={() => fileInputRef.current?.click()}
              tooltip="Attach Document"
            />

            <ToolButton 
              icon={<Globe className={`${isCompact ? 'w-4 h-4' : 'w-5 h-5'}`} />} 
              active={webSearchEnabled || mode === 'research'} 
              onClick={() => setWebSearchEnabled(!webSearchEnabled)}
              tooltip="Enable internet search to guide response"
            />
            
            <div className="flex items-center bg-gray-50 border border-gray-100 rounded-[1.2rem] p-1">
              <button 
                onClick={() => setIsCoworkMode?.(false)}
                className={`flex items-center gap-1.5 font-bold transition-all rounded-[0.9rem] ${isCompact ? 'px-2 py-1 text-[9px]' : 'px-3 py-1.5 text-[10px]'} ${!isCoworkMode ? 'bg-white text-black shadow-sm border border-gray-100' : 'text-gray-400 hover:text-black'}`}
              >
                Counsel
              </button>
              <button 
                onClick={() => setIsCoworkMode?.(true)}
                className={`flex items-center gap-1.5 font-bold transition-all rounded-[0.9rem] ${isCompact ? 'px-2 py-1 text-[9px]' : 'px-3 py-1.5 text-[10px]'} ${isCoworkMode ? 'bg-gray-100 text-black border border-gray-200' : 'text-gray-400 hover:text-black'}`}
              >
                Cowork
              </button>
            </div>

            <div className="h-6 w-px bg-gray-100"></div>

            <ToolButton 
              icon={<Folder className={`${isCompact ? 'w-4 h-4' : 'w-5 h-5'}`} />} 
              onClick={onVaultClick}
              tooltip="Open Legal Vault (Saved Documents)"
            />
          </div>

          <div className="flex items-center gap-2 md:gap-4">
             <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`rounded-2xl transition-all shadow-lg ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-50 text-gray-500 hover:bg-black hover:text-white'} ${isCompact ? 'p-2.5' : 'p-3.5'}`}
            >
              {isRecording ? <Square className={`${isCompact ? 'w-4 h-4' : 'w-5 h-5'}`} /> : <Mic className={`${isCompact ? 'w-4 h-4' : 'w-5 h-5'}`} />}
            </button>
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className={`bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20 ${isCompact ? 'p-2.5' : 'p-3.5'}`}
            >
              <Send className={`${isCompact ? 'w-4 h-4' : 'w-5 h-5'}`} />
            </button>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isRecording && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-16 left-0 right-0 flex justify-center"
          >
            <div className="bg-red-500 text-white px-6 py-2 rounded-full text-xs font-bold shadow-xl animate-bounce">
              Lawlify is listening...
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ToolButton = ({ icon, onClick, active, tooltip }: { icon: React.ReactNode, onClick?: () => void, active?: boolean, tooltip?: string }) => (
  <button 
    onClick={onClick} 
    title={tooltip}
    className={`p-2.5 transition-all border rounded-xl flex items-center justify-center ${active ? 'text-red-600 border-red-100 bg-red-50 shadow-sm' : 'text-gray-400 hover:text-black border-transparent hover:border-gray-200 hover:bg-gray-50'}`}
  >
    {icon}
  </button>
);

export default LegalInput;
