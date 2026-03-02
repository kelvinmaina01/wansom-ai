import React, { useState } from 'react';
import { 
  Search, 
  Gavel, 
  Scale, 
  BookOpen, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  ChevronRight,
  User,
  Calendar,
  FileText,
  BarChart3
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// --- Mock Data ---

interface JudgeProfile {
  id: string;
  name: string;
  title: string;
  court: string;
  image: string;
  yearsExperience: number;
  appointedDate: string;
  rulingTendencies: {
    category: string;
    allowed: number; // percentage
    dismissed: number; // percentage
  }[];
  commonCitations: {
    caseName: string;
    count: number;
    type: string;
  }[];
  insights: string[];
  recentRulings: {
    id: string;
    date: string;
    caseName: string;
    outcome: 'Allowed' | 'Dismissed' | 'Partial';
    summary: string;
  }[];
  winRate: number; // For applicant/plaintiff
}

const MOCK_JUDGES: JudgeProfile[] = [
  {
    id: 'j-mabeya',
    name: 'Justice Alfred Mabeya',
    title: 'Presiding Judge',
    court: 'High Court - Commercial Division',
    image: 'https://picsum.photos/seed/mabeya/200/200',
    yearsExperience: 15,
    appointedDate: '2011',
    winRate: 42,
    rulingTendencies: [
      { category: 'Injunctions', allowed: 35, dismissed: 65 },
      { category: 'Commercial Disputes', allowed: 55, dismissed: 45 },
      { category: 'Insolvency', allowed: 60, dismissed: 40 },
    ],
    commonCitations: [
      { caseName: 'Nyutu Agrovet Limited v Airtel Networks Kenya Limited', count: 14, type: 'Arbitration' },
      { caseName: 'Giella v Cassman Brown', count: 42, type: 'Injunctions' },
      { caseName: 'Co-operative Bank of Kenya Ltd v Patrick Kangethe', count: 8, type: 'Banking' },
    ],
    insights: [
      'Strict adherence to procedural timelines in commercial matters.',
      'Favors written submissions over lengthy oral arguments.',
      'High threshold for granting ex-parte injunctions against banks.',
      'Often cites arbitration clauses to stay proceedings.'
    ],
    recentRulings: [
      { id: 'r1', date: '2024-02-15', caseName: 'TechCorp Ltd v Bank of Africa', outcome: 'Dismissed', summary: 'Application for injunction against sale of charged property denied due to non-disclosure of material facts.' },
      { id: 'r2', date: '2024-01-28', caseName: 'Global Traders v Logistics KE', outcome: 'Allowed', summary: 'Summary judgment entered for admitted debt.' },
      { id: 'r3', date: '2023-12-10', caseName: 'In Re: Insolvency of Retail Chain X', outcome: 'Partial', summary: 'Administration order granted but with stricter reporting conditions than requested.' },
    ]
  },
  {
    id: 'j-ngugi',
    name: 'Justice Mumbi Ngugi',
    title: 'Judge of Appeal',
    court: 'Court of Appeal',
    image: 'https://picsum.photos/seed/ngugi/200/200',
    yearsExperience: 12,
    appointedDate: '2011',
    winRate: 58,
    rulingTendencies: [
      { category: 'Constitutional Petitions', allowed: 65, dismissed: 35 },
      { category: 'Employment', allowed: 70, dismissed: 30 },
      { category: 'Judicial Review', allowed: 45, dismissed: 55 },
    ],
    commonCitations: [
      { caseName: 'Okiya Omtatah v Cabinet Secretary', count: 22, type: 'Public Interest' },
      { caseName: 'Randu Nzai Ruwa v Internal Security Minister', count: 15, type: 'Human Rights' },
    ],
    insights: [
      'Strong focus on human rights and constitutional interpretation.',
      'Known for progressive rulings on socio-economic rights.',
      'Detailed analysis of international conventions.',
      'Often rules against procedural technicalities that impede substantive justice.'
    ],
    recentRulings: [
      { id: 'r4', date: '2024-02-01', caseName: 'Community Land Trust v County Govt', outcome: 'Allowed', summary: 'Eviction order quashed for lack of public participation.' },
      { id: 'r5', date: '2024-01-12', caseName: 'Union of Doctors v Ministry of Health', outcome: 'Allowed', summary: 'Strike action declared protected.' },
    ]
  },
  {
    id: 'j-odunga',
    name: 'Justice George Odunga',
    title: 'Judge of Appeal',
    court: 'Court of Appeal',
    image: 'https://picsum.photos/seed/odunga/200/200',
    yearsExperience: 13,
    appointedDate: '2011',
    winRate: 48,
    rulingTendencies: [
      { category: 'Judicial Review', allowed: 60, dismissed: 40 },
      { category: 'Administrative Law', allowed: 55, dismissed: 45 },
      { category: 'Election Petitions', allowed: 30, dismissed: 70 },
    ],
    commonCitations: [
      { caseName: 'Republic v Kenya Revenue Authority ex parte...', count: 35, type: 'Tax' },
      { caseName: 'Pastoli v Kabale District Local Government', count: 12, type: 'Administrative' },
    ],
    insights: [
      'Extremely thorough on administrative procedure and fair administrative action.',
      'High volume of rulings; known for efficiency.',
      'Strict on statutory interpretation.',
      'Frequently quashes government decisions for procedural impropriety.'
    ],
    recentRulings: [
      { id: 'r6', date: '2024-02-20', caseName: 'Ex Parte Transport Assoc. v NTSA', outcome: 'Allowed', summary: 'Regulations declared null and void for lack of parliamentary approval.' },
    ]
  }
];

const COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#f59e0b'];

const JudicialAnalytics: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJudge, setSelectedJudge] = useState<JudgeProfile | null>(null);

  const filteredJudges = MOCK_JUDGES.filter(judge => 
    judge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    judge.court.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-ai-studio text-white overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/20 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Gavel className="w-6 h-6 text-primary" />
            Judicial Analytics
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Strategic intelligence on East African Judicial Officers
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search judges, courts, or magistrates..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {!selectedJudge ? (
          /* Search Results / Directory */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJudges.map(judge => (
              <motion.div
                key={judge.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedJudge(judge)}
                className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 cursor-pointer hover:border-primary/50 transition-all group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-primary transition-colors">
                    <img src={judge.image} alt={judge.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{judge.name}</h3>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mt-1">{judge.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{judge.court}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Experience</p>
                    <p className="font-mono font-bold">{judge.yearsExperience} Years</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Win Rate (Applicant)</p>
                    <p className={`font-mono font-bold ${judge.winRate > 50 ? 'text-green-500' : 'text-red-500'}`}>
                      {judge.winRate}%
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Detailed Judge Profile */
          <div className="max-w-7xl mx-auto space-y-6">
            <button 
              onClick={() => setSelectedJudge(null)}
              className="text-sm text-gray-400 hover:text-white flex items-center gap-2 mb-4"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to Directory
            </button>

            {/* Profile Header */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/5 shrink-0">
                <img src={selectedJudge.image} alt={selectedJudge.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                  <Scale className="w-3 h-3" />
                  {selectedJudge.court}
                </div>
                <h2 className="text-4xl font-bold mb-2">{selectedJudge.name}</h2>
                <p className="text-xl text-gray-400">{selectedJudge.title} • Appointed {selectedJudge.appointedDate}</p>
                
                <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                  <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-xs text-gray-500 mb-1">Avg. Ruling Length</p>
                    <p className="font-mono font-bold">24 Pages</p>
                  </div>
                  <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-xs text-gray-500 mb-1">Citations / Ruling</p>
                    <p className="font-mono font-bold">12.5</p>
                  </div>
                  <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-xs text-gray-500 mb-1">Reversal Rate</p>
                    <p className="font-mono font-bold text-green-500">18% (Low)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Ruling Tendencies Chart */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 lg:col-span-2">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Ruling Tendencies by Case Type
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={selectedJudge.rulingTendencies} layout="vertical" margin={{ left: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                      <XAxis type="number" stroke="#666" />
                      <YAxis dataKey="category" type="category" stroke="#fff" width={120} tick={{fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#000', borderColor: '#333' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Legend />
                      <Bar dataKey="allowed" name="Allowed (%)" fill="#22c55e" stackId="a" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="dismissed" name="Dismissed (%)" fill="#ef4444" stackId="a" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Strategic Insights */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Strategic Insights
                </h3>
                <ul className="space-y-4">
                  {selectedJudge.insights.map((insight, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Top Citations */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Most Cited Precedents
                </h3>
                <div className="space-y-4">
                  {selectedJudge.commonCitations.map((citation, i) => (
                    <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-primary/30 transition-colors cursor-pointer">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{citation.type}</span>
                        <span className="text-xs font-mono text-gray-500">{citation.count} citations</span>
                      </div>
                      <p className="text-sm font-medium line-clamp-2">{citation.caseName}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Rulings Table */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 lg:col-span-2">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Recent Rulings
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-xs text-gray-500 uppercase tracking-wider">
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Case Name</th>
                        <th className="py-3 px-4">Summary</th>
                        <th className="py-3 px-4">Outcome</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {selectedJudge.recentRulings.map((ruling) => (
                        <tr key={ruling.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 font-mono text-gray-400 whitespace-nowrap">{ruling.date}</td>
                          <td className="py-3 px-4 font-medium">{ruling.caseName}</td>
                          <td className="py-3 px-4 text-gray-400 max-w-xs truncate">{ruling.summary}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                              ruling.outcome === 'Allowed' ? 'bg-green-500/10 text-green-500' :
                              ruling.outcome === 'Dismissed' ? 'bg-red-500/10 text-red-500' :
                              'bg-yellow-500/10 text-yellow-500'
                            }`}>
                              {ruling.outcome === 'Allowed' && <CheckCircle2 className="w-3 h-3" />}
                              {ruling.outcome === 'Dismissed' && <XCircle className="w-3 h-3" />}
                              {ruling.outcome === 'Partial' && <AlertCircle className="w-3 h-3" />}
                              {ruling.outcome}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JudicialAnalytics;
