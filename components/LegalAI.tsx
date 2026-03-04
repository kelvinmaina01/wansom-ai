
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LegalInput from './LegalInput';
import LegalResponse from './LegalResponse';
import { 
  LegalMessage, 
  WorkspaceType, 
  LegalSpecialist, 
  SavedPrompt, 
  Persona, 
  Draft, 
  ChatHistory 
} from '../types';
import { askLegalAssistant, askLegalAssistantStream } from '../services/geminiService';
import { MOCK_LEGAL_RESPONSES } from '../services/mockLegalData';
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
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

interface LegalAIProps {
  userEmail: string;
  activeSpecialist?: LegalSpecialist | null;
  subView?: string;
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

const LegalAI: React.FC<LegalAIProps> = ({ userEmail, activeSpecialist, subView = 'Active chats' }) => {
  const [messages, setMessages] = useState<LegalMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

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

    const lowerContent = content.toLowerCase();
    
    const assistantId = (Date.now() + 1).toString();
    const assistantMsg: LegalMessage = {
      id: assistantId,
      role: 'assistant',
      content: "",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMsg]);

    try {
      if (lowerContent.includes("land") || lowerContent.includes("conveyancing")) {
        const mockData = MOCK_LEGAL_RESPONSES.conveyancing;
        let currentText = "";
        const words = (mockData.content || "").split(" ");
        for (let i = 0; i < words.length; i++) {
          currentText += words[i] + " ";
          setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: currentText, sources: mockData.sources, citations: mockData.citations } : m));
          await new Promise(r => setTimeout(r, 30));
        }
        setIsLoading(false);
      } else if (lowerContent.includes("case") || lowerContent.includes("brief") || lowerContent.includes("muruatetu")) {
        const mockData = MOCK_LEGAL_RESPONSES.case_explanation;
        let currentText = "";
        const words = (mockData.content || "").split(" ");
        for (let i = 0; i < words.length; i++) {
          currentText += words[i] + " ";
          setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: currentText, sources: mockData.sources, citations: mockData.citations } : m));
          await new Promise(r => setTimeout(r, 30));
        }
        setIsLoading(false);
      } else {
        await askLegalAssistantStream(content, (fullText) => {
          setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: fullText } : m));
          setIsLoading(false);
        }, activeSpecialist?.instructions);
      }
    } catch (error) {
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: "Error connecting to legal database. Please try again." } : m));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const renderActiveChats = () => (
    <div className="flex-1 flex flex-col overflow-hidden relative bg-[#fafafa]/80 backdrop-blur-xl bg-dots no-scrollbar">
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-12 no-scrollbar">
        {messages.length === 0 ? (
          <div className="min-h-full flex flex-col items-center justify-center space-y-12 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-12">
                 <div className="relative">
                    <motion.div 
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-primary/30 blur-3xl rounded-full"
                    />
                    <motion.div 
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-32 h-32 bg-gradient-to-br from-primary via-red-500 to-primary/80 rounded-full shadow-2xl shadow-primary/40 relative z-10 flex items-center justify-center"
                    >
                      <ScaleIcon className="w-12 h-12 text-white" />
                    </motion.div>
                 </div>
              </div>
              <h2 className="text-sm font-bold text-primary mb-2 tracking-[0.3em] uppercase opacity-90">HELLO {firstName}</h2>
              {activeSpecialist && (
                <div className="mb-4"></div>
              )}
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-black tracking-tight leading-tight mb-8 max-w-none mx-auto whitespace-nowrap">
                {activeSpecialist ? <span>Let the <span className="text-red-500">{activeSpecialist.name}</span> assist you</span> : 'What are you working on today?'}
              </h1>
            </div>

            <div className="w-full max-w-5xl px-4">
              <LegalInput onSendMessage={handleSendMessage} isLoading={isLoading} variant="initial" activeSpecialistName={activeSpecialist?.name} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-6xl px-4">
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
            </div>
          </div>
        ) : (
          <div className="max-w-[1400px] mx-auto space-y-4 pb-40">
            {messages.map((m) => (
              <LegalResponse key={m.id} message={m} />
            ))}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {messages.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/40 to-transparent pointer-events-none">
           <div className="max-w-[1400px] mx-auto pointer-events-auto">
              <LegalInput onSendMessage={handleSendMessage} isLoading={isLoading} variant="compact" activeSpecialistName={activeSpecialist?.name} />
           </div>
        </div>
      )}

      {isLoading && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-white/90 text-black px-6 py-4 rounded-2xl shadow-2xl border border-gray-100 flex items-center gap-6 backdrop-blur-xl">
            <div className="flex space-x-1.5">
              <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2.5 h-2.5 bg-secondary-blue rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2.5 h-2.5 bg-secondary-green rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-tight uppercase text-black">Lawlify Intelligence</span>
              <span className="text-[8px] font-medium text-gray-500 uppercase tracking-widest">Analyzing Kenyan Statutes...</span>
            </div>
          </div>
        </div>
      )}
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
          <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl text-xs font-bold hover:bg-gray-800 transition-all shadow-xl shadow-black/10">
            <PlusIcon className="w-4 h-4" />
            <span>Create Prompt</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PROMPTS.map(prompt => (
            <div key={prompt.id} className="p-6 bg-white border border-gray-100 rounded-3xl hover:shadow-2xl transition-all group relative overflow-hidden">
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
                  className="p-2 bg-gray-50 text-black rounded-xl hover:bg-primary hover:text-white transition-all"
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
          <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl text-xs font-bold hover:bg-gray-800 transition-all shadow-xl shadow-black/10">
            <PlusIcon className="w-4 h-4" />
            <span>New Persona</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_PERSONAS.map(persona => (
            <div key={persona.id} className="p-8 bg-white border border-gray-100 rounded-[2.5rem] hover:shadow-2xl transition-all group relative overflow-hidden">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                <UserGroupIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-1 tracking-tight">{persona.name}</h3>
              <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-4">{persona.role}</p>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">{persona.description}</p>
              <button className="w-full py-3 bg-gray-50 text-black rounded-2xl text-xs font-bold hover:bg-black hover:text-white transition-all">
                Activate Persona
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
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-black transition-colors">
                  <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <TrashIcon className="w-5 h-5" />
                </button>
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
            <p className="text-gray-400 text-sm font-medium">Review and continue your past legal research sessions.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {MOCK_HISTORY.map(history => (
            <div key={history.id} className="p-6 bg-white border border-gray-100 rounded-3xl hover:shadow-xl transition-all flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                  <ClockIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black tracking-tight">{history.title}</h3>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-1">{history.lastMessage}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-medium text-gray-400">{history.timestamp.toLocaleDateString()}</span>
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
      case 'Saved prompts':
        return renderSavedPrompts();
      case 'Persona library':
        return renderPersonaLibrary();
      case 'Drafts':
        return renderDrafts();
      case 'History':
        return renderHistory();
      case 'Active chats':
      default:
        return renderActiveChats();
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

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);

export default LegalAI;
