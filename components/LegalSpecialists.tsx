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
  ArrowRight,
  Zap,
  Check,
  Sparkles,
  Bot,
  Scale,
  HelpCircle
} from 'lucide-react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'motion/react';
import { LegalSpecialist } from '../types';
// import { auth } from '../lib/firebase';
import { apiClient } from '../lib/apiClient';

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
    ],
    suggestions: [
      {
        label: "Recent Judgments",
        description: "Supreme Court & High Court",
        icon: "ScaleIcon",
        prompt: "Show me the most recent landmark judgments from the Supreme Court of Kenya.",
        color: "red"
      },
      {
        label: "Regulatory Alert",
        description: "CBK & CMA Updates",
        icon: "ShieldCheckIcon",
        prompt: "Are there any new regulatory directives from the Central Bank of Kenya this week?",
        color: "blue"
      },
      {
        label: "Legal News Digest",
        description: "East African Region",
        icon: "Newspaper",
        prompt: "Give me a summary of the top legal news stories in East Africa today.",
        color: "grey"
      },
      {
        label: "Gazette Notice Search",
        description: "Latest Kenya Gazette",
        icon: "DocumentTextIcon",
        prompt: "Summarize the key appointments and legislative changes in the latest Kenya Gazette.",
        color: "green"
      }
    ]
  },
  {
    id: 'doc-prep',
    name: 'Legal Documents Prep Agent',
    description: 'Expert in drafting and preparing Kenyan court documents, commercial contracts, and official legal filings.',
    icon: 'FileText',
    practiceAreas: ['Litigation', 'Commercial Law', 'Conveyancing', 'Succession Law', 'Family Law'],
    jurisdictions: ['Kenya'],
    instructions: 'You are a legal drafting specialist. Prepare precise, format-specific documents following Kenyan Civil Procedure Rules and best practices.',
    isPremade: true,
    category: 'Premade by Lawlify',
    color: 'blue',
    suggestions: [
      {
        label: "Litigation Docs",
        description: "Plaint, Defence, Affidavits",
        icon: "Gavel",
        prompt: "I need to draft a Plaint for a civil suit involving a breach of contract.",
        color: "red"
      },
      {
        label: "Commercial Contracts",
        description: "Sales, Leases, NDAs",
        icon: "BriefcaseIcon",
        prompt: "Draft a comprehensive Non-Disclosure Agreement for a software development project.",
        color: "blue"
      },
      {
        label: "Estate & Succession",
        description: "Wills, Trust Deeds",
        icon: "Users",
        prompt: "Help me draft a Last Will and Testament for a client with multiple real estate holdings.",
        color: "green"
      },
      {
        label: "Conveyancing",
        description: "Transfer Deeds, Charges",
        icon: "Home",
        prompt: "Prepare a Sale Agreement for a parcel of land in Nairobi.",
        color: "grey"
      }
    ],
    supportedDocuments: [
      "Litigation: Plaints, Statements of Defence, Grounds of Opposition",
      "Affidavits: Verifying, Supporting, and Affidavits of Service",
      "Commercial: NDAs, Service Agreements, Sales contracts",
      "Conveyancing: Sale Agreements, Transfer Deeds, Lease Renewals",
      "Succession: Last Will & Testament, Trust Deeds, Petitions",
      "Miscellaneous: Legal Opinions, Deed Polls, Power of Attorney"
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
    color: 'blue',
    suggestions: [
      {
        label: "Review Lease",
        description: "Commercial Realty",
        icon: "DocumentTextIcon",
        prompt: "Review this commercial lease agreement and highlight any unfavorable clauses for the tenant.",
        color: "blue"
      },
      {
        label: "Risk Audit",
        description: "Identify Liability",
        icon: "ShieldCheckIcon",
        prompt: "Audit this service contract for potential liability risks and indemnification gaps.",
        color: "red"
      },
      {
        label: "Vendor Compliance",
        description: "Check Master App",
        icon: "BriefcaseIcon",
        prompt: "Does this vendor agreement comply with the standard procurement guidelines for East African government contracts?",
        color: "grey"
      },
      {
        label: "Termination",
        description: "Exit Strategies",
        icon: "XCircle",
        prompt: "Review the termination for convenience clause in this contract and suggest more balanced wording.",
        color: "black"
      }
    ]
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
    color: 'indigo',
    suggestions: [
      {
        label: "KYC/AML Rules",
        description: "CBK Compliance",
        icon: "ShieldCheckIcon",
        prompt: "What are the latest KYC and AML reporting requirements for fintech startups in Kenya?",
        color: "blue"
      },
      {
        label: "Data Protection",
        description: "ODPC Audit",
        icon: "UserGroupIcon",
        prompt: "Help me create a data protection compliance checklist according to the Kenyan Data Protection Act 2019.",
        color: "green"
      },
      {
        label: "Banking License",
        description: "Digital Banks",
        icon: "Calculator",
        prompt: "What are the regulatory hurdles for setting up a digital-only bank in the East African region?",
        color: "grey"
      },
      {
        label: "CMA Guidelines",
        description: "Public Listings",
        icon: "ScaleIcon",
        prompt: "Summarize the Capital Markets Authority (CMA) requirements for listing on the Growth Enterprise Market Segment (GEMS).",
        color: "red"
      }
    ]
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
    color: 'rose',
    suggestions: [
      {
        label: "Civil Precedents",
        description: "Tort & Contract",
        icon: "Gavel",
        prompt: "Find recent High Court of Kenya rulings regarding vicarious liability in corporate transport accidents.",
        color: "red"
      },
      {
        label: "Criminal Appeals",
        description: "Sentencing Rules",
        icon: "DocumentTextIcon",
        prompt: "Analyze the current trends in sentencing for economic crimes in Tanzania and Uganda.",
        color: "blue"
      },
      {
        label: "Charter Rights",
        description: "Bill of Rights",
        icon: "ScaleIcon",
        prompt: "Draft a research memo on the right to a fair trial as interpreted by the Supreme Court of Kenya.",
        color: "green"
      },
      {
        label: "ADR Options",
        description: "Arbitration Act",
        icon: "ChatBubbleLeftRightIcon",
        prompt: "What are the advantages of choosing Nairobi Centre for International Arbitration (NCIA) over standard court proceedings?",
        color: "grey"
      }
    ]
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
    color: 'amber',
    suggestions: [
      {
        label: "Trademark Search",
        description: "KIPI Check",
        icon: "Search",
        prompt: "Outline the procedure for conducting a formal trademark search at the Kenya Industrial Property Institute (KIPI).",
        color: "blue"
      },
      {
        label: "IP Infringement",
        description: "Cease & Desist",
        icon: "ShieldExclamationIcon",
        prompt: "Draft a cease and desist letter for a client whose copyright is being infringed upon on social media platforms.",
        color: "red"
      },
      {
        label: "ARIPO Filing",
        description: "Regional IP",
        icon: "GlobeAltIcon",
        prompt: "Explain the benefits of filing an IP application through the African Regional Intellectual Property Organization (ARIPO).",
        color: "grey"
      },
      {
        label: "Software License",
        description: "IP Protection",
        icon: "CodeBracketIcon",
        prompt: "Draft a software licensing agreement that protects the intellectual property of a SaaS company.",
        color: "green"
      }
    ]
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
    color: 'violet',
    suggestions: [
      {
        label: "Due Diligence",
        description: "M&A Checklist",
        icon: "CheckCircleIcon",
        prompt: "Create a legal due diligence checklist for an acquisition of a private limited company in Kenya.",
        color: "blue"
      },
      {
        label: "Share Purchase",
        description: "Drafting SPA",
        icon: "DocumentDuplicateIcon",
        prompt: "Draft key clauses for a Share Purchase Agreement, including warranties and indemnities.",
        color: "green"
      },
      {
        label: "Competition Law",
        description: "COMESA/CAK",
        icon: "BriefcaseIcon",
        prompt: "When does a merger require notification to the Competition Authority of Kenya (CAK) versus COMESA?",
        color: "red"
      },
      {
        label: "Joint Ventures",
        description: "Shareholder Agmt",
        icon: "Users",
        prompt: "Draft a Shareholders Agreement for a joint venture between a local investor and a foreign entity.",
        color: "grey"
      }
    ]
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
    color: 'cyan',
    suggestions: [
      {
        label: "HR Policy",
        description: "Employee Manual",
        icon: "UserGroupIcon",
        prompt: "Outline the essential sections for a modern employee handbook compliant with the Kenya Employment Act.",
        color: "blue"
      },
      {
        label: "Fair Termination",
        description: "Disciplinary Flow",
        icon: "Gavel",
        prompt: "Explain the step-by-step procedure for a summary dismissal to ensure it is legally defensible.",
        color: "red"
      },
      {
        label: "Labor Relations",
        description: "Union CBA",
        icon: "ChatBubbleLeftRightIcon",
        prompt: "What is the process for negotiating a Collective Bargaining Agreement (CBA) with a registered trade union?",
        color: "grey"
      },
      {
        label: "Work Permits",
        description: "Foreign Experts",
        icon: "PassportIcon",
        prompt: "What are the requirements for Class D work permits for expatriates working in the East African Community?",
        color: "green"
      }
    ]
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
    color: 'orange',
    suggestions: [
      {
        label: "Title Search",
        description: "ArdhiSasa Check",
        icon: "Search",
        prompt: "Provide a guide on how to conduct an official land search through the ArdhiSasa platform.",
        color: "blue"
      },
      {
        label: "Stamp Duty",
        description: "KRA Valuation",
        icon: "Calculator",
        prompt: "How is stamp duty calculated for land transfers in urban versus rural areas in Kenya?",
        color: "red"
      },
      {
        label: "Sectional Acts",
        description: "Apartment Titles",
        icon: "Home",
        prompt: "Explain the conversion process of long-term leases to sectional titles under the Sectional Properties Act 2020.",
        color: "green"
      },
      {
        label: "Lease Renewals",
        description: "Public Land",
        icon: "ClockIcon",
        prompt: "What is the procedure for renewing a lease for public land that is nearing its expiry date?",
        color: "grey"
      }
    ]
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
    color: 'red',
    suggestions: [
      {
        label: "VAT Compliance",
        description: "TIMS/eTIMS",
        icon: "BoltIcon",
        prompt: "Explain the transition from TIMS to eTIMS for VAT-registered taxpayers in Kenya.",
        color: "blue"
      },
      {
        label: "Corporate Tax",
        description: "Annual Returns",
        icon: "DocumentTextIcon",
        prompt: "What are the key deadlines and requirements for filing corporate income tax returns in Kenya?",
        color: "red"
      },
      {
        label: "Customs Duties",
        description: "EAC Common Tariff",
        icon: "BriefcaseIcon",
        prompt: "How does the East African Community Common External Tariff (CET) affect importing electronics into Kenya?",
        color: "grey"
      },
      {
        label: "KRA Audit Prep",
        description: "Tax Disputes",
        icon: "ShieldCheckIcon",
        prompt: "What documents should a company prepare in anticipation of a KRA comprehensive tax audit?",
        color: "green"
      }
    ]
  },
  {
    id: 'case-manager',
    name: 'Case Management Agent',
    description: 'Autonomous case lifecycle management, legal project tracking, and invoicing with Paystack integration.',
    icon: 'Briefcase',
    practiceAreas: ['Case Management', 'Legal Project Management', 'Invoicing', 'Litigation Support'],
    jurisdictions: ['Kenya', 'Nigeria', 'Uganda', 'Tanzania', 'EAC (Regional)'],
    instructions: 'You are a specialized case management agent. Help the user track case lifecycles, manage tasks, and generate invoices.',
    isPremade: true,
    category: 'Premade by Lawlify',
    color: 'red',
    suggestions: [
      {
        label: "Create Case",
        description: "New Lifecycle",
        icon: "Plus",
        prompt: "I need to open a new case for a breach of contract matter.",
        color: "red"
      },
      {
        label: "Generate Invoice",
        description: "Paystack Ready",
        icon: "DollarSign",
        prompt: "Generate an interim invoice for the Zenith Bank matter.",
        color: "blue"
      },
      {
        label: "Case Summary",
        description: "Task Audit",
        icon: "FileText",
        prompt: "Give me a summary of all pending tasks for the Okeke vs Zenith case.",
        color: "green"
      }
    ]
  },
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
  const [isGeneratingPersona, setIsGeneratingPersona] = useState(false);

  const handleAISuggest = async () => {
    const promptText = prompt("Describe the legal specialist you need (e.g. 'Maritime law expert in Kenya' or 'Tax dispute resolution'):");
    if (!promptText) return;

    setIsGeneratingPersona(true);
    try {
      const res = await apiClient.post('/api/specialists/suggest', { prompt: promptText });
      if (!res.ok) throw new Error("Failed to generate persona");
      const data = await res.json();

      setSelectedSpecialist({
        id: Date.now().toString(),
        name: data.name || 'AI Generated Associate',
        description: data.description || '',
        icon: data.icon || 'Briefcase',
        practiceAreas: data.practiceAreas || [],
        jurisdictions: data.jurisdictions || [],
        instructions: data.instructions || '',
        isPremade: false,
        color: data.color || 'purple'
      });
      setView('CONFIGURE');
    } catch (err) {
      console.error("AI Generation error:", err);
      alert("Failed to generate persona. Ensure backend proxy is running.");
    } finally {
      setIsGeneratingPersona(false);
    }
  };

  const BANNER_SLIDES = [
    {
      icon: Sparkles,
      title: 'What are AI Agents?',
      description: 'AI Agents are specialized assistants that help with specific legal tasks. Try a premade agent to start, or create your own to scale your legal team.',
      gradient: 'bg-blue-50 border border-blue-100',
      glow: 'bg-blue-200/20',
    },
    {
      icon: Bot,
      title: 'Build Your Own Agent',
      description: 'Create custom agents tailored to your practice. Define instructions, select practice areas, and deploy instantly across your team.',
      gradient: 'bg-purple-50 border border-purple-100',
      glow: 'bg-purple-200/20',
    },
    {
      icon: Scale,
      title: 'Scale Your Legal Team',
      description: 'Automate complex workflows, reduce research time by 80%, and handle more cases with AI-powered agents working alongside your team.',
      gradient: 'bg-emerald-50 border border-emerald-100',
      glow: 'bg-emerald-200/20',
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
    if (specialist.id === 'case-manager') {
      onSelectSpecialist(specialist);
      return;
    }
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
    const maps: Record<string, { bg: string, text: string, border: string, lightBg: string, glass: string, hover: string, iconHover: string }> = {
      emerald: { bg: 'bg-emerald-600', text: 'text-emerald-500', iconHover: 'group-hover:text-emerald-600', border: 'border-emerald-100', lightBg: 'bg-emerald-50', glass: 'bg-emerald-50', hover: 'hover:bg-emerald-50 hover:border-emerald-200' },
      blue: { bg: 'bg-blue-600', text: 'text-blue-500', iconHover: 'group-hover:text-blue-600', border: 'border-blue-100', lightBg: 'bg-blue-50', glass: 'bg-blue-50', hover: 'hover:bg-blue-50 hover:border-blue-200' },
      indigo: { bg: 'bg-indigo-600', text: 'text-indigo-500', iconHover: 'group-hover:text-indigo-600', border: 'border-indigo-100', lightBg: 'bg-indigo-50', glass: 'bg-indigo-50', hover: 'hover:bg-indigo-50 hover:border-indigo-200' },
      rose: { bg: 'bg-rose-600', text: 'text-rose-500', iconHover: 'group-hover:text-rose-600', border: 'border-rose-100', lightBg: 'bg-rose-50', glass: 'bg-rose-50', hover: 'hover:bg-rose-50 hover:border-rose-200' },
      amber: { bg: 'bg-amber-600', text: 'text-amber-500', iconHover: 'group-hover:text-amber-600', border: 'border-amber-100', lightBg: 'bg-amber-50', glass: 'bg-amber-50', hover: 'hover:bg-amber-50 hover:border-amber-200' },
      violet: { bg: 'bg-violet-600', text: 'text-violet-500', iconHover: 'group-hover:text-violet-600', border: 'border-violet-100', lightBg: 'bg-violet-50', glass: 'bg-violet-50', hover: 'hover:bg-violet-50 hover:border-violet-200' },
      cyan: { bg: 'bg-cyan-600', text: 'text-cyan-500', iconHover: 'group-hover:text-cyan-600', border: 'border-cyan-100', lightBg: 'bg-cyan-50', glass: 'bg-cyan-50', hover: 'hover:bg-cyan-50 hover:border-cyan-200' },
      orange: { bg: 'bg-orange-600', text: 'text-orange-500', iconHover: 'group-hover:text-orange-600', border: 'border-orange-100', lightBg: 'bg-orange-50', glass: 'bg-orange-50', hover: 'hover:bg-orange-50 hover:border-orange-200' },
      red: { bg: 'bg-red-600', text: 'text-red-500', iconHover: 'group-hover:text-red-600', border: 'border-red-100', lightBg: 'bg-red-50', glass: 'bg-red-50', hover: 'hover:bg-red-50 hover:border-red-200' },
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
            <span className="text-xs font-bold uppercase tracking-widest">Back to Specialists List</span>
          </button>

          <div className="flex justify-center pb-20">
            {/* Centered Column: Configuration Form */}
            <div className="w-full max-w-4xl space-y-12 pb-20">
              <div>
                <div className="flex items-center gap-8 mb-12">
                  <div className={`w-24 h-24 flex items-center justify-center ${getColorClasses(selectedSpecialist.color).text} group-hover:opacity-80 transition-all`}>
                    {getIcon(selectedSpecialist.icon, "w-16 h-16")}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                       <h1 className="text-5xl font-black text-black tracking-tighter">
                        {selectedSpecialist.isPremade ? selectedSpecialist.name : (selectedSpecialist.name || 'New AI Associate')}
                      </h1>
                      {selectedSpecialist.isPremade && (
                        <span className={`px-4 py-1.5 ${getColorClasses(selectedSpecialist.color).lightBg} ${getColorClasses(selectedSpecialist.color).text} text-[10px] font-black rounded-full uppercase tracking-widest border ${getColorClasses(selectedSpecialist.color).border} shadow-sm`}>Premade Template</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-xl font-medium">Configure your specialized legal assistant</p>
                  </div>
                </div>

                <div className="space-y-12">
                <div>
                  <label className="block text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-4">Associate Name</label>
                  <input
                    type="text"
                    value={selectedSpecialist.name}
                    onChange={(e) => setSelectedSpecialist({ ...selectedSpecialist, name: e.target.value })}
                    placeholder="e.g. Senior Conveyancing Partner"
                    className="w-full bg-gray-50 border border-gray-100 rounded-[15px] px-8 py-6 text-lg font-bold text-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-4">Brief Description</label>
                  <input
                    type="text"
                    value={selectedSpecialist.description}
                    onChange={(e) => setSelectedSpecialist({ ...selectedSpecialist, description: e.target.value })}
                    placeholder="What does this associate specialize in?"
                    className="w-full bg-gray-50 border border-gray-100 rounded-[15px] px-8 py-6 text-lg font-bold text-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm"
                  />
                </div>

                {selectedSpecialist.supportedDocuments && selectedSpecialist.supportedDocuments.length > 0 && (
                  <div>
                    <label className="block text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-4">Document Library & Scope</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { category: "Litigation", items: "Plaints, Statements of Defence, Grounds of Opposition" },
                        { category: "Affidavits", items: "Verifying, Supporting, and Affidavits of Service" },
                        { category: "Commercial", items: "NDAs, Service Agreements, Sales contracts" },
                        { category: "Conveyancing", items: "Sale Agreements, Transfer Deeds, Lease Renewals" },
                        { category: "Succession", items: "Last Will & Testament, Trust Deeds, Petitions" },
                        { category: "Miscellaneous", items: "Legal Opinions, Deed Polls, Power of Attorney" }
                      ].map((group, i) => (
                        <div key={i} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all group/item">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 group-hover/item:text-primary transition-colors">{group.category}</p>
                          <p className="text-sm font-bold text-gray-800 leading-relaxed">{group.items}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4 px-1">
                    <label className="block text-[11px] font-black text-primary uppercase tracking-[0.2em]">Practice Areas</label>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setSelectedSpecialist({ ...selectedSpecialist, practiceAreas: [...PRACTICE_AREAS] })}
                        className="text-[10px] font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-wider flex items-center gap-1.5 py-1 px-2 hover:bg-gray-100 rounded-md border border-transparent hover:border-gray-200"
                      >
                        Select All
                      </button>
                      <div className="w-px h-3 bg-gray-200" />
                      <button 
                        onClick={() => setSelectedSpecialist({ ...selectedSpecialist, practiceAreas: [] })}
                        className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-wider flex items-center gap-1.5 py-1 px-2 hover:bg-red-50 rounded-md border border-transparent hover:border-red-100"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-4 bg-gray-50 rounded-[15px] border border-gray-100 no-scrollbar">
                    {PRACTICE_AREAS.map(area => (
                      <label key={area} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${selectedSpecialist.practiceAreas.includes(area)
                            ? 'bg-primary border-primary text-white'
                            : 'bg-gray-100 border-gray-200 group-hover:border-primary/50'
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
                            setSelectedSpecialist({ ...selectedSpecialist, practiceAreas: newAreas });
                          }}
                        />
                        <span className="text-sm font-medium text-gray-500 group-hover:text-black transition-colors">{area}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-3 font-medium">{selectedSpecialist.practiceAreas.length} practice areas selected</p>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-4">Jurisdictions</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-[15px] border border-gray-100">
                    {EAST_AFRICAN_JURISDICTIONS.map(jurisdiction => (
                      <label key={jurisdiction.name} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${(selectedSpecialist.jurisdictions || []).includes(jurisdiction.name)
                            ? 'bg-red-500 border-red-500 text-white'
                            : 'bg-gray-100 border-gray-200 group-hover:border-red-300'
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
                            setSelectedSpecialist({ ...selectedSpecialist, jurisdictions: newJurisdictions });
                          }}
                        />
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-500 group-hover:text-black transition-colors">
                          {jurisdiction.code ? (
                            <img src={`https://flagcdn.com/w40/${jurisdiction.code}.png`} alt={jurisdiction.name} className="w-6 h-4 object-cover rounded-sm shadow-sm opacity-80 group-hover:opacity-100" />
                          ) : (
                            <span className="w-6 h-4 bg-gray-100 rounded-sm flex items-center justify-center text-[8px] font-bold text-gray-400">EAC</span>
                          )}
                          {jurisdiction.name}
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-3 font-medium">{(selectedSpecialist.jurisdictions || []).length} jurisdictions selected</p>
                </div>

                <div className="mt-8">
                  <label className="block text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-4">Instructions & Expertise</label>
                  <textarea
                    rows={8}
                    value={selectedSpecialist.instructions}
                    onChange={(e) => setSelectedSpecialist({ ...selectedSpecialist, instructions: e.target.value })}
                    placeholder="Define the persona, expertise, and specific tasks this associate should handle..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-[15px] px-8 py-6 text-base font-medium text-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm resize-none"
                  />
                </div>
              </div>

              <div className="pt-12 flex items-center justify-end gap-6 border-t border-gray-100 mt-12">
                  <button
                    onClick={() => setView('LIST')}
                    className="px-8 py-3 text-[10px] font-black text-gray-400 hover:text-black transition-colors uppercase tracking-[0.2em]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-10 py-5 bg-primary text-white rounded-[15px] text-[10px] font-black hover:bg-primary-hover transition-all flex items-center gap-4 shadow-xl shadow-primary/10 active:scale-95 group/btn uppercase tracking-[0.3em]"
                  >
                    <Zap className="w-4 h-4" />
                    Deploy Assistant
                  </button>
                </div>
              </div>
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
            <p className="text-gray-500 text-sm font-medium">Deploy specialized AI Agents for your practice</p>
          </div>
          <div className="relative group w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search specialists, practice areas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-[15px] py-4 pl-12 pr-4 text-sm font-medium text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Banner Carousel */}
        {subView === 'Premade Associates' && !searchQuery && (
          <div className="relative rounded-[15px] overflow-hidden mb-12 h-40">
            <AnimatePresence mode="wait">
              <motion.div
                key={bannerSlide}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className={`absolute inset-0 ${BANNER_SLIDES[bannerSlide].gradient} rounded-[15px] p-8 flex items-center gap-6`}
              >
                {/* Content */}
                <div className="relative z-10 flex items-center gap-6">
                  <div className="w-14 h-14 flex items-center justify-center text-black/80 shrink-0">
                    {React.createElement(BANNER_SLIDES[bannerSlide].icon, { className: 'w-10 h-10' })}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-black mb-1 tracking-tight">{BANNER_SLIDES[bannerSlide].title}</h2>
                    <p className="text-black/60 text-sm font-medium leading-relaxed max-w-2xl">
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
                      className={`w-2 h-2 rounded-full transition-all ${i === bannerSlide ? 'bg-primary w-5' : 'bg-gray-300'}`}
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
                <span className="px-3 py-1 bg-gray-50 text-gray-500 text-[10px] font-bold rounded-full uppercase tracking-widest border border-gray-100">{filteredPremade.length} Specialists</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
              {filteredPremade.map((specialist, idx) => {
                const colors = getColorClasses(specialist.color);
                return (
                  <motion.div
                    key={specialist.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                     onClick={() => handleConfigure(specialist)}
                     className={`group relative overflow-hidden rounded-[15px] bg-white border border-gray-200 p-8 transition-all hover:bg-gray-50 hover:border-primary/30 shadow-sm hover:shadow-md cursor-pointer flex items-center gap-8`}
                  >
                    <div className={`w-20 h-20 flex items-center justify-center ${colors.text} ${colors.iconHover} shrink-0 transition-transform group-hover:scale-110`}>
                      {getIcon(specialist.icon, 'w-12 h-12')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-bold text-black tracking-tight">{specialist.name}</h4>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors hover:translate-x-1" />
                      </div>
                      <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-2">{specialist.description}</p>
                      
                       {/* Jurisdictions chips */}
                        {specialist.jurisdictions && specialist.jurisdictions.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2 mt-4">
                            {specialist.jurisdictions.slice(0, 3).map(j => {
                              const code = JURISDICTION_FLAGS[j] || '';
                              return (
                                <span key={j} className={`flex items-center gap-2 ${colors.text} text-[10px] font-black uppercase tracking-widest transition-opacity hover:opacity-80`}>
                                  {code && <img src={`https://flagcdn.com/w20/${code}.png`} alt={j} className="w-3.5 h-2.5 object-cover rounded-[1px] opacity-60" />}
                                  {j}
                                </span>
                              );
                            })}
                            {specialist.jurisdictions.length > 3 && (
                                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">+{specialist.jurisdictions.length - 3}</span>
                            )}
                          </div>
                        )}
                        <button className={`mt-6 px-4 py-2 border ${colors.border} ${colors.text} text-[10px] font-black rounded-[10px] uppercase tracking-widest hover:${colors.bg} hover:text-white transition-all w-fit shadow-sm active:scale-95`}>
                          Customize Agent
                        </button>
                    </div>
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
                <span className="px-3 py-1 bg-white/5 text-gray-500 text-[10px] font-bold rounded-full uppercase tracking-widest border border-white/10">{filteredMyAssociates.length}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAISuggest}
                  disabled={isGeneratingPersona}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20 active:scale-95 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  {isGeneratingPersona ? 'Generating...' : 'AI Suggest'}
                </button>
                <button
                  onClick={handleCreateNew}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  New AI Associate
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-[15px] p-12 min-h-[300px] flex flex-col items-center justify-center text-center shadow-sm">
              {filteredMyAssociates.length === 0 ? (
                 <div className="max-w-sm">
                  <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-400 mx-auto mb-8 shadow-sm border border-gray-100">
                    <Gavel className="w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-bold text-black mb-3 tracking-tight">No associates yet</h4>
                  <p className="text-gray-500 text-sm font-medium mb-8">
                    Create your first AI associate to scale your legal team and automate workflows.
                  </p>
                  <div className="flex justify-center gap-3 mx-auto">
                    <button
                      onClick={handleAISuggest}
                      disabled={isGeneratingPersona}
                      className="px-8 py-3 bg-purple-600 text-white rounded-[15px] text-xs font-bold hover:bg-purple-700 transition-all flex items-center gap-2 shadow-xl shadow-purple-600/10 disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4" />
                      {isGeneratingPersona ? 'Generating...' : 'AI Suggest'}
                    </button>
                    <button
                      onClick={handleCreateNew}
                      className="px-8 py-3 bg-white text-black rounded-xl text-xs font-bold hover:bg-white/90 transition-all flex items-center gap-2 shadow-xl shadow-white/10 active:scale-95"
                    >
                      <Plus className="w-4 h-4 text-primary" />
                      Create Associate
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  {filteredMyAssociates.map(associate => {
                    const colors = getColorClasses(associate.color);
                    return (
                       <div key={associate.id} className={`p-8 bg-white border border-gray-200 rounded-[15px] flex items-center gap-6 hover:bg-gray-50 hover:border-primary/30 shadow-sm hover:shadow-md transition-all group cursor-pointer`}>
                        <div className={`w-16 h-16 flex items-center justify-center ${colors.text} ${colors.iconHover} transition-transform group-hover:scale-110`}>
                          {getIcon(associate.icon, "w-10 h-10")}
                        </div>
                        <div className="flex-1">
                          <h5 className="text-lg font-bold text-gray-800 tracking-tight">{associate.name}</h5>
                          <p className="text-gray-500 text-xs font-medium line-clamp-1">{associate.description}</p>
                          <button className={`mt-3 px-3 py-1.5 border ${colors.border} ${colors.text} text-[9px] font-black rounded-lg uppercase tracking-widest hover:${colors.bg} hover:text-white transition-all w-fit shadow-sm active:scale-95`}>
                            Customize Agent
                          </button>
                        </div>
                         <button className="p-3 text-gray-600 hover:text-primary transition-colors hover:translate-x-1 duration-300">
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
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-8 border border-primary/20">
              <Briefcase className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-black mb-4 tracking-tighter">Practice Areas</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto font-medium">
              Browse specialists by practice area. This feature is being optimized for the Kenyan legal market.
            </p>
          </div>
        )}

        {/* Templates Placeholder */}
        {subView === 'Templates' && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-8 border border-primary/20">
              <FileText className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-black mb-4 tracking-tighter">Associate Templates</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto font-medium">
              Start with a pre-configured template for common legal roles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalSpecialists;
