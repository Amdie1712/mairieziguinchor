
import React from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  Map as MapIcon, 
  Globe, 
  Leaf, 
  Building2, 
  LineChart, 
  Users, 
  ArrowRight,
  Shield,
  Smartphone,
  School,
  Hospital,
  Route
} from 'lucide-react';

const ProjectPTI: React.FC = () => {
    const objectives = [
        { 
            title: 'Modernisation urbaine', 
            icon: Building2, 
            color: 'text-blue-500', 
            bg: 'bg-blue-50',
            desc: 'Refonte du plan d’urbanisme pour une ville plus aérée, connectée et dotée d’infrastructures de dernière génération.'
        },
        { 
            title: 'Développement durable', 
            icon: Leaf, 
            color: 'text-emerald-500', 
            bg: 'bg-emerald-50',
            desc: 'Intégration systématique des enjeux écologiques dans tous nos projets : reboisement urbain et énergies propres.'
        },
        { 
            title: 'Extension des infrastructures', 
            icon: MapIcon, 
            color: 'text-indigo-500', 
            bg: 'bg-indigo-50',
            desc: 'Accès universel aux services de base par l’extension des réseaux d’eau, d’électricité et d’Internet dans tous les quartiers.'
        },
        { 
            title: 'Amélioration des services sociaux', 
            icon: Users, 
            color: 'text-rose-500', 
            bg: 'bg-rose-50',
            desc: 'Renforcement de l’offre éducative et sanitaire, et soutien accru aux populations les plus vulnérables.'
        },
        { 
            title: 'Développement économique local', 
            icon: LineChart, 
            color: 'text-amber-500', 
            bg: 'bg-amber-50',
            desc: 'Création d’un écosystème favorable à l’entrepreneuriat et à l’emploi des jeunes pour booster la richesse communale.'
        },
    ];

    const [expandedType, setExpandedType] = React.useState<number | null>(null);

    const projectTypes = [
        { 
            name: 'Construction d’infrastructures', 
            icon: Building2,
            projects: ['Siège de la mairie annexe de Boucotte', 'Nouveau centre culturel régional', 'Modernisation de la gare routière']
        },
        { 
            name: 'Centres de santé', 
            icon: Hospital,
            projects: ['Construction du poste de santé de Néma 2', 'Unité de maternité spécialisée à Tilène', 'Renforcement du plateau technique communal']
        },
        { 
            name: 'Écoles et équipements éducatifs', 
            icon: School,
            projects: ['Lycée technique d’excellence de Diabir', 'Bibliothèque municipale et médiathèque', 'Réhabilitation de 10 écoles élémentaires']
        },
        { 
            name: 'Routes et drainage', 
            icon: Route,
            projects: ['Bitumage de l’axe Tilène-Boucotte', 'Aménagement du canal de drainage de Néma', 'Paving des rues du centre-ville (Escale)']
        },
        { 
            name: 'Numérisation des services municipaux', 
            icon: Smartphone,
            projects: ['Application citoyenne "Ziguinchor en poche"', 'Guichet unique 100% dématérialisé', 'Système de gestion budgétaire transparent']
        },
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
                            <Compass className="h-3 w-3" /> Vision Stratégique
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-6 leading-none">
                            PTI — Programme <br />
                            <span className="text-amber-400">Triennal d’Investissement</span>
                        </h1>
                        <p className="text-xl text-white/80 font-medium leading-relaxed">
                            Le Programme Triennal d’Investissement (PTI) présente la vision stratégique de développement de la commune sur trois années (2024-2027).
                        </p>
                    </motion.div>
                </div>
                <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-white/5 to-transparent skew-x-12 transform origin-top pointer-events-none"></div>
            </div>

            <main className="max-w-7xl mx-auto px-6 -mt-12 pb-24 relative z-20">
                {/* Strategic Roadmap */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {[
                        { title: 'Vision Stratégique', value: 'Cap 2027', desc: 'Vers une ville moderne et résiliente.' },
                        { title: 'Planification', value: '3 Ans', desc: 'Projets structurants programmés.' },
                        { title: 'Budget Global', value: '1.2 Mrd', desc: 'Estimé sur la période triennale.' }
                    ].map((item, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-10 rounded-[3rem] shadow-xl shadow-black/5 border border-white"
                        >
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">{item.title}</div>
                            <div className="text-4xl font-black italic tracking-tighter mb-4">{item.value}</div>
                            <p className="text-sm font-medium text-gray-500 leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Objectives Section */}
                    <section>
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-10 flex items-center gap-4">
                            <span className="h-1 w-12 bg-amber-400 rounded-full"></span>
                            Objectifs Stratégiques
                        </h2>
                        <div className="space-y-6">
                            {objectives.map((obj, i) => (
                                <motion.div 
                                    key={i}
                                    whileHover={{ x: 10 }}
                                    className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-start gap-8 group"
                                >
                                    <div className={`h-16 w-16 ${obj.bg} ${obj.color} rounded-2xl flex items-center justify-center shrink-0`}>
                                        <obj.icon className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2 group-hover:text-primary transition">{obj.title}</h3>
                                        <p className="text-sm font-medium text-gray-500 leading-relaxed">
                                            {obj.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Project Types & Progress */}
                    <div className="space-y-12">
                        <section className="bg-gray-900 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-10">Types de projets</h2>
                                <div className="grid grid-cols-1 gap-4">
                                    {projectTypes.map((type, i) => (
                                        <div key={i} className="flex flex-col">
                                            <button 
                                                onClick={() => setExpandedType(expandedType === i ? null : i)}
                                                className={`w-full flex items-center justify-between p-6 rounded-3xl border transition-all duration-300 group ${expandedType === i ? 'bg-white/20 border-white/40 mb-4' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <type.icon className={`h-6 w-6 transition-colors ${expandedType === i ? 'text-white' : 'text-amber-400'}`} />
                                                    <span className={`font-bold text-sm tracking-tight text-left ${expandedType === i ? 'scale-105 origin-left' : ''} transition-transform`}>{type.name}</span>
                                                </div>
                                                <ArrowRight className={`h-4 w-4 text-white/30 transition-transform duration-500 ${expandedType === i ? 'rotate-90' : 'group-hover:translate-x-2'}`} />
                                            </button>
                                            
                                            {expandedType === i && (
                                                <motion.div 
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="px-6 pb-6 space-y-3"
                                                >
                                                    {type.projects.map((proj, idx) => (
                                                        <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 group/proj hover:bg-primary/20 transition">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-2 shrink-0 group-hover/proj:scale-150 transition"></div>
                                                            <span className="text-xs font-medium text-white/70 group-hover/proj:text-white transition">{proj}</span>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 h-40 w-40 bg-primary rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
                        </section>

                        <section className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-gray-100">
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-10">Partenaires et Financements</h2>
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-bold text-gray-400">Avancement Global</div>
                                    <div className="text-xl font-black italic text-primary">42%</div>
                                </div>
                                <div className="h-4 bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-1">
                                    <div className="h-full bg-primary rounded-full shadow-lg" style={{ width: '42%' }}></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-2xl text-center">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Financement acquis</div>
                                        <div className="font-black">650M FCFA</div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl text-center">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Recherche de fonds</div>
                                        <div className="font-black">550M FCFA</div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProjectPTI;
