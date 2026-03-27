import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageSquare,
  Send,
  X,
  Briefcase,
  GraduationCap,
  Gavel,
  ChevronRight,
  BookOpen,
  Shield,
  Swords,
  Target,
  Lightbulb,
  ArrowRight,
  Sparkles,
  Clock,
  Star,
  Play,
  Check
} from 'lucide-react';
import { apiClient } from '../lib/apiClient';
import { supabase } from '../lib/supabase';

// --- Types ---
interface AgenticMentorshipProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

interface MentorMode {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  greeting: string;
}

interface ChatMessage {
  id: string;
  sender: 'amani' | 'user';
  text: string;
  timestamp: Date;
}

interface Evaluation {
  score: number;
  strengths: string[];
  areasForImprovement: string[];
  overallFeedback: string;
}

interface Session {
  id: string;
  mode: string;
  topic: string;
  duration: string;
  date: string;
  created_at?: string;
}

// --- Constants ---
const MENTOR_MODES: MentorMode[] = [
  {
    id: 'senior-partner',
    label: 'Senior Partner',
    description: 'Career advice, ethics, and client management',
    icon: Briefcase,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    greeting: "Good to see you, counsel. I'm here as your senior partner. Whether it's a difficult client situation, an ethical dilemma, or career guidance — let's work through it together. What's on your mind?"
  },
  {
    id: 'socratic-tutor',
    label: 'Socratic Tutor',
    description: 'Guided learning through questions & reasoning',
    icon: GraduationCap,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    greeting: "Welcome to our study session. I won't just give you answers — I'll guide you to discover them yourself. Let's sharpen your legal reasoning. What area of African law would you like to explore?"
  },
  {
    id: 'mock-judge',
    label: 'Mock Judge',
    description: 'Practice oral submissions & cross-examination',
    icon: Gavel,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    greeting: "Court is in session. I'll be acting as the presiding judge. You may present your opening statement, practice cross-examination, or make oral submissions. I'll evaluate your arguments, point out weaknesses, and challenge your citations. Counsel, you may proceed."
  }
];

const MOCK_SESSIONS: Session[] = [
  { id: 's1', mode: 'Mock Judge', topic: 'Cross-examination drill on witness credibility', duration: '24 min', date: 'Today' },
  { id: 's2', mode: 'Senior Partner', topic: 'Handling conflicting client instructions', duration: '18 min', date: 'Yesterday' },
  { id: 's3', mode: 'Socratic Tutor', topic: 'Article 50 - Right to fair hearing', duration: '32 min', date: '2 days ago' },
];

const CROSS_EXAM_SCENARIOS = [
  { title: 'Hostile Witness — Police Officer', difficulty: 'Advanced', description: 'Practice controlling a witness who is evasive about evidence handling procedures.', icon: Shield },
  { title: 'Expert Witness — Medical Report', difficulty: 'Intermediate', description: 'Challenge an expert medical witness on the validity of their forensic findings.', icon: Target },
  { title: 'Impeachment Drill — Prior Statement', difficulty: 'Beginner', description: 'Practice the Commit-Credit-Confront technique to impeach a witness with a prior inconsistent statement.', icon: Swords },
  { title: 'Logical Trap — Building Admissions', difficulty: 'Advanced', description: 'Set up a series of leading questions that force the witness into a corner on key facts.', icon: Lightbulb },
];

const MOCK_RESPONSES: Record<string, string[]> = {
  'senior-partner': [
    "That's a common ethical dilemma. Under the Advocates Act and the Law Society of Kenya's Code of Ethics, you have a duty to your client but also to the court. Here's how I'd approach it...",
    "In my 20 years of practice, I've seen this exact situation many times. The key is to document everything and have a frank conversation with your client about the implications.",
    "You're thinking about this the right way. Let me share a framework I use for balancing competing obligations — it's saved me in many difficult situations."
  ],
  'socratic-tutor': [
    "Before I answer, let me ask you this: What do you think is the underlying principle behind that doctrine? Think about the mischief rule...",
    "Good attempt, but consider this — if that were the case, how would you reconcile it with Article 159 of the Constitution on the furtherance of justice?",
    "You're close. Now, what's the distinction between the position in your jurisdiction and the English common law position? Think about the constitutional impact."
  ],
  'mock-judge': [
    "Counsel, your argument relies heavily on persuasive authority. Do you have any binding precedent from the Kenyan superior courts to support your position?",
    "I note your citation of the Penal Code, but does the 2010 Constitution not supersede that section regarding the right to bail? Please address this.",
    "Your opening was well-structured, but you spent too long on facts the court already has. Get to your legal arguments faster. Try again."
  ]
};

// --- Component ---
const AgenticMentorship: React.FC<AgenticMentorshipProps> = ({ user }) => {
  const [isInCall, setIsInCall] = useState(false);
  const [selectedMode, setSelectedMode] = useState<MentorMode | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAmaniSpeaking, setIsAmaniSpeaking] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showCrossExam, setShowCrossExam] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<Session[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetchSessionHistory();
  }, []);

  const fetchSessionHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('mentorship_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSessionHistory(data || []);
    } catch (err) {
      console.error("Failed to fetch session history", err);
    }
  };

  // Web Speech API for Dictation
  const recognitionRef = useRef<any>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setChatInput(prev => {
            const newText = prev + " " + finalTranscript.trim();
            return newText.trim();
          });
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    if (isInCall && isMicOn && !isAmaniSpeaking && recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        // Ignore if already started
      }
    } else if ((!isInCall || !isMicOn || isAmaniSpeaking) && recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isInCall, isMicOn, isAmaniSpeaking, isListening]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isInCall) {
      timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isInCall]);

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const startCall = (mode: MentorMode) => {
    setShowComingSoon(true);
    setIsNotified(false);
    
    /* Live sessions are currently in laboratory calibration
    setSelectedMode(mode);
    setIsInCall(true);
    setCallDuration(0);
    setMessages([{
      id: 'greeting',
      sender: 'amani',
      text: mode.greeting,
      timestamp: new Date()
    }]);
    setIsAmaniSpeaking(true);
    setTimeout(() => setIsAmaniSpeaking(false), 4000);
    */
  };

  const endCall = async () => {
    setIsInCall(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const sessionDuration = formatDuration(callDuration);
    let finalEvaluation = null;

    if (messages.length > 2) {
      setIsEvaluating(true);
      try {
        const chatHistory = messages.filter(m => m.id !== 'greeting').map(m => ({
          sender: m.sender,
          text: m.text
        }));
        const res = await apiClient.post('/api/mentorship/evaluate', { chatHistory });

        if (res.ok) {
          finalEvaluation = await res.json();
          setEvaluation(finalEvaluation);

          // Save session to history
          if (selectedMode) {
            // Get user ID first before the insert
            const { data: { user } } = await supabase.auth.getUser();
            const { error } = await supabase
              .from('mentorship_sessions')
              .insert({
                user_id: user?.id,
                mode: selectedMode.label,
                topic: messages[1]?.text?.substring(0, 100) || 'General Session',
                duration: sessionDuration,
                evaluation: finalEvaluation
              });

            if (!error) fetchSessionHistory();
          }
        } else {
          closeEvaluation();
        }
      } catch (err) {
        console.error("Evaluation failed", err);
        closeEvaluation();
      } finally {
        setIsEvaluating(false);
      }
    } else {
      closeEvaluation();
    }
  };

  const closeEvaluation = () => {
    setEvaluation(null);
    setIsEvaluating(false);
    setSelectedMode(null);
    setMessages([]);
    setCallDuration(0);
    setIsChatOpen(false);
  };

  const sendMessage = async () => {
    if (!chatInput.trim() || !selectedMode) return;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: chatInput,
      timestamp: new Date()
    };

    // Build chat history including the new user message
    const currentMessages = [...messages, userMsg];
    setMessages(currentMessages);
    setChatInput('');

    setIsAmaniSpeaking(true);

    try {
      const chatHistory = currentMessages.filter(m => m.id !== 'greeting').map(m => ({
        sender: m.sender,
        text: m.text
      }));
      const res = await apiClient.post('/api/mentorship/chat', {
        mode: selectedMode.id,
        chatHistory: chatHistory,
        message: userMsg.text
      });

      if (!res.ok) throw new Error("Backend connection failed");
      const data = await res.json();

      setMessages(prev => [...prev, {
        id: `a-${Date.now()}`,
        sender: 'amani',
        text: data.reply,
        timestamp: new Date()
      }]);
    } catch (err) {
      console.error("Chat error:", err);
      // Fallback response on error
      const responses = MOCK_RESPONSES[selectedMode.id] || MOCK_RESPONSES['senior-partner'];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: `a-${Date.now()}`,
          sender: 'amani',
          text: `[Offline Mode] ${randomResponse}`,
          timestamp: new Date()
        }]);
      }, 1000);
    } finally {
      setIsAmaniSpeaking(false);
    }
  };

  const [showComingSoon, setShowComingSoon] = useState(false);
  const [isNotified, setIsNotified] = useState(false);

  // --- COMING SOON OVERLAY ---
  if (showComingSoon) {
    return (
      <div className="h-full w-full bg-white bg-dots relative overflow-hidden flex flex-col items-center justify-center p-12 text-center">
        {/* Close Button */}
        <button 
          onClick={() => setShowComingSoon(false)}
          className="absolute top-10 right-10 p-4 bg-white border border-gray-100 rounded-3xl hover:bg-gray-50 transition-all z-50 shadow-xl shadow-black/5 flex items-center justify-center hover:scale-110 active:scale-90"
        >
          <X className="w-6 h-6 text-gray-400 font-black" />
        </button>

        {/* Background Accents (same as before) */}
        <div className="absolute inset-0 bg-red-600/5 backdrop-blur-[2px] z-0" />
       
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative z-10 max-w-2xl space-y-10"
        >
           <div className="flex justify-center">
             <div className="w-28 h-28 bg-white rounded-[2.5rem] flex items-center justify-center border border-gray-100 shadow-2xl shadow-red-500/10 relative group">
                <div className="absolute inset-0 bg-red-500/5 rounded-[2.5rem] animate-pulse" />
                <Sparkles className="w-12 h-12 text-red-600 relative z-10" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-black border-4 border-white">!</div>
             </div>
           </div>
           
           <div className="space-y-4">
             <div className="flex items-center justify-center gap-2">
               <span className="h-[1px] w-8 bg-gray-200" />
               <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">Feature In Lab</span>
               <span className="h-[1px] w-8 bg-gray-200" />
             </div>
             <h1 className="text-7xl font-black tracking-tighter text-black">
               Coming <span className="text-red-600">Soon</span>
             </h1>
             <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-xl mx-auto">
               Our <span className="text-black font-bold">AI Mentorship Hub</span> is currently under final calibration. 
               We're training the Amani engine on specialized African case law to ensure world-class socratic guidance.
             </p>
           </div>

           <div className="pt-4 flex flex-col items-center gap-6">
              <div className="inline-flex items-center gap-4 px-6 py-4 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 shadow-xl">
                 <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`w-10 h-10 rounded-full border-4 border-white bg-gray-${i*100+100} flex items-center justify-center text-[8px] font-black text-white overflow-hidden shadow-sm`}>
                         <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="User" />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-4 border-white bg-red-500 flex items-center justify-center text-[8px] font-black text-white shadow-sm">
                      +4k
                    </div>
                 </div>
                 <div className="text-left">
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Join the community</p>
                   <p className="text-xs font-bold text-gray-700">Early Access Waitlist</p>
                 </div>
              </div>
              
              <button 
                onClick={() => setIsNotified(true)}
                className={`px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-3 ${
                  isNotified 
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                    : 'bg-black text-white shadow-black/20 hover:bg-red-600'
                }`}
              >
                 {isNotified ? (
                   <>
                    <Check className="w-4 h-4" /> Waitlist Joined
                   </>
                 ) : (
                   'Notify Me When Ready'
                 )}
              </button>
              {isNotified && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-emerald-500 font-bold text-xs"
                >
                  Success! We will alert you the moment Amani goes live.
                </motion.p>
              )}
           </div>
        </motion.div>

        {/* Floating Animated Orbs */}
        <motion.div 
          animate={{ 
            y: [0, -40, 0],
            x: [0, 20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute -top-48 -right-48 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            y: [0, 40, 0],
            x: [0, -20, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-48 -left-48 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px]" 
        />
      </div>
    );
  }

  // --- IN-CALL VIEW ---
  if (isInCall && selectedMode) {
    return (
      <div className="h-full flex flex-col bg-white bg-dots overflow-hidden relative">
        {/* Main Call Area */}
        <div className="flex-1 flex items-center justify-center p-6 gap-6 relative">
          {/* Amani's Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 max-w-lg bg-gray-50 border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-2xl relative aspect-[4/3]"
          >
            <img
              src="/amani-avatar.png"
              alt="Amani"
              className="w-full h-full object-cover object-top"
            />
            {/* Name Badge */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <div className={`px-4 py-2 ${selectedMode.bgColor.replace('/5', '/10')} backdrop-blur-md rounded-full flex items-center gap-2 border border-white/50 shadow-sm`}>
                <div className={`w-2.5 h-2.5 rounded-full bg-red-500 ${isAmaniSpeaking ? 'animate-pulse' : ''}`} />
                <span className="text-sm font-bold text-gray-800">Amani</span>
              </div>
              <div className="px-3 py-1.5 bg-white/80 backdrop-blur-md rounded-full border border-gray-100 shadow-sm">
                <span className={`text-[10px] font-bold ${selectedMode.color.replace('-400', '-600')}`}>{selectedMode.label}</span>
              </div>
            </div>

            {/* Speaking Indicator */}
            <AnimatePresence>
              {isAmaniSpeaking && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-6 left-0 right-0 flex justify-center px-6"
                >
                  <div className="px-6 py-3 bg-white/90 backdrop-blur-xl border border-red-100 rounded-2xl flex items-center gap-3 shadow-xl">
                    <div className="flex items-center gap-1.5">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 bg-red-500 rounded-full"
                          animate={{ height: [6, 20, 6] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-700 font-bold">Amani is explaining...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* User's Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 max-w-lg bg-gray-100 border border-gray-200 rounded-[2.5rem] overflow-hidden shadow-xl relative flex items-center justify-center aspect-[4/3] group"
          >
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full flex items-center gap-2 border border-gray-100 shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-sm font-bold text-gray-800">You</span>
              </div>
            </div>
            {isVideoOn ? (
              <div className="w-full h-full rounded-[2.5rem] overflow-hidden">
                <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner border border-gray-200">
                <VideoOff className="w-8 h-8 text-gray-300" />
              </div>
            )}

            {/* Visual Feedback for Voice */}
            {isMicOn && !isAmaniSpeaking && (
              <div className="absolute bottom-6 right-6 flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500/30 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            )}
          </motion.div>

          {/* Chat Panel - Optimized for White Theme */}
          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 420, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 25 }}
                className="bg-white border-l border-gray-100 shadow-2xl overflow-hidden flex flex-col shrink-0 rounded-l-[2rem]"
              >
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-black text-black uppercase tracking-[0.3em]">Q&A</h3>
                  </div>
                  <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[90%] px-5 py-4 rounded-3xl text-sm leading-relaxed shadow-sm border ${msg.sender === 'user'
                        ? 'bg-red-500 text-white rounded-br-none border-red-400'
                        : 'bg-gray-50 text-gray-800 rounded-bl-none border-gray-100'
                        }`}>
                        {msg.sender === 'amani' && (
                          <p className="text-[9px] font-black text-red-500 mb-1.5 uppercase tracking-[0.2em]">Amani</p>
                        )}
                        <span className="font-medium">{msg.text}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-6 border-t border-gray-50 bg-gray-50/20">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Ask Amani anything..."
                      className="flex-1 bg-white border border-gray-200 rounded-2xl px-5 py-4 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500/30 transition-all shadow-sm"
                    />
                    <button
                      onClick={sendMessage}
                      className="w-14 h-14 bg-red-500 text-white rounded-2xl flex items-center justify-center hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-95"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Controls */}
        <div className="p-8 pt-0">
          <div className="flex items-center justify-center gap-6">
            {/* Duration */}
            <div className="px-6 py-3 bg-gray-50 border border-gray-200 rounded-full text-xs font-mono font-black text-gray-500 shadow-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-500" />
              {formatDuration(callDuration)}
            </div>

            <div className="flex items-center gap-4">
              {/* Mic Toggle */}
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMicOn ? 'bg-white text-gray-700 hover:bg-gray-100 shadow-md border border-gray-100' : 'bg-red-50 text-red-500 border border-red-100'
                  }`}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              {/* Video Toggle */}
              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isVideoOn ? 'bg-white text-gray-700 hover:bg-gray-100 shadow-md border border-gray-100' : 'bg-red-50 text-red-500 border border-red-100'
                  }`}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              {/* Chat Toggle */}
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isChatOpen ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md border border-gray-100'
                  }`}
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>

            {/* End Call */}
            <button
              onClick={endCall}
              className="w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-red-500/30 hover:scale-105 active:scale-95"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- LOBBY VIEW ---
  return (
    <div className="h-full overflow-y-auto bg-white bg-dots p-8 no-scrollbar relative">

      {/* Evaluation Modal Overlay */}
      <AnimatePresence>
        {(isEvaluating || evaluation) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-white/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-3xl rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100"
            >
              <div className="p-8">
                {isEvaluating ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-red-500/20 animate-pulse" />
                      <Sparkles className="w-8 h-8 text-red-600 relative z-10 animate-bounce" />
                    </div>
                    <h2 className="text-2xl font-bold text-black mb-2">Amani is evaluating your session...</h2>
                    <p className="text-gray-500 font-medium">Analyzing statutory accuracy, logical reasoning, and persuasiveness.</p>
                  </div>
                ) : evaluation ? (
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-2xl font-bold text-black">Session Evaluation</h2>
                        <p className="text-sm text-gray-500 font-medium">Performance Review</p>
                      </div>
                      <div className="w-20 h-20 rounded-full bg-red-50 flex flex-col items-center justify-center border-[3px] border-red-500 shadow-lg shadow-red-500/10">
                        <span className="text-2xl font-black text-red-600 leading-none">{evaluation.score}</span>
                        <span className="text-[10px] font-bold text-red-600/70 uppercase">Score</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Check className="w-5 h-5 text-red-500" />
                        Strengths
                      </h3>
                      <ul className="space-y-3">
                        {evaluation.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-3 text-base text-gray-600">
                            <span className="text-red-500 mt-1">•</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-amber-500" />
                        Areas for Improvement
                      </h3>
                      <ul className="space-y-3">
                        {evaluation.areasForImprovement.map((a, i) => (
                          <li key={i} className="flex items-start gap-3 text-base text-gray-600">
                            <span className="text-amber-500 mt-1">•</span> {a}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-sm text-gray-500 italic leading-relaxed">"{evaluation.overallFeedback}"</p>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button onClick={closeEvaluation} className="px-8 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all shadow-xl shadow-red-500/20">
                        Close Report
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        {/* Premium Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 relative"
        >
          <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-sm relative overflow-hidden group">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-[100px] -mr-48 -mt-48 transition-all duration-1000 group-hover:bg-red-500/10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px] -ml-32 -mb-32"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              {/* Text Content */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-6">
                  <span className="px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-[11px] font-bold border border-red-100">ai mentor</span>
                  <span className="px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-[11px] font-bold border border-red-100">senior partner</span>
                  <span className="px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-[11px] font-bold border border-red-100">socratic tutor</span>
                  <span className="px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-[11px] font-bold border border-red-100">mock judge</span>
                </div>

                <h1 className="text-5xl font-black tracking-tight text-black mb-4">
                  Meet <span className="text-red-600">Amani</span>
                </h1>

                <p className="text-lg text-gray-500 max-w-2xl leading-relaxed font-medium">
                  Your <span className="text-black font-bold">private AI legal companion</span> trained in <span className="text-red-600 font-bold">African Law</span>.
                  Master cross-examination, resolve ethical dilemmas, or sharpen your strategy in 1-on-1 sessions.
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-8">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-2 rounded-xl">
                    <Shield className="w-3.5 h-3.5 text-red-500" /> Private & Secure
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-2 rounded-xl">
                    <GraduationCap className="w-3.5 h-3.5 text-red-500" /> African-Standard
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-2 rounded-xl">
                    <Target className="w-3.5 h-3.5 text-red-500" /> Strategic Insight
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mode Selection Cards */}
        <div className="mb-12">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 pl-1">Choose Your Session Mode</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MENTOR_MODES.map((mode, idx) => (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => startCall(mode)}
                className="bg-white border border-gray-100 rounded-[2.5rem] p-8 cursor-pointer hover:border-red-500/30 hover:shadow-2xl hover:shadow-red-500/10 transition-all group shadow-sm"
              >
                <div className={`w-14 h-14 ${mode.bgColor.replace('/10', '/5')} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-gray-50`}>
                  <mode.icon className={`w-7 h-7 ${mode.color.replace('-400', '-600')}`} />
                </div>
                <h3 className="text-xl font-bold text-black mb-2 group-hover:text-red-600 transition-colors tracking-tight">{mode.label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">{mode.description}</p>
                <div className="flex items-center gap-2 mt-6 text-[10px] text-gray-400 group-hover:text-red-600 font-bold uppercase tracking-widest transition-all">
                  Start Session <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cross-Examination Practice */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5 pl-1">
              <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Swords className="w-4 h-4 text-red-600" />
                Cross-Examination Drills
              </h2>
              <button
                onClick={() => setShowCrossExam(!showCrossExam)}
                className="text-[10px] text-red-600 font-bold uppercase tracking-wider hover:underline"
              >
                {showCrossExam ? 'Show Less' : 'View All Scenarios'}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(showCrossExam ? CROSS_EXAM_SCENARIOS : CROSS_EXAM_SCENARIOS.slice(0, 2)).map((scenario, idx) => (
                <motion.div
                  key={scenario.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white border border-gray-100 rounded-[2rem] p-6 hover:border-red-500/30 transition-all cursor-pointer group shadow-sm"
                  onClick={() => {
                    const mockJudge = MENTOR_MODES.find(m => m.id === 'mock-judge')!;
                    startCall(mockJudge);
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center border border-red-100">
                      <scenario.icon className="w-5 h-5 text-red-500" />
                    </div>
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${scenario.difficulty === 'Advanced' ? 'bg-red-50 text-red-600' :
                      scenario.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-600' :
                        'bg-red-50 text-red-700'
                      }`}>
                      {scenario.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-black mb-2 group-hover:text-red-600 transition-colors tracking-tight">{scenario.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-6 font-medium">{scenario.description}</p>
                  <div className="flex items-center gap-2 text-[10px] text-red-600 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                    <Play className="w-3 h-3 fill-current" />
                    Start Drill
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Sessions */}
          <div>
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-2 pl-1">
              <Clock className="w-4 h-4 text-red-600" />
              Recent History
            </h2>
            <div className="space-y-3">
              {(sessionHistory.length > 0 ? sessionHistory : MOCK_SESSIONS).map((session) => (
                <div key={session.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-red-500/30 transition-all cursor-pointer shadow-sm group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] text-red-600 font-bold uppercase tracking-widest">{session.mode}</span>
                    <span className="text-[10px] text-gray-400 font-mono font-bold tracking-tighter">{session.duration}</span>
                  </div>
                  <p className="text-sm font-bold text-black mb-1 tracking-tight group-hover:text-red-600 transition-colors">{session.topic}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    {session.date || (session.created_at ? new Date(session.created_at).toLocaleDateString() : 'Unknown')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-white border border-gray-100 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>

          <div className="flex items-center gap-8 relative z-10">
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center border border-red-100 shadow-inner">
              <BookOpen className="w-10 h-10 text-red-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-black mb-2 tracking-tight">Pro Tip: Cross-Examination</h3>
              <p className="text-sm text-gray-500 max-w-xl leading-relaxed font-medium">Master the <span className="text-red-600 font-bold">"Commit ➜ Credit ➜ Confront"</span> method to impeach a witness with prior inconsistent statements.</p>
            </div>
          </div>
          <button
            onClick={() => {
              const tutor = MENTOR_MODES.find(m => m.id === 'socratic-tutor')!;
              startCall(tutor);
            }}
            className="px-8 py-4 bg-red-600 text-white rounded-2xl text-xs font-black hover:bg-red-700 transition-all whitespace-nowrap flex items-center gap-3 shadow-xl shadow-red-500/10 hover:scale-105 active:scale-95"
          >
            Learn with Amani <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AgenticMentorship;
