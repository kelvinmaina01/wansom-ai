import React, { useState, useEffect } from 'react';
import { 
  Newspaper, 
  FileText, 
  ShieldCheck, 
  Gavel, 
  Lightbulb, 
  Briefcase, 
  Users, 
  Home, 
  Calculator,
  Plus,
  ChevronRight,
  Search,
  Info,
  ArrowLeft,
  Zap,
  Check,
  Sparkles,
  Bot,
  Scale
} from 'lucide-react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'motion/react';
import { LegalSpecialist } from '../types';

const PREMADE_SPECIALISTS: LegalSpecialist[] = [
  {
    id: 'briefly',
    name: 'Briefly Agent',
    description: 'Automatically delivers summarized legal news, case law updates, and regulatory changes from East African jurisdictions.',
    icon: 'Newspaper',
    practiceAreas: ['Legal News', 'Regulatory Updates', 'Case Law Digest', 'Legislative Tracking'],
    jurisdictions: ['Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Ethiopia'],
    instructions: 'You are a legal news aggregator. Summarize recent East African case law and regulatory changes concisely.',
    isPremade: true,
    category: 'Premade by Lawlify',
    color: 'emerald',
    links: [
      { label: 'Legal News', url: '/news' },
      { label: 'Regulatory Updates', url: '/regulatory' }
    ]
  },
  {
    id: 'contract-review',
    name: 'Contract Review Agent',
    description: 'Expert at reviewing, analyzing, and drafting commercial contracts under East African law.',
    icon: 'FileText',
    practiceAreas: ['Commercial Law', 'Contract Drafting', 'Procurement Law', 'Sale of Goods', 'Agency Agreements'],
    jurisdictions: ['Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Burundi'],
    instructions: 'You are a senior commercial lawyer. Review contracts for risks, compliance with East African law, and suggest improvements.',
    isPremade: true,
    category: 'Premade by Lawlify',
    color: 'blue'
  },
  {
    id: 'compliance-advisor',
    name: 'Compliance Agent',
    description: 'Helps navigate regulatory requirements and compliance obligations across East African markets (CBK, CMA, BOT, BOU).',
    icon: 'ShieldCheck',
    practiceAreas: ['Regulatory Compliance', 'Corporate Governance', 'AML/KYC', 'Data Protection', 'Banking Regulations'],
    jurisdictions: ['Kenya', 'Uganda', 'Tanzania', 'Ethiopia', 'Rwanda'],
    instructions: 'You are a compliance officer. Advise on regulatory frameworks across East Africa and ensure business operations align with statutes.',
    isPremade: true,
    category: 'Premade by Lawlify',
    color: 'indigo'
  },
  {
    id: 'litigation-research',
    name: 'Litigation Agent',
    description: 'Conducts legal research, analyzes case law from East African courts, and prepares litigation materials.',
    icon: 'Gavel',
    practiceAreas: ['Civil Litigation', 'Criminal Law', 'Constitutional Law', 'Judicial Review', 'Alternative Dispute Resolution'],
    jurisdictions: ['Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Ethiopia', 'South Sudan'],
    instructions: 'You are a legal researcher. Find relevant precedents in East African courts and draft research memos.',
    isPremade: true,
    category: 'Premade by Lawlify',
    color: 'rose'
  },
  {
    id: 'ip-specialist',
    name: 'IP & Trademarks Agent',
    description: 'Assists with IP protection, trademark registrations (KIPI, ARIPO, OAPI), and licensing matters across East Africa.',
    icon: 'Lightbulb',
    practiceAreas: ['Intellectual Property', 'Trademarks', 'Copyright', 'Patents', 'Trade Secrets'],
    jurisdictions: ['Kenya', 'Uganda', 'Tanzania', 'Ethiopia', 'Rwanda'],
    instructions: 'You are an IP specialist. Advise on KIPI/ARIPO registrations, copyright protection, and IP enforcement.',
    isPremade: true,
    category: 'Premade by Lawlify',
    color: 'amber'
  },
  {
    id: 'ma-advisor',
    name: 'M&A Agent',
    description: 'Assists with mergers, acquisitions, and due diligence processes across the East African Community.',
    icon: 'Briefcase',
    practiceAreas: ['Mergers & Acquisitions', 'Corporate Law', 'Due Diligence', 'Joint Ventures', 'Private Equity'],
    jurisdictions: ['Kenya', 'Uganda', 'Tanzania', 'Ethiopia', 'Rwanda', 'Burundi'],
    instructions: 'You are an M&A lawyer. Conduct due diligence, identify liabilities, and advise on transaction structures.',
    isPremade: true,
    category: 'Premade by Lawlify',
    color: 'violet'
  },
  {
    id: 'employment-advisor',
    name: 'Employment Agent',
    description: 'Provides guidance on employment law, labor relations, and workplace compliance across East Africa.',
    icon: 'Users',
    practiceAreas: ['Employment Law', 'HR Policy', 'Labor Relations', 'Work Permits', 'Social Security'],
    jurisdictions: ['Kenya', 'Uganda', 'Tanzania', 'Ethiopia', 'Rwanda'],
    instructions: 'You are an employment law expert. Advise on the Employment Act, termination procedures, and labor relations across EAC.',
    isPremade: true,
    category: 'Premade by Lawlify',
    color: 'cyan'
  },
  {
    id: 'conveyancing-specialist',
    name: 'Conveyancing Agent',
    description: 'Expert in land transactions, titles, and property law across East African land registration systems.',
    icon: 'Home',
    practiceAreas: ['Conveyancing', 'Property Law', 'Land Registration', 'Lease Agreements', 'Environmental Compliance'],
    jurisdictions: ['Kenya', 'Uganda', 'Tanzania', 'Ethiopia', 'Rwanda'],
    instructions: 'You are a conveyancing lawyer. Advise on land transfers, searches, and property disputes across East Africa.',
    isPremade: true,
    category: 'Premade by Lawlify',
    color: 'orange'
  },
  {
    id: 'tax-advisor',
    name: 'Tax & KRA Agent',
    description: 'Specialized in East African tax statutes, revenue authority procedures, and cross-border tax planning.',
    icon: 'Calculator',
    practiceAreas: ['Tax Law', 'KRA Compliance', 'VAT & Excise', 'Transfer Pricing', 'Customs & Trade'],
    jurisdictions: ['Kenya', 'Uganda', 'Tanzania', 'Ethiopia', 'Rwanda', 'Burundi'],
    instructions: 'You are a tax consultant. Advise on Income Tax, VAT, and revenue authority compliance across East Africa.',
    isPremade: true,
    category: 'Premade by Lawlify',
    color: 'red'
  }
];

const PRACTICE_AREAS = [
  'Real Estate', 'Banking & Finance', 'Contracts & Commercial', 'Securities',
  'Antitrust & Competition', 'Bankruptcy & Restructuring', 'Environmental Law',
  'Healthcare & Life Sciences', 'Immigration', 'Privacy & Data Protection',
  'Intellectual Property', 'Employment Law', 'Tax Law', 'Litigation',
  'Corporate Governance', 'Mergers & Acquisitions', 'Public Procurement',
  'Insurance Law', 'Maritime & Shipping', 'Mining & Natural Resources',
  'Telecommunications', 'Energy & Utilities', 'Family Law',
  'Alternative Dispute Resolution', 'Constitutional Law', 'Criminal Law',
  'Conveyancing & Property', 'International Trade'
];

const JURISDICTION_FLAGS: Record<string, string> = {
  'Kenya': 'ke',
  'Uganda': 'ug',
  'Tanzania': 'tz',
  'Rwanda': 'rw',
  'Burundi': 'bi',
  'Ethiopia': 'et',
  'South Sudan': 'ss',
  'Somalia': 'so',
  'Eritrea': 'er',
  'Djibouti': 'dj',
  'DR Congo': 'cd',
  'EAC (Regional)': '',
};

const EAST_AFRICAN_JURISDICTIONS = [
  { name: 'Kenya', code: 'ke' },
  { name: 'Uganda', code: 'ug' },
  { name: 'Tanzania', code: 'tz' },
  { name: 'Rwanda', code: 'rw' },
  { name: 'Burundi', code: 'bi' },
  { name: 'Ethiopia', code: 'et' },
  { name: 'South Sudan', code: 'ss' },
  { name: 'Somalia', code: 'so' },
  { name: 'Eritrea', code: 'er' },
  { name: 'Djibouti', code: 'dj' },
  { name: 'DR Congo', code: 'cd' },
  { name: 'EAC (Regional)', code: '' },
];

interface LegalSpecialistsProps {
  onSelectSpecialist: (specialist: LegalSpecialist) => void;
  subView?: string;
}

const LegalSpecialists: React.FC<LegalSpecialistsProps> = ({ onSelectSpecialist, subView = 'Premade Associates' }) => {
  const [view, setView] = useState<'LIST' | 'CONFIGURE'>('LIST');
  const [selectedSpecialist, setSelectedSpecialist] = useState<LegalSpecialist | null>(null);
  const [myAssociates, setMyAssociates] = useState<LegalSpecialist[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [bannerSlide, setBannerSlide] = useState(0);

  const BANNER_SLIDES = [
    {
      icon: Sparkles,
      title: 'What are AI Agents?',
      description: 'AI Agents are specialized assistants that help with specific legal tasks. Try a premade agent to start, or create your own to scale your legal team.',
      gradient: 'bg-blue-600',
      glow: 'bg-blue-400',
    },
    {
      icon: Bot,
      title: 'Build Your Own Agent',
      description: 'Create custom agents tailored to your practice. Define instructions, select practice areas, and deploy instantly across your team.',
      gradient: 'bg-purple-600',
      glow: 'bg-purple-400',
    },
    {
      icon: Scale,
      title: 'Scale Your Legal Team',
      description: 'Automate complex workflows, reduce research time by 80%, and handle more cases with AI-powered agents working alongside your team.',
      gradient: 'bg-emerald-600',
      glow: 'bg-emerald-400',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleCreateNew = () => {
    setSelectedSpecialist({
      id: Date.now().toString(),
      name: '',
      description: '',
      icon: 'Briefcase',
      practiceAreas: [],
      instructions: '',
      isPremade: false,
      color: 'blue'
    });
    setView('CONFIGURE');
  };

  const handleConfigure = (specialist: LegalSpecialist) => {
    setSelectedSpecialist(specialist);
    setView('CONFIGURE');
  };

  const handleSave = () => {
    if (selectedSpecialist) {
      const newAssociate = { ...selectedSpecialist, id: Date.now().toString() };
      setMyAssociates(prev => [...prev, newAssociate]);
      onSelectSpecialist(newAssociate);
    }
  };

  const getIcon = (iconName: string, className: string = "w-6 h-6") => {
    switch (iconName) {
      case 'Newspaper': return <Newspaper className={className} />;
      case 'FileText': return <FileText className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'Gavel': return <Gavel className={className} />;
      case 'Lightbulb': return <Lightbulb className={className} />;
      case 'Briefcase': return <Briefcase className={className} />;
      case 'Users': return <Users className={className} />;
      case 'Home': return <Home className={className} />;
      case 'Calculator': return <Calculator className={className} />;
      default: return <Briefcase className={className} />;
    }
  };

  const getColorClasses = (colorName: string = 'blue') => {
    const maps: Record<string, { bg: string, text: string, border: string, lightBg: string, glass: string }> = {
      emerald: { bg: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500/20', lightBg: 'bg-emerald-50', glass: 'bg-emerald-500/5' },
      blue: { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500/20', lightBg: 'bg-blue-50', glass: 'bg-blue-500/5' },
      indigo: { bg: 'bg-indigo-500', text: 'text-indigo-500', border: 'border-indigo-500/20', lightBg: 'bg-indigo-50', glass: 'bg-indigo-500/5' },
      rose: { bg: 'bg-rose-500', text: 'text-rose-500', border: 'border-rose-500/20', lightBg: 'bg-rose-50', glass: 'bg-rose-500/5' },
      amber: { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500/20', lightBg: 'bg-amber-50', glass: 'bg-amber-500/5' },
      violet: { bg: 'bg-violet-500', text: 'text-violet-500', border: 'border-violet-500/20', lightBg: 'bg-violet-50', glass: 'bg-violet-500/5' },
      cyan: { bg: 'bg-cyan-500', text: 'text-cyan-500', border: 'border-cyan-500/20', lightBg: 'bg-cyan-50', glass: 'bg-cyan-500/5' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500/20', lightBg: 'bg-orange-50', glass: 'bg-orange-500/5' },
      red: { bg: 'bg-red-500', text: 'text-red-500', border: 'border-red-500/20', lightBg: 'bg-red-50', glass: 'bg-red-500/5' },
    };
    return maps[colorName] || maps.blue;
  };

  const filteredPremade = PREMADE_SPECIALISTS.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMyAssociates = myAssociates.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (view === 'CONFIGURE' && selectedSpecialist) {
    return (
      <div className="flex-1 overflow-y-auto bg-white bg-dots p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <button 
            onClick={() => setView('LIST')}
            className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Specialists</span>
          </button>

          <div className="bg-white/70 backdrop-blur-xl border border-gray-100 rounded-[2.5rem] shadow-2xl shadow-black/5 overflow-hidden">
            <div className="p-12">
              <div className="flex items-center gap-4 mb-10">
                <div className={`w-20 h-20 ${getColorClasses(selectedSpecialist.color).lightBg} rounded-2xl flex items-center justify-center ${getColorClasses(selectedSpecialist.color).text}`}>
                  {getIcon(selectedSpecialist.icon, "w-10 h-10")}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-4xl font-bold text-black tracking-tighter">
                      {selectedSpecialist.isPremade ? selectedSpecialist.name : (selectedSpecialist.name || 'New AI Associate')}
                    </h1>
                    {selectedSpecialist.isPremade && (
                      <span className={`px-3 py-1 ${getColorClasses(selectedSpecialist.color).lightBg} ${getColorClasses(selectedSpecialist.color).text} text-[10px] font-bold rounded-full uppercase tracking-widest`}>Premade Template</span>
                    )}
                  </div>
                  <p className="text-gray-400 text-base font-medium">Configure your specialized legal assistant</p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Associate Name</label>
                  <input 
                    type="text" 
                    value={selectedSpecialist.name}
                    onChange={(e) => setSelectedSpecialist({...selectedSpecialist, name: e.target.value})}
                    placeholder="e.g. Senior Conveyancing Partner"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Brief Description</label>
                  <input 
                    type="text" 
                    value={selectedSpecialist.description}
                    onChange={(e) => setSelectedSpecialist({...selectedSpecialist, description: e.target.value})}
                    placeholder="What does this associate specialize in?"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Practice Areas</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-4 bg-gray-50 rounded-2xl border border-gray-100 no-scrollbar">
                    {PRACTICE_AREAS.map(area => (
                      <label key={area} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          selectedSpecialist.practiceAreas.includes(area)
                            ? 'bg-primary border-primary text-white'
                            : 'bg-white border-gray-200 group-hover:border-primary/50'
                        }`}>
                          {selectedSpecialist.practiceAreas.includes(area) && <Check className="w-3 h-3" />}
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden"
                          checked={selectedSpecialist.practiceAreas.includes(area)}
                          onChange={() => {
                            const newAreas = selectedSpecialist.practiceAreas.includes(area)
                              ? selectedSpecialist.practiceAreas.filter(a => a !== area)
                              : [...selectedSpecialist.practiceAreas, area];
                            setSelectedSpecialist({...selectedSpecialist, practiceAreas: newAreas});
                          }}
                        />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-black transition-colors">{area}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-3 font-medium">{selectedSpecialist.practiceAreas.length} practice areas selected</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Jurisdictions</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    {EAST_AFRICAN_JURISDICTIONS.map(jurisdiction => (
                      <label key={jurisdiction.name} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          (selectedSpecialist.jurisdictions || []).includes(jurisdiction.name)
                            ? 'bg-red-500 border-red-500 text-white'
                            : 'bg-white border-gray-200 group-hover:border-red-300'
                        }`}>
                          {(selectedSpecialist.jurisdictions || []).includes(jurisdiction.name) && <Check className="w-3 h-3" />}
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden"
                          checked={(selectedSpecialist.jurisdictions || []).includes(jurisdiction.name)}
                          onChange={() => {
                            const currentJurisdictions = selectedSpecialist.jurisdictions || [];
                            const newJurisdictions = currentJurisdictions.includes(jurisdiction.name)
                              ? currentJurisdictions.filter(j => j !== jurisdiction.name)
                              : [...currentJurisdictions, jurisdiction.name];
                            setSelectedSpecialist({...selectedSpecialist, jurisdictions: newJurisdictions});
                          }}
                        />
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-600 group-hover:text-black transition-colors">
                          {jurisdiction.code ? (
                            <img src={`https://flagcdn.com/w40/${jurisdiction.code}.png`} alt={jurisdiction.name} className="w-6 h-4 object-cover rounded-sm shadow-sm" />
                          ) : (
                            <span className="w-6 h-4 bg-gray-200 rounded-sm flex items-center justify-center text-[8px] font-bold text-gray-500">EAC</span>
                          )}
                          {jurisdiction.name}
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-3 font-medium">{(selectedSpecialist.jurisdictions || []).length} jurisdictions selected</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Instructions & Expertise</label>
                  <textarea 
                    rows={6}
                    value={selectedSpecialist.instructions}
                    onChange={(e) => setSelectedSpecialist({...selectedSpecialist, instructions: e.target.value})}
                    placeholder="Define the persona, expertise, and specific tasks this associate should handle..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50/50 border-t border-gray-100 px-10 py-6 flex items-center justify-end gap-4">
              <button 
                onClick={() => setView('LIST')}
                className="px-8 py-3 text-xs font-bold text-gray-500 hover:text-black transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-8 py-3 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-900 transition-all flex items-center gap-2 shadow-xl shadow-black/10"
              >
                <Zap className="w-4 h-4 text-primary" />
                Use Agent in Chat
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white bg-dots p-8">
      <div className="max-w-7xl mx-auto">
        {/* Search & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter mb-2"><span className="text-red-500">Legal Specialists</span> <span className="text-black">Agent</span></h1>
            <p className="text-gray-400 text-sm font-medium">Deploy specialized AI Agents for your practice</p>
          </div>
          <div className="relative group w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search specialists, practice areas..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Banner Carousel */}
        {subView === 'Premade Associates' && !searchQuery && (
          <div className="relative rounded-2xl overflow-hidden mb-12 h-40">
            <AnimatePresence mode="wait">
              <motion.div
                key={bannerSlide}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className={`absolute inset-0 ${BANNER_SLIDES[bannerSlide].gradient} rounded-2xl p-8 flex items-center gap-6`}
              >
                {/* Content */}
                <div className="relative z-10 flex items-center gap-6">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white shrink-0">
                    {React.createElement(BANNER_SLIDES[bannerSlide].icon, { className: 'w-7 h-7' })}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1 tracking-tight">{BANNER_SLIDES[bannerSlide].title}</h2>
                    <p className="text-white/70 text-sm font-medium leading-relaxed max-w-2xl">
                      {BANNER_SLIDES[bannerSlide].description}
                    </p>
                  </div>
                </div>

                {/* Dot indicators */}
                <div className="absolute bottom-3 right-4 flex gap-1.5 z-10">
                  {BANNER_SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setBannerSlide(i); }}
                      className={`w-2 h-2 rounded-full transition-all ${i === bannerSlide ? 'bg-white w-5' : 'bg-white/40'}`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Premade Section */}
        {(subView === 'Premade Associates' || searchQuery) && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h3 className="text-2xl font-bold text-black tracking-tighter">Premade by Lawlify</h3>
                <span className="px-3 py-1 bg-gray-100 text-gray-400 text-[10px] font-bold rounded-full uppercase tracking-widest">{filteredPremade.length} Specialists</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-16">
              {filteredPremade.map((specialist, idx) => {
                const colors = getColorClasses(specialist.color);
                return (
                  <motion.div
                    key={specialist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleConfigure(specialist)}
                    className={`group relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm p-6 transition-all hover:shadow-lg hover:border-gray-300 cursor-pointer`}
                  >
                    <div className="flex items-start gap-4 mb-3">
                      <div className={`w-12 h-12 flex items-center justify-center ${colors.text} shrink-0`}>
                        {getIcon(specialist.icon, 'w-7 h-7')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-bold text-black mb-1 tracking-tight">{specialist.name}</h4>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-2">{specialist.description}</p>
                      </div>
                    </div>
                    
                    {/* Practice Areas */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {specialist.practiceAreas.map(area => (
                        <span 
                          key={area} 
                          className={`px-2.5 py-1 ${colors.bg} text-white text-[10px] font-bold rounded-md uppercase tracking-wider`}
                        >
                          {area}
                        </span>
                      ))}
                    </div>

                    {/* Jurisdictions */}
                    {specialist.jurisdictions && specialist.jurisdictions.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mr-1">Jurisdictions:</span>
                        {specialist.jurisdictions.map(j => {
                          const code = JURISDICTION_FLAGS[j] || '';
                          return (
                            <span key={j} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-semibold rounded-md inline-flex items-center gap-1.5">
                              {code && <img src={`https://flagcdn.com/w20/${code}.png`} alt={j} className="w-4 h-3 object-cover rounded-[2px]" />}
                              {j}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    <div className={`absolute bottom-4 right-4 p-1.5 rounded-full ${colors.lightBg} ${colors.text} opacity-40 group-hover:opacity-100 transition-all`}>
                      <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                    </div>

                    {/* Decorative element */}
                    <div className={`absolute -bottom-4 -right-4 w-32 h-32 ${colors.bg} opacity-[0.04] rounded-full blur-2xl group-hover:opacity-[0.08] transition-all`}></div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}

        {/* My Associates Section */}
        {(subView === 'My Associates' || searchQuery) && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h3 className="text-2xl font-bold text-black tracking-tighter">My Associates</h3>
                <span className="px-3 py-1 bg-gray-100 text-gray-400 text-[10px] font-bold rounded-full uppercase tracking-widest">{filteredMyAssociates.length}</span>
              </div>
              <button 
                onClick={handleCreateNew}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                New AI Associate
              </button>
            </div>

            <div className="bg-white/70 backdrop-blur-md border border-gray-100 rounded-[2.5rem] p-12 min-h-[300px] flex flex-col items-center justify-center text-center shadow-xl shadow-black/5">
              {filteredMyAssociates.length === 0 ? (
                <div className="max-w-sm">
                  <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300 mx-auto mb-8 shadow-sm">
                    <Gavel className="w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-bold text-black mb-3 tracking-tight">No associates yet</h4>
                  <p className="text-gray-400 text-sm font-medium mb-8">
                    Create your first AI associate to scale your legal team and automate workflows.
                  </p>
                  <button 
                    onClick={handleCreateNew}
                    className="px-8 py-3 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-900 transition-all flex items-center gap-2 mx-auto shadow-xl shadow-black/10"
                  >
                    <Plus className="w-4 h-4 text-primary" />
                    Create Associate
                  </button>
                </div>
              ) : (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  {filteredMyAssociates.map(associate => {
                    const colors = getColorClasses(associate.color);
                    return (
                      <div key={associate.id} className={`p-6 bg-white border border-gray-100 rounded-3xl flex items-center gap-6 hover:shadow-xl transition-all group cursor-pointer`}>
                        <div className={`w-14 h-14 ${colors.lightBg} rounded-2xl flex items-center justify-center ${colors.text} group-hover:scale-110 transition-transform`}>
                          {getIcon(associate.icon)}
                        </div>
                        <div className="flex-1">
                          <h5 className="text-lg font-bold text-black tracking-tight">{associate.name}</h5>
                          <p className="text-gray-400 text-xs font-medium line-clamp-1">{associate.description}</p>
                        </div>
                        <button className="p-3 text-gray-300 hover:text-primary transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* Practice Areas Placeholder */}
        {subView === 'Practice Areas' && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-8">
              <Briefcase className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-black mb-4 tracking-tighter">Practice Areas</h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto font-medium">
              Browse specialists by practice area. This feature is being optimized for the Kenyan legal market.
            </p>
          </div>
        )}

        {/* Templates Placeholder */}
        {subView === 'Templates' && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-8">
              <FileText className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-black mb-4 tracking-tighter">Associate Templates</h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto font-medium">
              Start with a pre-configured template for common legal roles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalSpecialists;
