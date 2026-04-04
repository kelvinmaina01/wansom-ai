import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, ArrowRight, ArrowLeft, Check,
  Briefcase, FileText, Link as LinkIcon,
  Info, Zap, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { apiClient } from '../lib/apiClient';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Skill {
  id: string;
  name: string;
  category: string;
  auto_load: boolean;
}

interface Connector {
  id: string;
  name: string;
  icon: string;
}

const STEPS = [
  { id: 'identity', title: 'Project Identity', icon: Briefcase },
  { id: 'instructions', title: 'Scope & Settings', icon: FileText },
  { id: 'connectors', title: 'Infrastructure', icon: LinkIcon },
];

const JURISDICTIONS = [
  'East Africa (Regional)', 'Kenya', 'Uganda', 'Tanzania', 'Rwanda',
  'Burundi', 'Somalia', 'Ethiopia', 'South Sudan', 'DR Congo',
  'South Africa', 'Nigeria', 'Egypt', 'United Kingdom', 'USA',
  'European Union', 'International Law',
];

// Static connector definitions — authoritative list
const ALL_CONNECTORS: Connector[] = [
  { id: 'gdrive', name: 'Google Drive', icon: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg' },
  { id: 'slack', name: 'Slack', icon: '/integrations/slack.png' },
  { id: 'gmail', name: 'Gmail', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg' },
  { id: 'gcal', name: 'Google Calendar', icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg' },
  { id: 'gsheets', name: 'Google Sheets', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg' },
  { id: 'onedrive', name: 'OneDrive', icon: '/integrations/onedrive.png' },
  { id: 'teams', name: 'Microsoft Teams', icon: 'https://i.ibb.co/TqhfJhvT/microsoft-teams-6971301-1280.webp' },
  { id: 'outlook', name: 'Outlook Calendar', icon: '/integrations/outlook.png' },
];

// ─── Skill category display colors ───────────────────────────────────────────
const CATEGORY_STYLE: Record<string, string> = {
  'Jurisdiction': 'bg-blue-50 border-blue-100 text-blue-700',
  'Documents': 'bg-amber-50 border-amber-100 text-amber-700',
  'Design': 'bg-purple-50 border-purple-100 text-purple-700',
  'Logic': 'bg-green-50 border-green-100 text-green-700',
  'Intelligence': 'bg-red-50 border-red-100 text-red-700',
};

// ─── Component ────────────────────────────────────────────────────────────────
const ProjectComposer: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [personas, setPersonas] = useState<any[]>([]);
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());
  const [isFetchingIntegrations, setIsFetchingIntegrations] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillFilter, setSkillFilter] = useState<string>('All');

  const [formData, setFormData] = useState({
    title: '',
    client_name: '',
    project_category: 'Research',
    jurisdiction: 'Kenya',
    description: '',
    persona_id: '',
    skills: [] as string[],
    connectors: [] as string[],
  });

  // ─── 1. Restore Draft ───────────────────────────────────────────────────────
  useEffect(() => {
    const draft = localStorage.getItem('lawlify_project_draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.formData) {
          setFormData(parsed.formData);
          if (parsed.currentStep !== undefined) setCurrentStep(parsed.currentStep);
        }
        localStorage.removeItem('lawlify_project_draft');
      } catch (e) {
        console.error('Failed to restore draft:', e);
      }
    }
  }, []);

  // ─── 2. Fetch Personas + Connected Integrations + Skills ───────────────────
  useEffect(() => {
    // Personas
    supabase.from('ai_personas').select('*').order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setPersonas(data);
          setFormData(prev => ({ ...prev, persona_id: prev.persona_id || data[0].id }));
        }
      });

    // User-connected integrations
    const fetchIntegrations = async () => {
      try {
        setIsFetchingIntegrations(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase.from('user_integrations').select('provider').eq('user_id', user.id);
        if (data) setConnectedIds(new Set(data.map((i: any) => i.provider)));
      } catch (e) {
        console.error('Failed to fetch integrations:', e);
      } finally {
        setIsFetchingIntegrations(false);
      }
    };
    fetchIntegrations();

    // Skills from SkillEngine backend API
    const fetchSkills = async () => {
      setSkillsLoading(true);
      try {
        const res = await apiClient.get('/api/skills');
        if (res.ok) {
          const data = await res.json();
          // Filter out jurisdiction-only skills — those aren't "abilities" to enable
          const actionSkills = (data.skills || []).filter(
            (s: Skill) => !s.id.startsWith('jurisdiction-')
          );
          setAvailableSkills(actionSkills);
        }
      } catch (e) {
        console.error('Failed to fetch skills:', e);
      } finally {
        setSkillsLoading(false);
      }
    };
    fetchSkills();
  }, []);

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const saveDraftAndRedirect = () => {
    localStorage.setItem('lawlify_project_draft', JSON.stringify({ formData, currentStep: 2 }));
    navigate('/app/integrations');
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
    else handleInitialize();
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    else navigate('/app/overview');
  };

  const toggleSkill = (id: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(id) ? prev.skills.filter(s => s !== id) : [...prev.skills, id],
    }));
  };

  const toggleConnector = (id: string) => {
    setFormData(prev => ({
      ...prev,
      connectors: prev.connectors.includes(id) ? prev.connectors.filter(c => c !== id) : [...prev.connectors, id],
    }));
  };

  const handleInitialize = async () => {
    setLoading(true);
    let createdCaseId: string | null = null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      // 1. Create the Case
      const { data: cases, error: caseError } = await supabase
        .from('cases')
        .insert([{
          user_id: user.id,
          title: formData.title || 'Untitled Project',
          client_name: formData.client_name || 'Individual',
          case_type: formData.project_category,
          description: formData.description,
          status: 'New',
          metadata: {
            persona_id: formData.persona_id,
            jurisdiction: formData.jurisdiction,
            skills: formData.skills,
            connectors: formData.connectors,
          },
        }])
        .select();

      if (caseError) throw caseError;
      if (!cases || cases.length === 0) throw new Error('Failed to create project');
      createdCaseId = cases[0].id;

      // 2. Add owner as member
      const { error: memberError } = await supabase.from('case_members').insert([{
        case_id: createdCaseId,
        user_email: user.email,
        user_id: user.id,
        role: 'owner',
        status: 'accepted',
      }]);

      if (memberError) {
        await supabase.from('cases').delete().eq('id', createdCaseId);
        throw memberError;
      }

      // 3. Log activity
      await apiClient.post('/api/dashboard/activity', {
        action: 'created',
        target: formData.title || 'Untitled Project',
        icon: 'Briefcase',
        case_id: createdCaseId,
      });

      navigate(`/app/projects/${createdCaseId}`);
    } catch (err: any) {
      console.error('Error initializing project:', err);
      alert(`Failed to initialize project: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // ─── Skill filter categories ──────────────────────────────────────────────
  const skillCategories = ['All', ...Array.from(new Set(availableSkills.map(s => s.category)))];
  const visibleSkills = skillFilter === 'All' ? availableSkills : availableSkills.filter(s => s.category === skillFilter);

  // ─── Connected connectors that exist in our list ──────────────────────────
  const activeConnectors = ALL_CONNECTORS.filter(c => connectedIds.has(c.id));

  return (
    <div className="flex-1 bg-[#FAFAFA] bg-dots flex flex-col h-full relative overflow-hidden">

      {/* Sidebar */}
      <div className="absolute left-0 top-0 bottom-0 w-80 bg-[#F5F5EE] border-r border-gray-200/50 p-12 hidden lg:flex flex-col">
        <div className="mb-16 px-2">
          <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em]">Project Initialization</p>
        </div>
        <div className="space-y-12 relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200" />
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isComplete = i < currentStep;
            const isActive = i === currentStep;
            return (
              <div key={step.id} className="flex items-center gap-6 relative z-10">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${isComplete ? 'bg-black border-black text-white' : isActive ? 'bg-white border-primary text-primary shadow-lg shadow-primary/20 scale-110' : 'bg-white border-gray-200 text-gray-300'}`}>
                  {isComplete ? <Check className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1 ${isActive ? 'text-primary' : 'text-black/30'}`}>Step {i + 1}</p>
                  <p className={`text-sm font-bold transition-colors ${isActive ? 'text-black' : 'text-black/20'}`}>{step.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 lg:ml-80 flex flex-col p-8 lg:p-24 overflow-y-auto no-scrollbar">
        <div className="max-w-2xl mx-auto w-full">
          <AnimatePresence mode="wait">

            {/* Step 0 — Identity */}
            {currentStep === 0 && (
              <motion.div key="identity" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="space-y-12">
                  <div className="space-y-4">
                    <h1 className="text-5xl font-bold text-black tracking-tighter leading-none mb-4">Project Identity</h1>
                    <p className="text-red-600 font-bold text-2xl leading-relaxed max-w-xl">This will be your workspace for this comprehensive project.</p>
                  </div>
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <label className="text-[11px] font-medium text-black uppercase tracking-[0.3em] ml-1">Project Title</label>
                      <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Acme Corp Acquisition"
                        className="w-full h-24 bg-white border border-black rounded-[32px] px-10 text-3xl font-medium text-black focus:outline-none focus:border-red-600 transition-all placeholder:text-gray-300" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-medium text-black uppercase tracking-[0.3em] ml-1">Client or Entity Association</label>
                      <input type="text" value={formData.client_name} onChange={e => setFormData({ ...formData, client_name: e.target.value })} placeholder="Full Name, Organization or N/A"
                        className="w-full h-20 bg-white border border-black rounded-[28px] px-8 text-xl font-medium text-black focus:outline-none focus:border-red-600 transition-all placeholder:text-gray-300" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 1 — Scope */}
            {currentStep === 1 && (
              <motion.div key="instructions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                <div className="space-y-4">
                  <h1 className="text-5xl font-bold text-black tracking-tighter">Project Scope</h1>
                  <p className="text-red-600 font-bold text-xl leading-relaxed">Define the objective and primary context for this workspace.</p>
                </div>
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-medium text-black uppercase tracking-widest ml-1">Project Category</label>
                      <select value={formData.project_category} onChange={e => setFormData({ ...formData, project_category: e.target.value })}
                        className="w-full h-16 bg-white border border-black rounded-[22px] px-6 text-sm font-medium text-black focus:outline-none focus:border-red-600 transition-all appearance-none cursor-pointer">
                        {['Research', 'Academic', 'Corporate', 'Litigation', 'General Inquiry', 'Advisory'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-medium text-black uppercase tracking-widest ml-1">Jurisdiction</label>
                      <select value={formData.jurisdiction} onChange={e => setFormData({ ...formData, jurisdiction: e.target.value })}
                        className="w-full h-16 bg-white border border-black rounded-[22px] px-6 text-sm font-medium text-black focus:outline-none focus:border-red-600 transition-all appearance-none cursor-pointer">
                        {JURISDICTIONS.map(j => <option key={j} value={j}>{j}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-medium text-black uppercase tracking-widest ml-1">Specialized AI Associate</label>
                    <select value={formData.persona_id} onChange={e => setFormData({ ...formData, persona_id: e.target.value })}
                      className="w-full h-16 bg-white border border-black rounded-[22px] px-6 text-sm font-medium text-black focus:outline-none focus:border-red-600 transition-all appearance-none cursor-pointer">
                      {personas.length === 0 && <option value="">No AI Associates available</option>}
                      {personas.map(p => <option key={p.id} value={p.id}>{p.name}{p.role ? ` — ${p.role}` : ''}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-medium text-black uppercase tracking-widest ml-1">Project Objectives & Brief</label>
                    <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="What is the objective? Provide any background details here..."
                      className="w-full h-48 bg-white border border-black rounded-[28px] p-8 text-lg font-normal text-black placeholder:text-gray-300 focus:outline-none focus:border-red-600 transition-all resize-none leading-relaxed" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2 — Infrastructure */}
            {currentStep === 2 && (
              <motion.div key="connectors" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                <div className="space-y-4">
                  <h1 className="text-6xl font-bold text-black tracking-tighter">Infrastructure</h1>
                  <p className="text-gray-500 font-bold text-xl leading-relaxed">Power your project with connectors and AI skills.</p>
                </div>

                <div className="space-y-10">
                  {/* Connectors */}
                  <div>
                    <label className="text-[10px] font-medium text-black uppercase tracking-widest ml-1 block mb-4">Active Connectors</label>
                    {isFetchingIntegrations ? (
                      <div className="flex items-center gap-3 text-gray-400 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading your integrations...</div>
                    ) : activeConnectors.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {activeConnectors.map(c => {
                          const isSelected = formData.connectors.includes(c.id);
                          return (
                            <button key={c.id} onClick={() => toggleConnector(c.id)}
                              className={`flex flex-col items-center justify-center p-5 rounded-[24px] border transition-all ${isSelected ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white border-black hover:bg-gray-50'}`}>
                              <div className="w-10 h-10 mb-2 flex items-center justify-center p-1.5 bg-white rounded-xl shadow-sm border border-gray-50">
                                <img src={c.icon} alt={c.name} className="w-full h-full object-contain" onError={e => { (e.target as HTMLImageElement).src = ''; }} />
                              </div>
                              <span className="text-[10px] font-medium uppercase tracking-widest text-black">{c.name}</span>
                              {isSelected && <Check className="w-3 h-3 text-primary mt-1" />}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="bg-red-50 border border-red-100 rounded-[32px] p-10 text-center">
                        <Zap className="w-10 h-10 text-red-600 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-black mb-2">No Active Connectors</h3>
                        <p className="text-sm font-normal text-red-600/60 mb-8 max-w-sm mx-auto">Your infrastructure is currently isolated. Connect your context sources to enable autonomous intelligence.</p>
                        <button onClick={saveDraftAndRedirect} className="px-8 py-4 bg-black text-white rounded-[20px] font-medium text-sm hover:bg-red-600 transition-all">
                          Power Up Infrastructure →
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Skills — from SkillEngine registry */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-[10px] font-medium text-black uppercase tracking-widest ml-1">Enabled AI Capabilities</label>
                      {formData.skills.length > 0 && (
                        <span className="text-[10px] font-black text-primary bg-primary/10 px-2.5 py-1 rounded-full">{formData.skills.length} selected</span>
                      )}
                    </div>

                    {/* Category filter pills */}
                    {!skillsLoading && availableSkills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {skillCategories.map(cat => (
                          <button key={cat} onClick={() => setSkillFilter(cat)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${skillFilter === cat ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-black'}`}>
                            {cat}
                          </button>
                        ))}
                      </div>
                    )}

                    {skillsLoading ? (
                      <div className="flex items-center gap-3 text-gray-400 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading AI skills...</div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {visibleSkills.map(s => {
                          const isSelected = formData.skills.includes(s.id);
                          const catStyle = CATEGORY_STYLE[s.category] || 'bg-gray-50 border-gray-100 text-gray-600';
                          return (
                            <button key={s.id} onClick={() => toggleSkill(s.id)}
                              className={`p-4 rounded-[20px] border text-left transition-all flex items-start justify-between gap-2 ${isSelected ? 'bg-black border-black text-white' : 'bg-white border-gray-100 text-gray-800 hover:border-black'}`}>
                              <div>
                                <span className={`text-xs font-bold block mb-1 ${isSelected ? 'text-white' : 'text-black'}`}>{s.name}</span>
                                <span className={`text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${isSelected ? 'bg-white/20 text-white' : catStyle}`}>{s.category}</span>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {!skillsLoading && availableSkills.length === 0 && (
                      <div className="flex items-center gap-2 text-gray-400 text-sm bg-gray-50 border border-gray-100 rounded-2xl p-4">
                        <Info className="w-4 h-4 shrink-0" />
                        <span>Could not load skills from backend. Ensure backend is running.</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Navigation */}
          <div className="mt-20 pt-10 border-t border-gray-100 flex items-center justify-between">
            <button onClick={handleBack} className="flex items-center gap-2 text-black hover:text-red-600 font-bold text-sm transition-all">
              <ArrowLeft className="w-4 h-4" />
              {currentStep === 0 ? 'Cancel' : 'Go back'}
            </button>
            <button onClick={handleNext} disabled={loading || (currentStep === 0 && (!formData.title || !formData.client_name))}
              className="flex items-center gap-3 px-10 py-5 bg-black text-white rounded-[22px] font-bold text-sm hover:translate-x-1 transition-all disabled:opacity-20">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Initializing...</> : <>{currentStep === STEPS.length - 1 ? 'Finish Project' : 'Next Step'}<ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectComposer;
