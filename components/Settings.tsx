import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  ExternalLink
} from 'lucide-react';
import { UserSettings } from '../types';

const MOCK_SETTINGS: UserSettings = {
  profile: {
    name: 'Advocate Kelvin Maina',
    email: 'kelvin202maina@gmail.com',
    phone: '+254 712 345 678',
    firmName: 'Maina & Associates Advocates'
  },
  notifications: {
    email: true,
    push: true,
    caseUpdates: true,
    newsDigest: false
  },
  security: {
    twoFactorEnabled: true
  },
  billing: {
    plan: 'Pro',
    nextBillingDate: new Date('2024-04-01')
  },
  integrations: {
    'Google Drive': true,
    'Dropbox': false,
    'OneDrive': false,
    'Clio': true,
    'MyCase': false,
    'Slack': true,
    'Microsoft Teams': false,
    'DocuSign': true,
    'Adobe Sign': false,
    'Westlaw': false,
    'LexisNexis': false,
    'QuickBooks': false,
    'Google Calendar': true,
    'Outlook Calendar': false
  }
};

const INTEGRATION_CATEGORIES = [
  {
    title: 'Document Management',
    items: [
      { name: 'Google Drive', icon: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg', description: 'Sync and manage your legal documents.' },
      { name: 'Dropbox', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg', description: 'Secure file storage and sharing.' },
      { name: 'OneDrive', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Microsoft_Office_OneDrive_%282019%E2%80%93present%29.svg', description: 'Microsoft cloud storage integration.' },
    ]
  },
  {
    title: 'Practice Management',
    items: [
      { name: 'Clio', icon: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Clio_Logo.png', description: 'Leading legal practice management software.' },
      { name: 'MyCase', icon: '', description: 'All-in-one case management solution.' },
    ]
  },
  {
    title: 'Communication',
    items: [
      { name: 'Slack', icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg', description: 'Team communication and collaboration.' },
      { name: 'Microsoft Teams', icon: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg', description: 'Chat, meetings, and file sharing.' },
    ]
  },
  {
    title: 'E-Signature',
    items: [
      { name: 'DocuSign', icon: '', description: 'Send and sign agreements securely.' },
      { name: 'Adobe Sign', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Adobe_Sign_icon.svg', description: 'Trusted e-signatures from Adobe.' },
    ]
  },
  {
    title: 'Legal Research',
    items: [
      { name: 'Westlaw', icon: '', description: 'Comprehensive legal research platform.' },
      { name: 'LexisNexis', icon: '', description: 'Legal, regulatory, and business information.' },
    ]
  },
  {
    title: 'Calendar & Scheduling',
    items: [
      { name: 'Google Calendar', icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg', description: 'Schedule meetings and court dates.' },
      { name: 'Outlook Calendar', icon: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg', description: 'Microsoft calendar integration.' },
    ]
  }
];

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'billing' | 'integrations' | 'advanced'>('profile');
  const [settings, setSettings] = useState<UserSettings>(MOCK_SETTINGS);

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
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
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
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${settings.profile.name}`} alt="Avatar" className="w-full h-full object-cover" />
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

                    <div className="pt-6 flex justify-end gap-3">
                      <button className="px-5 py-2.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all">
                        Cancel
                      </button>
                      <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Save Changes
                      </button>
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

                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                      <h3 className="text-sm font-bold text-black mb-4 flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-gray-500" />
                        Data Management
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-black">Export Data</p>
                            <p className="text-xs text-gray-400">Download a copy of your data, including cases and documents.</p>
                          </div>
                          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">
                            Export
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
