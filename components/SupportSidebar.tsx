import React, { useState } from 'react';
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
  Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SupportSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

const SupportSidebar: React.FC<SupportSidebarProps> = ({ isOpen, onClose, userName }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'messages'>('home');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const resources = [
    { title: 'Visit our Help Center', icon: BookOpen, emoji: '📚', color: 'text-blue-500' },
    { title: 'Join our Community!', icon: Globe, emoji: '🌍', color: 'text-green-500' },
    { title: 'Reporting a Vulnerability', icon: ShieldAlert, emoji: '🛡️', color: 'text-red-500' },
    { title: 'Lawlify UI Trust Center', icon: ShieldCheck, emoji: '🏛️', color: 'text-primary' },
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
                <X className="w-5 h-5 text-gray-400" />
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
                <p className="text-4xl font-bold text-gray-400">How can we help?</p>
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
                        href="#"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-xl">{res.emoji}</span>
                          <span className="font-semibold text-gray-700 tracking-tight">{res.title}</span>
                        </div>
                        <ExternalLink className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                      </motion.a>
                    ))}

                    <div className="mt-8 pt-8 border-t border-gray-50">
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest text-center mb-6">Recent Conversations</p>
                      <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 text-center space-y-3">
                        <MessageSquare className="w-8 h-8 text-gray-200 mx-auto" />
                        <p className="text-sm text-gray-400 font-medium">No active support tickets.</p>
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
                        <div className="text-center space-y-2">
                          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-6 h-6 text-primary" />
                          </div>
                          <h3 className="text-xl font-bold text-black">New Message</h3>
                          <p className="text-sm text-gray-500">Send us a message and we'll get back to you as soon as possible.</p>
                        </div>

                        <div className="space-y-4">
                          <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="How can we help you today?"
                            className="w-full h-40 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all resize-none"
                          />
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
                                });
                                if (error) throw error;
                                setIsSuccess(true);
                                setMessage('');
                              } catch (err) {
                                console.error('Error sending message:', err);
                                alert('Failed to send message.');
                              } finally {
                                setIsSubmitting(false);
                              }
                            }}
                            disabled={!message || isSubmitting}
                            className="w-full bg-black text-white py-4 rounded-xl font-bold shadow-xl shadow-black/10 hover:shadow-black/20 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            Send Response
                          </button>
                          <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Response time: usually under 2 hours
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                          <ShieldCheck className="w-10 h-10 text-green-500" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-black">Message Sent!</h3>
                          <p className="text-sm text-gray-500 mt-2 max-w-[250px]">Thank you for reaching out. Our team has been notified and will respond via email shortly.</p>
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
                className={`flex flex-col items-center gap-1 group transition-colors ${activeTab === 'home' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <div className={`p-2 rounded-xl transition-colors ${activeTab === 'home' ? 'bg-primary/10' : 'bg-transparent group-hover:bg-gray-50'}`}>
                  <Home className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('messages')}
                className={`flex flex-col items-center gap-1 group transition-colors ${activeTab === 'messages' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <div className={`p-2 rounded-xl transition-colors ${activeTab === 'messages' ? 'bg-primary/10' : 'bg-transparent group-hover:bg-gray-50'}`}>
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
