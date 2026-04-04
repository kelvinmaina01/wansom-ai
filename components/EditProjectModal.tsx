import React, { useState, useEffect } from 'react';
import { X, Folder, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

// ─── All integrations we support ─────────────────────────────────────────────
const ALL_CONNECTORS = [
  { id: 'gdrive', name: 'Google Drive', icon: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg' },
  { id: 'slack', name: 'Slack', icon: '/integrations/slack.png' },
  { id: 'gmail', name: 'Gmail', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg' },
  { id: 'gcal', name: 'Google Calendar', icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg' },
  { id: 'gsheets', name: 'Google Sheets', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg' },
  { id: 'onedrive', name: 'OneDrive', icon: '/integrations/onedrive.png' },
  { id: 'teams', name: 'Microsoft Teams', icon: 'https://i.ibb.co/TqhfJhvT/microsoft-teams-6971301-1280.webp' },
  { id: 'outlook', name: 'Outlook Calendar', icon: '/integrations/outlook.png' },
];

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  project: {
    title: string;
    description?: string;
    metadata?: {
      connectors?: string[];
    };
  };
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ isOpen, onClose, onSave, project }) => {
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description || '',
    connectors: project.metadata?.connectors || [] as string[],
  });

  // ─── The user's actually authorized integrations ──────────────────────────
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());
  const [loadingConnectors, setLoadingConnectors] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Reset form to latest project data
    setFormData({
      title: project.title,
      description: project.description || '',
      connectors: project.metadata?.connectors || [],
    });

    // Fetch which integrations this user actually has connected
    const fetchConnected = async () => {
      setLoadingConnectors(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
          .from('user_integrations')
          .select('provider')
          .eq('user_id', user.id);
        if (data) setConnectedIds(new Set(data.map((i: any) => i.provider)));
      } catch (e) {
        console.error('Failed to fetch integrations:', e);
      } finally {
        setLoadingConnectors(false);
      }
    };
    fetchConnected();
  }, [isOpen, project]);

  const toggleConnector = (id: string) => {
    setFormData(prev => ({
      ...prev,
      connectors: prev.connectors.includes(id)
        ? prev.connectors.filter(c => c !== id)
        : [...prev.connectors, id],
    }));
  };

  // Only show connectors the user has actually authorized
  const availableConnectors = ALL_CONNECTORS.filter(c => connectedIds.has(c.id));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl"
        >
          <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-black tracking-tight">Edit project</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center">
                <Folder className="w-10 h-10 text-gray-900" />
              </div>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-black text-black tracking-tight ml-1">Project name</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 font-bold text-black focus:outline-none focus:ring-1 focus:ring-black transition-all"
                />
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <label className="text-sm font-black text-black tracking-tight ml-1">
                  Instructions <span className="text-gray-400 font-medium">(optional)</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder='e.g. "Focus on Kenyan employment law", "Maintain a professional tone".'
                  className="w-full h-36 bg-gray-50 border border-gray-100 rounded-2xl p-5 font-medium text-gray-600 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-black transition-all resize-none"
                />
              </div>

              {/* Connectors — real, editable */}
              <div className="space-y-3">
                <label className="text-sm font-black text-black tracking-tight ml-1">
                  Connectors <span className="text-gray-400 font-medium">(optional)</span>
                </label>
                {loadingConnectors ? (
                  <div className="flex items-center gap-3 text-gray-400 text-sm p-4 bg-gray-50 rounded-2xl">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading your integrations...
                  </div>
                ) : availableConnectors.length === 0 ? (
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-center">
                    <p className="text-sm text-gray-400 font-medium">No integrations connected yet.</p>
                    <p className="text-xs text-gray-300 mt-1">Go to the Integrations page to connect apps.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {availableConnectors.map(c => {
                      const isSelected = formData.connectors.includes(c.id);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleConnector(c.id)}
                          className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                            isSelected
                              ? 'bg-black border-black text-white'
                              : 'bg-gray-50 border-gray-100 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center p-1 shadow-sm shrink-0">
                            <img src={c.icon} alt={c.name} className="w-full h-full object-contain"
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          </div>
                          <span className="text-[11px] font-bold flex-1 text-left">{c.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={onClose} className="px-8 py-3 bg-white border border-gray-100 rounded-xl font-bold text-black hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button
                onClick={() => onSave(formData)}
                disabled={!formData.title.trim()}
                className="px-10 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-900 transition-all disabled:opacity-40"
              >
                Save
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditProjectModal;
