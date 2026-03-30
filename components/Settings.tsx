import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Check,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  LogOut,
  AlertTriangle,
  Trash2,
  RefreshCw,
  Plug,
  ExternalLink,
  Download,
  Link,
  UserPlus
} from 'lucide-react';
import { UserSettings } from '../types';
import { supabase } from '../lib/supabase';

const INITIAL_SETTINGS: UserSettings = {
  profile: {
    name: '',
    email: '',
    phone: '',
    firmName: '',
    avatarUrl: ''
  },
  notifications: {
    email: true,
    push: true,
    caseUpdates: true,
    newsDigest: false
  },
  security: {
    twoFactorEnabled: false
  },
  billing: {
    plan: 'Free',
    nextBillingDate: new Date()
  },
  integrations: {}
};

const INTEGRATION_CATEGORIES = [
  {
    title: 'Document Management',
    items: [
      { name: 'Google Drive', icon: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg', description: 'Sync and manage your legal documents.' },
      { name: 'Google Sheets', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg', description: 'Collaborate on legal schedules and data analytics.' },
      { name: 'OneDrive', icon: '/integrations/onedrive.png', description: 'Microsoft cloud storage integration.' },
    ]
  },
  {
    title: 'Communication',
    items: [
      { name: 'Slack', icon: '/integrations/slack.png', description: 'Team communication and collaboration.' },
      { name: 'Gmail', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg', description: 'Secure legal correspondence.' },
      { name: 'Microsoft Teams', icon: '/integrations/teams.png', description: 'Chat, meetings, and file sharing.' },
    ]
  },
  {
    title: 'Calendar & Scheduling',
    items: [
      { name: 'Google Calendar', icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg', description: 'Schedule meetings and court dates.' },
      { name: 'Outlook Calendar', icon: '/integrations/outlook.png', description: 'Microsoft custom calendar integration.' },
    ]
  }
];

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'billing' | 'integrations' | 'advanced'>('profile');
  const [settings, setSettings] = useState<UserSettings>(INITIAL_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setSettings({
            profile: {
              name: data.profile_name || user.user_metadata?.full_name || user.email?.split('@')[0] || '',
              email: data.profile_email || user.email || '',
              phone: data.profile_phone || '',
              firmName: data.profile_firm_name || '',
              avatarUrl: data.profile_avatar_url || user.user_metadata?.avatar_url || ''
            },
            notifications: {
              email: data.notifications_email ?? true,
              push: data.notifications_push ?? true,
              caseUpdates: data.notifications_case_updates ?? true,
              newsDigest: data.notifications_news_digest ?? false
            },
            security: {
              twoFactorEnabled: data.security_two_factor_enabled ?? false
            },
            billing: {
              plan: data.billing_plan || 'Free',
              nextBillingDate: data.billing_next_date ? new Date(data.billing_next_date) : new Date()
            },
            integrations: data.integrations || {}
          });
        } else {
          // Initialize with metadata if no record exists
          setSettings(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
              email: user.email || '',
              avatarUrl: user.user_metadata?.avatar_url || ''
            }
          }));
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          id: user.id,
          profile_name: settings.profile.name,
          profile_email: settings.profile.email,
          profile_phone: settings.profile.phone,
          profile_firm_name: settings.profile.firmName,
          profile_avatar_url: settings.profile.avatarUrl,
          notifications_email: settings.notifications.email,
          notifications_push: settings.notifications.push,
          notifications_case_updates: settings.notifications.caseUpdates,
          notifications_news_digest: settings.notifications.newsDigest,
          security_two_factor_enabled: settings.security.twoFactorEnabled,
          integrations: settings.integrations,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setSaveStatus('error');
    }
  };

  const handleToggle = (category: keyof UserSettings, key: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category] as any,
        [key]: !(prev[category] as any)[key]
      }
    }));
  };

  const handleIntegrationToggle = (name: string) => {
    setSettings(prev => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        [name]: !prev.integrations[name]
      }
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'integrations', label: 'Integrations', icon: Plug },
    { id: 'advanced', label: 'Advanced', icon: AlertTriangle },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-white bg-dots p-8 h-full">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-black tracking-tighter mb-2">Settings</h1>
        <p className="text-gray-400 text-sm font-medium mb-8">Manage your account preferences and subscription.</p>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                    ? 'bg-primary/10 text-primary border border-primary/15 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                  }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-primary' : ''}`} />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            ))}

            <div className="pt-8 mt-8 border-t border-gray-100">
              <button 
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = '/';
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-xl shadow-black/5 min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-black mb-6">Profile Information</h2>
                    <div className="flex items-center gap-6 mb-8">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gray-100 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-primary/20">
                          <img src={settings.profile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${settings.profile.name}`} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center border-2 border-white shadow-sm cursor-pointer hover:bg-primary/90 transition-colors">
                          <User className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-black">{settings.profile.name}</p>
                        <p className="text-xs text-gray-400 font-medium">{settings.profile.email}</p>
                        <button className="mt-2 px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[11px] font-bold hover:bg-gray-100 transition-colors text-gray-600">
                          Change Avatar
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                        <input
                          type="text"
                          value={settings.profile.name}
                          onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, name: e.target.value } })}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                        <input
                          type="email"
                          value={settings.profile.email}
                          onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, email: e.target.value } })}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={settings.profile.phone}
                          onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, phone: e.target.value } })}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Firm Name</label>
                        <input
                          type="text"
                          value={settings.profile.firmName}
                          onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, firmName: e.target.value } })}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div className="pt-6 flex flex-col md:flex-row items-center justify-end gap-3">
                      {saveStatus === 'success' && (
                        <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 animate-pulse">
                          <Check className="w-4 h-4" />
                          Profile Updated
                        </span>
                      )}
                      {saveStatus === 'error' && (
                        <span className="text-xs font-bold text-red-500">Error saving changes</span>
                      )}
                      
                      <div className="flex gap-3">
                        <button className="px-5 py-2.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all">
                          Cancel
                        </button>
                        <button 
                          onClick={handleSave}
                          disabled={saveStatus === 'saving'}
                          className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
                        >
                          {saveStatus === 'saving' ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : <Check className="w-4 h-4" />}
                          {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-black mb-6">Notification Preferences</h2>

                    <div className="space-y-4">
                      {Object.entries(settings.notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <div>
                            <h3 className="text-sm font-bold text-black capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                            <p className="text-xs text-gray-400 font-medium">Receive notifications via {key}</p>
                          </div>
                          <button
                            onClick={() => handleToggle('notifications', key)}
                            className={`text-2xl transition-colors ${value ? 'text-primary' : 'text-gray-300'}`}
                          >
                            {value ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-black mb-6">Security Settings</h2>

                    <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl mb-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-blue-900 mb-1">Two-Factor Authentication</h3>
                          <p className="text-xs text-blue-700/80 mb-4 leading-relaxed">
                            Add an extra layer of security to your account by enabling 2FA. We'll send a code to your phone when you sign in.
                          </p>
                          <button
                            onClick={() => handleToggle('security', 'twoFactorEnabled')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${settings.security.twoFactorEnabled
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                          >
                            {settings.security.twoFactorEnabled ? 'Enabled' : 'Enable 2FA'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-black uppercase tracking-widest">Password</h3>
                      <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors group">
                        <span className="text-sm font-medium text-gray-600">Change Password</span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'billing' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-black mb-6">Billing & Subscription</h2>

                    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-8 rounded-[2rem] shadow-2xl shadow-black/20 relative overflow-hidden mb-8">
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                          <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Current Plan</p>
                            <h3 className="text-3xl font-bold text-white">Pro Plan</h3>
                          </div>
                          <span className="px-3 py-1.5 bg-green-500/20 backdrop-blur-md rounded-full text-xs font-bold border border-green-400/20 text-green-400 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                            Active
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                          <CreditCard className="w-4 h-4" />
                          Next billing date: <span className="text-white font-bold">{settings.billing.nextBillingDate.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-30 -translate-y-1/2 translate-x-1/2"></div>
                      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 rounded-full blur-[80px] opacity-10 translate-y-1/2 -translate-x-1/4"></div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-black uppercase tracking-widest mb-2">Payment Methods</h3>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center text-[8px] font-bold text-gray-500">VISA</div>
                          <div>
                            <p className="text-sm font-bold text-black">•••• •••• •••• 4242</p>
                            <p className="text-xs text-gray-400">Expires 12/25</p>
                          </div>
                        </div>
                        <button className="text-xs font-bold text-primary hover:text-primary-hover">Edit</button>
                      </div>
                      <button className="w-full py-3 border border-dashed border-gray-300 rounded-xl text-xs font-bold text-gray-500 hover:text-black hover:border-gray-400 transition-colors flex items-center justify-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Add Payment Method
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'integrations' && (
                  <div className="space-y-8">
                    <h2 className="text-xl font-bold text-black mb-6">Integrations</h2>
                    <p className="text-gray-500 text-sm mb-8">Connect your favorite tools to streamline your legal workflow.</p>

                    <div className="space-y-8">
                      {INTEGRATION_CATEGORIES.map((category) => (
                        <div key={category.title}>
                          <h3 className="text-sm font-bold text-black uppercase tracking-widest mb-4">{category.title}</h3>
                          <div className="space-y-3">
                            {category.items.map((item) => (
                              <div key={item.name} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 transition-all shadow-sm hover:shadow-md">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center p-2 border border-gray-100">
                                    {item.icon ? (
                                      <img src={item.icon} alt={item.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                                    ) : (
                                      <Plug className="w-6 h-6 text-gray-400" />
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-bold text-black">{item.name}</h4>
                                    <p className="text-xs text-gray-400 font-medium">{item.description}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  {settings.integrations[item.name] && (
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                                      <Check className="w-3 h-3" />
                                      Connected
                                    </span>
                                  )}
                                  <button
                                    onClick={() => handleIntegrationToggle(item.name)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${settings.integrations[item.name] ? 'bg-black' : 'bg-gray-200'
                                      }`}
                                  >
                                    <span
                                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.integrations[item.name] ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'advanced' && (
                  <div className="space-y-8">
                    <h2 className="text-xl font-bold text-black mb-6">Advanced Settings</h2>

                    <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                          <h3 className="text-sm font-bold text-black mb-1 flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 text-gray-500" />
                            Data Management & Collaboration
                          </h3>
                          <p className="text-xs text-gray-400 font-medium">Manage your workspace data and team access.</p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3">
                          <button className="px-5 py-2.5 bg-[#fcfbf9] border border-gray-200 rounded-xl text-xs font-bold hover:bg-white transition-all shadow-sm flex items-center gap-2 text-gray-700">
                            <Download className="w-3.5 h-3.5" />
                            Export
                          </button>
                          <button className="px-5 py-2.5 bg-[#fcfbf9] border border-gray-200 rounded-xl text-xs font-bold hover:bg-white transition-all shadow-sm flex items-center gap-2 text-gray-700">
                            <Link className="w-3.5 h-3.5" />
                            Invite link
                          </button>
                          <button className="px-6 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-md flex items-center gap-2 active:scale-95">
                            <UserPlus className="w-3.5 h-3.5" />
                            Invite members
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="border border-red-100 rounded-2xl overflow-hidden">
                      <div className="bg-red-50 p-4 border-b border-red-100 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <h3 className="text-sm font-bold text-red-900">Danger Zone</h3>
                      </div>
                      <div className="p-6 bg-white space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-black">Transfer Ownership</p>
                            <p className="text-xs text-gray-400">Transfer this workspace to another user. This action cannot be undone.</p>
                          </div>
                          <button className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors">
                            Transfer
                          </button>
                        </div>
                        <div className="h-px bg-gray-100" />
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-black">Reset Workspace</p>
                            <p className="text-xs text-gray-400">Remove all cases, documents, and chat history. Settings will be preserved.</p>
                          </div>
                          <button className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors">
                            Reset Data
                          </button>
                        </div>
                        <div className="h-px bg-gray-100" />
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-black">Delete Account</p>
                            <p className="text-xs text-gray-400">Permanently delete your account and all associated data.</p>
                          </div>
                          <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors flex items-center gap-2">
                            <Trash2 className="w-3 h-3" />
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
