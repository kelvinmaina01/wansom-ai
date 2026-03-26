import React, { useState, useEffect } from 'react';
import {
  Check,
  Plus,
  ChevronLeft,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Zap,
  Globe,
  Lock,
  Search,
  MessageSquare,
  Clock,
  Shield,
  Puzzle,
  LayoutGrid,
  ArrowUpRight,
  AlertTriangle,
  Trash2,
  Download,
  Link,
  Star,
  UserPlus,
  Users,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ConnectorRequestForm from './ConnectorRequestForm';
import IntegrationFlow from './IntegrationFlow';
import { apiClient } from '../lib/apiClient';

interface IntegrationItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  metric: string;
  metricType: 'sync' | 'security' | 'active' | 'search';
}

interface IntegrationCategory {
  title: string;
  items: IntegrationItem[];
}

interface IntegrationsProps {
  connectedIds: Set<string>;
  onToggle: (id: string) => void;
  workspaceId?: string;
}

const INTEGRATION_CATEGORIES: IntegrationCategory[] = [
  {
    title: 'Document Management',
    items: [
      {
        id: 'gdrive',
        name: 'Google Drive',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg',
        description: 'Connect your Drive context for AI-powered legal research across your docs.',
        metric: 'Live Link',
        metricType: 'sync'
      },
      {
        id: 'gsheets',
        name: 'Google Sheets',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg',
        description: 'Collaborate on legal schedules and track case metrics via live spreadsheet data.',
        metric: 'Sheet Sync',
        metricType: 'sync'
      },
      {
        id: 'onedrive',
        name: 'OneDrive',
        icon: '/integrations/onedrive.png',
        description: 'Access M365 cloud context directly within your legal workflows.',
        metric: 'Enterprise Link',
        metricType: 'sync'
      },
    ]
  },
  {
    title: 'Communication',
    items: [
      {
        id: 'slack',
        name: 'Slack',
        icon: '/integrations/slack.png',
        description: 'Sync case discussions and receive matter alerts in your Slack channels.',
        metric: 'Chat Bridge',
        metricType: 'active'
      },
      {
        id: 'gmail',
        name: 'Gmail',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg',
        description: 'Securely link client correspondence to active legal matters.',
        metric: 'Secure Link',
        metricType: 'security'
      },
      {
        id: 'teams',
        name: 'Microsoft Teams',
        icon: 'https://i.ibb.co/TqhfJhvT/microsoft-teams-6971301-1280.webp',
        description: 'Bridge Teams meetings and file context with Lawlify workspace.',
        metric: 'Live Bridge',
        metricType: 'active'
      },
    ]
  },
  {
    title: 'Calendar & Scheduling',
    items: [
      {
        id: 'gcal',
        name: 'Google Calendar',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg',
        description: 'Automatically link court dates and client deadlines to your agenda.',
        metric: 'Deadline Sync',
        metricType: 'active'
      },
      {
        id: 'outlook',
        name: 'Outlook Calendar',
        icon: '/integrations/outlook.png',
        description: 'Centralize firm-wide hearings and advocate meetings.',
        metric: 'Firm Sync',
        metricType: 'sync'
      },
    ]
  }
];

const Integrations: React.FC<IntegrationsProps> = ({ connectedIds, onToggle, workspaceId }) => {
  const [logoErrors, setLogoErrors] = useState<Set<string>>(new Set());
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [activeIntegration, setActiveIntegration] = useState<IntegrationItem | null>(null);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);
  
  // Sovereignty State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loadingSovereignty, setLoadingSovereignty] = useState(false);

  useEffect(() => {
    // 1. Check for OAuth callback tokens in the URL
    const searchParams = new URLSearchParams(window.location.search);
    const providerParam = searchParams.get('provider');
    const access_token = searchParams.get('access_token');
    const refresh_token = searchParams.get('refresh_token');

    if (providerParam && access_token) {
      // 2. We just returned from a successful OAuth flow.
      // Save it properly via POST /callback
      apiClient.post(`/api/integrations/${providerParam}/callback`, { 
        access_token, 
        refresh_token,
        code: 'oauth_success' 
      }).then((res) => {
        if (res.ok) {
          // 3. Clean up the URL securely so tokens don't sit in the address bar
          window.history.replaceState({}, document.title, window.location.pathname);
          // 4. Force a refresh in the parent state so 'connectedIds' updates instantly
          onToggle(providerParam);
        }
      });
    }
  }, [onToggle]);

  const fetchMembers = async () => {
    if (!workspaceId) return;
    setLoadingSovereignty(true);
    try {
      const res = await apiClient.get(`/api/workspaces/${workspaceId}/members`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
      }
    } catch (e) {
      console.error('Error fetching members:', e);
    } finally {
      setLoadingSovereignty(false);
    }
  };

  const generateInviteLink = async () => {
    if (!workspaceId) return;
    setLoadingSovereignty(true);
    try {
      const res = await apiClient.post(`/api/workspaces/${workspaceId}/invite`, {
        role: 'viewer'
      });
      if (res.ok) {
        const data = await res.json();
        setInviteToken(data.inviteLink);
        setIsInviteModalOpen(true);
      }
    } catch (e) {
      console.error('Error generating invite:', e);
    } finally {
      setLoadingSovereignty(false);
    }
  };

  const updateMemberRole = async (memberId: string, newRole: string) => {
    try {
       const res = await apiClient.patch(`/api/workspaces/members/${memberId}`, { role: newRole });
       if (res.ok) fetchMembers();
    } catch (e) {
       console.error('Failed to update role', e);
    }
  };

  const removeMember = async (memberId: string) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    try {
       const res = await apiClient.fetch(`/api/workspaces/members/${memberId}`, { method: 'DELETE' });
       if (res.ok) fetchMembers();
    } catch (e) {
       console.error('Failed to remove member', e);
    }
  };

  const toggleConnection = async (item: IntegrationItem) => {
    if (connectedIds.has(item.id)) {
      // Handle Disconnect
      try {
        setDisconnectingId(item.id);
        const res = await apiClient.fetch(`/api/integrations/${item.id}`, { method: 'DELETE' });
        if (res.ok) {
          onToggle(item.id); // This will refresh the connection list in App.tsx
        }
      } catch (e) {
        console.error('Failed to disconnect', e);
      } finally {
        setDisconnectingId(null);
      }
    } else {
      setActiveIntegration(item);
    }
  };

  const handleLogoError = (id: string) => {
    setLogoErrors(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const getMetricStyles = (type: string) => {
    return 'text-white bg-red-600 border-red-600 shadow-sm shadow-red-600/20';
  };

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'sync': return <RefreshCw className="w-3 h-3" />;
      case 'security': return <Lock className="w-3 h-3" />;
      case 'active': return <Zap className="w-3 h-3" />;
      case 'search': return <Search className="w-3 h-3" />;
      default: return <Globe className="w-3 h-3" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white bg-dots p-6 md:p-12 font-sans w-full">
      <div className="max-w-7xl mx-auto flex flex-col pb-20">
        <AnimatePresence mode="wait">
          {!activeIntegration ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-12"
            >
              <div className="mb-4">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-5xl font-extrabold text-black tracking-tighter mb-4 font-display"
                >
                  Integrations
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-400 text-lg font-medium max-w-2xl"
                >
                  Connect your favorite <span className="text-primary">legal and productivity tools</span> via secure MCP bridges for real-time intelligence on-demand.
                </motion.p>
              </div>

              {/* Categories Grid */}
              <div className="space-y-20">
                {INTEGRATION_CATEGORIES.map((category, catIdx) => (
                  <div key={category.title}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: catIdx * 0.1 }}
                      className="flex items-center gap-4 mb-8"
                    >
                      <h2 className="text-sm font-black text-black uppercase tracking-[0.3em] font-display">{category.title}</h2>
                      <div className="h-px bg-gray-100 flex-1" />
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {category.items.map((item, itemIdx) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: (catIdx * 0.1) + (itemIdx * 0.05) }}
                          className="bg-white border-2 border-gray-50 rounded-[2rem] p-6 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all group relative overflow-hidden flex flex-col justify-between"
                        >
                          <div className="relative z-10">
                            <div className="flex items-start justify-between mb-6">
                              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-3 shadow-xl shadow-black/5 border border-gray-50 group-hover:scale-105 transition-transform duration-500">
                                {!logoErrors.has(item.id) ? (
                                  <img
                                    src={item.icon}
                                    alt={item.name}
                                    className="w-full h-full object-contain"
                                    onError={() => handleLogoError(item.id)}
                                  />
                                ) : (
                                  <div className={`w-full h-full rounded-2xl flex items-center justify-center text-white font-black text-2xl font-display ${
                                    item.metricType === 'sync' ? 'bg-blue-500' :
                                    item.metricType === 'security' ? 'bg-red-500' :
                                    item.metricType === 'active' ? 'bg-green-500' :
                                    'bg-purple-500'
                                  }`}>
                                    {item.name.charAt(0)}
                                  </div>
                                )}
                              </div>

                              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider font-sans ${getMetricStyles(item.metricType)}`}>
                                {getMetricIcon(item.metricType)}
                                {item.metric}
                              </div>
                            </div>

                            <div className="mb-6">
                              <h3 className="text-2xl font-bold text-black mb-2 tracking-tight font-display">{item.name}</h3>
                              <p className="text-sm text-gray-500 font-medium leading-relaxed font-sans">{item.description}</p>
                            </div>
                          </div>

                          <div className="relative z-10">
                            <button
                              onClick={() => toggleConnection(item)}
                              disabled={disconnectingId === item.id}
                              className={`w-full py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all font-display ${connectedIds.has(item.id)
                                  ? 'bg-gray-50 text-black border-2 border-gray-100 hover:bg-white hover:border-primary/20'
                                  : 'bg-black text-white hover:bg-primary shadow-xl shadow-black/10 active:scale-95'
                                }`}
                            >
                              {disconnectingId === item.id ? (
                                <span className="flex items-center justify-center gap-2">
                                  <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
                                  Disconnecting...
                                </span>
                              ) : connectedIds.has(item.id) ? (
                                <span className="flex items-center justify-center gap-2 group-hover/btn:hidden">
                                  <Check className="w-5 h-5 text-primary" />
                                  Manage MCP Bridge
                                </span>
                              ) : (
                                'Initiate Handshake'
                              )}
                            </button>
                          </div>

                          {/* Decorative Background Element */}
                          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Data Management & Collaboration section */}
              <div className="mt-32 p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div>
                    <h3 className="text-sm font-bold text-black mb-1 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-gray-500" />
                      Intelligence Sovereignty
                    </h3>
                    <p className="text-xs text-gray-400 font-medium">Manage your zero-persistence data handshakes and team access.</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <button 
                      onClick={() => alert('Audit logs are generated in real-time. Contact your system admin for the full export.')}
                      className="px-5 py-2.5 bg-[#fcfbf9] border border-gray-200 rounded-xl text-xs font-bold hover:bg-white transition-all shadow-sm flex items-center gap-2 text-gray-700"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Audit Log
                    </button>
                    <button 
                      onClick={generateInviteLink}
                      disabled={loadingSovereignty}
                      className="px-5 py-2.5 bg-[#fcfbf9] border border-gray-200 rounded-xl text-xs font-bold hover:bg-white transition-all shadow-sm flex items-center gap-2 text-gray-700 disabled:opacity-50"
                    >
                      <Link className="w-3.5 h-3.5" />
                      {loadingSovereignty ? 'Generating...' : 'Invite link'}
                    </button>
                    <button 
                      onClick={() => { setIsMembersModalOpen(true); fetchMembers(); }}
                      className="px-6 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-md flex items-center gap-2 active:scale-95"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Manage Members
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-20">
                <div className="max-w-7xl mx-auto bg-[#0a0a0a] rounded-[15px] p-8 lg:p-12 relative overflow-hidden shadow-2xl border border-white/5">
                  {/* Background embellishments */}
                  <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left Column: Request Connector */}
                    <div className="flex flex-col gap-6 text-center lg:text-left">
                      <div>
                        <h2 className="text-4xl font-bold text-white mb-6 tracking-tight font-display">Need a custom MCP connector?</h2>
                        <p className="text-gray-400 text-lg font-medium leading-relaxed">
                          Our engineering team specializes in building deep, custom MCP bridges between Lawlify and your legacy on-premise systems. Fully auditable and secure.
                        </p>
                      </div>
                      <div>
                        <motion.button 
                          whileHover={{ scale: 1.05, backgroundColor: '#f9fafb' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsRequestFormOpen(true)}
                          className="bg-white text-black px-12 py-5 rounded-[15px] font-bold transition-all shadow-xl shadow-white/5 whitespace-nowrap uppercase tracking-[0.2em] text-[11px] border border-gray-100 w-full md:w-auto"
                        >
                          Request New Connector
                        </motion.button>
                      </div>
                    </div>

                    {/* Right Column: Compliance Badges */}
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-12 lg:border-l border-white/10 lg:pl-16">
                      <div className="flex items-center gap-6 group">
                        <div className="w-24 h-24 shrink-0 bg-gradient-to-br from-white/10 to-transparent rounded-full flex flex-col items-center justify-center border-2 border-yellow-500/30 group-hover:border-yellow-500 group-hover:shadow-[0_0_40px_rgba(234,179,8,0.2)] group-hover:scale-[1.02] transition-all duration-500 relative">
                          <div className="absolute inset-1 border border-dashed border-yellow-500/30 rounded-full animate-[spin_40s_linear_infinite]" />
                          <div className="absolute inset-0 flex flex-col items-center justify-between py-2">
                            <div className="flex gap-1.5 opacity-80">
                              <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500 -rotate-12" />
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500 rotate-12" />
                            </div>
                            <div className="flex gap-1 opacity-60">
                              <Star className="w-2 h-2 text-yellow-500 fill-yellow-500" />
                              <Star className="w-2 h-2 text-yellow-500 fill-yellow-500" />
                            </div>
                          </div>
                          <span className="text-white text-lg font-black leading-tight relative z-10">SOC 2</span>
                          <span className="text-yellow-500 text-[9px] font-black uppercase tracking-[0.2em] relative z-10 mt-0.5">Type II</span>
                        </div>
                        <div className="flex flex-col max-w-[120px] text-left">
                          <span className="text-white font-bold text-lg mb-1">SOC 2 Type II</span>
                          <span className="text-xs text-gray-400 font-medium uppercase tracking-widest leading-relaxed">Audited controls protect every case</span>
                        </div>
                      </div>

                      <div className="w-px h-16 bg-white/10 hidden sm:block" />

                      <div className="flex items-center gap-6 group">
                        <div className="w-24 h-24 shrink-0 bg-gradient-to-br from-white/10 to-transparent rounded-full flex flex-col items-center justify-center border-2 border-blue-500/30 group-hover:border-blue-500 group-hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] group-hover:scale-[1.02] transition-all duration-500 relative">
                          <div className="absolute inset-1 border border-dashed border-blue-500/30 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
                          <div className="absolute inset-0 flex flex-col items-center justify-between py-2">
                            <div className="flex gap-1.5 opacity-80">
                              <Star className="w-2.5 h-2.5 text-blue-400 fill-blue-400 -rotate-12" />
                              <Star className="w-3 h-3 text-blue-400 fill-blue-400" />
                              <Star className="w-2.5 h-2.5 text-blue-400 fill-blue-400 rotate-12" />
                            </div>
                            <div className="flex gap-1 opacity-60">
                              <Star className="w-2 h-2 text-blue-400 fill-blue-400" />
                              <Star className="w-2 h-2 text-blue-400 fill-blue-400" />
                            </div>
                          </div>
                          <span className="text-white text-lg font-black leading-tight relative z-10">GDPR</span>
                          <span className="text-blue-400 text-[8px] font-black uppercase tracking-[0.2em] relative z-10 mt-0.5">Compliant</span>
                        </div>
                        <div className="flex flex-col max-w-[120px] text-left">
                          <span className="text-white font-bold text-lg mb-1">GDPR</span>
                          <span className="text-xs text-gray-400 font-medium uppercase tracking-widest leading-relaxed">Your data, always your property</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          ) : (
            <motion.div
              key="flow"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <IntegrationFlow 
                provider={activeIntegration}
                onClose={() => setActiveIntegration(null)}
                onConnected={(id) => onToggle(id)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

        <AnimatePresence>
          {isRequestFormOpen && (
            <ConnectorRequestForm 
              onClose={() => setIsRequestFormOpen(false)} 
              userEmail={""} 
            />
          )}

          {/* Invite Modal */}
          {isInviteModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative"
              >
                <button 
                  onClick={() => setIsInviteModalOpen(false)}
                  className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                      <Link className="w-8 h-8 text-primary" />
                   </div>
                   <h3 className="text-2xl font-bold text-black mb-2">Workspace Invite Link</h3>
                   <p className="text-gray-500 mb-8">Share this link with your team. Only workspace owners can approve entry requests.</p>

                   <div className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-3 mb-8 overflow-hidden">
                      <span className="text-xs font-mono text-gray-400 truncate flex-1">{inviteToken}</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(inviteToken || '');
                          alert('Copied to clipboard!');
                        }}
                        className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                         <Download className="w-4 h-4" />
                      </button>
                   </div>

                   <button 
                     onClick={() => setIsInviteModalOpen(false)}
                     className="w-full py-4 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-primary transition-all"
                   >
                     Done
                   </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Members Management Modal -> Full Page Experience */}
          {isMembersModalOpen && (
            <div className="fixed inset-0 z-[100] bg-white flex flex-col">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="flex-1 flex flex-col h-full"
              >
                {/* Full Page Header */}
                <div className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 px-8 py-6">
                  <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <button 
                        onClick={() => setIsMembersModalOpen(false)}
                        className="p-3 bg-gray-50 hover:bg-black hover:text-white rounded-2xl transition-all group border border-gray-100"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-3xl font-black text-black tracking-tighter uppercase font-display">Workspace Intelligence</h3>
                          <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">Owner Control</span>
                        </div>
                        <p className="text-gray-400 font-medium text-sm">Manage team seats, resource mapping, and security roles.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                       <button 
                         onClick={() => { setIsMembersModalOpen(false); setIsInviteModalOpen(true); }}
                         className="px-6 py-3 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center gap-2"
                       >
                         <UserPlus className="w-4 h-4" />
                         Invite Team
                       </button>
                    </div>
                  </div>
                </div>
                
                {/* Content Area - Flattened Layout (Items sit on page, not a card) */}
                <div className="flex-1 overflow-y-auto bg-white/50">
                  <div className="max-w-5xl mx-auto py-16 px-8">
                    
                    {/* Header for Items */}
                    <div className="flex items-center justify-between mb-8 px-4">
                       <h4 className="text-xs font-black text-black uppercase tracking-widest flex items-center gap-3">
                          <Users className="w-4 h-4 text-primary" />
                          Active Team Members
                       </h4>
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{members.length} seats occupied</span>
                    </div>

                    {/* Member Items List (Sitting on page) */}
                    <div className="space-y-4">
                      {members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-8 bg-white border border-gray-100 rounded-[2rem] hover:border-primary/20 hover:shadow-xl hover:shadow-black/5 transition-all group">
                          <div className="flex items-center gap-6">
                             <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/5">
                                {member.profile.profile_avatar_url ? (
                                  <img src={member.profile.profile_avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-primary text-xl font-black">{member.profile.profile_name.charAt(0)}</span>
                                )}
                             </div>
                             <div>
                                <h4 className="text-xl font-bold text-black mb-1">{member.profile.profile_name}</h4>
                                <p className="text-sm text-gray-400 font-medium">{member.profile.profile_email}</p>
                             </div>
                          </div>

                          <div className="flex items-center gap-8">
                             <div className="flex flex-col items-end gap-1">
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Security Role</span>
                                <select 
                                  value={member.role}
                                  onChange={(e) => updateMemberRole(member.id, e.target.value)}
                                  className="bg-white border-2 border-gray-100 rounded-xl text-xs font-bold py-2 px-4 focus:outline-none focus:border-primary transition-colors cursor-pointer"
                                >
                                  <option value="admin">Admin</option>
                                  <option value="editor">Editor</option>
                                  <option value="viewer">Viewer</option>
                                </select>
                             </div>
                             
                             <button 
                               onClick={() => removeMember(member.id)}
                               className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-300 hover:bg-red-50 hover:text-primary rounded-xl transition-all"
                               title="Revoke Access"
                             >
                                <Trash2 className="w-5 h-5" />
                             </button>
                          </div>
                        </div>
                      ))}
                      
                      {members.length === 0 && (
                         <div className="py-32 text-center flex flex-col items-center border-2 border-dashed border-gray-100 rounded-[3rem]">
                            <div className="w-20 h-20 bg-gray-100/50 rounded-full flex items-center justify-center mb-6">
                               <Users className="w-10 h-10 text-gray-200" />
                            </div>
                            <p className="text-gray-400 font-medium italic mb-2">Your intelligence workspace is currently isolated.</p>
                            <p className="text-xs text-gray-300 font-medium max-w-xs mb-8">Nobody else has access to this workspace. Invite your law firm partners to start collaborating.</p>
                            <button 
                              onClick={() => { setIsMembersModalOpen(false); setIsInviteModalOpen(true); }}
                              className="px-8 py-4 bg-black text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-black/10"
                            >
                              Generate Invite Link →
                            </button>
                         </div>
                      )}
                    </div>

                    {/* Audit Log / Additional Sections Directly on page */}
                    <div className="mt-16 bg-black rounded-[3rem] border border-white/5 relative overflow-hidden group shadow-2xl">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 p-12">
                         <div className="max-w-xl">
                            <h4 className="text-3xl font-bold text-white mb-4 font-display uppercase tracking-tight">Sovereignty Audit Log</h4>
                            <p className="text-gray-400 text-sm leading-relaxed font-sans font-medium">
                               Inspect every permission change and invitation issued in this workspace. Detailed logging ensures compliance and zero-persistence verification across your legal environment.
                            </p>
                         </div>
                         <button className="whitespace-nowrap px-10 py-5 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-2xl">
                            Inspect Audit Trails
                         </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
    </div>
  );
};

export default Integrations;
