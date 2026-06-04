import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Clock, 
  History,
  Target,
  Image as ImageIcon,
  BarChart3,
  Share2,
  Printer,
  ChevronRight,
  Handshake,
  Video,
  FileText
} from 'lucide-react';
import { ProjectService, ProjectItem } from '../services/api';

const ProjectDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<ProjectItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchProject(parseInt(id));
        }
    }, [id]);

    const fetchProject = async (projectId: number) => {
        try {
            const data = await ProjectService.getById(projectId);
            setProject(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
    if (!project) return <div className="h-screen flex flex-col items-center justify-center bg-gray-50"><h2 className="text-2xl font-black mb-4">Projet Introuvable</h2><Link to="/projets" className="text-primary font-bold">Retour aux projets</Link></div>;

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'en_cours': return 'Projet en cours';
            case 'realise': return 'Projet réalisé';
            case 'avenir': return 'Projet programmé';
            default: return status;
        }
    };

    return (
        <div className="bg-[#fafafa] min-h-screen">
            
            {/* Project Hero Header */}
            <div className="relative h-[70vh] min-h-[600px] overflow-hidden">
                <img src={project.image_url} alt={project.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                
                <div className="absolute inset-0 flex flex-col justify-end pb-24">
                     <div className="max-w-7xl mx-auto px-6 w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <button 
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-white/70 hover:text-white font-black uppercase tracking-widest text-[10px] mb-8 group"
                            >
                                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition" />
                                Retour aux projets
                            </button>
                            
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <span className="px-5 py-2 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                                    {project.category}
                                </span>
                                <span className="px-5 py-2 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {getStatusLabel(project.status)}
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter text-white leading-none mb-8 max-w-4xl">
                                {project.title}
                            </h1>

                            <div className="flex flex-wrap gap-12 text-white/80">
                                <div className="flex flex-col gap-2">
                                    <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Localisation</div>
                                    <div className="flex items-center gap-2 font-black italic">
                                        <MapPin className="h-4 w-4 text-primary" /> {project.location_name}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 border-l border-white/20 pl-12">
                                    <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Budget Alloué</div>
                                    <div className="flex items-center gap-2 font-black italic text-2xl text-amber-400">
                                        {project.budget}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 border-l border-white/20 pl-12">
                                    <div className="text-[10px] font-black uppercase tracking-widest opacity-60">État d'avancement</div>
                                    <div className="flex items-center gap-2 font-black italic text-2xl">
                                        <TrendingUp className="h-5 w-5 text-emerald-400" /> {project.progress_pct}%
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                     </div>
                </div>
                
                {/* Actions float */}
                <div className="absolute top-12 right-12 flex gap-4">
                    <button className="h-14 w-14 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white transition">
                        <Share2 className="h-6 w-6" />
                    </button>
                    <button className="h-14 w-14 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white transition">
                        <Printer className="h-6 w-6" />
                    </button>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-24">
                        {/* Summary */}
                        <section className="space-y-12">
                            <div className="h-1.5 w-24 bg-primary rounded-full"></div>
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Présentation <br /> <span className="text-primary italic">du projet</span></h2>
                            <div className="prose prose-xl font-medium text-gray-500 leading-relaxed max-w-none">
                                {project.description}
                            </div>
                        </section>

                        {/* Specific Sections based on Status */}
                        {project.status === 'en_cours' && (
                             <section className="bg-white rounded-[4rem] p-16 shadow-sm border border-gray-100 space-y-12">
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                                    <Clock className="h-6 w-6 text-primary" /> État d'avancement réel
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Progression globale</span>
                                        <span className="text-4xl font-black italic text-primary">{project.progress_pct}%</span>
                                    </div>
                                    <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${project.progress_pct}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full bg-primary"
                                        ></motion.div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Dernière Mise à jour</h4>
                                        <p className="font-bold">{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Livraison estimée</h4>
                                        <p className="font-bold">Fin 2024</p>
                                    </div>
                                </div>
                             </section>
                        )}

                        {project.status === 'realise' && (
                            <section className="space-y-16">
                                <div className="bg-emerald-50 rounded-[4rem] p-16 border border-emerald-100">
                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-4 mb-12 text-emerald-900">
                                        <CheckCircle2 className="h-6 w-6 text-emerald-600" /> Résultats obtenus
                                    </h3>
                                    <div className="prose prose-lg text-emerald-800 font-medium">
                                        {project.results || "Ce projet a été finalisé avec succès, respectant l'ensemble des indicateurs de performance et de qualité définis lors des études préliminaires."}
                                    </div>
                                    <div className="mt-12 flex items-center gap-4 text-emerald-700/60 font-black uppercase tracking-widest text-[10px]">
                                        <Calendar className="h-4 w-4" /> Date de livraison : {project.completion_date || "Mars 2024"}
                                    </div>
                                </div>

                                {project.photo_before && project.photo_after && (
                                     <div className="space-y-8">
                                        <h3 className="text-2xl font-black uppercase italic tracking-tighter">Impact <span className="text-primary italic">Visuel</span></h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="relative rounded-[3rem] overflow-hidden group">
                                                <img src={project.photo_before} className="w-full h-80 object-cover" alt="Avant" />
                                                <div className="absolute top-8 left-8 py-2 px-6 bg-black/60 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest">AVANT</div>
                                            </div>
                                            <div className="relative rounded-[3rem] overflow-hidden group">
                                                <img src={project.photo_after} className="w-full h-80 object-cover" alt="Après" />
                                                <div className="absolute top-8 left-8 py-2 px-6 bg-emerald-600 rounded-full text-white text-[10px] font-black uppercase tracking-widest">APRÈS</div>
                                            </div>
                                        </div>
                                     </div>
                                )}
                            </section>
                        )}

                        {project.status === 'avenir' && (
                             <section className="bg-amber-50 rounded-[4rem] p-16 border border-amber-100 space-y-16">
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-4 text-amber-900">
                                    <Calendar className="h-6 w-6 text-amber-600" /> Planification prévisionnelle
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="p-8 bg-white/50 rounded-3xl space-y-4">
                                        <div className="text-[10px] font-black uppercase text-amber-600 tracking-widest">Études en cours</div>
                                        <p className="font-bold text-lg text-amber-900">{project.studies_in_progress || "Études d'impact environnemental et social."}</p>
                                    </div>
                                    <div className="p-8 bg-white/50 rounded-3xl space-y-4">
                                        <div className="text-[10px] font-black uppercase text-amber-600 tracking-widest">Investissement prévu</div>
                                        <p className="font-bold text-lg text-amber-900">{project.future_investments || "Matériel technique et main d'œuvre locale."}</p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                     <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">Calendrier des étapes</h4>
                                     <div className="space-y-6">
                                         {[
                                             { step: 'Appel d\'offres', date: 'Sept 2024', status: 'ready' },
                                             { step: 'Sélection prestataire', date: 'Oct 2024', status: 'pending' },
                                             { step: 'Début des travaux', date: 'Janv 2025', status: 'pending' }
                                         ].map((item, i) => (
                                             <div key={i} className="flex items-center gap-6 group">
                                                 <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black ${item.status === 'ready' ? 'bg-amber-600 text-white' : 'bg-amber-200 text-amber-600'}`}>
                                                     {i + 1}
                                                 </div>
                                                 <div className="flex-grow flex justify-between items-center border-b border-amber-200/50 pb-4">
                                                    <div className="font-black uppercase italic text-amber-900">{item.step}</div>
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-amber-600/60">{item.date}</div>
                                                 </div>
                                             </div>
                                         ))}
                                     </div>
                                </div>
                             </section>
                        )}

                        <section className="space-y-12">
                            <h3 className="text-3xl font-black uppercase italic tracking-tighter">Contenus <span className="text-primary italic">Additionnels</span></h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex items-center gap-8">
                                    <div className="h-16 w-16 bg-gray-50 text-gray-400 group-hover:bg-primary group-hover:text-white rounded-2xl flex items-center justify-center transition">
                                        <Video className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <div className="text-xl font-black uppercase italic tracking-tighter mb-1">Visite Virtuelle</div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Vidéo 360° du site</div>
                                    </div>
                                </div>
                                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex items-center gap-8">
                                    <div className="h-16 w-16 bg-gray-50 text-gray-400 group-hover:bg-primary group-hover:text-white rounded-2xl flex items-center justify-center transition">
                                        <FileText className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <div className="text-xl font-black uppercase italic tracking-tighter mb-1">Fiche PDF</div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cahier des charges</div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-16">
                        {/* Partners */}
                        <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-gray-100">
                             <div className="flex items-center gap-4 mb-10">
                                <div className="h-12 w-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                                    <Handshake className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-black uppercase italic tracking-tighter">Financeurs</h3>
                             </div>
                             <div className="space-y-6">
                                 {project.partners?.split(',').map((p, i) => (
                                     <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 transition group">
                                         <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-sm overflow-hidden p-2">
                                            <img src={`https://via.placeholder.com/100?text=${p.trim()}`} alt={p} className="h-full w-auto grayscale group-hover:grayscale-0 transition" />
                                         </div>
                                         <span className="font-black uppercase italic text-xs tracking-tighter">{p.trim()}</span>
                                     </div>
                                 )) || (
                                     <div className="text-gray-400 font-bold italic text-sm">Financement propre Municipalité</div>
                                 )}
                             </div>
                             <Link to="/projets/partenaires" className="mt-10 w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:border-primary hover:text-primary transition">
                                Dossier Partenaires <ChevronRight className="h-4 w-4" />
                             </Link>
                        </div>

                        {/* Stats mini */}
                        <div className="bg-gray-900 rounded-[3.5rem] p-10 text-white space-y-10">
                            <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                                <BarChart3 className="h-6 w-6 text-primary" /> Data Flash
                            </h3>
                            <div className="space-y-8">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Emplois créés</span>
                                    <span className="text-2xl font-black italic text-primary">+24</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Bénéficiaires</span>
                                    <span className="text-2xl font-black italic text-amber-400">12K</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Maintenance</span>
                                    <span className="text-2xl font-black italic text-emerald-400">Garantie</span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive map prompt */}
                        <Link to="/projets/carte" className="block relative h-64 rounded-[3.5rem] overflow-hidden group">
                             <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2666&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-1000" alt="Map" />
                             <div className="absolute inset-0 bg-black/60 group-hover:bg-primary/80 transition duration-700 flex flex-col items-center justify-center p-8 text-center text-white">
                                <MapPin className="h-10 w-10 mb-4" />
                                <div className="text-xl font-black uppercase italic tracking-tighter mb-2">Voir sur la carte</div>
                                <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Visualiser l'impact local</div>
                             </div>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProjectDetail;
