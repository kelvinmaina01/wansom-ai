import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scale, ArrowLeft, ArrowRight, Check, Calendar, Clock,
  User, Building2, Mail, Users, ChevronLeft, ChevronRight,
  Sparkles, Shield, Globe, Zap, CheckCircle, Phone, MessageCircle, Info
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

// ── Helpers ──────────────────────────────────────────────────────────────────

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

// Available time slots (EAT / UTC+3)
const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '02:00 PM', '03:00 PM', '04:00 PM',
];

const TEAM_SIZES = [
  '1–5 lawyers', '6–20 lawyers', '21–50 lawyers',
  '51–100 lawyers', '100+ lawyers',
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

// ── Sub-components ────────────────────────────────────────────────────────────

const StepIndicator: React.FC<{ current: number }> = ({ current }) => {
  const steps = ['Choose a Day', 'Pick a Time', 'Your Details'];
  return (
    <div className="flex items-center gap-2 mb-10">
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = idx < current;
        const active = idx === current;
        return (
          <React.Fragment key={idx}>
            <div className={`flex items-center gap-2 transition-all duration-300`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all duration-300 ${
                done ? 'bg-primary border-primary text-white' :
                active ? 'border-primary text-primary bg-primary/10' :
                'border-slate-200 text-slate-300'
              }`}>
                {done ? <Check className="w-4 h-4" /> : idx}
              </div>
              <span className={`text-sm font-bold hidden sm:block transition-colors duration-300 ${
                active ? 'text-black' : done ? 'text-primary' : 'text-slate-300'
              }`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px transition-all duration-500 ${idx < current ? 'bg-primary' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

const EnterpriseBooking: React.FC = () => {
  const navigate = useNavigate();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [firmName, setFirmName] = useState('');
  const [email, setEmail] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [useCase, setUseCase] = useState('');

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const isWeekend = (day: number) => {
    const dow = new Date(currentYear, currentMonth, day).getDay();
    return dow === 0 || dow === 6;
  };

  const isPast = (day: number) => {
    const d = new Date(currentYear, currentMonth, day);
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < todayMidnight;
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    );
  };

  const handleDayClick = (day: number) => {
    if (isWeekend(day) || isPast(day)) return;
    setSelectedDate(new Date(currentYear, currentMonth, day));
    setSelectedTime('');
  };

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const handleSubmit = async () => {
    if (!fullName || !firmName || !email || !teamSize || !useCase) return;
    const finalTime = selectedTime === 'Custom' ? customTime : selectedTime;
    if (!finalTime) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('demo_requests').insert({
        full_name: fullName,
        firm_name: firmName,
        email,
        use_case: useCase,
        user_id: user?.id || null,
        // New fields
        demo_date: selectedDate?.toISOString().split('T')[0],
        demo_time: finalTime,
        team_size: teamSize,
        booking_type: 'enterprise',
      });
      if (error) throw error;
      setIsSuccess(true);
    } catch (err) {
      console.error('Booking error:', err);
      alert('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString('en-KE', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  // ── Success Screen ──
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #f1f5f9 1px, transparent 0)', backgroundSize: '40px 40px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-xl w-full text-center p-12 bg-white border border-slate-200 rounded-[3rem] shadow-2xl"
        >
          <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-8 shadow-xl">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Session Locked In</h1>
          <p className="text-black text-lg font-medium mb-2">
            Your enterprise strategy session is booked for
          </p>
          <p className="text-primary font-black text-2xl mb-2">{formattedDate}</p>
          <p className="text-black font-black text-xl mb-8">{selectedTime} EAT</p>
          <p className="text-black text-sm mb-10 font-medium">
            Our legal technology team will reach out to <span className="text-primary font-bold">{email}</span> to confirm the session and share a secure video link.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary-hover transition-all shadow-xl shadow-primary/20"
          >
            Back to Lawlify
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans overflow-x-hidden relative">
      {/* Nav */}
      <nav className="relative z-20 border-b border-slate-100 bg-white/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-black hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900">Lawlify</span>
            <span className="text-slate-200 font-light">|</span>
            <span className="text-sm font-bold text-black">Enterprise Session</span>
          </div>
          <div className="w-20" />
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-24">
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-24">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 leading-tight text-slate-900">
            Book Your Private<br />
            <span className="text-primary">Lawlify Demo</span>
          </h1>
          <p className="text-black text-xl font-medium max-w-2xl mx-auto">
            Get a live walkthrough tailored to your firm's workflow. Our legal AI consultants will show you exactly how Lawlify transforms your practice.
          </p>
        </div>

        <div className="space-y-12">
          {/* Info Cards Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-center">
              <h3 className="font-black text-slate-900 mb-6 text-xl">What's Included</h3>
              <div className="space-y-3">
                {[
                  { icon: Sparkles, label: '45-min live AI demonstration', color: 'text-primary' },
                  { icon: Shield, label: 'Security & compliance walkthrough', color: 'text-primary' },
                  { icon: Zap, label: 'Custom workflow mapping', color: 'text-primary' },
                  { icon: Globe, label: 'Jurisdiction-specific legal tools', color: 'text-primary' },
                  { icon: Users, label: 'Team onboarding roadmap', color: 'text-primary' },
                ].map(({ icon: Icon, label, color }, i) => (
                  <div key={i} className="flex items-center gap-3 text-[13px] font-bold text-black">
                    <Icon className={`w-4 h-4 shrink-0 ${color}`} strokeWidth={3} />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 mb-6">
                <Scale className="w-10 h-10 text-white" />
              </div>
              <div>
                <p className="font-black text-slate-900 text-xl mb-1">Hosted by</p>
                <p className="text-black text-sm font-bold">Lawlify Legal AI Team</p>
                <div className="mt-2 inline-block px-3 py-1 bg-primary/10 rounded-full">
                  <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">Enterprise Specialists</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-center">
               <div className="mb-6">
                  <h3 className="font-black text-slate-900 text-xl mb-1">Prefer to talk right now?</h3>
                  <p className="text-black text-sm font-medium">Speak directly with our Enterprise Team.</p>
               </div>
               <div className="flex flex-col gap-3">
                  <a href="tel:+254200000000" className="w-full h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center gap-3 text-black font-black uppercase text-[11px] tracking-widest hover:text-primary hover:border-primary transition-all shadow-sm">
                    <Phone className="w-4 h-4" />
                    Call Sales
                  </a>
                  <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer" className="w-full h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center gap-3 text-black font-black uppercase text-[11px] tracking-widest hover:text-[#25D366] hover:border-[#25D366] transition-all shadow-sm">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
               </div>
            </div>
          </div>

          <div className="w-full">
            <div className="p-10 rounded-2xl bg-white border border-slate-200 shadow-xl relative overflow-hidden">
              
              <StepIndicator current={step} />

              <AnimatePresence mode="wait">

                {/* ── Step 1: Calendar ── */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="max-w-4xl mx-auto"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <button onClick={prevMonth} className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
                        <ChevronLeft className="w-6 h-6 text-black" />
                      </button>
                      <h3 className="text-2xl font-black text-slate-900">
                        {MONTHS[currentMonth]} {currentYear}
                      </h3>
                      <button onClick={nextMonth} className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
                        <ChevronRight className="w-6 h-6 text-black" />
                      </button>
                    </div>

                    <div className="border border-slate-200 rounded-[2rem] overflow-hidden bg-white shadow-sm">
                      {/* Day headers */}
                      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
                        {DAYS_OF_WEEK.map(d => (
                          <div key={d} className="text-center text-[11px] font-black text-black uppercase tracking-widest py-4">
                            {d}
                          </div>
                        ))}
                      </div>

                      {/* Day grid */}
                      <div className="grid grid-cols-7">
                        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="bg-slate-50/30 border-r border-b border-slate-100 h-24" />)}

                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                          const unavailable = isWeekend(day) || isPast(day);
                          const selected = isSelected(day);

                          return (
                            <button
                              key={day}
                              onClick={() => handleDayClick(day)}
                              disabled={unavailable}
                              className={`
                                h-24 flex flex-col items-center justify-center text-lg font-bold transition-all relative
                                border-r border-b border-slate-100
                                ${selected
                                  ? 'bg-primary text-white shadow-inner z-10'
                                  : unavailable
                                    ? 'bg-white text-slate-400/20 cursor-not-allowed'
                                    : 'bg-white text-slate-900 hover:bg-primary/5 hover:text-primary cursor-pointer'
                                }
                              `}
                            >
                              <span>{day}</span>
                              {selected && (
                                <motion.div layoutId="select" className="absolute bottom-4 w-1.5 h-1.5 bg-white rounded-full" />
                              )}
                            </button>
                          );
                        })}
                        {Array.from({ length: (7 - ((firstDay + daysInMonth) % 7)) % 7 }).map((_, i) => <div key={`empty-end-${i}`} className="bg-white border-b border-slate-100 h-24" />)}
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-10">
                      <p className="text-sm text-black font-bold flex items-center gap-2">
                        <Info className="w-4 h-4 text-primary" />
                        Weekends unavailable · All times in East Africa Time (EAT)
                      </p>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!selectedDate}
                        onClick={() => setStep(2)}
                        className="px-12 py-5 bg-primary text-white font-black rounded-2xl disabled:opacity-30 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 text-sm uppercase tracking-widest"
                      >
                        Select Time
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 2: Time Slot ── */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="max-w-4xl mx-auto"
                  >
                    <div className="mb-10 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Confirmed Date</p>
                      <p className="text-3xl font-black text-slate-900">{formattedDate}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                      {TIME_SLOTS.map(slot => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`flex items-center justify-center gap-3 py-6 rounded-3xl border-2 font-black text-lg transition-all ${
                            selectedTime === slot
                              ? 'border-primary bg-primary/5 text-primary shadow-lg shadow-primary/10'
                              : 'border-slate-100 bg-white text-slate-900 hover:border-primary/30 hover:text-primary'
                          }`}
                        >
                          <Clock className="w-5 h-5" />
                          {slot}
                        </button>
                      ))}
                      <button
                        key="Custom"
                        onClick={() => setSelectedTime('Custom')}
                        className={`flex items-center justify-center gap-3 py-6 rounded-3xl border-2 font-black text-lg transition-all ${
                          selectedTime === 'Custom'
                            ? 'border-primary bg-primary/5 text-primary shadow-lg shadow-primary/10'
                            : 'border-slate-100 bg-white text-slate-900 hover:border-primary/30 hover:text-primary'
                        }`}
                      >
                        <Calendar className="w-5 h-5" />
                        Custom
                      </button>
                    </div>

                    {selectedTime === 'Custom' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                        <input 
                          type="text" 
                          placeholder="Suggest a time (e.g. 5:30 PM EAT)" 
                          value={customTime}
                          onChange={(e) => setCustomTime(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-3xl py-6 px-8 text-xl font-black text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary transition-all shadow-inner"
                        />
                      </motion.div>
                    )}

                    <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-100">
                      <button onClick={() => setStep(1)} className="font-black text-slate-400 hover:text-black transition-colors uppercase tracking-widest text-xs flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Change Date
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={selectedTime !== 'Custom' ? !selectedTime : !customTime}
                        onClick={() => setStep(3)}
                        className="px-12 py-5 bg-primary text-white font-black rounded-2xl disabled:opacity-30 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 text-sm uppercase tracking-widest"
                      >
                        Continue <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 3: Details ── */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="max-w-3xl mx-auto"
                  >
                    <div className="flex items-center justify-center gap-8 mb-12 p-6 bg-slate-50 border border-slate-100 rounded-[2rem]">
                       <div className="text-center">
                          <p className="text-[10px] font-black uppercase text-primary mb-1">Date</p>
                          <p className="font-black text-slate-900">{formattedDate}</p>
                       </div>
                       <div className="w-px h-10 bg-slate-200" />
                       <div className="text-center">
                          <p className="text-[10px] font-black uppercase text-primary mb-1">Time</p>
                          <p className="font-black text-slate-900">{selectedTime === 'Custom' ? customTime : selectedTime} EAT</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                      <input type="text" placeholder="Full name" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-6 font-bold text-slate-900 focus:outline-none focus:border-primary shadow-inner" />
                      <input type="text" placeholder="Firm name" value={firmName} onChange={e => setFirmName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-6 font-bold text-slate-900 focus:outline-none focus:border-primary shadow-inner" />
                      <input type="email" placeholder="Work email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-6 font-bold text-slate-900 focus:outline-none focus:border-primary shadow-inner" />
                      <select value={teamSize} onChange={e => setTeamSize(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-6 font-bold text-slate-900 focus:outline-none focus:border-primary shadow-inner appearance-none cursor-pointer">
                          <option value="" disabled>Team size</option>
                          {TEAM_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <textarea placeholder="Your primary use case..." value={useCase} onChange={e => setUseCase(e.target.value)} rows={3} className="md:col-span-2 w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-6 font-bold text-slate-900 focus:outline-none focus:border-primary shadow-inner resize-none" />
                    </div>

                    <div className="flex items-center justify-between">
                      <button onClick={() => setStep(2)} className="font-black text-slate-400 hover:text-black transition-colors uppercase tracking-widest text-xs">
                        Back to time
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!fullName || !firmName || !email || !teamSize || !useCase || isSubmitting}
                        onClick={handleSubmit}
                        className="px-16 py-6 bg-primary text-white font-black rounded-3xl disabled:opacity-40 hover:bg-primary-hover shadow-2xl shadow-primary/30 transition-all text-sm uppercase tracking-widest"
                      >
                        {isSubmitting ? 'Securing...' : 'Confirm Session'}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default EnterpriseBooking;
