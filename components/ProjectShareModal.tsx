import React, { useState } from 'react';
import { X, Mail, Link as LinkIcon, ChevronDown, Check, HelpCircle, ChevronRight, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Member {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
  status?: 'active' | 'pending';
}

interface ProjectShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string, role: string) => void;
  members: Member[];
  projectName: string;
}

const ProjectShareModal: React.FC<ProjectShareModalProps> = ({
  isOpen,
  onClose,
  onInvite,
  members,
  projectName
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [copied, setCopied] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = () => {
    if (!email) return;
    onInvite(email, role);
    setEmail('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="px-8 py-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-black tracking-tight leading-none">Share this project</h3>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-gray-300 cursor-help hover:text-black transition-colors" />
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-black transition-colors rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Invite Section */}
            <div className="px-8 pb-8 space-y-8">
              <div className="flex gap-3">
                <div className="flex-1 bg-gray-50/50 border border-gray-100 rounded-[18px] px-6 py-4 flex items-center justify-between group-within:border-black transition-all">
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest leading-none mb-1">Enter email addresses</p>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder=""
                      className="w-full bg-transparent text-sm font-bold text-black placeholder:text-gray-100 focus:outline-none"
                    />
                  </div>
                  <div className="relative ml-4">
                    <select 
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="appearance-none bg-transparent text-sm font-bold text-gray-500 pr-8 focus:outline-none cursor-pointer hover:text-black transition-colors"
                    >
                      <option value="editor">Can edit</option>
                      <option value="viewer">Can view</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                <button
                  onClick={handleInvite}
                  disabled={!email}
                  className="px-8 py-4 bg-[#b4b4b4] hover:bg-black text-white rounded-[18px] font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50"
                >
                  Invite
                </button>
              </div>

              {/* Members List */}
              <div className="space-y-6 max-h-[220px] overflow-y-auto pr-2 no-scrollbar">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {member.avatar ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 ring-4 ring-yellow-400 ring-offset-2">
                           <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-black font-black text-xs ring-2 ring-yellow-100 ring-offset-2">
                          {member.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-black text-black leading-tight">{member.name}</p>
                          {member.status === 'pending' && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-400 text-[8px] font-black uppercase tracking-widest rounded-md">Pending</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-300 font-bold">{member.email}</p>
                      </div>
                    </div>
                    
                    {member.role === 'owner' ? (
                      <span className="text-sm font-bold text-gray-300">Owner</span>
                    ) : (
                      <div className="flex items-center gap-3">
                         <div className="relative">
                            <button className="text-sm font-bold text-gray-400 hover:text-black flex items-center gap-1">
                               Can edit <ChevronDown className="w-3 h-3" />
                            </button>
                         </div>
                         <button className="p-1 hover:bg-gray-50 rounded-md transition-colors text-gray-300">
                            <MoreHorizontal className="w-6 h-6" />
                         </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions Section */}
              <div className="space-y-4">
                <button
                  onClick={handleCopyLink}
                  className="w-full py-5 bg-black text-white rounded-[22px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-gray-900 active:scale-[0.98] transition-all shadow-xl shadow-black/10"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 text-primary" />
                      Link Copied
                    </>
                  ) : (
                    <>
                      <LinkIcon className="w-5 h-5" />
                      Copy link
                    </>
                  )}
                </button>
                <div className="flex items-center justify-between text-gray-400 hover:text-black transition-colors cursor-pointer group px-1">
                  <p className="text-[11px] font-bold uppercase tracking-[0.05em] opacity-60 group-hover:opacity-100">
                    Upgrade to team plan to enable collaboration with team.
                  </p>
                  <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-100" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectShareModal;
