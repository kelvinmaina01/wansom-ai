import React from 'react';
import { 
  LayoutDashboard, 
  Files, 
  Briefcase, 
  LayoutGrid, 
  Settings, 
  Scale,
  History,
  HelpCircle,
  LogOut,
  Blocks,
  Gavel
} from 'lucide-react';
import { AppView } from '../../types';

interface GlobalRailProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  user: { avatar: string };
}

const GlobalRail: React.FC<GlobalRailProps> = ({ currentView, onViewChange, user }) => {
  return (
    <div className="w-16 h-screen bg-black flex flex-col items-center py-6 shrink-0 z-50 border-r border-white/5">
      {/* Logo */}
      <div 
        className="w-12 h-12 mb-10 cursor-pointer hover:scale-110 transition-transform flex items-center justify-center"
        onClick={() => onViewChange(AppView.OVERVIEW)}
      >
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <Scale className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Nav Icons */}
      <nav className="flex-1 flex flex-col gap-4 no-scrollbar overflow-y-auto">
        <RailItem 
          icon={<LayoutDashboard className="w-5 h-5" />} 
          active={currentView === AppView.OVERVIEW}
          onClick={() => onViewChange(AppView.OVERVIEW)}
          label="Dashboard"
        />
        <RailItem 
          icon={<Scale className="w-5 h-5" />} 
          active={currentView === AppView.LEGAL_AI}
          onClick={() => onViewChange(AppView.LEGAL_AI)}
          label="Legal AI"
        />
        <RailItem 
          icon={<Briefcase className="w-5 h-5" />} 
          active={currentView === AppView.LEGAL_SPECIALISTS}
          onClick={() => onViewChange(AppView.LEGAL_SPECIALISTS)}
          label="Legal Specialists"
        />
        <RailItem 
          icon={<Gavel className="w-5 h-5" />} 
          active={currentView === AppView.JUDICIAL_ANALYTICS}
          onClick={() => onViewChange(AppView.JUDICIAL_ANALYTICS)}
          label="Judicial Analytics"
        />
        <RailItem 
          icon={<Blocks className="w-5 h-5" />} 
          active={currentView === AppView.INTEGRATIONS}
          onClick={() => onViewChange(AppView.INTEGRATIONS)}
          label="Integrations"
        />
        <RailItem 
          icon={<Files className="w-5 h-5" />} 
          active={currentView === AppView.FILES}
          onClick={() => onViewChange(AppView.FILES)}
          label="Files"
        />
        <RailItem 
          icon={<LayoutGrid className="w-5 h-5" />} 
          active={currentView === AppView.WORKSPACE}
          onClick={() => onViewChange(AppView.WORKSPACE)}
          label="Workspace"
        />
        <RailItem 
          icon={<History className="w-5 h-5" />} 
          active={currentView === AppView.HISTORY}
          onClick={() => onViewChange(AppView.HISTORY)}
          label="History"
        />
      </nav>

      {/* Bottom Icons */}
      <div className="flex flex-col gap-4 mt-auto">
        <RailItem 
          icon={<Settings className="w-5 h-5" />} 
          active={currentView === AppView.SETTINGS}
          onClick={() => onViewChange(AppView.SETTINGS)}
          label="Settings"
        />
        <div className="relative group">
          <img 
            src={user.avatar} 
            alt="User" 
            className="w-10 h-10 rounded-xl border-2 border-primary/20 cursor-pointer hover:border-primary transition-colors" 
          />
          <div className="absolute left-full ml-4 px-3 py-2 bg-black text-white text-[10px] font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100]">
            Profile
          </div>
        </div>
      </div>
    </div>
  );
};

const RailItem = ({ icon, active, onClick, label }: { icon: React.ReactNode, active: boolean, onClick: () => void, label: string }) => (
  <div className="relative group">
    <button 
      onClick={onClick}
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
        active 
          ? 'bg-primary text-white shadow-lg shadow-primary/20' 
          : 'text-gray-500 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
    </button>
    {/* Tooltip */}
    <div className="absolute left-full ml-4 px-3 py-2 bg-black text-white text-[10px] font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100]">
      {label}
    </div>
  </div>
);

export default GlobalRail;
