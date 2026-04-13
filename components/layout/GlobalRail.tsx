import React from 'react';
import { 
  Activity, 
  Database, 
  Users, 
  Settings, 
  Scale,
  Blocks,
  Landmark,
  Library,
  PanelLeftClose,
  PanelLeftOpen,
  FolderKanban
} from 'lucide-react';
import { FaHome } from 'react-icons/fa';
import { AppView } from '../../types';

interface GlobalRailProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  user: { avatar: string };
  onProfileClick: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

const GlobalRail: React.FC<GlobalRailProps> = ({ 
  currentView, 
  onViewChange, 
  user, 
  onProfileClick,
  isSidebarCollapsed,
  onToggleSidebar
}) => {
  return (
    <div className="w-20 h-screen bg-zinc-900/60 backdrop-blur-2xl flex flex-col items-center py-6 shrink-0 z-50 border-r border-white/10 overflow-hidden">
      {/* Logo */}
      <div 
        className="w-12 h-12 mb-12 cursor-pointer hover:scale-110 transition-transform flex items-center justify-center shrink-0"
        onClick={() => onViewChange(AppView.OVERVIEW)}
      >
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <Scale className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Nav Icons */}
      <nav className="flex-1 flex flex-col gap-6 no-scrollbar overflow-y-auto w-full items-center">
        <RailItem 
          icon={<FaHome className="w-7 h-7" />} 
          active={currentView === AppView.OVERVIEW}
          onClick={() => onViewChange(AppView.OVERVIEW)}
          label="Home"
        />
        <RailItem 
          icon={<Scale className="w-7 h-7" />} 
          active={currentView === AppView.LEGAL_AI}
          onClick={() => onViewChange(AppView.LEGAL_AI)}
          label="Counsel"
        />
        <RailItem 
          icon={<Users className="w-7 h-7" />} 
          active={currentView === AppView.LEGAL_SPECIALISTS}
          onClick={() => onViewChange(AppView.LEGAL_SPECIALISTS)}
          label="Experts"
        />
        <RailItem 
          icon={<FolderKanban className="w-7 h-7" />} 
          active={currentView === AppView.CASE_MANAGEMENT}
          onClick={() => onViewChange(AppView.CASE_MANAGEMENT)}
          label="Cases"
        />
        <RailItem 
          icon={<Landmark className="w-7 h-7" />} 
          active={currentView === AppView.JUDICIAL_ANALYTICS}
          onClick={() => onViewChange(AppView.JUDICIAL_ANALYTICS)}
          label="Courts"
        />
        <RailItem 
          icon={<Blocks className="w-7 h-7" />} 
          active={currentView === AppView.INTEGRATIONS}
          onClick={() => onViewChange(AppView.INTEGRATIONS)}
          label="Integrations"
        />

        <RailItem 
          icon={<Library className="w-7 h-7" />} 
          active={currentView === AppView.LIBRARY}
          onClick={() => onViewChange(AppView.LIBRARY)}
          label="Library"
        />
        <RailItem 
          icon={<Database className="w-7 h-7" />} 
          active={currentView === AppView.FILES}
          onClick={() => onViewChange(AppView.FILES)}
          label="Vault"
        />
      </nav>

      {/* Bottom Icons */}
      <div className="flex flex-col gap-6 mt-auto w-full items-center">
        <RailItem 
          icon={<Settings className="w-7 h-7" />} 
          active={currentView === AppView.SETTINGS}
          onClick={() => onViewChange(AppView.SETTINGS)}
          label="Config"
        />
        <div className="relative group px-3 pb-2 flex flex-col items-center gap-1.5">
          <div 
            className="w-10 h-10 rounded-xl border-2 border-primary/20 cursor-pointer hover:border-primary transition-colors overflow-hidden shrink-0"
            onClick={onProfileClick}
          >
            <img 
              src={user.avatar} 
              alt="User" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[9px] font-black text-white uppercase tracking-tighter">Profile</span>
        </div>
      </div>
    </div>
  );
};

const RailItem = ({ icon, active, onClick, label }: { icon: React.ReactNode, active: boolean, onClick: () => void, label: string }) => (
  <div className="relative group w-full flex flex-col items-center gap-1.5 cursor-pointer" onClick={onClick}>
    <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${
      active 
        ? 'bg-primary/10 text-primary shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
        : 'text-white/60 group-hover:bg-white/5 group-hover:text-white'
    }`}>
      {icon}
    </div>
    <span className={`text-[9px] font-black uppercase tracking-tighter transition-colors duration-300 ${
      active ? 'text-primary' : 'text-white'
    }`}>
      {label}
    </span>
    
    {/* Active Indicator Bar */}
    {active && (
      <div className="absolute left-0 top-1.5 w-1 h-7 bg-primary rounded-r-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
    )}
  </div>
);

export default GlobalRail;
