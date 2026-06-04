import React from 'react';
import { BookOpen, GraduationCap, School, Info, ArrowRight, Library, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Education: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-3xl">
            Éducation & Formation
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-lg text-gray-500 font-medium">
            Accompagner la réussite de tous les citoyens, de la petite enfance à la formation professionnelle.
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Intro */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg flex items-start">
            <Info className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0 mt-1" />
            <div>
                <h3 className="text-lg font-bold text-blue-800 mb-2">Bourses et Appuis Scolaires 2024</h3>
                <p className="text-blue-700">
                    Les demandes de bourses municipales et d'appuis aux fournitures scolaires pour l'année académique 2024-2025 sont désormais ouvertes. Déposez votre dossier avant le 30 septembre.
                </p>
                <button 
                    onClick={() => navigate('/dashboard', { state: { openNewDossier: true, dossierType: 'Demande de Bourse' } })}
                    className="mt-4 bg-white text-blue-600 px-4 py-2 rounded border border-blue-200 font-medium hover:bg-blue-100 transition"
                >
                    Soumettre une demande
                </button>
            </div>
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Éducation Préscolaire et Élémentaire */}
            <section className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-white h-full group">
                <div className="flex items-center mb-6">
                    <div className="bg-green-100 p-4 rounded-3xl mr-4 group-hover:scale-110 transition-transform">
                        <School className="h-6 w-6 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">Petite Enfance & Primaire</h2>
                </div>
                <p className="text-gray-600 mb-6 font-medium">La mairie soutient les établissements scolaires pour offrir un environnement d'apprentissage optimal dès le plus jeune âge.</p>
                <ul className="space-y-4 mb-8 text-sm font-medium text-gray-500">
                    <li className="flex items-center text-primary font-bold">
                        <ArrowRight className="h-4 w-4 mr-2" /> Inscriptions dans les écoles publiques
                    </li>
                    <li className="flex items-center text-primary font-bold">
                        <ArrowRight className="h-4 w-4 mr-2" /> Entretien et réhabilitation des infrastructures
                    </li>
                    <li className="flex items-center text-primary font-bold">
                        <ArrowRight className="h-4 w-4 mr-2" /> Dotation en fournitures scolaires
                    </li>
                    <li className="flex items-center text-primary font-bold">
                        <ArrowRight className="h-4 w-4 mr-2" /> Cantines scolaires municipales
                    </li>
                </ul>
                <button 
                    onClick={() => navigate('/demarches')}
                    className="w-full py-4 bg-gray-900 text-white font-black uppercase italic tracking-tighter rounded-2xl hover:bg-gray-800 transition shadow-lg"
                >
                    Démarches Inscription
                </button>
            </section>

            {/* Formation & Insertion */}
            <section className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-white h-full group">
                <div className="flex items-center mb-6">
                    <div className="bg-purple-100 p-4 rounded-3xl mr-4 group-hover:scale-110 transition-transform">
                        <GraduationCap className="h-6 w-6 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">Formation & Insertion</h2>
                </div>
                <p className="text-gray-600 mb-6 font-medium">Favoriser l'insertion professionnelle des jeunes par des formations adaptées aux besoins du marché local.</p>
                <ul className="space-y-4 mb-8 text-sm font-medium text-gray-500">
                    <li className="flex items-center text-purple-600 font-bold">
                        <ArrowRight className="h-4 w-4 mr-2" /> Centre de formation municipale
                    </li>
                    <li className="flex items-center text-purple-600 font-bold">
                        <ArrowRight className="h-4 w-4 mr-2" /> Appui à l'entreprenariat des jeunes
                    </li>
                    <li className="flex items-center text-purple-600 font-bold">
                        <ArrowRight className="h-4 w-4 mr-2" /> Orientation et conseil carrière
                    </li>
                    <li className="flex items-center text-purple-600 font-bold">
                        <ArrowRight className="h-4 w-4 mr-2" /> Partenariats avec les entreprises locales
                    </li>
                </ul>
                <button 
                    onClick={() => navigate('/entreprises')}
                    className="w-full py-4 bg-primary text-white font-black uppercase italic tracking-tighter rounded-2xl hover:bg-green-700 transition shadow-lg shadow-green-200"
                >
                    Espace Insertion
                </button>
            </section>
        </div>

        {/* Structures de proximité */}
        <section>
            <div className="flex items-center mb-8">
                 <div className="bg-primary/10 p-3 rounded-lg mr-4">
                     <Library className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tighter uppercase italic">Nos Structures de <span className="text-primary italic">Proximité</span></h2>
                    <p className="text-gray-500 mt-1 font-medium">Des lieux d'échange, d'apprentissage et de culture ouverts à tous.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    {
                        title: "Bibliothèque Municipale",
                        desc: "Plus de 10 000 ouvrages en libre accès, espaces de travail et animations littéraires.",
                        icon: BookOpen,
                        color: "bg-blue-50 text-blue-600"
                    },
                    {
                        title: "Espace Numérique Citoyen",
                        desc: "Accès gratuit à internet, ateliers d'initiation à l'informatique et aide aux démarches en ligne.",
                        icon: Users,
                        color: "bg-indigo-50 text-indigo-600"
                    },
                    {
                        title: "Centre de Ressources",
                        desc: "Documentation spécialisée et accompagnement des chercheurs et étudiants.",
                        icon: Library,
                        color: "bg-amber-50 text-amber-600"
                    }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            <item.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">{item.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            {item.desc}
                        </p>
                        <button className="text-primary font-bold text-xs uppercase tracking-widest flex items-center group-hover:translate-x-2 transition-transform">
                            Plus d'infos <ArrowRight className="h-4 w-4 ml-1" />
                        </button>
                    </div>
                ))}
            </div>
        </section>

        {/* Contact Service Éducation */}
        <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
            <div className="relative z-10 mb-6 md:mb-0">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Direction de l'Éducation</h2>
                <p className="text-gray-400 font-medium max-w-lg">
                    Contactez-nous pour toute question relative à la scolarisation de vos enfants ou vos besoins en formation.<br/>
                    <span className="text-primary font-bold mt-2 inline-block">Lundi au Vendredi : 8h00 - 17h00</span>
                </p>
            </div>
            <div className="relative z-10 flex space-x-4">
                <button 
                    onClick={() => navigate('/contact')} 
                    className="bg-primary hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-tighter transition shadow-xl shadow-green-900/20"
                >
                    Prendre rendez-vous
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Education;
