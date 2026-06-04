
import React from 'react';
import { motion } from 'motion/react';
import { 
  Handshake, 
  Globe, 
  Map as MapIcon, 
  HelpCircle, 
  Building2, 
  TrendingUp, 
  Users, 
  Flag,
  Palette,
  CloudSun,
  ShieldCheck,
  GraduationCap as School,
  Smartphone,
  Quote
} from 'lucide-react';

const ProjectCooperation: React.FC = () => {
    const domains = [
        { name: 'Éducation', icon: School, color: 'text-indigo-500', bg: 'bg-indigo-50' },
        { name: 'Santé', icon: ShieldCheck, color: 'text-rose-500', bg: 'bg-rose-50' },
        { name: 'Culture', icon: Palette, color: 'text-amber-500', bg: 'bg-amber-50' },
        { name: 'Environnement', icon: CloudSun, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { name: 'Gouvernance locale', icon: Building2, color: 'text-blue-500', bg: 'bg-blue-50' },
        { name: 'Formation professionnelle', icon: Flag, color: 'text-orange-500', bg: 'bg-orange-50' },
        { name: 'Développement numérique', icon: Smartphone, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    ];

    const [expandedPartner, setExpandedPartner] = React.useState<number | null>(null);

    const partners = [
        { 
            type: 'Villes jumelées', 
            icon: Building2, 
            desc: 'Coopération directe entre municipalités.',
            examples: ['Saint-Maur-des-Fossés (France)', 'Viana do Castelo (Portugal)', 'Brazzaville (Congo)']
        },
        { 
            type: 'ONG internationales', 
            icon: Globe, 
            desc: 'Partenariats sur des thématiques précises.',
            examples: ['Médecins Sans Frontières', 'Oxfam International', 'SOS Sahel']
        },
        { 
            type: 'Coopérations européennes', 
            icon: Flag, 
            desc: 'Programmes de soutien aux pays du sud.',
            examples: ['AFD (France)', 'COI (Espagne)', 'Union Européenne (Erasmus+)']
        },
        { 
            type: 'Agences de développement', 
            icon: TrendingUp, 
            desc: 'Financements institutionnels.',
            examples: ['USAID (USA)', 'GIZ (Allemagne)', 'JICA (Japon)']
        },
        { 
            type: 'Organisations internationales', 
            icon: Globe, 
            desc: 'Onu, Unicef, etc.',
            examples: ['UNESCO (Patrimoine)', 'UNICEF (Éducation)', 'OMS (Santé)']
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
                            <Handshake className="h-3 w-3" /> Alliances Stratégiques
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-6 leading-none">
                            Coopération <br />
                            <span className="text-amber-400">Décentralisée</span>
                        </h1>
                        <p className="text-xl text-white/80 font-medium leading-relaxed">
                            La coopération décentralisée permet à la commune de collaborer avec des villes partenaires, des ONG et des institutions internationales pour financer et réaliser des projets de développement durable.
                        </p>
                    </motion.div>
                </div>
                <div className="absolute top-0 right-0 h-full w-1/2 flex items-center justify-center opacity-10 pointer-events-none translate-x-20">
                    <Globe className="h-[40rem] w-[40rem]" />
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 -mt-12 pb-24 relative z-20">
                {/* Impact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {[
                        { title: 'Montants Mobilisés', value: '280M FCFA', sub: 'Depuis 2022' },
                        { title: 'Projets Financés', value: '14 Projets', sub: 'Tous secteurs' },
                        { title: 'Résultats Obtenus', value: '25k Impactés', sub: 'Citoyens bénéficiaires' }
                    ].map((item, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-10 rounded-[3rem] shadow-xl shadow-black/5 border border-white text-center"
                        >
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">{item.title}</div>
                            <div className="text-4xl font-black italic tracking-tighter mb-2">{item.value}</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.sub}</div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Domains column */}
                    <div className="lg:col-span-1">
                        <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-50 mb-12">
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-8 flex items-center gap-3">
                                <span className="h-2 w-8 bg-amber-400 rounded-full"></span>
                                Domaines d'action
                            </h2>
                            <div className="space-y-4">
                                {domains.map((domain, i) => (
                                    <div key={domain.name} className="flex items-center gap-4 p-4 rounded-2xl group transition-all">
                                        <div className={`h-10 w-10 ${domain.bg} ${domain.color} rounded-xl flex items-center justify-center shrink-0`}>
                                            <domain.icon className="h-5 w-5" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-700 group-hover:text-primary transition">{domain.name}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-amber-400 text-primary p-10 rounded-[3rem] shadow-xl relative overflow-hidden">
                            <Quote className="h-20 w-20 absolute -top-8 -left-8 opacity-20" />
                            <div className="relative z-10">
                                <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4">Témoignage</h3>
                                <p className="text-sm font-bold italic leading-relaxed mb-6">
                                    "Grâce au partenariat avec la ville de [...], nous avons pu moderniser nos équipements de collecte de déchets et former 50 agents."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-white/20 rounded-full"></div>
                                    <div className="text-xs font-black uppercase">Responsable Technique</div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Partners & Results */}
                    <div className="lg:col-span-2 space-y-12">
                        <section className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-gray-50">
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-10">Typologie des Partenaires</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {partners.map((partner, i) => (
                                    <div key={i} className="flex flex-col">
                                        <button 
                                            onClick={() => setExpandedPartner(expandedPartner === i ? null : i)}
                                            className={`p-8 rounded-[2.5rem] border flex items-start gap-6 transition-all duration-300 group text-left w-full ${expandedPartner === i ? 'bg-primary text-white shadow-xl scale-[1.02]' : 'bg-gray-50 border-gray-100 hover:border-primary'}`}
                                        >
                                            <div className={`h-12 w-12 rounded-2xl shadow-sm flex items-center justify-center shrink-0 transition-colors duration-500 ${expandedPartner === i ? 'bg-white text-primary' : 'bg-white text-primary group-hover:bg-primary group-hover:text-white'}`}>
                                                <partner.icon className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`text-lg font-black uppercase italic tracking-tighter mb-2 ${expandedPartner === i ? 'text-amber-400' : ''}`}>{partner.type}</h4>
                                                <p className={`text-xs font-medium leading-relaxed transition-colors ${expandedPartner === i ? 'text-white/80' : 'text-gray-500'}`}>{partner.desc}</p>
                                            </div>
                                        </button>
                                        
                                        {expandedPartner === i && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-4 px-8 pb-4 space-y-3"
                                            >
                                                <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Exemples de partenaires :</div>
                                                {partner.examples.map((ex, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-amber-400"></div>
                                                        <span className="text-xs font-bold text-gray-700">{ex}</span>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-gray-900 text-white p-12 rounded-[3.5rem] relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-10">Nos Partenaires de Référence</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-20 bg-white/10 rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-widest px-4 text-center">
                                            Logo Partenaire
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-primary to-transparent opacity-10 pointer-events-none"></div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProjectCooperation;
