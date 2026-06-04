import React, { useState, useEffect } from 'react';
import { Home, Map, Download, Info, HardHat, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ContentService, ProjectItem } from '../services/api';

const Urbanisme: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  useEffect(() => {
    ContentService.getProjects().then(setProjects).catch(console.error);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-3xl">
            Voirie & Éclairage Public
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-lg text-gray-500 font-medium">
            Entretien des routes, des caniveaux, de l’éclairage urbain et gestion de l’urbanisme municipal.
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Intro */}
        <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-lg flex items-start">
            <Info className="h-6 w-6 text-orange-500 mr-4 flex-shrink-0 mt-1" />
            <div>
                <h3 className="text-lg font-bold text-orange-800 mb-2">Dématérialisation des demandes</h3>
                <p className="text-orange-700">
                    Depuis le 1er janvier 2024, toutes vos demandes d'autorisation d'urbanisme (permis de construire, déclaration préalable...) peuvent être déposées directement en ligne via l'Espace Citoyen.
                </p>
                <button 
                    onClick={() => navigate('/dashboard', { state: { openNewDossier: true, dossierType: 'Permis de construire' } })}
                    className="mt-4 bg-white text-orange-600 px-4 py-2 rounded border border-orange-200 font-medium hover:bg-orange-100 transition"
                >
                    Déposer une demande en ligne
                </button>
            </div>
        </div>

        {/* Infrastructure Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Voirie */}
            <section className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-white h-full group">
                <div className="flex items-center mb-6">
                    <div className="bg-blue-100 p-4 rounded-3xl mr-4 group-hover:scale-110 transition-transform">
                        <HardHat className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">Voirie & Routes</h2>
                </div>
                <ul className="space-y-4 mb-8 text-sm font-medium text-gray-500">
                    <li className="flex items-center text-primary font-bold">
                        <ArrowRight className="h-4 w-4 mr-2" /> Réparation des routes
                    </li>
                    <li className="flex items-center text-primary font-bold">
                        <ArrowRight className="h-4 w-4 mr-2" /> Signalement nids-de-poule
                    </li>
                    <li className="flex items-center text-primary font-bold">
                        <ArrowRight className="h-4 w-4 mr-2" /> Construction de caniveaux
                    </li>
                    <li className="flex items-center text-primary font-bold">
                        <ArrowRight className="h-4 w-4 mr-2" /> Travaux publics municipaux
                    </li>
                </ul>
                <button 
                    onClick={() => navigate('/signalement')}
                    className="w-full py-4 bg-gray-900 text-white font-black uppercase italic tracking-tighter rounded-2xl hover:bg-gray-800 transition shadow-lg"
                >
                    Signaler un problème
                </button>
            </section>

            {/* Éclairage & Urbanisme */}
            <section className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-white h-full group">
                <div className="flex items-center mb-6">
                    <div className="bg-amber-100 p-4 rounded-3xl mr-4 group-hover:scale-110 transition-transform">
                        <Map className="h-6 w-6 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">Espace & Lumière</h2>
                </div>
                <ul className="space-y-4 mb-8 text-sm font-medium text-gray-500">
                    <li className="flex items-center text-amber-600 font-bold">
                        <ArrowRight className="h-4 w-4 mr-2" /> Maintenance des lampadaires
                    </li>
                    <li className="flex items-center text-amber-600 font-bold">
                        <ArrowRight className="h-4 w-4 mr-2" /> Urbanisme communal
                    </li>
                    <li className="flex items-center text-amber-600 font-bold">
                        <ArrowRight className="h-4 w-4 mr-2" /> Occupation temporaire de voirie
                    </li>
                </ul>
                <button 
                    onClick={() => navigate('/dashboard', { state: { openNewDossier: true, dossierType: 'Urbanisme' } })}
                    className="w-full py-4 bg-primary text-white font-black uppercase italic tracking-tighter rounded-2xl hover:bg-green-700 transition shadow-lg shadow-green-200"
                >
                    Démarches Urbanisme
                </button>
            </section>
        </div>

        {/* Grands Projets Urbains */}
        <section>
            <div className="flex items-center mb-8">
                 <div className="bg-amber-100 p-3 rounded-lg mr-4">
                     <HardHat className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Grands Projets Urbains</h2>
                    <p className="text-gray-500 mt-1">La ville se transforme : découvrez les chantiers en cours.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {projects.map((project, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition duration-300">
                        <div className="h-48 overflow-hidden relative">
                            <img 
                                src={project.image} 
                                alt={project.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            />
                            <div className="absolute top-4 right-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${project.color}`}>
                                    {project.status}
                                </span>
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition">{project.title}</h3>
                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                {project.description}
                            </p>
                            <button className="text-primary font-medium text-sm flex items-center hover:underline">
                                En savoir plus <ArrowRight className="h-4 w-4 ml-1" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Contact Service Urbanisme */}
        <div className="bg-gray-900 rounded-xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-xl">
            <div className="mb-6 md:mb-0">
                <h2 className="text-2xl font-bold mb-2">Service Urbanisme</h2>
                <p className="text-gray-400">
                    Nos agents vous accueillent pour vous conseiller sur vos projets.<br/>
                    Permanences : Mardi et Jeudi de 9h à 12h.
                </p>
            </div>
            <div className="flex space-x-4">
                <button onClick={() => navigate('/contact')} className="bg-primary hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition shadow-lg">
                    Prendre rendez-vous
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Urbanisme;