import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Plus, ExternalLink, ShieldCheck, Zap } from 'lucide-react';
import { INTEGRATION_CATEGORIES, IntegrationItem } from './Integrations';

interface ConnectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectedIds: Set<string>;
  onConnect: (item: IntegrationItem) => void;
}

const ConnectorModal: React.FC<ConnectorModalProps> = ({ 
  isOpen, 
  onClose, 
  connectedIds,
  onConnect 
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'Apps' | 'Custom API' | 'Custom MCP'>('Apps');

  const allItems = React.useMemo(() => {
    return INTEGRATION_CATEGORIES.flatMap(cat => cat.items);
  }, []);

  const filteredItems = allItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-5xl h-[85vh] bg-[#F7F7F7] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-white/20"
          >
            {/* Header */}
            <div className="px-10 pt-8 pb-6 bg-white border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black tracking-tight">Connectors</h2>
              <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Sub-header / Tabs */}
            <div className="px-10 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-8">
                {['Apps', 'Custom API', 'Custom MCP'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => tab === 'Apps' && setActiveTab(tab)}
                    className={`relative py-2 text-sm font-bold tracking-tight transition-all ${
                      activeTab === tab ? 'text-black' : 'text-gray-400 cursor-not-allowed opacity-50'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full"
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-xl text-sm font-medium focus:outline-none transition-all w-64"
                />
              </div>
            </div>

            {/* Grid Content */}
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.01 }}
                    className="p-6 bg-white border border-gray-100 rounded-3xl group transition-all hover:shadow-xl hover:shadow-black/[0.02]"
                  >
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center p-3 shadow-sm group-hover:shadow-md transition-shadow">
                        <img src={item.icon} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-lg font-bold text-black tracking-tight truncate">{item.name}</h3>
                          <button 
                            onClick={() => onConnect(item)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              connectedIds.has(item.id)
                                ? 'bg-green-50 text-green-600 border border-green-100'
                                : 'bg-gray-50 text-black hover:bg-black hover:text-white border border-gray-100'
                            }`}
                          >
                            {connectedIds.has(item.id) ? 'Connected' : 'Connect'}
                          </button>
                        </div>
                        <p className="text-[13px] text-gray-400 font-medium leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {filteredItems.length === 0 && (
                  <div className="col-span-full py-20 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Search className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No connectors found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-10 py-6 bg-white border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-green-500" />
                  <span>Enterprise Secure</span>
                </div>
                <div className="w-1 h-1 bg-gray-200 rounded-full" />
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-primary" />
                  <span>Zero Persistence Connections</span>
                </div>
              </div>
              
              <button 
                onClick={() => alert("Connector request form coming soon!")}
                className="flex items-center gap-2 text-xs font-bold text-primary hover:underline transition-all"
              >
                Request a Connector <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConnectorModal;
