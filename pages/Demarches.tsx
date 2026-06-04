
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { AuthService } from '../services/auth';
import { ContentService, ProcedureItem } from '../services/api';

const Demarches: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const [procedures, setProcedures] = useState<ProcedureItem[]>([]);
  const [selectedProc, setSelectedProc] = useState<ProcedureItem | null>(null);

  useEffect(() => {
    ContentService.getProcedures().then(setProcedures).catch(console.error);
  }, []);

  const categories = [
    { name: 'Tout', icon: 'LayoutGrid' },
    { name: 'État Civil', icon: 'Baby' },
    { name: 'Assainissement, Cadre de Vie & Équipements Marchands', icon: 'Trash2' },
    { name: 'Voirie & Éclairage Public', icon: 'HardHat' },
    { name: 'Éducation, Alphabétisation & Formation', icon: 'School' },
    { name: 'Santé & Action Sociale', icon: 'Heart' },
    { name: 'Jeunesse, Sport, Loisirs & Culture', icon: 'Trophy' },
    { name: 'Gouvernance & Organisation des Quartiers', icon: 'Users' },
  ];

  const handleStartProcedure = (proc: ProcedureItem) => {
    const user = AuthService.getCurrentUser();
    if (!user) {
        if(window.confirm("Cette démarche nécessite un compte Citoyen. Voulez-vous vous connecter ?")) {
            navigate('/login');
        }
        return;
    }

    navigate('/faire-une-demarche', { 
        state: { 
            dossierType: proc.dossierType || proc.title,
            category: proc.category
        } 
    });
  };

  const filteredProcedures = procedures.filter(proc => {
      const matchesSearch = proc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            proc.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Tout' || proc.category === selectedCategory;
      return matchesSearch && matchesCategory;
  });

  const getIcon = (iconName: string) => {
      const IconComponent = (Icons as any)[iconName];
      return IconComponent ? IconComponent : Icons.FileText;
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Header avec vagues et barre de recherche flottante */}
      <div className="bg-primary pt-16 pb-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
            <Icons.Layers className="w-96 h-96 absolute -top-10 -right-10 rotate-12" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Portail des Services en Ligne</h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto mb-10">
            Simplifiez vos démarches administratives. Rapide, sécurisé et disponible à tout moment.
          </p>
          
          {/* Barre de recherche centrale */}
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icons.Search className="h-6 w-6 text-gray-400 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-5 border-none rounded-2xl leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-secondary/30 shadow-2xl text-xl transition-all"
              placeholder="Ex: Acte de naissance, Permis de construire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        
        {/* Navigation par catégories avec icônes */}
        <div className="bg-white p-4 rounded-2xl shadow-lg mb-12 flex overflow-x-auto no-scrollbar gap-2">
            {categories.map((cat) => {
                const CatIcon = getIcon(cat.icon);
                return (
                    <button
                        key={cat.name}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`flex items-center px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                            selectedCategory === cat.name
                            ? 'bg-primary text-white shadow-md transform scale-105'
                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        <CatIcon className="h-4 w-4 mr-2" />
                        {cat.name}
                    </button>
                );
            })}
        </div>

        {/* Grille de démarches */}
        <div className="mb-20">
            {filteredProcedures.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProcedures.map((proc, idx) => {
                    const Icon = getIcon(proc.icon);
                    return (
                        <div 
                            key={idx} 
                            onClick={() => setSelectedProc(proc)}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 cursor-pointer group flex flex-col relative overflow-hidden"
                        >
                            {/* Décoration de fond */}
                            <div className="absolute -bottom-4 -right-4 text-gray-50 group-hover:text-primary/5 transition-colors">
                                <Icon className="w-24 h-24" />
                            </div>

                            <div className="flex items-start justify-between mb-6 relative z-10">
                                <div className={`p-4 rounded-2xl ${
                                    proc.category === 'État Civil' ? 'bg-blue-50 text-blue-600' :
                                    proc.category === 'Assainissement, Cadre de Vie & Équipements Marchands' ? 'bg-emerald-50 text-emerald-600' :
                                    proc.category === 'Voirie & Éclairage Public' ? 'bg-amber-50 text-amber-600' :
                                    proc.category === 'Éducation, Alphabétisation & Formation' ? 'bg-indigo-50 text-indigo-600' :
                                    proc.category === 'Santé & Action Sociale' ? 'bg-rose-50 text-rose-600' :
                                    proc.category === 'Jeunesse, Sport, Loisirs & Culture' ? 'bg-orange-50 text-orange-600' :
                                    proc.category === 'Gouvernance & Organisation des Quartiers' ? 'bg-purple-50 text-purple-600' :
                                    'bg-green-50 text-primary'
                                }`}>
                                    <Icon className="h-7 w-7" />
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{proc.category}</span>
                                    {proc.isOnline && (
                                        <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
                                            100% En ligne
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4 relative z-10 flex-grow">
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{proc.title}</h3>
                                <p className="text-gray-500 text-sm mt-3 line-clamp-2 leading-relaxed">
                                    {proc.description}
                                </p>
                                
                                {proc.requiredDocs && proc.requiredDocs.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-50">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center">
                                            <Icons.FileStack className="h-3 w-3 mr-1" /> Documents requis
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {proc.requiredDocs.map((doc, i) => (
                                                <span key={i} className="text-[9px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-md border border-gray-100">
                                                    {doc}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50 relative z-10">
                                <div className="flex items-center text-xs font-semibold text-gray-400">
                                    <Icons.Clock className="h-3.5 w-3.5 mr-1.5" />
                                    Délai : {proc.delay}
                                </div>
                                <div className="flex items-center text-primary font-bold text-sm">
                                    Consulter <Icons.ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    );
                })}
                </div>
            ) : (
                <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 mb-6">
                        <Icons.SearchX className="h-10 w-10 text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Aucune démarche trouvée</h3>
                    <p className="text-gray-500 mt-2 text-lg">Votre recherche pour "{searchTerm}" n'a donné aucun résultat.</p>
                    <button 
                        onClick={() => { setSearchTerm(''); setSelectedCategory('Tout'); }}
                        className="mt-8 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg"
                    >
                        Réinitialiser les filtres
                    </button>
                </div>
            )}
        </div>

        {/* Section FAQ Simplifiée */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Icons.HelpCircle className="h-6 w-6 text-primary mr-3" /> Questions fréquentes
                </h3>
                <div className="space-y-6">
                    {[
                        { q: "Quels sont les délais de traitement ?", a: "Le traitement varie selon le type de demande (de 48h pour un acte d'état civil à plusieurs semaines pour un permis de construire)." },
                        { q: "Est-ce que le service est payant ?", a: "La plupart des actes d'état civil sont gratuits. Certaines démarches d'urbanisme peuvent entraîner des taxes municipales." },
                        { q: "Comment suivre mon dossier ?", a: "Une fois connecté à votre Espace Citoyen, rendez-vous dans la section 'Mes Démarches' pour voir l'avancement en temps réel." }
                    ].map((item, i) => (
                        <div key={i} className="border-b border-gray-50 pb-4 last:border-0">
                            <p className="font-bold text-gray-800 text-sm mb-2">{item.q}</p>
                            <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-green-900 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-center relative overflow-hidden">
                <Icons.Sparkles className="absolute -top-10 -right-10 w-40 h-40 text-white/5" />
                <h3 className="text-2xl font-bold mb-4 relative z-10">Vous ne trouvez pas votre démarche ?</h3>
                <p className="text-green-100 mb-8 relative z-10 text-lg leading-relaxed">
                    Nos conseillers municipaux sont à votre disposition pour vous guider dans vos formalités administratives les plus complexes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                    <button onClick={() => navigate('/contact')} className="bg-white text-green-900 px-6 py-4 rounded-xl font-bold hover:bg-green-50 transition shadow-md flex items-center justify-center">
                        <Icons.MessageSquare className="h-5 w-5 mr-2" />
                        Nous écrire
                    </button>
                    <button className="bg-green-800 text-white border border-green-700 px-6 py-4 rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center">
                        <Icons.Phone className="h-5 w-5 mr-2" />
                        +221 33 991 12 34
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Modal de pré-visualisation détaillée */}
      {selectedProc && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedProc(null)}></div>
              
              <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative animate-fade-in-up">
                  {/* Header Modal */}
                  <div className="bg-primary p-8 text-white">
                      <button onClick={() => setSelectedProc(null)} className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors">
                          <Icons.X className="h-6 w-6" />
                      </button>
                      <div className="flex items-center mb-4">
                          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm mr-4">
                              {React.createElement((Icons as any)[selectedProc.icon] || Icons.FileText, { className: "h-8 w-8 text-white" })}
                          </div>
                          <div>
                              <p className="text-xs font-bold text-green-200 uppercase tracking-widest">{selectedProc.category}</p>
                              <h2 className="text-2xl font-extrabold">{selectedProc.title}</h2>
                          </div>
                      </div>
                  </div>

                  {/* Corps Modal */}
                  <div className="p-8">
                      <div className="space-y-8">
                          <div>
                              <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                                  <Icons.Info className="h-5 w-5 mr-2 text-primary" />
                                  Description du service
                              </h4>
                              <p className="text-gray-600 leading-relaxed">
                                  {selectedProc.description}
                              </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                              <div>
                                  <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center uppercase tracking-wide">
                                      <Icons.FileStack className="h-4 w-4 mr-2 text-primary" />
                                      Pièces à fournir
                                  </h4>
                                  <ul className="space-y-3">
                                      {selectedProc.requiredDocs?.map((doc, i) => (
                                          <li key={i} className="flex items-start text-sm text-gray-600">
                                              <Icons.CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                              {doc}
                                          </li>
                                      ))}
                                  </ul>
                              </div>
                              <div className="bg-gray-50 p-6 rounded-2xl">
                                  <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center uppercase tracking-wide">
                                      <Icons.Timer className="h-4 w-4 mr-2 text-primary" />
                                      Informations clés
                                  </h4>
                                  <div className="space-y-4">
                                      <div className="flex justify-between items-center text-sm">
                                          <span className="text-gray-500 font-medium">Temps estimé</span>
                                          <span className="font-bold text-gray-900">{selectedProc.delay}</span>
                                      </div>
                                      <div className="flex justify-between items-center text-sm">
                                          <span className="text-gray-500 font-medium">Mode</span>
                                          <span className="font-bold text-green-600">100% Numérique</span>
                                      </div>
                                      <div className="flex justify-between items-center text-sm">
                                          <span className="text-gray-500 font-medium">Coût</span>
                                          <span className="font-bold text-gray-900">Gratuit</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* Actions Modal */}
                      <div className="mt-12 flex gap-4">
                          <button 
                            onClick={() => handleStartProcedure(selectedProc)}
                            className="flex-1 bg-primary text-white py-4 px-6 rounded-2xl font-bold text-lg hover:bg-green-700 transition shadow-lg flex items-center justify-center group"
                          >
                              {AuthService.getCurrentUser() ? 'Démarrer la démarche' : 'Se connecter pour commencer'}
                              <Icons.ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                          </button>
                          <button 
                            onClick={() => setSelectedProc(null)}
                            className="px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition"
                          >
                              Fermer
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Demarches;
