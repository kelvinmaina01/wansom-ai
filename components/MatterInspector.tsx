import React, { useEffect, useState } from 'react';
import {
  FileText, Link as LinkIcon, Puzzle,
  ChevronRight, Brain, Zap, Shield,
  Settings, Info, Loader2, X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

// ─── All known connectors for icon rendering ─────────────────────────────────
const CONNECTOR_META: Record<string, { name: string; icon: string }> = {
  gdrive: { name: 'Google Drive', icon: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg' },
  slack: { name: 'Slack', icon: '/integrations/slack.png' },
  gmail: { name: 'Gmail', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg' },
  gcal: { name: 'Google Calendar', icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg' },
  gsheets: { name: 'Google Sheets', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg' },
  onedrive: { name: 'OneDrive', icon: '/integrations/onedrive.png' },
  teams: { name: 'Microsoft Teams', icon: 'https://i.ibb.co/TqhfJhvT/microsoft-teams-6971301-1280.webp' },
  outlook: { name: 'Outlook', icon: '/integrations/outlook.png' },
};

interface MatterInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
  onEditInstructions: () => void;
  onManageSkills: () => void;
  onManageFiles: () => void;
  onManageConnectors: () => void;
}

const MatterInspector: React.FC<MatterInspectorProps> = ({
  isOpen,
  onClose,
  project,
  onEditInstructions,
  onManageSkills,
  onManageFiles,
  onManageConnectors,
}) => {
  const [fileCount, setFileCount] = useState<number | null>(null);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // ─── Fetch real file count for this project ────────────────────────────────
  useEffect(() => {
    if (!isOpen || !project?.id) return;

    const fetchFileCount = async () => {
      setLoadingFiles(true);
      try {
        const { count } = await supabase
          .from('files')
          .select('*', { count: 'exact', head: true })
          .eq('folder_id', project.id); // linked by folder/case ID

        // Also check project_documents table if it exists
        const { count: docCount } = await supabase
          .from('project_documents')
          .select('*', { count: 'exact', head: true })
          .eq('case_id', project.id) as any;

        setFileCount((count || 0) + (docCount || 0));
      } catch {
        setFileCount(0);
      } finally {
        setLoadingFiles(false);
      }
    };

    fetchFileCount();
  }, [isOpen, project?.id]);

  if (!isOpen) return null;

  // ─── Real connector IDs from project metadata ─────────────────────────────
  const connectorIds: string[] = project?.metadata?.connectors || [];
  const enabledSkills: string[] = project?.metadata?.skills || [];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="w-96 h-full bg-white border-l border-gray-100 flex flex-col shadow-2xl z-40 fixed right-0 top-0 overflow-y-auto no-scrollbar"
    >
      <div className="p-8 space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Matter Inspector</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Project Summary */}
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-black tracking-tighter leading-none">{project?.title}</h2>
          <p className="text-gray-400 font-medium text-sm">
            Matter for <span className="text-black font-bold">{project?.client_name}</span>
          </p>
          {project?.metadata?.jurisdiction && (
            <span className="inline-block px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 rounded-full">
              {project.metadata.jurisdiction}
            </span>
          )}
        </div>

        {/* Action Modules */}
        <div className="space-y-4">

          {/* Instructions */}
          <div onClick={onEditInstructions} className="p-6 bg-gray-50/50 border border-gray-100 rounded-[24px] hover:border-black transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm">
                  <Brain className="w-5 h-5 text-black" />
                </div>
                <span className="text-[10px] font-black text-black uppercase tracking-widest">Instructions</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" />
            </div>
            <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed">
              {project?.description || 'No specific instructions added yet.'}
            </p>
          </div>

          {/* Skills */}
          <div onClick={onManageSkills} className="p-6 bg-gray-50/50 border border-gray-100 rounded-[24px] hover:border-black transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm">
                  <Puzzle className="w-5 h-5 text-black" />
                </div>
                <span className="text-[10px] font-black text-black uppercase tracking-widest">Skills</span>
              </div>
              <div className="px-3 py-1 bg-black text-white text-[9px] font-black rounded-lg uppercase tracking-widest">
                {enabledSkills.length} Enabled
              </div>
            </div>
            {enabledSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {enabledSkills.slice(0, 4).map((s: string) => (
                  <span key={s} className="px-2 py-1 bg-white border border-gray-100 rounded text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                    {s.replace(/^(doc-|design-|logic-|jurisdiction-)/, '').replace(/-/g, ' ')}
                  </span>
                ))}
                {enabledSkills.length > 4 && (
                  <span className="text-[9px] font-bold text-gray-300 ml-1">+{enabledSkills.length - 4} More</span>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-300 font-medium">No skills enabled for this project.</p>
            )}
          </div>

          {/* Connectors — real data from metadata */}
          <div onClick={onManageConnectors} className="p-6 bg-gray-50/50 border border-gray-100 rounded-[24px] hover:border-black transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm">
                  <LinkIcon className="w-5 h-5 text-black" />
                </div>
                <span className="text-[10px] font-black text-black uppercase tracking-widest">Connectors</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" />
            </div>
            {connectorIds.length > 0 ? (
              <div className="flex items-center gap-2 flex-wrap">
                {connectorIds.map(id => {
                  const meta = CONNECTOR_META[id];
                  if (!meta) return null;
                  return (
                    <div key={id} className="flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-100 rounded-lg">
                      <img src={meta.icon} alt={meta.name} className="w-3.5 h-3.5 object-contain"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{meta.name}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-300">
                <Zap className="w-4 h-4" />
                <p className="text-xs font-medium">No connectors active for this project.</p>
              </div>
            )}
          </div>

          {/* Files — real count from Supabase */}
          <div onClick={onManageFiles} className="p-6 bg-gray-50/50 border border-gray-100 rounded-[24px] hover:border-black transition-all cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm">
                  <FileText className="w-5 h-5 text-black" />
                </div>
                <span className="text-[10px] font-black text-black uppercase tracking-widest">Files</span>
              </div>
              {loadingFiles ? (
                <Loader2 className="w-4 h-4 animate-spin text-gray-300" />
              ) : (
                <span className={`text-xs font-bold ${fileCount && fileCount > 0 ? 'text-black' : 'text-gray-300'}`}>
                  {fileCount ?? 0} {fileCount === 1 ? 'File' : 'Files'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Project Settings / Footer Actions */}
        <div className="pt-10 border-t border-gray-50 space-y-6">
          {isEditingProject ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <input 
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:border-black"
                placeholder="Matter Title"
              />
              <textarea 
                value={editDesc}
                onChange={e => setEditDesc(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:border-black h-24"
                placeholder="Description"
              />
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsEditingProject(false)}
                  className="flex-1 py-2 bg-gray-100 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    const { error } = await supabase
                      .from('cases')
                      .update({ title: editTitle, description: editDesc })
                      .eq('id', project.id);
                    if (!error) {
                      setIsEditingProject(false);
                      // In a real app we'd refresh the parent state here
                    }
                  }}
                  className="flex-1 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setEditTitle(project.title);
                  setEditDesc(project.description);
                  setIsEditingProject(true);
                }}
                className="flex items-center gap-2 text-[10px] font-black text-gray-300 hover:text-black transition-all uppercase tracking-widest"
              >
                <Settings className="w-4 h-4" />
                Project Settings
              </button>
              <button
                onClick={() => alert('Activity Log: ' + (project?.title || 'Current Matter'))}
                className="flex items-center gap-2 text-[10px] font-black text-gray-300 hover:text-black transition-all uppercase tracking-widest"
              >
                <Info className="w-4 h-4" />
                Activity Log
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MatterInspector;
