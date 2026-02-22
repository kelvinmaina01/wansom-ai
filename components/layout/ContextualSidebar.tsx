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
}

const ContextualSidebar: React.FC<ContextualSidebarProps> = ({ currentView, onNewChat }) => {
  const getSidebarContent = () => {
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
            { label: 'Active chats', active: true },
            { label: 'Saved prompts' },
            { label: 'Persona library' },
            { label: 'Drafts' },
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
      case AppView.WORKSPACES:
        return {
          title: 'Workspaces',
          sections: [
            { label: 'Active cases', active: true },
            { label: 'Team spaces' },
            { label: 'Client portals' },
            { label: 'Templates' },
          ]
        };
      case AppView.WORKFLOWS:
        return {
          title: 'Workflows',
          sections: [
            { label: 'My automations', active: true },
            { label: 'Workflow gallery' },
            { label: 'Execution logs' },
            { label: 'Triggers' },
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
    <div className="w-64 h-screen bg-[#F9FAFB] border-r border-gray-200 flex flex-col shrink-0 overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <h2 className="text-sm font-black text-black uppercase tracking-widest mb-6">{content.title}</h2>
        
        {content.action && (
          <button 
            onClick={content.action.onClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-900 transition-all active:scale-95 mb-6 shadow-lg shadow-black/10"
          >
            {content.action.icon}
            {content.action.label}
          </button>
        )}

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all"
          />
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 custom-scrollbar">
        {content.sections.map((section, idx) => (
          <div 
            key={idx}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all group ${
              section.active 
                ? 'bg-white text-primary shadow-sm border border-gray-100' 
                : 'text-gray-500 hover:text-black hover:bg-gray-100'
            }`}
          >
            <span className={`text-xs font-bold ${section.active ? 'text-black' : ''}`}>{section.label}</span>
            {section.active && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(242,125,38,0.5)]"></div>}
          </div>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-6 border-t border-gray-100">
        <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-black text-xs">
            P
          </div>
          <div>
            <p className="text-[10px] font-black text-black uppercase tracking-wider leading-none mb-1">Pro Plan</p>
            <p className="text-[9px] font-bold text-gray-400">85% usage</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextualSidebar;
