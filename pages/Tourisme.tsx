import React from 'react';
import { Map, Sun, Music, Camera, Info } from 'lucide-react';

const Tourisme: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="relative h-[400px]">
         <img 
            src="https://picsum.photos/id/1043/1920/600" 
            alt="Casamance Landscape" 
            className="w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
             <div className="text-center text-white px-4">
                 <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Culture & Tourisme</h1>
                 <p className="text-xl max-w-2xl mx-auto">Bienvenue à Ziguinchor, cœur battant de la Casamance.</p>
             </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        
        {/* Presentation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Une destination authentique</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                    Ziguinchor est bien plus qu'une ville étape, c'est une expérience. Située au bord du majestueux fleuve Casamance, la ville offre un mélange unique d'architecture coloniale préservée, de marchés colorés et d'une végétation luxuriante.
                </p>
                <p className="text-gray-600 leading-relaxed">
                    Point de départ idéal pour découvrir la région, elle invite à la rencontre d'une population chaleureuse et à la découverte de traditions ancestrales vivaces.
                </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <img src="https://picsum.photos/id/1016/300/400" alt="Nature" className="rounded-lg shadow-lg w-full h-48 object-cover" />
                <img src="https://picsum.photos/id/1015/300/400" alt="Fleuve" className="rounded-lg shadow-lg w-full h-48 object-cover mt-8" />
            </div>
        </div>

        {/* Culture */}
        <section>
             <div className="text-center mb-12">
                 <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
                     <Music className="h-8 w-8 text-primary mr-3" />
                     Agenda Culturel
                 </h2>
                 <p className="mt-4 text-gray-600">Ziguinchor vibre toute l'année au rythme de ses événements.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition">
                     <h3 className="text-xl font-bold text-gray-900 mb-2">Carnaval de Ziguinchor</h3>
                     <p className="text-gray-500 text-sm mb-4">Décembre</p>
                     <p className="text-gray-600">Un défilé haut en couleurs célébrant la diversité des ethnies de la Casamance (Diola, Mandingue, Peul, etc.).</p>
                 </div>
                 <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition">
                     <h3 className="text-xl font-bold text-gray-900 mb-2">Festival Zig'Fest</h3>
                     <p className="text-gray-500 text-sm mb-4">Avril</p>
                     <p className="text-gray-600">Musique urbaine et traditionnelle, réunissant des artistes de toute la sous-région.</p>
                 </div>
                 <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition">
                     <h3 className="text-xl font-bold text-gray-900 mb-2">Journées du Patrimoine</h3>
                     <p className="text-gray-500 text-sm mb-4">Juin</p>
                     <p className="text-gray-600">Visites guidées des bâtiments historiques de l'escale et expositions photos.</p>
                 </div>
             </div>
        </section>

        {/* Sites à visiter */}
        <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <Camera className="h-8 w-8 text-secondary mr-3" />
                Incontournables
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { title: "Marché Saint-Maur", desc: "Le poumon économique, idéal pour l'artisanat et les tissus." },
                    { title: "L'Alliance Française", desc: "Un centre culturel dynamique logé dans un bâtiment historique magnifique." },
                    { title: "Le Port", desc: "Pour observer le ballet des pirogues et le ferry Aline Sitoé Diatta." },
                    { title: "Cathédrale St-Antoine", desc: "Un édifice religieux emblématique au cœur de la ville." }
                ].map((site, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h3 className="font-bold text-lg mb-2 text-primary">{site.title}</h3>
                        <p className="text-gray-600 text-sm">{site.desc}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* Info Office Tourisme */}
        <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10 flex flex-col md:flex-row items-center justify-between">
             <div className="flex items-start mb-6 md:mb-0">
                 <Info className="h-8 w-8 text-primary mr-4 flex-shrink-0" />
                 <div>
                     <h3 className="text-xl font-bold text-gray-900 mb-2">Office de Tourisme de Casamance</h3>
                     <p className="text-gray-600">
                         Pour organiser votre séjour, trouver un hébergement ou un guide officiel.<br/>
                         Situé Rue de France, ouvert du lundi au samedi.
                     </p>
                 </div>
             </div>
             <button className="bg-primary text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-green-700 transition">
                 Télécharger le guide touristique
             </button>
        </div>

      </div>
    </div>
  );
};

export default Tourisme;