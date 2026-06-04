import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ArrowUpRight,
  Target,
  Users,
  Activity,
  FileText
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area
} from 'recharts';
import { ProjectService, ProjectItem, ProjectStats as StatsType } from '../services/api';

const ProjectStats: React.FC = () => {
    const [stats, setStats] = useState<StatsType | null>(null);
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [s, p] = await Promise.all([
                ProjectService.getStats(),
                ProjectService.getAll()
            ]);
            setStats(s);
            setProjects(p);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const categoryData = (Array.isArray(projects) ? projects : []).reduce((acc: any[], curr) => {
        const found = acc.find(a => a.name === curr.category);
        if (found) found.value++;
        else acc.push({ name: curr.category, value: 1 });
        return acc;
    }, []);

    const statusData = [
        { name: 'Réalisés', value: stats?.completed_count || 0, color: '#10b981' },
        { name: 'En cours', value: (stats?.total_count || 0) - (stats?.completed_count || 0) - ((Array.isArray(projects) ? projects : []).filter(p => p.status === 'avenir').length), color: '#3b82f6' },
        { name: 'À venir', value: (Array.isArray(projects) ? projects : []).filter(p => p.status === 'avenir').length, color: '#f59e0b' }
    ];

    const timelineData = [
        { month: 'Jan', budget: 45, projects: 2 },
        { month: 'Fev', budget: 52, projects: 3 },
        { month: 'Mar', budget: 38, projects: 1 },
        { month: 'Avr', budget: 65, projects: 5 },
        { month: 'Mai', budget: 48, projects: 4 },
        { month: 'Juin', budget: 59, projects: 3 }
    ];

    const COLORS = ['#059669', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#f97316'];

    return (
        <div className="bg-[#fafafa] min-h-screen">
            
            <div className="bg-gray-900 text-white py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                            <Activity className="h-3 w-3" /> Performance Municipale 2024
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-6 leading-none">
                            Suivi & <br />
                            <span className="text-primary">Statistiques</span>
                        </h1>
                        <p className="text-xl text-gray-400 font-medium leading-relaxed">
                            Analyse en temps réel de notre investissement public. Chiffres clés, répartitions budgétaires et indicateurs de réussite.
                        </p>
                    </motion.div>
                </div>
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                    <div className="h-full w-full" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 -mt-16 pb-24 relative z-20">
                {/* Top KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { title: 'Budget Global', value: stats?.total_budget?.toLocaleString() || '420M', sub: '+12% vs 2023', icon: DollarSign, color: 'text-primary' },
                        { title: 'Taux Réussite', value: stats ? Math.round((stats.completed_count / stats.total_count) * 100) : 85, sub: '% de complétion', icon: Target, color: 'text-emerald-500' },
                        { title: 'Projets Actifs', value: (stats?.total_count || projects.length) - (stats?.completed_count || 0), sub: 'En phase d\'exécution', icon: Clock, color: 'text-blue-500' },
                        { title: 'Retard Alerte', value: stats?.delayed_count || 2, sub: 'Nécessite attention', icon: AlertTriangle, color: 'text-rose-500' }
                    ].map((card, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-10 rounded-[3rem] shadow-xl shadow-black/5 border border-white group hover:scale-[1.03] transition-transform duration-500"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${card.color} bg-current/10 transition-colors group-hover:bg-current group-hover:text-white`}>
                                    <card.icon className="h-7 w-7" />
                                </div>
                                <ArrowUpRight className="h-5 w-5 text-gray-300 transition-colors group-hover:text-primary" />
                            </div>
                            <div className="text-3xl font-black tracking-tighter mb-1">{i === 0 && 'FCFA '}{card.value}{i === 1 && '%'}</div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">{card.title}</div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full w-fit">
                                {card.sub}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Distribution by Category */}
                    <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-gray-100 flex flex-col">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Répartition par thématique</h3>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Nombre de projets par secteur</div>
                            </div>
                            <BarChart3 className="h-6 w-6 text-gray-300" />
                        </div>
                        
                        <div className="h-[400px] w-full">
    <ResponsiveContainer width="100%" height="100%">
        <BarChart data={categoryData} layout="vertical">
            
            <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#f1f5f9"
            />

            <XAxis type="number" hide />

            <YAxis
                dataKey="name"
                type="category"
                width={150}
                axisLine={false}
                tickLine={false}
                tick={{
                    fill: '#94a3b8',
                    fontSize: 10,
                    fontWeight: 900
                }}
                tickFormatter={(value) => value.toUpperCase()}
            />

            <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{
                    borderRadius: '24px',
                    border: 'none',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    padding: '16px'
                }}
            />

            <Bar
                dataKey="value"
                radius={[0, 12, 12, 0]}
                barSize={24}
            >
                {categoryData.map((entry, index) => (
                    <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                    />
                ))}
            </Bar>

        </BarChart>
    </ResponsiveContainer>
</div>
                    </div>

                    {/* Status Overview */}
                    <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-gray-100 flex flex-col">
                         <div className="flex items-center justify-between mb-12">
                            <div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter">État d'avancement Global</h3>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Équilibre entre types de projets</div>
                            </div>
                            <PieIcon className="h-6 w-6 text-gray-300" />
                        </div>

                        <div className="h-[400px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={12}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                <div className="text-4xl font-black tracking-tighter italic">{stats?.total_count || (Array.isArray(projects) ? projects.length : 0)}</div>
                                <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Projets</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-8">
                            {statusData.map((s, i) => (
                                <div key={i} className="text-center p-4 bg-gray-50 rounded-3xl">
                                    <div className="h-2 w-2 rounded-full mx-auto mb-2" style={{ backgroundColor: s.color }}></div>
                                    <div className="text-xs font-black uppercase mb-1">{s.value}</div>
                                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{s.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Budget Timeline */}
                    <div className="lg:col-span-2 bg-white p-12 rounded-[4rem] shadow-sm border border-gray-100">
                         <div className="flex items-center justify-between mb-16">
                            <div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Évolution de l'Investissement</h3>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Dépenses engagées par mois (Millions FCFA)</div>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest">Année 2024</button>
                                <button className="px-4 py-2 bg-gray-50 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest">Export CSV</button>
                            </div>
                        </div>

                        <div className="h-[400px] w-full">
    <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={timelineData}>

            <defs>
                <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                </linearGradient>
            </defs>

            <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
            />

            <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                    fill: '#94a3b8',
                    fontSize: 10,
                    fontWeight: 900
                }}
                tickFormatter={(value) => value.toUpperCase()}
                dy={20}
            />

            <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                    fill: '#94a3b8',
                    fontSize: 10,
                    fontWeight: 900
                }}
            />

            <Tooltip />

            <Area
                type="monotone"
                dataKey="budget"
                stroke="#059669"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorBudget)"
            />

        </AreaChart>
    </ResponsiveContainer>
</div>
                    </div>
                </div>

                {/* Additional Info Table-style */}
                <div className="mt-12 bg-white p-12 rounded-[4rem] shadow-sm border border-gray-100 overflow-hidden">
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-12">Rapport d'activité récent</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-medium text-sm">
                            <thead className="border-b border-gray-100">
                                <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <th className="pb-6 px-4">Projet</th>
                                    <th className="pb-6 px-4">Rubrique</th>
                                    <th className="pb-6 px-4">État</th>
                                    <th className="pb-6 px-4">Avancement</th>
                                    <th className="pb-6 px-4 text-right">Budget</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(Array.isArray(projects) ? projects : []).slice(0, 5).map((p, i) => (
                                    <tr key={i} className="group border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition">
                                        <td className="py-6 px-4 font-black italic">{p.title}</td>
                                        <td className="py-6 px-4 flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary/40"></div> {p.category}</td>
                                        <td className="py-6 px-4">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                                p.status === 'realise' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                                p.status === 'en_cours' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                                'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{ width: `${p.progress_pct}%` }}></div>
                                                </div>
                                                <span className="text-[10px] font-black">{p.progress_pct}%</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4 text-right font-black uppercase tracking-tighter text-gray-900">{p.budget}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProjectStats;
