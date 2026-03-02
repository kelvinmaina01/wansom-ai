import React from 'react';
import { AppView } from '../../types';
import { 
  ChevronRight, 
  Plus, 
  Search,
  Filter,
  Clock,
  Star,
  Shield,
  CreditCard,
  User,
  Bell
} from 'lucide-react';

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
          title: 'Dashboard',
          sections: [
            { label: 'Project overview', active: true },
            { label: 'Recent activity' },
            { label: 'Performance metrics' },
            { label: 'Usage reports' },
          ]
        };
      case AppView.LEGAL_AI:
        return {
          title: 'Legal AI',
          action: { label: 'New Session', onClick: onNewChat, icon: <Plus className="w-4 h-4" /> },
          sections: [
            { 
              label: 'Active chats', 
              active: activeSubView === 'Active chats' || !activeSubView,
              onClick: () => onSubViewChange?.('Active chats')
            },
            { 
              label: 'Saved prompts',
              active: activeSubView === 'Saved prompts',
              onClick: () => onSubViewChange?.('Saved prompts')
            },
            { 
              label: 'Persona library',
              active: activeSubView === 'Persona library',
              onClick: () => onSubViewChange?.('Persona library')
            },
            { 
              label: 'Drafts',
              active: activeSubView === 'Drafts',
              onClick: () => onSubViewChange?.('Drafts')
            },
            { 
              label: 'History',
              active: activeSubView === 'History',
              onClick: () => onSubViewChange?.('History')
            },
          ]
        };
      case AppView.FILES:
        return {
          title: 'Case Files',
          sections: [
            { label: 'All documents', active: true },
            { label: 'Recent uploads' },
            { label: 'Shared with me' },
            { label: 'Archived files' },
          ]
        };
      case AppView.LEGAL_SPECIALISTS:
        return {
          title: 'Legal Specialists',
          sections: [
            { 
              label: 'Premade Associates', 
              active: activeSubView === 'Premade Associates',
              onClick: () => onSubViewChange?.('Premade Associates')
            },
            { 
              label: 'My Associates',
              active: activeSubView === 'My Associates',
              onClick: () => onSubViewChange?.('My Associates')
            },
            { 
              label: 'Practice Areas',
              active: activeSubView === 'Practice Areas',
              onClick: () => onSubViewChange?.('Practice Areas')
            },
            { 
              label: 'Templates',
              active: activeSubView === 'Templates',
              onClick: () => onSubViewChange?.('Templates')
            },
          ]
        };
      case AppView.WORKSPACE:
        return {
          title: 'Workspace',
          sections: [
            { label: 'Active cases', active: true },
            { label: 'Team spaces' },
            { label: 'Client portals' },
            { label: 'Templates' },
          ]
        };
      case AppView.HISTORY:
        return {
          title: 'History',
          sections: [
            { label: 'Past sessions', active: true },
            { label: 'Search history' },
            { label: 'Exported reports' },
            { label: 'Audit logs' },
          ]
        };
      case AppView.INTEGRATIONS:
        return {
          title: 'Integrations',
          sections: [
            { 
              label: 'Google Drive', 
              active: true,
              icon: <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" className="w-4 h-4" alt="Drive" />
            },
            { 
              label: 'Google Sheets', 
              icon: <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg" className="w-4 h-4" alt="Sheets" />
            },
            { 
              label: 'Slack', 
              icon: <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg" className="w-4 h-4" alt="Slack" />
            },
            { label: 'Clio Manage' },
            { label: 'MyCase' },
          ]
        };
      case AppView.SETTINGS:
        return {
          title: 'Settings',
          sections: [
            { label: 'Account profile', active: true },
            { label: 'Billing & Plans' },
            { label: 'Security' },
            { label: 'API Keys' },
            { label: 'Notifications' },
          ]
        };
      default:
        return { title: 'Menu', sections: [] };
    }
  };

  const content = getSidebarContent();

  return (
    <div className="w-64 h-full bg-black flex flex-col shrink-0 overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="p-6 pb-4">
        <h2 className="text-xs font-semibold text-gray-400 mb-6">{content.title}</h2>
        
        {content.action && (
          <button 
            onClick={content.action.onClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-primary-hover transition-all active:scale-95 mb-6 shadow-lg shadow-primary/20"
          >
            {content.action.icon}
            {content.action.label}
          </button>
        )}

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs font-medium text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/5 focus:border-white/20 transition-all"
          />
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 custom-scrollbar no-scrollbar">
        {content.sections.map((section, idx) => (
          <div 
            key={idx}
            onClick={section.onClick}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all group ${
              section.active 
                ? 'bg-white/10 text-white shadow-sm border border-white/5' 
                : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              {section.icon && <div className="shrink-0">{section.icon}</div>}
              <span className={`text-xs font-medium ${section.active ? 'text-white' : ''}`}>{section.label}</span>
            </div>
            {section.active && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(79,70,229,0.5)]"></div>}
          </div>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-6 border-t border-white/5">
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10 shadow-sm">
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary font-semibold text-xs">
            P
          </div>
          <div>
            <p className="text-[10px] font-bold text-white leading-none mb-1">Pro Plan</p>
            <p className="text-[9px] font-medium text-gray-500">85% usage</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextualSidebar;
