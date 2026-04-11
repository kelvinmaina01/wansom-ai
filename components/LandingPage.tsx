import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import TermsModal from './TermsModal';
import SupportSidebar from './SupportSidebar';
import FeaturesSection from './landing/FeaturesSection';
import {
  Scale,
  ShieldCheck,
  Zap,
  Globe,
  ArrowRight,
  ArrowUp,
  MessageSquare,
  FileText,
  Search,
  CheckCircle2,
  Lock,
  EyeOff,
  Server,
  Heart,
  GraduationCap,
  School,
  Building2,
  Check,
  Box,
  DollarSign,
  Briefcase,
  User,
  X,
  ChevronRight,
  Star,
  Shield,
  Activity,
  UserCheck,
  HelpCircle
} from 'lucide-react';

const PARTNER_LOGOS = [
  "https://i.ibb.co/WN9rdRNn/TANZII.png",
  "https://i.ibb.co/wNKwkrm6/ng.png",
  "https://i.ibb.co/20fzVNZc/omwanzaaaa.avif",
  "https://i.ibb.co/KcYRFmMv/imggelogoooo.avif",
  "https://i.ibb.co/1fP2sT2x/loooooooogo.avif",
  "https://i.ibb.co/0RN9c7Gm/logoimge3.avif",
  "https://i.ibb.co/svBJMHnc/ogoimage-3.avif",
  "https://i.ibb.co/1YNYSdCr/logoimage2222222222222.avif"
];

const FAQ_CATEGORIES = [
  { id: 'product', label: 'Product', icon: Box, color: 'text-primary border-primary/20 bg-primary/10 hover:bg-primary hover:text-white', activeColor: 'bg-primary text-white border-primary shadow-lg shadow-primary/20' },
  { id: 'pricing', label: 'Pricing', icon: DollarSign, color: 'text-green-500 border-green-500/20 bg-green-500/10 hover:bg-green-500 hover:text-white', activeColor: 'bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/20' },
  { id: 'usecases', label: 'Use Cases', icon: Briefcase, color: 'text-blue-500 border-blue-500/20 bg-blue-500/10 hover:bg-blue-500 hover:text-white', activeColor: 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/20' },
  { id: 'security', label: 'Security', icon: ShieldCheck, color: 'text-purple-500 border-purple-500/20 bg-purple-500/10 hover:bg-purple-500 hover:text-white', activeColor: 'bg-purple-500 text-white border-purple-500 shadow-lg shadow-purple-500/20' },
  { id: 'account', label: 'Account', icon: User, color: 'text-orange-500 border-orange-500/20 bg-orange-500/10 hover:bg-orange-500 hover:text-white', activeColor: 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20' },
];

const CATEGORIZED_FAQS: Record<string, { question: string, answer: string }[]> = {
  product: [
    { question: "Can Lawlify AI analyze my own PDF documents?", answer: "Yes. Our AI Drafter and Review tools can ingest and analyze your uploaded PDFs, compare them against East African precedents, and flag risks or draft counter-clauses." },
    { question: "How accurate is the legal research?", answer: "Lawlify AI uses semantic vector search against a highly curated database of verified statutes and judgements, ensuring results are highly relevant and hallucination-free." },
    { question: "Is Lawlify AI available offline?", answer: "Currently, Lawlify AI requires an internet connection to securely access the latest case law and LLM reasoning models via the cloud." }
  ],
  pricing: [
    { question: "Are there team or enterprise plans?", answer: "Yes, we offer Firm and Enterprise tiers that include multi-seat licensing, admin dashboards, and custom on-premise deployment options." },
    { question: "How does AI token billing work?", answer: "Each query or document generation consumes specific 'AI tokens'. Subscriptions include a generous monthly allowance, and you can purchase top-up token bundles if you run out." },
    { question: "Can I cancel my subscription anytime?", answer: "Absolutely. We offer month-to-month flexibility. You can cancel or downgrade your plan directly from the 'Settings > Billing' panel at any time." }
  ],
  usecases: [
    { question: "Is this built for litigation or corporate commercial law?", answer: "Both. Our platform features specialized AI agents trained specifically for dispute resolution (case law finding, motion drafting) and corporate practice (contract review, compliance checking)." },
    { question: "Can Lawlify replace paralegals?", answer: "Lawlify AI is designed to augment, not replace, human legal teams. It accelerates tedious manual research and first-draft generation, allowing paralegals and associates to focus on high-value strategy." }
  ],
  security: [
    { question: "Where is my confidential data stored?", answer: "All data is encrypted at rest and in transit. By default, it is stored in secure, SOC2-compliant cloud environments. Enterprise clients can request localized or on-premise deployments." },
    { question: "Is Lawlify AI GDPR and regional privacy compliant?", answer: "Yes. We rigorously adhere to global GDPR standards and specific East African data protection acts (such as Kenya's DPA 2019)." },
    { question: "Are my documents used to train your AI?", answer: "No. Your proprietary documents and chat histories remain strictly confidential and are never used to train our base language models." }
  ],
  account: [
    { question: "How do I add team members?", answer: "Firm administrators can invite new members via the 'Workspace Settings' tab by entering their email addresses and assigning role-based permissions." },
    { question: "Can I retrieve my chat history if I switch devices?", answer: "Yes. All your activity is securely synced to your account in real-time. Simply log in on any device to resume your work." },
    { question: "How do I delete my account?", answer: "You can permanently delete your account and all associated data directly from the 'Settings > Profile' page under the 'Danger Zone' section." }
  ]
};

const PRECISION_FEATURES = [
  {
    title: 'Intelligent Research',
    description: 'Instantly search thousands of East African statutes and precedents.'
  },
  {
    title: 'Draft & Review',
    description: 'AI-automated contract review and document drafting with regional context.'
  },
  {
    title: 'Document Vault',
    description: 'Secure, AI-indexed storage for all your sensitive legal papers.'
  },
  {
    title: 'Smart Workflows',
    description: 'Automate repetitive tasks and deadline tracking across your firm.'
  },
  {
    title: 'Knowledge Base',
    description: 'Centralized repository of firm intelligence and institutional knowledge.'
  },
  {
    title: 'AI Assistant',
    description: 'A dedicated legal co-pilot that understands East African legal nuances.'
  },
];

interface LandingPageProps {
  onEnterApp: () => void;
  onPricingClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onPricingClick }) => {
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [termsModalType, setTermsModalType] = useState<'terms' | 'privacy'>('terms');
  const [activeFaqCategory, setActiveFaqCategory] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isKelvinOpen, setIsKelvinOpen] = useState(false);

  const PARTNER_LOGOS_RANDOMIZED = useMemo(() => {
    return [...PARTNER_LOGOS].sort(() => Math.random() - 0.5);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openTermsModal = (type: 'terms' | 'privacy') => {
    setTermsModalType(type);
    setTermsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-ai-studio text-slate-900 font-sans selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter">Lawlify AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Features</a>
            <button onClick={onPricingClick} className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Pricing</button>
            <a href="#capabilities" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Capabilities</a>
            <a href="#security" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Security</a>
            
            <button 
              onClick={() => setIsKelvinOpen(true)}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors border-l border-slate-200 pl-8"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Support</span>
            </button>
          </div>
          <button
            onClick={onEnterApp}
            className="px-6 py-2.5 bg-primary text-white border border-primary/20 rounded-full text-sm font-bold hover:bg-primary-hover transition-all active:scale-95 shadow-lg shadow-primary/20"
          >
            Launch app
          </button>
        </div>
      </nav>

       {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-[10px] font-bold tracking-widest uppercase text-primary mb-8 animate-fade-in">
            <Scale className="w-3 h-3" />
            Next-Gen Legal Intelligence for East Africa
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9] max-w-5xl mx-auto text-slate-900">
            The future of <span className="text-primary font-bold">legal work</span> is here.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Lawlify empowers legal professionals across East Africa with AI-driven research,
            document analysis, and case intelligence. Built for the modern advocate.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <button
              onClick={onEnterApp}
              className="w-full sm:w-auto px-10 py-3 bg-primary text-white border border-primary/20 rounded-2xl text-lg font-bold hover:bg-primary-hover transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-3 group"
            >
              Get started for free
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => window.location.href = '/book-demo'}
              className="w-full sm:w-auto px-10 py-5 bg-slate-50 font-bold text-slate-900 border border-slate-200 rounded-2xl text-lg hover:bg-slate-100 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200/50 active:scale-95"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Book a demo
            </button>
          </div>

          {/* Dashboard Preview Mockup */}
          <div className="mt-24 relative max-w-6xl mx-auto">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="relative bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden aspect-[16/10] group">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-200/20 pointer-events-none"></div>
              <img
                src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop"
                alt="Lawlify Professional Dashboard"
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 max-w-md text-left shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">AI Legal Assistant</h4>
                      <p className="text-xs text-slate-400 font-medium tracking-tight">Processing Kenyan Statutes...</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 bg-slate-100 rounded-full w-full"></div>
                    <div className="h-2 bg-slate-100 rounded-full w-5/6"></div>
                    <div className="h-2 bg-slate-100 rounded-full w-4/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Adopted By Section - Enhanced for Visibility */}
      <section className="py-16 border-y border-slate-200 bg-slate-50 overflow-hidden relative z-20">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <p className="text-center text-xs font-black tracking-[0.3em] uppercase text-slate-400 opacity-80">
            Trusted by leading legal minds across Africa
          </p>
        </div>
        <div className="relative flex overflow-x-hidden">
          <div className="flex animate-marquee whitespace-nowrap items-center py-4 min-w-max">
            {PARTNER_LOGOS_RANDOMIZED.map((logo, index) => (
              <div key={index} className="flex items-center mx-12 transition-all duration-300 hover:scale-110 shrink-0">
                <img 
                  src={logo} 
                  alt="Partner Logo" 
                  className="h-12 md:h-16 w-auto object-contain pointer-events-none grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100" 
                  loading="eager"
                />
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {PARTNER_LOGOS_RANDOMIZED.map((logo, index) => (
              <div key={`dup-${index}`} className="flex items-center mx-12 transition-all duration-300 hover:scale-110 shrink-0">
                <img 
                  src={logo} 
                  alt="Partner Logo" 
                  className="h-12 md:h-16 w-auto object-contain pointer-events-none grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100" 
                  loading="eager"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid - Redesigned to Fly.io Style (Single Card) */}
      <section id="features" className="py-32 px-6 bg-ai-studio relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative p-10 md:p-16 rounded-[2.5rem] bg-slate-50 border border-slate-200 overflow-visible group shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-all duration-700"></div>
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Left Side: Text Content */}
              <div className="flex-1 w-full max-w-xl z-20">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-[1.1] text-slate-900">
                  Features That <br /><span className="text-primary">Make Sense</span>
                </h2>
                <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12">
                  Want to feel special? Join Lawlify AI and take home these wonderful features (and more) designed for the modern African advocate.
                </p>
                <button
                  onClick={onEnterApp}
                  className="px-12 py-5 bg-primary text-white text-xl font-bold rounded-2xl hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 active:scale-95 flex items-center gap-3 group/btn w-fit"
                >
                  Start Now
                  <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Right Side: Overlapping Notebook Paper (Refined) */}
              <div className="flex-1 w-full max-w-lg lg:absolute lg:-right-4 lg:top-[48%] lg:-translate-y-1/2 z-30">
                <div className="bg-[#fffdf5] rounded-[2rem] border border-[#e8e4d1] relative overflow-hidden transform lg:rotate-3 text-neutral-900">
                  {/* Red Margin Line */}
                  <div className="absolute left-12 top-0 bottom-0 w-[2px] bg-red-200/60" />
                  
                  {/* Rules */}
                  <div className="absolute inset-0 pointer-events-none opacity-50" 
                    style={{ 
                      backgroundImage: 'linear-gradient(to bottom, #d1d5db 1px, transparent 1px)',
                      backgroundSize: '100% 48px',
                      backgroundPosition: '0 40px'
                    }} 
                  />

                  {/* Content */}
                  <div className="relative z-10 py-8 pl-20 pr-10 space-y-4">
                    {PRECISION_FEATURES.map((feature, idx) => (
                      <div key={idx} className="flex gap-4 group/item">
                        <div className="mt-1 shrink-0">
                          <Check className="w-6 h-6 text-emerald-500 stroke-[3px]" />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-gray-900 leading-tight mb-1">{feature.title}</h4>
                          <p className="text-sm font-medium text-gray-500 leading-snug">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decorative paper stack effect */}
                <div className="absolute inset-0 bg-white/10 -z-10 rounded-[2rem] translate-x-4 translate-y-1 border border-white/5 lg:rotate-3"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      {/* Solutions Section */}
      <section id="solutions" className="py-32 px-6 bg-slate-50/50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-slate-900">Solutions for every practice.</h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">
              Lawlify is designed to meet the specific needs of diverse legal professionals.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <SolutionCard title="In-house Counsels" icon={Building2} />
            <SolutionCard title="Litigation Lawyers" icon={Scale} />
            <SolutionCard title="M&A Lawyers" icon={Briefcase} />
            <SolutionCard title="Legal Intelligence" icon={Zap} />
            <SolutionCard title="Law Schools" icon={School} />
          </div>
        </div>
      </section>

      {/* Interactive Features Platform Section */}
      <FeaturesSection />

      {/* Capabilities / Stats */}
      <section id="capabilities" className="py-32 px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8 leading-tight text-slate-900">
              Empowering the next generation of <span className="text-primary">Legal Advocates</span>.
            </h2>
            <div className="space-y-6">
              <CapabilityItem text="Access to 50,000+ Kenyan legal documents" />
              <CapabilityItem text="AI-powered drafting for common legal forms" />
              <CapabilityItem text="Cross-jurisdictional research (EAC region)" />
              <CapabilityItem text="Secure, encrypted client data management" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <AnimatedStatCard value="98%" label="Accuracy Rate" />
            <AnimatedStatCard value="10x" label="Faster Research" />
            <AnimatedStatCard value="24/7" label="AI Availability" />
            <AnimatedStatCard value="500+" label="Law Firms" />
          </div>
        </div>
      </section>

       {/* Security Section */}
      <section id="security" className="py-32 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold tracking-widest uppercase text-primary mb-8">
                <ShieldCheck className="w-3 h-3" />
                Enterprise-Grade Security
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8 leading-tight text-slate-900">
                Your data is <span className="text-primary">safe</span> with us.
              </h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12">
                We understand that legal data is the most sensitive asset of any firm.
                That's why we've built Lawlify with a security-first architecture that
                exceeds industry standards.
              </p>
            </div>
            <div className="space-y-6">
              <SecurityItem
                icon={<Lock className="w-6 h-6 text-primary" />}
                title="Data Encrypted in Transit and at Rest"
                description="End-to-end encryption protects your sensitive legal documents and communications at every stage of the lifecycle."
                delay={0}
              />
              <SecurityItem
                icon={<EyeOff className="w-6 h-6 text-primary" />}
                title="No AI Training on User Data"
                description="Your confidential information stays private and is never used to train our AI models. Your data is your property."
                delay={1}
              />
              <SecurityItem
                icon={<Server className="w-6 h-6 text-primary" />}
                title="On-premise Deployment Available"
                description="Deploy Lawlify AI within your own infrastructure for maximum security control and regional compliance."
                delay={2}
              />
            </div>
          </div>

          {/* Compliance Badges Row Restored & Upgraded */}
          <div className="mt-16 pt-12 border-t border-slate-200 flex flex-wrap items-center justify-start gap-12">
            <div className="flex items-center gap-6 group">
              <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center border-2 border-yellow-500/30 group-hover:border-yellow-500 group-hover:shadow-[0_0_40px_rgba(234,179,8,0.2)] group-hover:scale-[1.02] transition-all duration-500 relative shadow-lg shadow-slate-200/50">
                <div className="absolute inset-1 border border-dashed border-yellow-500/30 rounded-full animate-[spin_40s_linear_infinite]" />
                <div className="absolute inset-0 flex flex-col items-center justify-between py-2">
                  <div className="flex gap-1.5 opacity-80">
                    <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500 -rotate-12" />
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500 rotate-12" />
                  </div>
                  <div className="flex gap-1 opacity-60">
                    <Star className="w-2 h-2 text-yellow-500 fill-yellow-500" />
                    <Star className="w-2 h-2 text-yellow-500 fill-yellow-500" />
                  </div>
                </div>
                <span className="text-slate-900 text-lg font-black leading-tight relative z-10">SOC 2</span>
                <span className="text-yellow-500 text-[9px] font-black uppercase tracking-[0.2em] relative z-10 mt-0.5">Type II</span>
              </div>
              <div className="flex flex-col max-w-[150px]">
                <span className="text-slate-900 font-bold text-lg mb-1">SOC 2 Type II</span>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-widest leading-relaxed">Audited controls protect every case</span>
              </div>
            </div>

            <div className="w-px h-16 bg-slate-200 hidden md:block" />

            <div className="flex items-center gap-6 group">
              <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center border-2 border-blue-500/30 group-hover:border-blue-500 group-hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] group-hover:scale-[1.02] transition-all duration-500 relative shadow-lg shadow-slate-200/50">
                <div className="absolute inset-1 border border-dashed border-blue-500/30 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
                <div className="absolute inset-0 flex flex-col items-center justify-between py-2">
                  <div className="flex gap-1.5 opacity-80">
                    <Star className="w-2.5 h-2.5 text-blue-400 fill-blue-400 -rotate-12" />
                    <Star className="w-3 h-3 text-blue-400 fill-blue-400" />
                    <Star className="w-2.5 h-2.5 text-blue-400 fill-blue-400 rotate-12" />
                  </div>
                  <div className="flex gap-1 opacity-60">
                    <Star className="w-2 h-2 text-blue-400 fill-blue-400" />
                    <Star className="w-2 h-2 text-blue-400 fill-blue-400" />
                  </div>
                </div>
                <span className="text-slate-900 text-lg font-black leading-tight relative z-10">GDPR</span>
                <span className="text-blue-400 text-[8px] font-black uppercase tracking-[0.2em] relative z-10 mt-0.5">Compliant</span>
              </div>
              <div className="flex flex-col max-w-[150px]">
                <span className="text-slate-900 font-bold text-lg mb-1">GDPR Compliant</span>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-widest leading-relaxed">Your data, always your property</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education Support Section */}
      <section className="relative py-24 px-6 border-t border-slate-200 bg-white">
        <div className="absolute inset-0 bg-primary/5 blur-[100px] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full text-primary font-bold text-[10px] uppercase tracking-widest mb-6 border border-primary/20">
              <Heart className="w-3 h-3" />
              <span>Supporting Education</span>
            </div>
            <h2 className="text-4xl font-black mb-4 text-slate-900">We believe in empowering the next generation</h2>
            <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
              The future of law depends on accessible tools. That's why we offer students and academic researchers massive discounts because breakthrough legal work shouldn't be limited by budget.
            </p>
          </div>

          <div className="bg-slate-50 p-2 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-200 flex flex-col md:flex-row overflow-hidden">
            {/* Left Panel: Discounts List */}
            <div className="flex-1 p-10 space-y-8">
              <div className="flex gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-primary transition-colors">90% Student Discount</h3>
                  <p className="text-slate-500 text-sm font-medium">Full Personal features for just $1.50/month. Same powerful AI, same unlimited analysis.</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-sm">
                  <School className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-blue-500 transition-colors">50% Academic Institution</h3>
                  <p className="text-slate-500 text-sm font-medium">Universities, research institutions, and legal clinics qualify for institutional discounts on team plans.</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all duration-300 shadow-sm">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-green-500 transition-colors">Non-Profit Organizations</h3>
                  <p className="text-slate-500 text-sm font-medium">Registered non-profits advancing justice receive 50% off all plans.</p>
                </div>
              </div>
            </div>

            {/* Right Panel: Verification Card */}
            <div className="w-full md:w-[400px] bg-white rounded-[2rem] p-10 flex flex-col justify-center border border-slate-200 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none"></div>

              <div className="mb-6 relative z-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-slate-300 line-through text-lg font-medium">$15</span>
                  <span className="text-5xl font-black text-primary">$1.50</span>
                  <span className="text-slate-400 font-medium">/mo</span>
                </div>
                <p className="text-sm text-slate-500 font-medium mt-2">Personal plan with student discount</p>
              </div>

              <ul className="space-y-3 mb-8 relative z-10">
                {['Full AI analysis suite', 'Unlimited workspaces', '5 GB storage', 'Priority support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-bold text-slate-600">
                    <Check className="w-4 h-4 text-primary" strokeWidth={3} />
                    {item}
                  </li>
                ))}
              </ul>

              <button className="w-full py-4 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20 relative z-10">
                Verify Student Status
              </button>
              <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-widest mt-4 relative z-10">
                Instant verification with .edu email
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-32 px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="p-12 md:p-20 rounded-[3rem] bg-slate-900 border border-white/10 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none group-hover:bg-primary/30 transition-all duration-700"></div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold tracking-widest uppercase text-primary mb-8">
                  <Building2 className="w-3 h-3" />
                  Enterprise Solutions
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight text-white">
                  Need a custom <span className="text-primary font-bold">enterprise</span> solution?
                </h2>
                <p className="text-xl text-slate-400 font-medium leading-relaxed mb-12">
                  Large law firms and legal departments can get custom pricing, on-premise deployments, SSO, advanced audit logs, and dedicated account management.
                </p>
                <button 
                  onClick={() => window.location.href = '/book-demo'}
                  className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[12px] hover:bg-slate-100 transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-3 active:scale-95 group/btn"
                >
                  Book a Demo here
                  <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: 'On-premise', desc: 'Secure local deployment', icon: Server },
                  { title: 'Custom SSO', desc: 'Enterprise authentication', icon: Shield },
                  { title: 'Audit Logs', desc: 'Advanced compliance', icon: Activity },
                  { title: 'Dedicated', desc: 'Account management', icon: UserCheck }
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-primary border border-primary-hover rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white mb-1 tracking-tight">{item.title}</h4>
                      <p className="text-sm text-white/90 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif mb-16 text-center">
            Frequently asked questions
          </h2>
          <div className="flex flex-col border-t border-white/10">
            <FAQItem
              question="What is Lawlify AI and how does it work?"
              answer="Lawlify AI is an advanced legal agent designed specifically for East African jurisdictions. It works by combining state-of-the-art reasoning models with a secure, highly-indexed database of regional statutes, case law, and regulations to provide accurate, citable legal insights."
            />
            <FAQItem
              question="What should I use Lawlify AI for?"
              answer="You should use Lawlify AI to drastically reduce time spent on manual legal research, to draft precise provisions and corporate agreements, to instantly review contracts for non-compliance or risks, and to manage your firm's internal precedents securely."
            />
            <FAQItem
              question="How much does it cost to use?"
              answer="Lawlify AI offers a free tier for essential research out-of-the-box. For full access to the AI Drafter, unlimited document analysis, and comprehensive workflow tools, premium plans are available starting at accessible monthly rates for solo practitioners and scaling for large enterprise firms."
            />
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Explore more FAQs</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {FAQ_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFaqCategory(activeFaqCategory === cat.id ? null : cat.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-bold transition-all duration-300 ${activeFaqCategory === cat.id ? cat.activeColor : cat.color
                    }`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.label}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {activeFaqCategory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-12 text-left overflow-hidden"
                >
                  <div className="flex flex-col border-t border-white/10">
                    {CATEGORIZED_FAQS[activeFaqCategory].map((faq, idx) => (
                      <FAQItem
                        key={idx}
                        question={faq.question}
                        answer={faq.answer}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-32 pt-16 border-t border-white/10 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-32">
              <h3 className="text-3xl md:text-5xl font-serif text-center md:text-left leading-tight">
                Still stuck?<br />
                <span className="text-gray-400">Let <span className="text-white">us</span> assist you.</span>
              </h3>

               <div className="flex flex-col items-center gap-4">
                <motion.button
                  onClick={() => setIsKelvinOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-4 px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 rounded-3xl transition-all group"
                >
                  <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <HelpCircle className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-1">Lawlify Support</div>
                    <div className="text-xl font-bold text-white">Open Support Hub</div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-500 group-hover:translate-x-1 transition-all ml-4" />
                </motion.button>
                
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Typical response time: &lt; 2 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Quote Section */}
      <section className="py-32 px-6 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 lg:gap-24">
          <div className="flex-1">
            <div className="text-primary mb-12">
              <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
                <path d="M18 15V35H5V15H18ZM40 15V35H27V15H40Z" fill="currentColor" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-normal italic leading-tight tracking-tight mb-12 text-white/90">
              "East African lawyers are among the sharpest in the world. They shouldn't be spending their days formatting documents and recalculating court deadlines. I built Lawlify to give every practitioner — from a solo advocate in Kisumu to a 50-partner firm in Nairobi — the operational power of the best-resourced firms on the continent."
            </h2>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 ring-4 ring-primary">
                <img src="/founder.png" alt="Founder" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-0.5">Founder, Lawlify AI</h4>
                <p className="text-sm text-gray-500 font-medium">Building the legal operating system for East Africa</p>
                <a
                  href="https://www.linkedin.com/posts/lawlify-ai_lawlifyai-legaltech-eastafrica-activity-7441210114327486464-g5-U?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFn6QnIBJ6an0SpQnnoh1262mrOpYO7pl8A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-2 mt-2 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                  Read our LinkedIn post →
                </a>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[420px] shrink-0">
            <div className="bg-[#111111] border border-white/10 rounded-[2.5rem] p-12 text-center relative group overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-all duration-700"></div>
              <div className="w-20 h-20 bg-primary rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/30 relative z-10">
                <Scale className="w-10 h-10 text-white" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Lawlify AI</h3>
                <p className="text-gray-500 text-sm font-medium mb-10">Legal Operating System for East Africa</p>
                <a
                  href="https://www.linkedin.com/posts/lawlify-ai_lawlifyai-legaltech-eastafrica-activity-7441210114327486464-g5-U?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFn6QnIBJ6an0SpQnnoh1262mrOpYO7pl8A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4.5 bg-[#2A0808] hover:bg-[#3D0F0F] text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-3 border border-primary/20 shadow-lg shadow-black/50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                  Follow on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6 relative bg-cta-glow border-y border-white/5">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold tracking-widest uppercase text-primary mb-12">
            <Zap className="w-3 h-3" />
            Join the legal revolution
          </div>
          <h2 className="text-5xl md:text-8xl font-semibold tracking-tight mb-10 leading-[0.9] whitespace-nowrap">
            Ready to transform<br />your <span className="text-primary">practice?</span>
          </h2>
          <div className="flex flex-col items-center gap-8">
            <button
              onClick={onEnterApp}
              className="px-16 py-4 bg-primary text-white border border-white/10 rounded-[2rem] text-2xl font-bold hover:bg-primary-hover transition-all active:scale-95 shadow-xl shadow-primary/10 group flex items-center gap-4"
            >
              Get started for free
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </button>
            <div className="flex flex-col items-center gap-4">
              <p className="text-xl text-white/80 font-bold tracking-tight">No credit card required.</p>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=faces" alt="User" className="w-8 h-8 rounded-full border-2 border-black object-cover" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" alt="User" className="w-8 h-8 rounded-full border-2 border-black object-cover" />
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces" alt="User" className="w-8 h-8 rounded-full border-2 border-black object-cover" />
                  <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces" alt="User" className="w-8 h-8 rounded-full border-2 border-black object-cover" />
                  <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces" alt="User" className="w-8 h-8 rounded-full border-2 border-black object-cover" />
                </div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-[0.2em]">Join 2,000+ legal professionals across East Africa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold tracking-tighter">Lawlify AI</span>
              </div>
              <p className="text-gray-400 max-w-xs font-medium leading-relaxed">
                AI-powered legal platform for modern law firms and in-house legal teams.
              </p>
              <div className="mt-8">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Contact us</p>
                <a href="mailto:law@lawlify.ai" className="text-lg font-bold text-white hover:text-primary transition-colors">law@lawlify.ai</a>
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="text-white font-bold mb-6">AI Platform</h4>
              <ul className="space-y-4 text-sm font-medium text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">AI Assistant</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Draft & Review</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Document Vault</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Workflows</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Knowledge Base</a></li>
                <li><a href="/kockpit" className="hover:text-white transition-colors flex items-center gap-2"><Lock className="w-3 h-3" /> Admin Kockpit</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Solutions For</h4>
              <ul className="space-y-4 text-sm font-medium text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">In-house counsels</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Litigation Lawyers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">M&A Lawyers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Legal Intelligence</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Law Schools</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Resources</h4>
              <ul className="space-y-4 text-sm font-medium text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">Articles</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Newsletters</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="/book-demo" className="hover:text-white transition-colors">Book A Demo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-8 text-xs font-bold text-gray-600 uppercase tracking-widest">
              <button onClick={() => openTermsModal('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
              <button onClick={() => openTermsModal('terms')} className="hover:text-white transition-colors">Terms of Service</button>
            </div>
            <div className="text-sm text-gray-600 font-medium">
              © 2026 Lawlify AI. All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <button
              onClick={scrollToTop}
              className="p-4 bg-primary text-white rounded-full shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:bg-primary-hover hover:scale-110 active:scale-95 transition-all outline-none"
              title="Back to top"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <SupportSidebar 
        isOpen={isKelvinOpen} 
        onClose={() => setIsKelvinOpen(false)} 
        userName="Guest" 
      />

      <TermsModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        type={termsModalType}
      />
    </div>
  );
};

const FeatureCard = ({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: 'red' | 'blue' | 'green' }) => {
  const colorClasses = {
    red: 'text-primary bg-primary/10 border-primary/20',
    blue: 'text-secondary-blue bg-secondary-blue/10 border-secondary-blue/20',
    green: 'text-secondary-green bg-secondary-green/10 border-secondary-green/20'
  };

  return (
    <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${colorClasses[color]} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 tracking-tight">{title}</h3>
      <p className="text-gray-400 leading-relaxed font-medium">{description}</p>
    </div>
  );
};

const SolutionCard = ({ title, icon: Icon }: { title: string, icon: React.ElementType }) => (
  <div className="p-8 rounded-3xl bg-white border border-white/10 hover:bg-primary transition-all duration-500 cursor-default group flex flex-col items-center gap-6 text-center shadow-xl hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-2">
    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-white/20 group-hover:text-white transition-all duration-500 shadow-lg shadow-primary/5">
      <Icon className="w-8 h-8" />
    </div>
    <span className="text-sm font-black text-gray-800 group-hover:text-white transition-colors duration-500 uppercase tracking-wider">{title}</span>
  </div>
);

const CapabilityItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-4">
    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
      <CheckCircle2 className="w-4 h-4 text-primary" />
    </div>
    <span className="text-gray-300 font-medium">{text}</span>
  </div>
);

const AnimatedStatCard = ({ value, label }: { value: string, label: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const match = value.match(/^([\d,]+)(.*)$/);
  const numericValue = match ? parseInt(match[1].replace(/,/g, '')) : 0;
  const suffix = match ? match[2] : value;

  useEffect(() => {
    if (!isInView || numericValue === 0) return;
    let startTimestamp: number | null = null;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4); // Better easing
      setCount(Math.floor(easeOutQuart * numericValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [numericValue, isInView]);

  return (
    <div ref={ref} className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center hover:bg-white/10 transition-colors relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter relative z-10 transition-transform duration-300 group-hover:scale-105 group-hover:text-primary">
        {numericValue > 0 ? count : ''}{numericValue > 0 ? suffix : value}
      </div>
      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest relative z-10 group-hover:text-gray-300">{label}</div>
    </div>
  );
};

const SecurityItem = ({ icon, title, description, delay = 0 }: { icon: React.ReactNode, title: string, description: string, delay?: number }) => (
  <motion.div
    animate={{
      scale: [1, 0.95, 1],
      boxShadow: [
        "0px 0px 0px rgba(0,0,0,0)",
        "0px 10px 30px rgba(239, 68, 68, 0.15)",
        "0px 0px 0px rgba(0,0,0,0)"
      ]
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
      delay: delay
    }}
    className="flex gap-6 p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group cursor-pointer"
  >
    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div>
      <h4 className="text-xl font-bold mb-2 tracking-tight text-white">{title}</h4>
      <p className="text-gray-400 font-medium leading-relaxed text-sm">{description}</p>
    </div>
  </motion.div>
);

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="py-6 border-b border-white/10 group cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xl md:text-2xl font-serif text-white/90 group-hover:text-white transition-colors">{question}</h3>
        <span className={`text-gray-400 font-light text-3xl transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
          +
        </span>
      </div>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-gray-400 text-lg font-sans font-medium leading-relaxed pr-12">
          {answer}
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
