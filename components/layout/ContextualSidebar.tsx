import React, { useState } from 'react';
import { AppView } from '../../types';
import { 
  Plus, 
  Search,
  Zap,
  Shield,
  Clock,
  LayoutGrid,
  MessageCircle,
  FileText,
  BarChart3,
  SearchCheck,
  Settings as SettingsIcon,
  CreditCard,
  Bot,
  Radio,
  PanelLeftClose,
  PanelLeftOpen,
  FolderClosed,
  Users,
  User,
  Calendar,
  Receipt,
  Radar,
  History,
  PlayCircle} from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';

interface ContextualSidebarProps {
  currentView: AppView;
  onNewChat?: () => void;
  onSubViewChange?: (view: string) => void;
  onToggleCollapse?: () => void;
  activeSubView?: string;
  user: { name: string; email: string; avatar: string };
  workspaceId?: string;
  connectedIds?: Set<string>;
  isSidebarCollapsed?: boolean;
  documentMetadata?: { title: string; status: string; actions: any[] } | null;
}

interface SidebarSection {
  label: string;
  active?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const ContextualSidebar: React.FC<ContextualSidebarProps> = ({ 
  currentView, 
  onNewChat, 
  onSubViewChange,
  onToggleCollapse,
  activeSubView,
  user,
  workspaceId,
  connectedIds = new Set(),
  isSidebarCollapsed = false,
  documentMetadata,
}) => {
  const [teamMembers, setTeamMembers] = React.useState<any[]>([]);
  const [invitations, setInvitations] = React.useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    if (!workspaceId) return;

    const fetchTeam = async () => {
      // First verify the current user is a member of this workspace before fetching
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch members (RLS allows if user is in the workspace)
      const { data: members, error: membersError } = await supabase
        .from('workspace_members')
        .select('role, user_id')
        .eq('workspace_id', workspaceId);

      if (membersError) {
        // User is likely not a member of this workspace — silently skip
        return;
      }

      // Check current user's role
      const currentUserMember = members?.find(m => m.user_id === user.id);
      
      // Only fetch invitations if the user is an owner/admin (avoids 403 error for regular members)
      if (currentUserMember && (currentUserMember.role === 'owner' || currentUserMember.role === 'admin')) {
        const { data: invites, error: invitesError } = await supabase
          .from('workspace_invitations')
          .select('email, role')
          .eq('workspace_id', workspaceId)
          .eq('status', 'pending');

        if (!invitesError && invites) setInvitations(invites);
      }

      if (members) {
        // Fetch profiles for members
        const userIds = members.map(m => m.user_id);
        const { data: profiles } = await supabase
          .from('user_settings')
          .select('id, profile_name, profile_avatar_url')
          .in('id', userIds);

        const membersWithProfiles = members.map(m => ({
          ...m,
          profile: profiles?.find(p => p.id === m.user_id)
        }));
        setTeamMembers(membersWithProfiles);
      }
    };

    fetchTeam();
  }, [workspaceId]);

  const getSidebarContent = (): { title: string; action?: any; sections: SidebarSection[] } => {
    switch (currentView) {
      case AppView.OVERVIEW:
        return {
          title: 'Document Intelligence',
          sections: [
            { label: 'Project overview', active: true, icon: <LayoutGrid className="w-5 h-5" /> },
            { label: 'Recent activity', icon: <Clock className="w-5 h-5" /> },
            { label: 'Firm metrics', icon: <Zap className="w-5 h-5" /> },
          ]
        };
      case AppView.LEGAL_AI:
        return {
          title: 'Direct Intelligence',
          action: { label: 'New Session', onClick: onNewChat, icon: <Plus className="w-5 h-5" /> },
          sections: [
            { 
              label: 'Active sessions', 
              active: activeSubView === 'Active chats' || !activeSubView,
              onClick: () => onSubViewChange?.('Active chats'),
              icon: <MessageCircle className="w-5 h-5" />
            },
            { 
              label: 'Persona library',
              active: activeSubView === 'Persona library',
              onClick: () => onSubViewChange?.('Persona library'),
              icon: <Bot className="w-5 h-5" />
            },
            { 
              label: 'Audit history',
              active: activeSubView === 'History',
              onClick: () => onSubViewChange?.('History'),
              icon: <SearchCheck className="w-5 h-5" />
            },
          ]
        };
      case AppView.FILES:
        return {
          title: 'Secure Vault',
          sections: [
            { label: 'All legal files', active: true, icon: <FileText className="w-5 h-5" /> },
            { label: 'Firm repository', icon: <Shield className="w-5 h-5" /> },
          ]
        };
      case AppView.INTEGRATIONS:
        const integrationSections = [
          { 
            id: 'gdrive',
            label: 'Google Drive', 
            icon: <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" className="w-5 h-5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="" /> 
          },
          { 
            id: 'gsheets',
            label: 'Google Sheets', 
            icon: <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg" className="w-5 h-5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="" /> 
          },
          { 
            id: 'onedrive',
            label: 'OneDrive', 
            icon: <img src="/integrations/onedrive.png" className="w-5 h-5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="" /> 
          },
          { 
            id: 'slack',
            label: 'Slack', 
            icon: <img src="/integrations/slack.png" className="w-5 h-5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="" /> 
          },
          { 
            id: 'gmail',
            label: 'Gmail', 
            icon: <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" className="w-5 h-5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="" /> 
          },
          { 
            id: 'gcal',
            label: 'Google Calendar', 
            icon: <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" className="w-5 h-5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="" /> 
          },
          { 
            id: 'outlook',
            label: 'Outlook Calendar', 
            icon: <img src="/integrations/outlook.png" className="w-5 h-5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="" /> 
          },
        ];

        return {
          title: 'Workflow Bridges',
          sections: integrationSections
            .filter(section => connectedIds.has(section.id))
            .map((section, idx) => ({
              ...section,
              active: idx === 0 // Make the first connected one active by default or handle state
            }))
        };
      case AppView.SETTINGS:
        return {
          title: 'Command Settings',
          sections: [
            { label: 'Profile analytics', active: true, icon: <User className="w-5 h-5" /> },
            { label: 'Security keys', icon: <Shield className="w-5 h-5" /> },
            { label: 'Billing station', icon: <CreditCard className="w-5 h-5" /> },
          ]
        };
      case AppView.AGENTIC_MENTORSHIP:
        return {
          title: 'Amani Mentorship',
          sections: [
            { label: 'Start session', active: true, icon: <Zap className="w-5 h-5" /> },
            { label: 'Cross-exam drills', icon: <Shield className="w-5 h-5" /> },
            { label: 'Session history', icon: <History className="w-5 h-5" /> },
          ]
        };
      case AppView.JUDICIAL_ANALYTICS:
        return {
          title: 'Judicial Intel',
          sections: [
            { 
              label: 'Judge directory', 
              active: activeSubView === 'Judge directory' || !activeSubView, 
              onClick: () => onSubViewChange?.('Judge directory'),
              icon: <Bot className="w-5 h-5" /> 
            },
            { 
              label: 'Court insights', 
              active: activeSubView === 'Court insights', 
              onClick: () => onSubViewChange?.('Court insights'),
              icon: <BarChart3 className="w-5 h-5" /> 
            },
            { 
              label: 'Case tracker', 
              active: activeSubView === 'Case tracker', 
              onClick: () => onSubViewChange?.('Case tracker'),
              icon: <Radar className="w-5 h-5" /> 
            },
          ]
        };
      case AppView.CASE_MANAGEMENT:
        return {
          title: 'Case Engine',
          sections: [
            { 
              label: 'Dashboard', 
              active: activeSubView === 'Dashboard', 
              onClick: () => onSubViewChange?.('Dashboard'),
              icon: <BarChart3 className="w-5 h-5" /> 
            },
            { 
              label: 'Cases', 
              active: activeSubView === 'Cases' || !activeSubView, 
              onClick: () => onSubViewChange?.('Cases'),
              icon: <FolderClosed className="w-5 h-5" /> 
            },
            { 
              label: 'AI Workflows', 
              active: activeSubView === 'AI Workflows', 
              onClick: () => onSubViewChange?.('AI Workflows'),
              icon: <Zap className="w-5 h-5" /> 
            },
            { 
              label: 'Clients', 
              active: activeSubView === 'Clients', 
              onClick: () => onSubViewChange?.('Clients'),
              icon: <Users className="w-5 h-5" /> 
            },
            { 
              label: 'Documents', 
              active: activeSubView === 'Documents', 
              onClick: () => onSubViewChange?.('Documents'),
              icon: <FileText className="w-5 h-5" /> 
            },
            { 
              label: 'Schedule', 
              active: activeSubView === 'Schedule', 
              onClick: () => onSubViewChange?.('Schedule'),
              icon: <Calendar className="w-5 h-5" /> 
            },
            { 
              label: 'Time Entries', 
              active: activeSubView === 'Time Entries', 
              onClick: () => onSubViewChange?.('Time Entries'),
              icon: <Clock className="w-5 h-5" /> 
            },
            { 
              label: 'Financials', 
              active: activeSubView === 'Financials', 
              onClick: () => onSubViewChange?.('Financials'),
              icon: <Receipt className="w-5 h-5" /> 
            },
            { 
              label: 'Settings', 
              active: activeSubView === 'Settings', 
              onClick: () => onSubViewChange?.('Settings'),
              icon: <SettingsIcon className="w-5 h-5" /> 
            },
          ]
        };
      case AppView.DOCUMENT_INSIGHTS:
        return {
          title: 'Document Intelligence',
          sections: documentMetadata ? [
            { label: 'Intelligence Overview', active: true, icon: <FileText className="w-5 h-5 text-red-500" /> },
          ] : [
            { label: 'Analyzing Document...', active: true, icon: <Zap className="w-5 h-5 animate-pulse text-red-500" /> }
          ]
        };
      default:
        return { title: 'Navigation', sections: [{ label: 'Main menu', active: true, icon: <LayoutGrid className="w-5 h-5" /> }] };
    }
  };

  const content = getSidebarContent();

  return (
    <div className="w-64 h-full bg-[#F5F5EE] flex flex-col shrink-0 overflow-y-auto no-scrollbar border-r border-gray-200/50 shadow-sm transition-all duration-300">
      {/* Tactical Header */}
      <div className="p-8 pb-4">
        <div className="flex items-center gap-2 mb-8 px-1 text-[#C09440]">
            <div className={`w-2.5 h-2.5 rounded-full ${currentView === AppView.DOCUMENT_INSIGHTS ? 'bg-red-500' : 'bg-primary'} animate-pulse shadow-[0_0_10px_rgba(225,29,72,0.4)]`} />
            <h2 className="text-[11px] font-black text-black/80 uppercase tracking-[0.3em] overflow-hidden whitespace-nowrap font-display">
              {currentView === AppView.DOCUMENT_INSIGHTS ? 'Insight Dashboard' : content.title}
            </h2>
        </div>
        
        {currentView === AppView.DOCUMENT_INSIGHTS && documentMetadata && (
          <div className="mb-8 space-y-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-primary font-bold text-[10px] uppercase tracking-wider">
                <Radio className="w-3 h-3 animate-pulse" />
                {documentMetadata.status}
              </div>
              <h3 className="text-[13px] font-black text-black mb-1 line-clamp-1">{documentMetadata.title}</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Kenya Judiciary</p>
            </div>
            
            <div className="flex gap-2">
              {documentMetadata.actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={action.onClick}
                  className="flex-1 py-2 px-1 bg-[#F5F5EE] hover:bg-white border border-gray-200 rounded-xl text-[10px] font-black text-gray-700 hover:text-black transition-all flex flex-col items-center gap-1 shadow-sm"
                >
                  <div className="text-gray-400 group-hover:text-black">{action.icon}</div>
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {content.action && (
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={content.action.onClick}
            className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-primary text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-primary-hover transition-all mb-8 shadow-xl shadow-primary/10 group relative overflow-hidden font-display"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Plus className="w-5 h-5 relative z-10" />
            <span className="relative z-10">{content.action.label}</span>
          </motion.button>
        )}

        <div className="relative group mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Tactical search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200/80 rounded-2xl py-3.5 pl-12 pr-4 text-[13px] font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all tracking-tight font-sans shadow-sm"
          />
        </div>
      </div>

      {/* Modern Navigation List */}
      <nav className="flex-1 px-4 py-2 space-y-1.5 font-display">
        {content.sections.filter(s => !searchQuery || s.label.toLowerCase().includes(searchQuery.toLowerCase())).map((section, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ x: 4 }}
            onClick={section.onClick}
            className={`flex items-center justify-between px-4 py-3.5 rounded-2xl cursor-pointer transition-all group relative overflow-hidden ${
              section.active 
                ? 'bg-white text-primary shadow-lg shadow-black/[0.03] border border-gray-100' 
                : 'text-gray-500 hover:text-black hover:bg-black/[0.03]'
            }`}
          >
            <div className="flex items-center gap-4 relative z-10">
              {section.icon && (
                <div className={`shrink-0 transition-colors duration-300 ${section.active ? 'text-primary' : 'text-gray-400 group-hover:text-black'}`}>
                  {section.icon}
                </div>
              )}
              <span className={`text-[13px] font-bold tracking-tight ${section.active ? 'text-black' : ''}`}>{section.label}</span>
            </div>
            
            {section.active && (
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(225,29,72,0.4)] relative z-10" />
            )}
            
            {section.active && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50" />
            )}
          </motion.div>
        ))}
      </nav>


      {/* Team & Profile Station */}
      <div className="p-4 mt-auto border-t border-gray-100 bg-white/50 backdrop-blur-md space-y-3">
        
        {/* Settings & Toggle Row */}
        <div className="flex items-center justify-between px-2 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center text-[11px] font-black uppercase tracking-wider relative">
              {user.name.charAt(0)}
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-900">{user.name}</span>
              <span className="text-[9px] font-medium text-gray-500 uppercase tracking-widest">Workspace Admin</span>
            </div>
          </div>
          
          <button 
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100/80 rounded-lg transition-all active:scale-95" 
            onClick={onToggleCollapse}
            title="Toggle Sidebar"
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
        </div>

        {/* Team Members List */}
        <div className="px-2 pb-4 pt-4 border-t border-gray-100/50 mt-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Connected Team</h3>
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-[9px] font-bold text-gray-500">
              {teamMembers.length > 0 ? teamMembers.length + 1 : 3}
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            {teamMembers.length > 0 ? (
              teamMembers.map((member, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 rounded-xl hover:bg-black/[0.02] transition-colors group">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-[10px] font-black text-primary border border-primary/10 overflow-hidden">
                      {member.profile?.profile_avatar_url ? (
                        <img src={member.profile.profile_avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        (member.profile?.profile_name?.charAt(0) || 'U').toUpperCase()
                      )}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#F5F5EE] shadow-sm animate-pulse" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[11px] font-bold text-gray-900 truncate">{member.profile?.profile_name || 'Legal Associate'}</p>
                    <p className="text-[9px] font-medium text-gray-400 uppercase tracking-wider">{member.role}</p>
                  </div>
                </div>
              ))
            ) : (
              /* Fallback Mock Team Data when Supabase returns empty locally */
              <>
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-black/[0.02] transition-colors group">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[10px] font-black text-blue-600 border border-blue-100 overflow-hidden">
                      E
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white shadow-sm" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[11px] font-bold text-gray-900 truncate">Elara Vance</p>
                    <p className="text-[9px] font-medium text-gray-400 uppercase tracking-wider">Senior Partner</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-black/[0.02] transition-colors group">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-[10px] font-black text-purple-600 border border-purple-100 overflow-hidden">
                      M
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-white shadow-sm" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[11px] font-bold text-gray-900 truncate">Marcus Chen</p>
                    <p className="text-[9px] font-medium text-gray-400 uppercase tracking-wider">Assoc. Counsel</p>
                  </div>
                </div>
              </>
            )}
            
            {invitations.map((invite, idx) => (
              <div key={`invite-${idx}`} className="flex items-center gap-3 p-2 rounded-xl opacity-60 hover:opacity-100 transition-all group grayscale">
                 <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400 border border-gray-200">
                    {invite.email.charAt(0).toUpperCase()}
                  </div>
                <div className="overflow-hidden">
                  <p className="text-[11px] font-bold text-gray-500 truncate">{invite.email.split('@')[0]}</p>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Invited</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextualSidebar;
