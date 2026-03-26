import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scale, ArrowLeft, ArrowRight, Check, Calendar, Clock,
  User, Building2, Mail, Users, ChevronLeft, ChevronRight,
  Sparkles, Shield, Globe, Zap, CheckCircle, Phone, MessageCircle
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
                'border-white/20 text-white/30'
              }`}>
                {done ? <Check className="w-4 h-4" /> : idx}
              </div>
              <span className={`text-sm font-bold hidden sm:block transition-colors duration-300 ${
                active ? 'text-white' : done ? 'text-primary' : 'text-white/30'
              }`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px transition-all duration-500 ${idx < current ? 'bg-primary' : 'bg-white/10'}`} />
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
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-dots-dark pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-md w-full text-center"
        >
          <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/30">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-4">Session Locked In</h1>
          <p className="text-gray-400 text-lg font-medium mb-2">
            Your enterprise strategy session is booked for
          </p>
          <p className="text-primary font-black text-xl mb-2">{formattedDate}</p>
          <p className="text-white font-bold text-lg mb-8">{selectedTime} EAT</p>
          <p className="text-gray-500 text-sm mb-10">
            Our legal technology team will reach out to <span className="text-white font-bold">{email}</span> to confirm the session and share a secure video link.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
          >
            Back to Lawlify
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dots-dark pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[150px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-20 border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight">Lawlify</span>
            <span className="text-white/20 font-light">|</span>
            <span className="text-sm font-bold text-gray-400">Enterprise Session</span>
          </div>
          <div className="w-20" />
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-24">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 leading-tight">
            Book Your Private<br />
            <span className="text-primary">Lawlify Demo</span>
          </h1>
          <p className="text-gray-400 text-xl font-medium max-w-2xl mx-auto">
            Get a live walkthrough tailored to your firm's workflow. Our legal AI consultants will show you exactly how Lawlify transforms your practice.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Session Info */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
              <h3 className="font-black text-white mb-5 text-lg">What's Included</h3>
              <div className="space-y-4">
                {[
                  { icon: Sparkles, label: '45-min live AI demonstration', color: 'text-primary' },
                  { icon: Shield, label: 'Security & compliance walkthrough', color: 'text-blue-400' },
                  { icon: Zap, label: 'Custom workflow mapping', color: 'text-yellow-400' },
                  { icon: Globe, label: 'Jurisdiction-specific legal tools', color: 'text-green-400' },
                  { icon: Users, label: 'Team onboarding roadmap', color: 'text-purple-400' },
                ].map(({ icon: Icon, label, color }, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-medium text-gray-300">
                    <Icon className={`w-4 h-4 shrink-0 ${color}`} />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-primary/10 border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shrink-0">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-black text-white text-sm mb-1">Hosted by</p>
                  <p className="text-gray-300 text-sm font-medium">Lawlify Legal AI Team</p>
                  <p className="text-primary text-xs font-bold mt-1 uppercase tracking-widest">Enterprise Specialists</p>
                </div>
              </div>
            </div>

            {selectedDate && selectedTime && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-3xl bg-white/5 border border-white/10"
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Your Selection</p>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-white">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-white">{selectedTime} EAT</span>
                </div>
              </motion.div>
            )}

            {/* Alternative Contact */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="font-black text-white text-lg">Prefer to talk right now?</h3>
              <p className="text-gray-400 text-sm font-medium">Skip the calendar and speak directly with our Enterprise Team.</p>
              
              <a href="tel:+254200000000" className="flex items-center justify-center gap-3 w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10 shadow-lg shadow-black/20">
                <Phone className="w-5 h-5" />
                Call +254 200 000 000
              </a>
              
              <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] font-bold rounded-2xl transition-all border border-[#25D366]/20 shadow-lg shadow-[#25D366]/5">
                <MessageCircle className="w-5 h-5" />
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* Right: Booking Widget */}
          <div className="lg:col-span-2">
            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm">
              <StepIndicator current={step} />

              <AnimatePresence mode="wait">

                {/* ── Step 1: Calendar ── */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                        <ChevronLeft className="w-5 h-5 text-gray-400" />
                      </button>
                      <h3 className="text-lg font-black text-white">
                        {MONTHS[currentMonth]} {currentYear}
                      </h3>
                      <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>

                    {/* Day headers */}
                    <div className="grid grid-cols-7 border-b border-white/10 mb-0">
                      {DAYS_OF_WEEK.map(d => (
                        <div key={d} className="text-center text-[10px] font-black text-gray-500 uppercase tracking-widest py-3 border-r border-white/5 last:border-r-0">
                          {d}
                        </div>
                      ))}
                    </div>

                    {/* Day grid */}
                    <div className="grid grid-cols-7 bg-white/5 border border-white/10 rounded-b-xl overflow-hidden">
                      {/* Empty leading cells */}
                      {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="border-r border-b border-white/5 bg-black/40" />)}

                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                        const weekend = isWeekend(day);
                        const past = isPast(day);
                        const unavailable = weekend || past;
                        const selected = isSelected(day);

                        return (
                          <motion.button
                            key={day}
                            whileHover={!unavailable ? { scale: 1.05 } : {}}
                            whileTap={!unavailable ? { scale: 0.95 } : {}}
                            onClick={() => handleDayClick(day)}
                            disabled={unavailable}
                            className={`
                              aspect-square flex items-center justify-center text-sm font-bold transition-all duration-200
                              border-r border-b border-white/5 overflow-hidden
                              ${selected
                                ? 'bg-primary text-white shadow-lg shadow-primary/30 z-10 relative border-primary'
                                : unavailable
                                  ? 'bg-black/60 text-white/20 cursor-not-allowed'
                                  : 'bg-black/20 text-white hover:bg-primary/20 hover:text-primary cursor-pointer hover:z-10 relative hover:border-primary/50'
                              }
                            `}
                          >
                            {day}
                          </motion.button>
                        );
                      })}
                      {/* Empty trailing cells to complete grid */}
                      {Array.from({ length: (7 - ((firstDay + daysInMonth) % 7)) % 7 }).map((_, i) => <div key={`empty-end-${i}`} className="border-r border-b border-white/5 bg-black/40" />)}
                    </div>

                    <p className="text-center text-[11px] text-gray-500 font-medium mt-6">
                      Weekends unavailable · All times in East Africa Time (EAT)
                    </p>

                    <div className="flex justify-end mt-8">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!selectedDate}
                        onClick={() => setStep(2)}
                        className="flex items-center gap-2 px-8 py-4 bg-primary text-white font-black rounded-2xl disabled:opacity-30 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                      >
                        Select Time <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 2: Time Slot ── */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="mb-6">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Selected Date</p>
                      <p className="text-xl font-black text-white">{formattedDate}</p>
                    </div>

                    <h3 className="text-lg font-black text-white mb-6">Available Time Slots</h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                      {TIME_SLOTS.map(slot => (
                        <motion.button
                          key={slot}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setSelectedTime(slot)}
                          className={`flex items-center justify-center gap-2 py-4 rounded-2xl border-2 font-bold text-sm transition-all duration-200 ${
                            selectedTime === slot
                              ? 'border-primary bg-primary/20 text-primary shadow-lg shadow-primary/20'
                              : 'border-white/10 bg-white/5 text-gray-300 hover:border-primary/50 hover:text-white'
                          }`}
                        >
                          <Clock className="w-4 h-4" />
                          {slot}
                        </motion.button>
                      ))}
                      <motion.button
                        key="Custom"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedTime('Custom')}
                        className={`flex items-center justify-center gap-2 py-4 rounded-2xl border-2 font-bold text-sm transition-all duration-200 ${
                          selectedTime === 'Custom'
                            ? 'border-primary bg-primary/20 text-primary shadow-lg shadow-primary/20'
                            : 'border-white/10 bg-white/5 text-gray-300 hover:border-primary/50 hover:text-white'
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                        Suggest Custom
                      </motion.button>
                    </div>

                    <AnimatePresence>
                      {selectedTime === 'Custom' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="overflow-hidden mb-8 -mt-4 relative"
                        >
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 px-1">Preferred Time (EAT)</p>
                          <input 
                            type="text" 
                            placeholder="e.g. 05:30 PM or anytime after 2 PM" 
                            value={customTime}
                            onChange={(e) => setCustomTime(e.target.value)}
                            className="w-full bg-primary/5 border border-primary/30 rounded-2xl py-4 px-4 text-white placeholder-gray-500 font-semibold focus:outline-none focus:border-primary transition-colors focus:shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <p className="text-[11px] text-gray-500 font-medium mb-8 flex items-center gap-1">
                      <Globe className="w-3 h-3" /> East Africa Time (UTC +3) · 45-minute session
                    </p>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setStep(1)}
                        className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={selectedTime !== 'Custom' ? !selectedTime : !customTime}
                        onClick={() => setStep(3)}
                        className="flex items-center gap-2 px-8 py-4 bg-primary text-white font-black rounded-2xl disabled:opacity-30 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                      >
                        Your Details <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 3: Details Form ── */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="flex flex-wrap gap-4 mb-8 p-4 bg-primary/10 border border-primary/20 rounded-2xl">
                      <div className="flex items-center gap-2 text-sm font-bold text-primary">
                        <Calendar className="w-4 h-4" /> {formattedDate}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-primary">
                        <Clock className="w-4 h-4" /> {selectedTime === 'Custom' ? customTime : selectedTime} EAT
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      {/* Full Name */}
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="text"
                          placeholder="Your full name"
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 font-semibold focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>

                      {/* Firm Name */}
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="text"
                          placeholder="Law firm or organisation name"
                          value={firmName}
                          onChange={e => setFirmName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 font-semibold focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>

                      {/* Email */}
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="email"
                          placeholder="Work email address"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 font-semibold focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>

                      {/* Team Size */}
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        <select
                          value={teamSize}
                          onChange={e => setTeamSize(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-semibold focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
                          style={{ colorScheme: 'dark' }}
                        >
                          <option value="" disabled className="bg-black">Team size</option>
                          {TEAM_SIZES.map(s => (
                            <option key={s} value={s} className="bg-black">{s}</option>
                          ))}
                        </select>
                      </div>

                      {/* Use Case */}
                      <textarea
                        placeholder="Tell us briefly about your firm's legal workflow and what you'd like Lawlify to help with…"
                        value={useCase}
                        onChange={e => setUseCase(e.target.value)}
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white placeholder-gray-500 font-semibold focus:outline-none focus:border-primary/50 transition-colors resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setStep(2)}
                        className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!fullName || !firmName || !email || !teamSize || !useCase || isSubmitting}
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-8 py-4 bg-primary text-white font-black rounded-2xl disabled:opacity-40 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Securing Session...
                          </>
                        ) : (
                          <>
                            Confirm Session <Check className="w-4 h-4" />
                          </>
                        )}
                      </motion.button>
                    </div>

                    <p className="text-center text-[11px] text-gray-600 font-medium mt-6">
                      By booking, you agree to receive a confirmation email from our team. No spam, ever.
                    </p>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseBooking;
