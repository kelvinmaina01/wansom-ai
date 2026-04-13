import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Shield, CreditCard, ArrowLeft, ArrowRight, Check,
  Loader2, Lock, Mail, Phone, User, Smartphone,
  Building2, Clock, Copy, CheckCircle2, Zap, Scale
} from 'lucide-react';
import {
  usePaystackCheckout,
  type CheckoutStep,
  type PaymentMethod,
  type PlanConfig,
  type ContactForm,
  PLAN_CONFIGS
} from '../hooks/usePaystackCheckout';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planKey: string;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
  onSuccess?: (reference: string, credits: number) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen, onClose, planKey, userEmail, userName, userPhone, onSuccess
}) => {
  const checkout = usePaystackCheckout();
  const [copied, setCopied] = useState(false);
  const [mobileProvider, setMobileProvider] = useState('mpesa');
  const [bankTimer, setBankTimer] = useState(1799);

  const CURRENCIES = [
    { code: 'USD', symbol: '$', rate: 1 },
    { code: 'KES', symbol: 'KSh', rate: 130 },
    { code: 'NGN', symbol: '₦', rate: 1100 },
    { code: 'GHS', symbol: 'GH₵', rate: 12.5 },
    { code: 'ZAR', symbol: 'R', rate: 19 }
  ];

  const currentCurrency = CURRENCIES.find(c => c.code === checkout.currency) || CURRENCIES[0];
  const convertedAmount = ((checkout.plan?.amount || 0) * currentCurrency.rate);

  // Initialize when modal opens
  useEffect(() => {
    if (isOpen && planKey) {
      const nameParts = (userName || '').split(' ');
      checkout.openCheckout(planKey, {
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: userEmail || '',
        phone: userPhone || '',
      });
    }
    if (!isOpen) {
      checkout.reset();
    }
  }, [isOpen, planKey]);

  // Bank transfer countdown timer
  useEffect(() => {
    if (checkout.paymentMethod !== 'bank_transfer' || checkout.step !== 'payment') return;
    setBankTimer(1799);
    const interval = setInterval(() => {
      setBankTimer(prev => {
        if (prev <= 0) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [checkout.paymentMethod, checkout.step]);

  if (!isOpen) return null;

  const plan = checkout.plan;
  if (!plan) return null;

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const stepNum = checkout.step === 'contact' ? 1
    : checkout.step === 'payment' ? 2
    : checkout.step === 'processing' ? 3
    : checkout.step === 'success' ? 3
    : 1;

  const handleClose = () => {
    if (checkout.step === 'processing') return; // Don't close during processing
    onClose();
  };

  const handleSuccess = () => {
    if (onSuccess && plan) {
      onSuccess(checkout.reference, plan.credits);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.93, opacity: 0, y: 14 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.93, opacity: 0, y: 14 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-[96vw] md:w-[60vw] lg:w-[50vw] max-w-[1200px] max-h-[95vh] h-auto flex flex-col bg-white rounded-3xl overflow-y-auto shadow-2xl scrollbar-hide"
          style={{ boxShadow: '0 32px 80px rgba(0,0,0,.2), 0 0 0 1px rgba(0,0,0,.04)' }}
        >
          {/* ── HEADER ── */}
          <div className="bg-slate-900 px-6 md:px-10 pt-8 md:pt-10 pb-8 md:pb-10 relative overflow-hidden flex-shrink-0">
            <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-primary/12 pointer-events-none" />
            <div className="absolute -bottom-5 left-5 w-20 h-20 rounded-full bg-primary/6 pointer-events-none" />

            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tighter text-white">Lawlify AI</span>
              </div>
              <div className="text-[10px] font-black bg-white/10 border border-white/20 text-white/60 px-3 py-1 rounded-full tracking-wider uppercase mr-8">
                Secured by Paystack
              </div>
            </div>

            <div className="flex items-center justify-between relative z-10">
              <div>
                <div className="text-[12px] font-bold text-white/40 uppercase tracking-widest mb-1.5">You're purchasing</div>
                <div className="text-2xl font-black text-white mb-1.5">{plan.name}</div>
                <div className="text-[14px] text-white/50 font-medium">{plan.description}</div>
              </div>
              <div className="text-right">
                <div className="flex items-start gap-1 justify-end">
                  <span className="text-[12px] text-white/50 font-bold mt-1">{currentCurrency.symbol}</span>
                  <div className="text-3xl font-extrabold text-white">
                    {convertedAmount.toLocaleString(undefined, { minimumFractionDigits: currentCurrency.code === 'USD' ? 2 : 0, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="text-[13px] font-semibold text-white/40">{currentCurrency.code}</div>
                <div className="text-[11px] text-white/30 mt-0.5">
                  {plan.interval === 'one-time' ? 'one-time' : 'per month'}
                </div>
              </div>
            </div>
          </div>

          {/* Credits strip */}
          <div className="bg-primary/12 border-t border-primary/20 px-6 md:px-10 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
            <span className="text-[12.5px] text-slate-600 font-medium tracking-wide">
              <strong className="text-slate-900 font-extrabold">{plan.credits} {plan.creditsLabel}</strong> added to your account immediately after payment
            </span>
          </div>

          {/* ── STEP NAV ── */}
          {checkout.step !== 'success' && checkout.step !== 'failed' && (
            <div className="flex items-center gap-0 px-6 md:px-10 pt-6 border-b border-slate-100 flex-shrink-0 bg-white sticky top-0 z-10">
              {[
                { num: 1, label: 'Contact', step: 'contact' },
                { num: 2, label: 'Payment', step: 'payment' },
                { num: 3, label: 'Confirm', step: 'processing' },
              ].map((s, i) => (
                <React.Fragment key={s.num}>
                  {i > 0 && <div className="w-8 h-px bg-slate-200 mx-2.5 flex-shrink-0" />}
                  <div className={`flex items-center gap-2.5 pb-4 relative ${
                    s.num < stepNum ? 'text-green-500' : s.num === stepNum ? 'text-slate-900' : 'text-slate-300'
                  }`}>
                    <div className={`w-6 h-6 rounded-full text-[10px] font-extrabold flex items-center justify-center flex-shrink-0 ${
                      s.num < stepNum ? 'bg-green-500 text-white' : s.num === stepNum ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {s.num < stepNum ? <Check className="w-3 h-3" strokeWidth={3} /> : s.num}
                    </div>
                    <span className={`text-[12px] font-bold whitespace-nowrap ${
                      s.num === stepNum ? 'text-slate-900' : s.num < stepNum ? 'text-green-500' : 'text-slate-400'
                    }`}>{s.label}</span>
                    {s.num === stepNum && (
                      <motion.div layoutId="step-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}

          {/* ── BODY ── */}
          <div className="px-6 md:px-10 py-6 md:py-8 relative">
            <AnimatePresence mode="wait">

              {/* ═══ STEP 1: CONTACT ═══ */}
              {checkout.step === 'contact' && (
                <motion.div key="contact" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                      <label className="block text-[12px] font-black text-slate-800 uppercase tracking-wider mb-2">First name</label>
                      <input
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 outline-none focus:border-primary transition-colors placeholder:text-slate-400 font-medium"
                        value={checkout.contact.firstName}
                        onChange={e => checkout.updateContact('firstName', e.target.value)}
                        placeholder="Kelvin"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-black text-slate-800 uppercase tracking-wider mb-2">Last name</label>
                      <input
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 outline-none focus:border-primary transition-colors placeholder:text-slate-400 font-medium"
                        value={checkout.contact.lastName}
                        onChange={e => checkout.updateContact('lastName', e.target.value)}
                        placeholder="Gichinga"
                      />
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="flex items-center gap-2 text-[12px] font-black text-slate-800 uppercase tracking-wider mb-2">
                      <Mail className="w-3.5 h-3.5" /> Email address
                    </label>
                    <input
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 outline-none focus:border-primary transition-colors placeholder:text-slate-400 font-medium"
                      value={checkout.contact.email}
                      onChange={e => checkout.updateContact('email', e.target.value)}
                      placeholder="kelvin@lawlify.ai"
                      type="email"
                    />
                    <p className="text-[11px] font-bold text-slate-500 mt-2">Receipt and confirmation will be sent here</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="col-span-2">
                      <label className="block text-[12px] font-black text-slate-800 uppercase tracking-wider mb-2">Phone (optional)</label>
                      <input
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 outline-none focus:border-primary transition-colors placeholder:text-slate-400 font-medium"
                        value={checkout.contact.phone}
                        onChange={e => checkout.updateContact('phone', e.target.value)}
                        placeholder="+254 7XX XXX XXX"
                      />
                      <p className="text-[11px] font-bold text-slate-500 mt-2">Required for mobile money</p>
                    </div>
                    <div>
                      <label className="block text-[12px] font-black text-slate-800 uppercase tracking-wider mb-2">Currency</label>
                      <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-8 py-3.5 text-sm font-bold text-slate-900 outline-none focus:border-primary transition-colors cursor-pointer appearance-none"
                        value={checkout.currency}
                        onChange={e => checkout.setCurrency(e.target.value)}
                        style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '.75rem auto' }}
                      >
                        {CURRENCIES.map(c => (
                          <option key={c.code} value={c.code}>{c.code}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 text-[12px] font-medium text-slate-400 mb-6">
                    <Shield className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Your information is encrypted and never stored on Lawlify servers.
                  </div>

                  <button
                    onClick={() => checkout.setStep('payment')}
                    disabled={!checkout.contact.email}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed group shadow-lg shadow-slate-900/10"
                  >
                    Continue to Payment
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}

              {/* ═══ STEP 2: PAYMENT ═══ */}
              {checkout.step === 'payment' && (
                <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <button
                    onClick={() => checkout.setStep('contact')}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-6 hover:text-slate-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to contact details
                  </button>

                  {/* Payment method tabs */}
                  <div className="text-[12px] font-black text-slate-800 uppercase tracking-wider mb-3">Payment method</div>
                  <div className="flex gap-2 mb-6">
                    {([
                      { key: 'card' as PaymentMethod, icon: CreditCard, label: 'Card' },
                      { key: 'mobile_money' as PaymentMethod, icon: Smartphone, label: 'Mobile Money' },
                      { key: 'bank_transfer' as PaymentMethod, icon: Building2, label: 'Bank' },
                    ]).map(m => (
                      <button
                        key={m.key}
                        onClick={() => checkout.setPaymentMethod(m.key)}
                        className={`flex-1 py-3.5 rounded-xl text-[12px] font-extrabold flex items-center justify-center gap-2 border transition-all ${
                          checkout.paymentMethod === m.key
                            ? 'border-primary bg-primary/5 text-primary shadow-sm shadow-primary/10'
                            : 'border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700 bg-white'
                        }`}
                      >
                        <m.icon className="w-4 h-4" />
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {/* ── CARD FORM ── */}
                  {checkout.paymentMethod === 'card' && (
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-[12px] font-black text-slate-800 uppercase tracking-wider mb-2">Card number</label>
                        <div className="relative">
                          <input
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] font-medium text-slate-900 outline-none focus:border-primary font-mono tracking-widest placeholder:text-slate-400"
                            placeholder="0000  0000  0000  0000"
                            maxLength={22}
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1.5">
                            <div className="w-10 h-6 rounded bg-[#1a1f71] text-white text-[9px] font-black flex items-center justify-center tracking-widest">VISA</div>
                            <div className="w-9 h-6 relative flex items-center justify-center">
                              <div className="w-5 h-5 rounded-full bg-[#eb001b] absolute left-0 mix-blend-multiply opacity-90" />
                              <div className="w-5 h-5 rounded-full bg-[#f79e1b] absolute right-0 mix-blend-multiply opacity-90" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[12px] font-black text-slate-800 uppercase tracking-wider mb-2">Expiry date</label>
                          <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 outline-none focus:border-primary placeholder:text-slate-400" placeholder="MM / YY" maxLength={7} />
                        </div>
                        <div>
                          <label className="block text-[12px] font-black text-slate-800 uppercase tracking-wider mb-2">CVV</label>
                          <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 outline-none focus:border-primary placeholder:text-slate-400" placeholder="•••" type="password" maxLength={4} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[12px] font-black text-slate-800 uppercase tracking-wider mb-2">Cardholder name</label>
                        <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 outline-none focus:border-primary placeholder:text-slate-400 uppercase tracking-wide" placeholder="As it appears on card" />
                      </div>
                    </div>
                  )}

                  {/* ── MOBILE MONEY ── */}
                  {checkout.paymentMethod === 'mobile_money' && (
                    <div className="mb-6">
                      <div className="text-[12px] font-black text-slate-800 mb-3 uppercase tracking-wider">Select your provider</div>
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        {[
                          { key: 'mpesa', flag: '🇰🇪', name: 'M-Pesa', sub: 'Safaricom · Kenya', color: '#00a650' },
                          { key: 'mtn', flag: '🇺🇬', name: 'MTN Mobile Money', sub: 'MTN · Uganda', color: '#ff6600' },
                          { key: 'airtel', flag: '🇹🇿', name: 'Airtel Money', sub: 'Airtel · Tanzania/Uganda', color: '#0066cc' },
                        ].map(p => (
                          <button
                            key={p.key}
                            onClick={() => setMobileProvider(p.key)}
                            className={`w-full flex items-center gap-4 p-4 border rounded-xl transition-all text-left ${
                              mobileProvider === p.key
                                ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10'
                                : 'border-slate-200 hover:border-primary hover:bg-slate-50'
                            }`}
                          >
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white border border-slate-100 p-1 flex-shrink-0">
                              <img 
                                src={p.key === 'mpesa' ? "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_logo-01.svg/512px-M-PESA_logo-01.svg.png" : p.key === 'mtn' ? "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/MTN_Logo.svg/512px-MTN_Logo.svg.png" : "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Airtel_logo.svg/512px-Airtel_logo.svg.png"} 
                                alt={p.name} 
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-extrabold text-slate-900">{p.name}</div>
                              <div className="text-[11px] font-medium text-slate-500 mt-0.5">{p.sub}</div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              mobileProvider === p.key ? 'bg-primary border-primary' : 'border-slate-300'
                            }`}>
                              {mobileProvider === p.key && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="mb-4">
                        <label className="block text-[12px] font-black text-slate-800 uppercase tracking-wider mb-2">Mobile number</label>
                        <input
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] font-medium text-slate-900 outline-none focus:border-primary placeholder:text-slate-400"
                          value={checkout.contact.phone}
                          onChange={e => checkout.updateContact('phone', e.target.value)}
                          placeholder="+254 7XX XXX XXX"
                        />
                      </div>

                      <div className="flex gap-3 text-[12px] font-medium text-amber-800 bg-amber-50/80 border border-amber-200/50 rounded-xl p-4 leading-relaxed">
                        <Smartphone className="w-5 h-5 text-amber-500 flex-shrink-0" />
                        <div>You'll receive a push notification on your phone to approve the payment of <strong className="text-amber-900 font-extrabold">{currentCurrency.symbol}{convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>.</div>
                      </div>
                    </div>
                  )}

                  {/* ── BANK TRANSFER ── */}
                  {checkout.paymentMethod === 'bank_transfer' && (
                    <div className="mb-6">
                      <p className="text-[13px] text-slate-500 font-medium mb-4 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                        Transfer the exact amount to this dedicated account. Paystack detects your payment automatically.
                      </p>
                      <div className="bg-white border-2 border-slate-100 shadow-sm rounded-xl p-5 mb-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -mr-10 -mt-10" />
                        <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 relative z-10">Dedicated Virtual Account</div>
                        
                        <div className="space-y-3 relative z-10">
                          <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                            <span className="text-xs font-semibold text-slate-400">Bank</span>
                            <span className="text-sm font-extrabold text-slate-900">Wema Bank</span>
                          </div>
                          
                          <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                            <span className="text-xs font-semibold text-slate-400">Account name</span>
                            <span className="text-sm font-extrabold text-slate-900">Lawlify AI / {checkout.contact.firstName || 'User'}</span>
                          </div>
                          
                          <div className="pt-2">
                            <span className="text-xs font-semibold text-slate-400 block mb-1">Account number</span>
                            <div className="flex items-center justify-between">
                              <span className="text-3xl font-black text-slate-900 font-mono tracking-widest">0123456789</span>
                              <button
                                onClick={() => { navigator.clipboard.writeText('0123456789'); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                                className={`text-[11px] font-bold border-2 rounded-lg px-4 py-2 transition-all ${
                                  copied ? 'border-primary text-primary bg-primary/5' : 'border-slate-200 text-slate-600 hover:border-slate-400'
                                }`}
                              >
                                {copied ? '✓ Copied' : 'Copy'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-[13px] font-bold text-amber-600 bg-amber-50 py-3 rounded-lg border border-amber-100/50">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        This account expires in <strong className="mx-1 font-black">{formatTimer(bankTimer)}</strong> minutes
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 mb-6 space-y-3">
                    <div className="flex justify-between text-[13px]"><span className="text-slate-500 font-medium">Plan</span><span className="font-extrabold text-slate-900">{plan.name}</span></div>
                    <div className="flex justify-between text-[13px]"><span className="text-slate-500 font-medium">Credits</span><span className="font-extrabold text-slate-900">{plan.credits}/{plan.interval === 'one-time' ? 'one-time' : 'month'}</span></div>
                    <div className="flex justify-between text-[13px]"><span className="text-slate-500 font-medium">Billing</span><span className="font-extrabold text-slate-900">{plan.interval === 'one-time' ? 'One-time purchase' : 'Monthly · cancel anytime'}</span></div>
                    <div className="flex justify-between items-center text-[13px] border-t border-slate-200 pt-3 mt-2">
                      <span className="font-bold text-slate-600">Total today</span>
                      <span className="text-xl font-black text-slate-900">{currentCurrency.symbol}{convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currentCurrency.code}</span>
                    </div>
                  </div>

                  {/* Pay button */}
                  <button
                    onClick={() => checkout.initializePayment()}
                    className="w-full py-4 bg-primary text-white rounded-xl text-[15px] font-extrabold flex items-center justify-center gap-2 hover:bg-red-600 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5"
                  >
                    <Shield className="w-4 h-4" />
                    Pay {currentCurrency.symbol}{convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} securely
                  </button>
                </motion.div>
              )}

              {/* ═══ STEP 3: PROCESSING ═══ */}
              {checkout.step === 'processing' && (
                <motion.div key="processing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
                  <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-primary animate-spin mx-auto mb-6" />
                  <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
                    {checkout.processingSteps.find(s => s.status === 'loading')?.text || 'Processing payment'}…
                  </h3>
                  <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed max-w-sm mx-auto">
                    Please do not close this window. This usually takes 5–10 seconds.
                  </p>

                  <div className="space-y-3 relative z-10 max-w-sm mx-auto text-left">
                    {checkout.processingSteps.map(s => (
                      <div key={s.id} className="flex items-center gap-3.5 p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          s.status === 'done' ? 'bg-green-500/10 border border-green-500/20'
                          : s.status === 'loading' ? 'bg-blue-500/10 border border-blue-500/20'
                          : 'bg-white border-2 border-slate-200'
                        }`}>
                          {s.status === 'done' && <Check className="w-3.5 h-3.5 text-green-500" strokeWidth={3} />}
                          {s.status === 'loading' && <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />}
                          {s.status === 'pending' && <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
                        </div>
                        <span className={`text-[13px] font-bold ${
                          s.status === 'done' ? 'text-green-600' : 'text-slate-600'
                        }`}>{s.text}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ═══ STEP 4: SUCCESS ═══ */}
              {checkout.step === 'success' && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
                    className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </motion.div>

                  <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Payment successful!</h3>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6">
                    Your {plan.name} is now active. {plan.credits} {plan.creditsLabel} have been added to your account.
                  </p>

                  {/* Transaction reference */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Transaction reference</span>
                    <span className="font-mono text-sm font-bold text-slate-900">{checkout.reference || 'LWF-2026-XXXXX'}</span>
                  </div>

                  {/* Credits added card */}
                  <div className="bg-slate-900 rounded-2xl p-5 mb-8 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-2xl font-black text-green-400 mb-0.5">+{plan.credits} {plan.creditsLabel.split('/')[0]}</div>
                      <div className="text-xs font-semibold text-white/50">added to your account · ready to use now</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleSuccess}
                      className="flex-1 py-4 bg-primary text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors shadow-lg shadow-primary/20"
                    >
                      Continue to Lawlify →
                    </button>
                    <button
                      onClick={() => alert(`Receipt sent to ${checkout.contact.email}`)}
                      className="py-4 px-5 bg-white text-slate-700 border-2 border-slate-200 rounded-xl text-sm font-bold hover:border-slate-900 hover:text-slate-900 transition-all flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Email receipt
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ═══ FAILED STATE ═══ */}
              {checkout.step === 'failed' && (
                <motion.div key="failed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
                  <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center mx-auto mb-6">
                    <X className="w-10 h-10 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3">Payment failed</h3>
                  <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">{checkout.error || 'Something went wrong. Please try again.'}</p>
                  <button
                    onClick={() => checkout.setStep('payment')}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors"
                  >
                    Try again
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-2 px-10 pb-6 text-[11.5px] font-medium text-slate-400 bg-white relative z-10 pt-4 rounded-b-3xl">
            <Lock className="w-3.5 h-3.5 text-slate-300" />
            Powered by <strong className="mx-0.5 text-slate-600 font-extrabold">Paystack</strong> · 256-bit SSL encryption
          </div>

          {/* Close button (hidden during processing) */}
          {checkout.step !== 'processing' && (
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-2.5 text-white/40 hover:text-white transition-all rounded-full hover:bg-white/10 z-30"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CheckoutModal;
