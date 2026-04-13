import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Home, 
  MessageSquare, 
  ExternalLink, 
  BookOpen, 
  Globe, 
  ShieldAlert, 
  ShieldCheck,
  Scale,
  ChevronRight,
  HandMetal,
  Send,
  Loader2,
  Paperclip,
  ChevronDown,
  Bug,
  CreditCard,
  User,
  ShieldCheck as ShieldCheckIcon
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SupportSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  initialCategory?: string;
  initialTab?: 'home' | 'messages';
}

const SupportSidebar: React.FC<SupportSidebarProps> = ({ 
  isOpen, 
  onClose, 
  userName,
  initialCategory = 'General',
  initialTab = 'home'
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'messages'>(initialTab);
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState(initialCategory);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setCategory(initialCategory);
    }
  }, [isOpen, initialCategory, initialTab]);
  const [requestType, setRequestType] = useState<'issue' | 'feedback'>('issue');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`;
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `support/${fileName}`;

      const { data, error } = await supabase.storage
        .from('support-attachments')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('support-attachments')
        .getPublicUrl(filePath);

      setAttachmentUrl(publicUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload attachment. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenVulnerability = () => {
    setCategory('Security');
    setRequestType('issue');
    setActiveTab('messages');
  };

  const resources = [
    { title: 'Visit our Help Center', icon: BookOpen, emoji: '📚', color: 'text-blue-500', href: 'https://help.lawlify.ai' },
    { title: 'Join our Community!', icon: Globe, emoji: '🌍', color: 'text-green-500', href: 'https://community.lawlify.ai' },
    { title: 'Reporting a Vulnerability', icon: ShieldAlert, emoji: '🛡️', color: 'text-red-500', href: '/security/reporting' },
    { title: 'Lawlify UI Trust Center', icon: ShieldCheck, emoji: '🏛️', color: 'text-primary', href: '/security/trust-center' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-screen w-[400px] bg-white shadow-2xl z-[101] flex flex-col font-sans"
          >
            {/* Header / Gradient Area */}
            <div className="relative h-64 bg-gradient-to-br from-primary/10 via-white to-blue-50/30 p-8 flex flex-col justify-end overflow-hidden">
              {/* Background Accents */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -ml-24 -mb-24" />
              
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-black" />
              </button>

              <div className="space-y-2 relative">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-xs ring-8 ring-primary/5 shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                    <Scale className="w-7 h-7" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-black uppercase tracking-[0.3em] font-display">Lawlify AI</span>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest opacity-60">Intelligence Sovereign</span>
                  </div>
                </div>
                
                <h1 className="text-4xl font-bold text-black flex items-center gap-3">
                  Hi {userName} <HandMetal className="w-8 h-8 text-yellow-400 animate-bounce" />
                </h1>
                <p className="text-4xl font-bold text-black opacity-30">How can we help?</p>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence mode="wait">
                {activeTab === 'home' ? (
                  <motion.div
                    key="home"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    className="space-y-3"
                  >
                    {resources.map((res, i) => (
                      <motion.a
                        key={res.title}
                        href={res.href}
                        target={res.href.startsWith('http') ? '_blank' : '_self'}
                        rel={res.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={(e) => {
                          if (res.title === 'Reporting a Vulnerability') {
                            e.preventDefault();
                            handleOpenVulnerability();
                          }
                        }}
                        className="group flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-xl">{res.emoji}</span>
                          <span className="font-semibold text-black/50 tracking-tight">{res.title}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-black/40 group-hover:text-primary transition-colors" />
                      </motion.a>
                    ))}

                    <div className="mt-8 pt-8 border-t border-gray-50">
                      <p className="text-[10px] font-black text-black/40 uppercase tracking-widest text-center mb-6">Recent Conversations</p>
                      <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 text-center space-y-3">
                        <MessageSquare className="w-8 h-8 text-black/20 mx-auto" />
                        <p className="text-sm text-black font-medium">No active support tickets.</p>
                        <button 
                          onClick={() => setActiveTab('messages')}
                          className="text-xs font-bold text-primary hover:underline"
                        >
                          Start a new message
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="messages"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full flex flex-col pt-4"
                  >
                    {!isSuccess ? (
                      <div className="space-y-6">
                        {/* Intent Toggles */}
                        <div className="bg-slate-50 p-1.5 rounded-2xl flex items-center gap-1.5 border border-slate-100">
                           <button 
                             onClick={() => setRequestType('issue')}
                             className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${requestType === 'issue' ? 'bg-white text-black shadow-sm ring-1 ring-black/5' : 'text-black/40 hover:text-slate-600'}`}
                           >
                              Report an issue
                           </button>
                           <button 
                             onClick={() => setRequestType('feedback')}
                             className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${requestType === 'feedback' ? 'bg-white text-black shadow-sm ring-1 ring-black/5' : 'text-black/40 hover:text-slate-600'}`}
                           >
                              Share feedback
                           </button>
                        </div>

                        <div className="space-y-5">
                          {/* AI-Powered Message Area */}
                          <div className="relative group">
                            <textarea
                              ref={textareaRef}
                              value={message}
                              onChange={(e) => {
                                setMessage(e.target.value);
                                adjustHeight();
                              }}
                              placeholder={requestType === 'issue' ? "Describe the issue... Our AI will classify and route this automatically." : "Share your thoughts with our team..."}
                              className="w-full min-h-[120px] max-h-[300px] bg-white border-2 border-black rounded-[2rem] p-8 text-sm focus:outline-none focus:border-primary transition-all resize-none font-bold placeholder:text-black/20 leading-relaxed shadow-sm scrollbar-hide"
                            />
                            
                            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                                <input 
                                  type="file" 
                                  ref={fileInputRef} 
                                  onChange={handleFileUpload} 
                                  className="hidden" 
                                />
                                <button 
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  disabled={isUploading}
                                  className={`p-3 bg-white border-2 border-black rounded-xl transition-all pointer-events-auto active:scale-95 shadow-sm group ${attachmentUrl ? 'bg-red-50 border-primary text-primary' : 'text-black hover:bg-black hover:text-white'}`}
                                >
                                   {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
                                   {attachmentUrl && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-pulse" />}
                                </button>

                               <button
                                onClick={async () => {
                                  if (!message) return;
                                  setIsSubmitting(true);
                                  try {
                                    const { data: { user } } = await supabase.auth.getUser();
                                    const { error } = await supabase.from('support_messages').insert({
                                      user_id: user?.id,
                                      user_email: user?.email || '',
                                      user_name: userName,
                                      message: message,
                                      category: category,
                                      request_type: requestType,
                                      attachment_url: attachmentUrl,
                                      is_ai_classified: false
                                    });
                                    if (error) throw error;
                                    setIsSuccess(true);
                                    setMessage('');
                                  } catch (err) {
                                    console.error('Error sending message:', err);
                                  } finally {
                                    setIsSubmitting(false);
                                  }
                                }}
                                disabled={!message || isSubmitting}
                                className="px-8 py-4 bg-black text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-black/10 hover:shadow-primary/30 hover:bg-primary transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3 pointer-events-auto"
                              >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                  <>
                                    <Send className="w-4 h-4" />
                                    <span>Send</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                          <p className="px-4 text-[9px] font-bold text-black opacity-40 uppercase tracking-widest text-center">
                             Categorization & Priority will be assigned automatically by Lawlify AI
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                          <ShieldCheck className="w-10 h-10 text-green-500" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-black">Message Sent!</h3>
                          <p className="text-sm text-black font-bold mt-2 max-w-[250px]">Thank you for reaching out. Our team has been notified and will respond via email shortly.</p>
                        </div>
                        <button 
                          onClick={() => {
                            setIsSuccess(false);
                            setActiveTab('home');
                          }}
                          className="text-primary font-bold hover:underline"
                        >
                          Return to Home
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Nav */}
            <div className="p-4 border-t border-gray-50 flex items-center justify-around bg-white/80 backdrop-blur-md">
              <button 
                onClick={() => setActiveTab('home')}
                className={`flex flex-col items-center gap-1 group transition-colors ${activeTab === 'home' ? 'text-primary' : 'text-black/40 hover:text-black'}`}
              >
                <div className={`p-2 rounded-xl transition-colors ${activeTab === 'home' ? 'bg-primary/10' : 'bg-transparent group-hover:bg-red-50'}`}>
                  <Home className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('messages')}
                className={`flex flex-col items-center gap-1 group transition-colors ${activeTab === 'messages' ? 'text-primary' : 'text-black/40 hover:text-black'}`}
              >
                <div className={`p-2 rounded-xl transition-colors ${activeTab === 'messages' ? 'bg-primary/10' : 'bg-transparent group-hover:bg-red-50'}`}>
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter">Messages</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SupportSidebar;
