import React from 'react';
import { Music, Palette, BookOpen, Film, Ticket, Calendar, ArrowRight, Trophy, Home, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Culture: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
            
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 decoration-primary underline decoration-4 underline-offset-8">Jeunesse, Sport & Culture</h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-indigo-100 font-medium leading-relaxed">
            Promotion des activités sportives, culturelles et de loisirs pour tous les citoyens de Ziguinchor.
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        
        {/* Sport & Jeunesse Section */}
        <section>
             <div className="text-center mb-12">
                <h2 className="text-3xl font-black text-gray-900 mb-2">Jeunesse & Sports</h2>
                <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-white group hover:shadow-2xl transition-all">
                    <div className="bg-orange-50 p-4 rounded-3xl w-fit mb-6 group-hover:scale-110 transition-all">
                        <Trophy className="h-8 w-8 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter mb-3">Sports & Terrains</h3>
                    <ul className="text-sm font-medium text-gray-500 space-y-2 mb-6">
                        <li>• Gestion des terrains sportifs</li>
                        <li>• Manifestations sportives</li>
                        <li>• Soutien aux clubs locaux</li>
                    </ul>
                    <button onClick={() => navigate('/demarches')} className="text-orange-600 font-bold text-sm flex items-center">
                        Réserver un terrain <ArrowRight className="h-4 w-4 ml-1" />
                    </button>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-white group hover:shadow-2xl transition-all">
                    <div className="bg-blue-50 p-4 rounded-3xl w-fit mb-6 group-hover:scale-110 transition-all">
                        <Home className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter mb-3">Maison des Jeunes</h3>
                    <p className="text-sm font-medium text-gray-500 mb-6">
                        Un espace dédié à la formation, aux loisirs et à l'accompagnement des projets de la jeunesse.
                    </p>
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-50 px-3 py-1 rounded-full">Ouvert 9h-18h</span>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-white group hover:shadow-2xl transition-all">
                    <div className="bg-green-50 p-4 rounded-3xl w-fit mb-6 group-hover:scale-110 transition-all">
                        <Users className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter mb-3">Vie Associative</h3>
                    <p className="text-sm font-medium text-gray-500 mb-6">
                        Soutien technique et financier aux associations culturelles et sportives de la commune.
                    </p>
                    <button onClick={() => navigate('/demarches')} className="text-primary font-bold text-sm flex items-center">
                        Dossier subvention <ArrowRight className="h-4 w-4 ml-1" />
                    </button>
                </div>
             </div>
        </section>

        {/* Événements Phares */}
        <section className="bg-white rounded-[3rem] p-8 md:p-16 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150">
                <Music className="w-64 h-64" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <span className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-4 block">Agenda Culturel</span>
                    <h2 className="text-4xl font-black text-gray-900 mb-6 leading-none">Vivez le rythme de <span className="text-primary italic">Ziguinchor</span></h2>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                        Tout au long de l'année, la mairie soutient et organise des événements pour célébrer notre diversité. Musique, danse, théâtre et artisanat sont au cœur de notre identité Casamançaise.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <Ticket className="h-6 w-6 text-indigo-500 mr-4" />
                            <div className="flex-1">
                                <p className="font-bold text-gray-900">Festival de Musique de Ziguinchor</p>
                                <p className="text-xs text-gray-500 uppercase font-black">Chaque année en Décembre</p>
                            </div>
                        </div>
                        <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <Calendar className="h-6 w-6 text-indigo-500 mr-4" />
                            <div className="flex-1">
                                <p className="font-bold text-gray-900">Rencontres Internationales des Arts</p>
                                <p className="text-xs text-gray-500 uppercase font-black">Prochaine édition : Août 2024</p>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate('/agenda')}
                        className="mt-10 bg-indigo-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition shadow-xl"
                    >
                        Consulter l'agenda complet
                    </button>
                </div>
                <div className="relative">
                    <img src="https://picsum.photos/id/1025/800/600" alt="Spectacle" className="rounded-3xl shadow-2xl relative z-10" />
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary rounded-2xl -z-0 rotate-12"></div>
                </div>
            </div>
        </section>

        {/* Aide au secteur culturel */}
        <section className="bg-gray-900 rounded-[2.5rem] p-10 md:p-16 text-white text-center">
            <h2 className="text-3xl font-black italic tracking-tighter mb-4">Vous êtes un artiste ou une association ?</h2>
            <p className="text-gray-400 mb-10 max-w-xl mx-auto">
                La Mairie accompagne les porteurs de projets culturels à travers des subventions et la mise à disposition de salles.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                    onClick={() => navigate('/demarches')}
                    className="bg-primary text-white border-2 border-primary px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-green-700 transition"
                >
                    Faire une demande de subvention
                </button>
                <button 
                    onClick={() => navigate('/contact')}
                    className="bg-transparent text-white border-2 border-white/20 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white hover:text-gray-900 transition"
                >
                    Contacter la Direction de la Culture
                </button>
            </div>
        </section>

      </div>
    </div>
  );
};

export default Culture;
