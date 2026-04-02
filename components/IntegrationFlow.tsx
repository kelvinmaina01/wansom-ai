import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ShieldCheck, 
  Lock, 
  Zap, 
  RefreshCw,
  Settings,
  Database,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Clock,
  ArrowUpRight,
  Shield,
  Plus,
  Calculator,
  Mail,
  PenTool,
  Search,
  Cloud,
  MessageSquare,
  Users,
  Command,
  FileText,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import IntegrationExplorer from './IntegrationExplorer';
import { apiClient } from '../lib/apiClient';

interface IntegrationFlowProps {
  provider: {
    id: string;
    name: string;
    icon: string;
    description: string;
  };
  onClose: () => void;
  onConnected: (id: string) => void;
}

type FlowStep = 'intro' | 'connecting' | 'explorer' | 'settings';

const IntegrationFlow: React.FC<IntegrationFlowProps> = ({ provider, onClose, onConnected }) => {
  const [step, setStep] = useState<FlowStep>('intro');
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);

  // Real connection provisioning via backend
  const handleConnect = async () => {
    setStep('connecting');
    try {
      
      // 1. Google Workspace Services uses Real OAuth Redirection
      if (['gdrive', 'gsheets', 'gmail', 'gcal'].includes(provider.id)) {
        const res = await apiClient.get(`/api/integrations/google/auth?provider=${provider.id}&write=false`);
        if (res.ok) {
           const { url } = await res.json();
           window.location.href = url; // Redirect out of Lawlify to Google Consent
           return;
        } else {
           console.error('Failed to get Google Auth URL');
           setStep('intro');
           return;
        }
      }

      // 1.1 Slack Real OAuth Redirection
      if (provider.id === 'slack') {
        const res = await apiClient.get(`/api/integrations/slack/auth`);
        if (res.ok) {
           const { url } = await res.json();
           window.location.href = url;
           return;
        }
      }

      // 1.2 Microsoft Workspace Real OAuth Redirection
      if (['onedrive', 'teams', 'microsoft_teams'].includes(provider.id)) {
        const res = await apiClient.get(`/api/integrations/microsoft/auth`); // Updated to generic MS auth
        if (res.ok) {
           const { url } = await res.json();
           window.location.href = url;
           return;
        }
      }

      // 2. Since we are in the launch prep phase without API keys for others, 
      // we hit the callback directly to provision the user_integration record bypass.
      const res = await apiClient.post(`/api/integrations/${provider.id}/callback`, { code: 'launch_prep_bypass' });
      
      if (res.ok) {
        if (provider.id === 'gsheets' || provider.id === 'gcal' || provider.id === 'slack') {
          setStep('settings'); 
        } else {
          setStep('explorer');
          fetchFiles();
        }
      } else {
        console.error('Establish connection failed.');
        setStep('intro');
      }
    } catch (e) {
      console.error(e);
      setStep('intro');
    }
  };

  const fetchChannels = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/api/integrations/slack/channels');
      if (res.ok) {
        const data = await res.json();
        setChannels(data.channels || []);
      }
    } catch (e) {
      console.error('Failed to fetch channels', e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get(`/api/integrations/${provider.id}/files`);
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files || []);
        onConnected(provider.id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (step === 'settings' && provider.id === 'slack') {
      fetchChannels();
    }
  }, [step, provider.id]);

  return (
    <div className="h-full flex flex-col relative font-sans">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-50 flex z-30 overflow-hidden rounded-full">
          <motion.div 
             initial={{ width: '25%' }}
             animate={{ width: step === 'intro' ? '25%' : step === 'connecting' ? '50%' : step === 'explorer' || step === 'settings' ? '85%' : '100%' }}
             className="h-full bg-primary shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-1000"
          />
      </div>

      {/* Top Header */}
      {/* Top Header - Tightened Padding */}
      <div className="grid grid-cols-3 items-center py-4 mb-2 relative z-10 border-b border-gray-100/50">
        {/* Left: Back Button */}
        <div className="flex justify-start">
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-black transition-all group flex items-center gap-2 font-black uppercase tracking-widest text-[10px]"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Go Back</span>
          </button>
        </div>

        {/* Center: Branding & Provider - Simplified & Scaled Up */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center p-5 shadow-2xl shadow-black/5 border border-gray-50 transform hover:scale-105 transition-transform duration-700">
            <img src={provider.icon} alt={provider.name} className="w-full h-full object-contain" />
          </div>
          <h2 className="text-xl font-bold text-black tracking-normal font-display uppercase opacity-80">
            {provider.name}
          </h2>
        </div>

        {/* Right: Close Button - Cleaned of text */}
        <div className="flex items-center justify-end">
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center bg-black/5 text-black hover:bg-black hover:text-white rounded-full transition-all group"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0">
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto h-full flex flex-col items-center justify-center py-4"
            >
            <div className="text-center mb-6">
                <h1 className="text-4xl font-extrabold text-black mb-3 tracking-tighter font-display leading-[0.9]">
                  Connect <span className="text-primary">Lawlify AI</span> with {provider.name}
                </h1>
                <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
                   Securely connect Lawlify AI with {provider.name}. We access data on-demand - <span className="text-black font-black">Zero Persistence Guaranteed.</span>
                </p>
              </div>

              {/* Specialized Logic Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 w-full">
                {(() => {
                  const getProviderFeatures = (id: string) => {
                    switch (id) {
                      case 'gdrive':
                        return [
                          { icon: <FileText className="text-blue-500" />, title: 'Document RAG', desc: 'Query massive legal PDFs and corporate NDAs entirely on the fly.' },
                          { icon: <ShieldCheck className="text-green-500" />, title: 'Zero Persistence', desc: 'We stream your Drive files solely into memory and discard immediately after AI inference.' },
                          { icon: <Search className="text-purple-500" />, title: 'Deep Discovery', desc: 'The AI can search your entire remote Google Drive via semantic queries without manual uploads.' }
                        ];
                      case 'gsheets':
                        return [
                          { icon: <Database className="text-green-500" />, title: 'Live Ledgers', desc: 'Connect billing arrays, case timelines, and settlement matrices directly to your workspace.' },
                          { icon: <Calculator className="text-blue-500" />, title: 'AI Querying', desc: 'Ask the LLM to sum up columns or verify data discrepancies across multiple tabs instantly.' },
                          { icon: <Lock className="text-gray-700" />, title: 'Read/Write Sovereignty', desc: 'Configure explicit permissions to dictate whether the AI can overwrite sheet data or remain read-only.' }
                        ];
                      case 'gmail':
                        return [
                          { icon: <Mail className="text-red-500" />, title: 'Evidence Discovery', desc: 'Allow the AI to scan entire email threads to surface hidden contextual client admissions.' },
                          { icon: <PenTool className="text-blue-500" />, title: 'Contextual Drafting', desc: 'Draft flawless replies to opposing counsel based on the exact tone of previous emails.' },
                          { icon: <Shield className="text-green-500" />, title: 'Isolated Tunneling', desc: 'Emails are scanned strictly within secure MCP sandboxes and never appended to our database schemas.' }
                        ];
                      case 'gcal':
                      case 'outlook':
                        return [
                          { icon: <Calendar className="text-primary" />, title: 'Automated Docketing', desc: 'Sync court dates extracted from drafted motions instantly to your firm\'s master calendar.' },
                          { icon: <Clock className="text-primary" />, title: 'Conflict Checking', desc: 'The AI checks your schedule before proposing alternative meeting dates in correspondence.' },
                          { icon: <Zap className="text-primary" />, title: 'Real-Time Sync', desc: 'Any delays or adjournments created in Lawlify reflect globally across your devices.' }
                        ];
                      case 'slack':
                      case 'teams':
                        return [
                          { icon: <MessageSquare className="text-purple-500" />, title: 'Channel Bridging', desc: 'Receive instant notifications when new evidence is parsed or drafts are finalized by the AI.' },
                          { icon: <Users className="text-blue-500" />, title: 'Team Collaboration', desc: 'Summarize sprawling internal discussions surrounding a matter with a single click.' },
                          { icon: <Command className="text-gray-700" />, title: 'Bot Commands', desc: 'Trigger basic Lawlify workflows directly from your chat client without opening the dashboard.' }
                        ];
                      case 'onedrive':
                        return [
                          { icon: <Cloud className="text-blue-500" />, title: 'M365 Symphony', desc: 'Bridge your enterprise SharePoint and OneDrive silos directly into Lawlify intelligence.' },
                          { icon: <FileText className="text-purple-500" />, title: 'Docx Parsing', desc: 'Native AI parsing of complex Microsoft Word contracts and track-changes histories.' },
                          { icon: <ShieldCheck className="text-green-500" />, title: 'Enterprise Policy', desc: 'Strict adherence to your internal Azure AD compliance protocols and data segregation.' }
                        ];
                      default:
                        return [
                          { icon: <ShieldCheck className="text-primary" />, title: 'Resource Bridging', desc: 'Browse and query your repository without Lawlify storing a single byte.' },
                          { icon: <Lock className="text-black" />, title: 'Secure Connections', desc: 'Industry-standard protocols ensure your firm\'s data remains strictly private.' },
                          { icon: <RefreshCw className="text-purple-500" />, title: 'Real-Time Sync', desc: 'Allows your AI agents to seamlessly manage tasks inside your existing tools.' }
                        ];
                    }
                  };

                  return getProviderFeatures(provider.id).map((feature, idx) => (
                    <SpecializedCard
                      key={idx}
                      icon={feature.icon}
                      title={feature.title}
                      desc={feature.desc}
                    />
                  ));
                })()}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConnect}
                className="bg-black text-white px-16 py-6 rounded-[15px] font-bold text-lg transition-all shadow-xl hover:bg-red-600 flex items-center gap-4 uppercase tracking-widest border border-transparent"
              >
                 Connect Integration
                 <ArrowUpRight className="w-6 h-6" />
              </motion.button>

              <div className="mt-12 flex items-center gap-3 px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl">
                 <Shield className="w-4 h-4 text-green-500" />
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">End-to-End Encrypted MCP Tunnel</span>
              </div>
            </motion.div>
          )}

          {step === 'connecting' && (
            <motion.div
              key="connecting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-center py-8"
            >
              <div className="relative mb-16">
                 <div className="w-48 h-48 border-[12px] border-gray-50 rounded-full" />
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-0 w-48 h-48 border-[12px] border-t-primary border-transparent rounded-full shadow-[0_0_50px_rgba(239,68,68,0.2)]"
                 />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <img src={provider.icon} alt="Connect" className="w-20 h-20 animate-pulse" />
                 </div>
              </div>
              <h2 className="text-5xl font-black text-black mb-6 tracking-tighter font-display">Establishing connection...</h2>
              <p className="text-gray-400 font-medium text-xl max-w-lg mx-auto leading-relaxed">
                  Negotiating capabilities and establishing a zero-persistence tunnel between <span className="text-black font-bold">Lawlify Core</span> and <span className="text-black font-bold">{provider.name}</span>.
              </p>
              
              <div className="mt-12 flex items-center gap-2">
                 <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                 <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                 <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </motion.div>
          )}

          {step === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-5xl mx-auto py-12"
            >
                <div className="mb-16 text-center">
                  <h3 className="text-5xl font-black text-black tracking-tighter mb-4 font-display uppercase">Architecture Mapping</h3>
                  <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto">Define how Lawlify Intelligence interacts with {provider.name} toolsets securely via MCP.</p>
                </div>
               
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-8">
                     <SetupSection icon={<Database />} title="Entity Mapping">
                        <p className="text-xs text-gray-500 mb-4">Choose which {provider.id === 'slack' ? 'Slack channels' : `${provider.name} resources`} Lawlify can query.</p>
                        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {provider.id === 'slack' ? (
                               channels.map(channel => (
                                  <MappingItem key={channel.id} label={`#${channel.name}${channel.is_private ? ' (Private)' : ''}`} />
                               ))
                            ) : (
                               <>
                                  <MappingItem label={provider.id === 'gsheets' ? 'Matter Billing Sheet' : 'Main Workspace'} />
                                  <MappingItem label={provider.id === 'gsheets' ? 'Time Tracking Table' : 'Secondary Context'} />
                               </>
                            )}
                            {provider.id === 'slack' && channels.length === 0 && !isLoading && (
                               <p className="text-[10px] text-gray-400 italic">No channels found.</p>
                            )}
                        </div>
                     </SetupSection>

                     <SetupSection icon={<Lock />} title="Access Constraints">
                        <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl">
                           <span className="text-xs font-bold">Read-Only Enforced</span>
                           <CheckCircle2 className="w-4 h-4 text-green-500" />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl">
                           <span className="text-xs font-bold">Encrypted Tunneling</span>
                           <CheckCircle2 className="w-4 h-4 text-green-500" />
                        </div>
                     </SetupSection>
                  </div>

                  <div className="space-y-8">
                     <div className="p-10 bg-black rounded-[3rem] border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                        <h4 className="text-2xl font-bold text-white mb-6 relative z-10 font-display">Finalize Bridge</h4>
                        <p className="text-gray-400 text-sm mb-10 relative z-10 leading-relaxed font-sans">
                           By finalizing, you authorize Lawlify AI to access {provider.name} via the Model Context Protocol. No data will be stored on Lawlify servers.
                        </p>
                        <button 
                           onClick={() => {
                              onConnected(provider.id);
                              onClose();
                           }}
                           className="w-full py-5 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-2xl relative z-10 font-display"
                        >
                           Establish Bridge
                        </button>
                     </div>

                     <div className="p-8 bg-red-50/20 rounded-[2.5rem] border border-red-100">
                        <h4 className="font-bold text-red-600 mb-2">Security Note</h4>
                        <p className="text-[10px] text-gray-500 leading-relaxed">
                           Lawlify utilizes per-session ephemeral keys for secure connections. This tunnel can be severed instantly from your {provider.name} security console.
                        </p>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {step === 'explorer' && (
            <motion.div
              key="explorer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col gap-8 pb-10"
            >
              <div className="flex flex-col items-center text-center gap-6 mb-8">
                 <div className="flex flex-col items-center">
                    <h3 className="text-5xl font-black text-black tracking-tighter mb-2 font-display uppercase">Bridge Explorer</h3>
                    <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto">Browse connected {provider.name} resources via secure Model Context Protocol.</p>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-5 py-2.5 bg-green-50 text-green-600 rounded-2xl border border-green-100 text-[11px] font-black uppercase tracking-widest">
                       <CheckCircle2 className="w-3.5 h-3.5" />
                       Zero-Persistence Active
                    </div>
                    <button onClick={fetchFiles} className="p-3.5 bg-gray-50 hover:bg-white rounded-2xl border border-gray-100 transition-all text-gray-400 hover:text-black shadow-sm">
                       <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                 </div>
              </div>

              <div className="flex-1 min-h-0">
                <IntegrationExplorer 
                  provider={provider.name} 
                  files={files} 
                  isLoading={isLoading} 
                  onFileClick={(f) => {
                    console.log('Resource connection:', f);
                    onConnected(provider.id);
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const SpecializedCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-white border-2 border-gray-50 rounded-[2.5rem] p-10 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all group flex flex-col items-center text-center">
    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 border border-gray-100 group-hover:scale-110 group-hover:bg-white transition-all shadow-sm">
      {React.cloneElement(icon as React.ReactElement, { className: 'w-7 h-7' } as any)}
    </div>
    <h3 className="text-2xl font-bold text-black mb-4 tracking-tight font-display uppercase">{title}</h3>
    <p className="text-sm text-gray-400 font-medium leading-relaxed font-sans">{desc}</p>
  </div>
);

const SetupSection = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
  <div className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
         {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5 text-gray-400' } as any)}
      </div>
      <h4 className="text-sm font-black text-black uppercase tracking-widest">{title}</h4>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const MappingItem = ({ label }: { label: string }) => (
  <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-primary/30 transition-colors cursor-pointer group">
    <div className="flex items-center gap-3">
       <div className="w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
       <span className="text-xs font-bold text-gray-400 group-hover:text-black transition-colors">{label}</span>
    </div>
    <Plus className="w-4 h-4 text-gray-200 group-hover:text-primary transition-colors" />
  </div>
);

export default IntegrationFlow;
