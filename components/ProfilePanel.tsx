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
  LogOut,
  Zap,
  Sparkles,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { apiClient } from '../lib/apiClient';

interface ProfilePageProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenSupport: (category?: string) => void;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}



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

interface RawActivity {
  date: Date;
  points: number;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onClose, onOpenSettings, user }) => {
  const [profileData, setProfileData] = useState<any>(null);
  const [statsData, setStatsData] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [rawActivities, setRawActivities] = useState<RawActivity[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
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

        // Fetch Stats
        const statsRes = await apiClient.get('/api/dashboard/stats');
        if (statsRes.ok) {
          setStatsData(await statsRes.json());
        }

        // Fetch Recent Activity
        const actRes = await apiClient.get('/api/dashboard/activity');
        if (actRes.ok) {
          setRecentActivities(await actRes.json());
        }

        // Fetch Heatmap Data - compounding events (1 point per chat interaction, 5 points per case prepared)
        const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
        const [chatRes, caseRes] = await Promise.all([
          supabase.from('chat_histories').select('timestamp').eq('user_id', authUser.id).gte('timestamp', oneYearAgo),
          supabase.from('cases').select('created_at').eq('user_id', authUser.id).gte('created_at', oneYearAgo)
        ]);

        const rawEvents: RawActivity[] = [];
        if (chatRes.data) {
          chatRes.data.forEach(c => rawEvents.push({ date: new Date(c.timestamp), points: 1 }));
        }
        if (caseRes.data) {
          caseRes.data.forEach(c => rawEvents.push({ date: new Date(c.created_at), points: 5 }));
        }
        setRawActivities(rawEvents);

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

  const availableMonths = useMemo(() => {
    const months = [{ value: 'all', label: 'Last 12 Months' }];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        value: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleString('default', { month: 'short', year: 'numeric' })
      });
    }
    return months;
  }, []);

  const heatmapState = useMemo(() => {
    if (selectedMonth === 'all') {
      const weeksCount = 52;
      const mapData = Array.from({ length: weeksCount }, () => Array(7).fill(0));
      const now = new Date();
      let total = 0;
      
      rawActivities.forEach(item => {
        const diffTime = Math.abs(now.getTime() - item.date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 364) {
          const weekIndex = 51 - Math.floor(diffDays / 7);
          const dayIndex = item.date.getDay();
          if (weekIndex >= 0 && weekIndex < weeksCount) {
            mapData[weekIndex][dayIndex] += item.points;
            total += item.points;
          }
        }
      });
      
      let streak = 0;
      const flat = [...mapData].flat().reverse();
      for (const v of flat) {
        if (v > 0) streak++;
        else break;
      }

      for (let w = 0; w < weeksCount; w++) {
        for (let d = 0; d < 7; d++) {
          if (mapData[w][d] > 0) {
            if (mapData[w][d] <= 3) mapData[w][d] = 1;
            else if (mapData[w][d] <= 8) mapData[w][d] = 2;
            else if (mapData[w][d] <= 15) mapData[w][d] = 3;
            else mapData[w][d] = 4;
          }
        }
      }
      
      const labels: { label: string; col: number }[] = [];
      for (let w = 0; w < weeksCount; w++) {
        const weekDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (51 - w) * 7);
        if (weekDate.getDate() <= 7) {
          labels.push({ label: MONTHS[weekDate.getMonth()], col: w });
        }
      }

      return { mapData, total, streak, monthLabels: labels, weeksCount };
    } else {
      // Month-specific view filtering
      const [year, month] = selectedMonth.split('-').map(Number);
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const numDays = lastDay.getDate();
      const startDay = firstDay.getDay(); 
      const totalWeeks = Math.ceil((numDays + startDay) / 7);
      
      const mapData = Array.from({ length: totalWeeks }, () => Array(7).fill(-1));
      
      for (let i = 1; i <= numDays; i++) {
        const d = new Date(year, month, i);
        const wIdx = Math.floor((i + startDay - 1) / 7);
        mapData[wIdx][d.getDay()] = 0;
      }
      
      let total = 0;
      rawActivities.forEach(item => {
        if (item.date.getFullYear() === year && item.date.getMonth() === month) {
          const wIdx = Math.floor((item.date.getDate() + startDay - 1) / 7);
          if (mapData[wIdx] && mapData[wIdx][item.date.getDay()] !== -1) {
             mapData[wIdx][item.date.getDay()] += item.points;
             total += item.points;
          }
        }
      });
      
      let streak = 0;
      const flat = [...mapData].flat().filter(v => v !== -1).reverse();
      for (const v of flat) {
        if (v > 0) streak++;
        else break;
      }

      for (let w = 0; w < totalWeeks; w++) {
        for (let d = 0; d < 7; d++) {
          if (mapData[w][d] > 0) {
            if (mapData[w][d] <= 3) mapData[w][d] = 1;
            else if (mapData[w][d] <= 8) mapData[w][d] = 2;
            else if (mapData[w][d] <= 15) mapData[w][d] = 3;
            else mapData[w][d] = 4;
          }
        }
      }

      return { 
        mapData, 
        total, 
        streak, 
        monthLabels: [{ label: MONTHS[month], col: 0 }], 
        weeksCount: totalWeeks 
      };
    }
  }, [rawActivities, selectedMonth]);

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
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => onOpenSupport('Security')}
                className="px-5 py-2.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-red-500/20 group/vuln shadow-lg shadow-red-500/5"
              >
                <ShieldAlert className="w-3.5 h-3.5 group-hover/vuln:animate-pulse" />
                Report Vulnerability
              </button>
              <button
                onClick={onOpenSettings}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-white/10 shadow-lg"
              >
                <Settings className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            </div>
          </div>
          {/* Decorative */}
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 rounded-full blur-[80px] opacity-10 translate-y-1/2 -translate-x-1/4"></div>
        </div>

        {/* Credit Usage Card — Whispr Flow Inspired */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#fdfcf7] border border-[#f5f1e3] rounded-[2rem] p-8 mb-8 shadow-sm group hover:shadow-md transition-all"
        >
           <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center border border-[#ece7d6]">
                    <Zap className="w-5 h-5 text-purple-600 fill-purple-600" />
                 </div>
                 <div>
                    <h3 className="text-base font-black text-slate-800 tracking-tight">
                       {profileData?.billing_plan || 'Free'} <span className="text-slate-400 font-bold ml-1">Credits</span>
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Usage this period</p>
                 </div>
              </div>
              <div className="text-right">
                 <div className="text-[18px] font-black text-slate-800">
                    {((profileData?.credits_plan_allocation || 5) - (profileData?.credits_balance || 0)).toLocaleString()}
                    <span className="text-slate-300 mx-1">/</span>
                    <span className="text-slate-400 font-bold">{(profileData?.credits_plan_allocation || 5).toLocaleString()}</span>
                 </div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Credits consumed</p>
              </div>
           </div>

           {/* Purple Progress Bar */}
           <div className="relative w-full h-3 bg-white border border-[#ece7d6] rounded-full overflow-hidden mb-6 p-[2px]">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (((profileData?.credits_plan_allocation || 5) - (profileData?.credits_balance || 0)) / (profileData?.credits_plan_allocation || 5)) * 100)}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.3)]"
              />
           </div>

           <div className="flex items-center justify-between">
              <button 
                onClick={onOpenSettings}
                className="px-6 py-3 bg-slate-900 hover:bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2"
              >
                 Upgrade for local limits
                 <ChevronRight className="w-3 h-3 text-purple-400" />
              </button>
              <div className="text-[10px] font-bold text-slate-400 flex items-center gap-2">
                 <Sparkles className="w-3 h-3 text-amber-400" />
                 Limits reset Monthly · Midnight UTC
              </div>
           </div>
        </motion.div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
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
            <p className="text-sm font-bold text-black" title="Hardcoded as user_settings currently does not track Industry natively">Legal Services</p>
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
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { label: 'Research Sessions', value: statsData?.total_queries?.toString() || '0', icon: Scale, color: 'text-red-500', bg: 'bg-red-50' },
            { label: 'Documents Drafted', value: statsData?.drafts_created?.toString() || '0', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'AI Conversations', value: statsData?.total_queries?.toString() || '0', icon: MessageSquare, color: 'text-red-500', bg: 'bg-red-50' },
            { label: 'Cases Analyzed', value: statsData?.active_projects?.toString() || '0', icon: Gavel, color: 'text-amber-500', bg: 'bg-amber-50' }
          ].map(stat => (
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
                {heatmapState.total} points {selectedMonth === 'all' ? 'in the last year' : 'in selected month'} · {heatmapState.streak} day streak 🔥
              </p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
              >
                {availableMonths.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>

              <div className="flex items-center gap-1.5 border-l border-gray-200 pl-4">
                <span className="text-[9px] text-gray-400 font-semibold mr-1">Less</span>
                {CONTRIBUTION_COLORS.map((color, i) => (
                  <div key={i} className={`w-3 h-3 ${color} rounded-[3px]`} title={CONTRIBUTION_LABELS[i]} />
                ))}
                <span className="text-[9px] text-gray-400 font-semibold ml-1">More</span>
              </div>
            </div>
          </div>

          {/* Month labels */}
          <div className="relative ml-8 mb-1.5 h-4">
            {heatmapState.monthLabels.map((m: any) => (
              <span
                key={`${m.label}-${m.col}`}
                className="absolute text-[9px] text-gray-400 font-semibold"
                style={{ left: `${(m.col / heatmapState.weeksCount) * 100}%` }}
              >
                {m.label}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div className={`flex gap-[3px] overflow-x-auto overflow-y-hidden pb-1 custom-scrollbar ${selectedMonth !== 'all' ? 'pr-4' : ''}`}>
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] pr-1.5 shrink-0">
              {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, i) => (
                <div key={i} className="h-[12px] flex items-center">
                  <span className="text-[9px] text-gray-400 font-medium w-6">{day}</span>
                </div>
              ))}
            </div>
            {/* Contribution cells */}
            {heatmapState.mapData.map((week: number[], wi: number) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((level: number, di: number) => (
                  <div
                    key={`${wi}-${di}`}
                    className={`w-[12px] h-[12px] ${level === -1 ? 'bg-transparent' : CONTRIBUTION_COLORS[level]} rounded-[3px] transition-all hover:ring-2 hover:ring-red-300 cursor-pointer`}
                    title={level === -1 ? '' : CONTRIBUTION_LABELS[level]}
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
            {recentActivities && recentActivities.length > 0 ? (
              recentActivities.slice(0, 5).map((item, i) => {
                let displayDate = 'Just now';
                try {
                  const dateObj = new Date(item.created_at);
                  const diffMinutes = Math.floor((Date.now() - dateObj.getTime()) / 60000);
                  if (diffMinutes < 60) displayDate = `${diffMinutes} minutes ago`;
                  else if (diffMinutes < 1440) displayDate = `${Math.floor(diffMinutes/60)} hours ago`;
                  else displayDate = `${Math.floor(diffMinutes/1440)} days ago`;
                } catch(e) {}
                const colors = ['text-blue-500 bg-blue-50', 'text-red-500 bg-red-50', 'text-amber-500 bg-amber-50', 'text-emerald-500 bg-emerald-50'];
                const colorSet = colors[i % colors.length] || colors[0];
                const [color, bg] = colorSet.split(' ');
                
                return (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center shrink-0`}>
                      <FileText className={`w-4 h-4 ${color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-black">
                        You {item.action} <span className="font-medium">{item.target}</span>
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">{displayDate}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-sm text-gray-400 font-medium">
                No recent activities found.
              </div>
            )}
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
