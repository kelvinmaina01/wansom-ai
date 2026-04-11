import React, { useState } from 'react';
import { 
  Check, 
  HelpCircle, 
  Building2, 
  GraduationCap, 
  Heart, 
  School, 
  ArrowLeft, 
  Minus, 
  X, 
  Shield, 
  Globe, 
  Zap, 
  Lock, 
  UserCheck, 
  Server, 
  HeadphonesIcon, 
  ArrowRight,
  Info,
  Users,
  CreditCard,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface PricingPageProps {
  onBack: () => void;
  onGetStarted: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onBack, onGetStarted }) => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selAmt, setSelAmt] = useState(150);
  const [selPrice, setSelPrice] = useState(5);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState({ title: '', sub: '', added: '' });

  const navigate = useNavigate();

  const openModal = (amt?: number, price?: number) => {
    if (amt && price) {
      setSelAmt(amt);
      setSelPrice(price);
    }
    setModalOpen(true);
  };

  const handleBuyCredits = () => {
    setSuccessData({
      title: 'Credits added!',
      sub: `Your ${selAmt.toLocaleString()} credits are ready to use. They never expire.`,
      added: `+${selAmt.toLocaleString()}`
    });
    setModalOpen(false);
    setShowSuccess(true);
  };

  const handleUpgrade = (plan: string, price: number, credits: number) => {
    setSuccessData({
      title: `Welcome to ${plan}!`,
      sub: `You now have ${credits.toLocaleString()} credits/month. No daily reset — use them any time during your billing cycle.`,
      added: credits.toLocaleString()
    });
    setModalOpen(false);
    setShowSuccess(true);
  };

  const handleSelectUpgrade = (plan: string, price: number, credits: number) => {
    handleUpgrade(plan, price, credits);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary/30 overflow-x-hidden pb-24">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-xl font-black tracking-tighter">Lawlify<span className="text-primary">.</span>AI</span>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={onGetStarted} className="px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all">Sign In</button>
             <button onClick={onGetStarted} className="px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest bg-primary text-white hover:bg-primary-hover transition-all">Start Free →</button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="pt-40 pb-16 text-center px-4 relative">
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4"
        >
          Pricing
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.9] text-white"
        >
          Simple, transparent pricing.<br />
          <span className="text-gray-400">Start free. Scale as you grow.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-500 font-medium max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Every plan runs on credits. Daily resets for free users, monthly cycles for paid plans. Top up or upgrade any time.
        </motion.p>

        {/* Billing Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-4 mb-16"
        >
          <div className="bg-white/5 border border-white/10 p-1.5 rounded-2xl flex items-center relative backdrop-blur-sm shadow-xl">
            <button 
              onClick={() => setIsAnnual(false)}
              className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all z-10 ${!isAnnual ? 'text-white' : 'text-gray-500 hover:text-white'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all z-10 ${isAnnual ? 'text-white' : 'text-gray-500 hover:text-white'}`}
            >
              Annual
            </button>
            <motion.div 
              layout
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white/10 border border-white/10 rounded-xl shadow-lg transition-all duration-300 ${isAnnual ? 'left-[calc(50%+3px)]' : 'left-1.5'}`}
            />
          </div>
          <div className="flex flex-col items-start translate-y-1">
            <span className="text-[10px] font-black text-green-400 bg-green-400/10 px-2 py-1 rounded-lg border border-green-400/20 uppercase tracking-widest shadow-sm">
              Save 20%
            </span>
          </div>
        </motion.div>

        {/* CREDIT USAGE INFO (Analogy Section) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto mb-20 bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group hover:border-primary/30 transition-all duration-500"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary/10 transition-all" />
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Info className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-black text-white uppercase tracking-widest">How credits work</h3>
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Transparent usage across Lawlify Intelligence</p>
              </div>
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[11px] font-black tracking-widest text-gray-400 uppercase">
               1 action = 1–3 credits
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'AI Chat Response', val: '1', unit: 'credit' },
              { label: 'Document Analysis', val: '2', unit: 'credits' },
              { label: 'Document Draft', val: '3', unit: 'credits' },
              { label: 'Integration Query', val: '1', unit: 'credit' }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all group/item">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 leading-tight min-h-[30px]">{item.label}</div>
                <div className="text-3xl font-black text-white mb-1 group-hover/item:text-primary transition-colors">{item.val}</div>
                <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{item.unit}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             {[
               { plan: 'Free', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', text: '5 credits/day. Resets at midnight UTC. Each day starts fresh.' },
               { plan: 'Personal', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', text: '500 credits/month. No daily reset — use them any time.' },
               { plan: 'Teams', color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20', text: '800 credits/seat, pooled across team members.' },
               { plan: 'Enterprise', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', text: 'Unlimited. No credit tracking, no caps. Custom pricing.' }
             ].map((r, i) => (
               <div key={i} className={`text-left rounded-2xl p-4 border ${r.bg} ${r.border}`}>
                 <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${r.color}`}>{r.plan}</div>
                 <p className="text-[11px] text-gray-300 leading-relaxed font-medium">{r.text}</p>
               </div>
             ))}
          </div>
        </motion.div>
      </div>

      {/* PRICING GRID */}
      <div className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* FREE */}
        <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 hover:border-white/20 transition-all flex flex-col min-h-full">
          <div className="mb-6">
            <h3 className="text-xl font-black text-white mb-1">Free</h3>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">For individuals exploring AI-powered legal work</p>
          </div>
          <div className="mb-8">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-white">$0</span>
              <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">/mo</span>
            </div>
            <div className="h-4 mt-1">&nbsp;</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-6 mb-8 relative overflow-hidden group/cr">
             <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover/cr:bg-blue-500/10 transition-all" />
             <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4">Daily Credits — Midnight Reset</div>
             <div className="flex items-baseline gap-2 mb-3">
               <span className="text-3xl font-black text-white">5</span>
               <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">credits / day</span>
             </div>
             <p className="text-[10px] text-gray-400 leading-relaxed mb-6 font-medium">Unused credits do NOT carry over. Starts fresh at midnight UTC.</p>
             <div className="h-1 bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500/40 w-[5%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
             </div>
          </div>

          <button onClick={onGetStarted} className="w-full py-4 rounded-2xl border border-white/10 text-white font-black uppercase tracking-widest text-[11px] hover:bg-white/5 transition-all mb-10">
            Get Started Free
          </button>
          
          <div className="space-y-4 flex-1">
             {[
               { on: true, text: '5 credits/day (no rollover)' },
               { on: true, text: '2 client/matter workspaces' },
               { on: true, text: '500 MB Document Vault' },
               { on: true, text: 'Basic AI legal tools' },
               { on: true, text: 'Buy top-up credits anytime' },
               { on: false, text: 'AI Associates' },
               { on: false, text: 'Integrations' }
             ].map((f, i) => (
               <div key={i} className="flex items-start gap-3">
                 <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${f.on ? 'bg-primary/20 border border-primary/30' : 'bg-white/5 border border-white/10 opacity-30'}`}>
                   {f.on && <Check className="w-2.5 h-2.5 text-primary" strokeWidth={3} />}
                 </div>
                 <span className={`text-[12px] font-medium ${f.on ? 'text-gray-300' : 'text-gray-600'}`}>{f.text}</span>
               </div>
             ))}
          </div>
        </div>

        {/* PERSONAL */}
        <div className="bg-white/[0.04] border-2 border-primary rounded-[2.5rem] p-8 shadow-2xl shadow-primary/5 flex flex-col min-h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="self-center bg-primary text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-8 absolute -top-3 shadow-lg shadow-primary/20">
            Most Popular
          </div>
          
          <div className="mb-6 mt-4">
            <h3 className="text-xl font-black text-white mb-1">Personal</h3>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">Best for solo practitioners who want to do more</p>
          </div>
          
          <div className="mb-8">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-white">${isAnnual ? '12' : '15'}</span>
              <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">/mo</span>
            </div>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest font-black mt-1 h-4">
              {isAnnual ? 'Billed annually ($144)' : <>&nbsp;</>}
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/30 rounded-[1.5rem] p-6 mb-8 relative overflow-hidden group/cr">
             <div className="text-[9px] font-black text-primary uppercase tracking-widest mb-4">Monthly Credits — No Daily Reset</div>
             <div className="flex items-baseline gap-2 mb-3">
               <span className="text-3xl font-black text-white">500</span>
               <span className="text-[11px] font-black text-primary uppercase tracking-widest">credits / month</span>
             </div>
             <p className="text-[10px] text-gray-300 leading-relaxed mb-6 font-medium">Use any time during billing month. Zero when done — top up or wait for renewal.</p>
             <div className="h-1 bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-primary/60 w-[42%] rounded-full shadow-[0_0_10px_rgba(239,68,68,0.3)]" />
             </div>
          </div>

          <button onClick={onGetStarted} className="w-full py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all mb-10">
            Upgrade Now
          </button>
          
          <div className="space-y-4 flex-1">
             {[
               '500 credits/month (no daily reset)',
               'Unlimited client/matter workspaces',
               '5 GB Document Vault',
               'Up to 10 AI Associates',
               'Google Calendar & Email integrations',
               'Priority email support',
               'Buy top-up credits anytime',
               'Team collaboration'
             ].map((f, i) => (
               <div key={i} className="flex items-start gap-3">
                 <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${i < 7 ? 'bg-primary/20 border border-primary/30' : 'bg-white/5 border border-white/10 opacity-30'}`}>
                   {i < 7 && <Check className="w-2.5 h-2.5 text-primary" strokeWidth={3} />}
                 </div>
                 <span className={`text-[12px] font-medium ${i < 7 ? 'text-gray-300' : 'text-gray-600'}`}>{f}</span>
               </div>
             ))}
          </div>
        </div>

        {/* TEAMS */}
        <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 hover:border-white/20 transition-all flex flex-col min-h-full">
          <div className="mb-6">
            <h3 className="text-xl font-black text-white mb-1">Teams</h3>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">Collaborate on client matters with your whole firm</p>
          </div>
          <div className="mb-8">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-white">${isAnnual ? '12' : '15'}</span>
              <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">/seat/mo</span>
            </div>
            <div className="text-[9px] text-gray-600 uppercase tracking-widest font-black mt-1 leading-tight h-4">
              Prorated billing when members join
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-6 mb-8 relative overflow-hidden group/cr">
             <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4">Per-Seat Credits — Pooled</div>
             <div className="flex items-baseline gap-2 mb-3">
               <span className="text-3xl font-black text-white">800</span>
               <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">credits/seat/mo</span>
             </div>
             <p className="text-[10px] text-gray-400 leading-relaxed mb-6 font-medium">All seats share one pool. Counts down until billing renewal.</p>
             <div className="h-1 bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-white/20 w-[65%] rounded-full" />
             </div>
          </div>

          <button onClick={onGetStarted} className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[11px] hover:bg-gray-200 transition-all mb-10">
            Start Teams Plan
          </button>
          
          <div className="space-y-4 flex-1">
             <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Everything in Personal, plus:</div>
             {[
               '800 credits/seat (shared team pool)',
               '50 GB Document Vault',
               'Unlimited AI Associates',
               'Role-based access control',
               'Team collaboration tools',
               'Custom workflows & integrations',
               'Global firm management'
             ].map((f, i) => (
               <div key={i} className="flex items-start gap-3">
                 <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-primary/20 border border-primary/30`}>
                   <Check className="w-2.5 h-2.5 text-primary" strokeWidth={3} />
                 </div>
                 <span className={`text-[12px] font-medium text-gray-300`}>{f}</span>
               </div>
             ))}
          </div>
        </div>

        {/* ENTERPRISE */}
        <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 hover:border-white/20 transition-all flex flex-col min-h-full">
          <div className="mb-6">
            <h3 className="text-xl font-black text-white mb-1">Enterprise</h3>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">For the most demanding legal teams</p>
          </div>
          <div className="mb-8">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white tracking-widest uppercase">Custom</span>
            </div>
            <div className="text-[9px] text-gray-600 uppercase tracking-widest font-black mt-2 h-4">
              Annual contract · volume pricing
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-6 mb-8 relative overflow-hidden group/cr">
             <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4">Credits</div>
             <div className="flex items-baseline gap-2 mb-3">
               <span className="text-3xl font-black text-white tracking-widest uppercase">Unlimited</span>
             </div>
             <p className="text-[10px] text-gray-400 leading-relaxed mb-6 font-medium">No credit caps. Custom AI model fine-tuning included.</p>
             <div className="h-1 bg-green-500/20 rounded-full overflow-hidden">
               <div className="h-full bg-green-500/60 w-full rounded-full" />
             </div>
          </div>

          <button onClick={() => navigate('/book-enterprise-demo')} className="w-full py-4 rounded-2xl border border-white/10 text-white font-black uppercase tracking-widest text-[11px] hover:bg-white/5 transition-all mb-10">
            Contact Sales
          </button>
          
          <div className="space-y-4 flex-1">
             {[
               'Unlimited credits — no caps ever',
               'Everything in Teams, plus:',
               'SSO & SAML 2.0',
               'On-premise deployment',
               'Custom AI model fine-tuning',
               'Audit logging & compliance',
               'Dedicated success manager'
             ].map((f, i) => (
               <div key={i} className="flex items-start gap-3">
                 <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-green-500/20 border border-green-500/30`}>
                   <Check className="w-2.5 h-2.5 text-green-500" strokeWidth={3} />
                 </div>
                 <span className={`text-[12px] font-medium text-gray-300`}>{f}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* TOP-UP SECTION */}
      <div className="max-w-4xl mx-auto px-6 pb-24">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-white mb-2">Need more credits? Top up anytime.</h2>
          <p className="text-[13px] text-gray-500 font-medium">Works on any plan. Top-up credits are consumed first and never expire.</p>
        </div>
        
        <div className="bg-amber-400/[0.03] border border-amber-400/20 rounded-2xl p-6 mb-10 flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
             <Info className="w-5 h-5 text-amber-500" />
           </div>
           <p className="text-sm text-amber-500/80 font-medium leading-relaxed">
             Top-up credits are consumed <strong className="text-amber-500">first</strong> before your plan credits. They never expire — carry over month to month.
           </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { amt: 50, price: 2, per: '0.04' },
            { amt: 150, price: 5, per: '0.033', best: true },
            { amt: 500, price: 14, per: '0.028' },
            { amt: 1000, price: 25, per: '0.025' }
          ].map((item, i) => (
            <div key={i} className={`bg-white/[0.02] border rounded-[2rem] p-8 text-center relative group hover:scale-[1.03] transition-all duration-300 ${item.best ? 'border-amber-400/40 shadow-xl shadow-amber-400/5' : 'border-white/10 hover:border-primary/40'}`}>
              {item.best && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-[9px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg h-6 flex items-center">
                  Best Value
                </div>
              )}
              <div className="text-4xl font-black text-white mb-1">{item.amt}</div>
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">credits</div>
              <div className="text-xl font-black text-primary mb-1">${item.price}</div>
              <div className="text-[10px] text-gray-600 font-bold mb-8">${item.per} / credit</div>
              <button 
                onClick={() => openModal(item.amt, item.price)}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 font-black uppercase tracking-widest text-[9px] hover:bg-primary hover:text-white hover:border-primary transition-all text-white"
              >
                Buy {item.amt} credits
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SUPPORTING EDUCATION SECTION (90% Rules) */}
      <div className="py-24 border-t border-white/5 relative">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-6 border border-primary/20">
              <Heart className="w-3 h-3 fill-current" />
              <span>Supporting Education</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight mb-4">We believe in empowering<br />the next generation</h2>
            <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto">
              The future of law depends on accessible tools. That's why we offer students and academic researchers massive discounts because breakthrough legal work shouldn't be limited by budget.
            </p>
          </div>

          <div className="bg-[#0a0a0a] rounded-[3rem] border border-white/10 flex flex-col lg:flex-row overflow-hidden shadow-3xl shadow-primary/5">
            {/* Left: Discounts List */}
            <div className="flex-1 p-12 lg:p-16 space-y-12">
               <div className="flex gap-8 group">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl group-hover:shadow-primary/20">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black mb-2 text-white group-hover:text-primary transition-colors">90% Student Discount</h3>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">Full Personal features for just $1.50/month. Same powerful AI, same unlimited analysis, same 500 credits.</p>
                  </div>
               </div>

               <div className="flex gap-8 group">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 shadow-xl group-hover:shadow-blue-500/20">
                    <School className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black mb-2 text-white group-hover:text-blue-500 transition-colors">50% Academic Institution</h3>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">Universities, research institutions, and legal clinics qualify for 50% off team plans.</p>
                  </div>
               </div>

               <div className="flex gap-8 group">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all duration-500 shadow-xl group-hover:shadow-green-500/20">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black mb-2 text-white group-hover:text-green-500 transition-colors">Non-Profit Organizations</h3>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">Registered non-profits advancing justice receive 50% off all plans.</p>
                  </div>
               </div>
            </div>

            {/* Right: Verification Card */}
            <div className="lg:w-[440px] bg-white/[0.03] p-12 lg:p-16 flex flex-col justify-center border-l border-white/5 relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />
              
              <div className="mb-8">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-gray-700 line-through text-2xl font-black">$15</span>
                  <span className="text-6xl font-black text-primary">$1.50</span>
                  <span className="text-gray-500 font-bold uppercase tracking-widest text-[11px]">/mo</span>
                </div>
                <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Personal plan with student discount</p>
              </div>

              <div className="space-y-4 mb-10">
                 {[
                   'Full AI analysis suite',
                   'Unlimited workspaces',
                   '5 GB Document Storage',
                   'Priority response times'
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-300">
                     <Check className="w-4 h-4 text-primary" strokeWidth={3} />
                     {item}
                   </div>
                 ))}
              </div>

              <button className="w-full py-5 bg-primary text-white rounded-[1.25rem] font-black uppercase tracking-widest text-[12px] shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-all">
                Verify Student Status
              </button>
              <p className="text-center text-[10px] text-gray-600 font-black uppercase tracking-widest mt-5">
                Instant verification with .edu email
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* COMPARISON TABLE */}
      <div className="py-24 px-6 max-w-6xl mx-auto relative">
        <div className="text-center mb-16">
          <div className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">Compare Plans</div>
          <h2 className="text-4xl font-black text-white mb-4">Detailed feature breakdown</h2>
          <p className="text-gray-500 font-medium">Everything you need to make the right decision for your firm.</p>
        </div>

        <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-white/[0.02] shadow-3xl">
          <table className="w-full border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-8 text-left text-[11px] font-black uppercase tracking-widest text-gray-500">Features</th>
                <th className="p-8 text-center text-[13px] font-black text-white">Free</th>
                <th className="p-8 text-center text-[13px] font-black text-primary bg-primary/5 border-x border-white/5 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">Most Popular</div>
                   Personal
                </th>
                <th className="p-8 text-center text-[13px] font-black text-white">Teams</th>
                <th className="p-8 text-center text-[13px] font-black text-white">Enterprise</th>
              </tr>
            </thead>
            <tbody className="text-[13px] font-medium text-gray-400">
              {/* CATEGORY: PRICING */}
              <tr className="bg-white/[0.04]"><td colSpan={5} className="px-8 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">Pricing & Billing</td></tr>
              <tr className="border-b border-white/5">
                <td className="p-6 ps-8 text-white font-black">Monthly price</td>
                <td className="p-6 text-center text-white font-bold">$0</td>
                <td className="p-6 text-center text-primary font-black bg-primary/5">$15/mo</td>
                <td className="p-6 text-center text-white font-bold">$15/seat/mo</td>
                <td className="p-6 text-center text-white font-bold">Custom</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-6 ps-8 text-white font-black">Annual price (Save 20%)</td>
                <td className="p-6 text-center">$0</td>
                <td className="p-6 text-center text-primary font-black bg-primary/5">$12/mo <span className="text-[10px] text-gray-600 font-bold block">($144/yr)</span></td>
                <td className="p-6 text-center">$12/seat/mo</td>
                <td className="p-6 text-center">Custom</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-6 ps-8 text-white font-black">Student pricing</td>
                <td className="p-6 text-center">—</td>
                <td className="p-6 text-center text-green-400 font-black bg-primary/5">$1.50/mo <span className="text-[10px] text-gray-600 block">(90% off)</span></td>
                <td className="p-6 text-center">—</td>
                <td className="p-6 text-center">—</td>
              </tr>

              {/* CATEGORY: CREDITS */}
              <tr className="bg-white/[0.04]"><td colSpan={5} className="px-8 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">Credits & Usage</td></tr>
              <tr className="border-b border-white/5">
                <td className="p-6 ps-8 text-white font-black">Credit allocation</td>
                <td className="p-6 text-center">5 / day</td>
                <td className="p-6 text-center text-primary font-black bg-primary/5">500 / month</td>
                <td className="p-6 text-center">800 / seat / month</td>
                <td className="p-6 text-center text-white font-bold">Unlimited</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-6 ps-8 text-white font-black">Reset behaviour</td>
                <td className="p-6 text-center">Midnight UTC</td>
                <td className="p-6 text-center bg-primary/5">Billing Cycle</td>
                <td className="p-6 text-center">Billing Cycle</td>
                <td className="p-6 text-center">No limits</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-6 ps-8 text-white font-black">Buy top-up credits</td>
                <td className="p-6 text-center flex justify-center"><Check className="text-primary w-4 h-4" strokeWidth={3} /></td>
                <td className="p-6 text-center bg-primary/5"><div className="flex justify-center"><Check className="text-primary w-4 h-4" strokeWidth={3} /></div></td>
                <td className="p-6 text-center flex justify-center"><Check className="text-primary w-4 h-4" strokeWidth={3} /></td>
                <td className="p-6 text-center">N/A</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-6 ps-8 text-white font-black">Top-up credits expire</td>
                <td className="p-6 text-center">Never</td>
                <td className="p-6 text-center bg-primary/5">Never</td>
                <td className="p-6 text-center">Never</td>
                <td className="p-6 text-center">N/A</td>
              </tr>

              {/* CATEGORY: STORAGE */}
              <tr className="bg-white/[0.04]"><td colSpan={5} className="px-8 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">Workspace & Storage</td></tr>
              <tr className="border-b border-white/5">
                <td className="p-6 ps-8 text-white font-black">Matter workspaces</td>
                <td className="p-6 text-center">2 Active</td>
                <td className="p-6 text-center bg-primary/5">Unlimited</td>
                <td className="p-6 text-center">Unlimited</td>
                <td className="p-6 text-center">Unlimited</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-6 ps-8 text-white font-black">Document Vault storage</td>
                <td className="p-6 text-center">500 MB</td>
                <td className="p-6 text-center bg-primary/5">5 GB</td>
                <td className="p-6 text-center">50 GB / seat</td>
                <td className="p-6 text-center">Custom</td>
              </tr>

               {/* CATEGORY: SECURITY */}
               <tr className="bg-white/[0.04]"><td colSpan={5} className="px-8 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">Integrations & Security</td></tr>
               <tr className="border-b border-white/5">
                <td className="p-6 ps-8 text-white font-black">Google Cal & Email</td>
                <td className="p-6 text-center">—</td>
                <td className="p-6 text-center bg-primary/5 flex justify-center"><Check className="text-primary w-4 h-4" strokeWidth={3} /></td>
                <td className="p-6 text-center flex justify-center"><Check className="text-gray-300 w-4 h-4" strokeWidth={3} /></td>
                <td className="p-6 text-center flex justify-center"><Check className="text-green-500 w-4 h-4" strokeWidth={3} /></td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-6 ps-8 text-white font-black">SSO & SAML 2.0</td>
                <td className="p-6 text-center">—</td>
                <td className="p-6 text-center bg-primary/5">—</td>
                <td className="p-6 text-center">—</td>
                <td className="p-6 text-center flex justify-center"><Check className="text-green-500 w-4 h-4" strokeWidth={3} /></td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-6 ps-8 text-white font-black">On-premise deployment</td>
                <td className="p-6 text-center">—</td>
                <td className="p-6 text-center bg-primary/5">—</td>
                <td className="p-6 text-center">—</td>
                <td className="p-6 text-center flex justify-center"><Check className="text-green-500 w-4 h-4" strokeWidth={3} /></td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-white/5">
                <td></td>
                <td className="p-8"><button onClick={onGetStarted} className="w-full py-3 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5 transition-all">Get Started</button></td>
                <td className="p-8 bg-primary/5"><button onClick={onGetStarted} className="w-full py-3 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">Upgrade Now</button></td>
                <td className="p-8"><button onClick={onGetStarted} className="w-full py-3 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all">Join Teams</button></td>
                <td className="p-8"><button onClick={() => navigate('/book-enterprise-demo')} className="w-full py-3 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5 transition-all">Contact us</button></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl" 
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] w-[880px] max-w-full overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.5)] flex flex-col"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                     <CreditCard className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white mb-1">Buy credits</h2>
                    <p className="text-sm text-gray-400 font-medium">Choose an option to continue without interruption</p>
                  </div>
                </div>
                <button onClick={() => setModalOpen(false)} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="px-8 py-5 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Current Balance</div>
                <div className="text-2xl font-black text-white">0 <span className="text-xs text-gray-500 font-bold uppercase tracking-widest ml-1">credits remaining</span></div>
              </div>

              <div className="flex flex-col md:flex-row flex-1">
                <div className="flex-1 p-8 border-r border-white/5">
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Top Up Credits</div>
                  <div className="space-y-3 mb-8">
                    {[
                      { amt: 50, price: 2 },
                      { amt: 150, price: 5, best: true },
                      { amt: 500, price: 14 },
                      { amt: 1000, price: 25 }
                    ].map((item, i) => (
                      <div 
                        key={i} 
                        onClick={() => {setSelAmt(item.amt); setSelPrice(item.price);}}
                        className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all ${selAmt === item.amt ? 'border-primary bg-primary/10 shadow-lg shadow-primary/5' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                      >
                        <div className="flex items-center gap-4">
                           <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selAmt === item.amt ? 'border-primary bg-primary' : 'border-white/10'}`}>
                             {selAmt === item.amt && <div className="w-2 h-2 rounded-full bg-white" />}
                           </div>
                           <div className="flex items-center gap-3">
                             <div className="text-lg font-black text-white">{item.amt} <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">credits</span></div>
                             {item.best && <span className="text-[8px] font-black bg-amber-400 text-black px-2 py-0.5 rounded-full uppercase tracking-widest">Best</span>}
                           </div>
                        </div>
                        <div className="text-lg font-black text-primary">${item.price}</div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={handleBuyCredits}
                    className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[12px] shadow-2xl shadow-primary/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-3"
                  >
                    <Shield className="w-4 h-4" />
                    Buy {selAmt.toLocaleString()} credits — ${selPrice}
                  </button>
                </div>

                <div className="flex-1 p-8 bg-white/[0.01]">
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Or Upgrade Your Plan</div>
                  <div className="space-y-4 mb-10">
                    <div 
                      onClick={() => handleSelectUpgrade('Personal', 15, 500)}
                      className="p-5 rounded-2xl border-2 border-primary bg-primary/5 cursor-pointer relative group transition-all"
                    >
                      <div className="absolute -top-3 right-6 bg-primary text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Recommended</div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-lg font-black text-white">Personal</div>
                        <div className="text-lg font-black text-primary">$15<span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1">/mo</span></div>
                      </div>
                      <div className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-3">500 credits/month · No daily reset</div>
                      <div className="text-[10px] text-gray-500 font-medium leading-relaxed">+ Integrations · AI Associates · 5GB · Priority support</div>
                    </div>

                    <div 
                      onClick={() => handleSelectUpgrade('Teams', 15, 800)}
                      className="p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-white/30 cursor-pointer group transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-lg font-black text-white">Teams</div>
                        <div className="text-lg font-black text-primary">$15<span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1">/seat</span></div>
                      </div>
                      <div className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-3">800 credits/seat · Shared pool</div>
                      <div className="text-[10px] text-gray-500 font-medium leading-relaxed">+ RBAC · Unlimited Associates · 50GB · Custom workflows</div>
                    </div>

                    <div 
                      onClick={() => handleSelectUpgrade('Student', 1.5, 500)}
                      className="p-5 rounded-2xl border border-white/5 bg-white/5 hover:border-white/30 cursor-pointer group transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-lg font-black text-white">Student</div>
                        <div className="text-lg font-black text-primary">$1.50<span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1">/mo</span></div>
                      </div>
                      <div className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-3">Personal plan · 90% student discount</div>
                      <div className="text-[10px] text-gray-500 font-medium leading-relaxed">Verify with .edu email · instant access</div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleSelectUpgrade('Personal', 15, 500)}
                    className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[12px] hover:bg-gray-200 transition-all flex items-center justify-center gap-3"
                  >
                    <ArrowRight className="w-4 h-4 rotate-[-45deg]" />
                    Upgrade to Personal — $15/mo
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-3xl" />
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} 
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="relative bg-black border border-white/10 rounded-[3rem] p-12 w-[420px] text-center shadow-4xl"
            >
               <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/10">
                 <Check className="w-10 h-10 text-green-500" strokeWidth={3} />
               </div>
               <h2 className="text-2xl font-black text-white mb-4">{successData.title}</h2>
               <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8">{successData.sub}</p>
               <div className="text-5xl font-black text-green-500 mb-2">{successData.added}</div>
               <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-10">credits added to your account</div>
               <button 
                onClick={() => setShowSuccess(false)}
                className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[12px] hover:bg-gray-200 transition-all"
               >
                 Continue working →
               </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PricingPage;
