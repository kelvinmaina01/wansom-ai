import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, Link as LinkIcon, Puzzle, CheckSquare, 
  Users, Plus, Upload, Trash2, Edit3, Folder,
  CheckCircle2, Circle, Clock, MessageSquare, 
  ChevronRight, Brain, Zap, Scale, Shield,
  MoreHorizontal, Globe, Lock, Search, RefreshCw,
  Bot, X, Archive
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { apiClient } from '../lib/apiClient';
import ProjectCard from './ProjectCard';
import TaskItem from './TaskItem';
import ProjectShareModal from './ProjectShareModal';
import EditProjectModal from './EditProjectModal';
import ProjectInstructionsModal from './ProjectInstructionsModal';
import ProjectSkillsModal from './ProjectSkillsModal';

interface Activity {
  id: string;
  case_id: string;
  user_id?: string;
  user_email?: string;
  action: string;
  description: string;
  created_at: string;
}

// Mock/Default Skills for the selection dropdown
const AVAILABLE_SKILLS = [
  { id: 'jurisdiction-kenya', name: 'Kenya Jurisdiction' },
  { id: 'jurisdiction-uganda', name: 'Uganda Jurisdiction' },
  { id: 'doc-nda', name: 'NDA Drafting' },
  { id: 'doc-employment', name: 'Employment Contracts' },
  { id: 'doc-intelligence', name: 'Document Intelligence' }
];

const ProjectView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [personas, setPersonas] = useState<any[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const [newSkillId, setNewSkillId] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Derived: Current user's role in this project
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const userRole = members.find(m => m.user_id === currentUserId)?.role?.toLowerCase() || 'viewer';
  const isArchived = project?.status === 'archived';
  const isOwnerOrEditor = (userRole === 'owner' || userRole === 'editor') && !isArchived;
  const isOwner = userRole === 'owner';

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setCurrentUserId(data.user.id);
    });
  }, []);

  const logActivity = async (action: string, description: string) => {
    await supabase.from('case_activities').insert([{
      case_id: id,
      user_id: currentUserId,
      user_email: (await supabase.auth.getUser()).data.user?.email,
      action,
      description
    }]);
    fetchActivities();
  };

  const fetchActivities = async () => {
    const { data } = await supabase
      .from('case_activities')
      .select('*')
      .eq('case_id', id)
      .order('created_at', { ascending: false });
    if (data) setActivities(data as Activity[]);
  };

  const fetchProjectData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Project
      const { data: projectData, error: pError } = await supabase
        .from('cases')
        .select('*')
        .eq('id', id)
        .single();
      
      if (pError) throw pError;
      setProject(projectData);

      // 2. Fetch Tasks
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .eq('case_id', id)
        .order('created_at', { ascending: false });
      setTasks(tasksData || []);

      // 3. Fetch Members
      const { data: membersData } = await supabase
        .from('case_members')
        .select('*')
        .eq('case_id', id);
      setMembers(membersData || []);

      // 4. Fetch Files
      const { data: filesData } = await supabase
        .from('files')
        .select('*')
        .eq('case_id', id);
      setFiles(filesData || []);

        // 5. Fetch Real Integrations
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: intData } = await supabase
            .from('user_integrations')
            .select('*')
            .eq('user_id', user.id);
          setIntegrations(intData || []);

          // 6. Fetch AI Personas
          const { data: pData } = await supabase
            .from('ai_personas')
            .select('*')
            .order('created_at', { ascending: true });
          setPersonas(pData || []);
        }

      // 7. Fetch Activities
      fetchActivities();

    } catch (err) {
      console.error('Error fetching project hub data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
       fetchProjectData();
       fetchActivities();
    }
  }, [id]);

  // Real-time Collaboration Pulse (Supabase Presence)
  useEffect(() => {
    if (!id || !currentUserId) return;

    const channel = supabase.channel(`project_pulse:${id}`, {
      config: { presence: { key: currentUserId } }
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users = Object.values(state).flat();
        setActiveUsers(users);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: currentUserId,
            online_at: new Date().toISOString()
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [id, currentUserId]);

  const handleAddTask = async () => {
    const title = prompt('Enter task title:');
    if (!title) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        case_id: id,
        title,
        status: 'pending'
      }])
      .select();

    if (!error && data) {
      setTasks([data[0], ...tasks]);
      logActivity('Created Task', `Added task: ${title}`);
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    if (!isOwnerOrEditor) {
      alert('You do not have permission to modify tasks in this project.');
      return;
    }
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId);

    if (!error) {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      logActivity('Updated Task', `Marked task as ${newStatus}`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (!isOwnerOrEditor) {
      alert('Only owners and editors can upload project files.');
      return;
    }

    setUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('document', file);
    formData.append('caseId', id!);

    try {
      const response = await apiClient.fetch('/api/files/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setFiles([data.file, ...files]);
        logActivity('Uploaded File', `Added document: ${file.name}`);
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      console.error('File upload error:', err);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddSkill = async (skillId: string) => {
    if (!skillId) return;
    const currentSkills = project.metadata?.skills || [];
    if (currentSkills.includes(skillId)) return;

    if (!isOwnerOrEditor) {
      alert('Only owners and editors can modify project skills.');
      return;
    }

    const newSkills = [...currentSkills, skillId];
    const { error } = await supabase
      .from('cases')
      .update({ metadata: { ...project.metadata, skills: newSkills } })
      .eq('id', id);

    if (!error) {
      setProject({ ...project, metadata: { ...project.metadata, skills: newSkills } });
      setNewSkillId('');
      logActivity('Added Skill', `Enabled ${AVAILABLE_SKILLS.find(s => s.id === skillId)?.name || skillId}`);
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    if (!isOwnerOrEditor) {
      alert('Only owners and editors can modify project skills.');
      return;
    }
    const newSkills = (project.metadata?.skills || []).filter((s: string) => s !== skillId);
    
    const { error } = await supabase
      .from('cases')
      .update({ metadata: { ...project.metadata, skills: newSkills } })
      .eq('id', id);

    if (!error) {
      setProject({ ...project, metadata: { ...project.metadata, skills: newSkills } });
      logActivity('Removed Skill', `Disabled ${AVAILABLE_SKILLS.find(s => s.id === skillId)?.name || skillId}`);
    }
  };

  if (loading && !project) {
    return (
      <div className="flex-1 overflow-y-auto bg-white bg-dots p-8 md:p-12 no-scrollbar">
        <div className="max-w-6xl mx-auto flex flex-col gap-12 animate-pulse">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="h-4 w-32 bg-gray-100 rounded-full" />
              <div className="h-16 w-96 bg-gray-100 rounded-2xl" />
              <div className="h-6 w-64 bg-gray-100 rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-gray-50/50 rounded-[32px] border border-gray-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!project && !loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white p-8 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-500">
           <Lock className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-black tracking-tighter mb-2">Access Restricted</h2>
        <p className="text-gray-400 font-medium max-w-sm mb-8">
          You don't have permission to view this project or it doesn't exist.
        </p>
        <button onClick={() => navigate('/app/overview')} className="px-8 py-3 bg-black text-white rounded-xl font-bold">Return Home</button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white bg-dots p-8 md:p-12 no-scrollbar">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4 max-w-3xl">
             <div className="flex items-center gap-3">
               <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                 isArchived ? 'bg-red-50 border-red-100 text-red-500' : 'bg-primary/5 border-primary/20 text-primary animate-pulse'
               }`}>
                 {project.status || 'Active'}
               </div>
               <div className="text-gray-300 font-medium text-xs flex items-center gap-2">
                 <Clock className="w-3 h-3" />
                 Last active {new Date(project.updated_at).toLocaleDateString()}
               </div>
             </div>
             <h1 className="text-7xl font-black text-black tracking-tighter leading-none">{project.title}</h1>
             <p className="text-gray-400 font-medium text-2xl leading-relaxed">
               {project.client_name} — {project.case_type}
             </p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-gray-100 text-gray-900 rounded-[22px] text-sm font-bold hover:border-black hover:shadow-xl transition-all active:scale-95 group"
            >
              <Users className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
              Collaborate
            </button>
            <div className="relative">
               <button
                  onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
                  className="p-4 bg-gray-50 border-2 border-transparent hover:border-gray-200 rounded-[22px] transition-all group"
               >
                  <MoreHorizontal className="w-6 h-6 text-gray-400 group-hover:text-black" />
               </button>
               
               <AnimatePresence>
                  {isHeaderMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-3xl shadow-2xl z-50 overflow-hidden py-2"
                    >
                       <button 
                         onClick={() => { setIsEditModalOpen(true); setIsHeaderMenuOpen(false); }}
                         className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group"
                       >
                          <Folder className="w-5 h-5 text-gray-400 group-hover:text-black" />
                          <span className="text-sm font-bold text-gray-700">Edit project</span>
                       </button>
                       <button 
                         onClick={() => { setIsInstructionsModalOpen(true); setIsHeaderMenuOpen(false); }}
                         className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group"
                       >
                          <Edit3 className="w-5 h-5 text-gray-400 group-hover:text-black" />
                          <span className="text-sm font-bold text-gray-700">Edit instructions</span>
                       </button>
                       <button 
                         onClick={async () => {
                           if (confirm("Are you sure you want to archive this project? It will be moved to the archive section.")) {
                             const { error } = await supabase
                               .from('cases')
                               .update({ status: 'archived', archived_at: new Date().toISOString() })
                               .eq('id', id);
                             if (!error) {
                                logActivity('Archived Project', 'Project was moved to archive');
                                navigate('/app/overview');
                             }
                           }
                         }}
                         className="w-full flex items-center gap-4 px-6 py-4 hover:bg-amber-50 transition-colors group"
                       >
                          <Archive className="w-5 h-5 text-amber-300 group-hover:text-amber-500" />
                          <span className="text-sm font-bold text-amber-600">Archive project</span>
                       </button>
                       <div className="h-[1px] bg-gray-50 mx-4 my-2" />
                       <button 
                         onClick={async () => {
                           if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
                             const { error } = await supabase.from('cases').delete().eq('id', id);
                             if (!error) navigate('/app/overview');
                           }
                         }}
                         className="w-full flex items-center gap-4 px-6 py-4 hover:bg-red-50 transition-colors group"
                       >
                          <Trash2 className="w-5 h-5 text-red-300 group-hover:text-red-500" />
                          <span className="text-sm font-bold text-red-400 group-hover:text-red-500">Delete project</span>
                       </button>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>
            <button
               onClick={() => navigate('/app/legal-ai', { state: { caseId: id } })}
               className="flex items-center gap-3 px-10 py-4 bg-black text-white rounded-[22px] text-sm font-black uppercase tracking-widest hover:bg-gray-900 hover:shadow-2xl shadow-black/20 transition-all active:scale-95 group ml-2"
            >
               <MessageSquare className="w-5 h-5 text-primary group-hover:animate-pulse" />
               Open Contextual Chat
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Specialist AI Associates */}
          <ProjectCard 
            title="Associates" 
            icon={Users} 
            actionLabel={isArchived ? "" : "Assign"}
            onAction={() => !isArchived && navigate('/app/legal-ai', { state: { subView: 'Premade Associates' } })}
          >
             <div className="flex -space-x-3 mb-6 items-center">
                {personas.length > 0 ? (
                  personas.slice(0, 3).map((p, i) => (
                    <div key={i} className="relative">
                      <div className="w-12 h-12 bg-white border-2 border-white rounded-full flex items-center justify-center shadow-lg hover:z-20 transition-all cursor-pointer group" title={p.name}>
                        <div className="w-full h-full bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-primary/5">
                            <Bot className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full animate-pulse shadow-sm shadow-green-500/20" />
                    </div>
                  ))
                ) : (
                  <div className="text-[10px] text-gray-300 font-bold uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full border border-dashed border-gray-100">
                    No custom associates
                  </div>
                )}
                <div 
                  onClick={() => !isArchived && navigate('/app/legal-ai', { state: { subView: 'Premade Associates' } })}
                  className={`w-12 h-12 bg-gray-50 border-2 border-white rounded-full flex items-center justify-center shadow-lg hover:z-20 transition-all cursor-pointer hover:bg-primary group ${isArchived ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                   <Plus className="w-5 h-5 text-gray-300 group-hover:text-white" />
                </div>
                {activeUsers.length > 0 && (
                  <div className="ml-6 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                    <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">{activeUsers.length} Active Now</span>
                  </div>
                )}
             </div>
             <p className="text-gray-500 text-sm leading-relaxed">
                Connect this project to specialized AI personas for task-specific intelligence.
             </p>
          </ProjectCard>

          {/* Card 2: Connectors */}
          <ProjectCard 
            title="Connectors" 
            icon={LinkIcon} 
            actionLabel="Connect"
            onAction={() => navigate('/app/integrations')}
          >
             <div className="flex flex-wrap gap-4 mt-2">
                {integrations.length > 0 ? (
                  integrations.map((c, i) => (
                    <div key={i} className="w-12 h-12 bg-white border border-gray-100 rounded-full flex items-center justify-center p-2.5 shadow-sm hover:scale-110 transition-transform cursor-pointer" title={c.provider}>
                      <img 
                        src={`https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg`}
                        alt={c.provider} 
                        className="w-full h-full object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" 
                      />
                    </div>
                  ))
                ) : (
                  <div className="w-full py-4 text-center border border-dashed border-gray-100 rounded-xl">
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">No active connectors</p>
                  </div>
                )}
                <div onClick={() => navigate('/app/integrations')} className="w-12 h-12 bg-white border border-gray-100 rounded-full flex items-center justify-center p-2.5 shadow-sm hover:scale-110 transition-transform cursor-pointer group">
                  <Plus className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                </div>
             </div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-6">{integrations.length} integrations configured</p>
          </ProjectCard>

          {/* Card 3: Files */}
          <ProjectCard 
            title="Files" 
            icon={uploading ? RefreshCw : Upload} 
            actionLabel={isOwnerOrEditor ? (uploading ? 'Uploading...' : 'Add') : ''}
            onAction={() => isOwnerOrEditor && fileInputRef.current?.click()}
          >
             <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
             <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Project-specific documents for AI analysis and document intelligence.
             </p>
             <div className="space-y-2 max-h-[160px] overflow-y-auto no-scrollbar pr-1">
               {files.map(f => (
                 <div key={f.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl group hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3">
                       <FileText className="w-4 h-4 text-primary" />
                       <span className="text-xs font-bold truncate max-w-[120px]">{f.name}</span>
                    </div>
                    {isOwnerOrEditor && (
                      <button onClick={async () => {
                        const { error } = await supabase.from('files').delete().eq('id', f.id);
                        if (!error) setFiles(files.filter(file => file.id !== f.id));
                      }} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                         <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                 </div>
               ))}
             </div>
          </ProjectCard>

          {/* Card 4: Skills */}
          <ProjectCard 
            title="Skills" 
            icon={Puzzle} 
            actionLabel="Manage"
            onAction={() => setIsSkillsModalOpen(true)}
          >
             <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Enable power-ups to enhance Lawlify's reasoning for this specific matter.
             </p>
             <div className="flex flex-wrap gap-2">
                {(project?.metadata?.skills || []).map((skillId: string) => (
                  <div key={skillId} className="flex items-center gap-2 px-3 py-1.5 bg-black text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">
                     {AVAILABLE_SKILLS.find(s => s.id === skillId)?.name || skillId}
                  </div>
                ))}
             </div>
          </ProjectCard>

          {/* Card 5: Tasks */}
          <ProjectCard 
            title="Tasks" 
            icon={CheckSquare} 
            actionLabel="Add Task"
            onAction={handleAddTask}
          >
             <div className="space-y-3 max-h-[220px] overflow-y-auto no-scrollbar pr-2">
                {tasks.map(t => (
                  <TaskItem 
                    key={t.id} 
                    task={t} 
                    onToggleStatus={handleToggleTask}
                    onDelete={async (tid) => {
                       await supabase.from('tasks').delete().eq('id', tid);
                       fetchProjectData();
                    }}
                  />
                ))}
             </div>
          </ProjectCard>

          {/* Card 6: Activity Log */}
          <ProjectCard 
            title="Activity Log" 
            icon={Clock} 
            actionLabel="View All"
            onAction={() => {}}
          >
             <div className="space-y-4 max-h-[160px] overflow-y-auto no-scrollbar pr-2">
                {activities.map(a => (
                  <div key={a.id} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5" />
                      <div className="w-[1px] flex-1 bg-gray-100 my-1 group-last:hidden" />
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex justify-between items-start mb-0.5">
                        <p className="text-[10px] font-black text-black uppercase tracking-widest">{a.action}</p>
                        <span className="text-[9px] text-gray-300 font-bold uppercase tracking-tighter">
                          {new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 font-medium leading-tight">{a.description}</p>
                      <p className="text-[9px] text-primary font-bold uppercase tracking-[0.1em] mt-1">{a.user_email || 'System'}</p>
                    </div>
                  </div>
                ))}
             </div>
          </ProjectCard>

        </div>

        {isArchived && (
          <div className="mt-4 p-6 bg-red-50 border border-red-100 rounded-[32px] flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-4 font-bold text-red-500">
              <Shield className="w-6 h-6" />
              <div>
                <p className="text-sm font-black uppercase tracking-tighter">Matter Archived</p>
                <p className="text-xs font-medium text-red-400">This matter is currently in read-only mode for historical preservation.</p>
              </div>
            </div>
            {isOwner && (
              <button 
                onClick={async () => {
                   const { error } = await supabase.from('cases').update({ status: 'active', archived_at: null }).eq('id', id);
                   if (!error) {
                      logActivity('Restored Project', 'Matter was restored to active status');
                      fetchProjectData();
                   }
                }}
                className="px-6 py-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
              >
                Restore to Active
              </button>
            )}
          </div>
        )}

      </div>

      <ProjectShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onInvite={async (email, role) => {
           const { error } = await supabase.from('case_members').insert([{
             case_id: id, user_email: email, role, status: 'pending'
           }]);
           if (!error) {
              logActivity('Project Invited', `Invited ${email} as ${role}`);
              fetchProjectData();
           }
        }}
        projectName={project?.title || ''}
        members={members.map(m => ({
          id: m.id,
          email: m.user_email || m.email,
          name: m.full_name || m.user_email?.split('@')[0] || 'User',
          role: m.role || 'viewer',
          status: m.status || 'active'
        }))}
      />

      <EditProjectModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={project}
        onSave={async (data) => {
           const { error } = await supabase.from('cases').update({ title: data.title, description: data.description }).eq('id', id);
           if (!error) {
              setProject({ ...project, ...data });
              logActivity('Edited Project', `Updated project identity`);
              setIsEditModalOpen(false);
           }
        }}
      />

      <ProjectInstructionsModal 
        isOpen={isInstructionsModalOpen}
        onClose={() => setIsInstructionsModalOpen(false)}
        instructions={project?.description || ''}
        onSave={async (val) => {
           const { error } = await supabase.from('cases').update({ description: val }).eq('id', id);
           if (!error) {
              setProject({ ...project, description: val });
              logActivity('Updated Instructions', 'Modified project instructions');
              setIsInstructionsModalOpen(false);
           }
        }}
      />

      <ProjectSkillsModal 
        isOpen={isSkillsModalOpen}
        onClose={() => setIsSkillsModalOpen(false)}
        currentSkills={project?.metadata?.skills || []}
        availableSkills={AVAILABLE_SKILLS}
        onUpdateSkills={async (skills) => {
           const { error } = await supabase.from('cases').update({ metadata: { ...project.metadata, skills } }).eq('id', id);
           if (!error) setProject({ ...project, metadata: { ...project.metadata, skills } });
        }}
      />
    </div>
  );
};

export default ProjectView;
