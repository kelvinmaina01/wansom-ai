import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Sparkles, MessageSquare, List, Bookmark, 
  ChevronRight, ChevronLeft, Search, Send, X, 
  Maximize2, Download, Share2, MoreHorizontal, 
  Brain, Zap, Shield, Wand2, ArrowLeft, Loader2,
  Lock, CheckCircle2, AlertCircle, Edit3, Eraser, Globe
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const DocumentInsights: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileId = new URLSearchParams(location.search).get('fileId') || '1';
  
  const [activeSidePanel, setActiveSidePanel] = useState<'summary' | 'chat' | 'bookmarks'>('summary');
  const [isProcessing, setIsProcessing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [detectedSkills, setDetectedSkills] = useState<string[]>([]);
  const [jurisdiction, setJurisdiction] = useState<string | null>(null);

  // Simulate LlamaParse + Gemini 3.1 Flow
  useEffect(() => {
    let interval: any;
    if (isProcessing) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsProcessing(false);
              setDetectedSkills(['jurisdiction-kenya', 'doc-court-filing', 'logic-deadlines']);
              setJurisdiction('Kenya');
            }, 500);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    
    // Simulate AI response
    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: jurisdiction === 'Kenya' 
          ? "Using the Kenya Legal Skill (Constitution 2010 framework): Article 27 guarantees freedom from discrimination. Since this is supreme legislation, any conflicting laws in your query would be void per Article 2. How should we proceed with analyzing specific clauses?"
          : "Based on Article 27 of the Constitution (as seen on page 40), this document emphasizes freedom from discrimination and the right to equality. It specifically outlines that the state shall not discriminate on any ground including race, sex, or religion.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-[#f6f8fa] text-gray-900 overflow-hidden">
      {/* Top Toolbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/app/files')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center border border-red-100">
              <FileText className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900">Land_Registry_Act_2012.pdf</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vault / Legislation</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 rounded-lg p-1 mr-4">
             <button className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-black transition-colors rounded-md bg-white shadow-sm">View</button>
             <button className="px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-black transition-colors rounded-md">Edit</button>
             <button className="px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-black transition-colors rounded-md">Convert</button>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><Search className="w-4 h-4" /></button>
          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><Download className="w-4 h-4" /></button>
          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><Share2 className="w-4 h-4" /></button>
          <div className="w-px h-6 bg-gray-200 mx-2" />
          <button className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg shadow-red-600/10">
            <Sparkles className="w-4 h-4" />
            Ask AI Assistant
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* PDF Viewer Pane */}
        <div className="flex-1 bg-gray-200/50 relative overflow-hidden flex flex-col items-center p-8 overflow-y-auto no-scrollbar">
          {/* Mock PDF Document */}
          <div className="w-full max-w-[850px] bg-white shadow-2xl rounded-sm p-16 font-serif text-gray-800 leading-relaxed min-h-[1200px] relative border border-gray-200">
            <div className="absolute top-8 right-8 text-[10px] text-gray-400 font-sans font-bold">Page 40 / 72</div>
            
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold uppercase tracking-widest mb-4">Constitution of Kenya</h2>
                <div className="w-24 h-1 bg-black mx-auto"></div>
              </div>

              <section>
                <h3 className="text-lg font-bold mb-6">7. Freedom of Association; Assembly, demonstration, picketing and petition (Articles 36 and 37) ............................................................................ 40</h3>
                <p className="text-lg">Every person has the right to freedom of association, which includes the right to form, join or participate in the activities of an association of any kind.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-6">8. Political Rights (Article 38) .................................................................................................... 43</h3>
                <p className="text-lg">Every citizen is free to make political choices, which includes the right— (a) to form, or participate in forming, a political party; (b) to participate in the activities of, or recruit members for, a political party; or (c) to campaign for a political party or cause.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-6">9. Freedom of Movement and Residence(Article 39) ................................................................. 46</h3>
                <p className="text-lg">Every person has the right to freedom of movement. (2) Every person has the right to leave Kenya.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-6">10. Protection of the Right to Property (Article 40) ................................................................. 49</h3>
                <p className="text-lg underline decoration-red-200 underline-offset-4 decoration-2">Subject to Article 65, every person has the right, either individually or in association with others, to acquire and own property— (a) of any description; and (b) in any part of Kenya.</p>
              </section>

              <div className="h-40 border-t border-gray-100 mt-12 pt-8 text-sm text-gray-400">
                [This is a high-fidelity preview extracted via LlamaParse Agentic Ingestion]
              </div>
            </div>

            {/* Floating Selection Controls (Mock) */}
            <div className="absolute top-[40%] -left-12 flex flex-col gap-2 p-1 bg-white shadow-xl border border-gray-100 rounded-xl">
               <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors" title="Select Tool"><ChevronRight className="w-5 h-5 rotate-90" /></button>
               <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors" title="Pen"><Edit3 className="w-5 h-5" /></button>
               <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors" title="Eraser"><Eraser className="w-5 h-5" /></button>
            </div>
          </div>
        </div>

        {/* AI Assistant Sidebar */}
        <aside className="w-[450px] bg-white border-l border-gray-200 flex flex-col shrink-0 relative">
          {/* Navigation Controls */}
          <div className="flex border-b border-gray-100">
            <button 
              onClick={() => setActiveSidePanel('summary')}
              className={`flex-1 flex flex-col items-center justify-center p-4 transition-all relative ${activeSidePanel === 'summary' ? 'text-red-600' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              <FileText className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Summary</span>
              {activeSidePanel === 'summary' && <div className="absolute bottom-0 left-4 right-4 h-1 bg-red-600 rounded-t-full shadow-[0_-4px_10px_rgba(220,38,38,0.3)]" />}
            </button>
            <button 
              onClick={() => setActiveSidePanel('bookmarks')}
              className={`flex-1 flex flex-col items-center justify-center p-4 transition-all relative ${activeSidePanel === 'bookmarks' ? 'text-red-600' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              <List className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Outlines</span>
              {activeSidePanel === 'bookmarks' && <div className="absolute bottom-0 left-4 right-4 h-1 bg-red-600 rounded-t-full shadow-[0_-4px_10px_rgba(220,38,38,0.3)]" />}
            </button>
            <button 
              onClick={() => setActiveSidePanel('chat')}
              className={`flex-1 flex flex-col items-center justify-center p-4 transition-all relative ${activeSidePanel === 'chat' ? 'text-red-600' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              <Sparkles className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Assistant</span>
              {activeSidePanel === 'chat' && <div className="absolute bottom-0 left-4 right-4 h-1 bg-red-600 rounded-t-full shadow-[0_-4px_10px_rgba(220,38,38,0.3)]" />}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar">
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-8 pt-20"
                >
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                      <circle 
                        cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="8" fill="transparent" 
                        strokeDasharray="276.46" 
                        strokeDashoffset={276.46 * (1 - progress / 100)} 
                        className="text-red-600 transition-all duration-300 ease-out" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="w-10 h-10 text-red-600 animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Generative summary</h3>
                    <div className="flex items-center justify-center gap-2 mb-4">
                       <Shield className="w-4 h-4 text-emerald-500" />
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SECURE PROCESSING ENABLED</span>
                    </div>
                    
                    <div className="space-y-3 max-w-[280px] mx-auto">
                      <div className="flex items-center gap-3 text-left p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider uppercase">Ingesting PDF (LlamaParse)</span>
                      </div>
                      <div className={`flex items-center gap-3 text-left p-3 rounded-xl border transition-all ${progress > 60 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-gray-50 border-gray-100 text-gray-300'}`}>
                        {progress > 60 ? <CheckCircle2 className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                        <span className="text-xs font-bold uppercase tracking-wider">Detecting Legal Skills & Context</span>
                      </div>
                      <div className={`flex items-center gap-3 text-left p-3 rounded-xl border transition-all ${progress > 85 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-gray-50 border-gray-100 text-gray-300'}`}>
                        {progress > 85 ? <CheckCircle2 className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                        <span className="text-xs font-bold uppercase tracking-wider">Gemini 3.1 Pro Synthesis</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm max-w-xs pt-12">
                    Our AI is currently analyzing your document structure, extracting high-quality tables and reasoning through the legal nuances.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  {activeSidePanel === 'summary' && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <Wand2 className="w-5 h-5 text-red-600" />
                        <h2 className="text-xl font-bold tracking-tight">Generative summary</h2>
                        <div className="ml-auto flex gap-1">
                           <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" title="Gemini 3.1 Pro Active"></div>
                           <div className="w-2 h-2 rounded-full bg-red-400" title="High Logic Density"></div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <section className="p-5 bg-red-50/50 rounded-2xl border border-red-100">
                           <h3 className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                             <Zap className="w-3 h-3" /> Execute Summary
                           </h3>
                           <p className="text-sm font-bold text-gray-900 leading-relaxed mb-4">
                             This document is the Constitution of Kenya (2010), specifically focusing on the Bill of Rights.
                           </p>
                           <ul className="space-y-3">
                             <li className="flex gap-3">
                               <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                               <p className="text-xs font-medium text-gray-600">Established fundamental freedoms including Association, Assembly, and Political Rights.</p>
                             </li>
                             <li className="flex gap-3">
                               <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                               <p className="text-xs font-medium text-gray-600">Guarantees right to property and freedom of movement within and out of the country.</p>
                             </li>
                           </ul>
                        </section>

                        <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                           <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-emerald-500" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Skill Hub</span>
                              </div>
                              <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-full uppercase tracking-tighter">Verified Logic</div>
                           </div>
                           
                           <div className="space-y-3">
                              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                 <Globe className="w-4 h-4 text-blue-500" />
                                 <div className="flex flex-col">
                                    <span className="text-xs font-bold">Jurisdiction: {jurisdiction || 'Kenya'}</span>
                                    <span className="text-[9px] text-gray-400 font-medium">Applying Constitution of Kenya (2010)</span>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                 <FileText className="w-4 h-4 text-purple-500" />
                                 <div className="flex flex-col">
                                    <span className="text-xs font-bold">Nature: Supreme Legislation</span>
                                    <span className="text-[9px] text-gray-400 font-medium">High logic density detected</span>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm opacity-50">
                                 <Lock className="w-4 h-4 text-gray-400" />
                                 <div className="flex flex-col">
                                    <span className="text-xs font-bold">Privileged Context</span>
                                    <span className="text-[9px] text-gray-400 font-medium">Locked to professional tier</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-gray-100">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">Key Sections found</p>
                        <div className="grid grid-cols-1 gap-2">
                           <button className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-red-200 hover:bg-red-50/20 transition-all group">
                              <span className="text-xs font-bold truncate">Article 37: Right to Protest</span>
                              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-red-500" />
                           </button>
                           <button className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-red-200 hover:bg-red-50/20 transition-all group text-left">
                              <span className="text-xs font-bold truncate">Article 40: Ownership of Property</span>
                              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-red-500" />
                           </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSidePanel === 'bookmarks' && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <List className="w-5 h-5 text-red-600" />
                        <h2 className="text-xl font-bold tracking-tight">Bookmarks</h2>
                      </div>
                      
                      <div className="space-y-2">
                         <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest p-2">Part I: Transition Orders</div>
                         {[
                           "1. Background:",
                           "2. Legal Framework:",
                           "3. Constitutional Changes:"
                         ].map(item => (
                           <button key={item} className="w-full text-left p-3 hover:bg-gray-100 rounded-xl text-sm font-bold transition-all text-gray-600 hover:text-black">
                             {item}
                           </button>
                         ))}
                         
                         <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest p-2 mt-4">Part II: Fundamental Rights</div>
                         {[
                           "1. Right to Life (Article 26)",
                           "2. Equality and freedom from discrimination (Article 27)",
                           "3. Human Dignity (Article 28)",
                           "4. Privacy (Article 31)"
                         ].map(item => (
                           <button key={item} className={`w-full text-left p-3 rounded-xl text-sm font-bold transition-all ${item.includes('Equality') ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                             {item}
                           </button>
                         ))}
                      </div>
                    </div>
                  )}

                  {activeSidePanel === 'chat' && (
                    <div className="flex flex-col h-full space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Brain className="w-5 h-5 text-red-600" />
                          <h2 className="text-xl font-bold tracking-tight">Ask AI Assistant</h2>
                        </div>
                        <button className="text-xs font-bold text-gray-400 hover:text-black transition-colors">Add files</button>
                      </div>

                      <div className="flex-1 space-y-4 overflow-y-auto mb-20 custom-scrollbar pr-2 min-h-[400px]">
                        {messages.length === 0 ? (
                           <div className="space-y-4">
                             <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                               <div className="flex items-center gap-2 mb-2">
                                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">SECURE CONTEXT ENABLED</span>
                               </div>
                               <p className="text-sm font-bold text-blue-900 mb-4">Unlock full access to AI Assistant</p>
                               <button className="px-4 py-2 bg-black text-white text-[10px] font-black ring-1 ring-white/10 rounded-lg uppercase tracking-widest hover:bg-gray-800 transition-all">Subscribe now</button>
                             </div>
                             
                             <div className="text-center pt-8">
                                <Sparkles className="w-8 h-8 text-red-100 mx-auto mb-4" />
                                <h3 className="text-lg font-bold mb-2">Hi, how can I help you?</h3>
                                <div className="grid grid-cols-2 gap-3 mt-6">
                                   <button className="p-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all shadow-sm">Summarize the key points</button>
                                   <button className="p-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all shadow-sm">Identify risks in this doc</button>
                                </div>
                             </div>
                           </div>
                        ) : (
                          messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                                msg.role === 'user' 
                                  ? 'bg-black text-white rounded-tr-none' 
                                  : 'bg-gray-100 text-gray-900 rounded-tl-none border border-gray-200'
                              }`}>
                                <p>{msg.content}</p>
                                <span className="text-[9px] opacity-50 mt-2 block font-bold uppercase tracking-widest">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Chat Input */}
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="relative group">
                          <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                            placeholder="Ask a question about this document..."
                            className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-6 pr-14 text-sm font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-red-600/5 focus:border-red-600/30 transition-all min-h-[56px] shadow-lg resize-none"
                          />
                          <button 
                            onClick={handleSendMessage}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95 disabled:opacity-50"
                            disabled={!inputValue.trim()}
                          >
                            <Send className="w-5 h-5 shadow-inner" />
                          </button>
                        </div>
                        <p className="text-center text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-3">Be sure to double-check responses. <span className="underline cursor-pointer">Generative AI Guidelines</span></p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(220, 38, 38, 0.2);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default DocumentInsights;
