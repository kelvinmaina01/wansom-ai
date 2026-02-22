
import React from 'react';
import { 
  Plus, 
  FolderOpen, 
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Users,
  Clock,
  Scale
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

const data = [
  { name: 'Mon', usage: 40, tokens: 2400 },
  { name: 'Tue', usage: 30, tokens: 1398 },
  { name: 'Wed', usage: 20, tokens: 9800 },
  { name: 'Thu', usage: 27, tokens: 3908 },
  { name: 'Fri', usage: 18, tokens: 4800 },
  { name: 'Sat', usage: 23, tokens: 3800 },
  { name: 'Sun', usage: 34, tokens: 4300 },
];

const Overview: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-white bg-dots p-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-black mb-4 tracking-tight">Welcome</h1>
          <p className="text-gray-500 text-lg font-medium">Organize your work and improve your performance with us here.</p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <ActionCard 
            icon={<Plus className="w-6 h-6 text-primary" />}
            title="Create New Project"
            description="Start a new project, upload files, and assign a Persona to streamline your workflow."
            buttonText="Create project"
            iconBg="bg-primary/10"
          />
          <ActionCard 
            icon={<FolderOpen className="w-6 h-6 text-white" />}
            title="Open Existing Project"
            description="Access and manage your saved projects, review files, and continue your work seamlessly."
            buttonText="View projects"
            iconBg="bg-black"
            isDark
          />
          <ActionCard 
            icon={<MessageSquare className="w-6 h-6 text-primary" />}
            title="Quick Q&A Only"
            description="Get instant AI-powered answers without creating a full project for simple inquiries."
            buttonText="Open Q&A"
            iconBg="bg-primary/10"
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-black/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-black">AI Usage Overview</h3>
              <select className="text-sm font-bold border border-gray-200 bg-white rounded-xl px-4 py-2 text-black focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F27D26" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#F27D26" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b', fontWeight: 600}} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="usage" stroke="#F27D26" strokeWidth={4} fillOpacity={1} fill="url(#colorUsage)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-black p-8 rounded-3xl shadow-xl shadow-black/20 text-white">
            <h3 className="text-xl font-bold mb-8">Quick Stats</h3>
            <div className="space-y-8">
              <StatItem icon={<TrendingUp className="w-5 h-5" />} label="Total Queries" value="1,284" change="+12.5%" isDark />
              <StatItem icon={<Users className="w-5 h-5" />} label="Active Projects" value="12" change="+2" isDark />
              <StatItem icon={<Clock className="w-5 h-5" />} label="Time Saved" value="48h" change="+5h" isDark />
              <StatItem icon={<Scale className="w-5 h-5" />} label="Statutes Indexed" value="450+" change="Updated" isDark />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionCard = ({ icon, title, description, buttonText, iconBg, isDark }: { icon: React.ReactNode, title: string, description: string, buttonText: string, iconBg: string, isDark?: boolean }) => (
  <div className={`flex flex-col p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-black/5 transition-all hover:shadow-2xl hover:-translate-y-1 bg-white`}>
    <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center mb-8 shadow-inner`}>
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-black mb-4 tracking-tight">{title}</h3>
    <p className="text-gray-500 text-base leading-relaxed mb-10 flex-1 font-medium">{description}</p>
    <button className={`flex items-center justify-center gap-2 py-4 px-8 rounded-2xl font-bold transition-all ${isDark ? 'bg-black text-white hover:bg-gray-900' : 'bg-white text-black border-2 border-black hover:bg-black hover:text-white'}`}>
      {buttonText}
      <ArrowRight className="w-5 h-5" />
    </button>
  </div>
);

const StatItem = ({ icon, label, value, change, isDark }: { icon: React.ReactNode, label: string, value: string, change: string, isDark?: boolean }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-2xl ${isDark ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-400'}`}>
        {icon}
      </div>
      <div>
        <p className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
        <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>{value}</p>
      </div>
    </div>
    <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${change.startsWith('+') ? (isDark ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary') : (isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600')}`}>
      {change}
    </span>
  </div>
);

export default Overview;
