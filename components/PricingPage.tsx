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
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary/30 overflow-x-hidden pb-24 relative">
      <div className="fixed inset-0 bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] [background-size:48px_48px] pointer-events-none" />
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-black hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={onGetStarted} className="px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest bg-primary text-white hover:bg-primary-hover transition-all">Start Free →</button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="pt-40 pb-16 text-center px-4 relative">
        
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
          className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight text-slate-900"
        >
          Simple, transparent pricing.<br />
          <span className="text-primary text-3xl font-bold tracking-tight">Start free. Scale as you grow.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-black font-medium max-w-2xl mx-auto mb-10 leading-relaxed"
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
          <div className="bg-white border border-slate-200 p-1.5 rounded-2xl flex items-center relative shadow-sm">
            <button 
              onClick={() => setIsAnnual(false)}
              className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all z-10 ${!isAnnual ? 'text-slate-900' : 'text-black hover:text-primary'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all z-10 ${isAnnual ? 'text-slate-900' : 'text-black hover:text-primary'}`}
            >
              Annual
            </button>
            <motion.div 
              layout
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white border border-slate-200 rounded-xl shadow-md transition-all duration-300 ${isAnnual ? 'left-[calc(50%+3px)]' : 'left-1.5'}`}
            />
          </div>
          <div className="flex flex-col items-start translate-y-1">
            <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">
              Save 20%
            </span>
          </div>
        </motion.div>


      </div>

      {/* PRICING GRID */}
      <div className="max-w-[1400px] mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-4 gap-12 items-start">
        {/* FREE */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 hover:border-black transition-all flex flex-col min-h-full shadow-sm">
          <div className="mb-6">
            <h3 className="text-xl font-black text-slate-900 mb-1">Free</h3>
            <p className="text-xs text-black font-medium leading-relaxed">For individuals exploring AI-powered legal work</p>
          </div>
          <div className="mb-8">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-900">$0</span>
              <span className="text-black font-black uppercase tracking-widest text-[10px]">/mo</span>
            </div>
            <div className="h-4 mt-1">&nbsp;</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-[1.5rem] p-6 mb-8 relative overflow-hidden group/cr">
             <div className="text-[9px] font-black text-black uppercase tracking-widest mb-4">Daily Credits — Midnight Reset</div>
             <div className="flex items-baseline gap-2 mb-3">
               <span className="text-3xl font-black text-primary">5</span>
               <span className="text-[11px] font-black text-black uppercase tracking-widest">credits / day</span>
             </div>
             <p className="text-[10px] text-black leading-relaxed mb-6 font-medium">5 credits/day. Resets at midnight UTC. Each day starts fresh.</p>
             <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
               <div className="h-full bg-primary/40 w-[5%] rounded-full shadow-[0_0_10px_rgba(239,68,68,0.3)]" />
             </div>
          </div>

          <button onClick={onGetStarted} className="w-full py-4 rounded-2xl border border-slate-200 text-slate-900 font-black uppercase tracking-widest text-[11px] hover:bg-slate-50 transition-all mb-10">
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
                 <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${f.on ? 'bg-primary/10 border border-primary/20' : 'bg-slate-100 border border-slate-200'}`}>
                   {f.on && <Check className="w-2.5 h-2.5 text-primary" strokeWidth={3} />}
                 </div>
                 <span className="text-[12px] font-medium text-black">{f.text}</span>
               </div>
             ))}
          </div>
        </div>

        {/* PERSONAL */}
        <div className="bg-white border-2 border-primary rounded-[2.5rem] p-8 shadow-xl shadow-primary/5 flex flex-col min-h-full relative overflow-hidden">
          <div className="self-center bg-primary text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-8 absolute -top-4 shadow-lg shadow-primary/20">
            Most Popular
          </div>
          
          <div className="mb-6 mt-4">
            <h3 className="text-xl font-black text-slate-900 mb-1">Personal</h3>
            <p className="text-xs text-black font-medium leading-relaxed">Best for solo practitioners who want to do more</p>
          </div>
          
          <div className="mb-8">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-900">${isAnnual ? '12' : '15'}</span>
              <span className="text-black font-black uppercase tracking-widest text-[10px]">/mo</span>
            </div>
            <div className="text-[9px] text-black uppercase tracking-widest font-black mt-1 h-4">
              {isAnnual ? `Billed annually ($144)` : <>&nbsp;</>}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-[1.5rem] p-6 mb-8 relative overflow-hidden group/cr">
             <div className="text-[9px] font-black text-primary uppercase tracking-widest mb-4">Monthly Credits — No Daily Reset</div>
             <div className="flex items-baseline gap-2 mb-3">
               <span className="text-3xl font-black text-primary">500</span>
               <span className="text-[11px] font-black text-primary uppercase tracking-widest">credits / month</span>
             </div>
             <p className="text-[10px] text-black leading-relaxed mb-6 font-medium">500 credits/month. No daily reset — use them any time.</p>
             <div className="h-1 bg-primary/10 rounded-full overflow-hidden">
               <div className="h-full bg-primary w-[42%] rounded-full" />
             </div>
          </div>

          <button onClick={onGetStarted} className="w-full py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all mb-10">
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
                 <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${i < 7 ? 'bg-primary/10 border border-primary/20' : 'bg-slate-100 border border-slate-200'}`}>
                   {i < 7 && <Check className="w-2.5 h-2.5 text-primary" strokeWidth={3} />}
                 </div>
                 <span className="text-[12px] font-medium text-black">{f}</span>
               </div>
             ))}
          </div>
        </div>

        {/* TEAMS */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 hover:border-black transition-all flex flex-col min-h-full shadow-sm">
          <div className="mb-6">
            <h3 className="text-xl font-black text-slate-900 mb-1">Teams</h3>
            <p className="text-xs text-black font-medium leading-relaxed">Collaborate on client matters with your whole firm</p>
          </div>
          <div className="mb-8">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-900">${isAnnual ? '12' : '15'}</span>
              <span className="text-black font-black uppercase tracking-widest text-[10px]">/seat/mo</span>
            </div>
            <div className="text-[9px] text-black uppercase tracking-widest font-black mt-1 leading-tight h-4">
              Prorated billing when members join
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-[1.5rem] p-6 mb-8 relative overflow-hidden group/cr">
             <div className="text-[9px] font-black text-black uppercase tracking-widest mb-4">Per-Seat Credits — Pooled</div>
             <div className="flex items-baseline gap-2 mb-3">
               <span className="text-3xl font-black text-primary">800</span>
               <span className="text-[11px] font-black text-black uppercase tracking-widest">credits/seat/mo</span>
             </div>
             <p className="text-[10px] text-black leading-relaxed mb-6 font-medium">800 credits/seat, pooled across team members.</p>
             <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
               <div className="h-full bg-primary/40 w-[65%] rounded-full" />
             </div>
          </div>

          <button onClick={onGetStarted} className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] hover:bg-black transition-all mb-10">
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
                 <span className="text-[12px] font-medium text-black">{f}</span>
               </div>
             ))}
          </div>
        </div>

        {/* ENTERPRISE */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 hover:border-black transition-all flex flex-col min-h-full shadow-sm">
          <div className="mb-6">
            <h3 className="text-xl font-black text-slate-900 mb-1">Enterprise</h3>
            <p className="text-xs text-black font-medium leading-relaxed">For the most demanding legal teams</p>
          </div>
          <div className="mb-8">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 tracking-widest uppercase">Custom</span>
            </div>
            <div className="text-[9px] text-black uppercase tracking-widest font-black mt-2 h-4">
              Annual contract · volume pricing
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-[1.5rem] p-6 mb-8 relative overflow-hidden group/cr">
             <div className="text-[9px] font-black text-black uppercase tracking-widest mb-4">Credits</div>
             <div className="flex items-baseline gap-2 mb-3">
               <span className="text-3xl font-black text-primary tracking-widest uppercase">Unlimited</span>
             </div>
             <p className="text-[10px] text-black leading-relaxed mb-6 font-medium">Unlimited. No credit tracking, no caps. Custom pricing.</p>
             <div className="h-1 bg-primary/20 rounded-full overflow-hidden">
               <div className="h-full bg-primary/60 w-full rounded-full" />
             </div>
          </div>

          <button onClick={() => navigate('/book-enterprise-demo')} className="w-full py-4 rounded-2xl border border-slate-200 text-slate-900 font-black uppercase tracking-widest text-[11px] hover:bg-slate-50 transition-all mb-10">
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
                 <span className="text-[12px] font-medium text-black">{f}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

        {/* BUY CREDITS SECTION - RESTORED */}
        <div className="py-24 max-w-[1550px] mx-auto px-10 relative z-10">
          <div className="bg-slate-900 rounded-[3rem] p-16 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-all duration-700"></div>
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-6 border border-primary/20">
                  <Zap className="w-3 h-3 fill-current" />
                  <span>Instant Credit Top-up</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Need more power?</h2>
                <p className="text-slate-300 text-lg font-medium leading-relaxed">
                  Purchase standalone credits to supplement your monthly allocation. Top-up credits never expire and roll over indefinitely.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 w-full lg:w-auto">
                {[
                  { amt: 50, price: 2 },
                  { amt: 150, price: 5, best: true },
                  { amt: 500, price: 14 },
                  { amt: 1000, price: 25 }
                ].map((item, i) => (
                  <button 
                    key={i}
                    onClick={() => openModal(item.amt, item.price)}
                    className={`p-8 rounded-[2.5rem] border transition-all text-center relative group/btn min-w-[180px] ${item.best ? 'bg-primary border-primary shadow-2xl shadow-primary/30 hover:scale-[1.05]' : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'}`}
                  >
                    {item.best && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-primary text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full whitespace-nowrap shadow-xl">Best Value</div>}
                    <div className="text-3xl font-black text-white mb-2">{item.amt}</div>
                    <div className={`text-[11px] font-black uppercase tracking-widest mb-4 ${item.best ? 'text-white/80' : 'text-slate-500'}`}>Credits</div>
                    <div className={`text-2xl font-black ${item.best ? 'text-white' : 'text-primary'}`}>${item.price}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CREDIT USAGE INFO section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[1550px] mx-auto mb-24 relative z-10"
        >
          <div className="bg-slate-50 border border-slate-200 rounded-[3rem] p-12 lg:p-16 relative overflow-hidden group hover:border-primary/20 transition-all duration-500 shadow-sm">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/10 transition-all" />
          
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-12">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/5">
                <Info className="w-7 h-7 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-1">How credits work</h3>
                <p className="text-xs text-black font-black uppercase tracking-widest">Start free. Scale as you grow.</p>
              </div>
            </div>
            <div className="px-6 py-3 bg-white border border-slate-200 rounded-full text-xs font-black tracking-widest text-black uppercase shadow-inner">
               Transparent usage: 1 action = 1–3 credits
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { label: 'AI Chat Response', val: '1', unit: 'credit' },
              { label: 'Document Analysis', val: '2', unit: 'credits' },
              { label: 'Document Draft', val: '3', unit: 'credits' },
              { label: 'Integration Query', val: '1', unit: 'credit' }
            ].map((item, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 text-center hover:bg-slate-50 transition-all group/item shadow-sm">
                <div className="text-[10px] font-black text-black uppercase tracking-[0.2em] mb-4 leading-tight min-h-[30px]">{item.label}</div>
                <div className="text-5xl font-black text-primary mb-2 tracking-tighter">{item.val}</div>
                <div className="text-[10px] font-black text-black uppercase tracking-widest">{item.unit}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { plan: 'Free', color: 'text-blue-400', bg: 'bg-blue-400/5', border: 'border-blue-400/10', text: '5 credits/day. Resets at midnight UTC. Each day starts fresh.' },
               { plan: 'Personal', color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/10', text: '500 credits/month. No daily reset — use them any time.' },
               { plan: 'Teams', color: 'text-purple-400', bg: 'bg-purple-400/5', border: 'border-purple-400/10', text: '800 credits/seat, pooled across team members.' },
               { plan: 'Enterprise', color: 'text-green-400', bg: 'bg-green-400/5', border: 'border-green-400/10', text: 'Unlimited. No credit tracking, no caps. Custom pricing.' }
             ].map((r, i) => (
               <div key={i} className={`text-left rounded-[2rem] p-8 border ${r.bg} ${r.border} hover:scale-[1.02] transition-transform`}>
                 <div className={`text-[12px] font-black uppercase tracking-[0.15em] mb-4 ${r.color}`}>{r.plan}</div>
                 <p className="text-[13px] text-black leading-relaxed font-medium">{r.text}</p>
               </div>
             ))}
          </div>
        </div>
        </motion.div>

      {/* SUPPORTING EDUCATION SECTION (90% Rules) */}
      <div className="py-24 border-t border-slate-200 relative">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-6 border border-primary/20">
              <Heart className="w-3 h-3 fill-current" />
              <span>Supporting Education</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight mb-4 text-slate-900">We believe in empowering<br />the next generation</h2>
            <p className="text-black text-lg font-medium max-w-2xl mx-auto">
              The future of law depends on accessible tools. That's why we offer students and academic researchers massive discounts because breakthrough legal work shouldn't be limited by budget.
            </p>
          </div>

          <div className="bg-white rounded-[3rem] border border-slate-200 flex flex-col lg:flex-row overflow-hidden shadow-xl shadow-slate-200/50">
            {/* Left: Discounts List */}
            <div className="flex-1 p-12 lg:p-16 space-y-12">
               <div className="flex gap-8 group">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-md group-hover:shadow-primary/20">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black mb-2 text-slate-900 group-hover:text-primary transition-colors">90% Student Discount</h3>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">Full Personal features for just $1.50/month. Same powerful AI, same unlimited analysis, same 500 credits.</p>
                  </div>
               </div>

               <div className="flex gap-8 group">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 shadow-md group-hover:shadow-blue-500/20">
                    <School className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black mb-2 text-slate-900 group-hover:text-blue-500 transition-colors">50% Academic Institution</h3>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">Universities, research institutions, and legal clinics qualify for 50% off team plans.</p>
                  </div>
               </div>

               <div className="flex gap-8 group">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all duration-500 shadow-md group-hover:shadow-green-500/20">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black mb-2 text-slate-900 group-hover:text-green-500 transition-colors">Non-Profit Organizations</h3>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">Registered non-profits advancing justice receive 50% off all plans.</p>
                  </div>
               </div>
            </div>

            {/* Right: Verification Card */}
            <div className="lg:w-[440px] bg-slate-50 p-12 lg:p-16 flex flex-col justify-center border-l border-slate-200 relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />
              
              <div className="mb-8">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-gray-300 line-through text-2xl font-black">$15</span>
                  <span className="text-6xl font-black text-primary">$1.50</span>
                  <span className="text-gray-500 font-bold uppercase tracking-widest text-[11px]">/mo</span>
                </div>
                <p className="text-xs text-gray-500 font-black uppercase tracking-widest">Personal plan with student discount</p>
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
      <div className="py-24 px-10 max-w-[1550px] mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">Compare Plans</div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Detailed feature breakdown</h2>
          <p className="text-black font-black uppercase tracking-widest text-[10px]">Everything you need to make the right decision for your firm.</p>
        </div>

        <div className="overflow-x-auto rounded-[3rem] border border-slate-200 bg-white shadow-2xl pt-12">
          <table className="w-full border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-10 text-left text-[11px] font-black uppercase tracking-widest text-black w-1/4">Features</th>
                <th className="p-10 text-center text-[13px] font-black text-slate-900">Free</th>
                <th className="p-10 text-center text-[13px] font-black text-primary bg-primary/5 border-x border-slate-200 relative">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg shadow-primary/20">Most Popular</div>
                   Personal
                </th>
                <th className="p-10 text-center text-[13px] font-black text-slate-900">Teams</th>
                <th className="p-10 text-center text-[13px] font-black text-slate-900">Enterprise</th>
              </tr>
            </thead>
            <tbody className="text-[13px] font-medium text-black">
              {/* CATEGORY: PRICING */}
              <tr className="bg-slate-50/50"><td colSpan={5} className="px-8 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-black">Pricing & Billing</td></tr>
              <tr className="border-b border-slate-100">
                <td className="p-6 ps-8 text-black font-black flex items-center gap-3"><CreditCard className="w-4 h-4 text-primary" /> Monthly price</td>
                <td className="p-6 text-center text-black font-bold">$0</td>
                <td className="p-6 text-center text-primary font-black bg-primary/5">$15/mo</td>
                <td className="p-6 text-center text-black font-bold">$15/seat/mo</td>
                <td className="p-6 text-center text-black font-bold">Custom</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-6 ps-8 text-black font-black flex items-center gap-3"><Heart className="w-4 h-4 text-primary" /> Annual price (Save 20%)</td>
                <td className="p-6 text-center">$0</td>
                <td className="p-6 text-center text-primary font-black bg-primary/5">$12/mo <span className="text-[10px] text-black font-bold block">($144/yr)</span></td>
                <td className="p-6 text-center">$12/seat/mo</td>
                <td className="p-6 text-center">Custom</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-6 ps-8 text-black font-black flex items-center gap-3"><GraduationCap className="w-4 h-4 text-primary" /> Student pricing</td>
                <td className="p-6 text-center">—</td>
                <td className="p-6 text-center text-primary font-black bg-primary/5">$1.50/mo <span className="text-[10px] text-black block">(90% off)</span></td>
                <td className="p-6 text-center">—</td>
                <td className="p-6 text-center">—</td>
              </tr>

              {/* CATEGORY: CREDITS */}
              <tr className="bg-slate-50/50"><td colSpan={5} className="px-8 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-black">Credits & Usage</td></tr>
              <tr className="border-b border-slate-100">
                <td className="p-6 ps-8 text-black font-black flex items-center gap-3"><Zap className="w-4 h-4 text-primary" /> Credit allocation</td>
                <td className="p-6 text-center text-primary font-bold">5 / day</td>
                <td className="p-6 text-center text-primary font-black bg-primary/5">500 / month</td>
                <td className="p-6 text-center text-primary font-bold">800 / seat / month</td>
                <td className="p-6 text-center text-primary font-bold">Unlimited</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-6 ps-8 text-black font-black flex items-center gap-3"><History className="w-4 h-4 text-primary" /> Reset behaviour</td>
                <td className="p-6 text-center">Midnight UTC</td>
                <td className="p-6 text-center bg-primary/5">Billing Cycle</td>
                <td className="p-6 text-center">Billing Cycle</td>
                <td className="p-6 text-center">No limits</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-6 ps-8 text-black font-black flex items-center gap-3"><Shield className="w-4 h-4 text-primary" /> Buy top-up credits</td>
                <td className="p-6 text-center flex justify-center"><Check className="text-primary w-4 h-4" strokeWidth={3} /></td>
                <td className="p-6 text-center bg-primary/5"><div className="flex justify-center"><Check className="text-primary w-4 h-4" strokeWidth={3} /></div></td>
                <td className="p-6 text-center flex justify-center"><Check className="text-primary w-4 h-4" strokeWidth={3} /></td>
                <td className="p-6 text-center">N/A</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-6 ps-8 text-black font-black flex items-center gap-3"><History className="w-4 h-4 text-primary" /> Top-up credits expire</td>
                <td className="p-6 text-center">Never</td>
                <td className="p-6 text-center bg-primary/5">Never</td>
                <td className="p-6 text-center">Never</td>
                <td className="p-6 text-center">N/A</td>
              </tr>

              {/* CATEGORY: STORAGE */}
              <tr className="bg-slate-50/50"><td colSpan={5} className="px-8 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-black">Workspace & Storage</td></tr>
              <tr className="border-b border-slate-100">
                <td className="p-6 ps-8 text-black font-black flex items-center gap-3"><Users className="w-4 h-4 text-primary" /> Matter workspaces</td>
                <td className="p-6 text-center">2 Active</td>
                <td className="p-6 text-center bg-primary/5">Unlimited</td>
                <td className="p-6 text-center">Unlimited</td>
                <td className="p-6 text-center">Unlimited</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-6 ps-8 text-black font-black flex items-center gap-3"><Server className="w-4 h-4 text-primary" /> Document Vault storage</td>
                <td className="p-6 text-center">500 MB</td>
                <td className="p-6 text-center bg-primary/5">5 GB</td>
                <td className="p-6 text-center">50 GB / seat</td>
                <td className="p-6 text-center">Custom</td>
              </tr>

              {/* CATEGORY: SECURITY */}
               <tr className="bg-slate-50/50"><td colSpan={5} className="px-8 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-black">Integrations & Security</td></tr>
               <tr className="border-b border-slate-100">
                <td className="p-6 ps-8 text-black font-black flex items-center gap-3"><Globe className="w-4 h-4 text-primary" /> Google Cal & Email</td>
                <td className="p-6 text-center">—</td>
                <td className="p-6 text-center bg-primary/5 flex justify-center"><Check className="text-primary w-4 h-4" strokeWidth={3} /></td>
                <td className="p-6 text-center flex justify-center"><Check className="text-black w-4 h-4" strokeWidth={3} /></td>
                <td className="p-6 text-center flex justify-center"><Check className="text-primary w-4 h-4" strokeWidth={3} /></td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-6 ps-8 text-black font-black flex items-center gap-3"><Lock className="w-4 h-4 text-primary" /> SSO & SAML 2.0</td>
                <td className="p-6 text-center">—</td>
                <td className="p-6 text-center bg-primary/5">—</td>
                <td className="p-6 text-center">—</td>
                <td className="p-6 text-center flex justify-center"><Check className="text-primary w-4 h-4" strokeWidth={3} /></td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-6 ps-8 text-black font-black flex items-center gap-3"><Building2 className="w-4 h-4 text-primary" /> On-premise deployment</td>
                <td className="p-6 text-center">—</td>
                <td className="p-6 text-center bg-primary/5">—</td>
                <td className="p-6 text-center">—</td>
                <td className="p-6 text-center flex justify-center"><Check className="text-primary w-4 h-4" strokeWidth={3} /></td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-slate-50/50">
                <td></td>
                <td className="p-8"><button onClick={onGetStarted} className="w-full py-3 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:bg-slate-100 transition-all">Get Started</button></td>
                <td className="p-8 bg-primary/5"><button onClick={onGetStarted} className="w-full py-3 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">Upgrade Now</button></td>
                <td className="p-8"><button onClick={onGetStarted} className="w-full py-3 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">Join Teams</button></td>
                <td className="p-8"><button onClick={() => navigate('/book-enterprise-demo')} className="w-full py-3 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:bg-slate-100 transition-all">Contact us</button></td>
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
              className="absolute inset-0 bg-white/80 backdrop-blur-xl" 
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white border border-slate-200 rounded-[2.5rem] w-[880px] max-w-full overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                     <CreditCard className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 mb-1">Buy credits</h2>
                    <p className="text-sm text-black font-medium">Choose an option to continue without interruption</p>
                  </div>
                </div>
                <button onClick={() => setModalOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="px-8 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Balance</div>
                <div className="text-2xl font-black text-slate-900">0 <span className="text-xs text-gray-400 font-bold uppercase tracking-widest ml-1">credits remaining</span></div>
              </div>

              <div className="flex flex-col md:flex-row flex-1">
                <div className="flex-1 p-8 border-r border-slate-100">
                  <div className="text-[10px] font-black text-black uppercase tracking-widest mb-6">Top Up Credits</div>
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
                        className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all ${selAmt === item.amt ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-200 bg-white hover:border-primary/40'}`}
                      >
                        <div className="flex items-center gap-4">
                           <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selAmt === item.amt ? 'border-primary bg-primary' : 'border-slate-200'}`}>
                             {selAmt === item.amt && <div className="w-2 h-2 rounded-full bg-white" />}
                           </div>
                           <div className="flex items-center gap-3">
                             <div className="text-lg font-black text-slate-900">{item.amt} <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">credits</span></div>
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

                <div className="flex-1 p-8 bg-slate-50">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Or Upgrade Your Plan</div>
                  <div className="space-y-4 mb-10">
                    <div 
                      onClick={() => handleSelectUpgrade('Personal', 15, 500)}
                      className="p-5 rounded-2xl border-2 border-primary bg-white cursor-pointer relative group transition-all"
                    >
                      <div className="absolute -top-3 right-6 bg-primary text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Recommended</div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-lg font-black text-slate-900">Personal</div>
                        <div className="text-lg font-black text-primary">$15<span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">/mo</span></div>
                      </div>
                      <div className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-3">500 credits/month · No daily reset</div>
                      <div className="text-[10px] text-gray-400 font-medium leading-relaxed">+ Integrations · AI Associates · 5GB · Priority support</div>
                    </div>

                    <div 
                      onClick={() => handleSelectUpgrade('Teams', 15, 800)}
                      className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-primary/40 cursor-pointer group transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-lg font-black text-slate-900">Teams</div>
                        <div className="text-lg font-black text-primary">$15<span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">/seat</span></div>
                      </div>
                      <div className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-3">800 credits/seat · Shared pool</div>
                      <div className="text-[10px] text-gray-400 font-medium leading-relaxed">+ RBAC · Unlimited Associates · 50GB · Custom workflows</div>
                    </div>

                    <div 
                      onClick={() => handleSelectUpgrade('Student', 1.5, 500)}
                      className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-primary/40 cursor-pointer group transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-lg font-black text-slate-900">Student</div>
                        <div className="text-lg font-black text-primary">$1.50<span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">/mo</span></div>
                      </div>
                      <div className="text-[11px] text-black font-bold uppercase tracking-widest mb-3">Personal plan · 90% student discount</div>
                      <div className="text-[10px] text-black font-medium leading-relaxed">Verify with .edu email · instant access</div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleSelectUpgrade('Personal', 15, 500)}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[12px] hover:bg-black transition-all flex items-center justify-center gap-3"
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white/80 backdrop-blur-3xl" />
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} 
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="relative bg-white border border-slate-200 rounded-[3rem] p-12 w-[420px] text-center shadow-2xl"
            >
               <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/10">
                 <Check className="w-10 h-10 text-green-500" strokeWidth={3} />
               </div>
               <h2 className="text-2xl font-black text-slate-900 mb-4">{successData.title}</h2>
               <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8">{successData.sub}</p>
               <div className="text-5xl font-black text-green-500 mb-2">{successData.added}</div>
               <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-10">credits added to your account</div>
               <button 
                onClick={() => setShowSuccess(false)}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[12px] hover:bg-black transition-all"
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
