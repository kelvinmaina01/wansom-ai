import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  AudioWaveform, 
  BrainCircuit, 
  Orbit, 
  ScrollText, 
  Scale, 
  Sparkles, 
  Maximize2, 
  RotateCcw, 
  Plus, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Search,
  BookOpen,
  Volume2,
  FileText,
  ShieldCheck,
  Brain,
  Zap,
  ArrowRight,
  Crown,
  Send,
  X,
  Globe,
  Eye,
  Edit3,
  ArrowLeftRight,
  MoreHorizontal,
  Home,
  ChevronDown,
  History
} from "lucide-react";
import { motion, AnimatePresence } from 'motion/react';
import { apiClient } from '../lib/apiClient';

import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker from local node_modules
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface SAVRESegment {
  id: string;
  category: string;
  insight: string;
  proof: string;
  location: { page: number; rect: number[] } | null;
  timestamp_ms: number;
}

const IntelligenceHub: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const navigate = useNavigate();
  
  // State
  const [isProcessing, setIsProcessing] = useState(true);
  const [activeTab, setActiveTab] = useState<'ai' | 'pages' | 'bookmarks'>('ai');
  const [isAudioMode, setIsAudioMode] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [segments, setSegments] = useState<SAVRESegment[]>([]);
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  
  // Autonomous Metadata
  const [intelligence, setIntelligence] = useState<{
    jurisdiction?: string;
    documentType?: string;
    suggestedPrompts: string[];
    summary: string;
  }>({
    suggestedPrompts: [],
    summary: ''
  });
  
  // Search & Navigation State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeSearchId, setActiveSearchId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Resize Engine
  const [sidebarWidth, setSidebarWidth] = useState(450);
  const [isResizing, setIsResizing] = useState(false);

  // Session Management
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionHistory, setSessionHistory] = useState<any[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 350 && newWidth < window.innerWidth * 0.7) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Audio Sync Ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSearch = async (q: string) => {
     if (!q || q.length < 2) {
       setSearchResults([]);
       return;
     }
     setIsSearching(true);
     try {
       const res = await apiClient.get(`/api/intelligence/search/${fileId}?q=${q}`);
       if (res.ok) {
         const data = await res.json();
         setSearchResults(data.results || []);
         if (data.results?.length > 0) {
            setActiveSearchId(data.results[0].id);
            setCurrentPage(data.results[0].location.page);
         }
       }
     } catch (e) {
       console.error("Search Failed:", e);
     } finally {
       setIsSearching(false);
     }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPdfUrl(`${apiClient.baseUrl}/api/files/${fileId}/view`);
        
        // 1. Check for existing session first
        const sessionsRes = await apiClient.get('/api/intelligence/sessions');
        if (sessionsRes.ok) {
          const sessions = await sessionsRes.json();
          setSessionHistory(sessions);
          
          const existingSession = sessions.find((s: any) => s.file_id === fileId);
          if (existingSession) {
            setSessionId(existingSession.id);
            setMessages(existingSession.chat_history || []);
            setIntelligence({
              jurisdiction: existingSession.metadata?.jurisdiction,
              documentType: existingSession.metadata?.documentType,
              suggestedPrompts: existingSession.metadata?.suggestedPrompts || [],
              summary: existingSession.summary || ''
            });
            setSegments(existingSession.metadata?.segments || []);
            setIsProcessing(false);
            return; // Use existing session data
          }
        }

        // 2. If no session, perform new analysis
        const res = await apiClient.get(`/api/intelligence/analyze/${fileId}`);
        if (res.ok) {
          const data = await res.json();
          setSegments(data.segments);
          const intel = {
            jurisdiction: data.jurisdiction,
            documentType: data.documentType,
            suggestedPrompts: data.suggestedPrompts || [],
            summary: data.summary
          };
          setIntelligence(intel);
          
          // Initial save to create session
          await saveSession(intel, data.segments, []);
          
          if (data.audio_url) {
             audioRef.current = new Audio(data.audio_url);
          }
        }
      } catch (e) {
        console.error('SAVRE Init Error:', e);
      } finally {
        setIsProcessing(false);
      }
    };
    if (fileId) fetchData();
  }, [fileId]);

  const saveSession = async (intel: any, segs: any[], msgs: any[]) => {
    try {
      const res = await apiClient.post('/api/intelligence/sessions', {
        id: sessionId,
        file_id: fileId,
        name: `Analysis: ${fileId}`,
        summary: intel.summary,
        chat_history: msgs,
        metadata: {
          ...intel,
          segments: segs
        }
      });
      if (res.ok) {
        const data = await res.json();
        setSessionId(data.session.id);
      }
    } catch (e) {
      console.error("Failed to save session:", e);
    }
  };

  // S.A.V.R.E. Sync Loop
  useEffect(() => {
    if (!isAudioMode || !audioRef.current || segments.length === 0) return;

    const interval = setInterval(() => {
      if (!audioRef.current) return;
      const currentMs = audioRef.current.currentTime * 1000;
      
      const currentSeg = [...segments]
        .reverse()
        .find(s => s.timestamp_ms <= currentMs);

      if (currentSeg && currentSeg.id !== activeSegmentId) {
        setActiveSegmentId(currentSeg.id);
        if (currentSeg.location) {
          setCurrentPage(currentSeg.location.page);
        }
      }
    }, 500); // Polling reduced for performance

    return () => clearInterval(interval);
  }, [isAudioMode, segments, activeSegmentId]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isAudioMode) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsAudioMode(!isAudioMode);
  };

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg = { role: 'user', content: chatInput };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setChatInput('');
    
    // Auto-save session
    saveSession(intelligence, segments, newMessages);

    try {
      // Using the existing action endpoint or a new chat endpoint 
      const res = await apiClient.post('/api/intelligence/action', {
         fileId,
         selection: chatInput,
         actionType: 'CHAT_QUERY'
      });

      if (res.ok) {
         const data = await res.json();
         const aiMsg = { role: 'ai', content: data.result };
         const finalMessages = [...newMessages, aiMsg];
         setMessages(finalMessages);
         
         // Fix navigation if applicable
         if (data.searchTarget) {
            setCurrentPage(data.searchTarget.page);
            const aiHighlightId = `ai_nav_${Date.now()}`;
            setSearchResults([{ id: aiHighlightId, location: data.searchTarget }]);
            setActiveSearchId(aiHighlightId);
         }

         // Persistence
         saveSession(intelligence, segments, finalMessages);
      }
    } catch (e) {
      console.error("Chat Error:", e);
    }
  };

  return (
    <div className="flex h-full bg-[#f8f9fa] overflow-hidden animate-in fade-in duration-700">
      {/* ... Left Panel (already updated) ... */}
      {/* 🏛️ Left Panel: High-Fidelity PDF Viewer Shell */}
      <div className="flex-1 flex flex-col relative bg-[#F1F3F4] overflow-hidden">
        {/* Floating Page Navigation */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex items-center bg-white/90 backdrop-blur-md border border-gray-200 rounded-full px-4 py-2 shadow-xl gap-4">
           <button 
             className="p-1 hover:bg-gray-100 rounded-full transition-colors"
             onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
           >
             <ChevronLeft className="w-4 h-4 text-gray-600" />
           </button>
           <span className="text-[11px] font-bold text-gray-900 tabular-nums">
             {currentPage} <span className="text-gray-300 mx-1">/</span> {numPages || '?'}
           </span>
           <button 
             className="p-1 hover:bg-gray-100 rounded-full transition-colors"
             onClick={() => setCurrentPage(prev => Math.min(numPages || prev, prev + 1))}
           >
             <ChevronRight className="w-4 h-4 text-gray-600" />
           </button>
        </div>

        {/* PDF Viewport */}
        <div className="flex-1 overflow-auto p-12 flex justify-center bg-gray-100 relative shadow-inner">
          <div className="w-full max-w-4xl bg-white shadow-2xl border border-gray-200 relative overflow-hidden group min-h-[1100px]">
             {isProcessing && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20 flex-col gap-4">
                 <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-progress-strip"></div>
                 </div>
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">S.A.V.R.E. SYNC Active</span>
              </div>
            )}
            
            {pdfUrl && (
              <Document
                file={pdfUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading={<div className="p-12 text-center text-gray-400">Loading Intelligence...</div>}
              >
                <Page 
                  pageNumber={currentPage} 
                  scale={1.5}
                  className="mx-auto"
                />
              </Document>
            )}

            {/* S.A.V.R.E. Primary Highlight (Blue) */}
            {activeSegmentId && segments.find(s => s.id === activeSegmentId)?.location && (
              <div 
                className="absolute bg-primary/10 border-l-4 border-primary pointer-events-none transition-all duration-300 z-10"
                style={{
                  top: segments.find(s => s.id === activeSegmentId)!.location!.rect[1] * 1.5,
                  left: 0,
                  right: 0,
                  height: segments.find(s => s.id === activeSegmentId)!.location!.rect[3] * 1.5 + 40
                }}
              ></div>
            )}

            {/* Search Result Highlight (Yellow) */}
            {activeSearchId && searchResults.find(r => r.id === activeSearchId)?.location?.page === currentPage && (
               <div 
                 className="absolute bg-yellow-400/30 border-l-4 border-yellow-500 pointer-events-none transition-all duration-300 z-10 animate-in fade-in zoom-in"
                 style={{
                   top: searchResults.find(r => r.id === activeSearchId)!.location!.rect[1] * 1.5 - 10,
                   left: 0,
                   right: 0,
                   height: 60
                 }}
                />
             )}
          </div>
        </div>
      </div>

      {/* 🚀 Resize Handle */}
      <div 
        className="w-1 cursor-col-resize transition-all z-30 relative bg-gray-100/50 hover:bg-primary/20 group"
        onMouseDown={(e) => { e.preventDefault(); setIsResizing(true); }}
      >
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-12 bg-white border border-gray-200 rounded-full shadow-lg transition-transform pointer-events-none z-40 ${isResizing ? 'scale-125' : 'group-hover:scale-110'}`} />
      </div>

      {/* 🔮 Right Panel: "Ask AI Assistant" Workspace */}
      <div 
        className="flex flex-col bg-white overflow-hidden border-l border-gray-100 shadow-2xl relative"
        style={{ width: sidebarWidth }}
      >
        {/* Assistant Header: Consolidated Metadata & Actions */}
        <div className="border-b border-gray-100 bg-white shrink-0">
          {/* Breadcrumbs & Utility Nav */}
          <div className="h-10 px-6 flex items-center justify-between border-b border-gray-50 bg-[#fafbfc]">
             <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                <Home className="w-3 h-3" />
                <span>Vault</span>
                <ChevronRight className="w-2.5 h-2.5" />
                <span className="text-gray-900">Legislation</span>
             </div>
             <div className="flex items-center gap-3">
                <MoreHorizontal className="w-4 h-4 text-gray-300 hover:text-gray-600 cursor-pointer" />
                <X className="w-4 h-4 text-gray-300 hover:text-red-500 cursor-pointer transition-colors" onClick={() => navigate(-1)} />
             </div>
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex flex-col gap-1">
                <h1 className="text-sm font-bold text-gray-900 flex items-center gap-2 leading-tight">
                  {intelligence.documentType || 'Analyzing Document...'}
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                </h1>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  <Globe className="w-3 h-3 text-primary/60" />
                  <span>{intelligence.jurisdiction || 'Kenya Judiciary'}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                 <button className="flex flex-col items-center gap-1 p-2 rounded-xl border border-gray-50 hover:bg-gray-50 hover:border-gray-200 transition-all group">
                    <Eye className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary" />
                    <span className="text-[8px] font-bold text-gray-400 group-hover:text-gray-600 uppercase">View</span>
                 </button>
                 <button className="flex flex-col items-center gap-1 p-2 rounded-xl border border-gray-50 hover:bg-gray-50 hover:border-gray-200 transition-all group">
                    <Edit3 className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary" />
                    <span className="text-[8px] font-bold text-gray-400 group-hover:text-gray-600 uppercase">Edit</span>
                 </button>
                 <button className="flex flex-col items-center gap-1 p-2 rounded-xl border border-gray-50 hover:bg-gray-50 hover:border-gray-200 transition-all group">
                    <ArrowLeftRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary" />
                    <span className="text-[8px] font-bold text-gray-400 group-hover:text-gray-600 uppercase">Convert</span>
                 </button>
              </div>
            </div>

            {/* Sidebar Search Bar */}
            <div className="flex items-center bg-[#F8F9FA] border border-gray-100 rounded-xl px-4 py-2 focus-within:border-primary/40 focus-within:bg-white transition-all group shadow-sm">
               <Search className={`w-4 h-4 mr-3 transition-colors ${isSearching ? 'text-primary animate-pulse' : 'text-gray-400'}`} />
               <input 
                 type="text"
                 placeholder="Search within clauses..."
                 className="bg-transparent border-none focus:ring-0 text-xs text-gray-900 w-full placeholder:text-gray-400 font-medium"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
               />
               {searchResults.length > 0 && (
                 <div className="flex items-center gap-3 border-l border-gray-200 ml-3 pl-3">
                    <span className="text-[10px] font-bold text-gray-400 tabular-nums">
                      {searchResults.findIndex(r => r.id === activeSearchId) + 1} of {searchResults.length}
                    </span>
                    <div className="flex items-center gap-1">
                      <ChevronLeft 
                        onClick={() => {
                          const idx = searchResults.findIndex(r => r.id === activeSearchId);
                          const prev = searchResults[idx - 1] || searchResults[searchResults.length - 1];
                          setActiveSearchId(prev.id);
                          setCurrentPage(prev.location.page);
                        }} 
                        className="w-3 h-3 text-gray-400 cursor-pointer hover:text-primary transition-colors" 
                      />
                      <ChevronRight 
                        onClick={() => {
                          const idx = searchResults.findIndex(r => r.id === activeSearchId);
                          const next = searchResults[idx + 1] || searchResults[0];
                          setActiveSearchId(next.id);
                          setCurrentPage(next.location.page);
                        }} 
                        className="w-3 h-3 text-gray-400 cursor-pointer hover:text-primary transition-colors" 
                      />
                    </div>
                 </div>
               )}
            </div>
          </div>

          <div className="flex items-center px-6 gap-6 relative">
             <div 
               onClick={() => setActiveTab('ai')}
               className={`text-[11px] font-extrabold cursor-pointer transition-all pb-3 relative z-10 uppercase tracking-widest ${activeTab === 'ai' ? 'text-primary' : 'text-gray-300 hover:text-gray-500'}`}
             >
               Ask AI Assistant
               {activeTab === 'ai' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
             </div>
             <div 
               onClick={() => setActiveTab('pages')}
               className={`text-[11px] font-extrabold cursor-pointer transition-all pb-3 relative z-10 uppercase tracking-widest ${activeTab === 'pages' ? 'text-primary' : 'text-gray-300 hover:text-gray-500'}`}
             >
               Legal Analysis
               {activeTab === 'pages' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
             </div>
             
             {/* My History Toggle */}
             <div 
               onClick={() => setIsHistoryOpen(!isHistoryOpen)}
               className={`text-[11px] font-extrabold cursor-pointer transition-all pb-3 relative z-10 uppercase tracking-widest flex items-center gap-2 ${isHistoryOpen ? 'text-primary' : 'text-gray-300 hover:text-gray-500'}`}
             >
               <RotateCcw className={`w-3 h-3 ${isHistoryOpen ? 'animate-spin-slow' : ''}`} />
               My History
               {isHistoryOpen && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
             </div>

             <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-50" />
          </div>
        </div>

        {/* Sidebar Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* My History Overlay Sidebar */}
          <AnimatePresence>
            {isHistoryOpen && (
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute inset-0 z-50 bg-white border-l border-gray-100 flex flex-col shadow-2xl"
              >
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                   <h3 className="text-sm font-black text-black uppercase tracking-widest flex items-center gap-2">
                     <RotateCcw className="w-4 h-4 text-primary" />
                     Work History
                   </h3>
                   <button onClick={() => setIsHistoryOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                     <X className="w-4 h-4 text-gray-400" />
                   </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {sessionHistory.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                       <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                         <History className="w-8 h-8 text-gray-200" />
                       </div>
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No history yet</p>
                    </div>
                  ) : (
                    sessionHistory.map((session) => (
                      <div 
                        key={session.id}
                        onClick={() => navigate(`/intelligence/${session.file_id || 'vault'}`)} // Actually we should ideally support loading by sessionId
                        className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                          sessionId === session.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-50 hover:border-gray-200 bg-white'
                        }`}
                      >
                         <h4 className="text-xs font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-primary transition-colors">{session.name}</h4>
                         <div className="flex items-center justify-between">
                            <span className="text-[9px] text-gray-400 font-medium">{new Date(session.updated_at).toLocaleDateString()}</span>
                            <span className="text-[9px] font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">Restore ➜</span>
                         </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {activeTab === 'ai' ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                {messages.length === 0 ? (
                  <>
                    <div className="space-y-4 mb-8">
                       <Sparkles className="w-8 h-8 text-[#A855F7] animate-bounce-subtle" />
                       <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Hi, how can I help you?</h3>
                       <p className="text-xs text-gray-500 leading-relaxed italic">
                         {intelligence.summary || "I've analyzed this document. What would you like to know?"}
                       </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                       {intelligence.suggestedPrompts.map((prompt, idx) => (
                         <button 
                           key={idx}
                           onClick={() => { setChatInput(prompt); }}
                           className="text-left p-3 border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-primary/20 transition-all group min-h-[100px] flex flex-col justify-between"
                         >
                           <Zap className="w-3 h-3 text-gray-400 group-hover:text-primary transition-colors mb-2" />
                           <span className="text-[11px] font-medium text-gray-600 line-clamp-2 leading-tight group-hover:text-gray-900 transition-colors">
                             {prompt}
                           </span>
                         </button>
                       ))}
                    </div>

                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-4 group cursor-pointer hover:bg-primary/10 transition-all">
                       <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Crown className="w-5 h-5" />
                       </div>
                       <div>
                          <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-wider">Gemini Plus</h4>
                          <p className="text-[10px] text-gray-500">DeepSeek-R1 drafting & 100GB vault</p>
                       </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[90%] p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                          msg.role === 'user' 
                          ? 'bg-primary text-white shadow-primary/10' 
                          : 'bg-white border border-gray-100 text-gray-700'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Chat Input Zone */}
              <div className="p-6 border-t border-gray-100 bg-white">
                <div className="relative group shadow-sm rounded-2xl overflow-hidden">
                  <textarea 
                    placeholder="Ask assistant to find or explain..."
                    className="w-full bg-gray-50/50 border-none px-5 py-4 text-sm focus:ring-1 focus:ring-primary/20 transition-all min-h-[120px] resize-none pr-14 text-gray-900 placeholder:text-gray-400"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="absolute right-3 bottom-3 p-2.5 bg-primary text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-8 bg-[#fdfdfd]">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">S.A.V.R.E. Briefing</h3>
                  <button 
                   onClick={toggleAudio}
                   className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase border transition-all ${
                     isAudioMode ? 'bg-primary/10 border-primary text-primary' : 'bg-gray-50 border-gray-100 text-gray-400'
                   }`}
                  >
                    {isAudioMode ? <AudioWaveform className="w-3 h-3 animate-pulse" /> : <Volume2 className="w-3 h-3" />}
                    {isAudioMode ? 'Directing' : 'Start Walkthrough'}
                  </button>
               </div>
               <div className="space-y-4">
                  {segments.map((seg) => (
                    <div 
                      key={seg.id}
                      onClick={() => {
                         if (seg.location) setCurrentPage(seg.location.page);
                         setActiveSegmentId(seg.id);
                      }}
                      className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                        activeSegmentId === seg.id ? 'border-primary/30 bg-primary/5 shadow-md -translate-y-1' : 'border-gray-50 bg-white hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                         <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tighter ${
                           seg.category === 'RISK' ? 'bg-red-50 text-red-600' : 
                           seg.category === 'COMMITMENT' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                         }`}>
                           {seg.category}
                         </span>
                      </div>
                      <p className="text-sm font-bold text-gray-900 mb-1 leading-snug">{seg.insight}</p>
                      <p className="text-[12px] text-gray-500 italic leading-relaxed line-clamp-2">"{seg.proof}"</p>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes progress-strip {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
        .animate-progress-strip { animation: progress-strip 1.5s infinite linear; }
        @keyframes bounce-subtle {
           0%, 100% { transform: translateY(0); }
           50% { transform: translateY(-3px); }
        }
        .animate-bounce-subtle { animation: bounce-subtle 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default IntelligenceHub;
