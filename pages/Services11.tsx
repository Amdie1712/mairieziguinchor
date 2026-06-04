import React, { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ContentService, ServiceItem, ProcedureItem } from '../services/api';
import { AuthService } from '../services/auth';

const Services: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [procedures, setProcedures] = useState<ProcedureItem[]>([]);
  const [selectedProc, setSelectedProc] = useState<ProcedureItem | null>(null);

  useEffect(() => {
    Promise.all([
      ContentService.getServices(),
      ContentService.getProcedures()
    ]).then(([s, p]) => {
      setServices(s);
      setProcedures(p);
    }).catch(console.error);
  }, []);

  const handleAction = (link: string) => {
      navigate(link);
  };

  const getIcon = (iconName: string) => {
      const IconComponent = (Icons as any)[iconName];
      return IconComponent ? IconComponent : Icons.HelpCircle;
  };

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

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <div className="bg-white border-b border-gray-100 pt-32 pb-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 inline-block shadow-sm">Administration Communale</span>
          <h1 className="text-6xl font-black text-gray-900 mb-6 tracking-tighter uppercase italic">Services <span className="text-primary italic">Municipaux</span></h1>
          <p className="text-gray-500 max-w-2xl text-xl font-medium leading-relaxed">
            L'administration communale à votre service. Retrouvez ici l'ensemble des directions et services de la Mairie de Ziguinchor pour vous accompagner dans vos démarches.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        {/* Main Administrative Departments */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-10 gap-4">
              <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Directions <span className="text-primary italic">& Départements</span></h2>
                  <p className="text-gray-500 font-medium">L'architecture administrative au service des citoyens de Ziguinchor.</p>
              </div>
              <div className="h-px flex-1 bg-gray-200 hidden md:block mx-8"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Secrétaire Général",
                desc: "Pilotage stratégique, communication, informatique et partenariats extérieurs.",
                icon: "ShieldCheck",
                color: "bg-red-50 text-red-600",
                divisions: ["Cellule Communication", "Cellule Informatique", "Marchés Publics"]
              },
              {
                title: "Direction de l'État-Civil",
                desc: "Gestion de l'identité citoyenne, naissances, mariages, décès et documents officiels.",
                icon: "Users",
                color: "bg-blue-50 text-blue-600",
                divisions: ["Division de l'État civil", "Bureau des naissances", "Bureau des mariages", "Bureau des décès"],
                path: "/etat-civil"
              },
              {
                title: "Direction des Services Techniques",
                desc: "Aménagement, voirie, police municipale, éclairage public et hygiène urbaine.",
                icon: "Tool",
                color: "bg-orange-50 text-orange-600",
                divisions: ["Police Municipale & Voirie", "Études et Contrôle", "Logistique & Maintenance"],
                path: "/urbanisme"
              },
              {
                title: "Direction de la Planification",
                desc: "Gestion stratégique, grands projets et coordination des compétences transférées.",
                icon: "Map",
                color: "bg-emerald-50 text-emerald-600",
                divisions: ["Cellule Projets", "Coopération", "Planification Urbaine"],
                path: "/projets"
              },
              {
                title: "Finances & Comptabilité",
                desc: "Gestion budgétaire, recettes municipales, domaines et patrimoine de la commune.",
                icon: "Wallet",
                color: "bg-amber-50 text-amber-600",
                divisions: ["Division des Finances", "Division des Recettes", "Domaines & Patrimoine"]
              },
              {
                title: "Ressources Humaines",
                desc: "Gestion du personnel communal, carrières, formation et solde des agents.",
                icon: "Briefcase",
                color: "bg-purple-50 text-purple-600",
                divisions: ["Administration du Personnel", "Formation", "Bureau de la Solde"]
              },
              {
                title: "Cabinet du Maire",
                desc: "Pilotage stratégique, communication, informatique et partenariats extérieurs.",
                icon: "ShieldCheck",
                color: "bg-red-50 text-red-600",
                divisions: ["Cellule Communication", "Cellule Informatique", "Marchés Publics"]
              },
              {
                title: "Cellule Informatique",
                desc: "Pilotage stratégique, communication, informatique et partenariats extérieurs.",
                icon: "ShieldCheck",
                color: "bg-red-50 text-red-600",
                divisions: ["Cellule Communication", "Cellule Informatique", "Marchés Publics"]
              },
              {
                title: "Cellule Communication",
                desc: "Pilotage stratégique, communication, informatique et partenariats extérieurs.",
                icon: "ShieldCheck",
                color: "bg-red-50 text-red-600",
                divisions: ["Cellule Communication", "Cellule Informatique", "Marchés Publics"]
              },
              {
                title: "Cellule Passation des Marchés",
                desc: "Pilotage stratégique, communication, informatique et partenariats extérieurs.",
                icon: "ShieldCheck",
                color: "bg-red-50 text-red-600",
                divisions: ["Cellule Communication", "Cellule Informatique", "Marchés Publics"]
              },
               {
                title: "Cellule Affaires Judiciaires",
                desc: "Pilotage stratégique, communication, informatique et partenariats extérieurs.",
                icon: "ShieldCheck",
                color: "bg-red-50 text-red-600",
                divisions: ["Cellule Communication", "Cellule Informatique", "Marchés Publics"]
              },
              {
                title: "Cellule Partenariat et Coopération Décentralisée",
                desc: "Pilotage stratégique, communication, informatique et partenariats extérieurs.",
                icon: "ShieldCheck",
                color: "bg-red-50 text-red-600",
                divisions: ["Cellule Communication", "Cellule Informatique", "Marchés Publics"]
              },
               {
                title: "Éducation & Formation",
                desc: "Gestion des écoles primaires, bourses scolaires et centres de formation professionnelle.",
                icon: "BookOpen",
                color: "bg-blue-50 text-blue-600",
                divisions: ["Enseignement", "Bourses", "Formation"],
                path: "/education"
              },
              {
                title: "Santé & Action Sociale",
                desc: "Accompagnement des populations vulnérables et gestion des centres de santé communaux.",
                icon: "Heart",
                color: "bg-red-50 text-red-600",
                divisions: ["Action Sociale", "Hygiène", "Santé"],
                path: "/social"
              },
              {
                title: "Jeunesse, Sport & Culture",
                desc: "Promotion des activités culturelles, artistiques et soutien à la vie associative et sportive.",
                icon: "Palette",
                color: "bg-indigo-50 text-indigo-600",
                divisions: ["Culture", "Sport", "Jeunesse"],
                path: "/culture"
              },
            ].map((dept, i) => (
              <div 
                key={i} 
                onClick={() => (dept as any).path && navigate((dept as any).path)}
                className={`bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full ${(dept as any).path ? 'cursor-pointer' : ''}`}
              >
                <div className={`w-14 h-14 ${dept.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {React.createElement((Icons as any)[dept.icon] || Icons.Building, { className: "h-7 w-7" })}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">{dept.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">{dept.desc}</p>
                
                <div className="pt-6 border-t border-gray-50">
                  <div className="flex flex-wrap gap-2">
                    {dept.divisions.map((div, j) => (
                      <span key={j} className="text-[10px] font-bold px-3 py-1 bg-gray-50 text-gray-400 rounded-lg uppercase tracking-wider">{div}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-baseline justify-between mb-10 gap-4">
            <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Services <span className="text-primary italic">de Proximité</span></h2>
                <p className="text-gray-500 font-medium">Bâtiments et antennes accueillant le public pour les démarches courantes.</p>
            </div>
            <div className="h-px flex-1 bg-gray-200 hidden md:block mx-8"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = getIcon(service.icon);
            // Match procedures by category (which we updated to match service title)
            const serviceProcedures = procedures.filter(p => p.category === service.title);

            return (
              <div key={index} className="bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 p-10 flex flex-col border border-gray-100 group hover:-translate-y-2">
                <div className="flex items-center justify-between mb-8">
                    <div className="p-4 bg-primary/5 rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon className="h-8 w-8 text-primary group-hover:text-white" />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{service.category}</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tighter uppercase italic group-hover:text-primary transition-colors">{service.title}</h3>
                <p className="text-gray-500 mb-8 font-medium leading-relaxed">{service.description}</p>
                
                {serviceProcedures.length > 0 && (
                  <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Démarches Clés</h4>
                    <div className="space-y-3">
                      {serviceProcedures.slice(0, 5).map((proc, pIdx) => (
                        <button 
                          key={pIdx}
                          onClick={() => setSelectedProc(proc)}
                          className="flex items-center text-sm text-gray-700 hover:text-primary font-bold group/btn w-full text-left"
                        >
                          <div className="w-1.5 h-1.5 bg-primary/30 rounded-full mr-3 group-hover/btn:scale-150 group-hover/btn:bg-primary transition-all"></div>
                          {proc.title}
                        </button>
                      ))}
                      {serviceProcedures.length > 5 && (
                        <button 
                          onClick={() => navigate('/demarches', { state: { category: service.title } })}
                          className="text-[10px] text-primary font-black uppercase tracking-widest mt-4 hover:opacity-70 transition-opacity flex items-center"
                        >
                          <Icons.Plus className="h-3 w-3 mr-1" />
                          {serviceProcedures.length - 5} autres démarches
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-auto">
                  <button 
                      onClick={() => handleAction(service.link || '#')}
                      className="w-full py-4 px-6 bg-gray-900 text-white font-black rounded-2xl hover:bg-primary hover:scale-[1.02] active:scale-95 transition-all shadow-lg uppercase tracking-widest text-xs"
                  >
                      {service.action}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Banner */}
        <div className="mt-20 bg-gray-900 p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic mb-2">Besoin d'aide pour vos <span className="text-primary italic">démarches ?</span></h3>
                    <p className="text-gray-400 font-medium">Nos agents sont mobilisés pour vous accompagner par téléphone ou directement en Mairie.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                    <button className="px-8 py-4 bg-white/10 text-white font-black rounded-2xl hover:bg-white/20 transition-all uppercase tracking-widest text-[10px] backdrop-blur-md border border-white/10">Consulter la FAQ</button>
                    <button onClick={() => navigate('/contact')} className="px-8 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20">Prendre RDV en ligne</button>
                </div>
            </div>
        </div>
      </div>

      {/* Modal - Copy from Demarches.tsx */}
      {selectedProc && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedProc(null)}></div>
              
              <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative border border-gray-200">
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
                                      {(!selectedProc.requiredDocs || selectedProc.requiredDocs.length === 0) && (
                                        <li className="flex items-start text-sm text-gray-600">
                                          <Icons.CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                          Pièce d'identité
                                        </li>
                                      )}
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

export default Services;