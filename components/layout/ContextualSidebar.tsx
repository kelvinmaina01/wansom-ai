import React from 'react';
import { AppView } from '../../types';
import { 
  Plus, 
  Search,
  Zap,
  Shield,
  Clock,
  LayoutGrid,
  MessageSquare,
  FileText,
  Workflow,
  History,
  Settings as SettingsIcon,
  CreditCard,
  User,
  Radio
} from 'lucide-react';
import { motion } from 'motion/react';

interface ContextualSidebarProps {
  currentView: AppView;
  onNewChat?: () => void;
  onSubViewChange?: (view: string) => void;
  activeSubView?: string;
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
  activeSubView 
}) => {
  const getSidebarContent = (): { title: string; action?: any; sections: SidebarSection[] } => {
    switch (currentView) {
      case AppView.OVERVIEW:
        return {
          title: 'Intelligence Hub',
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
              icon: <MessageSquare className="w-5 h-5" />
            },
            { 
              label: 'Persona library',
              active: activeSubView === 'Persona library',
              onClick: () => onSubViewChange?.('Persona library'),
              icon: <User className="w-5 h-5" />
            },
            { 
              label: 'Audit history',
              active: activeSubView === 'History',
              onClick: () => onSubViewChange?.('History'),
              icon: <History className="w-5 h-5" />
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
        return {
          title: 'Workflow Bridges',
          sections: [
            { 
                label: 'Google Drive', 
                active: true, 
                icon: <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" className="w-5 h-5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="" /> 
            },
            { 
                label: 'Google Sheets', 
                icon: <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg" className="w-5 h-5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="" /> 
            },
            { 
                label: 'OneDrive', 
                icon: <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Microsoft_Office_OneDrive_%282019%E2%80%93present%29.svg" className="w-5 h-5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="" /> 
            },
            { 
                label: 'Slack', 
                icon: <img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Slack_Technologies_Logo.svg" className="w-5 h-5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="" /> 
            },
            { 
                label: 'Google Calendar', 
                icon: <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" className="w-5 h-5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="" /> 
            },
            { 
                label: 'Outlook Calendar', 
                icon: <img src="https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg" className="w-5 h-5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="" /> 
            },
          ]
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
      default:
        return { title: 'Navigation', sections: [{ label: 'Main menu', active: true, icon: <LayoutGrid className="w-5 h-5" /> }] };
    }
  };

  const content = getSidebarContent();

  return (
    <div className="w-64 h-full bg-[#050505] flex flex-col shrink-0 overflow-y-auto no-scrollbar border-r border-white/[0.03]">
      {/* Tactical Header */}
      <div className="p-8 pb-4">
        <div className="flex items-center gap-2 mb-8 px-1">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <h2 className="text-[12px] font-black text-white/70 uppercase tracking-[0.3em] overflow-hidden whitespace-nowrap font-display">{content.title}</h2>
        </div>
        
        {content.action && (
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={content.action.onClick}
            className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-primary text-white rounded-2xl text-[13px] font-black uppercase tracking-widest hover:bg-primary-hover transition-all mb-8 shadow-2xl shadow-primary/20 group relative overflow-hidden font-display"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Plus className="w-5 h-5 relative z-10" />
            <span className="relative z-10">{content.action.label}</span>
          </motion.button>
        )}

        <div className="relative group mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Tactical search..." 
            className="w-full bg-white/[0.05] border border-white/20 rounded-2xl py-3.5 pl-12 pr-4 text-[13px] font-bold text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all tracking-tight font-sans"
          />
        </div>
      </div>

      {/* Modern Navigation List */}
      <nav className="flex-1 px-4 py-2 space-y-1.5 font-display">
        {content.sections.map((section, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ x: 4 }}
            onClick={section.onClick}
            className={`flex items-center justify-between px-4 py-3.5 rounded-2xl cursor-pointer transition-all group relative overflow-hidden ${
              section.active 
                ? 'bg-primary/20 text-white shadow-xl shadow-black/40 border border-primary/30' 
                : 'text-white/60 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            <div className="flex items-center gap-4 relative z-10">
              {section.icon && (
                <div className={`shrink-0 transition-colors duration-300 ${section.active ? 'text-primary' : 'text-white/40 group-hover:text-white'}`}>
                  {section.icon}
                </div>
              )}
              <span className={`text-[13px] font-bold tracking-tight ${section.active ? 'text-white' : ''}`}>{section.label}</span>
            </div>
            
            {section.active && (
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_15px_rgba(225,29,72,0.8)] relative z-10" />
            )}
            
            {section.active && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50" />
            )}
          </motion.div>
        ))}
      </nav>

      {/* Intelligence Feed Section */}
      <div className="px-6 py-4 mb-4">
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 group hover:border-primary/20 transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                    <Radio className="w-4 h-4 text-primary animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-white/80 tracking-widest uppercase mb-0.5">Live Feed</h4>
                    <p className="text-[9px] text-white/50 font-bold uppercase tracking-tighter italic">Kenya Law Gazette</p>
                  </div>
              </div>
              <p className="text-[10px] text-white/70 font-medium leading-relaxed italic">
                "New ruling regarding Land Act section 28 published..."
              </p>
          </div>
      </div>

      {/* Premium Profile Station */}
      <div className="p-6 mt-auto border-t border-white/[0.05] bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-4 p-4 bg-white/[0.05] rounded-[2rem] border border-white/10 hover:border-primary/20 transition-all cursor-pointer group shadow-2xl shadow-black">
          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary font-black text-base border border-primary/30 group-hover:bg-primary group-hover:text-white transition-all shadow-inner font-display">
            K
          </div>
          <div className="overflow-hidden">
            <h4 className="text-[12px] font-black text-white leading-none mb-1.5 group-hover:text-primary transition-colors font-display">Kelvin Maina</h4>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] font-display font-black">Active Station</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextualSidebar;
