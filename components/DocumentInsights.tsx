import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Sparkles, MessageSquare, List, Bookmark, 
  ChevronRight, ChevronLeft, Search, Send, X, 
  Maximize2, Download, Share2, MoreHorizontal, 
  Brain, Zap, Shield, Wand2, ArrowLeft, Loader2,
  Lock, CheckCircle2, AlertCircle, Edit3, Eraser, Globe,
  Volume2, AudioWaveform, RotateCcw, Crown, History, Home,
  Scale, Clock, FileCheck, Layers, Eye, ZoomIn, ZoomOut, Radio, Copy
} from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { apiClient } from '../lib/apiClient';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Fixed worker for stability
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface ActionCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  prompt: string;
}

interface DocumentInsightsProps {
  setMetadata?: (metadata: { title: string; status: string; actions: any[] } | null) => void;
}

const DocumentInsights: React.FC<DocumentInsightsProps> = ({ setMetadata }) => {
  const navigate = useNavigate();
  const { fileId: pathFileId } = useParams<{ fileId: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fileId = pathFileId || queryParams.get('fileId') || '1';
  
  const [activeTab, setActiveTab] = useState<'chat' | 'summary' | 'outline' | 'analysis'>('chat');
  const [isProcessing, setIsProcessing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  
  // PDF State
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1.2);
  
  const [suggestedActions, setSuggestedActions] = useState<ActionCard[]>([
    { 
      id: 'full-sum', 
      title: 'Summarise Document entirely into understandable points', 
      icon: <FileText className="w-5 h-5 text-red-500" />, 
      prompt: 'Summarise this entire document into clear, understandable bullet points. Focus on key obligations, risks, and conclusions.' 
    },
    { id: 'stand', title: 'Identify what stands out most in this doc', icon: <Sparkles className="w-5 h-5 text-amber-500" />, prompt: 'What are the most unique or critical findings in this document?' },
    { id: 'themes', title: 'Analyze the main themes and patterns', icon: <Layers className="w-5 h-5 text-purple-500" />, prompt: 'Extract the central themes and reasoning logic' },
    { id: 'report', title: 'Create brief report of document takeaways', icon: <FileCheck className="w-5 h-5 text-emerald-500" />, prompt: 'Generate a structured takeaway report' }
  ]);

  useEffect(() => {
    const init = async () => {
      setIsProcessing(true);
      try {
        const urlRes = await apiClient.get(`/api/files/${fileId}/signed-url`);
        if (urlRes.ok) {
           const urlData = await urlRes.json();
           setPdfUrl(urlData.url);
        } else {
           setPdfUrl(`${apiClient.baseUrl}/api/files/${fileId}/view`);
        }
        
        // Push metadata to sidebar
        if (setMetadata) {
          setMetadata({
            title: 'Kenya_Judiciary_Internal_Memo.pdf',
            status: 'Analyzing Document...',
            actions: [
              { label: 'View', icon: <Eye className="w-4 h-4" />, onClick: () => console.log('View') },
              { label: 'Edit', icon: <Edit3 className="w-4 h-4" />, onClick: () => console.log('Edit') },
              { label: 'Convert', icon: <RotateCcw className="w-4 h-4" />, onClick: () => console.log('Convert') }
            ]
          });
        }

        setTimeout(() => setIsProcessing(false), 1000);
      } catch (e) {
        setIsProcessing(false);
      }
    };
    if (fileId) init();

    // Cleanup metadata on unmount
    return () => { if (setMetadata) setMetadata(null); };
  }, [fileId, setMetadata]);

  const handleActionClick = (action: ActionCard) => {
    setInputValue(action.prompt);
  };

  return (
    <div className="flex flex-col h-full bg-[#F1F3F5] text-slate-900 overflow-hidden font-sans">
      {/* Primary Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* PDF Viewer - Left Side (Full Seamless) */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
           {/* Document controls floating - Minimal */}
           <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex items-center bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl px-4 py-2 shadow-sm gap-6">
              <div className="flex items-center gap-2 border-r border-slate-100 pr-4">
                 <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} className="p-1 hover:bg-slate-50 rounded-lg transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                 <span className="text-[11px] font-black tabular-nums">{currentPage} / {numPages || '--'}</span>
                 <button onClick={() => setCurrentPage(p => Math.min(numPages || p, p+1))} className="p-1 hover:bg-slate-50 rounded-lg transition-colors"><ChevronRight className="w-4 h-4" /></button>
              </div>
              <div className="flex items-center gap-4">
                 <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1 hover:bg-slate-50 rounded-lg transition-colors"><ZoomOut className="w-4 h-4 text-slate-500" /></button>
                 <span className="text-[11px] font-black text-slate-500">{Math.round(zoom * 100)}%</span>
                 <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-1 hover:bg-slate-50 rounded-lg transition-colors"><ZoomIn className="w-4 h-4 text-slate-500" /></button>
              </div>
           </div>

           {/* PDF Content Area - NO CARD WRAPPER */}
           <div className="flex-1 overflow-y-auto p-0 flex justify-center custom-scrollbar bg-[#F1F3F5]">
              <div className="transform transition-transform duration-300">
                {pdfUrl ? (
                  <Document
                    file={pdfUrl}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    loading={<div className="p-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-200" /></div>}
                  >
                    <Page 
                      pageNumber={currentPage} 
                      scale={zoom} 
                      className="shadow-none border-none" 
                    />
                  </Document>
                ) : (
                  <div className="flex items-center justify-center p-20 min-h-screen">
                     <div className="text-center space-y-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                           <FileText className="w-6 h-6 text-slate-200" />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Initialising PDF...</p>
                     </div>
                  </div>
                )}
              </div>
           </div>
        </main>

        {/* Intelligence Sidebar - Right Side */}
        <aside className="w-[480px] bg-white border-l border-slate-200 flex flex-col shrink-0">
           {/* Tab Header - REDESIGNED AS VERTICALLY THIN TOGGLE BUTTONS */}
           <div className="pt-8 pb-4">
              <div className="bg-slate-100/80 rounded-xl p-1 mx-8 flex items-center h-9 relative z-20">
                {[
                  { id: 'chat', label: 'Ask Assistant' },
                  { id: 'summary', label: 'Summary' },
                  { id: 'analysis', label: 'Legal Analysis' },
                  { id: 'history', label: 'My History' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 text-[10px] font-black uppercase tracking-tight h-full rounded-lg transition-all relative z-10 ${
                      activeTab === tab.id 
                        ? 'text-white bg-red-600 shadow-lg shadow-red-500/20' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
           </div>

           <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
              <AnimatePresence mode="wait">
                 {activeTab === 'chat' && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     className="flex-1 flex flex-col p-8 mb-24"
                   >
                     <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-black/10">
                              <Brain className="w-6 h-6 text-white" />
                           </div>
                           <div>
                              <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase">Analyse with AI</h2>
                              <div className="flex items-center gap-1.5">
                                 <Shield className="w-3 h-3 text-red-500" />
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Context Protection</span>
                              </div>
                           </div>
                        </div>
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-900 rounded-lg text-xs font-bold hover:bg-slate-100 transition-all border border-slate-200/50">
                           <PlusIcon /> <span className="text-[10px] uppercase font-black">Add context</span>
                        </button>
                     </div>

                     {/* Action Grid - 2x2 Clean Cards */}
                     <div className="grid grid-cols-2 gap-4 mt-8">
                        {suggestedActions.map((action) => (
                          <button
                            key={action.id}
                            onClick={() => handleActionClick(action)}
                            className="p-5 text-left bg-white border border-slate-100 rounded-[24px] shadow-sm hover:border-slate-300 hover:shadow-md transition-all group relative overflow-hidden"
                          >
                             <div className="mb-4 bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                                {action.icon}
                             </div>
                             <p className="text-sm font-black text-slate-600 leading-snug group-hover:text-slate-900 transition-colors tracking-tight">
                                {action.title}
                             </p>
                          </button>
                        ))}
                     </div>
                   </motion.div>
                 )}

                 {activeTab === 'summary' && (
                   <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8 space-y-4"
                   >
                      <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-2xl p-6 flex items-start gap-4">
                        <Clock className="w-5 h-5 text-[#4338CA] shrink-0 mt-0.5" />
                        <p className="text-[#3730A3] text-sm font-bold leading-relaxed tracking-tight">
                          Files larger than 100 pages or complex tables and figures may take a few minutes to process.
                        </p>
                      </div>

                      <div className="bg-[#F5F7FF] border border-[#E0E7FF] rounded-[24px] p-12 flex flex-col items-center justify-center gap-6 shadow-sm">
                        <div className="relative">
                          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                            <FileText className="w-8 h-8 text-[#6366F1]" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#6366F1] rounded-full flex items-center justify-center">
                             <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-[#4338CA]">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="text-sm font-black uppercase tracking-[0.2em]">Creating an overview...</span>
                        </div>
                      </div>
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>

           {/* Input Section - Fixed at bottom */}
           <div className="p-6 bg-white border-t border-slate-100 shrink-0">
              <div className="relative group">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Query document intelligence..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-[24px] p-5 pr-14 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 focus:border-slate-400 transition-all min-h-[100px] resize-none shadow-inner"
                />
                <button 
                  className="absolute right-3 bottom-3 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-black transition-all shadow-lg shadow-black/10 active:scale-95 disabled:opacity-30 group"
                  disabled={!inputValue.trim()}
                >
                  <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
           </div>
        </aside>

        {/* Slim Utility Bar - Far Right */}
        <aside className="w-14 bg-white border-l border-slate-200 flex flex-col items-center py-6 gap-6 shrink-0">
           <button title="Session History" className="p-3 text-slate-300 hover:text-slate-900 transition-colors rounded-xl hover:bg-slate-50"><History className="w-5 h-5" /></button>
           <button title="Bookmarks" className="p-3 text-slate-300 hover:text-slate-900 transition-colors rounded-xl hover:bg-slate-50"><Bookmark className="w-5 h-5" /></button>
           <button title="Copy Text" className="p-3 text-slate-300 hover:text-slate-900 transition-colors rounded-xl hover:bg-slate-50"><Copy className="w-5 h-5" /></button>
           <div className="flex-1" />
           <div className="flex items-center justify-center h-14 w-full">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-[11px] font-black text-slate-500">2</div>
           </div>
           <button className="p-3 text-slate-300 hover:text-slate-900 transition-colors"><RotateCcw className="w-5 h-5" /></button>
           <button className="p-3 text-slate-300 hover:text-slate-900 transition-colors"><Search className="w-5 h-5" /></button>
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
          background: rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 2V10M2 6H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default DocumentInsights;
