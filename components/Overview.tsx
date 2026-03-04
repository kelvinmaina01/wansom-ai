
import React from 'react';
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
  AlertCircle,
  MoreHorizontal,
  PenTool,
  Briefcase,
  Play,
  Zap,
  Calendar,
  DollarSign,
  Sparkles,
  AlertTriangle,
  Gavel,
  Target
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Project, Activity } from '../types';

const data = [
  { name: 'Mon', usage: 40, tokens: 2400 },
  { name: 'Tue', usage: 30, tokens: 1398 },
  { name: 'Wed', usage: 20, tokens: 9800 },
  { name: 'Thu', usage: 27, tokens: 3908 },
  { name: 'Fri', usage: 18, tokens: 4800 },
  { name: 'Sat', usage: 23, tokens: 3800 },
  { name: 'Sun', usage: 34, tokens: 4300 },
];

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'M-Pesa Integration Contract',
    client: 'Safaricom PLC',
    status: 'In Progress',
    progress: 75,
    dueDate: new Date('2024-03-15'),
    type: 'Contract Review'
  },
  {
    id: '2',
    name: 'Land Dispute - Karen',
    client: 'Karen Residents Association',
    status: 'On Hold',
    progress: 30,
    dueDate: new Date('2024-04-01'),
    type: 'Litigation'
  },
  {
    id: '3',
    name: 'Employment Policy Update',
    client: 'Tech Solutions Ltd',
    status: 'Completed',
    progress: 100,
    dueDate: new Date('2024-02-28'),
    type: 'Advisory'
  }
];

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    user: 'You',
    action: 'drafted',
    target: 'NDA for Project Alpha',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    icon: 'FileText'
  },
  {
    id: '2',
    user: 'System',
    action: 'analyzed',
    target: 'Employment Act 2007',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    icon: 'Scale'
  },
  {
    id: '3',
    user: 'You',
    action: 'completed',
    target: 'Client Onboarding - John Doe',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    icon: 'CheckCircle'
  }
];

const MOCK_DEADLINES = [
  { id: '1', title: 'File Response Brief', case: 'M-Pesa Integration', date: new Date(Date.now() + 1000 * 60 * 60 * 18), urgency: 'critical' as const },
  { id: '2', title: 'Client Meeting — Karen', case: 'Land Dispute', date: new Date(Date.now() + 1000 * 60 * 60 * 48), urgency: 'warning' as const },
  { id: '3', title: 'Contract Review Deadline', case: 'Tech Solutions', date: new Date(Date.now() + 1000 * 60 * 60 * 96), urgency: 'normal' as const },
  { id: '4', title: 'Submit Court Documents', case: 'Employment Policy', date: new Date(Date.now() + 1000 * 60 * 60 * 168), urgency: 'normal' as const },
];

const Overview: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-white bg-dots p-8 no-scrollbar">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="text-left mb-12">
          <h1 className="text-6xl font-bold text-black mb-4 tracking-tighter">Welcome back, <span className="text-primary">Kelvin</span></h1>
          <p className="text-gray-400 text-lg font-medium">Here's what's happening with your <span className="text-primary font-bold">legal projects</span> today.</p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-12 justify-center">
          {[
            { label: 'Draft A Contract', icon: PenTool, bg: 'bg-red-50', text: 'text-red-600' },
            { label: 'Review Documents', icon: FileText, bg: 'bg-blue-50', text: 'text-blue-600' },
            { label: 'Prepare for A Case', icon: Briefcase, bg: 'bg-amber-50', text: 'text-amber-600' },
            { label: 'Start A Project', icon: Plus, bg: 'bg-green-50', text: 'text-green-600' },
            { label: 'Start A Workflow', icon: Zap, bg: 'bg-purple-50', text: 'text-purple-600' },
          ].map((action) => (
            <button key={action.label} className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
              <div className={`p-1.5 ${action.bg} rounded-lg ${action.text}`}>
                <action.icon className="w-4 h-4" />
              </div>
              {action.label}
            </button>
          ))}
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Card 1: Create New Project */}
          <div className="relative overflow-hidden p-8 rounded-[2.5rem] shadow-xl bg-blue-600/90 backdrop-blur-xl text-white group hover:scale-[1.02] transition-transform duration-300 border border-white/10">
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/15 rounded-full blur-[80px] group-hover:bg-white/25 transition-colors"></div>
            <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-blue-400/30 rounded-full blur-[60px]"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-xl shadow-inner border border-white/20">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tighter">Create New Project</h3>
              <p className="text-blue-100 text-base leading-relaxed mb-10 font-medium">
                Start a new project, upload files, and assign a Persona to streamline your workflow.
              </p>
              <button className="flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm text-blue-600 rounded-xl font-bold hover:bg-white transition-colors shadow-lg shadow-black/10">
                Create project
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Open Existing Project */}
          <div className="relative overflow-hidden p-8 rounded-[2.5rem] shadow-xl bg-purple-600/90 backdrop-blur-xl text-white group hover:scale-[1.02] transition-transform duration-300 border border-white/10">
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/15 rounded-full blur-[80px] group-hover:bg-white/25 transition-colors"></div>
            <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-purple-400/30 rounded-full blur-[60px]"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-xl shadow-inner border border-white/20">
                <FolderOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tighter">Open Existing Project</h3>
              <p className="text-purple-100 text-base leading-relaxed mb-10 font-medium">
                Access and manage your saved projects, review files, and continue your work seamlessly.
              </p>
              <button className="flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm text-purple-600 rounded-xl font-bold hover:bg-white transition-colors shadow-lg shadow-black/10">
                View projects
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 3: Quick Q&A Only */}
          <div className="relative overflow-hidden p-8 rounded-[2.5rem] shadow-xl bg-orange-500/90 backdrop-blur-xl text-white group hover:scale-[1.02] transition-transform duration-300 border border-white/10">
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/15 rounded-full blur-[80px] group-hover:bg-white/25 transition-colors"></div>
            <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-orange-300/30 rounded-full blur-[60px]"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-xl shadow-inner border border-white/20">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tighter">Quick Q&A Only</h3>
              <p className="text-orange-100 text-base leading-relaxed mb-10 font-medium">
                Get instant AI-powered answers without creating a full project for simple inquiries.
              </p>
              <button className="flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm text-orange-600 rounded-xl font-bold hover:bg-white transition-colors shadow-lg shadow-black/10">
                Open Q&A
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-black/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-semibold text-black">AI Usage Overview</h3>
              <select className="text-sm font-medium border border-gray-200 bg-white rounded-xl px-4 py-2 text-black focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b', fontWeight: 600}} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="usage" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorUsage)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-black p-8 rounded-3xl shadow-xl shadow-black/20 text-white">
            <h3 className="text-xl font-semibold mb-8">Quick Stats</h3>
            <div className="space-y-8">
              <StatItem icon={<TrendingUp className="w-5 h-5" />} label="Total Queries" value="1,284" change="+12.5%" isDark color="red" />
              <StatItem icon={<Users className="w-5 h-5" />} label="Active Projects" value="12" change="+2" isDark color="green" />
              <StatItem icon={<Clock className="w-5 h-5" />} label="Time Saved" value="48h" change="+5h" isDark color="blue" />
              <StatItem icon={<Scale className="w-5 h-5" />} label="Statutes Indexed" value="450+" change="Updated" isDark color="red" />
            </div>
          </div>
        </div>

        {/* Alerts Banner */}
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-4">
          <div className="p-2 bg-amber-100 rounded-xl text-amber-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-900">2 deadlines approaching</p>
            <p className="text-xs text-amber-700 font-medium">File Response Brief is due in 18 hours • Client Meeting in 2 days</p>
          </div>
          <button className="text-xs font-bold text-amber-700 hover:text-amber-900 px-3 py-1.5 bg-amber-100 rounded-lg transition-colors shrink-0">View All</button>
        </div>

        {/* Billing & AI Credits Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

          {/* Billing Snapshot */}
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
                  <p className="text-3xl font-bold tracking-tight">$8,470</p>
                  <span className="text-sm font-bold text-green-400 bg-green-500/15 px-3 py-1.5 rounded-lg">+18.2%</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-white/5 rounded-2xl">
                  <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">Billable Hours</p>
                  <p className="text-2xl font-bold tracking-tight">142h</p>
                  <p className="text-xs text-gray-500 font-medium mt-1">of 180h target</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl">
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Outstanding</p>
                  <p className="text-2xl font-bold tracking-tight">$2,150</p>
                  <p className="text-xs text-gray-500 font-medium mt-1">3 invoices pending</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Credits / Usage */}
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
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#60a5fa" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 34 * 0.72} ${2 * Math.PI * 34 * 0.28}`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">72%</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight">7,200</p>
                <p className="text-sm text-gray-400 font-medium">of 10,000 credits used</p>
                <p className="text-xs text-gray-500 mt-1">Resets in 18 days</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-white/5 rounded-2xl text-center">
                <p className="text-2xl font-bold text-amber-400">284</p>
                <p className="text-xs text-gray-500 font-medium mt-1">Queries</p>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl text-center">
                <p className="text-2xl font-bold text-emerald-400">47</p>
                <p className="text-xs text-gray-500 font-medium mt-1">Documents</p>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl text-center">
                <p className="text-2xl font-bold text-sky-400">12</p>
                <p className="text-xs text-gray-500 font-medium mt-1">Drafts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects and Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Projects */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-black/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-semibold text-black">Active Projects</h3>
              <button className="text-sm font-bold text-primary hover:text-primary-hover transition-colors">View All</button>
            </div>
            <div className="space-y-6">
              {MOCK_PROJECTS.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      project.status === 'Completed' ? 'bg-green-100 text-green-600' :
                      project.status === 'On Hold' ? 'bg-amber-100 text-amber-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <FolderOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-black group-hover:text-primary transition-colors">{project.name}</h4>
                      <p className="text-xs text-gray-500 font-medium">{project.client} • {project.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Due Date</p>
                      <p className="text-sm font-bold text-black">{project.dueDate.toLocaleDateString()}</p>
                    </div>
                    <div className="w-24 hidden sm:block">
                      <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            project.status === 'Completed' ? 'bg-green-500' :
                            project.status === 'On Hold' ? 'bg-amber-500' :
                            'bg-blue-500'
                          }`} 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <button className="p-2 text-gray-300 hover:text-black transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-black/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-semibold text-black">Recent Activity</h3>
              <button className="text-sm font-bold text-gray-400 hover:text-black transition-colors">View All</button>
            </div>
            <div className="relative pl-4 border-l-2 border-gray-100 space-y-8">
              {MOCK_ACTIVITIES.map((activity) => (
                <div key={activity.id} className="relative">
                  <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                    activity.action === 'completed' ? 'bg-green-500' : 'bg-primary'
                  }`}></div>
                  <p className="text-xs text-gray-400 font-bold mb-1">
                    {activity.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-sm text-black leading-relaxed">
                    <span className="font-bold">{activity.user}</span> {activity.action} <span className="font-medium text-primary">{activity.target}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ icon, label, value, change, isDark, color = 'red' }: { icon: React.ReactNode, label: string, value: string, change: string, isDark?: boolean, color?: 'red' | 'green' | 'blue' }) => {
  const colorClasses = {
    red: isDark ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary',
    green: isDark ? 'bg-secondary-green/20 text-secondary-green' : 'bg-secondary-green/10 text-secondary-green',
    blue: isDark ? 'bg-secondary-blue/20 text-secondary-blue' : 'bg-secondary-blue/10 text-secondary-blue',
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${isDark ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-400'}`}>
          {icon}
        </div>
        <div>
          <p className={`text-[10px] font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'} mb-1`}>{label}</p>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'} tracking-tight`}>{value}</p>
        </div>
      </div>
      <span className={`text-xs font-medium px-3 py-1.5 rounded-xl ${change.startsWith('+') ? colorClasses[color] : (isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600')}`}>
        {change}
      </span>
    </div>
  );
};

export default Overview;
