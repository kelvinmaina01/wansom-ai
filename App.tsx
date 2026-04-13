import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import { AdminAuthProvider, useAdminAuth } from './lib/adminAuth';
import { apiClient } from './lib/apiClient';

import GlobalRail from './components/layout/GlobalRail';
import ContextualSidebar from './components/layout/ContextualSidebar';
import Overview from './components/Overview';
import LegalAI from './components/LegalAI';
import LegalSpecialists from './components/LegalSpecialists';
import LandingPage from './components/LandingPage';
import NotificationCenter from './components/NotificationCenter';
import Settings from './components/Settings';
import Files from './components/Files';
import AuthPage from './components/AuthPage';
import AuthCallback from './components/AuthCallback';
import OnboardingPage from './components/OnboardingPage';
import PricingPage from './components/PricingPage';
import JudicialAnalytics from './components/JudicialAnalytics';
import Integrations from './components/Integrations';
import PlaceholderView from './components/PlaceholderView';
import ProfilePage from './components/ProfilePanel';

import LibraryPage from './components/LibraryPage';
import CaseManager from './components/CaseManager';
import DocumentInsights from './components/DocumentInsights';
import IntelligenceHub from './components/IntelligenceHub';
import KockpitDashboard from './components/KockpitDashboard';
import AdminLogin from './components/AdminLogin';
import EnterpriseBooking from './components/EnterpriseBooking';
import BookDemoForm from './components/BookDemoForm';
import ProjectComposer from './components/ProjectComposer';
import ProjectView from './components/ProjectView';
import SupportSidebar from './components/SupportSidebar';
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
    timestamp: new Date(Date.now() - 3600000),
    read: false,
    category: 'Regulation'
  },
  {
    id: '3',
    title: 'System Maintenance',
    message: 'Lawlify AI will undergo scheduled maintenance on Saturday, March 15th from 2:00 AM to 4:00 AM EAT.',
    type: 'info',
    timestamp: new Date(Date.now() - 86400000),
    read: true,
    category: 'System'
  }
];

// Map route paths to AppView values
const ROUTE_TO_VIEW: Record<string, AppView> = {
  'overview': AppView.OVERVIEW,
  'legal-ai': AppView.LEGAL_AI,
  'specialists': AppView.LEGAL_SPECIALISTS,
  'judicial-analytics': AppView.JUDICIAL_ANALYTICS,
  'integrations': AppView.INTEGRATIONS,
  'files': AppView.FILES,
  'settings': AppView.SETTINGS,
  'history': AppView.HISTORY,
  'profile': AppView.PROFILE,

  'library': AppView.LIBRARY,
  'case-management': AppView.CASE_MANAGEMENT,
  'insights': AppView.DOCUMENT_INSIGHTS,
  'intelligence-hub': AppView.INTELLIGENCE_HUB,
  'projects/new': AppView.PROJECT_NEW,
  'projects/:id': AppView.PROJECT_VIEW
};

const VIEW_TO_ROUTE: Record<string, string> = {
  [AppView.OVERVIEW]: 'overview',
  [AppView.LEGAL_AI]: 'legal-ai',
  [AppView.LEGAL_SPECIALISTS]: 'specialists',
  [AppView.JUDICIAL_ANALYTICS]: 'judicial-analytics',
  [AppView.INTEGRATIONS]: 'integrations',
  [AppView.FILES]: 'files',
  [AppView.SETTINGS]: 'settings',
  [AppView.HISTORY]: 'history',
  [AppView.PROFILE]: 'profile',

  [AppView.LIBRARY]: 'library',
  [AppView.CASE_MANAGEMENT]: 'case-management',
  [AppView.DOCUMENT_INSIGHTS]: 'insights',
  [AppView.INTELLIGENCE_HUB]: 'intelligence-hub',
  [AppView.PROJECT_NEW]: 'projects/new',
  [AppView.PROJECT_VIEW]: 'projects/:id'
};

// App shell layout for authenticated in-app views
const AppLayout: React.FC<{ supabaseUser: User | null; activeWorkspace: any }> = ({ supabaseUser, activeWorkspace }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  const [activeSpecialist, setActiveSpecialist] = useState<LegalSpecialist | null>(null);
  const [specialistSubView, setSpecialistSubView] = useState('Premade Associates');
  const [legalAISubView, setLegalAISubView] = useState('Active chats');
  const [judicialAnalyticsSubView, setJudicialAnalyticsSubView] = useState('Judge directory');
  const [caseManagerSubView, setCaseManagerSubView] = useState('Cases');
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());
  const [isFetchingIntegrations, setIsFetchingIntegrations] = useState(false);
  const [documentMetadata, setDocumentMetadata] = useState<{ title: string; status: string; actions: any[] } | null>(null);

  useEffect(() => {
    const state = location.state as { subView?: string } | null;
    if (state?.subView) {
      if (location.pathname.includes('specialists')) {
        setSpecialistSubView(state.subView);
      } else if (location.pathname.includes('legal-ai')) {
        setLegalAISubView(state.subView);
      } else if (location.pathname.includes('judicial-analytics')) {
        setJudicialAnalyticsSubView(state.subView);
      } else if (location.pathname.includes('case-management')) {
        setCaseManagerSubView(state.subView);
      }
    }
  }, [location.pathname, location.state]);

  const fetchIntegrations = async () => {
    try {
      setIsFetchingIntegrations(true);
      const res = await apiClient.get('/api/integrations/status');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.integrations) {
          const ids = data.integrations.map((i: any) => i.provider);
          setConnectedIds(new Set(ids));
        }
      }
    } catch (e) {
      console.error('Failed to fetch integrations:', e);
    } finally {
      setIsFetchingIntegrations(false);
    }
  };

  useEffect(() => {
    // Only fetch when navigating to integrations view to save requests
    if (location.pathname.includes('integrations')) {
      fetchIntegrations();
    }
  }, [location.pathname]);

  const toggleConnection = async (id: string) => {
    // We now just trigger a refetch if needed, since Integrations.tsx handles the actual connection popup
    // and disconnect logic directly against the backend.
    await fetchIntegrations();
  };

  // Notification State
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportOptions, setSupportOptions] = useState<{ category?: string; tab?: 'home' | 'messages' }>({});
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const user = {
    name: supabaseUser?.user_metadata?.full_name || supabaseUser?.email?.split('@')[0] || 'User',
    email: supabaseUser?.email || '',
    avatar: supabaseUser?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser?.email || 'User'}`
  };

  // Derive currentView from the current route
  const pathParts = location.pathname.split('/').filter(Boolean);
  const appIndex = pathParts.indexOf('app');
  let pathSegment = appIndex !== -1 && pathParts[appIndex + 1] ? pathParts.slice(appIndex + 1).join('/') : 'overview';
  
  // Dynamic route matching for projects/:id
  if (pathParts[appIndex + 1] === 'projects' && pathParts[appIndex + 2] && pathParts[appIndex + 2] !== 'new') {
    pathSegment = 'projects/:id';
  }
  
  const currentView = ROUTE_TO_VIEW[pathSegment] || AppView.LEGAL_AI;

  const handleViewChange = (view: AppView) => {
    const route = VIEW_TO_ROUTE[view] || 'legal-ai';
    navigate(`/app/${route}`);
    if (isSidebarCollapsed) setIsSidebarCollapsed(false);
  };

  const isProjectView = currentView === AppView.PROJECT_VIEW || currentView === AppView.PROJECT_NEW || !!(location.state as any)?.caseId;

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
        return <LegalAI userEmail={user.email} activeSpecialist={activeSpecialist} subView={legalAISubView} onChatActive={setIsChatActive} isProjectView={isProjectView} connectedIds={connectedIds} onToggleIntegration={toggleConnection} />;
      case AppView.INTEGRATIONS:
        return <Integrations connectedIds={connectedIds} onToggle={toggleConnection} workspaceId={activeWorkspace?.id} />;
      case AppView.JUDICIAL_ANALYTICS:
        return <JudicialAnalytics activeSubView={judicialAnalyticsSubView} />;
      case AppView.FILES:
        return <Files />;
      case AppView.LEGAL_SPECIALISTS:
        return (
          <LegalSpecialists
            subView={specialistSubView}
            onSelectSpecialist={(specialist) => {
              if (specialist.id === 'case-manager') {
                navigate('/app/case-management');
              } else {
                setActiveSpecialist(specialist);
                navigate('/app/legal-ai');
              }
            }}
          />
        );
      case AppView.CASE_MANAGEMENT:
        return <CaseManager activeSubView={caseManagerSubView} />;
      case AppView.DOCUMENT_INSIGHTS:
        return <DocumentInsights setMetadata={setDocumentMetadata} />;
      case AppView.INTELLIGENCE_HUB:
        return <IntelligenceHub />;
      case AppView.SETTINGS:
        return <Settings />;
      case AppView.HISTORY:
        return <PlaceholderView title="History" />;

      case AppView.LIBRARY:
        return <LibraryPage />;
      case AppView.PROJECT_NEW:
        return <ProjectComposer />;
      case AppView.PROJECT_VIEW:
        return <ProjectView />;
      case AppView.PROFILE:
        return (
          <ProfilePage
            isOpen={true}
            onClose={() => navigate(-1)}
            onOpenSettings={() => navigate('/app/settings')}
            onOpenSupport={(cat) => {
              setSupportOptions({ category: cat, tab: 'messages' });
              setIsSupportOpen(true);
            }}
            user={user}
          />
        );
      default:
        return <Overview />;
    }
  };

  const getViewLabel = (view: AppView) => {
    return view.charAt(0).toUpperCase() + view.slice(1).replace(/-/g, ' ');
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex h-screen bg-white font-sans text-black overflow-hidden relative">
      {/* Panel 1: Global Rail */}
      <GlobalRail
        user={user}
        currentView={currentView}
        onViewChange={handleViewChange}
        onProfileClick={() => navigate('/app/profile')}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Panel 2: Contextual Sidebar */}
      {currentView !== AppView.PROFILE && currentView !== AppView.PROJECT_NEW && (
        <div className={`transition-all duration-300 ease-in-out overflow-hidden border-r border-white/5 ${isSidebarCollapsed ? 'w-0 opacity-0' : 'w-64 opacity-100'}`}>
          <ContextualSidebar
            currentView={currentView}
            onNewChat={() => {
              navigate('/app/legal-ai');
              setLegalAISubView('Active chats');
            }}
            onSubViewChange={(view) => {
              if (currentView === AppView.LEGAL_AI) setLegalAISubView(view);
              if (currentView === AppView.LEGAL_SPECIALISTS) setSpecialistSubView(view);
              if (currentView === AppView.JUDICIAL_ANALYTICS) setJudicialAnalyticsSubView(view);
              if (currentView === AppView.CASE_MANAGEMENT) setCaseManagerSubView(view);
            }}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            activeSubView={
              currentView === AppView.LEGAL_AI ? legalAISubView : 
              currentView === AppView.JUDICIAL_ANALYTICS ? judicialAnalyticsSubView :
              currentView === AppView.CASE_MANAGEMENT ? caseManagerSubView :
              specialistSubView
            }
            isSidebarCollapsed={isSidebarCollapsed}
            user={user}
            workspaceId={activeWorkspace?.id}
            connectedIds={connectedIds}
            documentMetadata={documentMetadata}
            isProjectView={isProjectView}
          />
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex bg-white overflow-hidden relative">
        {/* Panel 3: Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden relative bg-white">
          {/* Top Header / Breadcrumbs */}
          <header className={`flex items-center justify-between px-8 bg-white/80 backdrop-blur-md z-40 transition-all duration-500 overflow-hidden ${
            (currentView === AppView.LEGAL_AI && isChatActive) || currentView === AppView.INTELLIGENCE_HUB || currentView === AppView.DOCUMENT_INSIGHTS
              ? 'h-0 opacity-0 border-transparent py-0' 
              : 'h-16 opacity-100 border-b border-gray-100'
          }`}>
            <div className="flex items-center gap-4 text-sm font-semibold">
              {currentView !== AppView.DOCUMENT_INSIGHTS && (
                <>
                  <div className="flex items-center gap-2 text-gray-400 hover:text-black cursor-pointer transition-colors group">
                    <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center shadow-sm group-hover:shadow-primary/20 transition-all">
                      <Scale className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span>Lawlify</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                  <span className="text-black">{getViewLabel(currentView)}</span>
                </>
              )}
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
              <button 
                onClick={() => setIsSupportOpen(true)}
                className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Support</span>
              </button>

            </div>
          </header>

          <NotificationCenter
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDeleteNotification}
            onClearAll={handleClearAll}
          />

          <div className="flex-1 overflow-hidden relative flex flex-col">
            {renderView()}
          </div>
        </main>
      </div>
      
      <SupportSidebar 
        isOpen={isSupportOpen}
        onClose={() => {
          setIsSupportOpen(false);
          setSupportOptions({});
        }}
        userName={user.name}
        initialCategory={supportOptions.category}
        initialTab={supportOptions.tab}
      />
    </div>
  );
};

// Main App with routes
const App: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState<any>(null);
  const { admin, loading: adminLoading } = useAdminAuth();

  const checkOnboarding = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('onboarding_responses')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) throw error;
      setHasCompletedOnboarding(!!data);

      if (data) {
        // Fetch most recent workspace for the user
        const { data: workspaces, error: wsError } = await supabase
          .from('workspaces')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (!wsError && workspaces && workspaces.length > 0) {
          setActiveWorkspace(workspaces[0]);
        }
      }
    } catch (err) {
      console.error('Error checking onboarding:', err);
    } finally {
      setOnboardingChecked(true);
    }
  };

  useEffect(() => {
    // Set up Supabase auth state listener
    console.log('🔐 Setting up Supabase auth listener...');

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('🔐 Session changed:', session?.user?.email || 'no user');
      setUser(session?.user || null);
      if (session?.user) {
        checkOnboarding(session.user.id);
      } else {
        setOnboardingChecked(true);
        setLoading(false);
      }
    });

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔐 Initial session:', session?.user?.email || 'no user');
      setUser(session?.user || null);
      if (session?.user) {
        checkOnboarding(session.user.id);
      } else {
        setOnboardingChecked(true);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading || adminLoading || (user && !onboardingChecked)) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Lawlify Intelligence Initializing...</p>
      </div>
    </div>;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage onEnterApp={() => navigate('/auth')} onPricingClick={() => navigate('/pricing')} />} />
      <Route path="/pricing" element={<PricingPage onBack={() => navigate('/')} onGetStarted={() => navigate('/auth')} />} />
      <Route
        path="/auth"
        element={user ? (hasCompletedOnboarding ? <Navigate to="/app/legal-ai" replace /> : <Navigate to="/onboarding" replace />) : <AuthPage onLogin={() => navigate('/app/legal-ai')} />}
      />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/onboarding"
        element={user ? <OnboardingPage onComplete={() => {
          setHasCompletedOnboarding(true);
          navigate('/app/legal-ai', { replace: true });
        }} /> : <Navigate to="/auth" replace />}
      />
      <Route
        path="/app/insights/:fileId"
        element={user ? <AppLayout supabaseUser={user} activeWorkspace={activeWorkspace} /> : <Navigate to="/" replace />}
      />
      <Route
        path="/app/intelligence-hub/:fileId"
        element={user ? <AppLayout supabaseUser={user} activeWorkspace={activeWorkspace} /> : <Navigate to="/" replace />}
      />
      <Route
        path="/app/*"
        element={user ? (hasCompletedOnboarding ? <AppLayout supabaseUser={user} activeWorkspace={activeWorkspace} /> : <Navigate to="/onboarding" replace />) : <Navigate to="/" replace />}
      />
      {/* Admin Route - Requires Admin Authentication */}
      <Route
        path="/kockpit/*"
        element={admin ? <KockpitDashboard /> : <Navigate to="/admin-login" replace />}
      />
      {/* Admin Login Route */}
      <Route path="/admin-login" element={admin ? <Navigate to="/kockpit" replace /> : <AdminLogin />} />
      <Route path="/book-demo" element={<BookDemoForm />} />
      <Route path="/book-enterprise-demo" element={<EnterpriseBooking />} />
      {/* Catch-all: redirect to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Wrap App with AdminAuthProvider
export default function AppWrapper() {
  return (
    <AdminAuthProvider>
      <App />
    </AdminAuthProvider>
  );
}
