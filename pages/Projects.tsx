import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Map as MapIcon, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  DollarSign, 
  Search, 
  Filter, 
  ArrowRight, 
  Users, 
  Building2, 
  Handshake, 
  Image as ImageIcon, 
  PlayCircle, 
  MapPin, 
  TrendingUp, 
  History,
  LayoutGrid,
  ChevronRight,
  Info
} from 'lucide-react';
import { ProjectService, ProjectItem, ProjectStats as ProjectStatsData } from '../services/api';

const Projects: React.FC = () => {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'all';
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [stats, setStats] = useState<ProjectStatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('Tous');

    useEffect(() => {
        fetchData();
    }, [type]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [projData, statsData] = await Promise.all([
                type === 'all' ? ProjectService.getAll() : ProjectService.getByType(type),
                ProjectService.getStats()
            ]);
            setProjects(projData);
            setStats(statsData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['Tous', 'Construction de routes', 'Éclairage public', 'Réhabilitation écoles', 'Numérisation état civil', 'Infrastructures Sportives'];

    const filteredProjects = projects.filter(p => filterCategory === 'Tous' || p.category === filterCategory);

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'en_cours': return 'En cours';
            case 'realise': return 'Réalisé';
            case 'avenir': return 'À venir';
            default: return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'en_cours': return 'bg-blue-100 text-blue-700';
            case 'realise': return 'bg-emerald-100 text-emerald-700';
            case 'avenir': return 'bg-amber-100 text-amber-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="bg-[#fafafa] min-h-screen">
            
            {/* Header Section */}
            <div className="bg-primary text-white py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                            <Building2 className="h-3 w-3" /> Grands Projets Municipaux 2024
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-6 leading-none">
                            Transformons <br />
                            <span className="text-amber-400">Ziguinchor Ensemble</span>
                        </h1>
                        <p className="text-xl text-white/80 font-medium leading-relaxed mb-8">
                            Découvrez les investissements et les actions concrètes de la municipalité pour améliorer votre cadre de vie au quotidien.
                        </p>
                        
                        <div className="flex flex-wrap gap-4">
                            <button className="bg-white text-primary px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-105 transition flex items-center gap-2">
                                <Search className="h-5 w-5" /> Explorer les projets
                            </button>
                            <Link to="/participation" className="bg-primary-dark border-2 border-white/20 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition flex items-center gap-2">
                                <Users className="h-5 w-5" /> Participer au budget
                            </Link>
                        </div>
                    </motion.div>
                </div>
                
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-black/10 to-transparent opacity-50 pointer-events-none"></div>
            </div>

            <main className="max-w-7xl mx-auto px-6 -mt-12 pb-24 relative z-20">
                {/* Featured Strategic Projects Sections */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {[
                        { 
                            title: 'PAI', 
                            name: 'Programme Annuel', 
                            desc: 'Les projets prioritaires de l’année budgétaire en cours.', 
                            icon: Calendar, 
                            link: '/projets/pai',
                            color: 'from-blue-600 to-indigo-600'
                        },
                        { 
                            title: 'PTI', 
                            name: 'Programme Triennal', 
                            desc: 'Vision stratégique et investissements sur 3 ans.', 
                            icon: TrendingUp, 
                            link: '/projets/pti',
                            color: 'from-amber-500 to-orange-600'
                        },
                        { 
                            title: 'Coopération', 
                            name: 'Décentralisée', 
                            desc: 'Alliances et partenariats internationaux.', 
                            icon: Handshake, 
                            link: '/projets/cooperation',
                            color: 'from-emerald-500 to-green-600'
                        }
                    ].map((sec, i) => (
                        <Link 
                            key={i}
                            to={sec.link}
                            className="group relative overflow-hidden bg-white rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 border border-white"
                        >
                            <div className={`h-2 bg-gradient-to-r ${sec.color}`} />
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                                        <sec.icon className="h-8 w-8" />
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{sec.title}</div>
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2 group-hover:text-primary transition">{sec.name}</h3>
                                <p className="text-sm font-medium text-gray-500 leading-relaxed mb-6">
                                    {sec.desc}
                                </p>
                                <div className="flex items-center text-xs font-black uppercase tracking-widest text-primary gap-2">
                                    Consulter le programme <ArrowRight className="h-4 w-4 transform group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                            <div className={`absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br ${sec.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-full`} />
                        </Link>
                    ))}
                </div>

                {/* Quick Stats Overlay */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    {[
                        { label: 'Projets Totaux', value: stats?.total_count || 0, icon: LayoutGrid, color: 'text-primary' },
                        { label: 'Budget Engagé', value: (stats?.total_budget?.toLocaleString() || '0') + ' FCFA', icon: DollarSign, color: 'text-amber-500' },
                        { label: 'Objectifs Atteints', value: stats?.completed_count || 0, icon: CheckCircle2, color: 'text-emerald-500' },
                        { label: 'En Retard', value: stats?.delayed_count || 0, icon: Clock, color: 'text-rose-500' }
                    ].map((stat, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-black/5 border border-white flex flex-col items-center text-center"
                        >
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-4 ${stat.color} bg-current/10`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div className="text-2xl font-black tracking-tighter mb-1">{stat.value}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Filters & Tabs */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                    <div className="flex bg-white p-1.5 rounded-[2rem] shadow-sm border border-gray-100">
                        {[
                            { id: 'all', label: 'Tout', icon: LayoutGrid },
                            { id: 'en_cours', label: 'En cours', icon: Clock },
                            { id: 'realise', label: 'Réalisés', icon: CheckCircle2 },
                            { id: 'avenir', label: 'À venir', icon: Calendar }
                        ].map((t) => (
                            <Link 
                                key={t.id}
                                to={t.id === 'all' ? '/projets' : `/projets?type=${t.id}`}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                                    type === t.id ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'text-gray-400 hover:text-gray-900'
                                }`}
                            >
                                <t.icon className="h-4 w-4" />
                                {t.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 bg-white px-6 py-2 rounded-2xl border border-gray-100 shadow-sm">
                        <Filter className="h-4 w-4 text-gray-400" />
                        <select 
                            className="bg-transparent border-none text-xs font-black uppercase tracking-widest focus:ring-0 cursor-pointer text-gray-600"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="bg-white h-[500px] rounded-[3rem] animate-pulse"></div>
                            ))
                        ) : filteredProjects.length > 0 ? (
                            filteredProjects.map((project, i) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={project.id}
                                    className="bg-white rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group border border-gray-50 flex flex-col"
                                >
                                    <div className="h-64 relative overflow-hidden">
                                        <img 
                                            src={project.image_url} 
                                            alt={project.title} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                                        />
                                        <div className="absolute top-8 left-8">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${getStatusColor(project.status)}`}>
                                                {getStatusLabel(project.status)}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-8 right-8">
                                            <div className="bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl flex items-center gap-3">
                                                <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                    <TrendingUp className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Avancement</div>
                                                    <div className="text-sm font-black italic">{project.progress_pct}%</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-10 flex-grow flex flex-col">
                                        <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">{project.category}</div>
                                        <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic leading-none mb-4 group-hover:text-primary transition">
                                            {project.title}
                                        </h3>
                                        <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8 line-clamp-3">
                                            {project.description}
                                        </p>
                                        
                                        <div className="mt-auto space-y-6 pt-8 border-t border-gray-50">
                                            <div className="flex justify-between items-center text-xs font-bold">
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <MapPin className="h-4 w-4" />
                                                    {project.location_name}
                                                </div>
                                                <div className="text-gray-900 border-b-2 border-amber-400 pb-0.5 font-black uppercase tracking-tighter italic">
                                                    {project.budget}
                                                </div>
                                            </div>

                                            <Link 
                                                to={`/projets/${project.id}`}
                                                className="w-full flex items-center justify-between bg-gray-50 hover:bg-primary text-gray-900 hover:text-white px-8 py-5 rounded-3xl font-black uppercase tracking-widest transition-all group/btn shadow-sm"
                                            >
                                                Voir les détails
                                                <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-32 text-center">
                                <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                    <Search className="h-10 w-10" />
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Aucun projet trouvé</h3>
                                <p className="text-gray-500 font-medium">Réessayez avec une autre catégorie ou un autre filtre.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Section Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
                     {[
                         { title: 'Nos Partenaires', desc: 'Bailleurs et ONG qui nous accompagnent.', icon: Handshake, link: '/projets/partenaires' },
                         { title: 'Carte Interactive', desc: 'Localisez les réalisations près de chez vous.', icon: MapIcon, link: '/projets/carte' },
                         { title: 'Galerie Média', desc: 'Photos et vidéos du terrain en haute résolution.', icon: ImageIcon, link: '/projets/galerie' }
                     ].map((box, i) => (
                         <Link 
                            key={i} 
                            to={box.link}
                            className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition duration-500 group flex flex-col items-center text-center"
                         >
                            <div className="h-20 w-20 bg-gray-50 text-gray-400 group-hover:bg-primary group-hover:text-white rounded-[2rem] flex items-center justify-center mb-8 transition-colors duration-500">
                                <box.icon className="h-10 w-10" />
                            </div>
                            <h4 className="text-2xl font-black uppercase italic tracking-tighter mb-4 group-hover:text-primary transition">{box.title}</h4>
                            <p className="text-sm font-medium text-gray-500 mb-8 leading-relaxed">{box.desc}</p>
                            <div className="mt-auto inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                                Découvrir <ChevronRight className="h-4 w-4" />
                            </div>
                         </Link>
                     ))}
                </div>
            </main>
        </div>
    );
};

export default Projects;
