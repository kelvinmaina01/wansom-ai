import React, { useState } from 'react';
import { Check, Plug, ExternalLink } from 'lucide-react';

interface IntegrationItem {
  name: string;
  icon: string;
  description: string;
}

interface IntegrationCategory {
  title: string;
  items: IntegrationItem[];
}

const INTEGRATION_CATEGORIES: IntegrationCategory[] = [
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

const Integrations: React.FC = () => {
  const [connectedIntegrations, setConnectedIntegrations] = useState<Record<string, boolean>>({
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
    'Google Calendar': true,
    'Outlook Calendar': false
  });

  const handleToggle = (name: string) => {
    setConnectedIntegrations(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white bg-dots p-8 h-full">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-black tracking-tighter mb-2">Integrations</h1>
          <p className="text-gray-400 text-sm font-medium">Connect your favorite tools to streamline your legal workflow.</p>
        </div>

        <div className="space-y-12">
          {INTEGRATION_CATEGORIES.map((category) => (
            <div key={category.title}>
              <h2 className="text-sm font-bold text-black uppercase tracking-widest mb-6">{category.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item) => (
                  <div 
                    key={item.name} 
                    className="bg-white border border-gray-100 rounded-[2rem] p-6 hover:border-gray-200 transition-all shadow-sm hover:shadow-xl group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center p-3 border border-gray-100 group-hover:border-gray-200 transition-all">
                        {item.icon ? (
                          <img src={item.icon} alt={item.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                        ) : (
                          <Plug className="w-7 h-7 text-gray-400" />
                        )}
                      </div>
                      {connectedIntegrations[item.name] && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                          <Check className="w-3 h-3" />
                          Connected
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-black mb-2">{item.name}</h3>
                    <p className="text-xs text-gray-400 font-medium mb-6 leading-relaxed">{item.description}</p>
                    <button 
                      onClick={() => handleToggle(item.name)}
                      className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${
                        connectedIntegrations[item.name]
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          : 'bg-black text-white hover:bg-gray-900 shadow-lg shadow-black/10'
                      }`}
                    >
                      {connectedIntegrations[item.name] ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200 shrink-0">
              <ExternalLink className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-black mb-2">Need a custom integration?</h3>
              <p className="text-sm text-gray-500 font-medium mb-4 leading-relaxed">
                We can build custom integrations for your firm's specific tools and workflows. Contact our team to discuss your requirements.
              </p>
              <button className="px-6 py-3 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-900 transition-all shadow-lg shadow-black/10">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
