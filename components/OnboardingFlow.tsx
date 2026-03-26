import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Users, 
  User,
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
  Scale
} from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const STEPS = [
  { id: 1, title: "Let's get you started", subtitle: "Complete these quick actions to set up your account." },
  { id: 2, title: "How did you first hear about us?", subtitle: "Help us understand how people discover Lawlify." },
  { id: 3, title: "How do you typically work?", subtitle: "Select the option that best matches your way of working." },
  { id: 4, title: "Terms of Service & Privacy Policy", subtitle: "Please review and accept our terms and privacy policy to continue." },
  { id: 5, title: "Invite your team", subtitle: "Invite teammates to collaborate on your projects." },
];

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    emailVerified: true,
    socials: {
      linkedin: false,
      twitter: false,
      youtube: false
    },
    discoverySource: '',
    workStyle: '',
    agreedToTerms: false,
    updates: false,
    teamName: 'Personal',
    teamMembers: [] as string[],
    inviteEmail: ''
  });

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 pb-0 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-black tracking-tight mb-2">{STEPS[currentStep - 1].title}</h1>
            <p className="text-gray-500 font-medium">{STEPS[currentStep - 1].subtitle}</p>
          </div>
          <div className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-bold text-gray-500 uppercase tracking-widest">
            Step {currentStep} of {STEPS.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-8 mt-6 mb-8">
          <div className="flex gap-2">
            {STEPS.map((step) => (
              <div 
                key={step.id} 
                className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${
                  step.id <= currentStep ? 'bg-primary' : 'bg-gray-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TaskCard 
                    title="Email Verified" 
                    description="Your email has been verified" 
                    claimed={formData.emailVerified}
                    onClick={() => {}}
                    disabled
                  />
                  <TaskCard 
                    title="Connect LinkedIn" 
                    description="Connect your professional profile" 
                    claimed={formData.socials.linkedin}
                    onClick={() => setFormData({...formData, socials: {...formData.socials, linkedin: true}})}
                  />
                  <TaskCard 
                    title="Follow us on X" 
                    description="Stay updated on new features and launches" 
                    claimed={formData.socials.twitter}
                    onClick={() => setFormData({...formData, socials: {...formData.socials, twitter: true}})}
                  />
                  <TaskCard 
                    title="Subscribe to our YouTube" 
                    description="Watch tutorials and product demos" 
                    claimed={formData.socials.youtube}
                    onClick={() => setFormData({...formData, socials: {...formData.socials, youtube: true}})}
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-3">
                  {['Search (Google/Bing)', 'AI Search (ChatGPT/Perplexity)', 'Social Media (LinkedIn/X)', 'Colleague Recommendation', 'Legal Tech Conference', 'Blog/Article'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setFormData({...formData, discoverySource: option})}
                      className={`w-full p-4 rounded-xl border text-left font-medium transition-all flex items-center gap-3 ${
                        formData.discoverySource === option 
                          ? 'bg-primary/5 border-primary text-primary' 
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {option === 'Search (Google/Bing)' && <Search className="w-5 h-5" />}
                      {option.includes('AI Search') && <MessageSquare className="w-5 h-5" />}
                      {option.includes('Social Media') && <Globe className="w-5 h-5" />}
                      {option.includes('Colleague') && <Users className="w-5 h-5" />}
                      {option.includes('Conference') && <Building2 className="w-5 h-5" />}
                      {option.includes('Blog') && <Briefcase className="w-5 h-5" />}
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {currentStep === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    onClick={() => setFormData({...formData, workStyle: 'independent'})}
                    className={`p-10 rounded-[2rem] border-2 text-left transition-all group relative overflow-hidden ${
                      formData.workStyle === 'independent'
                        ? 'bg-black border-black text-white shadow-2xl scale-[1.02]'
                        : 'bg-white border-gray-100 text-gray-900 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-colors ${
                      formData.workStyle === 'independent' ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-900'
                    }`}>
                      <User className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 tracking-tight">I work independently</h3>
                    <p className={`text-lg leading-relaxed ${
                      formData.workStyle === 'independent' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      I usually handle design projects on my own
                    </p>
                    {formData.workStyle === 'independent' && (
                      <motion.div 
                        layoutId="active-style"
                        className="absolute top-6 right-6 w-3 h-3 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                      />
                    )}
                  </button>

                  <button
                    onClick={() => setFormData({...formData, workStyle: 'collaborative'})}
                    className={`p-10 rounded-[2rem] border-2 text-left transition-all group relative overflow-hidden ${
                      formData.workStyle === 'collaborative'
                        ? 'bg-black border-black text-white shadow-2xl scale-[1.02]'
                        : 'bg-white border-gray-100 text-gray-900 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-colors ${
                      formData.workStyle === 'collaborative' ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-900'
                    }`}>
                      <Users className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 tracking-tight">I collaborate with others</h3>
                    <p className={`text-lg leading-relaxed ${
                      formData.workStyle === 'collaborative' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      I often work with teammates or creative partners
                    </p>
                    {formData.workStyle === 'collaborative' && (
                      <motion.div 
                        layoutId="active-style"
                        className="absolute top-6 right-6 w-3 h-3 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                      />
                    )}
                  </button>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-8">
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 h-64 overflow-y-auto text-sm text-gray-600 leading-relaxed">
                    <h3 className="font-bold text-black mb-2">TERMS OF USE / SERVICE AGREEMENT</h3>
                    <p className="mb-4">Last Updated: March 2026</p>
                    <p className="mb-4">Welcome to Lawlify AI. By accessing or using our platform, you agree to be bound by these Terms of Service and our Privacy Policy.</p>
                    <p className="mb-4 font-bold">1. Acceptance of Terms</p>
                    <p className="mb-4">By creating an account, accessing, or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, do not use the Service.</p>
                    <p className="mb-4 font-bold">2. Data Privacy & Security</p>
                    <p className="mb-4">We take your data privacy seriously. All client data is encrypted and stored securely. We do not use your confidential data to train our public models.</p>
                    <p className="mb-4 font-bold">3. Professional Responsibility</p>
                    <p>Lawlify AI is a tool to assist legal professionals. It does not provide legal advice and should not be relied upon as a substitute for professional legal judgment.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl">
                      <label htmlFor="terms" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                        I agree to Lawlify's <span className="text-primary underline">Terms of Service</span> and <span className="text-primary underline">Privacy Policy</span>.
                      </label>
                      <button 
                        id="terms"
                        onClick={() => setFormData({...formData, agreedToTerms: !formData.agreedToTerms})}
                        className={`w-12 h-6 rounded-full transition-colors relative ${formData.agreedToTerms ? 'bg-primary' : 'bg-gray-200'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${formData.agreedToTerms ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl">
                      <label htmlFor="updates" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                        I want to receive product updates and launch emails.
                      </label>
                      <button 
                        id="updates"
                        onClick={() => setFormData({...formData, updates: !formData.updates})}
                        className={`w-12 h-6 rounded-full transition-colors relative ${formData.updates ? 'bg-primary' : 'bg-gray-200'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${formData.updates ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Team Name</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={formData.teamName}
                        onChange={(e) => setFormData({...formData, teamName: e.target.value})}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                      <button className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-colors">
                        Save
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Invite Members</label>
                    <p className="text-sm text-gray-500 mb-4">Invite team members to collaborate on your Lawlify workspace.</p>
                    <div className="flex gap-2">
                      <input 
                        type="email" 
                        placeholder="Enter email address"
                        value={formData.inviteEmail}
                        onChange={(e) => setFormData({...formData, inviteEmail: e.target.value})}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                      <div className="relative">
                        <select className="h-full px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 focus:outline-none">
                          <option>Member</option>
                          <option>Admin</option>
                          <option>Viewer</option>
                        </select>
                      </div>
                      <button 
                        onClick={() => {
                          if (formData.inviteEmail) {
                            setFormData({
                              ...formData, 
                              teamMembers: [...formData.teamMembers, formData.inviteEmail],
                              inviteEmail: ''
                            });
                          }
                        }}
                        className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                  </div>

                  {formData.teamMembers.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {formData.teamMembers.map((email, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                              {email.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{email}</span>
                          </div>
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
          {currentStep > 1 ? (
            <button 
              onClick={handleBack}
              className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div></div> // Spacer
          )}

          <div className="flex items-center gap-4">
            {currentStep > 1 && (
              <button 
                onClick={handleSkip}
                className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-black transition-colors flex items-center gap-2"
              >
                Skip
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={handleNext}
              disabled={(currentStep === 4 && !formData.agreedToTerms) || (currentStep === 3 && !formData.workStyle)}
              className={`px-8 py-3 bg-primary text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/20 ${
                ((currentStep === 4 && !formData.agreedToTerms) || (currentStep === 3 && !formData.workStyle)) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-hover hover:scale-105 active:scale-95'
              }`}
            >
              {currentStep === STEPS.length ? 'Finish' : 'Continue'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const TaskCard = ({ title, description, claimed, onClick, disabled }: { title: string, description: string, claimed: boolean, onClick: () => void, disabled?: boolean }) => (
  <div 
    onClick={!disabled ? onClick : undefined}
    className={`p-6 rounded-2xl border transition-all cursor-pointer ${
      claimed 
        ? 'bg-green-50 border-green-200' 
        : 'bg-white border-gray-100 hover:border-primary/30 hover:shadow-md'
    }`}
  >
    <h3 className={`font-bold mb-1 ${claimed ? 'text-green-800' : 'text-black'}`}>{title}</h3>
    <p className={`text-sm mb-4 ${claimed ? 'text-green-600' : 'text-gray-500'}`}>{description}</p>
    
    {claimed ? (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-green-200 text-xs font-bold text-green-700 uppercase tracking-wider">
        <Check className="w-3 h-3" />
        Claimed
      </div>
    ) : (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20">
        Action Required
      </div>
    )}
  </div>
);

export default OnboardingFlow;
