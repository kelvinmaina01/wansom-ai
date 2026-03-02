
import React from 'react';
import { 
  Scale, 
  ShieldCheck, 
  Zap, 
  Globe, 
  ArrowRight, 
  MessageSquare, 
  FileText, 
  Search,
  CheckCircle2,
  Lock,
  EyeOff,
  Server
} from 'lucide-react';

const ADOPTED_COMPANIES = [
  { name: 'Bowmans', domain: 'bowmanslaw.com' },
  { name: 'ALN Africa', domain: 'aln.africa' },
  { name: 'ENSafrica', domain: 'ensafrica.com' },
  { name: 'Webber Wentzel', domain: 'webberwentzel.com' },
  { name: 'Adams & Adams', domain: 'adamsadams.com' },
  { name: 'CDH Law', domain: 'cliffedekkerhofmeyr.com' },
  { name: 'Afriwise', domain: 'afriwise.com' },
  { name: 'LawPavilion', domain: 'lawpavilion.com' },
  { name: 'Lawyers Hub', domain: 'lawyershub.ke' },
  { name: 'Anjarwalla & Khanna', domain: 'aandk.law' },
];

interface LandingPageProps {
  onEnterApp: () => void;
  onPricingClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onPricingClick }) => {
  return (
    <div className="min-h-screen bg-ai-studio text-white font-sans selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter">Lawlify</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Features</a>
            <button onClick={onPricingClick} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Pricing</button>
            <a href="#capabilities" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Capabilities</a>
            <a href="#security" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Security</a>
          </div>
          <button 
            onClick={onEnterApp}
            className="px-6 py-2.5 bg-primary text-white border border-white/20 rounded-full text-sm font-bold hover:bg-primary-hover transition-all active:scale-95 shadow-lg shadow-primary/20"
          >
            Launch app
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest uppercase text-primary mb-8 animate-fade-in">
            <Zap className="w-3 h-3" />
            Next-Gen Legal Intelligence for East Africa
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[0.9] max-w-5xl mx-auto">
            The future of <span className="text-primary">legal work</span> is here.
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Lawlify empowers legal professionals across East Africa with AI-driven research, 
            document analysis, and case intelligence. Built for the modern advocate.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onEnterApp}
              className="w-full sm:w-auto px-10 py-5 bg-primary text-white border border-white/20 rounded-2xl text-lg font-bold hover:bg-primary-hover transition-all active:scale-95 shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 group"
            >
              Get started for free
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-white/5 text-white border border-white/20 rounded-2xl text-lg font-bold hover:bg-white/10 transition-all">
              Book a demo
            </button>
          </div>

          {/* Dashboard Preview Mockup */}
          <div className="mt-24 relative max-w-6xl mx-auto">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="relative bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden aspect-[16/10] group">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
              <img 
                src="https://picsum.photos/seed/legal-dashboard/1920/1200" 
                alt="Lawlify Dashboard Preview" 
                className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 max-w-md text-left">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold">AI Legal Assistant</h4>
                      <p className="text-xs text-gray-500">Processing Kenyan Statutes...</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 bg-white/10 rounded-full w-full"></div>
                    <div className="h-2 bg-white/10 rounded-full w-5/6"></div>
                    <div className="h-2 bg-white/10 rounded-full w-4/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Adopted By Section */}
      <section className="py-12 border-y border-white/5 bg-black/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <p className="text-center text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500">
            Trusted by leading legal minds across Africa
          </p>
        </div>
        <div className="relative flex overflow-x-hidden group">
          <div className="flex animate-marquee whitespace-nowrap items-center py-8">
            {ADOPTED_COMPANIES.map((company, index) => (
              <div key={index} className="flex items-center gap-6 mx-16 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700 cursor-default scale-110 md:scale-125">
                <div className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                  <img 
                    src={`https://logo.clearbit.com/${company.domain}?size=256`} 
                    alt={company.name} 
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src.includes('clearbit')) {
                        target.src = `https://www.google.com/s2/favicons?domain=${company.domain}&sz=128`;
                      } else if (target.src.includes('google')) {
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=333&color=fff&size=128`;
                      }
                    }}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-xl font-bold tracking-tight text-white/90 uppercase italic">{company.name}</span>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {ADOPTED_COMPANIES.map((company, index) => (
              <div key={`dup-${index}`} className="flex items-center gap-6 mx-16 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700 cursor-default scale-110 md:scale-125">
                <div className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                  <img 
                    src={`https://logo.clearbit.com/${company.domain}?size=256`} 
                    alt={company.name} 
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src.includes('clearbit')) {
                        target.src = `https://www.google.com/s2/favicons?domain=${company.domain}&sz=128`;
                      } else if (target.src.includes('google')) {
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=333&color=fff&size=128`;
                      }
                    }}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-xl font-bold tracking-tight text-white/90 uppercase italic">{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Built for precision.</h2>
            <p className="text-gray-400 max-w-2xl mx-auto font-medium">
              We've engineered Lawlify to handle the complexities of East African law 
              with unprecedented speed and accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Search className="w-8 h-8" />}
              title="Intelligent Research"
              description="Instantly search through thousands of Kenyan and East African statutes, case laws, and legal precedents."
              color="red"
            />
            <FeatureCard 
              icon={<FileText className="w-8 h-8" />}
              title="Draft & Review"
              description="AI-powered document drafting and automated contract review. Identify risks and key obligations in seconds."
              color="blue"
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8" />}
              title="Document Vault"
              description="Secure, AI-indexed storage for all your legal documents. Find any clause or detail with natural language."
              color="green"
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8" />}
              title="Smart Workflows"
              description="Automate repetitive legal tasks, approval processes, and deadline tracking across your entire firm."
              color="red"
            />
            <FeatureCard 
              icon={<Globe className="w-8 h-8" />}
              title="Knowledge Base"
              description="A centralized repository of firm intelligence, past precedents, and institutional legal knowledge."
              color="blue"
            />
            <FeatureCard 
              icon={<MessageSquare className="w-8 h-8" />}
              title="AI Assistant"
              description="A dedicated legal co-pilot that understands the nuances of regional law and helps you draft better."
              color="green"
            />
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-32 px-6 bg-white/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Solutions for every practice.</h2>
            <p className="text-gray-400 max-w-2xl mx-auto font-medium">
              Lawlify is designed to meet the specific needs of diverse legal professionals.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <SolutionCard title="In-house Counsels" />
            <SolutionCard title="Litigation Lawyers" />
            <SolutionCard title="M&A Lawyers" />
            <SolutionCard title="Legal Intelligence" />
            <SolutionCard title="Law Schools" />
          </div>
        </div>
      </section>

      {/* Capabilities / Stats */}
      <section id="capabilities" className="py-32 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8 leading-tight">
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
            <StatCard value="98%" label="Accuracy Rate" />
            <StatCard value="10x" label="Faster Research" />
            <StatCard value="24/7" label="AI Availability" />
            <StatCard value="500+" label="Law Firms" />
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-32 px-6 bg-black/40 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-green/10 border border-secondary-green/20 text-[10px] font-bold tracking-widest uppercase text-secondary-green mb-8">
                <ShieldCheck className="w-3 h-3" />
                Enterprise-Grade Security
              </div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-tight">
                Your data is <span className="text-secondary-green">safe</span> with us.
              </h2>
              <p className="text-xl text-gray-400 font-medium leading-relaxed mb-12">
                We understand that legal data is the most sensitive asset of any firm. 
                That's why we've built Lawlify with a security-first architecture that 
                exceeds industry standards.
              </p>
              <div className="flex flex-wrap gap-8 items-center">
                <div className="group relative">
                  <img 
                    src="https://www.vanta.com/static/iso27001-badge.svg" 
                    alt="ISO 27001 Certified" 
                    className="h-16 w-auto opacity-80 group-hover:opacity-100 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold text-gray-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">ISO 27001 Certified</span>
                </div>
                <div className="group relative">
                  <img 
                    src="https://www.vanta.com/static/gdpr-badge.svg" 
                    alt="GDPR Compliant" 
                    className="h-16 w-auto opacity-80 group-hover:opacity-100 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold text-gray-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">GDPR Compliant</span>
                </div>
                <div className="group relative">
                  <img 
                    src="https://www.vanta.com/static/soc2-badge.svg" 
                    alt="SOC 2 Type II" 
                    className="h-16 w-auto opacity-80 group-hover:opacity-100 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold text-gray-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">SOC 2 Type II</span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <SecurityItem 
                icon={<Lock className="w-6 h-6 text-secondary-green" />}
                title="Data Encrypted in Transit and at Rest"
                description="End-to-end encryption protects your sensitive legal documents and communications at every stage of the lifecycle."
              />
              <SecurityItem 
                icon={<EyeOff className="w-6 h-6 text-secondary-green" />}
                title="No AI Training on User Data"
                description="Your confidential information stays private and is never used to train our AI models. Your data is your property."
              />
              <SecurityItem 
                icon={<Server className="w-6 h-6 text-secondary-green" />}
                title="On-premise Deployment Available"
                description="Deploy Lawlify AI within your own infrastructure for maximum security control and regional compliance."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6 relative bg-cta-glow border-y border-white/5">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold tracking-widest uppercase text-primary mb-12">
            <Zap className="w-3 h-3" />
            Join the legal revolution
          </div>
          <h2 className="text-5xl md:text-8xl font-bold tracking-tight mb-10 leading-[0.9]">
            Ready to transform your <span className="text-primary">practice?</span>
          </h2>
          <div className="flex flex-col items-center gap-8">
            <button 
              onClick={onEnterApp}
              className="px-16 py-8 bg-primary text-white border border-white/20 rounded-[2rem] text-2xl font-bold hover:bg-primary-hover transition-all active:scale-95 shadow-[0_0_50px_rgba(239,68,68,0.3)] group flex items-center gap-4"
            >
              Get started for free
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </button>
            <div className="flex flex-col gap-2">
              <p className="text-xl text-white/80 font-bold tracking-tight">No credit card required.</p>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-[0.2em]">Join 2,000+ legal professionals across East Africa</p>
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
                <span className="text-2xl font-bold tracking-tighter">Lawlify</span>
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
                <li><a href="#" className="hover:text-white transition-colors">Book A Demo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-8 text-xs font-bold text-gray-600 uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
            <div className="text-sm text-gray-600 font-medium">
              © 2026 Lawlify AI. All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
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

const SolutionCard = ({ title }: { title: string }) => (
  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all text-center cursor-default group">
    <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">{title}</span>
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

const StatCard = ({ value, label }: { value: string, label: string }) => (
  <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center">
    <div className="text-4xl font-bold text-white mb-2 tracking-tighter">{value}</div>
    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</div>
  </div>
);

const SecurityItem = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="flex gap-6 p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div>
      <h4 className="text-xl font-bold mb-2 tracking-tight text-white">{title}</h4>
      <p className="text-gray-400 font-medium leading-relaxed text-sm">{description}</p>
    </div>
  </div>
);

export default LandingPage;
