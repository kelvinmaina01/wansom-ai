import React, { useState, useEffect } from 'react';
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
  History,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import CheckoutModal from './CheckoutModal';

interface PricingPageProps {
  onBack: () => void;
  onGetStarted: () => void;
}

const TypingText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[index]);
        setIndex(prev => prev + 1);
      }, 70); // Slightly faster than 100ms for a "snappy" feel
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setDisplayedText('');
        setIndex(0);
      }, 2500); // Hold the full message for 2.5s before restarting
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  return (
    <span className="relative inline-block min-h-[1.2em]">
      {displayedText}
      <motion.span 
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="inline-block ml-0.5 w-[2px] h-[0.9em] bg-primary align-middle"
      />
    </span>
  );
};

const PricingPage: React.FC<PricingPageProps> = ({ onBack, onGetStarted }) => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [isCheckout, setIsCheckout] = useState(false);
  const [selAmt, setSelAmt] = useState(150);
  const [selPrice, setSelPrice] = useState(5);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState({ title: '', sub: '', added: '' });

  // Paystack Checkout Modal state
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutPlanKey, setCheckoutPlanKey] = useState('');

  const navigate = useNavigate();

  const openCheckout = (amt?: number, price?: number) => {
    setSelAmt(amt || 150);
    setSelPrice(price || 5);
    setIsCheckout(true);
  };

  // Map credit amounts to plan keys for CheckoutModal
  const creditAmtToPlanKey = (amt: number): string => {
    if (amt <= 50) return 'topup_50';
    if (amt <= 150) return 'topup_150';
    if (amt <= 500) return 'topup_500';
    return 'topup_1000';
  };

  const handleBuyCredits = () => {
    setCheckoutPlanKey(creditAmtToPlanKey(selAmt));
    setCheckoutOpen(true);
  };

  const handleUpgrade = (plan: string, price: number, credits: number) => {
    setCheckoutPlanKey(plan.toLowerCase());
    setCheckoutOpen(true);
  };

  const handleSelectUpgrade = (plan: string, price: number, credits: number) => {
    handleUpgrade(plan, price, credits);
  };

  const handleCheckoutSuccess = (reference: string, credits: number) => {
    setSuccessData({
      title: 'Credits added!',
      sub: `Your ${credits.toLocaleString()} credits are ready to use.`,
      added: `+${credits.toLocaleString()}`
    });
    setShowSuccess(true);
    setCheckoutOpen(false);
    setIsCheckout(false);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary/30 overflow-x-hidden pb-24 relative">
      { !isCheckout && (
        <>
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
          <span className="text-primary text-3xl font-bold tracking-tight">
            <TypingText text="Start free. Scale as you grow." />
          </span>
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
      <div className="max-w-[1550px] mx-auto px-6 pt-20 pb-24 grid grid-cols-1 md:grid-cols-4 gap-12 items-start relative z-10">
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
        <div className="bg-white border-2 border-primary rounded-[2.5rem] p-8 shadow-xl shadow-primary/5 flex flex-col min-h-full relative overflow-visible">
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

          <button onClick={() => handleUpgrade('Personal', isAnnual ? 12 : 15, 500)} className="w-full py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all mb-10">
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

        {/* BUY CREDITS SECTION */}
        <div className="py-24 max-w-[1550px] mx-auto px-10 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Need more credits? Top up anytime.</h2>
            <p className="text-primary font-black text-lg uppercase tracking-widest text-sm">Works on any plan. Top-up credits are consumed first and never expire.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { amt: '50', price: '2', unit: '0.04', border: 'border-red-400' },
              { amt: '150', price: '5', unit: '0.033', best: true, border: 'border-orange-400' },
              { amt: '500', price: '14', unit: '0.028', border: 'border-slate-100' },
              { amt: '1,000', price: '25', unit: '0.025', border: 'border-slate-100' }
            ].map((item, i) => (
              <div key={i} className={`bg-white rounded-[2.5rem] p-6 flex flex-col items-center text-center relative shadow-sm border ${item.border} hover:shadow-xl transition-all duration-300`}>
                {item.best && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg">
                    Best value
                  </div>
                )}
                <div className="text-5xl font-black text-slate-900 mt-2 mb-2">{item.amt}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">CREDITS</div>
                
                <div className="mb-6">
                  <div className="text-3xl font-black text-primary mb-1">${item.price}</div>
                  <div className="text-[10px] font-medium text-slate-400 leading-tight">${item.unit} / credit</div>
                </div>

                <button 
                  onClick={() => { setCheckoutPlanKey(creditAmtToPlanKey(parseInt(item.amt.replace(',','')))); setCheckoutOpen(true); }}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200"
                >
                  Buy {item.amt} credits
                </button>
              </div>
            ))}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[1550px] mx-auto mb-24 relative z-10 px-6"
        >
          <div className="bg-white border-2 border-slate-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50 flex flex-col lg:flex-row min-h-[500px]">
            
            {/* Left Panel: Action Costs */}
            <div className="lg:w-[45%] bg-slate-900 p-12 lg:p-16 relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(239,68,68,0.15),transparent_50%)]" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-8 border border-primary/30">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Transparent Usage</span>
                </div>
                <h3 className="text-4xl font-black text-white mb-6 tracking-tight leading-tight">1 action = <br /><span className="text-primary tracking-tighter">1–3 credits</span></h3>
                <p className="text-white/60 text-sm font-medium leading-relaxed max-w-sm mb-12">
                  No hidden fees. Every automated legal action is weighted by complexity. You only pay for what you use.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'AI Chat', val: '1', icon: MessageSquare },
                    { label: 'Analysis', val: '2', icon: Shield },
                    { label: 'Drafting', val: '3', icon: Zap },
                    { label: 'Queries', val: '1', icon: Globe }
                  ].map((item, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group">
                      <div className="flex items-center justify-between mb-4">
                        <item.icon className="w-5 h-5 text-primary" />
                        <span className="text-2xl font-black text-white">{item.val}</span>
                      </div>
                      <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel: Plan Cycle Logic */}
            <div className="flex-1 p-12 lg:p-16 flex flex-col justify-center bg-white">
              <div className="text-[12px] font-black text-primary uppercase tracking-[0.2em] mb-12">Cycle & Reset Logic</div>
              
              <div className="space-y-10">
                {[
                  { plan: 'Free Plan', reset: 'Midnight UTC', text: 'Daily 5 credits reset. Each day starts fresh at 00:00 UTC.', border: 'border-blue-100', dot: 'bg-blue-400' },
                  { plan: 'Personal', reset: 'Monthly Cycle', text: '500 credits available instantly. No daily reset—use them as needed.', border: 'border-primary/20', dot: 'bg-primary' },
                  { plan: 'Teams', reset: 'Pooled Monthly', text: '800 credits/seat added to a shared team pool. Flexible firm-wide usage.', border: 'border-purple-100', dot: 'bg-purple-400' },
                  { plan: 'Enterprise', reset: 'Unlimited', text: 'Zero tracking. Zero caps. Dedicated high-performance lane.', border: 'border-green-100', dot: 'bg-green-400' }
                ].map((item, i) => (
                  <div key={i} className={`flex items-start gap-8 group`}>
                    <div className="w-1.5 h-16 rounded-full bg-slate-100 relative shrink-0 mt-1">
                      <div className={`absolute top-0 left-0 w-full h-full ${item.dot} opacity-0 group-hover:opacity-100 transition-opacity rounded-full`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{item.plan}</span>
                        <div className={`text-[9px] font-bold px-2 py-0.5 rounded ${item.dot} bg-opacity-10 text-slate-900 border border-slate-200`}>{item.reset}</div>
                      </div>
                      <p className="text-[14px] text-slate-500 font-medium leading-relaxed max-w-lg">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>

      {/* SUPPORTING EDUCATION SECTION (90% Rules) */}
      <div className="py-24 border-t border-slate-200 relative">
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
            <div className="lg:w-[440px] bg-white p-12 lg:p-16 flex flex-col justify-center border-l border-slate-200 relative">
              
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

        <div className="overflow-x-auto rounded-[3rem] border border-slate-200 bg-white shadow-2xl pt-20">
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
      </>
      )}

      {isCheckout && !showSuccess && (
        <div className="min-h-screen bg-white text-slate-900 pt-32 pb-24 relative">
          <div className="max-w-[1550px] mx-auto px-10">
            <div className="flex items-center justify-between mb-16">
              <button 
                onClick={() => setIsCheckout(false)} 
                className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-black hover:text-primary transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Pricing
              </button>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-primary" />
                 </div>
                 <div>
                   <h2 className="text-2xl font-black text-slate-900">Checkout</h2>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Complete your transaction</p>
                 </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-[3rem] p-10 mb-12 flex items-center justify-between shadow-sm">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                    <Shield className="w-5 h-5 text-primary" />
                 </div>
                 <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Balance</div>
                    <div className="text-xl font-black text-slate-900">0 credits remaining</div>
                 </div>
               </div>
               <div className="px-6 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-black shadow-sm">
                  Verified Secure Checkout
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               <div className="lg:col-span-7">
                  <div className="text-[10px] font-black text-black uppercase tracking-widest mb-8 flex items-center gap-3">
                    <Zap className="w-4 h-4 text-primary" />
                    Select Credit Package
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                    {[
                      { amt: 50, price: 2 },
                      { amt: 150, price: 5, best: true },
                      { amt: 500, price: 14 },
                      { amt: 1000, price: 25 }
                    ].map((item, i) => (
                      <div 
                        key={i} 
                        onClick={() => {setSelAmt(item.amt); setSelPrice(item.price)}}
                        className={`p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all relative ${selAmt === item.amt ? 'border-primary bg-primary/5 shadow-xl' : 'border-slate-100 bg-white hover:border-slate-300 shadow-sm'}`}
                      >
                        {item.best && <div className="absolute -top-3 left-8 bg-amber-400 text-black text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">Best Value</div>}
                        <div className="flex items-center justify-between mb-4">
                           <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selAmt === item.amt ? 'border-primary bg-primary' : 'border-slate-200'}`}>
                              {selAmt === item.amt && <div className="w-2 h-2 rounded-full bg-white" />}
                           </div>
                           <div className="text-2xl font-black text-primary">${item.price}</div>
                        </div>
                        <div className="text-4xl font-black text-slate-900 tracking-tight">{item.amt.toLocaleString()}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Credits</div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={handleBuyCredits}
                    className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-[13px] hover:bg-black transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-4"
                  >
                    <Shield className="w-5 h-5 text-primary" />
                    Buy {selAmt.toLocaleString()} credits — ${selPrice}
                  </button>
               </div>

               <div className="lg:col-span-5">
                  <div className="bg-slate-50 border border-slate-200 rounded-[3rem] p-10 h-full flex flex-col">
                    <div className="text-[10px] font-black text-black uppercase tracking-widest mb-8">Or Upgrade Your Plan</div>
                    <div className="space-y-4 mb-10 overflow-hidden">
                      {[
                        { plan: 'Personal', price: 15, sub: '500 credits/month · No daily reset', meta: 'Recommended' },
                        { plan: 'Teams', price: 15, sub: '800 credits/seat · Shared pool', meta: 'Best for Firms' },
                        { plan: 'Student', price: 1.5, sub: 'Personal plan · 90% discount', meta: 'Education' }
                      ].map((p, i) => (
                        <div 
                          key={i}
                          onClick={() => handleSelectUpgrade(p.plan, p.price, p.plan === 'Teams' ? 800 : 500)}
                          className="group bg-white border border-slate-200 rounded-[2rem] p-6 hover:border-primary transition-all cursor-pointer relative shadow-sm"
                        >
                          <div className="flex items-center justify-between mb-2">
                             <div className="text-xl font-black text-slate-900">{p.plan}</div>
                             <div className="text-xl font-black text-primary">${p.price}<span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1">{p.plan === 'Teams' ? '/seat' : '/mo'}</span></div>
                          </div>
                          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">{p.sub}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-auto pt-10 border-t border-slate-200">
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-8 italic">
                        "Upgrading provides a consistent monthly allocation and unlocks pro features like AI Associates, Matter Vault, and advanced integrations."
                      </p>
                      <button onClick={() => navigate('/book-enterprise-demo')} className="w-full py-5 border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-900 bg-white hover:bg-slate-50 transition-all shadow-sm">
                        Contact Enterprise Sales
                      </button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {showSuccess && (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 pb-24">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-xl w-full text-center p-12 bg-white border border-slate-200 rounded-[3rem] shadow-sm"
          >
            <div className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/10">
              <Check className="w-12 h-12 text-green-500" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">{successData.title}</h2>
            <p className="text-black text-lg font-medium leading-relaxed mb-8">{successData.sub}</p>
            <div className="text-6xl font-black text-primary mb-2 tracking-tighter">{successData.added}</div>
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-12">Credits updated successfully</div>
            
            <div className="space-y-4">
              <button 
                onClick={() => {setShowSuccess(false); setIsCheckout(false)}}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[13px] hover:bg-black transition-all shadow-xl shadow-slate-200"
              >
                Return to Dashboard →
              </button>
              <button 
                onClick={onBack}
                className="w-full py-4 bg-white text-slate-400 border border-slate-200 rounded-2xl font-bold uppercase tracking-widest text-[11px] hover:text-black hover:border-black transition-all"
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Paystack Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        planKey={checkoutPlanKey}
        userEmail=""
        userName=""
        onSuccess={handleCheckoutSuccess}
      />
    </div>
  );
};

export default PricingPage;

