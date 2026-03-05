import React, { useState } from 'react';
import {
  Check,
  Plug,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Zap,
  Globe,
  Lock,
  Search
} from 'lucide-react';
import { motion } from 'motion/react';

interface IntegrationItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  metric: string;
  metricType: 'sync' | 'security' | 'active' | 'search';
}

interface IntegrationCategory {
  title: string;
  items: IntegrationItem[];
}

const INTEGRATION_CATEGORIES: IntegrationCategory[] = [
  {
    title: 'Document Management',
    items: [
      {
        id: 'gdrive',
        name: 'Google Drive',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg',
        description: 'Sync and manage your legal documents across your entire firm.',
        metric: 'Real-time Sync',
        metricType: 'sync'
      },
      {
        id: 'gsheets',
        name: 'Google Sheets',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg',
        description: 'Collaborate on legal schedules, fee tracking, and data analysis.',
        metric: 'Data Live-Sync',
        metricType: 'sync'
      },
      {
        id: 'onedrive',
        name: 'OneDrive',
        icon: '/integrations/onedrive.png',
        description: 'Microsoft 365 cloud storage integration for law firms.',
        metric: 'Enterprise Sync',
        metricType: 'sync'
      },
    ]
  },
  {
    title: 'Communication',
    items: [
      {
        id: 'slack',
        name: 'Slack',
        icon: '/integrations/slack.png',
        description: 'Team communication and secure collaboration for legal teams.',
        metric: 'Active Connect',
        metricType: 'active'
      },
    ]
  },
  {
    title: 'Calendar & Scheduling',
    items: [
      {
        id: 'gcal',
        name: 'Google Calendar',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg',
        description: 'Schedule client meetings and court dates automatically.',
        metric: 'Live Calendar',
        metricType: 'active'
      },
      {
        id: 'outlook',
        name: 'Outlook Calendar',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg',
        description: 'Microsoft enterprise calendar integration for advocates.',
        metric: 'Firm Sync',
        metricType: 'sync'
      },
    ]
  }
];

const Integrations: React.FC = () => {
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set(['gdrive', 'clio', 'slack', 'docusign', 'gcal']));
  const [logoErrors, setLogoErrors] = useState<Set<string>>(new Set());

  const toggleConnection = (id: string) => {
    setConnectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleLogoError = (id: string) => {
    setLogoErrors(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const getMetricStyles = (type: string) => {
    switch (type) {
      case 'sync': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'security': return 'text-red-500 bg-red-50 border-red-100';
      case 'active': return 'text-green-600 bg-green-50 border-green-100';
      case 'search': return 'text-purple-600 bg-purple-50 border-purple-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'sync': return <RefreshCw className="w-3 h-3" />;
      case 'security': return <Lock className="w-3 h-3" />;
      case 'active': return <Zap className="w-3 h-3" />;
      case 'search': return <Search className="w-3 h-3" />;
      default: return <Globe className="w-3 h-3" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white bg-dots p-12 h-full font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-16">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-extrabold text-black tracking-tighter mb-4 font-display"
          >
            Integrations
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg font-medium max-w-2xl"
          >
            Connect your favorite legal and productivity tools to build a seamless, high-performance workflow.
          </motion.p>
        </div>

        {/* Categories Grid */}
        <div className="space-y-20">
          {INTEGRATION_CATEGORIES.map((category, catIdx) => (
            <div key={category.title}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIdx * 0.1 }}
                className="flex items-center gap-4 mb-8"
              >
                <h2 className="text-sm font-black text-black uppercase tracking-[0.3em] font-display">{category.title}</h2>
                <div className="h-px bg-gray-100 flex-1" />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.items.map((item, itemIdx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (catIdx * 0.1) + (itemIdx * 0.05) }}
                    className="bg-white border-2 border-gray-50 rounded-[2.5rem] p-8 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all group relative overflow-hidden flex flex-col justify-between h-full"
                  >
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-8">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center p-4 shadow-xl shadow-black/5 border border-gray-50 group-hover:scale-105 transition-transform duration-500">
                          {!logoErrors.has(item.id) ? (
                            <img
                              src={item.icon}
                              alt={item.name}
                              className="w-full h-full object-contain"
                              onError={() => handleLogoError(item.id)}
                            />
                          ) : (
                            <div className={`w-full h-full rounded-2xl flex items-center justify-center text-white font-black text-2xl font-display ${
                              item.metricType === 'sync' ? 'bg-blue-500' :
                              item.metricType === 'security' ? 'bg-red-500' :
                              item.metricType === 'active' ? 'bg-green-500' :
                              'bg-purple-500'
                            }`}>
                              {item.name.charAt(0)}
                            </div>
                          )}
                        </div>

                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black uppercase tracking-wider font-sans ${getMetricStyles(item.metricType)}`}>
                          {getMetricIcon(item.metricType)}
                          {item.metric}
                        </div>
                      </div>

                      <div className="mb-8">
                        <h3 className="text-3xl font-bold text-black mb-3 tracking-tight font-display">{item.name}</h3>
                        <p className="text-base text-gray-500 font-medium leading-relaxed font-sans">{item.description}</p>
                      </div>
                    </div>

                    <div className="relative z-10">
                      <button
                        onClick={() => toggleConnection(item.id)}
                        className={`w-full py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all font-display ${connectedIds.has(item.id)
                            ? 'bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100'
                            : 'bg-black text-white hover:bg-primary shadow-xl shadow-black/10 active:scale-95'
                          }`}
                      >
                        {connectedIds.has(item.id) ? (
                          <span className="flex items-center justify-center gap-2">
                            <Check className="w-5 h-5" />
                            Connected
                          </span>
                        ) : (
                          'Connect Integration'
                        )}
                      </button>
                    </div>

                    {/* Decorative Background Element */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Custom Request Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-32 p-12 bg-black rounded-[3.5rem] relative overflow-hidden group border border-white/5"
        >
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary rounded-full blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity duration-700" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10 mx-auto md:mx-0">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-6 tracking-tight font-display">Need a enterprise custom integration?</h2>
              <p className="text-gray-400 text-lg font-medium max-w-xl leading-relaxed">
                Our engineering team specalizes in building deep, custom bridges between Lawlify and your legacy on-premise systems or bespoke firm software.
              </p>
            </div>

            <div className="shrink-0">
              <button className="px-12 py-6 bg-primary text-white font-black uppercase tracking-widest rounded-2xl hover:bg-primary-hover hover:scale-105 transition-all shadow-2xl shadow-primary/30 active:scale-95">
                Contact Enterprise Sales
              </button>
            </div>
          </div>
        </motion.div>

        {/* Support Link */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3">
            <Lock className="w-3.5 h-3.5" />
            All integrations are SOC2 Type II and GDPR Compliant
          </p>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
