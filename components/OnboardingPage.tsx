import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Users, 
  ShieldCheck, 
  Search, 
  Globe, 
  MessageSquare,
  Mail,
  Github,
  Linkedin,
  Youtube,
  Twitter,
  Briefcase,
  Building2,
  Scale,
  Radio,
  Newspaper,
  Mic2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface OnboardingPageProps {
  onComplete: () => void;
}

const STEPS = [
  { id: 1, title: "Let's get you started", subtitle: "Complete these quick actions to set up your account." },
  { id: 2, title: "How did you first hear about us?", subtitle: "Help us understand how people discover Lawlify." },
  { id: 3, title: "Terms of Service & Privacy Policy", subtitle: "Please review and accept our terms and privacy policy to continue." },
  { id: 4, title: "Invite your team", subtitle: "Invite teammates to collaborate on your projects." },
];

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    emailVerified: true,
    socials: {
      linkedin: false,
      twitter: false,
      youtube: false
    },
    discoverySource: '',
    agreedToTerms: false,
    updates: false,
    teamName: 'Personal',
    teamMembers: [] as Array<{email: string, role: string}>,
    inviteEmail: '',
    inviteRole: 'viewer'
  });
  const [isCheckingTeamName, setIsCheckingTeamName] = useState(false);
  const [teamNameError, setTeamNameError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found for onboarding');
        onComplete(); // Or redirect to /auth if we had navigate. For now, match App.tsx logic.
      }
    };
    checkUser();
  }, []);

  const checkTeamName = async (name: string) => {
    if (!name || name === 'Personal') {
      setTeamNameError(null);
      return;
    }
    setIsCheckingTeamName(true);
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .select('id')
        .eq('name', name)
        .maybeSingle();
      
      if (error) throw error;
      if (data) {
        setTeamNameError('This team name is already taken. Please choose another one.');
      } else {
        setTeamNameError(null);
      }
    } catch (err) {
      console.error('Error checking team name:', err);
    } finally {
      setIsCheckingTeamName(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.teamName) {
        checkTeamName(formData.teamName);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.teamName]);

  useEffect(() => {
    // Re-initialize social widgets if scripts are loaded
    if (currentStep === 1) {
      if ((window as any).twttr && (window as any).twttr.widgets) {
        (window as any).twttr.widgets.load();
      }
      if ((window as any).gapi && (window as any).gapi.ytsubscribe) {
        (window as any).gapi.ytsubscribe.go();
      }
    }
  }, [currentStep]);

  const handleFinish = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Authentication lost. Please sign in again.');
        onComplete();
        return;
      }

      // 1. Save onboarding responses via Backend API (Aligning with audit)
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/onboarding`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          },
          body: JSON.stringify({
            discovery_source: formData.discoverySource,
            team_name: formData.teamName,
            social_links: formData.socials,
            terms_accepted: formData.agreedToTerms,
            onboarding_completed_at: new Date().toISOString()
          })
        });
        if (!response.ok) {
           const errData = await response.json();
           throw new Error(errData.error || 'Failed to save onboarding data to backend');
        }
      } catch (backendErr) {
        console.warn('Backend onboarding persistence failed, falling back to direct Supabase:', backendErr);
        // Fallback to direct Supabase if backend is down (to prevent blocking user)
        const { error: onboardingError } = await supabase
          .from('onboarding_responses')
          .upsert({
            user_id: user.id,
            discovery_source: formData.discoverySource,
            team_name: formData.teamName,
            social_links: formData.socials,
            terms_accepted: formData.agreedToTerms,
            onboarding_completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });

        if (onboardingError) throw onboardingError;
      }

      // 2. Initialize or Update User Settings (if not already exists)
      const { error: settingsError } = await supabase
        .from('user_settings')
        .upsert({
          id: user.id,
          profile_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          profile_email: user.email,
          profile_avatar_url: user.user_metadata?.avatar_url || null,
          profile_firm_name: formData.teamName,
          notifications_email: formData.updates,
          notifications_news_digest: formData.updates,
          updated_at: new Date().toISOString()
        });

      // 3. Get or Create/Update Workspace
      let workspace;
      const { data: existingWorkspaces, error: fetchError } = await supabase
        .from('workspaces')
        .select()
        .eq('user_id', user.id)
        .eq('name', formData.teamName || 'Personal')
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;

      if (existingWorkspaces && existingWorkspaces.length > 0) {
        workspace = existingWorkspaces[0];
      } else {
        const { data: newWorkspace, error: wsError } = await supabase
          .from('workspaces')
          .insert({
            user_id: user.id,
            name: formData.teamName || 'Personal',
            type: 'Case Preparation'
          })
          .select()
          .single();
        if (wsError) throw wsError;
        workspace = newWorkspace;
      }

      // 4. Add current user as Admin member (ignoring if already member)
      await supabase
        .from('workspace_members')
        .upsert({
          workspace_id: workspace.id,
          user_id: user.id,
          role: 'admin'
        }, { onConflict: 'workspace_id, user_id' });

      // 5. Send Invitations
      const { data: { session } } = await supabase.auth.getSession();
      
      for (const teammate of formData.teamMembers) {
        try {
          await supabase.functions.invoke('invite_collaborators', {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
              apikey: import.meta.env.VITE_SUPABASE_ANON_KEY
            },
            body: {
              email: teammate.email,
              workspaceId: workspace.id,
              workspaceName: workspace.name,
              inviterName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'A Colleague',
              role: teammate.role
            }
          });
        } catch (inviteErr) {
          console.error(`Failed to invite ${teammate.email}:`, inviteErr);
        }
      }

      // Small delay to ensure DB persistence propagates
      await new Promise(resolve => setTimeout(resolve, 1000));
      onComplete();
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      if (error.message === 'Failed to fetch') {
        alert('Network Connection Error: Could not connect to the Lawlify servers. Please check your internet and try again.');
      } else {
        alert(`Error: ${error.message || 'There was an error saving your preferences. Please try again.'}`);
      }
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    // Cannot skip Terms & Conditions
    if (currentStep === 3) {
      alert('Please accept the Terms & Conditions to continue.');
      return;
    }
    handleNext();
  };

  return (
    <div className="min-h-screen bg-ai-studio text-white flex flex-col items-center justify-center p-8 font-sans">
      <div className="w-full max-w-5xl flex flex-col h-full">
        {/* Header */}
        <div className="pb-12 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-3 mb-8 text-primary font-bold tracking-tighter">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl">Lawlify AI</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-4 leading-tight">{STEPS[currentStep - 1].title}</h1>
            <p className="text-xl text-gray-400 font-medium max-w-2xl">{STEPS[currentStep - 1].subtitle}</p>
          </div>
          <div className="flex flex-col items-end gap-4">
            <div className="bg-white/5 px-4 py-2 rounded-full text-xs font-bold text-gray-400 uppercase tracking-widest border border-white/10">
              Step {currentStep} of {STEPS.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-16">
          <div className="flex gap-4">
            {STEPS.map((step) => (
              <div 
                key={step.id} 
                className={`h-2 rounded-full flex-1 transition-all duration-700 ${
                  step.id <= currentStep ? 'bg-primary' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 mb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-full"
            >
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <TaskCard 
                    title="Email Verified" 
                    description="Your email has been verified" 
                    image="/onboarding/email.png"
                    claimed={formData.emailVerified}
                    onClick={() => {}}
                    disabled
                  />
                  <TaskCard 
                    title="Connect LinkedIn" 
                    description="Connect your professional profile" 
                    image="/onboarding/linkedin.png"
                    claimed={formData.socials.linkedin}
                    onClick={() => setFormData({...formData, socials: {...formData.socials, linkedin: true}})}
                    socialWidget={
                      <div className="mt-4">
                        <script type="IN/FollowCompany" data-id="lawlify-ai" data-counter="right"></script>
                      </div>
                    }
                  />
                  <TaskCard 
                    title="Follow us on X" 
                    description="Stay updated on new features and launches" 
                    image="/onboarding/x.png"
                    claimed={formData.socials.twitter}
                    onClick={() => setFormData({...formData, socials: {...formData.socials, twitter: true}})}
                    socialWidget={
                      <div className="mt-4">
                        <a href="https://twitter.com/lawlifyai" className="twitter-follow-button" data-show-count="false" data-size="large">Follow @lawlifyai</a>
                      </div>
                    }
                  />
                  <TaskCard 
                    title="Subscribe to our YouTube" 
                    description="Watch tutorials and product demos" 
                    image="/onboarding/youtube.png"
                    claimed={formData.socials.youtube}
                    onClick={() => setFormData({...formData, socials: {...formData.socials, youtube: true}})}
                    socialWidget={
                      <div className="mt-4">
                        <div className="g-ytsubscribe" data-channelid="UC0vBXU14wD5S-FvPvf_QxmA" data-layout="default" data-count="default"></div>
                      </div>
                    }
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { label: 'Google/Bing Search', icon: <Search className="w-6 h-6" /> },
                    { label: 'LinkedIn', icon: <Linkedin className="w-6 h-6" /> },
                    { label: 'X (Twitter)', icon: <Twitter className="w-6 h-6" /> },
                    { label: 'YouTube Tutorials', icon: <Youtube className="w-6 h-6" /> },
                    { label: 'Colleague Ref', icon: <Users className="w-6 h-6" /> },
                    { label: 'Legal Tech Blog', icon: <Newspaper className="w-6 h-6" /> },
                    { label: 'Legal Podcast', icon: <Mic2 className="w-6 h-6" /> },
                    { label: 'Conference', icon: <Building2 className="w-6 h-6" /> },
                    { label: 'Legal Newsletter', icon: <Mail className="w-6 h-6" /> },
                  ].map((option) => (
                    <button
                      key={option.label}
                      onClick={() => setFormData({...formData, discoverySource: option.label})}
                      className={`w-full p-6 rounded-[2rem] border text-left font-medium transition-all flex flex-col items-center justify-center text-center gap-4 group hover:scale-[1.02] active:scale-[0.98] ${
                        formData.discoverySource === option.label 
                          ? 'bg-primary text-white border-primary shadow-xl shadow-primary/30' 
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shrink-0 ${
                        formData.discoverySource === option.label ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400 group-hover:text-primary'
                      }`}>
                        {option.icon}
                      </div>
                      <span className="text-lg font-bold tracking-tight">{option.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {currentStep === 3 && (
                <div className="flex flex-col md:flex-row gap-12 h-full">
                  <div className="flex-[1.5] bg-white/5 p-10 rounded-[2.5rem] border border-white/10 overflow-y-auto max-h-[500px] text-base text-gray-300 leading-relaxed backdrop-blur-xl no-scrollbar">
                    <h3 className="font-bold text-white mb-6 text-2xl tracking-tight">TERMS OF USE / SERVICE AGREEMENT</h3>
                    <p className="mb-6">Last Updated: March 2026</p>
                    <p className="mb-6">Welcome to Lawlify AI. By accessing or using our platform, you agree to be bound by these Terms of Service and our Privacy Policy.</p>
                    <p className="mb-4 font-bold text-white text-lg">1. Acceptance of Terms</p>
                    <p className="mb-6">By creating an account, accessing, or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, do not use the Service.</p>
                    <p className="mb-4 font-bold text-white text-lg">2. Data Privacy & Security</p>
                    <p className="mb-6">We take your data privacy seriously. All client data is encrypted and stored securely. We do not use your confidential data to train our public models.</p>
                    <p className="mb-4 font-bold text-white text-lg">3. Professional Responsibility</p>
                    <p>Lawlify AI is a tool to assist legal professionals. It does not provide legal advice and should not be relied upon as a substitute for professional legal judgment.</p>
                  </div>

                  <div className="w-full md:w-[440px] space-y-6 flex flex-col justify-center shrink-0">
                    <div 
                      onClick={() => setFormData({...formData, agreedToTerms: !formData.agreedToTerms})}
                      className={`flex items-center justify-between p-8 rounded-[2rem] border transition-all cursor-pointer group ${
                        formData.agreedToTerms 
                          ? 'bg-primary/10 border-primary shadow-lg shadow-primary/20' 
                          : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex-1 pr-4">
                        <label className="text-xl font-bold text-white cursor-pointer block mb-1">
                          Accept Terms
                        </label>
                        <p className="text-sm text-gray-400 font-medium">I agree to Lawlify AI's Terms of Service and Privacy Policy.</p>
                      </div>
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                        formData.agreedToTerms ? 'bg-primary border-primary' : 'border-white/20 bg-white/5'
                      }`}>
                        {formData.agreedToTerms && <Check className="w-6 h-6 text-white" />}
                      </div>
                    </div>

                    <div 
                      onClick={() => setFormData({...formData, updates: !formData.updates})}
                      className={`flex items-center justify-between p-8 rounded-[2rem] border transition-all cursor-pointer group ${
                        formData.updates 
                          ? 'bg-primary/10 border-primary shadow-lg shadow-primary/20' 
                          : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex-1 pr-4">
                        <label className="text-xl font-bold text-white cursor-pointer block mb-1">
                          Product Updates
                        </label>
                        <p className="text-sm text-gray-400 font-medium">I want to receive product updates and launch emails.</p>
                      </div>
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                        formData.updates ? 'bg-primary border-primary' : 'border-white/20 bg-white/5'
                      }`}>
                        {formData.updates && <Check className="w-6 h-6 text-white" />}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="max-w-3xl mx-auto space-y-12">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest pl-2">Team Name</label>
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        value={formData.teamName}
                        onChange={(e) => setFormData({...formData, teamName: e.target.value})}
                        className={`flex-1 px-8 py-6 rounded-[2rem] bg-white/5 border-2 focus:bg-white/10 focus:outline-none transition-all text-2xl font-bold tracking-tight placeholder:text-gray-600 text-white ${
                          teamNameError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-primary'
                        }`}
                        placeholder="e.g. Maina & Associates"
                      />
                      <button 
                        type="button"
                        disabled={!!teamNameError || isCheckingTeamName}
                        onClick={() => {
                          // Visual feedback only since state is already updated via onChange
                          const btn = document.activeElement as HTMLButtonElement;
                          if (btn) {
                            const originalText = btn.innerText;
                            btn.innerText = "Saved!";
                            setTimeout(() => btn.innerText = originalText, 2000);
                          }
                        }}
                        className="px-10 py-6 bg-primary text-white font-bold rounded-[2rem] hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 active:scale-95"
                      >
                        Save
                      </button>
                    </div>
                    {isCheckingTeamName && <p className="mt-2 ml-4 text-xs font-bold text-primary animate-pulse uppercase tracking-widest">Verifying name uniqueness...</p>}
                    {teamNameError && <p className="mt-2 ml-4 text-xs font-bold text-red-500 uppercase tracking-widest">{teamNameError}</p>}
                    {!teamNameError && !isCheckingTeamName && formData.teamName && formData.teamName !== 'Personal' && (
                       <p className="mt-2 ml-4 text-xs font-bold text-green-500 uppercase tracking-widest flex items-center gap-1">
                         <Check className="w-3 h-3" /> Team name available
                       </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest pl-2">Invite Members</label>
                    <div className="bg-white/5 p-2 rounded-[2.5rem] border border-white/10 backdrop-blur-xl">
                      <div className="flex gap-2">
                        <input 
                          type="email" 
                          placeholder="Enter email address"
                          value={formData.inviteEmail}
                          onChange={(e) => setFormData({...formData, inviteEmail: e.target.value})}
                          className="flex-1 px-8 py-5 rounded-[2rem] bg-white/10 border border-transparent focus:border-white/20 focus:outline-none transition-all text-lg font-medium text-white placeholder:text-gray-500"
                        />
                        <div className="relative w-48">
                          <select 
                            value={formData.inviteRole}
                            onChange={(e) => setFormData({...formData, inviteRole: e.target.value})}
                            className="w-full h-full px-6 bg-white/10 border border-transparent rounded-[2rem] text-base font-bold text-white focus:outline-none appearance-none cursor-pointer hover:bg-white/20 transition-colors"
                          >
                            <option value="viewer" className="bg-black text-white">Viewer</option>
                            <option value="editor" className="bg-black text-white">Editor</option>
                            <option value="admin" className="bg-black text-white">Admin</option>
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => {
                            if (formData.inviteEmail) {
                              setFormData({
                                ...formData, 
                                teamMembers: [...formData.teamMembers, { email: formData.inviteEmail, role: formData.inviteRole }],
                                inviteEmail: '',
                                inviteRole: 'viewer'
                              });
                            }
                          }}
                          className="px-8 py-5 bg-primary text-white font-bold rounded-[2rem] hover:bg-primary-hover transition-colors flex items-center gap-3 shadow-lg shadow-primary/20 active:scale-95"
                        >
                          <Mail className="w-5 h-5" />
                          <span>Invite</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {formData.teamMembers.length > 0 && (
                    <div className="space-y-4">
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Pending Invites</p>
                      {formData.teamMembers.map((member, index) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={index} 
                          className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-xl"
                        >
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">
                              {member.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="text-lg font-bold text-white block">{member.email}</span>
                              <span className="text-sm font-medium text-gray-400 capitalize">{member.role}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">Pending</span>
                            <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                              <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="pt-8 border-t border-white/5 flex justify-between items-center">
          {currentStep > 1 ? (
            <button 
              onClick={handleBack}
              className="px-10 py-5 bg-white/5 border border-white/10 rounded-[2rem] text-base font-bold text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-3"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex items-center gap-6">
            {currentStep > 1 && currentStep !== 3 && (
              <button 
                onClick={handleSkip}
                className="px-8 py-5 text-base font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-2"
              >
                Skip
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={handleNext}
              disabled={currentStep === 3 && !formData.agreedToTerms}
              className={`px-12 py-5 bg-primary text-white rounded-[2rem] text-lg font-bold transition-all flex items-center gap-4 shadow-xl shadow-primary/30 ${
                currentStep === 3 && !formData.agreedToTerms ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-hover hover:scale-105 active:scale-95'
              }`}
            >
              {currentStep === STEPS.length ? 'Finish Setup' : 'Continue'}
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskCard = ({ 
  title, 
  description, 
  image,
  claimed, 
  onClick, 
  disabled,
  socialWidget
}: { 
  title: string, 
  description: string, 
  image?: string,
  claimed: boolean, 
  onClick: () => void, 
  disabled?: boolean,
  socialWidget?: React.ReactNode
}) => (
  <div 
    onClick={!disabled ? onClick : undefined}
    className={`p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer group relative overflow-hidden h-full flex flex-col justify-between ${
      claimed 
        ? 'bg-primary/10 border-primary' 
        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10'
    }`}
  >
    <div className="relative z-10">
      <div className="flex items-center gap-5 mb-4">
        {image && (
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-lg shadow-black/20">
            <img src={image} alt="" className="w-10 h-10 object-contain" />
          </div>
        )}
        <h3 className={`font-bold text-2xl tracking-tight text-white`}>{title}</h3>
      </div>
      <p className={`text-base font-medium leading-relaxed ${claimed ? 'text-gray-300' : 'text-gray-400'}`}>{description}</p>
      
      {!claimed && socialWidget && (
        <div className="relative z-20">
          {socialWidget}
        </div>
      )}
    </div>
    
    <div className="relative z-10 mt-8">
      {claimed ? (
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary rounded-xl border border-primary text-xs font-bold text-white uppercase tracking-wider shadow-sm">
          <Check className="w-4 h-4" />
          Claimed
        </div>
      ) : (
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 rounded-xl border border-white/20 text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-sm">
          Action Required
        </div>
      )}
    </div>

    {/* Decorative background element */}
    <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl transition-opacity duration-500 ${claimed ? 'bg-primary/20 opacity-100' : 'bg-primary/10 opacity-0 group-hover:opacity-100'}`} />
  </div>
);

export default OnboardingPage;
