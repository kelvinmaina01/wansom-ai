import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, ArrowRight, ArrowLeft, CheckCircle2, 
  Briefcase, User, Scale, Puzzle, Link as LinkIcon,
  Check, Info, X, Zap, FileText, Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

const STEPS = [
  { id: 'identity', title: 'Project Identity', icon: Briefcase },
  { id: 'instructions', title: 'Scope & Settings', icon: FileText },
  { id: 'connectors', title: 'Infrastructure', icon: LinkIcon }
];

const PREMADE_SPECIALISTS = [
  { id: 'briefly', name: 'Briefly Agent', role: 'Litigation Analyst', description: 'Expert in case summaries and legal research.' },
  { id: 'contracts', name: 'Contract Specialist', role: 'Transactional Expert', description: 'Skilled in drafting and reviewing agreements.' },
  { id: 'discovery', name: 'Discovery Agent', role: 'Data Intelligence', description: 'Handles large-scale document review.' }
];

const JURISDICTIONS = [
  'East Africa (Regional)', 'Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Burundi', 'Somalia', 'Ethiopia', 'South Sudan', 'DR Congo', 
  'South Africa', 'Nigeria', 'Egypt', 'United Kingdom', 'USA', 'European Union', 'International Law'
];

const AVAILABLE_SKILLS = [
  { id: 'doc-intelligence', name: 'Document Intelligence', category: 'Intelligence' },
  { id: 'research-analysis', name: 'Autonomous Research', category: 'Analysis' },
  { id: 'doc-drafting', name: 'Premium Drafting', category: 'Documents' },
  { id: 'legal-audit', name: 'Strategic Audit', category: 'Audit' }
];

const ProjectComposer: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [personas, setPersonas] = useState<any[]>([]);
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());
  const [isFetchingIntegrations, setIsFetchingIntegrations] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    client_name: '',
    project_category: 'Research',
    jurisdiction: 'Kenya',
    description: '',
    persona_id: '',
    skills: [] as string[],
    connectors: [] as string[]
  });

  // 1. Restore from Draft on Mount
  React.useEffect(() => {
    const draft = localStorage.getItem('lawlify_project_draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.formData) {
          setFormData(parsed.formData);
          if (parsed.currentStep !== undefined) {
             setCurrentStep(parsed.currentStep);
          }
        }
        localStorage.removeItem('lawlify_project_draft');
      } catch (e) {
        console.error('Failed to restore project draft:', e);
      }
    }
  }, []);

  // 2. Fetch Specialists & Integrations
  React.useEffect(() => {
    // Fetch Specialists
    supabase.from('ai_personas').select('*').order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setPersonas(data);
          // Only set default if not restored from draft
          setFormData(prev => ({ ...prev, persona_id: prev.persona_id || data[0].id }));
        }
      });

    // Fetch Connected Integrations
    const fetchIntegrations = async () => {
      try {
        setIsFetchingIntegrations(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const res = await supabase.from('user_integrations').select('provider').eq('user_id', user.id);
        if (res.data) {
          const ids = res.data.map(i => i.provider);
          setConnectedIds(new Set(ids));
        }
      } catch (e) {
        console.error('Failed to fetch integrations:', e);
      } finally {
        setIsFetchingIntegrations(false);
      }
    };
    fetchIntegrations();
  }, []);

  const saveDraftAndRedirect = () => {
    const draft = {
      formData,
      currentStep: 2 // Save at the Infrastructure step
    };
    localStorage.setItem('lawlify_project_draft', JSON.stringify(draft));
    navigate('/app/integrations');
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleInitialize();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/app/overview');
    }
  };

  const handleInitialize = async () => {
    setLoading(true);
    let createdCaseId: string | null = null;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      // 1. Create the Project (Case)
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
            connectors: formData.connectors
          }
        }])
        .select();

      if (caseError) throw caseError;
      if (!cases || cases.length === 0) throw new Error('Failed to create project');
      
      createdCaseId = cases[0].id;
      
      // 2. Add the owner as a member
      const { error: memberError } = await supabase.from('case_members').insert([{
        case_id: createdCaseId,
        user_email: user.email,
        user_id: user.id,
        role: 'owner',
        status: 'accepted'
      }]);

      if (memberError) {
        // CLEANUP: If member creation fails, delete the orphaned case
        await supabase.from('cases').delete().eq('id', createdCaseId);
        throw memberError;
      }

      navigate(`/app/projects/${createdCaseId}`);
    } catch (err: any) {
      console.error('Error initializing project:', err);
      alert(`Failed to initialize project: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#FAFAFA] bg-dots flex flex-col h-full relative overflow-hidden">
      
      {/* Premium Sidebar (Progress) */}
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
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                    isComplete ? 'bg-black border-black text-white' : 
                    isActive ? 'bg-white border-primary text-primary shadow-lg shadow-primary/20 scale-110' : 
                    'bg-white border-gray-200 text-gray-300'
                  }`}>
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

      {/* Main Composer Area */}
      <div className="flex-1 lg:ml-80 flex flex-col p-8 lg:p-24 overflow-y-auto no-scrollbar">
        <div className="max-w-2xl mx-auto w-full">
           
           <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="identity"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <h1 className="text-5xl font-bold text-black tracking-tighter leading-none mb-4">Project Identity</h1>
                      <p className="text-red-600 font-bold text-2xl leading-relaxed max-w-xl">
                         This will be your workspace for this comprehensive project.
                      </p>
                    </div>

                    <div className="space-y-10">
                      <div className="space-y-4">
                         <label className="text-[11px] font-medium text-black uppercase tracking-[0.3em] ml-1">Project Title</label>
                         <input 
                           type="text" 
                           value={formData.title}
                           onChange={e => setFormData({ ...formData, title: e.target.value })}
                           placeholder="e.g. Acme Corp Acquisition"
                           className="w-full h-24 bg-white border border-black rounded-[32px] px-10 text-3xl font-medium text-black focus:outline-none focus:border-red-600 transition-all placeholder:text-gray-300"
                         />
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-4">
                          <label className="text-[11px] font-medium text-black uppercase tracking-[0.3em] ml-1">Client or Entity Association</label>
                          <input 
                            type="text" 
                            value={formData.client_name}
                            onChange={e => setFormData({ ...formData, client_name: e.target.value })}
                            placeholder="Full Name, Organization or N/A"
                            className="w-full h-20 bg-white border border-black rounded-[28px] px-8 text-xl font-medium text-black focus:outline-none focus:border-red-600 transition-all placeholder:text-gray-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

               {currentStep === 1 && (
                <motion.div
                  key="instructions"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  <div className="space-y-4">
                    <h1 className="text-5xl font-bold text-black tracking-tighter">Project Scope</h1>
                    <p className="text-red-600 font-bold text-xl leading-relaxed">
                       Define the objective and primary context for this workspace.
                    </p>
                  </div>

                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-medium text-black uppercase tracking-widest ml-1">Project Category</label>
                        <select
                          value={formData.project_category}
                          onChange={e => setFormData({ ...formData, project_category: e.target.value })}
                          className="w-full h-16 bg-white border border-black rounded-[22px] px-6 text-sm font-medium text-black focus:outline-none focus:border-red-600 transition-all appearance-none cursor-pointer"
                        >
                           {['Research', 'Academic', 'Corporate', 'Litigation', 'General Inquiry', 'Advisory'].map(cat => (
                             <option key={cat} value={cat}>{cat}</option>
                           ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-medium text-black uppercase tracking-widest ml-1">Jurisdiction</label>
                        <select
                          value={formData.jurisdiction}
                          onChange={e => setFormData({ ...formData, jurisdiction: e.target.value })}
                          className="w-full h-16 bg-white border border-black rounded-[22px] px-6 text-sm font-medium text-black focus:outline-none focus:border-red-600 transition-all appearance-none cursor-pointer"
                        >
                           {JURISDICTIONS.map(j => (
                             <option key={j} value={j}>{j}</option>
                           ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-[10px] font-medium text-black uppercase tracking-widest ml-1">Specialized AI Associate</label>
                       <select
                          value={formData.persona_id}
                          onChange={e => setFormData({ ...formData, persona_id: e.target.value })}
                          className="w-full h-16 bg-white border border-black rounded-[22px] px-6 text-sm font-medium text-black focus:outline-none focus:border-red-600 transition-all appearance-none cursor-pointer"
                       >
                          {personas.map(p => (
                            <option key={p.id} value={p.id}>{p.name} {p.role ? `— ${p.role}` : ''}</option>
                          ))}
                       </select>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-medium text-black uppercase tracking-widest ml-1">Project Objectives & Brief</label>
                       <textarea 
                         value={formData.description}
                         onChange={e => setFormData({ ...formData, description: e.target.value })}
                         placeholder="What is the objective? Provide any background details here..."
                         className="w-full h-48 bg-white border border-black rounded-[28px] p-8 text-lg font-normal text-black placeholder:text-gray-300 focus:outline-none focus:border-red-600 transition-all resize-none leading-relaxed"
                       />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                   key="connectors"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-12"
                >
                   <div className="space-y-4">
                     <h1 className="text-6xl font-bold text-black tracking-tighter">Infrastructure</h1>
                     <p className="text-gray-500 font-bold text-xl leading-relaxed">
                        Power your project with connectors and skills.
                     </p>
                   </div>

                    <div className="space-y-8">
                       {connectedIds.size > 0 ? (
                         <div className="grid grid-cols-2 gap-4">
                            {[
                              { id: 'gdrive', name: 'Google Drive', icon: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg' },
                              { id: 'slack', name: 'Slack', icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg' }
                            ].filter(c => connectedIds.has(c.id)).map(c => {
                              const isSelected = formData.connectors.includes(c.id);
                              return (
                                <button
                                  key={c.id}
                                  onClick={() => {
                                    const newC = isSelected 
                                      ? formData.connectors.filter(id => id !== c.id)
                                      : [...formData.connectors, c.id];
                                    setFormData({ ...formData, connectors: newC });
                                  }}
                                  className={`flex flex-col items-center justify-center p-6 rounded-[28px] border transition-all ${
                                    isSelected ? 'bg-primary/5 border-primary' : 'bg-white border-black hover:bg-gray-50'
                                  }`}
                                >
                                   <div className="w-12 h-12 mb-3 flex items-center justify-center p-2 bg-white rounded-xl shadow-sm border border-gray-50">
                                      <img src={c.icon} alt={c.name} className="w-full h-full object-contain" />
                                   </div>
                                   <span className="text-[10px] font-medium uppercase tracking-widest text-black">{c.name}</span>
                                </button>
                              );
                            })}
                         </div>
                       ) : (
                         <div className="bg-red-50 border border-red-100 rounded-[32px] p-10 text-center">
                            <Zap className="w-10 h-10 text-red-600 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-black mb-2">No Active Connectors</h3>
                            <p className="text-sm font-normal text-red-600/60 mb-8 max-w-sm mx-auto">
                              Your infrastructure is currently isolated. Connect your context sources to enable autonomous intelligence.
                            </p>
                            <button 
                              onClick={saveDraftAndRedirect}
                              className="px-8 py-4 bg-black text-white rounded-[20px] font-medium text-sm hover:bg-red-600 transition-all"
                            >
                              Power Up Infrastructure →
                            </button>
                         </div>
                       )}

                     <div className="space-y-4">
                        <label className="text-[10px] font-medium text-gray-400 uppercase tracking-widest ml-1">Enabled Abilities</label>
                        <div className="grid grid-cols-2 gap-4">
                          {AVAILABLE_SKILLS.slice(0, 4).map(s => {
                            const isSelected = formData.skills.includes(s.id);
                            return (
                              <button
                                key={s.id}
                                onClick={() => {
                                  const newSkills = isSelected 
                                    ? formData.skills.filter(id => id !== s.id)
                                    : [...formData.skills, s.id];
                                  setFormData({ ...formData, skills: newSkills });
                                }}
                                className={`p-4 rounded-[22px] border text-left transition-all flex items-center justify-between ${
                                  isSelected ? 'bg-black border-black text-white' : 'bg-white border-gray-50 text-gray-400 hover:border-black'
                                }`}
                              >
                                 <span className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-black'}`}>{s.name}</span>
                                 {isSelected && <Check className="w-4 h-4 text-primary" />}
                              </button>
                            );
                          })}
                        </div>
                     </div>
                   </div>
                </motion.div>
              )}
           </AnimatePresence>

           {/* Footer Navigation */}
           <div className="mt-20 pt-10 border-t border-gray-100 flex items-center justify-between">
              <button
                 onClick={handleBack}
                 className="flex items-center gap-2 text-black hover:text-red-600 font-bold text-sm transition-all"
              >
                 <ArrowLeft className="w-4 h-4" />
                 {currentStep === 0 ? 'Cancel' : 'Go back'}
              </button>

              <button
                 onClick={handleNext}
                 disabled={loading || (currentStep === 0 && (!formData.title || !formData.client_name))}
                 className={`flex items-center gap-3 px-10 py-5 bg-black text-white rounded-[22px] font-bold text-sm hover:translate-x-1 transition-all disabled:opacity-20`}
              >
                 {loading ? 'Initializing...' : currentStep === STEPS.length - 1 ? 'Finish Project' : 'Next Step'}
                 {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
           </div>
        </div>
      </div>

    </div>
  );
};

export default ProjectComposer;
