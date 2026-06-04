
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, 
  TrendingUp, 
  Briefcase, 
  Calendar, 
  MapPin, 
  PieChart, 
  CheckCircle2, 
  Clock,
  Route,
  Droplets,
  Lightbulb,
  GraduationCap as School,
  Hospital,
  Store,
  Trees,
  ChevronDown,
  Check,
  X
} from 'lucide-react';

const ProjectPAI: React.FC = () => {
    const domains = [
        { 
            name: 'Voirie et routes', 
            icon: Route, 
            color: 'text-blue-500', 
            bg: 'bg-blue-50',
            desc: 'Amélioration du réseau routier urbain et facilitation de la circulation entre les quartiers.'
        },
        { 
            name: 'Éclairage public', 
            icon: Lightbulb, 
            color: 'text-amber-500', 
            bg: 'bg-amber-50',
            desc: 'Sécurisation des espaces publics et extension de l’éclairage dans les zones périphériques.'
        },
        { 
            name: 'Assainissement', 
            icon: Droplets, 
            color: 'text-cyan-500', 
            bg: 'bg-cyan-50',
            desc: 'Gestion des eaux pluviales et amélioration du système de drainage pour prévenir les inondations.'
        },
        { 
            name: 'Équipements scolaires', 
            icon: School, 
            color: 'text-indigo-500', 
            bg: 'bg-indigo-50',
            desc: 'Réhabilitation des salles de classe et dotation en matériel pédagogique pour nos écoles.'
        },
        { 
            name: 'Santé communautaire', 
            icon: Hospital, 
            color: 'text-rose-500', 
            bg: 'bg-rose-50',
            desc: 'Mise aux normes des postes de santé et renforcement de l’accès aux soins de proximité.'
        },
        { 
            name: 'Marchés municipaux', 
            icon: Store, 
            color: 'text-orange-500', 
            bg: 'bg-orange-50',
            desc: 'Modernisation des étals et amélioration de l’hygiène dans les lieux de commerce.'
        },
        { 
            name: 'Espaces publics', 
            icon: Trees, 
            color: 'text-emerald-500', 
            bg: 'bg-emerald-50',
            desc: 'Aménagement de parcs et de lieux de détente pour améliorer le cadre de vie urbain.'
        },
    ];

    const [expandedDomain, setExpandedDomain] = React.useState<number | null>(null);

    const projectExamples: {[key: string]: string[]} = {
        'Voirie et routes': ['Bitumage Voie de Contournement', 'Pavage Rues du centre-ville', 'Réhabilitation Route de l\'Université'],
        'Éclairage public': ['Installation 200 lampadaires solaires à Néma', 'Extension réseau électrique Boucotte', 'Modernisation éclairage Place de France'],
        'Assainissement': ['Construction canal de drainage Néma-Escale', 'Latrines publiques Marché central', 'Curage des caniveaux Tilène'],
        'Équipements scolaires': ['Réfection École Élémentaire Boucotte Ouest', 'Murs de clôture École Néma 2', 'Dotation tables-bancs Lycée Djignabo'],
        'Santé communautaire': ['Maternité Poste de Santé Tilène', 'Inauguration case de santé Diabir', 'Équipements bio-médicaux CMS'],
        'Marchés municipaux': ['Rénovation étals Marché St-Maur', 'Sécurisation incendie Grand Marché', 'Assainissement Marché Tilène'],
        'Espaces publics': ['Aménagement Square des martyrs', 'Jardins publics Escale', 'Espace Jeunesse Lindiane']
    };

    const stats = [
        { label: 'Budget annuel', value: '450M FCFA', icon: Briefcase, color: 'text-primary' },
        { label: 'Taux d’exécution', value: '68%', icon: TrendingUp, color: 'text-emerald-500' },
        { label: 'Projets réalisés', value: '12', icon: CheckCircle2, color: 'text-blue-500' },
        { label: 'Projets en cours', value: '8', icon: Clock, color: 'text-amber-500' },
    ];

    return (
        <div className="bg-[#fafafa] min-h-screen">
            {/* Hero Section */}
            <div className="bg-primary text-white py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                            <Target className="h-3 w-3" /> Planification Annuelle
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-6 leading-none">
                            PAI — Programme <br />
                            <span className="text-amber-400">Annuel d’Investissement</span>
                        </h1>
                        <p className="text-xl text-white/80 font-medium leading-relaxed">
                            Le Programme Annuel d’Investissement (PAI) regroupe les projets prioritaires réalisés sur une année budgétaire afin d’améliorer les infrastructures et les services municipaux.
                        </p>
                    </motion.div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 -mt-12 pb-24 relative z-20">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    {stats.map((stat, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-black/5 border border-white flex flex-col items-center text-center"
                        >
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-4 ${stat.color} bg-current/10`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div className="text-2xl font-black tracking-tighter mb-1">{stat.value}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Domains Column */}
                    <div className="lg:col-span-1 space-y-8">
                        <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-50">
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-8 flex items-center gap-3">
                                <span className="h-2 w-8 bg-amber-400 rounded-full"></span>
                                Domaines concernés
                            </h2>
                            <div className="space-y-4">
                                {domains.map((domain, i) => (
                                    <div key={domain.name} className="flex flex-col">
                                        <button 
                                            onClick={() => setExpandedDomain(expandedDomain === i ? null : i)}
                                            className={`p-6 rounded-2xl transition-all group text-left w-full ${expandedDomain === i ? 'bg-primary text-white shadow-lg' : 'bg-gray-50 hover:bg-white hover:shadow-md'}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`h-10 w-10 ${expandedDomain === i ? 'bg-white/20 text-white' : domain.bg + ' ' + domain.color} rounded-xl flex items-center justify-center transition-colors`}>
                                                        <domain.icon className="h-5 w-5" />
                                                    </div>
                                                    <span className={`text-sm font-extrabold ${expandedDomain === i ? 'text-white' : 'text-gray-900 group-hover:text-primary'}`}>{domain.name}</span>
                                                </div>
                                                <ChevronDown className={`h-4 w-4 transition-transform ${expandedDomain === i ? 'rotate-180 text-white' : 'text-gray-400'}`} />
                                            </div>
                                            <AnimatePresence>
                                                {expandedDomain === i && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="mt-4 pt-4 border-t border-white/20"
                                                    >
                                                        <p className="text-xs font-medium leading-relaxed mb-4 text-white/80">
                                                            {domain.desc}
                                                        </p>
                                                        <div className="space-y-2">
                                                            <div className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-2">Exemples de réalisations :</div>
                                                            {projectExamples[domain.name]?.map((ex, idx) => (
                                                                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-white/10 border border-white/5 text-[11px] font-bold">
                                                                    <Check className="h-3 w-3 text-amber-400" />
                                                                    {ex}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-primary text-white p-10 rounded-[3rem] shadow-xl relative overflow-hidden">
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-6 relative z-10">Calendrier des travaux</h2>
                            <div className="space-y-6 relative z-10">
                                {[
                                    { date: 'Juin 2024', event: 'Lancement voirie Tilène' },
                                    { date: 'Août 2024', event: 'Éclairage Néma 2' },
                                    { date: 'Oct. 2024', event: 'Inauguration Marché' }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="text-amber-400 font-black text-xs uppercase whitespace-nowrap pt-1">{item.date}</div>
                                        <div className="text-sm font-medium border-l-2 border-white/20 pl-4">{item.event}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="absolute -bottom-10 -right-10 opacity-10">
                                <Calendar className="h-40 w-40" />
                            </div>
                        </section>
                    </div>

                    {/* Neighborhoods & Projects */}
                    <div className="lg:col-span-2 space-y-12">
                        <section className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-gray-50">
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-10 flex items-center gap-4">
                                <PieChart className="h-8 w-8 text-primary" />
                                Quartiers au cœur de l'investissement
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {['Boucotte', 'Néma', 'Escale', 'Tilène', 'Lindiane', 'Diabir'].map((q, i) => (
                                    <div key={q} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-3 group hover:border-primary transition">
                                        <MapPin className="h-5 w-5 text-gray-400 group-hover:text-primary transition" />
                                        <span className="font-bold text-gray-700">{q}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-8">Derniers projets PAI</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                    { title: 'Paving de la rue de Boucotte', status: 'Réalisé', progress: 100, image: 'https://images.unsplash.com/photo-1541625602330-2277a1cd13a1?auto=format&fit=crop&q=80' },
                                    { title: 'Éclairage LED Néma', status: 'En cours', progress: 75, image: 'https://images.unsplash.com/photo-1517404215738-15263e9f9178?auto=format&fit=crop&q=80' }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 group">
                                        <div className="h-48 relative overflow-hidden">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                            <div className="absolute top-4 left-4">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${item.progress === 100 ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-8">
                                            <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4">{item.title}</h3>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary" style={{ width: `${item.progress}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProjectPAI;
