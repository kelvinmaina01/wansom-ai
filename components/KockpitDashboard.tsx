import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Users, Activity, DollarSign, Zap, Globe,
  ChevronLeft, ArrowUpRight, ShieldAlert, Cpu,
  Clock, Monitor, Compass, Briefcase, Server, Smartphone, Scale,
  LayoutDashboard, UserPlus, Settings, Search, MoreVertical,
  CheckCircle2, XCircle, Edit3, Trash2, Power,
  CreditCard, TrendingUp, Download, ToggleRight, Sliders, Mail, Database, Bell, Shield, Menu, Ban, RefreshCcw, FileText, HardDrive, FolderOpen, Gauge, Timer, BarChart3, PieChart as PieIcon, LineChart as LineIcon, Share2, Building2, MessageSquare, Check, Sparkles, Brain, Lightbulb, Target, AlertTriangle, ShieldCheck, ScanLine, Bug, Lock, Eye, CalendarDays
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { KnowledgeLab } from './KnowledgeLab';
import { KnowledgeIngest } from './KnowledgeIngest';

// === MOCK DATA ===

const userGrowthData = [
  { date: 'Mar 1', users: 120, revenue: 2400 },
  { date: 'Mar 2', users: 135, revenue: 2800 },
  { date: 'Mar 3', users: 160, revenue: 3500 },
  { date: 'Mar 4', users: 210, revenue: 4100 },
  { date: 'Mar 5', users: 280, revenue: 5200 },
  { date: 'Mar 6', users: 390, revenue: 7600 },
  { date: 'Mar 7', users: 512, revenue: 10200 },
];

const featureUsageData = [
  { name: 'Legal AI Chat', visits: 8400, tokens: 450000 },
  { name: 'Document Analysis', visits: 6200, tokens: 820000 },
  { name: 'Judicial Analytics', visits: 4100, tokens: 120000 },
  { name: 'Legal Specialists', visits: 3800, tokens: 290000 },
];

const geoData = [
  { name: 'Kenya', value: 45 },
  { name: 'Uganda', value: 20 },
  { name: 'Tanzania', value: 15 },
  { name: 'Rwanda', value: 10 },
  { name: 'Other', value: 10 },
];

const roleData = [
  { name: 'Law Firms', value: 40 },
  { name: 'Solo Advocates', value: 30 },
  { name: 'Law Students', value: 20 },
  { name: 'Corporate Legal', value: 10 },
];

const deviceData = [
  { name: 'Desktop', value: 72 },
  { name: 'Mobile', value: 25 },
  { name: 'Tablet', value: 3 },
];

const browserData = [
  { name: 'Chrome', value: 65 },
  { name: 'Safari', value: 20 },
  { name: 'Edge', value: 10 },
  { name: 'Firefox', value: 5 },
];

const osData = [
  { name: 'Windows', value: 55 },
  { name: 'macOS', value: 35 },
  { name: 'Linux', value: 5 },
  { name: 'iOS/Android', value: 5 },
];

const timeUsageData = Array.from({ length: 24 }).map((_, i) => ({
  time: `${i < 10 ? '0' + i : i}:00`,
  users: Math.max(10, Math.floor(Math.sin((i - 6) * Math.PI / 12) * 150 + 50) + Math.floor(Math.random() * 20))
}));

const payingVsFreeData = [
  { name: 'Paying', value: 35 },
  { name: 'Free Tier', value: 65 },
];

const subscriptionPlansData = [
  { name: 'Enterprise', value: 15 },
  { name: 'Premium', value: 30 },
  { name: 'Basic', value: 40 },
  { name: 'Student', value: 15 },
];

const billingLogs = [
  { id: 'inv_101', date: 'Mar 07, 2026', user: 'jane.doe@firm.co.ke', amount: '$4,500', plan: 'Enterprise Annual', status: 'paid' },
  { id: 'inv_102', date: 'Mar 06, 2026', user: 'david@ochiengholdings.com', amount: '$50', plan: 'Token Top-up', status: 'paid' },
  { id: 'inv_103', date: 'Mar 05, 2026', user: 'm.otieno@advocates.com', amount: '$150', plan: 'Premium Monthly', status: 'pending' },
  { id: 'inv_104', date: 'Mar 02, 2026', user: 'sarah.w@aln.africa', amount: '$12,000', plan: 'Enterprise Custom', status: 'paid' },
  { id: 'inv_105', date: 'Feb 28, 2026', user: 'peter.njoroge@gmail.com', amount: '$0', plan: 'Enterprise Trial', status: 'failed' },
];

// Diverse color palette incorporating Red, Blue, Green, Yellow, and Purple
const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

const storageData = [
  { name: 'Legal Documents', value: 45 },
  { name: 'Avatar & Media', value: 15 },
  { name: 'Chat History', value: 25 },
  { name: 'DB Backups', value: 10 },
  { name: 'System Logs', value: 5 },
];

const performanceData = [
  { time: '00:00', loadTime: 1.2 },
  { time: '04:00', loadTime: 1.4 },
  { time: '08:00', loadTime: 1.1 },
  { time: '12:00', loadTime: 1.5 },
  { time: '16:00', loadTime: 1.3 },
  { time: '20:00', loadTime: 1.2 },
  { time: '23:59', loadTime: 1.1 },
];

const mockUsersList = [
  { id: '1', name: 'James Kariuki', email: 'james.k@bowmanslaw.com', role: 'Firm Admin', country: 'Kenya', joined: '2026-01-12', plan: 'Enterprise', status: 'active', tokens: '1.2M' },
  { id: '2', name: 'Amina Hassan', email: 'ahassan@students.uon.ac.ke', role: 'Law Student', country: 'Kenya', joined: '2026-03-01', plan: 'Student', status: 'active', tokens: '45K' },
  { id: '3', name: 'David Ochieng', email: 'david@ochiengholdings.com', role: 'Corporate', country: 'Uganda', joined: '2026-02-15', plan: 'Premium', status: 'active', tokens: '320K' },
  { id: '4', name: 'Grace M.', email: 'grace.m@rwandalegal.rw', role: 'Solo Advocate', country: 'Rwanda', joined: '2026-02-28', plan: 'Basic', status: 'inactive', tokens: '12K' },
  { id: '5', name: 'Peter Njoroge', email: 'peter.njoroge@gmail.com', role: 'Firm User', country: 'Tanzania', joined: '2026-03-05', plan: 'Enterprise', status: 'banned', tokens: '0' },
  { id: '6', name: 'Sarah Wanjiku', email: 'sarah.w@aln.africa', role: 'Firm Admin', country: 'Kenya', joined: '2025-11-20', plan: 'Enterprise', status: 'active', tokens: '2.5M' },
];

const recentActivity = [
  { id: 1, type: 'signup', user: 'jane.doe@firm.co.ke', time: '2 mins ago', detail: 'New Enterprise Signup', badge: 'bg-green-500/20 text-green-500' },
  { id: 2, type: 'payment', user: 'alex.k@legal.org', time: '15 mins ago', detail: 'Upgraded to Premium (Annual) - $1,200', badge: 'bg-blue-500/20 text-blue-500' },
  { id: 3, type: 'ai', user: 'm.otieno@advocates.com', time: '1 hr ago', detail: 'Generated 50+ page affidavit (45k tokens)', badge: 'bg-yellow-500/20 text-yellow-500' },
  { id: 4, type: 'security', user: 'system', time: '3 hrs ago', detail: 'Failed login attempt pattern detected from IP 192.168.1.1', badge: 'bg-red-500/20 text-red-500' },
  { id: 5, type: 'payment', user: 'david@ochiengholdings.com', time: '5 hrs ago', detail: 'Purchased 100k Token Bundle - $50', badge: 'bg-blue-500/20 text-blue-500' },
];

const discoveryData = [
  { name: 'Search (Google/Bing)', value: 45 },
  { name: 'AI Search (ChatGPT)', value: 25 },
  { name: 'Social Media', value: 15 },
  { name: 'Referral', value: 10 },
  { name: 'Conference/Blog', value: 5 },
];

const onboardingStepData = [
  { name: 'Email Verified', count: 1240, color: '#10b981' },
  { name: 'Socials Linked', count: 850, color: '#3b82f6' },
  { name: 'Terms Accepted', count: 1100, color: '#8b5cf6' },
  { name: 'Team Created', count: 420, color: '#f59e0b' },
];

const recentOnboarding = [
  { id: 1, user: "Kelvin Maina", source: "AI Search", team: "Lawlify Devs", date: "2m ago", status: "Complete" },
  { id: 2, user: "Alice Johnson", source: "Search (Google)", team: "Johnson & Co", date: "15m ago", status: "Complete" },
  { id: 3, user: "Bob Smith", source: "Social Media", team: "Personal", date: "1h ago", status: "Step 2/4" },
  { id: 4, user: "Sarah Williams", source: "Referral", team: "Williams Legal", date: "3h ago", status: "Complete" },
];

const aiInsightsData = [
  {
    id: 1,
    category: 'Growth',
    title: 'High Conversion Potential',
    description: '3 identified law firms from students tier are showing activity patterns similar to Enterprise users. Recommend outreach with dedicated firm trial.',
    impact: 'High',
    type: 'lead',
    icon: Target,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    id: 2,
    category: 'Operational',
    title: 'Storage Optimization',
    description: 'System logs are growing 25% faster than last week. Recommend archiving logs older than 30 days to save ~12GB/week.',
    impact: 'Medium',
    type: 'performance',
    icon: Cpu,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10'
  },
  {
    id: 3,
    category: 'Revenue',
    title: 'Token Usage Surge',
    description: 'Top 5 Enterprise users exceeded their monthly token quota by 15%. Recommend automated top-up prompts for their next session.',
    impact: 'Critical',
    type: 'revenue',
    icon: DollarSign,
    color: 'text-green-500',
    bg: 'bg-green-500/10'
  }
];

const derivedLeads = [
  { id: 1, name: "Bowmans Law (Team A)", probability: "92%", reason: "Token usage > 80%", action: "Enterprise Upgrade" },
  { id: 2, name: "UoN Student Reps", probability: "85%", reason: "Member count hit limit", action: "Small Firm Plan" },
  { id: 3, name: "Johnson & Associates", probability: "78%", reason: "Daily document freq", action: "Consultation" },
];

// === COMPONENTS ===

const StatCard = ({ title, value, change, icon: Icon, trend, colorClass = "text-primary" }: any) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-all">

    <div className="flex items-center gap-4 mb-4">
      <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-gray-400 font-medium">{title}</h3>
    </div>
    <div className="flex items-end gap-3">
      <span className="text-3xl font-bold text-white">{value}</span>
      <span className={`text-sm font-medium mb-1 flex items-center ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
        {trend === 'up' && <ArrowUpRight className="w-4 h-4 mr-1" />}
        {change}
      </span>
    </div>
  </div>
);

const DynamicChart = ({ data, type, xKey, yKey1, yKey2, title, icon: Icon, color = "#ef4444", barColor = "#3b82f6", line2Color = "#10b981", id }: any) => {
  const renderChart = () => {
    switch (type) {
      case 'pie':
        return (
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey={yKey1}>
              {data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
            <Legend />
          </PieChart>
        );
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis dataKey={xKey} stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
            <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }} />
            <Legend />
            <Line type="monotone" name={yKey1} dataKey={yKey1} stroke={barColor} strokeWidth={3} dot={{ r: 4 }} />
            {yKey2 && <Line type="monotone" name={yKey2} dataKey={yKey2} stroke={line2Color} strokeWidth={3} dot={{ r: 4 }} />}
          </LineChart>
        );
      case 'scatter':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis dataKey={xKey} stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
            <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }} />
            <Legend />
            <Bar dataKey={yKey1} fill={barColor} radius={[4, 4, 0, 0]} />
            {yKey2 && <Bar dataKey={yKey2} fill={line2Color} radius={[4, 4, 0, 0]} />}
          </BarChart>
        );
      default: // bar
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis dataKey={xKey} stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
            <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
            <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }} />
            <Legend />
            <Bar dataKey={yKey1} fill={barColor} radius={[4, 4, 0, 0]} />
            {yKey2 && <Bar dataKey={yKey2} fill={line2Color} radius={[4, 4, 0, 0]} />}
          </BarChart>
        );
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-bold">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">{type}</span>
        </div>
      </div>
      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CustomPieChart = ({ data, title, icon: Icon, valueSuffix = '%' }: any) => (
  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col hover:border-white/20 transition-colors">
    <div className="flex items-center gap-3 mb-4">
      <Icon className="w-5 h-5 text-gray-400" />
      <h2 className="text-lg font-bold">{title}</h2>
    </div>
    <div className="flex-1 min-h-[220px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `${value}${valueSuffix}`}
            contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);




// ===== HELPERS & MANAGERS =====

const MOCK_VULNERABILITIES = [];
const SEVERITY_META: Record<string, { color: string; bg: string; border: string; dot: string }> = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', dot: 'bg-red-500' },
  high:     { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', dot: 'bg-orange-500' },
  medium:   { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', dot: 'bg-yellow-500' },
  low:      { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', dot: 'bg-blue-500' },
};

const SecurityScannerPanel = () => {
  const [auditData, setAuditData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAudit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('lawlify_admin_token');
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/admin/security/audit`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch security audit');
      const data = await response.json();
      setAuditData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runAudit();
  }, []);

  const score = auditData ? 85 : 0;
  const scoreColor = score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : score >= 40 ? 'text-orange-400' : 'text-red-400';
  const scoreRingColor = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : score >= 40 ? '#f97316' : '#ef4444';

  return (
    <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-red-400" /> AI Security Scanner
          </h2>
          <p className="text-sm text-gray-400 mt-1">Powered by Lawlify Security AI · Real-time Database Audit</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={runAudit} disabled={isLoading} className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-red-500/20 disabled:opacity-60">
            <ScanLine className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? `Scanning…` : 'Run Security Scan'}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div className="h-full bg-red-500 rounded-full" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2 }} />
        </div>
      )}

      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white">Scan Failed</h3>
          <p className="text-gray-400 mt-2">{error}</p>
        </div>
      ) : (auditData && auditData.findings) ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2 md:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:border-white/20 transition-all">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Security Score</p>
              <div className={`text-6xl font-black ${scoreColor}`}>{score}</div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-1">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, backgroundColor: scoreRingColor }} />
              </div>
              <p className={`text-xs font-bold uppercase tracking-wider mt-1 ${scoreColor}`}>{score >= 80 ? 'Good' : 'Critical'}</p>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex flex-col gap-2 hover:border-red-500/40 transition-all">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Critical</span>
              </div>
              <div className="text-5xl font-black text-red-400">{auditData.findings.filter((f:any) => f.severity === 'CRITICAL').length}</div>
              <p className="text-xs text-gray-500">Needs immediate fix</p>
            </div>
          </div>

          <div className="space-y-4">
            {auditData.findings.map((vuln: any) => (
              <div key={vuln.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${vuln.category === 'SECURITY' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                      {vuln.category === 'SECURITY' ? <Lock className="w-5 h-5" /> : <Gauge className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{vuln.title}</h3>
                      <p className="text-sm text-gray-400">{vuln.description}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${vuln.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-500 border-red-500/30' : 'bg-blue-500/20 text-blue-500 border-blue-500/30'} border`}>
                    {vuln.severity}
                  </span>
                </div>
                
                <div className="space-y-4 mt-6">
                  <div className="bg-black/40 rounded-xl p-4 font-mono text-xs text-blue-400 border border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Remediation SQL</div>
                    {vuln.remediation}
                  </div>
                  
                  <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex gap-3">
                    <Brain className="w-5 h-5 text-primary shrink-0" />
                    <div className="text-sm text-gray-300">
                      <span className="block font-bold text-primary mb-1">AI Recommendation</span>
                      Applying this fix will patch the vulnerability and align your database with Lawlify security standards.
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </motion.div>
  );
};

const ResponsesManager = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('connector_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) console.error('Error fetching requests:', error);
      else setRequests(data || []);
    } catch (err) {
      console.error('Exception in fetchRequests:', err);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Connector Requests</h2>
          <p className="text-gray-400 text-sm">Review data connector bridges requested by Lawlify users.</p>
        </div>
        <button onClick={fetchRequests} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
          <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-white/10">
            <tr>
              <th className="px-8 py-4">requested connector</th>
              <th className="px-8 py-4">user email</th>
              <th className="px-8 py-4">timestamp</th>
              <th className="px-8 py-4">status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold border border-orange-500/20">
                      {req.connector_name?.charAt(0) || '?'}
                    </div>
                    <span className="font-bold text-white">{req.connector_name || 'Unknown'}</span>
                  </div>
                </td>
                <td className="px-8 py-4 text-sm text-gray-400">{req.user_email || 'No email'}</td>
                <td className="px-8 py-4 text-xs font-mono text-gray-500">
                  {req.created_at ? new Date(req.created_at).toLocaleString() : 'N/A'}
                </td>
                <td className="px-8 py-4">
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded-md text-[10px] font-bold uppercase tracking-widest border border-blue-500/20">
                    pending Review
                  </span>
                </td>
              </tr>
            ))}
            {requests.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="px-8 py-12 text-center text-gray-500">No connector requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Enterprise Demo Bookings Manager ────────────────────────────────────────
const DemoBookingsManager = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'enterprise' | 'general'>('all');

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('demo_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) console.error('Error fetching bookings:', error);
      else setBookings(data || []);
    } catch (err) {
      console.error('Exception fetching bookings:', err);
    }
    setLoading(false);
  };

  const filtered = statusFilter === 'all' ? bookings : bookings.filter(b => (b.booking_type || 'general') === statusFilter);
  const enterpriseCount = bookings.filter(b => b.booking_type === 'enterprise').length;
  const pendingCount = bookings.filter(b => !b.demo_date).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Demo Bookings</h2>
          <p className="text-gray-400 text-sm mt-1">All scheduled strategy sessions and demo requests.</p>
        </div>
        <button onClick={fetchBookings} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
          <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Total Bookings</p>
          <p className="text-4xl font-black text-white">{bookings.length}</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Enterprise</p>
          <p className="text-4xl font-black text-primary">{enterpriseCount}</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-yellow-500 mb-1">Awaiting Date</p>
          <p className="text-4xl font-black text-yellow-400">{pendingCount}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        {(['all', 'enterprise', 'general'] as const).map(f => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-4 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
              statusFilter === f ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/10">
            <tr>
              <th className="px-6 py-4">Name & Firm</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Booked Slot</th>
              <th className="px-6 py-4">Team Size</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((b) => (
              <tr key={b.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20 shrink-0">
                      {b.full_name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{b.full_name || '—'}</div>
                      <div className="text-[11px] text-gray-500">{b.firm_name || '—'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{b.email || '—'}</td>
                <td className="px-6 py-4">
                  {b.demo_date ? (
                    <div>
                      <div className="flex items-center gap-1.5 text-sm font-bold text-white">
                        <CalendarDays className="w-3.5 h-3.5 text-primary" />
                        {new Date(b.demo_date).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      {b.demo_time && (
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-0.5">
                          <Clock className="w-3 h-3" /> {b.demo_time} EAT
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] text-gray-600 italic">No date selected</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{b.team_size || '—'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                    b.booking_type === 'enterprise'
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-white/10 text-gray-400 border border-white/10'
                  }`}>
                    {b.booking_type || 'general'}
                  </span>
                </td>
                <td className="px-6 py-4 text-[11px] font-mono text-gray-500">
                  {b.created_at ? new Date(b.created_at).toLocaleString('en-KE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <CalendarDays className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 font-bold">No bookings found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SupportManager = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) console.error('Error fetching messages:', error);
      else setMessages(data || []);
    } catch (err) {
      console.error('Exception in fetchMessages:', err);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Support Inbox</h2>
          <p className="text-gray-400 text-sm">Managed incoming support queries and user messages.</p>
        </div>
        <button onClick={fetchMessages} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
          <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-pink-500/30 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500 font-bold border border-pink-500/20">
                  {msg.user_name?.charAt(0) || msg.user_email?.charAt(0) || '?'}
                </div>
                <div>
                  <div className="font-bold text-white">{msg.user_name || 'Anonymous User'}</div>
                  <div className="text-xs text-gray-500">{msg.user_email || 'No email'}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">
                  {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : 'N/A'}
                </div>
                <div className="text-[10px] font-mono text-gray-500 italic">
                  {msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : ''}
                </div>
              </div>
            </div>
            <div className="bg-black/40 rounded-2xl p-4 text-sm text-gray-300 leading-relaxed border border-white/5 mb-4 group-hover:border-white/10 transition-colors">
              {msg.message}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                  msg.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'
                }`}>
                  {msg.status}
                </span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">ID: {msg.id?.slice(0, 8) || 'N/A'}</span>
              </div>
              <button className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-500 hover:text-white transition-colors">
                Apply Action ↵
              </button>
            </div>
          </div>
        ))}
        {messages.length === 0 && !loading && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-20 text-center">
            <MessageSquare className="w-12 h-12 text-gray-700 mx-auto mb-4 opacity-20" />
            <p className="text-gray-500 font-bold">The inbox is currently quiet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const KockpitDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Map segments to tab IDs
  const pathToTab: Record<string, any> = {
    'analytics': 'overview',
    'users': 'users',
    'logs': 'logs',
    'billing': 'billing',
    'platform-settings': 'settings',
    'storage': 'storage',
    'performance': 'speed',
    'onboarding': 'onboarding',
    'ai-insights': 'ai',
    'security': 'security',
    'responses': 'responses',
    'support': 'support',
    'knowledge-lab': 'knowledge',
    'knowledge-lab/ingest': 'knowledge-ingest',
    'demo-bookings': 'demo-bookings'
  };

  const tabToPath: Record<string, string> = {
    'overview': 'analytics',
    'users': 'users',
    'logs': 'logs',
    'billing': 'billing',
    'settings': 'platform-settings',
    'storage': 'storage',
    'speed': 'performance',
    'onboarding': 'onboarding',
    'ai': 'ai-insights',
    'security': 'security',
    'responses': 'responses',
    'support': 'support',
    'knowledge': 'knowledge-lab',
    'knowledge-ingest': 'knowledge-lab/ingest',
    'demo-bookings': 'demo-bookings'
  };

  const getActiveTab = () => {
    const segments = location.pathname.split('/').filter(Boolean);
    const kockpitIndex = segments.indexOf('kockpit');
    if (kockpitIndex === -1 || kockpitIndex === segments.length - 1) return 'overview';
    
    // Join the segments after 'kockpit' to get the relative path
    const relativePath = segments.slice(kockpitIndex + 1).join('/');
    return pathToTab[relativePath] || pathToTab[segments[kockpitIndex + 1]] || 'overview';
  };

  const [activeTab, setActiveTab] = useState<string>(getActiveTab());

  useEffect(() => {
    const newTab = getActiveTab();
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
    // Redirect /kockpit or invalid paths to default /kockpit/analytics
    if (location.pathname === '/kockpit' || location.pathname === '/kockpit/') {
      navigate('/kockpit/analytics', { replace: true });
    }
  }, [location.pathname]);

  const handleTabChange = (tabId: string) => {
    navigate(`/kockpit/${tabToPath[tabId]}`);
  };

  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [globalTimeRange, setGlobalTimeRange] = useState('7d');
  const [chartTypes, setChartTypes] = useState<Record<string, 'bar' | 'pie' | 'line' | 'scatter'>>({
    growth: 'line',
    usage: 'bar',
    storage: 'pie',
    geo: 'pie',
    discovery: 'pie',
    funnel: 'bar'
  });

  const toggleChartType = (id: string) => {
    const types: ('bar' | 'pie' | 'line' | 'scatter')[] = ['bar', 'pie', 'line', 'scatter'];
    setChartTypes(prev => {
      const current = prev[id];
      const nextIndex = (types.indexOf(current) + 1) % types.length;
      return { ...prev, [id]: types[nextIndex] };
    });
  };

  const ChartControls = ({ id }: { id: string }) => (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => toggleChartType(id)}
        className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors title='Switch chart type'"
      >
        <RefreshCcw className="w-4 h-4" />
      </button>
    </div>
  );

  const TimeFilter = () => (
    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-1">
      {['1h', '24h', '7d', '30d', 'Custom'].map((range) => (
        <button
          key={range}
          onClick={() => setGlobalTimeRange(range.toLowerCase())}
          className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
            globalTimeRange === range.toLowerCase() ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          {range}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex font-sans overflow-hidden">

      {/* Sidebar */}
      <motion.aside
        animate={{ width: isSidebarOpen ? 256 : 80 }}
        className="border-r border-white/10 bg-black/50 backdrop-blur-xl flex flex-col h-screen shrink-0"
      >
        <div className="h-20 flex items-center gap-3 px-6 border-b border-white/10 overflow-hidden">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            <Scale className="w-6 h-6 text-white" />
          </div>
          {isSidebarOpen && <span className="text-xl font-bold tracking-tighter whitespace-nowrap">Lawlify Kockpit</span>}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
          {isSidebarOpen && <p className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2 mb-4 mt-2 whitespace-nowrap">Admin Modules</p>}
          <button
            onClick={() => handleTabChange('overview')}
            className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center'} py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            title="Analytics Overview"
          >
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">Analytics Overview</span>}
          </button>
          <button
            onClick={() => handleTabChange('users')}
            className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center'} py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            title="User Management"
          >
            <Users className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">User Management</span>}
          </button>
          <button
            onClick={() => handleTabChange('logs')}
            className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center'} py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'logs' ? 'bg-yellow-500 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            title="System Logs & Audits"
          >
            <Activity className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">System Logs & Audits</span>}
          </button>
          <button
            onClick={() => handleTabChange('billing')}
            className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center'} py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'billing' ? 'bg-green-500 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            title="Billing & Revenue"
          >
            <DollarSign className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">Billing & Revenue</span>}
          </button>
          <button
            onClick={() => handleTabChange('settings')}
            className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center'} py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            title="Platform Settings"
          >
            <Settings className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">Platform Settings</span>}
          </button>
          <button
            onClick={() => handleTabChange('knowledge')}
            className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center'} py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'knowledge' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            title="Knowledge Lab (PageIndex)"
          >
            <Database className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">Knowledge Lab</span>}
          </button>
          <button
            onClick={() => handleTabChange('storage')}
            className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center'} py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'storage' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            title="Storage Management"
          >
            <HardDrive className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">Storage Management</span>}
          </button>
          <button
            onClick={() => handleTabChange('speed')}
            className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center'} py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'speed' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            title="Speed Insights"
          >
            <Zap className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">Speed Insights</span>}
          </button>
          <button
            onClick={() => handleTabChange('onboarding')}
            className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center'} py-3 rounded-xl text-sm font-medium ${activeTab === 'onboarding' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'} transition-all`}
            title="Onboarding"
          >
            <Users className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">Onboarding</span>}
          </button>
          <button
            onClick={() => handleTabChange('ai')}
            className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center'} py-3 rounded-xl text-sm font-medium ${activeTab === 'ai' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'} transition-all`}
            title="AI Insights"
          >
            <Sparkles className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">AI Insights</span>}
          </button>
          <button
            onClick={() => handleTabChange('security')}
            className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center'} py-3 rounded-xl text-sm font-medium ${activeTab === 'security' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'} transition-all`}
            title="Security Scanner"
          >
            <ShieldCheck className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">Security Scanner</span>}
          </button>
          {isSidebarOpen && <p className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2 mb-4 mt-6 whitespace-nowrap">Support & Info</p>}
          <button
            onClick={() => handleTabChange('responses')}
            className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center'} py-3 rounded-xl text-sm font-medium ${activeTab === 'responses' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'} transition-all`}
            title="Form Responses"
          >
            <Database className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">Connector Requests</span>}
          </button>
          <button
            onClick={() => handleTabChange('demo-bookings')}
            className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center'} py-3 rounded-xl text-sm font-medium ${activeTab === 'demo-bookings' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'} transition-all`}
            title="Demo Bookings"
          >
            <CalendarDays className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">Demo Bookings</span>}
          </button>
          <button
            onClick={() => handleTabChange('support')}
            className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center'} py-3 rounded-xl text-sm font-medium ${activeTab === 'support' ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'} transition-all`}
            title="Support Messages"
          >
            <MessageSquare className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">Support Inbox</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => navigate('/app/legal-ai')}
            className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center'} py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors`}
            title="Back to App"
          >
            <ChevronLeft className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">Back to App</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-black/50 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight capitalize">{activeTab}</h1>
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-green-500 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                1 ONLINE
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-blue-500 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                PRODUCTION
              </div>
              <div className="ml-4">
                <TimeFilter />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-300">
              <Compass className="w-3.5 h-3.5" />
              <span>Combobox Menu</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-300">
              <Clock className="w-3.5 h-3.5" />
              <span>Last 7 Days</span>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search users, actions, logs..."
                className="w-64 bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold border-2 border-white/10">
              AD
            </div>
          </div>
        </header>

        {/* Scrollable Workspace */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">

            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Top Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Visitors" value="8" change="0%" icon={Users} trend="neutral" colorClass="text-blue-500" />
                    <StatCard title="Page Views" value="148" change="+12%" icon={Activity} trend="up" colorClass="text-green-500" />
                    <StatCard title="Bounce Rate" value="0%" change="0%" icon={TrendingUp} trend="neutral" colorClass="text-yellow-500" />
                    <StatCard title="System Uptime" value="99.99%" change="Optimal" icon={ShieldAlert} trend="neutral" colorClass="text-primary" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Primary Chart: Growth */}
                    <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all flex flex-col">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2 className="text-xl font-bold mb-1">Growth & Revenue Lifecycle</h2>
                          <p className="text-sm text-gray-400">Trailing {globalTimeRange} performance (Revenue vs. Signups)</p>
                        </div>
                        <ChartControls id="growth" />
                      </div>
                      <div className="h-[300px] w-full flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                          {chartTypes.growth === 'line' ? (
                            <LineChart data={userGrowthData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                              <XAxis dataKey="date" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
                              <YAxis yAxisId="left" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
                              <YAxis yAxisId="right" orientation="right" stroke="#10b981" tick={{ fill: '#10b981', fontSize: 12 }} />
                              <Tooltip
                                contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                                itemStyle={{ color: '#fff' }}
                              />
                              <Legend />
                              <Line yAxisId="left" type="monotone" name="Active Users" dataKey="users" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
                              <Line yAxisId="right" type="monotone" name="Revenue ($)" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                            </LineChart>
                          ) : chartTypes.growth === 'bar' ? (
                            <BarChart data={userGrowthData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                              <XAxis dataKey="date" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
                              <YAxis yAxisId="left" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
                              <YAxis yAxisId="right" orientation="right" stroke="#10b981" tick={{ fill: '#10b981', fontSize: 12 }} />
                              <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }} />
                              <Legend />
                              <Bar yAxisId="left" name="Active Users" dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                              <Bar yAxisId="right" name="Revenue ($)" dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          ) : chartTypes.growth === 'pie' ? (
                            <PieChart>
                              <Pie data={userGrowthData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="revenue">
                                {userGrowthData.map((_, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          ) : (
                            <LineChart data={userGrowthData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                              <XAxis dataKey="date" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
                              <YAxis yAxisId="left" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
                              <Tooltip />
                              <Line type="step" name="Growth Index" dataKey="users" stroke="#ef4444" strokeWidth={2} />
                            </LineChart>
                          )}
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Geography / Jurisdiction Pie Chart */}
                    <div className="flex flex-col">
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col hover:border-white/20 transition-colors h-full">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-gray-400" />
                            <h2 className="text-lg font-bold">Jurisdictions / Geo</h2>
                          </div>
                          <ChartControls id="geo" />
                        </div>
                        <div className="flex-1 min-h-[220px]">
                           <ResponsiveContainer width="100%" height="100%">
                              {chartTypes.geo === 'pie' ? (
                                <PieChart>
                                  <Pie data={geoData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                                    {geoData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                  </Pie>
                                  <Tooltip />
                                  <Legend />
                                </PieChart>
                              ) : (
                                <BarChart data={geoData} layout="vertical">
                                  <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                                  <XAxis type="number" hide />
                                  <YAxis dataKey="name" type="category" stroke="#888" fontSize={11} width={70} />
                                  <Tooltip />
                                  <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} />
                                </BarChart>
                              )}
                           </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Demographics & Tech Stack Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <CustomPieChart data={roleData} title="User Roles" icon={Briefcase} />
                    <CustomPieChart data={deviceData} title="Devices" icon={Smartphone} />
                    <CustomPieChart data={browserData} title="Browsers" icon={Compass} />
                    <CustomPieChart data={osData} title="Operating Systems" icon={Monitor} />
                  </div>

                  {/* traffic stats section removed as they are now in the top row */}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Routes & Pages */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold flex items-center gap-2"><Globe className="w-5 h-5 text-gray-400" /> Pages</h3>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Visitors</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { path: '/', visitors: 6, percentage: 100 },
                          { path: '/app/legal-ai', visitors: 6, percentage: 100 },
                          { path: '/auth', visitors: 4, percentage: 66 },
                          { path: '/app/agentic-mentorship', visitors: 3, percentage: 50 },
                          { path: '/app/overview', visitors: 3, percentage: 50 },
                          { path: '/app/specialists', visitors: 3, percentage: 50 },
                          { path: '/app/integrations', visitors: 2, percentage: 33 },
                        ].map(route => (
                          <div key={route.path} className="relative h-8 flex items-center rounded overflow-hidden">
                            <div className="absolute top-0 left-0 h-full bg-blue-500/20" style={{ width: `${route.percentage}%` }}></div>
                            <div className="flex justify-between items-center w-full px-3 relative z-10 text-sm">
                              <span className="font-mono text-gray-300 truncate pr-4">{route.path}</span>
                              <span className="font-bold text-white">{route.visitors}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-8">
                      {/* Top Referrers */}
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold flex items-center gap-2"><Search className="w-5 h-5 text-gray-400" /> Referrers</h3>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Visitors</span>
                        </div>
                        <div className="space-y-2">
                          {[
                            { name: 'vercel.com', visitors: 2, percentage: 33 },
                            { name: 'Direct', visitors: 4, percentage: 66 },
                          ].map(ref => (
                            <div key={ref.name} className="relative h-8 flex items-center rounded overflow-hidden">
                              <div className="absolute top-0 left-0 h-full bg-purple-500/20" style={{ width: `${ref.percentage}%` }}></div>
                              <div className="flex justify-between items-center w-full px-3 relative z-10 text-sm">
                                <span className="text-gray-300">{ref.name}</span>
                                <span className="font-bold text-white">{ref.visitors}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Top Countries */}
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold flex items-center gap-2"><Globe className="w-5 h-5 text-gray-400" /> Countries</h3>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Visitors</span>
                        </div>
                        <div className="space-y-2">
                          {[
                            { name: 'Kenya', visitors: 6, percentage: 100 },
                          ].map(country => (
                            <div key={country.name} className="relative h-8 flex items-center rounded overflow-hidden">
                              <div className="absolute top-0 left-0 h-full bg-green-500/20" style={{ width: `${country.percentage}%` }}></div>
                              <div className="flex justify-between items-center w-full px-3 relative z-10 text-sm">
                                <span className="text-gray-300">{country.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-gray-500">100%</span>
                                  <span className="font-bold text-white">{country.visitors}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Peak Time Usage (24h Area Chart) */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all flex flex-col">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-gray-400" />
                          <div>
                            <h2 className="text-xl font-bold">Peak Usage Times</h2>
                            <p className="text-xs text-gray-400 mt-1">Active users ({globalTimeRange})</p>
                          </div>
                        </div>
                        <ChartControls id="peak" />
                      </div>
                      <div className="h-[250px] w-full flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                          {chartTypes.peak === 'line' || !chartTypes.peak ? (
                            <AreaChart data={timeUsageData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                              <XAxis dataKey="time" stroke="#666" tick={{ fill: '#888', fontSize: 11 }} interval={3} />
                              <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 11 }} />
                              <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }} />
                              <Area type="monotone" name="Active Sessions" dataKey="users" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorUsers)" />
                            </AreaChart>
                          ) : (
                            <BarChart data={timeUsageData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                              <XAxis dataKey="time" stroke="#666" tick={{ fill: '#888', fontSize: 11 }} interval={3} />
                              <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 11 }} />
                              <Tooltip cursor={{ fill: '#ffffff05' }} />
                              <Bar dataKey="users" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          )}
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Feature Usage Bar Chart */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all flex flex-col">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <Cpu className="w-5 h-5 text-gray-400" />
                          <h2 className="text-xl font-bold">Feature Utilization</h2>
                        </div>
                        <ChartControls id="usage" />
                      </div>
                      <div className="h-[250px] w-full flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                          {chartTypes.usage === 'bar' || !chartTypes.usage ? (
                            <BarChart data={featureUsageData} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={true} vertical={false} />
                              <XAxis type="number" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
                              <YAxis dataKey="name" type="category" stroke="#fff" tick={{ fill: '#fff', fontSize: 12 }} width={120} />
                              <Tooltip cursor={{ fill: '#ffffff05' }} />
                              <Bar name="Tokens Used" dataKey="tokens" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          ) : (
                            <PieChart>
                              <Pie data={featureUsageData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="tokens">
                                {featureUsageData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          )}
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'users' && (
                <motion.div
                  key="users"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Detailed Users Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Daily Active Users (DAU)" value="245" change="+12% today" icon={Users} trend="up" colorClass="text-blue-500" />
                    <StatCard title="Paying Subscribers" value="180" change="+5% today" icon={CreditCard} trend="up" colorClass="text-green-500" />
                    <StatCard title="Free Tier Users" value="332" change="-2% today" icon={Users} trend="down" colorClass="text-gray-400" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <CustomPieChart data={payingVsFreeData} title="Paying vs Free" icon={Activity} />

                    <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                      <div className="p-6 border-b border-white/10 flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold">User Database</h2>
                          <p className="text-sm text-gray-400">View, edit, and manage registered users safely.</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-colors text-sm">
                          <UserPlus className="w-4 h-4" />
                          Add Admin
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                              <th className="p-4 font-bold border-b border-white/10">User</th>
                              <th className="p-4 font-bold border-b border-white/10">Role & Country</th>
                              <th className="p-4 font-bold border-b border-white/10">Subscription</th>
                              <th className="p-4 font-bold border-b border-white/10">Tokens Used</th>
                              <th className="p-4 font-bold border-b border-white/10">Status</th>
                              <th className="p-4 font-bold border-b border-white/10 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/10">
                            {mockUsersList.map(user => (
                              <tr key={user.id} className="hover:bg-white-[0.02] transition-colors group">
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1a1a1a&color=fff`} alt="" className="w-8 h-8 rounded-full" />
                                    <div>
                                      <div className="font-bold">{user.name}</div>
                                      <div className="text-xs text-gray-500">{user.email} • Joined {user.joined}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="text-sm text-gray-300">{user.role}</div>
                                  <div className="text-xs text-gray-500">{user.country}</div>
                                </td>
                                <td className="p-4">
                                  <span className={`px-2 py-1 rounded text-xs font-bold ${user.plan === 'Enterprise' ? 'bg-purple-500/20 text-purple-400' :
                                    user.plan === 'Premium' ? 'bg-blue-500/20 text-blue-400' :
                                      'bg-gray-500/20 text-gray-400'
                                    }`}>
                                    {user.plan}
                                  </span>
                                </td>
                                <td className="p-4 text-sm font-medium">{user.tokens}</td>
                                <td className="p-4">
                                  {user.status === 'active' ? (
                                    <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full w-fit">
                                      <CheckCircle2 className="w-3 h-3" /> Active
                                    </span>
                                  ) : user.status === 'inactive' ? (
                                    <span className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-500/10 px-2 py-1 rounded-full w-fit">
                                      <Clock className="w-3 h-3" /> Inactive
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-full w-fit">
                                      <XCircle className="w-3 h-3" /> Banned
                                    </span>
                                  )}
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white" title="Edit Limits">
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-500" title={user.status === 'banned' ? 'Unban' : 'Suspend Account'}>
                                      <Power className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
                                      <MoreVertical className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'logs' && (
                <motion.div
                  key="logs"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                >
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <Activity className="w-6 h-6 text-yellow-500" />
                        <div>
                          <h2 className="text-xl font-bold">System Logs & Live Activity</h2>
                          <p className="text-sm text-gray-400 mt-1">Real-time telemetry and admin events stream.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
                           <Clock className="w-3 h-3" /> Filtered by: {globalTimeRange}
                        </div>
                        <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                           <Search className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6 pl-4 border-l-2 border-white/5 relative">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="relative">
                          <div className={`absolute -left-[23px] w-4 h-4 rounded-full border-2 border-[#0A0A0A] ${activity.badge.split(' ')[0]}`} />

                          <div className="bg-white/5 border border-white/5 rounded-xl p-4 ml-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-white">{activity.user}</span>
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${activity.badge}`}>
                                  {activity.type}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {activity.time}
                              </span>
                            </div>
                            <p className="text-sm text-gray-300">{activity.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'billing' && (
                <motion.div
                  key="billing"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Total MRR" value="$10,200" change="+$2.4k this month" icon={DollarSign} trend="up" colorClass="text-green-500" />
                    <StatCard title="Annual Run Rate (ARR)" value="$122,400" change="+15% Projected" icon={TrendingUp} trend="up" colorClass="text-blue-500" />
                    <StatCard title="Avg Revenue Per User" value="$28.50" change="Optimal" icon={Activity} trend="neutral" colorClass="text-purple-500" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <CustomPieChart data={subscriptionPlansData} title="Active Plans" icon={Briefcase} />

                    <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2 className="text-xl font-bold mb-1">Billing Logs & Admin Operations</h2>
                          <p className="text-sm text-gray-400">Transactions for {globalTimeRange}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                            Range: {globalTimeRange}
                          </div>
                          <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors text-sm">
                            <Download className="w-4 h-4" /> Export CSV
                          </button>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                              <th className="p-4 font-bold border-b border-white/10">Invoice / Date</th>
                              <th className="p-4 font-bold border-b border-white/10">User</th>
                              <th className="p-4 font-bold border-b border-white/10">Plan / Item</th>
                              <th className="p-4 font-bold border-b border-white/10">Amount</th>
                              <th className="p-4 font-bold border-b border-white/10">Status</th>
                              <th className="p-4 font-bold border-b border-white/10 text-right">Admin Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/10">
                            {billingLogs.map(log => (
                              <tr key={log.id} className="hover:bg-white-[0.02] transition-colors group">
                                <td className="p-4">
                                  <div className="font-bold text-sm text-gray-300">{log.id}</div>
                                  <div className="text-xs text-gray-500">{log.date}</div>
                                </td>
                                <td className="p-4 text-sm font-medium">{log.user}</td>
                                <td className="p-4">
                                  <span className="px-2 py-1 bg-white/5 rounded text-xs font-bold text-gray-300">
                                    {log.plan}
                                  </span>
                                </td>
                                <td className="p-4 font-bold text-green-400">{log.amount}</td>
                                <td className="p-4">
                                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${log.status === 'paid' ? 'bg-green-500/20 text-green-500' :
                                    log.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                      'bg-red-500/20 text-red-500'
                                    }`}>
                                    {log.status}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white" title="Resend Invoice">
                                      <FileText className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-500" title="Process Refund">
                                      <RefreshCcw className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-500" title="Cancel Subscription Plan">
                                      <Ban className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'knowledge' && (
                <motion.div
                  key="knowledge"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                >
                  <KnowledgeLab />
                </motion.div>
              )}

              {activeTab === 'knowledge-ingest' && (
                <motion.div
                  key="knowledge-ingest"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                >
                  <KnowledgeIngest />
                </motion.div>
              )}

              {activeTab === 'onboarding' && (
                <motion.div
                  key="onboarding"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard title="Total Onboarded" value="1,240" change="+12% vs last month" icon={Users} trend="up" colorClass="text-blue-500" />
                    <StatCard title="Team Setup Rate" value="34%" change="+2% from total" icon={Building2} trend="up" colorClass="text-purple-500" />
                    <StatCard title="Avg. Setup Time" value="4m 12s" change="-15s (Faster)" icon={Zap} trend="up" colorClass="text-yellow-500" />
                    <StatCard title="Socials Linked" value="68%" change="LinkedIn leading" icon={MessageSquare} trend="up" colorClass="text-green-500" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Discovery Sources */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all flex flex-col">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <Search className="w-5 h-5 text-gray-400" />
                          <h2 className="text-xl font-bold">Discovery Channels</h2>
                        </div>
                        <ChartControls id="discovery" />
                      </div>
                      <div className="h-[300px] w-full flex-1">
                        <ResponsiveContainer width="100%" height={300}>
                          {chartTypes.discovery === 'pie' || !chartTypes.discovery ? (
                            <PieChart>
                              <Pie data={discoveryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                                {discoveryData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                              </Pie>
                              <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }} />
                              <Legend />
                            </PieChart>
                          ) : (
                            <BarChart data={discoveryData} layout="vertical" margin={{ left: 40 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                              <XAxis type="number" hide />
                              <YAxis dataKey="name" type="category" stroke="#888" fontSize={11} width={120} />
                              <Tooltip cursor={{ fill: '#ffffff05' }} />
                              <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          )}
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Step Completion */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all flex flex-col">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-gray-400" />
                          <h2 className="text-xl font-bold">Step Funnel</h2>
                        </div>
                        <ChartControls id="funnel" />
                      </div>
                      <div className="h-[300px] w-full flex-1">
                        <ResponsiveContainer width="100%" height={300}>
                          {chartTypes.funnel === 'bar' || !chartTypes.funnel ? (
                            <BarChart data={onboardingStepData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                              <XAxis dataKey="name" stroke="#666" tick={{ fill: '#888', fontSize: 11 }} />
                              <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 11 }} />
                              <Tooltip cursor={{ fill: '#ffffff05' }} />
                              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                {onboardingStepData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                              </Bar>
                            </BarChart>
                          ) : (
                            <LineChart data={onboardingStepData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                              <XAxis dataKey="name" stroke="#666" />
                              <YAxis stroke="#666" />
                              <Tooltip />
                              <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }} />
                            </LineChart>
                          )}
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-8">
                       <h2 className="text-xl font-bold">Recent Onboarding Activity</h2>
                       <div className="text-xs text-gray-400">All responses for {globalTimeRange}</div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">User</th>
                            <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Source</th>
                            <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Team</th>
                            <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Time</th>
                            <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Progress</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOnboarding.map((entry) => (
                            <tr key={entry.id} className="border-b border-white/5 hover:bg-white/[0.02] group transition-colors">
                              <td className="py-4 px-6">
                                <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{entry.user}</span>
                              </td>
                              <td className="py-4 px-6">
                                <span className="text-xs text-gray-400">{entry.source}</span>
                              </td>
                              <td className="py-4 px-6">
                                <span className="text-xs text-gray-300 font-mono tracking-tight">{entry.team}</span>
                              </td>
                              <td className="py-4 px-6 text-xs text-gray-500">{entry.date}</td>
                              <td className="py-4 px-6">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest ${
                                  entry.status === 'Complete' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                                }`}>
                                  {entry.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'storage' && (
                <motion.div
                  key="storage"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Total Storage" value="850 GB" change="85% capacity" icon={HardDrive} trend="neutral" colorClass="text-orange-500" />
                    <StatCard title="Total Backups" value="12" change="Last: 2h ago" icon={Database} trend="up" colorClass="text-blue-500" />
                    <StatCard title="Chat History" value="124 GB" change="+12GB/week" icon={RefreshCcw} trend="up" colorClass="text-green-500" />
                  </div>
                  <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-[2.5rem] p-10 hover:border-white/20 transition-all shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Database className="w-32 h-32" />
                      </div>

                      <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
                        {/* Unified Visualization */}
                        <div className="w-full lg:w-1/3">
                          <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500 border border-orange-500/20">
                              <PieIcon className="w-6 h-6" />
                            </div>
                            <div>
                              <h2 className="text-2xl font-black tracking-tight text-white">Storage Ecosystem</h2>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Global Capacity Analysis</p>
                            </div>
                          </div>

                          <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie data={storageData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                                  {storageData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip 
                                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }}
                                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Detailed Breakdown */}
                        <div className="w-full lg:w-2/3 space-y-5">
                          {[
                            { name: 'Legal Documents', size: '382 GB', value: 45, color: 'bg-[#ef4444]', icon: FileText },
                            { name: 'Chat History (Saved)', size: '212 GB', value: 25, color: 'bg-[#10b981]', icon: MessageSquare },
                            { name: 'Avatars & User Media', size: '127 GB', value: 15, color: 'bg-[#3b82f6]', icon: Users },
                            { name: 'Database Snapshots', size: '85 GB', value: 10, color: 'bg-[#f59e0b]', icon: Database },
                            { name: 'System Logs', size: '42 GB', value: 5, color: 'bg-[#8b5cf6]', icon: Activity },
                          ].map((bucket) => (
                            <div key={bucket.name} className="p-5 bg-white/[0.03] border border-white/5 rounded-[1.5rem] group/item hover:bg-white/[0.05] hover:border-white/10 transition-all">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-4">
                                  <div className={`p-2 rounded-xl ${bucket.color}/10 text-white/80 group-hover/item:text-white transition-colors`}>
                                    <bucket.icon className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <span className="font-bold text-sm text-gray-300 group-hover/item:text-white transition-colors">{bucket.name}</span>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{bucket.value}% of Total</p>
                                  </div>
                                </div>
                                <span className="text-sm font-black text-white">{bucket.size}</span>
                              </div>
                              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${bucket.value}%` }}
                                  className={`h-full ${bucket.color} rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)]`} 
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-8">
                      <Sliders className="w-6 h-6 text-purple-500" />
                      <div>
                        <h2 className="text-xl font-bold">Platform Status & Configuration</h2>
                        <p className="text-sm text-gray-400 mt-1">Global settings affecting the entire Lawlify AI ecosystem.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-white/20 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                            <Shield className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white">Maintenance Mode</h4>
                            <p className="text-xs text-gray-500">Lock out non-admin users</p>
                          </div>
                        </div>
                        <ToggleRight className="w-10 h-10 text-gray-600 cursor-pointer" />
                      </div>

                      <div className="p-6 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-white/20 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                            <Database className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white">Database Backups</h4>
                            <p className="text-xs text-gray-500">Auto-snapshot every 6h</p>
                          </div>
                        </div>
                        <ToggleRight className="w-10 h-10 text-blue-500 cursor-pointer" />
                      </div>

                      <div className="p-6 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-white/20 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
                            <Mail className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white">Sign-up Emails</h4>
                            <p className="text-xs text-gray-500">Welcome email automation</p>
                          </div>
                        </div>
                        <ToggleRight className="w-10 h-10 text-green-500 cursor-pointer" />
                      </div>

                      <div className="p-6 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-white/20 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
                            <Bell className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white">Security Alerts</h4>
                            <p className="text-xs text-gray-500">Push failed login alerts to Slack</p>
                          </div>
                        </div>
                        <ToggleRight className="w-10 h-10 text-yellow-500 cursor-pointer" />
                      </div>
                    </div>

                    <div className="mt-8 p-6 bg-primary/10 border border-primary/20 rounded-2xl">
                      <h4 className="font-bold text-white mb-2">Danger Zone</h4>
                      <p className="text-sm text-gray-400 mb-4">Actions here can permanently break system state. Proceed carefully.</p>
                      <button className="px-4 py-2 border border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-all text-sm">
                        Purge All System Logs
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'speed' && (
                <motion.div
                  key="speed"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col md:flex-row gap-6 items-center bg-white/5 border border-white/10 p-8 rounded-3xl">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDashoffset="21.8" strokeDasharray="364.4" className="text-cyan-500" />
                      </svg>
                      <div className="absolute text-3xl font-bold">94</div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1 text-white">Experience Score</h2>
                      <p className="text-gray-400 max-w-sm">Your system is performing at an exceptional level. All core web vitals are within high-performance thresholds.</p>
                    </div>
                    <div className="md:ml-auto grid grid-cols-2 gap-4">
                      <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
                        <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Status</div>
                        <div className="text-green-500 font-bold text-sm">OPTIMAL</div>
                      </div>
                      <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center">
                        <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Environment</div>
                        <div className="text-blue-500 font-bold text-sm">PRODUCTION</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Largest Contentful Paint</div>
                      <div className="flex items-end justify-between">
                        <span className="text-3xl font-bold text-white">1.2s</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-500 uppercase">Good</span>
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">First Input Delay</div>
                      <div className="flex items-end justify-between">
                        <span className="text-3xl font-bold text-white">14ms</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-500 uppercase">Good</span>
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Cumulative Layout Shift</div>
                      <div className="flex items-end justify-between">
                        <span className="text-3xl font-bold text-white">0.02</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-500 uppercase">Good</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all">
                      <div className="flex items-center gap-3 mb-8">
                        <Timer className="w-5 h-5 text-cyan-500" />
                        <h2 className="text-xl font-bold text-white">Load Time Lifecycle (24h)</h2>
                      </div>
                      <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={performanceData}>
                            <defs>
                              <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="time" stroke="#666" tick={{ fill: '#888', fontSize: 11 }} />
                            <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 11 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                            <Area type="monotone" name="Load Time" dataKey="loadTime" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorLoad)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all">
                      <div className="flex items-center gap-3 mb-8">
                        <Cpu className="w-5 h-5 text-blue-500" />
                        <h2 className="text-xl font-bold text-white">Infrastructure & DevOps</h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-white/20 transition-all">
                          <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">Build Duration</div>
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-orange-500" />
                            <span className="text-xl font-bold text-white">42s</span>
                          </div>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-white/20 transition-all">
                          <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">Deployments Today</div>
                          <div className="flex items-center gap-3">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            <span className="text-xl font-bold text-white">12</span>
                          </div>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-white/20 transition-all">
                          <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">Server CPU Load</div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 w-[12%]" />
                            </div>
                            <span className="text-xs font-bold text-white">12%</span>
                          </div>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-white/20 transition-all">
                          <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">Memory Utilization</div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 w-[45%]" />
                            </div>
                            <span className="text-xs font-bold text-white">45%</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-between p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <Server className="w-5 h-5 text-cyan-500" />
                          <div className="text-sm font-bold text-white">Edge Network Status</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                          <span className="text-[10px] font-bold text-cyan-500 uppercase">Global Pop Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'ai' && (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* AI Header / Generator */}
                  <div className="bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent border border-indigo-500/20 rounded-[2.5rem] p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-20">
                      <Brain className="w-32 h-32 text-indigo-500" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto py-12">
                      <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/20">
                        <Sparkles className={`w-8 h-8 text-white ${isGeneratingInsights ? 'animate-spin' : ''}`} />
                      </div>
                      <h2 className="text-4xl font-bold mb-4 tracking-tight">System Intel & Predictive Leads</h2>
                      <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        Our AI has processed <span className="text-indigo-400 font-bold">1.2M logs</span> and <span className="text-indigo-400 font-bold">$12.4k transactions</span> 
                        from the last 24 hours. Here are the derived opportunities and system optimizations.
                      </p>
                      <button 
                        onClick={() => {
                          setIsGeneratingInsights(true);
                          setTimeout(() => setIsGeneratingInsights(false), 3000);
                        }}
                        disabled={isGeneratingInsights}
                        className="px-8 py-4 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-3"
                      >
                        {isGeneratingInsights ? (
                          <>
                            <RefreshCcw className="w-5 h-5 animate-spin" />
                            Analyzing Ecosystem...
                          </>
                        ) : (
                          <>
                            <RefreshCcw className="w-5 h-5" />
                            Re-generate Intelligence
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Insight Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {aiInsightsData.map((insight) => (
                      <div key={insight.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all flex flex-col group">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-xl ${insight.bg} ${insight.color}`}>
                            <insight.icon className="w-6 h-6" />
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest ${
                            insight.impact === 'Critical' ? 'bg-red-500/20 text-red-500' : 
                            insight.impact === 'High' ? 'bg-blue-500/20 text-blue-500' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {insight.impact}
                          </span>
                        </div>
                        <div className="mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{insight.category}</div>
                        <h3 className="text-lg font-bold mb-3 group-hover:text-indigo-400 transition-colors">{insight.title}</h3>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-1">
                          {insight.description}
                        </p>
                        <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                          Implement Recommendation
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Derived Leads */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                       <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-3">
                            <Target className="w-5 h-5 text-indigo-400" />
                            <h2 className="text-xl font-bold">Derived High-Value Leads</h2>
                          </div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase">Top 10 Probability</div>
                       </div>
                       <div className="space-y-4">
                          {derivedLeads.map((lead) => (
                            <div key={lead.id} className="p-4 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold border border-indigo-500/20">
                                  {lead.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-bold text-sm mb-0.5">{lead.name}</div>
                                  <div className="text-[10px] text-gray-500 font-mono italic">{lead.reason}</div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <div className="text-sm font-bold text-green-500 mb-1">{lead.probability}</div>
                                <button className="text-[9px] font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300">
                                  {lead.action}
                                </button>
                              </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    {/* Action Center */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between">
                       <div>
                          <div className="flex items-center gap-3 mb-8">
                            <Lightbulb className="w-5 h-5 text-yellow-500" />
                            <h2 className="text-xl font-bold">Admin Strategy Center</h2>
                          </div>
                          <div className="space-y-6 mb-8">
                            <div className="flex gap-4">
                              <div className="w-1 h-12 bg-indigo-500 rounded-full shrink-0" />
                              <div>
                                <div className="text-sm font-bold mb-1">New Market Entry: Tanzania</div>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                  We noticed 45 unique IPs from Dar es Salaam this morning. Recommend setting up TZ local pricing and localized legal packs.
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-4">
                              <div className="w-1 h-12 bg-purple-500 rounded-full shrink-0" />
                              <div>
                                <div className="text-sm font-bold mb-1">Document Generation Bottleneck</div>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                  Average PDF generation time jumped to 12s. Recommend re-indexing the judicial docs bucket or triggering a scale-up.
                                </p>
                              </div>
                            </div>
                          </div>
                       </div>
                       <div className="flex gap-3">
                          <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold hover:bg-white/10 transition-all">
                            Notify All Admins
                          </button>
                          <button className="flex-1 py-4 bg-indigo-500 text-white rounded-2xl text-xs font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20">
                            Apply Optimized Routing
                          </button>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}


            {/* ===== SECURITY SCANNER TAB ===== */}
              {activeTab === 'security' && (
                <SecurityScannerPanel />
              )}
              {activeTab === 'responses' && (
                <motion.div
                  key="responses"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                >
                  <ResponsesManager />
                </motion.div>
              )}
              {activeTab === 'support' && (
                <motion.div
                  key="support"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                >
                  <SupportManager />
                </motion.div>
              )}
              {activeTab === 'demo-bookings' && (
                <motion.div
                  key="demo-bookings"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                >
                  <DemoBookingsManager />
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </main>

    </div>
  );
};

export default KockpitDashboard;
