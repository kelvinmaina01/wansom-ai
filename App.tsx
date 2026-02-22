
import React, { useState } from 'react';
import GlobalRail from './components/layout/GlobalRail';
import ContextualSidebar from './components/layout/ContextualSidebar';
import Overview from './components/Overview';
import LegalAI from './components/LegalAI';
import { WorkspaceType, AppView } from './types';
import { ChevronRight, Bell, HelpCircle, Scale } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.OVERVIEW);

  const user = {
    name: 'Advocate Kelvin Maina',
    email: 'k.maina@highcourt.ke',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Advocate'
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.OVERVIEW:
        return <Overview />;
      case AppView.LEGAL_AI:
        return <LegalAI />;
      case AppView.FILES:
        return <PlaceholderView title="Files" />;
      case AppView.WORKSPACES:
        return <PlaceholderView title="Workspaces" />;
      case AppView.WORKFLOWS:
        return <PlaceholderView title="Workflows" />;
      case AppView.SETTINGS:
        return <PlaceholderView title="Settings" />;
      case AppView.HISTORY:
        return <PlaceholderView title="History" />;
      default:
        return <Overview />;
    }
  };

  const getViewLabel = (view: AppView) => {
    return view.charAt(0).toUpperCase() + view.slice(1).replace('-', ' ');
  };

  return (
    <div className="flex h-screen bg-white font-sans text-black overflow-hidden">
      {/* Panel 1: Global Rail */}
      <GlobalRail 
        user={user} 
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Panel 2: Contextual Sidebar */}
      <ContextualSidebar 
        currentView={currentView}
        onNewChat={() => setCurrentView(AppView.LEGAL_AI)}
      />
      
      {/* Panel 3: Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-white">
        {/* Top Header / Breadcrumbs */}
        <header className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md z-40">
          <div className="flex items-center gap-3 text-sm font-bold">
            <span className="text-gray-400 hover:text-black cursor-pointer transition-colors">Lawlify</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <span className="text-black">{getViewLabel(currentView)}</span>
          </div>

          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
              <Bell className="w-4 h-4" />
              <span>News</span>
            </button>
            <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
              <HelpCircle className="w-4 h-4" />
              <span>Support</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

const PlaceholderView = ({ title }: { title: string }) => (
  <div className="flex-1 flex items-center justify-center bg-white bg-dots">
    <div className="text-center max-w-md">
      <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-gray-100 shadow-inner">
        <Scale className="w-10 h-10 text-gray-300" />
      </div>
      <h1 className="text-4xl font-black text-black mb-4 tracking-tighter">{title}</h1>
      <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] leading-relaxed">
        This module is currently being optimized for Kenyan Legal Standards. 
        Please check back soon for the full release.
      </p>
    </div>
  </div>
);

export default App;
