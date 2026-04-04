
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  FolderOpen,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Users,
  Clock,
  Scale,
  FileText,
  CheckCircle,
  MoreHorizontal,
  PenTool,
  Briefcase,
  Zap,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { apiClient } from '../lib/apiClient';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LiveProject {
  id: string;
  title: string;
  client_name: string;
  case_type: string;
  status: string;
  created_at: string;
}

interface ActivityLog {
  id: string;
  action: string;
  target: string;
  icon: string;
  created_at: string;
}

interface UserStats {
  total_queries: number;
  active_projects: number;
  time_saved_hours: number;
  statutes_indexed: number;
  monthly_revenue: number;
  billable_hours: number;
  billable_target: number;
  outstanding_invoices: number;
  pending_invoices_count: number;
  ai_credits_used: number;
  ai_credits_total: number;
  docs_processed: number;
  drafts_created: number;
}

// ─── Default Stats ─────────────────────────────────────────────────────────────
const DEFAULT_STATS: UserStats = {
  total_queries: 0,
  active_projects: 0,
  time_saved_hours: 0,
  statutes_indexed: 450,
  monthly_revenue: 0,
  billable_hours: 0,
  billable_target: 180,
  outstanding_invoices: 0,
  pending_invoices_count: 0,
  ai_credits_used: 0,
  ai_credits_total: 10000,
  docs_processed: 0,
  drafts_created: 0,
};

// Static sparkline data until we collect real usage (built from weekly query count)
const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const Overview: React.FC = () => {
  const [userName, setUserName] = React.useState('Counsel');
  const [projects, setProjects] = React.useState<LiveProject[]>([]);
  const [activities, setActivities] = React.useState<ActivityLog[]>([]);
  const [stats, setStats] = React.useState<UserStats>(DEFAULT_STATS);
  const [chartData, setChartData] = React.useState<{ name: string; usage: number }[]>(
    WEEK_DAYS.map((d) => ({ name: d, usage: 0 }))
  );
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  const triggerPrompt = (prompt: string) => {
    navigate('/app/legal-ai', { state: { initialPrompt: prompt } });
  };

  // ─── Load all data ──────────────────────────────────────────────────────────
  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // 1. User info
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserName(
            user.user_metadata?.full_name?.split(' ')[0] ||
              user.email?.split('@')[0] ||
              'Counsel'
          );
        }

        // 2. Live Projects (most recent 5)
        const { data: casesData } = await supabase
          .from('cases')
          .select('id, title, client_name, case_type, status, created_at')
          .eq('user_id', user?.id || '')
          .order('created_at', { ascending: false })
          .limit(5);
        if (casesData) setProjects(casesData);

        // 3. Activity Logs from backend
        const actRes = await apiClient.get('/api/dashboard/activity');
        if (actRes.ok) {
          const actData = await actRes.json();
          setActivities(actData);
        }

        // 4. User Stats from backend
        const statsRes = await apiClient.get('/api/dashboard/stats');
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats({ ...DEFAULT_STATS, ...statsData });
        }

        // 5. Build chart data from chat_histories (count per weekday)
        const { data: chats } = await supabase
          .from('chat_histories')
          .select('timestamp')
          .eq('user_id', user?.id || '')
          .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        if (chats && chats.length > 0) {
          const counts: Record<string, number> = {};
          WEEK_DAYS.forEach((d) => (counts[d] = 0));
          chats.forEach((c) => {
            const day = new Date(c.timestamp).toLocaleDateString('en-US', { weekday: 'short' });
            if (counts[day] !== undefined) counts[day]++;
          });
          setChartData(WEEK_DAYS.map((d) => ({ name: d, usage: counts[d] })));
        }
      } catch (err) {
        console.error('[Overview] Load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const creditPct = Math.round((stats.ai_credits_used / stats.ai_credits_total) * 100) || 0;
  const billablePct = Math.round((stats.billable_hours / stats.billable_target) * 100) || 0;

  return (
    <div className="flex-1 overflow-y-auto bg-white bg-dots p-8 no-scrollbar">
      <div className="max-w-6xl mx-auto">

        {/* Welcome */}
        <div className="text-left mb-12">
          <h1 className="text-6xl font-bold text-black mb-4 tracking-tighter">
            Welcome back, <span className="text-primary">{userName}</span>
          </h1>
          <p className="text-gray-400 text-lg font-medium">
            Here's what's happening with your{' '}
            <span className="text-primary font-bold">legal projects</span> today.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-12 justify-center">
          {[
            { label: 'Start a project', icon: Plus, bg: 'bg-green-50', text: 'text-green-600', isNew: true, onClick: () => navigate('/app/projects/new') },
            { label: 'Draft A Contract', icon: PenTool, bg: 'bg-red-50', text: 'text-red-600', prompt: 'I need to draft a professional legal contract. Please guide me through choosing the right template, defining the parties, and outlining the core terms and conditions for a robust agreement.' },
            { label: 'Review Documents', icon: FileText, bg: 'bg-blue-50', text: 'text-blue-600', prompt: 'I have a legal document that needs a comprehensive review. Please help me analyze it for potential risks, hidden liabilities, and compliance with current statutory requirements.' },
            { label: 'Prepare for A Case', icon: Briefcase, bg: 'bg-amber-50', text: 'text-amber-600', prompt: 'I am preparing for a legal case. Please help me organize the facts, identify relevant precedents, and structure a powerful legal argument or case brief.' },
          ].map((action: any) => (
            <button
              key={action.label}
              onClick={() => action.prompt ? triggerPrompt(action.prompt) : action.onClick?.()}
              className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <div className={`p-1.5 ${action.bg} rounded-lg ${action.text}`}>
                <action.icon className="w-4 h-4" />
              </div>
              <span className="flex items-center gap-2">
                {action.label}
                {action.isNew && (
                  <span className="px-2 py-0.5 bg-[#ff5a5f] text-[8px] text-white font-black rounded-full uppercase tracking-widest shadow-sm">New</span>
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Hero Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { title: 'Create New Project', desc: 'Start a new project, upload files, and assign a Persona to streamline your workflow.', label: 'Create project', color: 'bg-blue-600/90', textColor: 'text-blue-600', icon: Plus, action: () => navigate('/app/projects/new') },
            { title: 'Open Existing Project', desc: 'Access and manage your saved projects, review files, and continue your work seamlessly.', label: 'View projects', color: 'bg-purple-600/90', textColor: 'text-purple-600', icon: FolderOpen, action: () => navigate('/app/cases') },
            { title: 'Quick Q&A Only', desc: 'Get instant AI-powered answers without creating a full project for simple inquiries.', label: 'Open Q&A', color: 'bg-orange-500/90', textColor: 'text-orange-600', icon: MessageSquare, action: () => triggerPrompt("I have a quick legal question. I don't need a full project right now, just focused AI guidance on a specific statutory or procedural inquiry.") },
          ].map((card) => (
            <div key={card.title} className={`relative overflow-hidden p-8 rounded-[2.5rem] shadow-xl ${card.color} backdrop-blur-xl text-white group hover:scale-[1.02] transition-transform duration-300 border border-white/10`}>
              <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/15 rounded-full blur-[80px] group-hover:bg-white/25 transition-colors" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-xl shadow-inner border border-white/20">
                  <card.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tighter">{card.title}</h3>
                <p className="text-white/80 text-base leading-relaxed mb-10 font-medium">{card.desc}</p>
                <button onClick={card.action} className={`flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm ${card.textColor} rounded-xl font-bold hover:bg-white transition-colors shadow-lg shadow-black/10`}>
                  {card.label}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* AI Usage Chart */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-black/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-semibold text-black">AI Usage — Last 7 Days</h3>
              <span className="text-xs font-bold text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl">
                {stats.total_queries} total queries
              </span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} dy={10} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 600 }} />
                  <Area type="monotone" dataKey="usage" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorUsage)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-black p-8 rounded-3xl shadow-xl shadow-black/20 text-white">
            <h3 className="text-xl font-semibold mb-8">Quick Stats</h3>
            <div className="space-y-8">
              <StatItem icon={<TrendingUp className="w-5 h-5" />} label="Total Queries" value={stats.total_queries.toLocaleString()} change={stats.total_queries > 0 ? `+${stats.total_queries}` : '0'} isDark color="red" />
              <StatItem icon={<Users className="w-5 h-5" />} label="Active Projects" value={stats.active_projects.toString()} change={stats.active_projects > 0 ? `${stats.active_projects} open` : 'None'} isDark color="green" />
              <StatItem icon={<Clock className="w-5 h-5" />} label="Time Saved" value={`${stats.time_saved_hours}h`} change={stats.time_saved_hours > 0 ? `+${stats.time_saved_hours}h` : 'N/A'} isDark color="blue" />
              <StatItem icon={<Scale className="w-5 h-5" />} label="Statutes Indexed" value={`${stats.statutes_indexed}+`} change="Updated" isDark color="red" />
            </div>
          </div>
        </div>

        {/* Billing & AI Credits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Billing */}
          <div className="bg-black p-8 rounded-3xl shadow-xl shadow-black/20 text-white">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/5 rounded-xl">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold">Billing</h3>
              </div>
              <span className="text-xs font-bold text-green-400 bg-green-500/15 px-3 py-1.5 rounded-lg">This Month</span>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl">
                <p className="text-xs font-bold text-green-400 uppercase tracking-wider mb-1">Revenue</p>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold tracking-tight">${stats.monthly_revenue.toLocaleString()}</p>
                  {stats.monthly_revenue > 0 && <span className="text-sm font-bold text-green-400 bg-green-500/15 px-3 py-1.5 rounded-lg">Active</span>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-white/5 rounded-2xl">
                  <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">Billable Hours</p>
                  <p className="text-2xl font-bold tracking-tight">{stats.billable_hours}h</p>
                  <p className="text-xs text-gray-500 font-medium mt-1">of {stats.billable_target}h target</p>
                  <div className="mt-2 h-1 bg-white/10 rounded-full">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${Math.min(billablePct, 100)}%` }} />
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl">
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Outstanding</p>
                  <p className="text-2xl font-bold tracking-tight">${stats.outstanding_invoices.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 font-medium mt-1">{stats.pending_invoices_count} invoices pending</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Credits */}
          <div className="bg-black p-8 rounded-3xl shadow-xl shadow-black/20 text-white">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/5 rounded-xl">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold">AI Credits</h3>
              </div>
              <span className="text-xs font-bold text-blue-400 bg-blue-500/15 px-3 py-1.5 rounded-lg">Pro Plan</span>
            </div>
            <div className="flex items-center gap-8 mb-8">
              <div className="relative w-24 h-24 shrink-0">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#60a5fa" strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 34 * (creditPct / 100)} ${2 * Math.PI * 34 * (1 - creditPct / 100)}`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">{creditPct}%</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight">{stats.ai_credits_used.toLocaleString()}</p>
                <p className="text-sm text-gray-400 font-medium">of {stats.ai_credits_total.toLocaleString()} credits used</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-white/5 rounded-2xl text-center">
                <p className="text-2xl font-bold text-amber-400">{stats.total_queries}</p>
                <p className="text-xs text-gray-500 font-medium mt-1">Queries</p>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl text-center">
                <p className="text-2xl font-bold text-emerald-400">{stats.docs_processed}</p>
                <p className="text-xs text-gray-500 font-medium mt-1">Documents</p>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl text-center">
                <p className="text-2xl font-bold text-sky-400">{stats.drafts_created}</p>
                <p className="text-xs text-gray-500 font-medium mt-1">Drafts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Projects */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-black/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-semibold text-black">Active Projects</h3>
              <button onClick={() => navigate('/app/cases')} className="text-sm font-bold text-primary hover:text-primary-hover transition-colors">View All</button>
            </div>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 rounded-2xl animate-pulse" />)}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center">
                <FolderOpen className="w-12 h-12 text-gray-200 mb-4" />
                <p className="text-gray-400 font-medium">No projects yet.</p>
                <button onClick={() => navigate('/app/projects/new')} className="mt-4 px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-primary transition-colors">Create First Project</button>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => navigate(`/app/projects/${project.id}`)}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        project.status === 'Completed' ? 'bg-green-100 text-green-600' :
                        project.status === 'On Hold' ? 'bg-amber-100 text-amber-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        <FolderOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-black group-hover:text-primary transition-colors">{project.title}</h4>
                        <p className="text-xs text-gray-500 font-medium">{project.client_name} • {project.case_type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        project.status === 'Completed' ? 'bg-green-100 text-green-600' :
                        project.status === 'On Hold' ? 'bg-amber-100 text-amber-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>{project.status}</span>
                      <button className="p-2 text-gray-300 hover:text-black transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Live Activity Log */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-black/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-semibold text-black">Recent Activity</h3>
            </div>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-10 bg-gray-50 rounded-xl animate-pulse" />)}
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-8 flex flex-col items-center">
                <CheckCircle className="w-10 h-10 text-gray-200 mb-3" />
                <p className="text-gray-400 text-sm font-medium">No activity yet.</p>
                <p className="text-gray-300 text-xs mt-1">Your actions will appear here.</p>
              </div>
            ) : (
              <div className="relative pl-4 border-l-2 border-gray-100 space-y-8">
                {activities.slice(0, 6).map((activity) => (
                  <div key={activity.id} className="relative cursor-pointer group" onClick={() => triggerPrompt(`Summarize: "${activity.action} ${activity.target}"`)}>
                    <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-125 ${activity.action === 'completed' ? 'bg-green-500' : 'bg-primary'}`} />
                    <p className="text-xs text-gray-400 font-bold mb-1">{new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="text-sm text-black leading-relaxed group-hover:text-primary transition-colors">
                      <span className="font-bold">You</span> {activity.action}{' '}
                      <span className="font-medium text-primary">{activity.target}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Stat Item ─────────────────────────────────────────────────────────────────
const StatItem = ({ icon, label, value, change, isDark, color = 'red' }: { icon: React.ReactNode; label: string; value: string; change: string; isDark?: boolean; color?: 'red' | 'green' | 'blue' }) => {
  const colorClasses = {
    red: isDark ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary',
    green: isDark ? 'bg-secondary-green/20 text-secondary-green' : 'bg-secondary-green/10 text-secondary-green',
    blue: isDark ? 'bg-secondary-blue/20 text-secondary-blue' : 'bg-secondary-blue/10 text-secondary-blue',
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${isDark ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-400'}`}>{icon}</div>
        <div>
          <p className={`text-[10px] font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'} mb-1`}>{label}</p>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'} tracking-tight`}>{value}</p>
        </div>
      </div>
      <span className={`text-xs font-medium px-3 py-1.5 rounded-xl ${change.startsWith('+') || change === 'Updated' ? colorClasses[color] : isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'}`}>
        {change}
      </span>
    </div>
  );
};

export default Overview;
