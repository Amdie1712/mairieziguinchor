import React from 'react';
import * as Icons from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Environnement: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-3xl">
            Assainissement & Cadre de Vie
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-lg text-gray-500 font-medium">
            Gestion de la propreté urbaine, des marchés municipaux et de l'environnement pour une ville saine.
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* Assainissement Section */}
        <section>
             <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Propreté Urbaine</h2>
             <h2 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900 mb-8 flex items-center">
                <Icons.Truck className="h-8 w-8 text-primary mr-3" /> Assainissement
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-white flex items-start group">
                     <div className="bg-green-50 p-4 rounded-3xl mr-6 group-hover:scale-110 transition-transform">
                        <Icons.Trash2 className="h-8 w-8 text-primary" />
                     </div>
                     <div>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">Gestion des déchets</h3>
                        <ul className="text-sm font-medium text-gray-500 space-y-2">
                            <li>• Collecte des ordures ménagères</li>
                            <li>• Nettoyage des quartiers</li>
                            <li>• Signalement d’insalubrité</li>
                        </ul>
                     </div>
                 </div>
                 <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-white flex items-start group">
                     <div className="bg-blue-50 p-4 rounded-3xl mr-6 group-hover:scale-110 transition-transform">
                        <Icons.Activity className="h-8 w-8 text-blue-600" />
                     </div>
                     <div>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">Hygiène publique</h3>
                        <p className="text-sm font-medium text-gray-500 leading-relaxed">
                            Contrôles sanitaires, désinsectisation et actions de salubrité publique dans tous les quartiers.
                        </p>
                     </div>
                 </div>
             </div>
        </section>

        {/* Équipements Marchands Section */}
        <section>
             <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Commerce de proximité</h2>
             <h2 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900 mb-8 flex items-center">
                <Icons.Store className="h-8 w-8 text-primary mr-3" /> Équipements Marchands
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-white group">
                     <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4">Gestion des marchés</h3>
                     <p className="text-sm font-medium text-gray-500 mb-6">
                        Attribution de places, gestion des étals et entretien des infrastructures marchandes.
                     </p>
                     <div className="flex flex-wrap gap-2">
                        {['Marché St-Maur', 'Grand Marché', 'Marché Tilène'].map(m => (
                            <span key={m} className="px-3 py-1 bg-gray-50 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400 border border-gray-100">{m}</span>
                        ))}
                     </div>
                 </div>
                 <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-white group">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4">Démarches Professionnelles</h3>
                    <ul className="text-sm font-medium text-gray-500 space-y-3">
                        <li className="flex items-center text-primary font-bold">
                            <Icons.ChevronRight className="h-4 w-4 mr-1" /> Attribution de places
                        </li>
                        <li className="flex items-center text-primary font-bold">
                            <Icons.ChevronRight className="h-4 w-4 mr-1" /> Occupation de l’espace public
                        </li>
                    </ul>
                 </div>
             </div>
        </section>

        {/* Encombrants */}
        <section className="bg-primary/10 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Ramassage des encombrants</h3>
                <p className="text-gray-700 max-w-2xl">
                    La mairie propose un service gratuit de ramassage des objets volumineux (meubles, électroménager) sur rendez-vous. Ne les déposez pas sur la voie publique.
                </p>
            </div>
            <button 
                onClick={() => navigate('/contact')}
                className="bg-primary text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-green-700 transition flex items-center"
            >
                <Icons.Calendar className="h-5 w-5 mr-2" />
                Prendre rendez-vous
            </button>
        </section>

        {/* Espaces Verts */}
        <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <Icons.TreePine className="h-8 w-8 text-primary mr-3" /> Espaces Verts
             </h2>
             <div className="bg-white rounded-xl shadow-sm overflow-hidden md:flex">
                 <div className="md:w-1/2">
                     <img src="https://picsum.photos/id/10/800/600" alt="Parc Ziguinchor" className="h-full w-full object-cover" />
                 </div>
                 <div className="p-8 md:w-1/2 flex flex-col justify-center">
                     <h3 className="text-2xl font-bold mb-4">Une ville verte</h3>
                     <p className="text-gray-600 mb-6 leading-relaxed">
                         Ziguinchor s'engage pour la préservation de son patrimoine naturel. Nos équipes entretiennent quotidiennement les parcs, jardins et ronds-points de la ville en utilisant des méthodes respectueuses de l'environnement (zéro phyto).
                     </p>
                     <div className="grid grid-cols-2 gap-4">
                         <div className="bg-green-50 p-3 rounded text-center">
                             <span className="block text-2xl font-bold text-primary">15</span>
                             <span className="text-xs text-gray-600">Parcs & Jardins</span>
                         </div>
                         <div className="bg-green-50 p-3 rounded text-center">
                             <span className="block text-2xl font-bold text-primary">2500</span>
                             <span className="text-xs text-gray-600">Arbres plantés/an</span>
                         </div>
                     </div>
                 </div>
             </div>
        </section>

        {/* Signalement Banner */}
        <div className="text-center pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-4">Vous constatez un dépôt sauvage ou un problème de voirie ?</p>
            <button 
                onClick={() => navigate('/signalement')}
                className="inline-flex items-center text-amber-600 font-bold border-2 border-amber-600 px-6 py-2 rounded-full hover:bg-amber-50 transition"
            >
                <Icons.AlertTriangle className="h-5 w-5 mr-2" />
                Signaler un incident
            </button>
        </div>

      </div>
    </div>
  );
};

export default Environnement;