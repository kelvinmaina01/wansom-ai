import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Building2,
  Mail,
  CreditCard,
  Scale,
  FileText,
  MessageSquare,
  Gavel,
  Users,
  Settings,
  Briefcase,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ProfilePageProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

// Generate deterministic mock contribution data for the past 52 weeks
const generateContributions = () => {
  const weeks = 52;
  const days = 7;
  const data: number[][] = [];
  let seed = 42;
  const random = () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return seed / 2147483647;
  };

  for (let w = 0; w < weeks; w++) {
    const week: number[] = [];
    for (let d = 0; d < days; d++) {
      const r = random();
      const isWeekday = d >= 1 && d <= 5;
      const baseChance = isWeekday ? 0.7 : 0.25;
      if (r < baseChance) {
        const intensity = random();
        if (intensity < 0.4) week.push(1);
        else if (intensity < 0.7) week.push(2);
        else if (intensity < 0.9) week.push(3);
        else week.push(4);
      } else {
        week.push(0);
      }
    }
    data.push(week);
  }
  return data;
};

const CONTRIBUTION_COLORS = [
  'bg-gray-100',       // 0: no activity
  'bg-red-200',        // 1: light
  'bg-red-400',        // 2: medium
  'bg-red-500',        // 3: high
  'bg-red-700',        // 4: very high
];

const CONTRIBUTION_LABELS = [
  'No activity',
  'Light: 1-2 actions',
  'Moderate: 3-5 actions',
  'Active: 6-10 actions',
  'Heavy: 11+ actions',
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ACTIVITY_STATS = [
  { label: 'Research Sessions', value: '247', icon: Scale, color: 'text-red-500', bg: 'bg-red-50' },
  { label: 'Documents Drafted', value: '89', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'AI Conversations', value: '412', icon: MessageSquare, color: 'text-red-500', bg: 'bg-red-50' },
  { label: 'Cases Analyzed', value: '56', icon: Gavel, color: 'text-amber-500', bg: 'bg-amber-50' },
];

const ProfilePage: React.FC<ProfilePageProps> = ({ onClose, onOpenSettings, user }) => {
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return;

        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();

        if (error) throw error;
        setProfileData(data);
      } catch (err) {
        console.error('Error fetching profile settings:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };
  const contributions = useMemo(() => generateContributions(), []);

  const totalContributions = useMemo(() => {
    return contributions.flat().filter(v => v > 0).length;
  }, [contributions]);

  const currentStreak = useMemo(() => {
    const flat = contributions.flat().reverse();
    let streak = 0;
    for (const v of flat) {
      if (v > 0) streak++;
      else break;
    }
    return streak;
  }, [contributions]);

  const monthLabels = useMemo(() => {
    const labels: { label: string; col: number }[] = [];
    const now = new Date();
    for (let w = 0; w < 52; w++) {
      const weekDate = new Date(now);
      weekDate.setDate(weekDate.getDate() - (51 - w) * 7);
      if (weekDate.getDate() <= 7) {
        labels.push({ label: MONTHS[weekDate.getMonth()], col: w });
      }
    }
    return labels;
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-white bg-dots p-8 h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Back Button */}
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back</span>
        </button>

        {/* Profile Header Card */}
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-[2rem] p-8 mb-8 relative overflow-hidden shadow-2xl shadow-black/20">
          <div className="relative z-10 flex items-center gap-6">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-2xl border-3 border-white/20 shadow-xl"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-3 border-gray-900 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white tracking-tight mb-1">{user.name}</h1>
              <p className="text-sm text-gray-400 font-medium mb-3">{user.email}</p>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-red-500/20 text-red-400 text-[10px] font-bold rounded-full uppercase tracking-wider border border-red-500/20">Pro Plan</span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full uppercase tracking-wider border border-emerald-500/20 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Active
                </span>
              </div>
            </div>
            <button
              onClick={onOpenSettings}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-white/10"
            >
              <Settings className="w-3.5 h-3.5" />
              Edit Profile
            </button>
          </div>
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 rounded-full blur-[80px] opacity-10 translate-y-1/2 -translate-x-1/4"></div>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-red-500" />
              </div>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Firm</p>
            <p className="text-sm font-bold text-black truncate">{profileData?.profile_firm_name || 'Personal'}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Industry</p>
            <p className="text-sm font-bold text-black">Legal Services</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-amber-500" />
              </div>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Phone</p>
            <p className="text-sm font-bold text-black truncate">{profileData?.profile_phone || '+254 --- ---'}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Plan</p>
            <p className="text-sm font-bold text-black uppercase">{profileData?.billing_plan || 'Free'}</p>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {ACTIVITY_STATS.map(stat => (
            <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-black tracking-tight mb-0.5">{stat.value}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Contribution Graph */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-black tracking-tight">Legal Activity</h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                {totalContributions} actions in the last year · {currentStreak} day streak 🔥
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-gray-400 font-semibold mr-1">Less</span>
              {CONTRIBUTION_COLORS.map((color, i) => (
                <div key={i} className={`w-3 h-3 ${color} rounded-[3px]`} title={CONTRIBUTION_LABELS[i]} />
              ))}
              <span className="text-[9px] text-gray-400 font-semibold ml-1">More</span>
            </div>
          </div>

          {/* Month labels */}
          <div className="relative ml-8 mb-1.5 h-4">
            {monthLabels.map(m => (
              <span
                key={`${m.label}-${m.col}`}
                className="absolute text-[9px] text-gray-400 font-semibold"
                style={{ left: `${(m.col / 52) * 100}%` }}
              >
                {m.label}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-[3px] overflow-hidden">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] pr-1.5 shrink-0">
              {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, i) => (
                <div key={i} className="h-[12px] flex items-center">
                  <span className="text-[9px] text-gray-400 font-medium w-6">{day}</span>
                </div>
              ))}
            </div>
            {/* Contribution cells */}
            {contributions.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((level, di) => (
                  <div
                    key={`${wi}-${di}`}
                    className={`w-[12px] h-[12px] ${CONTRIBUTION_COLORS[level]} rounded-[3px] transition-all hover:ring-2 hover:ring-red-300 cursor-pointer`}
                    title={CONTRIBUTION_LABELS[level]}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-black tracking-tight mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'Drafted a contract review memo', time: '2 hours ago', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
              { action: 'Research on Land Act amendments', time: '5 hours ago', icon: Scale, color: 'text-red-500', bg: 'bg-red-50' },
              { action: 'Consulted Compliance Agent on KYC', time: '1 day ago', icon: Users, color: 'text-amber-500', bg: 'bg-amber-50' },
              { action: 'Analyzed 3 High Court rulings', time: '2 days ago', icon: Gavel, color: 'text-red-500', bg: 'bg-red-50' },
              { action: 'Generated tax compliance report', time: '3 days ago', icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className={`w-9 h-9 ${item.bg} rounded-lg flex items-center justify-center shrink-0`}>
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-black">{item.action}</p>
                  <p className="text-[10px] text-gray-400 font-medium">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone / Global Actions */}
        <div className="mt-8 pt-8 border-t border-gray-100 flex justify-center">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-8 py-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-[1.5rem] font-bold text-sm transition-all shadow-lg active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            Sign Out of Lawlify AI
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
