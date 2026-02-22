
import React, { useState, useEffect, useRef } from 'react';
import LegalInput from './LegalInput';
import LegalResponse from './LegalResponse';
import { LegalMessage, WorkspaceType } from '../types';
import { askLegalAssistant } from '../services/geminiService';
import { MOCK_LEGAL_RESPONSES } from '../services/mockLegalData';
import { 
  DocumentTextIcon, 
  ScaleIcon, 
  BoltIcon 
} from '@heroicons/react/24/outline';

const LegalAI: React.FC = () => {
  const [messages, setMessages] = useState<LegalMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

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
    let responseData: Partial<LegalMessage>;

    if (lowerContent.includes("land") || lowerContent.includes("conveyancing")) {
      responseData = MOCK_LEGAL_RESPONSES.conveyancing;
    } else if (lowerContent.includes("case") || lowerContent.includes("brief") || lowerContent.includes("muruatetu")) {
      responseData = MOCK_LEGAL_RESPONSES.case_explanation;
    } else {
      const result = await askLegalAssistant(content);
      responseData = {
        content: result.text,
        sources: result.sources
      };
    }

    setTimeout(() => {
      const assistantMsg: LegalMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseData.content || "Processing query...",
        timestamp: new Date(),
        sources: responseData.sources,
        citations: responseData.citations
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsLoading(false);
    }, 1200);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative bg-white bg-dots">
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-12">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center space-y-16 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-12">
                 <div className="relative">
                    <div className="absolute -inset-8 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
                    <div className="relative w-28 h-28 bg-black shadow-2xl rounded-[2rem] flex items-center justify-center border border-white/10">
                      <ScaleIcon className="w-14 h-14 text-primary" />
                    </div>
                 </div>
              </div>
              <h2 className="text-3xl font-light text-gray-400 mb-4">Council, good morning.</h2>
              <h1 className="text-6xl font-black text-black tracking-tighter leading-none mb-8">
                How can <span className="text-primary underline decoration-black/10 underline-offset-8">Lawlify</span> assist your practice?
              </h1>
            </div>

            <div className="w-full max-w-4xl">
              <LegalInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
              <QuickActionButton 
                icon={<DocumentTextIcon className="w-6 h-6" />} 
                label="Conveyancing Guide" 
                description="Land Registration Act 2012"
                onClick={() => handleSendMessage("Explain the conveyancing requirements under the Kenyan Land Registration Act.")}
              />
              <QuickActionButton 
                icon={<ScaleIcon className="w-6 h-6" />} 
                label="Explain Muruatetu" 
                description="Supreme Court landmark ruling"
                onClick={() => handleSendMessage("Explain the Muruatetu case to me and its impact on Kenyan law.")}
              />
              <QuickActionButton 
                icon={<BoltIcon className="w-6 h-6" />} 
                label="Employment Act" 
                description="Lawful termination process"
                onClick={() => handleSendMessage("Summarize the lawful termination process in Kenya.")}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-4 pb-48">
            {messages.map((m) => (
              <LegalResponse key={m.id} message={m} />
            ))}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {messages.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none">
           <div className="max-w-5xl mx-auto pointer-events-auto">
              <LegalInput onSendMessage={handleSendMessage} isLoading={isLoading} />
           </div>
        </div>
      )}

      {isLoading && (
        <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-black text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-6">
            <div className="flex space-x-1.5">
              <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Lawlify Intelligence is analyzing Kenyan Statutes...</span>
          </div>
        </div>
      )}
    </div>
  );
};

const QuickActionButton = ({ icon, label, description, onClick }: { icon: React.ReactNode, label: string, description: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-start gap-1 px-8 py-6 bg-white border border-gray-100 rounded-3xl text-left hover:shadow-2xl hover:border-primary/20 transition-all group relative overflow-hidden"
  >
    <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all mb-4 shadow-inner">
      {icon}
    </div>
    <span className="text-lg font-bold text-black tracking-tight">{label}</span>
    <span className="text-xs font-medium text-gray-400">{description}</span>
  </button>
);

export default LegalAI;
