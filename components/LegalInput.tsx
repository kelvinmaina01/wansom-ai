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
  Sparkles,
  Plus,
  Plug2,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { INTEGRATION_CATEGORIES, IntegrationItem } from './Integrations';

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
  connectedIds: Set<string>;
  selectedTunnelIds: Set<string>;
  onOpenConnectors: () => void;
  onToggleIntegration: (id: string) => void;
  onToggleTunnel: (id: string) => void;
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
  onVaultClick,
  connectedIds = new Set(),
  selectedTunnelIds = new Set(),
  onOpenConnectors,
  onToggleIntegration,
  onToggleTunnel
}) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const [isModeOpen, setIsModeOpen] = useState(false);
  const [isConnectorOpen, setIsConnectorOpen] = useState(false);
  const [showConnectorShelf, setShowConnectorShelf] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const connectorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isCompact = variant === 'compact';

  const fullPlaceholder = activeSpecialistName 
    ? `Assign a task to ${activeSpecialistName}...` 
    : "Assign a task... (e.g., 'Draft a commercial lease summary')";

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

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsModeOpen(false);
      }
      if (connectorRef.current && !connectorRef.current.contains(event.target as Node)) {
        setIsConnectorOpen(false);
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
      mediaRecorder.ondataavailable = (event) => audioChunksRef.current.push(event.data);
      mediaRecorder.onstop = () => {
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

  const allIntegrations = React.useMemo(() => {
    return INTEGRATION_CATEGORIES.flatMap(c => c.items);
  }, []);

  const activeConnectedIntegrations = React.useMemo(() => {
    return allIntegrations.filter(item => selectedTunnelIds?.has(item.id));
  }, [allIntegrations, selectedTunnelIds]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div className={`relative w-full transition-all duration-300 ${isDragging ? 'scale-[1.01]' : ''}`}>
      {isDragging && (
        <div className="absolute inset-0 bg-primary/5 border-2 border-dashed border-primary/30 rounded-[2.5rem] z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
            <Paperclip className="w-5 h-5 text-primary animate-bounce" />
            <span className="text-sm font-bold text-black uppercase tracking-widest">Drop legal artifacts here</span>
          </div>
        </div>
      )}

      <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`bg-white border-2 ${isDragging ? 'border-primary/30' : 'border-[#F0F0F0]'} transition-all duration-300 shadow-2xl shadow-black/5 hover:border-gray-200 group-within:border-gray-300 relative z-10 ${
          showConnectorShelf && (connectedIds?.size === 0) ? 'rounded-t-[2.5rem] rounded-b-none' : 'rounded-[2.5rem]'
        } p-4`}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="w-full bg-transparent border-none outline-none focus:ring-0 text-lg md:text-xl font-medium text-black placeholder-gray-300 resize-none min-h-[48px] max-h-[400px] p-2 md:p-4 font-sans no-scrollbar overflow-hidden"
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2 px-2 pb-2">
          {/* Bottom Left Buttons: The New Controls */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1 ml-2 pointer-events-none">
              {activeConnectedIntegrations.map(item => (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={item.id} 
                  className="w-5 h-5 rounded-md border border-white bg-white p-0.5 shadow-sm active-tunnel-glow"
                >
                  <img src={item.icon} alt="" className="w-full h-full object-contain" />
                </motion.div>
              ))}
            </div>
            {activeConnectedIntegrations.length > 0 && (
              <span className="text-[10px] font-black text-green-500 uppercase tracking-tighter animate-pulse ml-1">Tunnel Active</span>
            )}

            {/* Plus Button */}
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 transition-all hover:scale-105"
              title="Add legal artifact"
            >
              <Plus className="w-5 h-5" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={(e) => handleFileUpload(e.target.files)} 
            />

            {/* Integration/Plug Button */}
            <div className="relative" ref={connectorRef}>
              <button 
                onClick={() => setIsConnectorOpen(!isConnectorOpen)}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:scale-105 ${
                  isConnectorOpen ? 'bg-gray-100 text-black border-gray-100' : 'bg-white text-gray-400 border-gray-100 hover:text-black hover:bg-gray-50'
                }`}
                title="Connect legal tools"
              >
                <Plug2 className="w-5 h-5 flex-shrink-0" style={{ transform: 'rotate(45deg)' }} />
              </button>

              <AnimatePresence>
                {isConnectorOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-full left-0 mb-4 w-[450px] bg-white border border-gray-100 shadow-2xl rounded-[1.5rem] overflow-hidden z-[100]"
                    >
                      <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                         <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Quick Connect</h4>
                      </div>
                      
                      <div className="p-2 space-y-1">
                        {allIntegrations.slice(0, 5).map((item) => {
                          const isConnected = connectedIds?.has(item.id);
                          const isSelected = selectedTunnelIds?.has(item.id);
                          
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                if (isConnected) {
                                  onToggleTunnel(item.id);
                                } else {
                                  window.location.href = '/app/integrations';
                                }
                                setIsConnectorOpen(false);
                              }}
                              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all group ${
                                isSelected ? 'bg-black text-white shadow-xl shadow-black/10' : 'hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center gap-4 overflow-hidden">
                                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center p-2 shrink-0 group-hover:scale-110 transition-transform ${
                                  isSelected ? 'bg-white border-transparent' : 'bg-white border-gray-100'
                                }`}>
                                   <img src={item.icon} alt={item.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="text-left overflow-hidden">
                                  <span className={`text-[12px] font-black block truncate mb-0.5 ${isSelected ? 'text-white' : 'text-black'}`}>{item.name}</span>
                                  <span className={`text-[10px] font-bold block leading-tight max-w-[240px] truncate md:whitespace-normal ${
                                    isSelected ? 'text-white/60' : 'text-gray-400 group-hover:text-black/60'
                                  }`}>
                                     {item.description}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-1 shrink-0 ml-4">
                                {isConnected ? (
                                  <div className={`p-1.5 rounded-full transition-all ${isSelected ? 'bg-green-500' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                                    <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-black'}`} />
                                  </div>
                                ) : (
                                  <span className="text-[10px] font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                     Establish connection
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                    <button
                      onClick={() => {
                        onOpenConnectors();
                        setIsConnectorOpen(false);
                      }}
                      className="w-full p-4 border-t border-gray-50 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1 px-2 border border-gray-100 rounded-lg bg-white">
                           <Plus className="w-3.5 h-3.5 text-black" />
                        </div>
                        <span className="text-xs font-bold text-black uppercase tracking-tight">Add connectors</span>
                      </div>
                      
                      <div className="flex items-center">
                         <div className="flex -space-x-1.5 mr-2">
                            {allIntegrations.slice(0, 2).map(item => (
                              <div key={item.id} className="w-5 h-5 rounded-full border border-white bg-white p-0.5 shadow-sm">
                                <img src={item.icon} alt="" className="w-full h-full object-contain" />
                              </div>
                            ))}
                         </div>
                         <span className="text-[10px] font-bold text-gray-300">+{allIntegrations.length - 2}</span>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={onVaultClick}
              className="px-4 py-2 rounded-full border border-gray-100 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black hover:bg-gray-50 transition-all ml-2"
            >
              <Folder className="w-3.5 h-3.5" />
              Vault
            </button>
          </div>

          {/* Right Section: Mode & Send */}
          <div className="flex items-center gap-3">
             {/* Web Search Toggle */}
             <button
              onClick={() => setWebSearchEnabled(!webSearchEnabled)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all border ${
                webSearchEnabled 
                  ? 'bg-blue-50 border-blue-100 text-blue-600 shadow-sm' 
                  : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'
              }`}
            >
              <Globe className={`w-3.5 h-3.5 ${webSearchEnabled ? 'animate-pulse' : ''}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">{webSearchEnabled ? 'Search ON' : 'Search'}</span>
            </button>

            {/* Mode Selector */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsModeOpen(!isModeOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 text-gray-400 hover:text-black hover:bg-gray-50 transition-all font-sans"
              >
                <div className="p-1 px-1.5 bg-gray-50 rounded-lg">
                   {getModeIcon()}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">{mode}</span>
              </button>

              <AnimatePresence>
                {isModeOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: -12, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-full right-0 mb-6 w-64 bg-white border border-gray-100 shadow-2xl rounded-[1.5rem] p-2 z-[100]"
                  >
                    {[
                      { id: 'fast', label: 'Fast', icon: <Zap className="w-4 h-4" />, desc: 'Instant legal summaries & drafting' },
                      { id: 'thinking', label: 'Thinking', icon: <Sparkles className="w-4 h-4" />, desc: 'Complex reasoning & strategy' },
                      { id: 'research', label: 'Research', icon: <Search className="w-4 h-4" />, desc: 'Deep case law & discovery' }
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setMode(m.id as any);
                          setIsModeOpen(false);
                        }}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all ${
                          mode === m.id ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${mode === m.id ? 'bg-white/10' : 'bg-gray-100'}`}>
                          {m.icon}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold leading-tight">{m.label}</p>
                          <p className={`text-[10px] ${mode === m.id ? 'text-white/60' : 'text-gray-400'}`}>{m.desc}</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cowork Toggle */}
            <button
               onClick={() => setIsCoworkMode && setIsCoworkMode(!isCoworkMode)}
               className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all border-2 ${
                  isCoworkMode 
                    ? 'bg-black border-black text-white shadow-xl shadow-black/10' 
                    : 'bg-white border-[#F0F0F0] text-gray-400 hover:border-black hover:text-black'
               }`}
            >
               <span className="text-[10px] font-black uppercase tracking-widest">{isCoworkMode ? 'Counsel Mode ON' : 'Counsel'}</span>
            </button>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                input.trim() && !isLoading
                  ? 'bg-black text-white shadow-2xl shadow-black/20 hover:scale-105 active:scale-95'
                  : 'bg-gray-50 text-gray-200'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Hanging Connector Shelf (Manus Style) */}
      <AnimatePresence>
        {showConnectorShelf && connectedIds?.size === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="-mt-[2px] mx-0 bg-white border-2 border-t-0 border-[#F0F0F0] rounded-b-[2.5rem] p-5 px-10 flex items-center justify-between shadow-2xl shadow-black/[0.02] relative z-0 transition-all hover:bg-gray-50 group backdrop-blur-none"
          >
            <div 
               className="flex items-center gap-6 hover:opacity-70 transition-opacity cursor-pointer flex-1"
            >
              <Plug2 className="w-6 h-6 text-black" style={{ transform: 'rotate(45deg)' }} />
              <div 
                className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 overflow-hidden"
                onClick={() => window.location.href = '/app/integrations'}
              >
                <span className="text-[14px] font-black uppercase text-black tracking-[0.2em] whitespace-nowrap">
                  Connect tools to Lawlify
                </span>
                <div className="hidden md:block h-6 w-[2px] bg-gray-100" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest line-clamp-1 border-l-2 border-primary/20 pl-4 py-1">
                  Securely bridge your discovery context with Lawlify's autonomous legal engine
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Tool Icons (Overlapping Stacks) */}
              <div 
                className="flex items-center -space-x-3 mr-4 cursor-pointer hover:scale-[1.02] transition-transform"
                onClick={onOpenConnectors}
              >
                 {allIntegrations.slice(0, 4).map((item, idx) => (
                   <motion.div 
                     key={item.id} 
                     whileHover={{ y: -4, scale: 1.1, zIndex: 50 }}
                     className="w-10 h-10 rounded-full border-2 border-white bg-white p-1.5 shadow-lg relative"
                     style={{ zIndex: 40 - idx }}
                     title={`Connect ${item.name}`}
                   >
                     <img src={item.icon} alt="" className="w-full h-full object-contain" />
                   </motion.div>
                 ))}
                 {allIntegrations.length > 4 && (
                   <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-black text-black shadow-md relative z-0">
                     +{allIntegrations.length - 4}
                   </div>
                 )}
              </div>
              
              <button 
                onClick={() => setShowConnectorShelf(false)}
                className="p-1 text-gray-300 hover:text-black transition-colors"
                title="Close discovery feed"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Visual Indicator of Connection */}
      {selectedTunnelIds?.size > 0 && (
         <div className="absolute -top-3 left-10 px-3 py-1 bg-white border border-gray-100 rounded-full shadow-sm flex items-center gap-2 z-10 transition-all animate-in fade-in slide-in-from-bottom-2">
            <div className="flex -space-x-2">
               {Array.from(selectedTunnelIds || []).slice(0, 3).map(id => {
                  const item = INTEGRATION_CATEGORIES.flatMap(c => c.items).find(i => i.id === id);
                  return item ? (
                    <div key={id} className="w-5 h-5 rounded-full border border-white bg-white p-0.5 shadow-sm active-tunnel-glow">
                       <img src={item.icon} alt="" className="w-full h-full object-contain" />
                    </div>
                  ) : null;
               })}
            </div>
            <span className="text-[9px] font-black text-black uppercase tracking-widest">{selectedTunnelIds.size} Active Channel{selectedTunnelIds.size > 1 ? 's' : ''}</span>
         </div>
      )}

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
    </div>
  );
};

export default LegalInput;
