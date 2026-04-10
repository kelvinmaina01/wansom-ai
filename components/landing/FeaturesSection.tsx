import React from 'react';
import {
  Search, FolderOpen, Zap, Brain, Workflow, BarChart2,
} from 'lucide-react';
import FeatureRow from './FeatureRow';
import MiniCard from './MiniCard';
import DocDraftScreen from './screens/DocDraftScreen';
import LegalCounselScreen from './screens/LegalCounselScreen';
import AmaniScreen from './screens/AmaniScreen';
import JudicialAnalyticsScreen from './screens/JudicialAnalyticsScreen';
import IntegrationsScreen from './screens/IntegrationsScreen';

const FeaturesSection: React.FC = () => {
  return (
    <section id="platform" className="py-24 relative overflow-hidden bg-ai-studio">
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(white 1px,transparent 1px)', backgroundSize: '22px 22px' }}
      />

      {/* Header */}
      <div className="text-center px-6 pb-20 relative z-10">
        <div className="text-[11px] font-black tracking-[.2em] uppercase text-primary mb-4 font-[Inter]">The Platform</div>
        <h2
          className="text-[clamp(32px,5vw,52px)] font-extrabold text-white leading-tight mb-4 tracking-tight"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Everything your firm needs,<br /><span className="text-primary">built for East Africa</span>
        </h2>
        <p className="text-base text-gray-400 max-w-lg mx-auto leading-relaxed font-[Inter]">
          Six complete features in action — every animation shows the exact user flow.
        </p>
      </div>

      {/* ROW 1: Document Drafting Agent */}
      <FeatureRow
        number="01 — Document Agent"
        title="Draft Any Legal<br/>Document Instantly"
        description="Tell the Legal Documents Prep Agent what you need. It drafts a jurisdiction-correct document in seconds — preview it, inspect the HTML code, open the canvas editor to change fonts and styling, then save to Google Drive or download as PDF."
        bullets={[
          'Canvas editor with full font, size, bold/italic controls — edit live in the browser',
          'Switch between Preview, HTML Code, and Editor tabs with one click',
          'Save to Google Drive, OneDrive, download as PDF, or copy to clipboard',
        ]}
        badge={{ text: 'Live Now', variant: 'live' }}
      >
        <DocDraftScreen />
      </FeatureRow>

      {/* ROW 2: Legal AI Counsel */}
      <FeatureRow
        number="02 — Legal Counsel"
        title="AI That Asks Before<br/>It Answers"
        description="When a question is ambiguous, Lawlify AI doesn't guess — it asks clarifying questions in beautiful interactive cards. Once answered, it delivers statute-cited responses with expandable citation cards that open the full source document."
        bullets={[
          'Follow-up question cards for ambiguous queries — never a generic answer',
          'Citation cards expand to show full statute text with source link',
          'Thoughts drawer shows every search query and source consulted',
        ]}
        badge={{ text: 'Live Now', variant: 'live' }}
        reverse
      >
        <LegalCounselScreen />
      </FeatureRow>

      {/* ROW 3: Amani AI */}
      <FeatureRow
        number="03 — Mock Judge"
        title="Moot With an AI<br/>Judge in Realtime"
        description="Amani, the Mock Judge AI, challenges your legal arguments in a video-call style interface with live transcript. After each session, receive a detailed score with feedback and follow-up suggestions to sharpen your advocacy."
        bullets={[
          'Live dialogue with AI judge — real-time challenge and cross-examination',
          'Scored session with green/amber feedback on each argument point',
          'Follow-up insights and case law recommendations from Amani AI',
        ]}
        badge={{ text: 'Coming Soon', variant: 'soon' }}
      >
        <AmaniScreen />
      </FeatureRow>

      {/* ROW 4: Judicial Analytics */}
      <FeatureRow
        number="04 — Judicial Analytics"
        title="Know Your Judge<br/>Before You Argue"
        description="Search for any judge across Kenya, Uganda, and Tanzania. Get detailed analytics on their ruling patterns, allow rates, and AI-generated strategic summaries — so you walk into that courtroom prepared."
        bullets={[
          'Filter by region, court, and judge name — 312+ judges profiled',
          'Animated bar charts show disposition patterns and enforcement rates',
          'AI generates a strategic summary and answers follow-up questions',
        ]}
        badge={{ text: 'Enterprise', variant: 'enterprise' }}
        reverse
      >
        <JudicialAnalyticsScreen />
      </FeatureRow>

      {/* ROW 5: Integrations */}
      <FeatureRow
        number="05 — Workflow Bridge"
        title="Connect Your Entire<br/>Toolkit"
        description="Bridge Google Drive, Gmail, Slack, Sheets, Teams, and OneDrive directly into Lawlify via secure MCP tunnels. The AI reads your actual documents on demand — zero persistence, zero data storage."
        bullets={[
          'Secure MCP tunnel — data streamed into memory and discarded after inference',
          'AI searches your entire Google Drive via semantic queries — no manual uploads',
          'One-click connection with real-time status across all integrations',
        ]}
        badge={{ text: 'Live Now', variant: 'live' }}
      >
        <IntegrationsScreen />
      </FeatureRow>

      {/* MINI GRID */}
      <div className="max-w-[1240px] mx-auto px-12 pb-12 mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <MiniCard icon={<Search size={16} className="text-blue-400" />} bg="bg-blue-500/10" title="Intelligent Research" desc="Search thousands of EA statutes and precedents with semantic understanding." delay={0} />
          <MiniCard icon={<FolderOpen size={16} className="text-primary" />} bg="bg-primary/10" title="Document Vault" desc="Secure AI-indexed storage. Every document searchable by matter, party, or clause." delay={80} />
          <MiniCard icon={<Zap size={16} className="text-green-400" />} bg="bg-green-500/10" title="Smart Workflows" desc="Automate deadline tracking with EA court rules built in — zero manual calculation." delay={160} />
          <MiniCard icon={<Brain size={16} className="text-purple-400" />} bg="bg-purple-500/10" title="Knowledge Base" desc="Centralized firm intelligence — precedents, templates, and institutional know-how." delay={240} />
          <MiniCard icon={<Workflow size={16} className="text-amber-400" />} bg="bg-amber-500/10" title="Project Workspace" desc="3-step project initialization for comprehensive matters with full infrastructure setup." delay={320} soon />
          <MiniCard icon={<BarChart2 size={16} className="text-primary" />} bg="bg-primary/10" title="Case Management" desc="Autonomous agent monitors all matters, deadlines, and court listings around the clock." delay={400} />
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes feat-msgIn { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
        @keyframes feat-slideU { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes feat-ripple { 0% { transform:translate(-50%,-50%) scale(0); opacity:.6 } 100% { transform:translate(-50%,-50%) scale(2.8); opacity:0 } }
        @keyframes feat-fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes feat-wave { 0%,100% { transform:scaleY(0.5) } 50% { transform:scaleY(1.3) } }
      `}</style>
    </section>
  );
};

export default FeaturesSection;
