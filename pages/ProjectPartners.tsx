import React from 'react';
import { motion } from 'motion/react';
import { 
  Handshake, 
  Globe, 
  Building2, 
  Users, 
  ShieldCheck, 
  Heart, 
  Briefcase,
  ChevronRight,
  TrendingUp,
  Landmark,
  Anchor,
  Info
} from 'lucide-react';

const ProjectPartners: React.FC = () => {
    const categories = [
        {
            title: 'Partenaires Techniques',
            icon: Building2,
            partners: [
                { name: 'AGEROUTE', type: 'Agence d\'exécution', logo: 'https://via.placeholder.com/150?text=AGEROUTE', projects: 12 },
                { name: 'ADIE', type: 'Numérisation / IT', logo: 'https://via.placeholder.com/150?text=ADIE', projects: 5 },
                { name: 'Senelec', type: 'Énergie', logo: 'https://via.placeholder.com/150?text=Senelec', projects: 8 }
            ]
        },
        {
            title: 'Bailleurs & Financement',
            icon: Landmark,
            partners: [
                { name: 'Banque Mondiale', type: 'Bailleur International', logo: 'https://via.placeholder.com/150?text=BM', projects: 3 },
                { name: 'AFD', type: 'Coopération Française', logo: 'https://via.placeholder.com/150?text=AFD', projects: 4 },
                { name: 'BAD', type: 'Bailleur Régional', logo: 'https://via.placeholder.com/150?text=BAD', projects: 2 }
            ]
        },
        {
            title: 'Ministères & État',
            icon: ShieldCheck,
            partners: [
                { name: 'Ministère des Finances', type: 'Tutelle', logo: 'https://via.placeholder.com/150?text=MEF', projects: 20 },
                { name: 'Ministère de l\'Éducation', type: 'Scolaire', logo: 'https://via.placeholder.com/150?text=MEN', projects: 6 },
                { name: 'Ministère de la Santé', type: 'Social', logo: 'https://via.placeholder.com/150?text=MSAS', projects: 4 }
            ]
        },
        {
            title: 'ONG & Coopération Destinée',
            icon: Users,
            partners: [
                { name: 'Unicef', type: 'Enfance', logo: 'https://via.placeholder.com/150?text=Unicef', projects: 3 },
                { name: 'OXFAM', type: 'Social / Agricole', logo: 'https://via.placeholder.com/150?text=OXFAM', projects: 2 },
                { name: 'GreenCity', type: 'Environnement', logo: 'https://via.placeholder.com/150?text=GC', projects: 5 }
            ]
        }
    ];

    return (
        <div className="bg-[#fafafa] min-h-screen">
            
            <div className="bg-primary text-white py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                            <Handshake className="h-3 w-3" /> Synergie & Collaboration
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-6 leading-none">
                            Partenaires & <br />
                            <span className="text-amber-400">Financements</span>
                        </h1>
                        <p className="text-xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed">
                            Rien de grand ne se fait seul. Découvrez les institutions et organisations qui soutiennent le développement de Ziguinchor.
                        </p>
                    </motion.div>
                </div>
                {/* Background Pattern */}
                <div className="absolute inset-0 grid grid-cols-12 pointer-events-none opacity-5">
                    {Array.from({ length: 48 }).map((_, i) => (
                        <div key={i} className="border-r border-b border-white/20 h-32"></div>
                    ))}
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-24 -mt-16 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
                    <div className="space-y-8">
                        <div className="h-1.5 w-24 bg-primary rounded-full"></div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-tight">
                            Une Gouvernance <br /> <span className="text-primary">Transparente</span>
                        </h2>
                        <p className="text-gray-500 text-lg font-medium leading-relaxed">
                            Nous collaborons avec un large éventail de partenaires pour mobiliser les ressources nécessaires à la réalisation de nos ambitions. Chaque financement est tracé et chaque projet fait l'objet d'un audit rigoureux pour garantir le bon usage des fonds publics et privés.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
                            <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                                <div className="text-3xl font-black text-primary mb-2">92%</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Taux d'exécution budgétaire</div>
                            </div>
                            <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                                <div className="text-3xl font-black text-amber-500 mb-2">24</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Partenaires actifs en 2024</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-900 rounded-[4rem] p-12 text-white relative overflow-hidden group">
                        <div className="relative z-10 h-full flex flex-col">
                            <h3 className="text-2xl font-black uppercase italic mb-8">Structure du Financement</h3>
                            <div className="space-y-8">
                                {[
                                    { label: 'Budget Propre (Mairie)', val: '35%', color: 'bg-primary' },
                                    { label: 'État du Sénégal (PNDL/PACASEN)', val: '45%', color: 'bg-amber-400' },
                                    { label: 'Bailleurs Internationaux', val: '15%', color: 'bg-blue-500' },
                                    { label: 'Participation Privée', val: '5%', color: 'bg-emerald-500' }
                                ].map((item, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-sm font-black uppercase tracking-widest">
                                            <span>{item.label}</span>
                                            <span>{item.val}</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                whileInView={{ width: item.val }}
                                                transition={{ duration: 1, delay: i * 0.2 }}
                                                className={`h-full ${item.color}`}
                                            ></motion.div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-12 pt-12 border-t border-white/10 flex items-center gap-4 text-gray-400">
                                <Info className="h-5 w-5" />
                                <p className="text-[10px] font-bold uppercase tracking-widest">Données extraites du Budget Primitif 2024</p>
                            </div>
                        </div>
                        {/* Decorative circle */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full translate-x-1/3 -translate-y-1/3 group-hover:scale-110 transition duration-1000"></div>
                    </div>
                </div>

                <div className="space-y-32">
                    {categories.map((cat, i) => (
                        <div key={i} className="space-y-12">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-primary">
                                    <cat.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-3xl font-black uppercase tracking-tighter italic">{cat.title}</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {cat.partners.map((partner, j) => (
                                    <motion.div
                                        whileHover={{ y: -10 }}
                                        key={j}
                                        className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group"
                                    >
                                        <div className="h-20 w-full mb-8 flex items-center justify-center bg-gray-50 rounded-2xl group-hover:bg-primary/5 transition-colors">
                                            <img src={partner.logo} alt={partner.name} className="h-12 w-auto grayscale group-hover:grayscale-0 transition duration-500" />
                                        </div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{partner.type}</div>
                                        <h4 className="text-xl font-black uppercase mb-4">{partner.name}</h4>
                                        <div className="flex bg-gray-50 p-4 rounded-2xl items-center justify-between">
                                            <div className="text-[10px] font-black uppercase text-gray-400">Projets Financés</div>
                                            <div className="text-sm font-black italic text-primary">{partner.projects}</div>
                                        </div>
                                        <button className="w-full mt-6 py-4 rounded-2xl border-2 border-gray-100 font-black uppercase tracking-widest text-[10px] text-gray-400 group-hover:border-primary group-hover:text-primary transition">
                                            Fiche Partenaire
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to action */}
                <div className="mt-40 bg-gray-900 rounded-[4rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-8">
                            Devenez Partenaire du <br /> <span className="text-primary">Développement Local</span>
                        </h2>
                        <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto mb-12">
                            Vous représentez une institution, une ONG ou une entreprise et souhaitez contribuer aux projets de la ville ? Contactez notre service Partenariat & Coopération.
                        </p>
                        <button className="bg-primary text-white px-12 py-6 rounded-3xl font-black text-lg uppercase tracking-widest shadow-2xl hover:scale-105 transition active:scale-95">
                            Prendre contact
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProjectPartners;
