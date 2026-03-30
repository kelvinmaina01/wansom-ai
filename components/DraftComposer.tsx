import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowLeft, 
  Send, 
  Save, 
  Download,
  Loader2,
  FileText,
  Copy,
  CheckCircle2,
  Bot
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/apiClient';

const DraftComposer: React.FC = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftContent, setDraftContent] = useState('');
  const [draftTitle, setDraftTitle] = useState('Untitled AI Draft');
  const [isSaved, setIsSaved] = useState(false);
  const [messages, setMessages] = useState<any[]>([{
    role: 'ai',
    content: 'Hello! I am the Lawlify AI Composer. What kind of legal document would you like me to draft for you today?'
  }]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    const userMsg = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMsg]);
    setPrompt('');
    
    try {
      const res = await apiClient.post('/api/drafts/generate', {
        prompt: userMsg.content,
        title: draftTitle
      });
      
      if (res.ok) {
        const data = await res.json();
        setDraftContent(data.content);
        setDraftTitle(data.title);
        setMessages(prev => [...prev, {
          role: 'ai',
          content: "I have generated the draft based on your instructions. You can review it on the right. Let me know if you need any adjustments!"
        }]);
        setIsSaved(true);
      } else {
        throw new Error('Generation failed');
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: "I'm sorry, I encountered an error while generating your draft. Please try again."
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#fdfdfd] overflow-hidden fixed inset-0 z-50">
      {/* Sidebar / Chat Interface */}
      <div className="w-[450px] bg-white border-r border-gray-100 flex flex-col shadow-xl shadow-black/5 shrink-0 z-10 relative">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center gap-4 shrink-0">
          <button 
            onClick={() => navigate('/app/drafts')}
            className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
             <h2 className="text-sm font-black text-black uppercase tracking-widest flex items-center gap-2">
               AI Composer <Sparkles className="w-4 h-4 text-red-500" />
             </h2>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Lawlify Generative Engine</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
           {messages.map((msg, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
             >
               <div className={`max-w-[85%] p-4 rounded-[20px] text-[13px] font-medium leading-relaxed shadow-sm ${
                 msg.role === 'user' 
                 ? 'bg-red-600 text-white rounded-tr-sm' 
                 : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-md shadow-gray-200/50'
               }`}>
                 {msg.role === 'ai' && idx === 0 && (
                   <div className="flex items-center gap-2 mb-2 text-red-500 pb-2 border-b border-gray-50">
                     <Bot className="w-4 h-4" /> <span className="text-[10px] font-black uppercase tracking-widest">Assistant</span>
                   </div>
                 )}
                 {msg.content}
               </div>
             </motion.div>
           ))}

           {isGenerating && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex justify-start"
             >
               <div className="bg-white border border-gray-100 p-4 rounded-[20px] rounded-tl-sm flex items-center gap-3 shadow-sm">
                 <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                 <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Drafting Document...</span>
               </div>
             </motion.div>
           )}
        </div>

        <div className="p-6 bg-white border-t border-gray-50 shrink-0">
          <div className="relative group shadow-sm rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 focus-within:border-red-500/50 focus-within:bg-white transition-all">
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
              placeholder="E.g., Draft a comprehensive Notice to Vacate for commercial property..."
              className="w-full bg-transparent border-none p-5 pr-14 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:ring-0 min-h-[120px] resize-none"
            />
            <button 
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="absolute right-3 bottom-3 w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center hover:bg-gray-800 transition-all shadow-lg active:scale-95 disabled:opacity-30 group-focus-within:bg-red-600 group-focus-within:shadow-red-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Editor / Canvas Area */}
      <div className="flex-1 bg-[#F8F9FA] flex flex-col relative">
        <div className="h-20 border-b border-gray-200 bg-white/50 backdrop-blur-sm flex items-center justify-between px-8 shrink-0 z-10 sticky top-0">
          <input 
            type="text"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            className="text-2xl font-bold text-gray-900 bg-transparent border-none focus:ring-0 focus:outline-none placeholder-gray-300 w-1/2"
            placeholder="Document Title"
          />
          
          <div className="flex items-center gap-3">
             {isSaved && (
               <span className="text-[10px] font-black text-emerald-500 flex items-center gap-1.5 uppercase tracking-widest mr-4">
                 <CheckCircle2 className="w-4 h-4" />
                 Saved to Drafts
               </span>
             )}
             <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all shadow-sm">
                <Copy className="w-4 h-4" /> Copy
             </button>
             <button className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
                <Download className="w-4 h-4" /> Export Document
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-12 flex justify-center custom-scrollbar pb-32">
          {draftContent ? (
             <div className="w-full max-w-[850px] bg-white shadow-2xl shadow-black/5 border border-gray-200 min-h-[1100px] p-16 relative group">
                <textarea 
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  className="w-full h-full min-h-[1000px] bg-transparent border-none resize-none focus:ring-0 text-[15px] text-gray-800 leading-[1.8] font-serif focus:outline-none"
                />
             </div>
          ) : (
             <div className="w-full max-w-[850px] bg-white/50 border-2 border-dashed border-gray-200 rounded-3xl min-h-[600px] flex flex-col items-center justify-center text-center p-12">
                <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center mb-6">
                  <FileText className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-400 mb-2">Editor Canvas</h3>
                <p className="text-sm text-gray-400 max-w-sm">
                  Describe what you want to create in the sidebar, and the generated document will appear here.
                </p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DraftComposer;
