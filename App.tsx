
import React, { useState, useEffect } from 'react';
import GlobalRail from './components/layout/GlobalRail';
import ContextualSidebar from './components/layout/ContextualSidebar';
import Overview from './components/Overview';
import LegalAI from './components/LegalAI';
import LegalSpecialists from './components/LegalSpecialists';
import LandingPage from './components/LandingPage';
import NotificationCenter from './components/NotificationCenter';
import CaseManagement from './components/CaseManagement';
import Settings from './components/Settings';
import Files from './components/Files';
import AuthPage from './components/AuthPage';
import OnboardingPage from './components/OnboardingPage';
import PricingPage from './components/PricingPage';
import JudicialAnalytics from './components/JudicialAnalytics';
import { WorkspaceType, AppView, LegalSpecialist, Notification } from './types';
import { ChevronRight, Bell, HelpCircle, Scale, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'New Supreme Court Ruling',
    message: 'The Supreme Court has delivered a landmark ruling on the Finance Act 2023, declaring certain sections unconstitutional.',
    type: 'info',
    timestamp: new Date(),
    read: false,
    category: 'Case Law'
  },
  {
    id: '2',
    title: 'Land Registration Update',
    message: 'New regulations regarding electronic land transactions have been gazetted by the Ministry of Lands.',
    type: 'warning',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    read: false,
    category: 'Regulation'
  },
  {
    id: '3',
    title: 'System Maintenance',
    message: 'Lawlify AI will undergo scheduled maintenance on Saturday, March 15th from 2:00 AM to 4:00 AM EAT.',
    type: 'info',
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    read: true,
    category: 'System'
  }
];

const App: React.FC = () => {
  const [viewState, setViewState] = useState<'landing' | 'auth' | 'onboarding' | 'app' | 'pricing'>('landing');
  const [currentView, setCurrentView] = useState<AppView>(AppView.LEGAL_AI);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSpecialist, setActiveSpecialist] = useState<LegalSpecialist | null>(null);
  const [specialistSubView, setSpecialistSubView] = useState('Premade Associates');
  const [legalAISubView, setLegalAISubView] = useState('Active chats');
  
  // Notification State
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const user = {
    name: 'Advocate Kelvin Maina',
    email: 'kelvin202maina@gmail.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Advocate'
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.OVERVIEW:
        return <Overview />;
      case AppView.LEGAL_AI:
        return <LegalAI userEmail={user.email} activeSpecialist={activeSpecialist} subView={legalAISubView} />;
      case AppView.INTEGRATIONS:
        return <PlaceholderView title="Integrations" />;
      case AppView.JUDICIAL_ANALYTICS:
        return <JudicialAnalytics />;
      case AppView.FILES:
        return <Files />;
      case AppView.LEGAL_SPECIALISTS:
        return (
          <LegalSpecialists 
            subView={specialistSubView}
            onSelectSpecialist={(specialist) => {
              setActiveSpecialist(specialist);
              setCurrentView(AppView.LEGAL_AI);
            }} 
          />
        );
      case AppView.WORKSPACE:
        return <CaseManagement />;
      case AppView.SETTINGS:
        return <Settings />;
      case AppView.HISTORY:
        return <PlaceholderView title="History" />;
      default:
        return <Overview />;
    }
  };

  const getViewLabel = (view: AppView) => {
    return view.charAt(0).toUpperCase() + view.slice(1).replace('-', ' ');
  };

  if (viewState === 'landing') {
    return <LandingPage onEnterApp={() => setViewState('auth')} onPricingClick={() => setViewState('pricing')} />;
  }

  if (viewState === 'pricing') {
    return <PricingPage onBack={() => setViewState('landing')} onGetStarted={() => setViewState('auth')} />;
  }

  if (viewState === 'auth') {
    return <AuthPage onLogin={() => setViewState('onboarding')} />;
  }

  if (viewState === 'onboarding') {
    return <OnboardingPage onComplete={() => setViewState('app')} />;
  }

  return (
    <div className="flex h-screen bg-white font-sans text-black overflow-hidden relative">
      {/* Panel 1: Global Rail */}
      <GlobalRail 
        user={user} 
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          if (isSidebarCollapsed) setIsSidebarCollapsed(false);
        }}
      />

      {/* Panel 2: Contextual Sidebar (Dark version) */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden border-r border-white/5 ${isSidebarCollapsed ? 'w-0 opacity-0' : 'w-64 opacity-100'}`}>
        <ContextualSidebar 
          currentView={currentView}
          onNewChat={() => {
            setCurrentView(AppView.LEGAL_AI);
            setLegalAISubView('Active chats');
          }}
          onSubViewChange={(view) => {
            if (currentView === AppView.LEGAL_AI) setLegalAISubView(view);
            if (currentView === AppView.LEGAL_SPECIALISTS) setSpecialistSubView(view);
          }}
          activeSubView={currentView === AppView.LEGAL_AI ? legalAISubView : specialistSubView}
        />
      </div>

      {/* Main Container */}
      <div className="flex-1 flex bg-white overflow-hidden relative">
        {/* Panel 3: Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden relative bg-white">
          {/* Top Header / Breadcrumbs */}
          <header className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md z-40">
            <div className="flex items-center gap-4 text-sm font-semibold">
              <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black transition-all"
                title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                {isSidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
              </button>
              <div className="h-6 w-px bg-gray-100 mx-2"></div>
              <div className="flex items-center gap-2 text-gray-400 hover:text-black cursor-pointer transition-colors group">
                <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center shadow-sm group-hover:shadow-primary/20 transition-all">
                  <Scale className="w-3.5 h-3.5 text-white" />
                </div>
                <span>Lawlify</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
              <span className="text-black">{getViewLabel(currentView)}</span>
            </div>

            <div className="flex items-center gap-6 relative">
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black transition-colors relative"
              >
                <div className="relative">
                  <Bell className="w-5 h-5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white min-w-[18px] text-center flex items-center justify-center">
                      {notifications.filter(n => !n.read).length > 99 ? '99+' : notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </div>
                <span>News</span>
              </button>
              <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black transition-colors">
                <HelpCircle className="w-4 h-4" />
                <span>Support</span>
              </button>
              
              <NotificationCenter 
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDeleteNotification}
                onClearAll={handleClearAll}
              />
            </div>
          </header>

          <div className="flex-1 overflow-hidden relative flex flex-col">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

const PlaceholderView = ({ title, description }: { title: string, description?: string }) => (
  <div className="flex-1 flex items-center justify-center bg-white bg-dots">
    <div className="text-center max-w-md">
      <div className="w-24 h-24 bg-primary rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary/20">
        <Scale className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-5xl font-bold text-black mb-4 tracking-tighter">{title}</h1>
      <p className="text-gray-400 font-bold text-[11px] leading-relaxed px-8">
        {description || `This module is currently being optimized for Kenyan Legal Standards. Please check back soon for the full release.`}
      </p>
    </div>
  </div>
);

export default App;
