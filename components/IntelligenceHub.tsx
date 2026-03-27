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
  Zap
} from 'lucide-react';
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
  
  // Audio Sync Ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPdfUrl(`${apiClient.baseUrl}/api/files/${fileId}/view`);
        
        const res = await apiClient.get(`/api/intelligence/analyze/${fileId}`);
        if (res.ok) {
          const data = await res.json();
          setSegments(data.segments);
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
    }, 50);

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

  return (
    <div className="flex h-full bg-white overflow-hidden animate-in fade-in duration-700">
      {/* 🏛️ Left Panel: High-Fidelity PDF Viewer Shell */}
      <div className="flex-1 flex flex-col border-r border-gray-100 relative bg-[#F8F9FA]">
        {/* Viewer Header */}
        <div className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6 z-10 shadow-sm/50">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <h2 className="text-sm font-bold text-gray-900 truncate max-w-[300px]">
                {fileId ? `Analyzing Document ${fileId.slice(0, 8)}...` : 'Analyzing Legal Document...'}
              </h2>
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
                <ShieldCheck className="w-3 h-3 text-green-500" />
                <span>Encrypted Hub</span>
                <span className="text-gray-200">|</span>
                <span>Page {currentPage} of {numPages || '?'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-gray-100 p-1 rounded-lg flex items-center gap-1 mr-4">
              <button className="p-1.5 hover:bg-white rounded-md transition-all shadow-none hover:shadow-sm text-gray-600">
                <RotateCcw className="w-4 h-4" />
              </button>
              <button 
                className="p-1.5 hover:bg-white rounded-md transition-all shadow-none hover:shadow-sm text-gray-600"
                onClick={() => setCurrentPage(prev => Math.min(numPages || prev, prev + 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-1 scale-90 origin-right">
              <button className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-all shadow-md shadow-black/10 flex items-center gap-2">
                <Plus className="w-3.5 h-3.5" />
                Add Context
              </button>
            </div>
          </div>
        </div>

        {/* The PDF Viewport (S.A.V.R.E. Target) */}
        <div className="flex-1 overflow-auto p-12 flex justify-center bg-gray-50/50 relative">
          <div className="w-full max-w-4xl bg-white shadow-2xl shadow-gray-200 rounded-sm relative overflow-hidden group min-h-[1100px]">
            {isProcessing && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20 flex-col gap-4">
                 <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-progress-strip"></div>
                 </div>
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Syncing S.A.V.R.E. Engine</span>
              </div>
            )}
            
            {pdfUrl && (
              <Document
                file={pdfUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading={<div className="p-12 text-center text-gray-400">Loading Document Intelligence...</div>}
              >
                <Page 
                  pageNumber={currentPage} 
                  scale={1.5}
                  renderAnnotationLayer={true}
                  renderTextLayer={true}
                  className="mx-auto"
                />
              </Document>
            )}

            {/* S.A.V.R.E. Highlight Overlay (Absolute positioned relative to viewport) */}
            {activeSegmentId && segments.find(s => s.id === activeSegmentId)?.location && (
              <div 
                className="absolute bg-primary/10 border-l-4 border-primary backdrop-blur-[1px] pointer-events-none transition-all duration-300"
                style={{
                  top: segments.find(s => s.id === activeSegmentId)!.location!.rect[1] * 1.5, // Scale multiplier
                  left: 0,
                  right: 0,
                  height: segments.find(s => s.id === activeSegmentId)!.location!.rect[3] * 1.5 + 40
                }}
              >
                <div className="flex items-start gap-4 p-4">
                    <div className="mt-1 p-1 bg-primary/20 rounded-md">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🧠 Right Panel: Intelligence Sidecar */}
      <div className="w-[420px] h-full flex flex-col bg-white overflow-hidden relative border-l border-gray-100 shadow-2xl">
        {/* Sidebar Gutter Tabs */}
        <div className="absolute left-0 top-0 bottom-0 w-12 border-r border-gray-50 bg-[#FAFBFC] flex flex-col items-center py-6 gap-6 z-20">
          <button 
            onClick={() => setActiveTab('ai')}
            className={`p-2 transition-all rounded-lg ${activeTab === 'ai' ? 'bg-white shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <BrainCircuit className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTab('pages')}
            className={`p-2 transition-all rounded-lg ${activeTab === 'pages' ? 'bg-white shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <FileText className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTab('bookmarks')}
            className={`p-2 transition-all rounded-lg ${activeTab === 'bookmarks' ? 'bg-white shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Orbit className="w-5 h-5" />
          </button>
          <div className="mt-auto pb-4">
             <button className="p-2 text-gray-300 hover:text-primary transition-colors">
                <Search className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Sidebar Content Area */}
        <div className="flex-1 ml-12 flex flex-col overflow-hidden bg-white">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              Lawlify Intelligence
              <span className="px-2 py-0.5 bg-primary/5 text-primary text-[8px] uppercase tracking-widest rounded-full border border-primary/10">Beta</span>
            </h3>
            <button className="p-1 hover:bg-gray-100 rounded-md text-gray-400">
               <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Upsell Banner (Adobe Style) */}
            <div className="p-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <Zap className="w-12 h-12" />
               </div>
               <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Gemini Pro 2.5 Active</p>
               <p className="text-sm font-medium mb-3">Unlock unlimited S.A.V.R.E. analysis for your firm.</p>
               <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-xs font-bold transition-all">
                  Manage Seat
               </button>
            </div>

            {/* Insights List (The Live Briefing Feed) */}
            <div className="space-y-4">
               <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Live Briefing Feed</h4>
               {segments.map((seg) => (
                 <div 
                   key={seg.id}
                   className={`p-4 rounded-2xl border transition-all duration-500 cursor-pointer ${
                     activeSegmentId === seg.id 
                       ? 'bg-primary/5 border-primary/20 shadow-lg shadow-primary/5 translate-x-1' 
                       : 'bg-white border-gray-100 hover:border-gray-200'
                   }`}
                   onClick={() => {
                     if (seg.location) setCurrentPage(seg.location.page);
                     setActiveSegmentId(seg.id);
                   }}
                 >
                   <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tighter ${
                        seg.category === 'RISK' ? 'bg-red-100 text-red-600' : 
                        seg.category === 'COMMITMENT' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {seg.category}
                      </span>
                      {activeSegmentId === seg.id && (
                        <div className="flex gap-0.5">
                          <div className="w-0.5 h-2 bg-primary animate-pulse"></div>
                          <div className="w-0.5 h-3 bg-primary animate-pulse delay-75"></div>
                          <div className="w-0.5 h-1.5 bg-primary animate-pulse delay-150"></div>
                        </div>
                      )}
                   </div>
                   <p className="text-xs font-bold text-gray-900 mb-1 leading-tight">{seg.insight}</p>
                   <p className="text-[11px] text-gray-500 line-clamp-2 italic leading-relaxed">"{seg.proof}"</p>
                 </div>
               ))}
               
               {segments.length === 0 && !isProcessing && (
                 <div className="py-12 text-center">
                    <BrainCircuit className="w-8 h-8 text-gray-100 mx-auto mb-3" />
                    <p className="text-xs text-gray-400 font-medium">No insights detected yet</p>
                 </div>
               )}
            </div>

            {/* Quick Intent Grid (Context Matched Icons) */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              {[
                { label: 'Summarize', icon: ScrollText, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: 'Risks', icon: Scale, color: 'text-red-500', bg: 'bg-red-50' },
                { label: 'Precedent', icon: Orbit, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                { label: 'Briefing', icon: AudioWaveform, color: 'text-purple-500', bg: 'bg-purple-50' }
              ].map((item, i) => (
                <button 
                  key={i}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all group"
                >
                  <div className={`p-3 ${item.bg} ${item.color} rounded-xl mb-3 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-600">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Persistent Footer: S.A.V.R.E. Controls & Status */}
          <div className="p-6 bg-white border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isAudioMode ? 'bg-primary/20 animate-pulse' : 'bg-primary/10'}`}>
                    <Volume2 className={`w-5 h-5 ${isAudioMode ? 'text-primary' : 'text-primary/60'}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">S.A.V.R.E. Mode</span>
                    <span className="text-xs font-bold text-gray-700">{isAudioMode ? 'Speaking & Syncing...' : 'Auto-Sync Standby'}</span>
                  </div>
               </div>
               <button 
                 onClick={toggleAudio}
                 className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                   isAudioMode ? 'bg-primary text-white scale-110' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                 }`}
               >
                 {isAudioMode ? <AudioWaveform className="w-6 h-6 animate-pulse" /> : <Sparkles className="w-5 h-5" />}
               </button>
            </div>
            
            <div className="text-[9px] text-gray-400 text-center leading-relaxed font-medium">
               Real-time analysis is driven by <span className="text-primary font-bold">Gemini 2.0 Flash</span>. <br/>
               Always verify critical legal findings. <span className="text-gray-300">|</span> <a href="#" className="underline">Guidelines</a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress-strip {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
        .animate-progress-strip {
          animation: progress-strip 1.5s infinite linear;
        }
        @keyframes pulse-slow {
           0%, 100% { opacity: 0.8; }
           50% { opacity: 1; }
        }
        .animate-pulse-slow {
           animation: pulse-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default IntelligenceHub;
