import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  XMarkIcon, 
  MagnifyingGlassIcon,
  DocumentIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface VaultDocument {
  id: string;
  name: string;
  type: string;
  lastModified: string;
  content: string;
  storage_path?: string;
}

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDocuments: (documents: VaultDocument[]) => void;
}

const VaultModal: React.FC<VaultModalProps> = ({ isOpen, onClose, onAddDocuments }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [docs, setDocs] = useState<VaultDocument[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch real files from Supabase on open
  useEffect(() => {
    if (!isOpen) return;
    setSelectedIds([]);
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data, error } = await supabase
          .from('files')
          .select('id, name, type, created_at, storage_path')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);
        if (!error && data) {
          setDocs(data.map(f => ({
            id: f.id,
            name: f.name,
            type: (f.type || 'doc').toUpperCase(),
            lastModified: new Date(f.created_at).toLocaleDateString(),
            content: `[File: ${f.name}]`,
            storage_path: f.storage_path,
          })));
        }
      } catch (e) {
        console.error('VaultModal fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, [isOpen]);

  const filteredDocs = docs.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAdd = () => {
    const selectedDocs = docs.filter(doc => selectedIds.includes(doc.id));
    onAddDocuments(selectedDocs);
    onClose();
    setSelectedIds([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[24px] shadow-2xl overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-black tracking-tight">Add Documents from Vault</h2>
                <p className="text-sm text-gray-400 font-medium">Select documents from your vault to add to this workspace</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Search */}
            <div className="p-6 bg-gray-50/50">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                />
              </div>
            </div>

            {/* Document List */}
            <div className="max-h-[400px] overflow-y-auto p-2 no-scrollbar">
              {loading ? (
                <div className="py-12 flex flex-col items-center gap-3 text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-sm font-medium">Loading your vault...</span>
                </div>
              ) : filteredDocs.length > 0 ? (
                <div className="space-y-1">
                  {filteredDocs.map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => toggleSelect(doc.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${selectedIds.includes(doc.id) ? 'bg-primary/5 border border-primary/10' : 'hover:bg-gray-50 border border-transparent'}`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${selectedIds.includes(doc.id) ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-white group-hover:text-primary'}`}>
                        <DocumentIcon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`font-bold tracking-tight ${selectedIds.includes(doc.id) ? 'text-primary' : 'text-black'}`}>{doc.name}</p>
                        <p className="text-xs text-gray-400 font-medium">Modified {doc.lastModified} • {doc.type}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedIds.includes(doc.id) ? 'bg-primary border-primary' : 'border-gray-200'}`}>
                        {selectedIds.includes(doc.id) && <CheckIcon className="w-4 h-4 text-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                    <DocumentIcon className="w-8 h-8 text-gray-200" />
                  </div>
                  <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                    {docs.length === 0 ? 'No files uploaded yet' : 'No documents match your search'}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-50 flex items-center justify-end gap-3 bg-gray-50/30">
              <button onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-black transition-colors">
                Cancel
              </button>
              <button 
                onClick={handleAdd}
                disabled={selectedIds.length === 0}
                className="px-8 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-light disabled:opacity-50 disabled:shadow-none transition-all"
              >
                Add to chat {selectedIds.length > 0 && `(${selectedIds.length})`}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VaultModal;
