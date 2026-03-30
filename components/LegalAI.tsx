
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import LegalInput from './LegalInput';
import LegalResponse from './LegalResponse';
import ArtifactCanvas from './ArtifactCanvas';
import {
  LegalMessage,
  WorkspaceType,
  LegalSpecialist,
  SavedPrompt,
  Persona,
  Draft,
  ChatHistory
} from '../types';

import { MOCK_LEGAL_RESPONSES } from '../services/mockLegalData';
import { supabase } from '../lib/supabase';
import { apiClient } from '../lib/apiClient';
import {
  DocumentTextIcon,
  ScaleIcon,
  BoltIcon,
  ShieldCheckIcon,
  BriefcaseIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
  BookmarkIcon,
  UserGroupIcon,
  DocumentDuplicateIcon,
  ClockIcon,
  TrashIcon,
  ArrowTopRightOnSquareIcon,
  ArrowPathIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  XCircleIcon,
  CheckCircleIcon,
  ShieldExclamationIcon,
  GlobeAltIcon,
  CodeBracketIcon,
  IdentificationIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { SiGoogledrive } from 'react-icons/si';
import { 
  Newspaper, 
  Gavel, 
  Users, 
  Home, 
  MessageSquare,
  Sparkles as LucideSparkles,
  Search as LucideSearch,
  Scale as LucideScale,
  Calculator,
  Globe as LucideGlobe,
  Zap as LucideZap,
  Workflow,
  History as LucideHistory,
  FolderOpen
} from 'lucide-react';
import VaultModal from './VaultModal';

interface LegalAIProps {
  userEmail: string;
  activeSpecialist?: LegalSpecialist | null;
  subView?: string;
  onChatActive?: (isActive: boolean) => void;
  isCoworkPage?: boolean;
}

const MOCK_PROMPTS: SavedPrompt[] = [
  { id: '1', title: 'Contract Review', content: 'Review this contract for any hidden liabilities and ensure compliance with Kenyan Law.', category: 'Commercial', lastUsed: new Date() },
  { id: '2', title: 'Case Summary', content: 'Summarize the following case law focusing on the ratio decidendi.', category: 'Research', lastUsed: new Date() },
  { id: '3', title: 'Legal Opinion', content: 'Draft a legal opinion on the following facts regarding land ownership.', category: 'Conveyancing', lastUsed: new Date() },
];

const MOCK_PERSONAS: Persona[] = [
  { id: '1', name: 'Senior Partner', role: 'Strategic Advisor', description: 'Provides high-level strategic legal advice with a focus on risk mitigation.', instructions: 'Act as a senior partner in a top-tier Kenyan law firm. Be concise, authoritative, and focus on strategic risks.' },
  { id: '2', name: 'Research Associate', role: 'Legal Researcher', description: 'Specializes in deep legal research and case law analysis.', instructions: 'Act as a meticulous legal researcher. Provide detailed citations from the Kenya Law Reports and focus on legal precedents.' },
  { id: '3', name: 'Drafting Expert', role: 'Document Specialist', description: 'Expert in drafting precise and legally sound contracts and pleadings.', instructions: 'Act as a legal drafting expert. Focus on precision, clarity, and adherence to Kenyan legal drafting standards.' },
];

const MOCK_DRAFTS: Draft[] = [
  { id: '1', title: 'Lease Agreement - Upper Hill', content: 'This Lease Agreement is made on...', type: 'document', lastModified: new Date() },
  { id: '2', title: 'Advice on Tax Compliance', content: 'Regarding your inquiry on KRA compliance...', type: 'advice', lastModified: new Date() },
];

const MOCK_HISTORY: ChatHistory[] = [
  { id: '1', title: 'Land Dispute Analysis', lastMessage: 'The court ruled in favor of...', timestamp: new Date(), messages: [] },
  { id: '2', title: 'Employment Contract Review', lastMessage: 'The termination clause is...', timestamp: new Date(), messages: [] },
];

const LegalAI: React.FC<LegalAIProps> = ({ 
  userEmail, 
  activeSpecialist, 
  subView = 'Active chats', 
  onChatActive,
  isCoworkPage = false
}) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<LegalMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFeed, setStatusFeed] = useState<string[]>([]);
  const [isCoworkMode, setIsCoworkMode] = useState(false); // Controls the AI behavior
  const [isCanvasOpen, setIsCanvasOpen] = useState(false); // Controls the side panel visibility
  const [activeArtifact, setActiveArtifact] = useState<{ id: string; title: string; versions: any[] } | null>(null);
  const [draftContent, setDraftContent] = useState("");
  const [providedContext, setProvidedContext] = useState<Record<string, any>>({});
  const [artifactTitle, setArtifactTitle] = useState("Lawlify Draft");
  const [canvasWidth, setCanvasWidth] = useState(600);
  const [isResizing, setIsResizing] = useState(false);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [activePersona, setActivePersona] = useState<Persona | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [selectedHistoryIds, setSelectedHistoryIds] = useState<string[]>([]);
  const [mode, setMode] = useState<'fast' | 'thinking' | 'research'>('fast');
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [newPersona, setNewPersona] = useState({ name: '', role: '', description: '', instructions: '' });
  const [isVaultOpen, setIsVaultOpen] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = React.useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior, block: 'end' });
    }
  }, []);

  const startResizing = React.useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const stopResizing = React.useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = React.useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 300 && newWidth < window.innerWidth * 0.7) {
        setCanvasWidth(newWidth);
      }
    }
  }, [isResizing]);
 
  const location = useLocation();
  const promptAttempted = useRef(false);

  useEffect(() => {
    if (activeSpecialist) {
      if (!isCanvasOpen) setIsCanvasOpen(true);
      if (!activeArtifact && !draftContent) {
        setArtifactTitle('Legal Canvas');
        setDraftContent('// ' + activeSpecialist.name + ' Workspace initialized.\n// Describe the document you need in the chat, and the results will load here.');
      }
    }
  }, [activeSpecialist]);

  useEffect(() => {
    const state = location.state as { initialPrompt?: string } | null;
    if (state?.initialPrompt && !promptAttempted.current) {
      promptAttempted.current = true;
      handleSendMessage(state.initialPrompt);
      // Clear the state to prevent re-triggering on manual navigation back
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    fetchPersonas();
    fetchHistory();
  }, []);

  useEffect(() => {
    if (isCoworkPage) {
      setMode('thinking');
    }
  }, [isCoworkPage]);

  useEffect(() => {
    if (onChatActive) {
      const isActive = messages.length > 0 && subView === 'Active chats';
      onChatActive(isActive);
    }
  }, [messages.length, subView, onChatActive]);

  const fetchPersonas = async () => {
    const { data, error } = await supabase
      .from('ai_personas')
      .select('*')
      .order('created_at', { ascending: true });
    if (!error && data) setPersonas(data);
  };

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from('chat_histories')
      .select('*')
      .order('timestamp', { ascending: false });
    if (!error && data) setChatHistory(data);
  };

  const startNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setIsCoworkMode(false);
    // Switch to active chats implicitly
    const event = new CustomEvent('app-view-change', { detail: 'Active chats' });
    window.dispatchEvent(event);
  };

  const handleActivatePersona = (persona: Persona) => {
    setActivePersona(persona);
    // When activating a persona, we reset the current chat if it's empty
    if (messages.length === 0) {
      // Logic handled by rendering state
    }
    // Switch to active chats implicitly
    const event = new CustomEvent('app-view-change', { detail: 'Active chats' });
    window.dispatchEvent(event);
    // The App component handles the subView prop, but since LegalAI is a child, 
    // we might need a more direct way if subView is passed from App.tsx.
    // For now, let's assume the user click on the sidebar/rail works, 
    // or we can just trigger a re-render if we were in the persona view.
  };

  const handleContinueSession = async (historyId: string) => {
    const { data: historyData, error: hError } = await supabase
      .from('chat_histories')
      .select('*')
      .eq('id', historyId)
      .single();

    const { data: msgData, error: mError } = await supabase
      .from('legal_messages')
      .select('*')
      .eq('chat_history_id', historyId)
      .order('timestamp', { ascending: true });

    if (!hError && !mError && historyData && msgData) {
      setCurrentChatId(historyId);
      setMessages(msgData.map(m => ({
        ...m,
        timestamp: new Date(m.timestamp)
      })));
      
      // If there's an artifact in the last message or any message, we might want to check
      const lastAssistantWithArtifact = [...msgData].reverse().find(m => m.role === 'assistant' && m.artifact);
      if (lastAssistantWithArtifact) {
          const art = lastAssistantWithArtifact.artifact;
          setActiveArtifact(art);
          setArtifactTitle(art.title);
          setDraftContent(art.versions[art.versions.length - 1].content);
          setIsCanvasOpen(true);
      }

      // Switch to active chats
      const event = new CustomEvent('app-view-change', { detail: 'Active chats' });
      window.dispatchEvent(event);
    }
  };

  const handleDeleteHistory = async (id: string) => {
    const { error } = await supabase
      .from('chat_history')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setChatHistory(prev => prev.filter(h => h.id !== id));
      setSelectedHistoryIds(prev => prev.filter(sid => sid !== id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedHistoryIds.length === 0) return;
    
    const { error } = await supabase
      .from('chat_history')
      .delete()
      .in('id', selectedHistoryIds);
    
    if (!error) {
      setChatHistory(prev => prev.filter(h => !selectedHistoryIds.includes(h.id)));
      setSelectedHistoryIds([]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedHistoryIds.length === chatHistory.length && chatHistory.length > 0) {
      setSelectedHistoryIds([]);
    } else {
      setSelectedHistoryIds(chatHistory.map(h => h.id));
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);
 
  const HeaderButton = ({ icon, tooltip, onClick }: { icon: React.ReactNode; tooltip: string; onClick?: () => void }) => (
    <button
      onClick={onClick}
      title={tooltip}
      className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
    >
      {icon}
    </button>
  );
 
  const getSuggestionIcon = (iconName: string) => {
    switch (iconName) {
      case 'DocumentTextIcon': return <DocumentTextIcon className="w-6 h-6" />;
      case 'ScaleIcon': return <ScaleIcon className="w-6 h-6" />;
      case 'ShieldCheckIcon': return <ShieldCheckIcon className="w-6 h-6" />;
      case 'BriefcaseIcon': return <BriefcaseIcon className="w-6 h-6" />;
      case 'DocumentDuplicateIcon': return <DocumentDuplicateIcon className="w-6 h-6" />;
      case 'Newspaper': return <Newspaper className="w-6 h-6" />;
      case 'Gavel': return <Gavel className="w-6 h-6" />;
      case 'Users': return <Users className="w-6 h-6" />;
      case 'Home': return <Home className="w-6 h-6" />;
      case 'Sparkles': return <LucideSparkles className="w-6 h-6" />;
      case 'Search': return <LucideSearch className="w-6 h-6" />;
      case 'Scale': return <LucideScale className="w-6 h-6" />;
      case 'XCircle': return <XCircleIcon className="w-6 h-6" />;
      case 'CheckCircleIcon': return <CheckCircleIcon className="w-6 h-6" />;
      case 'ShieldExclamationIcon': return <ShieldExclamationIcon className="w-6 h-6" />;
      case 'GlobeAltIcon': return <GlobeAltIcon className="w-6 h-6" />;
      case 'CodeBracketIcon': return <CodeBracketIcon className="w-6 h-6" />;
      case 'PassportIcon': return <IdentificationIcon className="w-6 h-6" />;
      case 'UserGroupIcon': return <UserGroupIcon className="w-6 h-6" />;
      case 'ClockIcon': return <ClockIcon className="w-6 h-6" />;
      case 'BoltIcon': return <BoltIcon className="w-6 h-6" />;
      case 'Calculator': return <Calculator className="w-6 h-6" />;
      case 'ChatBubbleLeftRightIcon': return <ChatBubbleLeftRightIcon className="w-6 h-6" />;
      default: return <MessageSquare className="w-6 h-6" />;
    }
  };

  const firstName = userEmail.split(/[0-9@.]/)[0].toUpperCase();

  const handleSendMessage = async (content: string) => {
    const userMsg: LegalMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setStatusFeed([]); 

      const assistantId = `assistant-${Date.now()}`;
      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        content: '',
        thinking: '',
        timestamp: new Date(),
        isGenerating: true,
        statusFeed: []
      }]);

    try {
      const response = await apiClient.fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: content,
          specialistId: activeSpecialist?.id,
          userEmail,
          stream: true,
          mode,
          isCoworkMode,
          webSearch: webSearchEnabled || mode === 'research',
          chatId: currentChatId,
          providedContext
        })
      });

      if (!response.ok) throw new Error('Streaming failed');
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let done = false;
      let accumulatedContent = "";
      let accumulatedThinking = "";

      setStatusFeed([]); // Clear feed when stream starts

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            
            if (data.type === "session") {
              setCurrentChatId(data.chatId);
            } else if (data.type === "thinking") {
              accumulatedThinking += data.delta;
              setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, thinking: accumulatedThinking } : m));
            } else if (data.type === "status") {
              setMessages(prev => prev.map(m => m.id === assistantId ? { 
                ...m, 
                statusFeed: [...(m.statusFeed || []), data.message] 
              } : m));
              // Also update status feed for the overall app if needed, but we'll prioritize the message feed
              setStatusFeed(prev => [...prev, data.message]);
            } else if (data.type === "content") {
              accumulatedContent += data.delta;
              setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: accumulatedContent } : m));
              scrollToBottom('auto');
              // Auto-sync to Cowork Canvas if in cowork mode
              if (isCoworkMode) {
                setDraftContent(accumulatedContent);
              }
            } else if (data.type === "artifact_trigger") {
              const title = data.metadata?.title || 'Lawlify Draft';
              const id = data.metadata?.id || `art-${Date.now()}`;
              setArtifactTitle(title);
              
              const newArtifact = { 
                id, 
                title, 
                versions: [{ content: accumulatedContent, timestamp: new Date() }] 
              };
              
              setActiveArtifact(newArtifact);
              setMessages(prev => prev.map(m => m.id === assistantId ? { 
                ...m, 
                artifact: newArtifact 
              } : m));
            } else if (data.type === "followup") {
              setMessages(prev => prev.map(m => m.id === assistantId ? { 
                ...m, 
                followup: {
                  ...data.followup,
                  answers: {}
                }
              } : m));
              // Cowork mode is automatically enhanced with followups
            } else if (data.type === "metadata") {
              setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, citations: data.citations } : m));
            } else if (data.type === "error") {
              throw new Error(data.message);
            }
          } catch (e) {
            console.error("Error parsing SSE chunk:", e);
          }
        }
      }

      // Finalize
      // Finalize
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, isGenerating: false } : m));

      setIsLoading(false);
      setStatusFeed([]); // Clear global feed on success
    } catch (error: any) {
      console.error(error);
      const isNetworkError = !error.message || error.message === 'Streaming failed' || error.message === 'Failed to fetch';
      const friendlyMsg = isNetworkError
        ? "I'm having trouble connecting right now. Please check your connection and try again."
        : `Something went wrong: ${error.message}`;
      setMessages(prev => prev.map(m => m.id === assistantId ? { 
        ...m, 
        content: friendlyMsg, 
        isGenerating: false,
        isError: true
      } : m));
      setIsLoading(false);
      setStatusFeed([]);
    }
  };

  const handleVaultAdd = (documents: any[]) => {
    if (documents.length === 0) return;
    
    // Format a message to the AI explaining the context of the added files
    const fileList = documents.map(d => `[FILE: ${d.name} (${d.type})]`).join('\n');
    const systemInstruction = `\n\n[SYSTEM: The user has attached the following documents from their Vault for your analysis:\n${documents.map(d => `${d.name}: ${d.content}`).join('\n---\n')}]`;
    
    handleSendMessage(`I've added the following documents from my vault to this session:\n${fileList}${systemInstruction}`);
  };

  const handleReloadMessage = (id: string) => {
    const msgIndex = messages.findIndex(m => m.id === id);
    if (msgIndex === -1) return;
    
    const userMsg = messages[msgIndex];
    // Keep messages up to the reloaded one, remove everything after
    setMessages(prev => prev.slice(0, msgIndex + 1));
    handleSendMessage(userMsg.content);
  };

  const handleEditMessage = (id: string, newContent: string) => {
    // For now, we'll just trigger a reload with the new content
    const msgIndex = messages.findIndex(m => m.id === id);
    if (msgIndex === -1) return;

    setMessages(prev => prev.slice(0, msgIndex));
    handleSendMessage(newContent);
  };

  const handleFollowUpSubmit = (answers: Record<string, string | string[]>) => {
    // 1. Accumulate context for future requests
    const newContext = { ...providedContext, ...answers };
    setProvidedContext(newContext);

    // 2. Format a friendly message for the UI
    const summarizedAnswers = Object.entries(answers)
      .map(([id, val]) => {
        const fieldName = id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        return `${fieldName}: ${Array.isArray(val) ? val.join(', ') : val}`;
      })
      .join('\n');
    
    handleSendMessage(`Proceeding with the following information:\n${summarizedAnswers}`);
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages.length, scrollToBottom]);

  const renderActiveChats = () => (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative bg-[#fafafa]/80 backdrop-blur-xl bg-dots no-scrollbar">
      {/* Mode Toggle Button Moved to LegalInput */}

        <div 
          className="flex flex-col transition-all duration-500 ease-in-out"
          style={{ width: isCanvasOpen ? `calc(100% - ${canvasWidth}px)` : '100%' }}
        >

        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-6 no-scrollbar">
          {messages.length === 0 ? (
            <div className="min-h-full flex flex-col items-center justify-center space-y-12 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="flex justify-center mb-12">
                  <div className="relative">
                    <motion.div
                      animate={{
                        scale: [1, 1.35, 1.05, 1.5, 1, 1.2, 1],
                        opacity: [0.2, 0.6, 0.3, 0.7, 0.2, 0.5, 0.2]
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: [0.4, 0, 0.6, 1],
                        times: [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1]
                      }}
                      className="absolute inset-0 bg-primary/30 blur-3xl rounded-full"
                    />
                    <motion.div
                      animate={{
                        scale: [1, 1.12, 1.02, 1.18, 1, 1.08, 1],
                        rotate: [0, 3, -2, 4, 0, -3, 0],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: [0.4, 0, 0.6, 1],
                        times: [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1]
                      }}
                      className="w-32 h-32 bg-gradient-to-br from-primary via-red-500 to-primary/80 rounded-full shadow-2xl shadow-primary/40 relative z-10 flex items-center justify-center"
                    >
                      <ScaleIcon className="w-12 h-12 text-white" />
                    </motion.div>
                  </div>
                </div>
                <h2 className="text-sm font-bold text-primary mb-2 tracking-[0.3em] uppercase opacity-90">HELLO {firstName}</h2>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-black tracking-tight leading-tight mb-8 max-w-none mx-auto whitespace-nowrap">
                  {activeSpecialist ? <span>Let the <span className="text-red-500">{activeSpecialist.name}</span> assist you</span> : 'What are you working on today?'}
                </h1>
              </div>

              <div className="w-full max-w-5xl px-4">
                <LegalInput 
                  onSendMessage={handleSendMessage} 
                  isLoading={isLoading} 
                  variant="initial" 
                  activeSpecialistName={activeSpecialist?.name}
                  isCoworkMode={isCoworkMode}
                  setIsCoworkMode={setIsCoworkMode}
                  mode={mode}
                  setMode={setMode}
                  webSearchEnabled={webSearchEnabled}
                  setWebSearchEnabled={setWebSearchEnabled}
                  onVaultClick={() => setIsVaultOpen(true)}
                />
              </div>

              <div className="w-full max-w-6xl px-4">
                <div className="flex items-center gap-2 mb-4 px-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "auto" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">
                      {"Not sure where to begin? Try...".split("").map((char, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.04 }}
                        >
                          {char}
                        </motion.span>
                      ))}
                    </span>
                  </motion.div>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <ArrowPathIcon className="w-3 h-3 text-red-500 rotate-90" />
                  </motion.div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
                  {activeSpecialist?.suggestions ? (
                    activeSpecialist.suggestions.map((suggestion, idx) => (
                      <QuickActionButton
                        key={idx}
                        icon={getSuggestionIcon(suggestion.icon)}
                        label={suggestion.label}
                        description={suggestion.description}
                        onClick={() => handleSendMessage(suggestion.prompt)}
                        color={suggestion.color}
                      />
                    ))
                  ) : (
                    <>
                      <QuickActionButton
                        icon={<DocumentTextIcon className="w-6 h-6" />}
                        label="Conveyancing Guide"
                        description="Land Registration Act 2012"
                        onClick={() => handleSendMessage("Explain the conveyancing requirements under the Kenyan Land Registration Act.")}
                        color="grey"
                      />
                      <QuickActionButton
                        icon={<ScaleIcon className="w-6 h-6" />}
                        label="Explain Muruatetu"
                        description="Supreme Court landmark ruling"
                        onClick={() => handleSendMessage("Explain the Muruatetu case to me and its impact on Kenyan law.")}
                        color="red"
                      />
                      <QuickActionButton
                        icon={<BriefcaseIcon className="w-6 h-6" />}
                        label="Employment Act"
                        description="Lawful termination process"
                        onClick={() => handleSendMessage("Summarize the lawful termination process in Kenya.")}
                        color="blue"
                      />
                      <QuickActionButton
                        icon={<ShieldCheckIcon className="w-6 h-6" />}
                        label="Constitution 2010"
                        description="Bill of Rights & Devolution"
                        onClick={() => handleSendMessage("What are the key highlights of the Kenyan Constitution 2010 regarding the Bill of Rights?")}
                        color="green"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className={`max-w-[1600px] mx-auto space-y-12 pb-60 px-4 md:px-12 ${isCoworkPage ? 'min-h-[60vh] flex flex-col items-center justify-center pt-20' : ''}`}>
              {isCoworkPage && messages.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12 text-center"
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-8 mx-auto shadow-2xl shadow-primary/20">
                    <LucideZap className="w-10 h-10" />
                  </div>
                  <h1 className="text-5xl font-black text-black tracking-tighter mb-4 font-display">Autonomous Station</h1>
                  <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px]">Ready for automated legal operations</p>
                </motion.div>
              )}
              {messages.map((message) => (
                <LegalResponse 
                  key={message.id} 
                  message={message} 
                  onArtifactClick={(artifact) => {
                    const art = artifact as any;
                    setActiveArtifact(art);
                    setArtifactTitle(art.title);
                    setDraftContent(art.versions[art.versions.length - 1].content);
                    setIsCoworkMode(true);
                    setIsCanvasOpen(true);
                  }}
                  onReloadMessage={handleReloadMessage}
                  onEditMessage={handleEditMessage}
                  onFollowUpSubmit={handleFollowUpSubmit}
                />
              ))}

              {/* Real-time Status Feed */}
              <AnimatePresence>
                {statusFeed.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="max-w-6xl mx-auto space-y-3 pt-4 flex flex-col items-start justify-start"
                  >
                    {statusFeed.slice(-1).map((status, idx) => {
                      const isSearching = status.toLowerCase().includes('search');
                      const isConnecting = status.toLowerCase().includes('connect');
                      const isSuccess = status.toLowerCase().includes('intent') || status.toLowerCase().includes('context');
                      
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-3 text-xs font-bold text-black/50 tracking-tight justify-start"
                        >
                          {isSearching ? (
                            <LucideGlobe className="w-4 h-4 text-primary animate-pulse" />
                          ) : isConnecting ? (
                            <LucideSparkles className="w-4 h-4 text-orange-500 animate-pulse" />
                          ) : isSuccess ? (
                            <CheckCircleIcon className="w-4 h-4 text-green-500" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                          )}
                          {status}
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {messages.length > 0 && (
          <div className="p-6 bg-gradient-to-t from-white via-white/40 to-transparent border-t border-gray-100 mt-auto">
            <div className="max-w-none mx-auto">
              <LegalInput 
                onSendMessage={handleSendMessage} 
                isLoading={isLoading} 
                variant="compact" 
                activeSpecialistName={activeSpecialist?.name}
                isCoworkMode={isCoworkMode}
                setIsCoworkMode={setIsCoworkMode}
                mode={mode}
                setMode={setMode}
                webSearchEnabled={webSearchEnabled}
                setWebSearchEnabled={setWebSearchEnabled}
                onVaultClick={() => setIsVaultOpen(true)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Vault Modal */}
      <VaultModal 
        isOpen={isVaultOpen} 
        onClose={() => setIsVaultOpen(false)} 
        onAddDocuments={handleVaultAdd} 
      />

      {/* Resizable Divider Trigger */}
      {isCanvasOpen && (
        <div
          onMouseDown={startResizing}
          className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-primary/20 transition-colors z-50 group flex items-center justify-center"
          style={{ right: canvasWidth - 3 }}
        >
          <div className="w-0.5 h-12 bg-gray-200 group-hover:bg-primary/40 rounded-full" />
        </div>
      )}

      {/* Claude-Style Artifact Canvas */}
      <AnimatePresence>
        {isCanvasOpen && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: canvasWidth }}
            exit={{ width: 0 }}
            className="overflow-hidden"
          >
            <ArtifactCanvas
              content={draftContent}
              title={artifactTitle}
              versions={activeArtifact?.versions || []}
              onContentChange={setDraftContent}
              onVersionChange={(idx) => {
                if (activeArtifact) {
                  setDraftContent(activeArtifact.versions[idx].content);
                }
              }}
              onClose={() => setIsCanvasOpen(false)}
              onRegenerate={() => handleSendMessage('Regenerate this draft with more legal citations.')}
              isStreaming={isLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderSavedPrompts = () => (
    <div className="flex-1 p-8 overflow-y-auto no-scrollbar bg-[#fafafa] bg-dots">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-black tracking-tighter mb-2">Saved Prompts</h1>
            <p className="text-gray-400 text-sm font-medium">Your library of optimized legal prompts.</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-[15px] text-xs font-bold hover:bg-gray-800 transition-all shadow-xl shadow-black/10">
            <PlusIcon className="w-4 h-4" />
            <span>Create Prompt</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PROMPTS.map(prompt => (
            <div key={prompt.id} className="p-6 bg-white border border-gray-100 rounded-[15px] hover:shadow-2xl transition-all group relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-widest">
                  {prompt.category}
                </div>
                <button className="text-gray-300 hover:text-black transition-colors">
                  <BookmarkIcon className="w-5 h-5 fill-current" />
                </button>
              </div>
              <h3 className="text-xl font-bold text-black mb-2 tracking-tight">{prompt.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-6 line-clamp-3">{prompt.content}</p>
              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <span className="text-[10px] font-medium text-gray-400">Used {prompt.lastUsed.toLocaleDateString()}</span>
                <button
                  onClick={() => handleSendMessage(prompt.content)}
                  className="p-2 bg-gray-50 text-black rounded-[15px] hover:bg-primary hover:text-white transition-all"
                >
                  <BoltIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPersonaLibrary = () => (
    <div className="flex-1 p-8 overflow-y-auto no-scrollbar bg-[#fafafa] bg-dots">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-black tracking-tighter mb-2">Persona Library</h1>
            <p className="text-gray-400 text-sm font-medium">Configure specialized AI behaviors for different tasks.</p>
          </div>
          <button 
            onClick={() => navigate('/app/specialists', { state: { subView: 'Create Specialist' } })}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl text-xs font-bold hover:bg-gray-800 transition-all shadow-xl shadow-black/10"
          >
            <PlusIcon className="w-4 h-4" />
            <span>New Persona</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {personas.map(persona => (
            <div key={persona.id} className="p-8 bg-white border border-gray-100 rounded-[2.5rem] hover:shadow-2xl transition-all group relative overflow-hidden">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                <UserGroupIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-1 tracking-tight">{persona.name}</h3>
              <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-4">{persona.role}</p>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">{persona.description}</p>
              <button 
                onClick={() => handleActivatePersona(persona)}
                className={`w-full py-3 ${activePersona?.id === persona.id ? 'bg-primary text-white' : 'bg-gray-50 text-black'} rounded-2xl text-xs font-bold hover:bg-black hover:text-white transition-all`}
              >
                {activePersona?.id === persona.id ? 'Active Persona' : 'Activate Persona'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDrafts = () => (
    <div className="flex-1 p-8 overflow-y-auto no-scrollbar bg-[#fafafa] bg-dots">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-black tracking-tighter mb-2">Drafts</h1>
            <p className="text-gray-400 text-sm font-medium">Continue working on your legal documents and advice.</p>
          </div>
        </div>

        <div className="space-y-4">
          {MOCK_DRAFTS.map(draft => (
            <div key={draft.id} className="p-6 bg-white border border-gray-100 rounded-3xl hover:shadow-xl transition-all flex items-center justify-between group">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                  <DocumentDuplicateIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black tracking-tight">{draft.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{draft.type}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-[10px] font-medium text-gray-400">Modified {draft.lastModified.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="flex-1 p-8 overflow-y-auto no-scrollbar bg-[#fafafa] bg-dots">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-black tracking-tighter mb-2">Chat History</h1>
            <div className="flex items-center gap-4">
              <p className="text-gray-400 text-sm font-medium">Review and continue your past legal research sessions.</p>
              {chatHistory.length > 0 && (
                <button 
                  onClick={toggleSelectAll}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/70 transition-colors"
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${selectedHistoryIds.length === chatHistory.length ? 'bg-primary border-primary text-white' : 'border-gray-200 text-transparent'}`}>
                    <CheckCircleIcon className="w-3 h-3" />
                  </div>
                  {selectedHistoryIds.length === chatHistory.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>
          </div>
          {selectedHistoryIds.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl text-xs font-bold hover:bg-red-100 transition-all border border-red-100 shadow-sm active:scale-95"
            >
              <TrashIcon className="w-4 h-4" />
              <span>Delete {selectedHistoryIds.length} Selected</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {chatHistory.length === 0 ? (
            <div className="py-20 text-center bg-white border border-dashed border-gray-200 rounded-[2.5rem]">
              <ClockIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No sessions found</p>
            </div>
          ) : chatHistory.map(h => (
            <div key={h.id} className={`p-6 bg-white border ${selectedHistoryIds.includes(h.id) ? 'border-primary shadow-lg ring-1 ring-primary/20' : 'border-gray-100'} rounded-3xl hover:shadow-xl transition-all flex items-center justify-between group`}>
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setSelectedHistoryIds(prev => prev.includes(h.id) ? prev.filter(id => id !== h.id) : [...prev, h.id])}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedHistoryIds.includes(h.id) ? 'bg-primary border-primary text-white' : 'border-gray-200 text-transparent'}`}
                >
                  <CheckCircleIcon className="w-4 h-4" />
                </button>
                <div onClick={() => handleContinueSession(h.id)} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all cursor-pointer">
                  <ClockIcon className="w-6 h-6" />
                </div>
                <div onClick={() => handleContinueSession(h.id)} className="cursor-pointer">
                  <h3 className="text-lg font-bold text-black tracking-tight">{h.title}</h3>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-1">{h.lastMessage || 'Open session...'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-medium text-gray-400">{new Date(h.timestamp).toLocaleDateString()}</span>
                <button onClick={() => handleDeleteHistory(h.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                  <TrashIcon className="w-5 h-5" />
                </button>
                <ChevronRightIcon className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (subView) {
      case 'Saved prompts': return renderSavedPrompts();
      case 'Persona library': return renderPersonaLibrary();
      case 'Drafts': return renderDrafts();
      case 'History': return renderHistory();
      case 'Active chats':
      default: return renderActiveChats();
    }
  };

  return renderContent();

};

const QuickActionButton = ({ icon, label, description, onClick, color = 'red' }: { icon: React.ReactNode, label: string, description: string, onClick: () => void, color?: 'red' | 'black' | 'blue' | 'green' | 'grey' }) => {
  const colorMap = {
    red: 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white',
    black: 'bg-gray-100 text-black group-hover:bg-black group-hover:text-white',
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
    green: 'bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white',
    grey: 'bg-gray-100 text-gray-600 group-hover:bg-gray-600 group-hover:text-white',
  };

  const cardBgMap = {
    red: 'bg-red-50 border-red-100 hover:border-red-200',
    black: 'bg-gray-100 border-gray-200 hover:border-gray-300',
    blue: 'bg-blue-50 border-blue-100 hover:border-blue-200',
    green: 'bg-green-50 border-green-100 hover:border-green-200',
    grey: 'bg-amber-50 border-amber-100 hover:border-amber-200',
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-start gap-1 px-8 py-6 ${cardBgMap[color]} rounded-3xl text-left hover:shadow-2xl transition-all group relative overflow-hidden`}
    >
      <div className={`p-3 rounded-2xl ${colorMap[color]} transition-all mb-4 shadow-sm`}>
        {icon}
      </div>
      <span className="text-lg font-bold text-black tracking-tighter">{label}</span>
      <span className="text-[10px] font-medium text-gray-400">{description}</span>
    </button>
  );
};


const header_button = ({ icon, tooltip, onClick }: { icon: React.ReactNode, tooltip: string, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all group relative" 
    title={tooltip}
  >
    {icon}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[9px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
      {tooltip}
    </div>
  </button>
);

export default LegalAI;
