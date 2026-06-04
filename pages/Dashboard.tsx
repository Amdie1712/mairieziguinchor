
import React, { useEffect, useState } from 'react';
import { AuthService, User } from '../services/auth';
import { DossierService, Dossier } from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<Dossier[]>([]);
  const [selectedDossier, setSelectedDossier] = useState<Dossier | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    refreshHistory(currentUser.id);
  }, [navigate]);

  const refreshHistory = async (userId: string) => {
      setLoading(true);
      try {
          const docs = await DossierService.getByUser(userId);
          setHistory(docs);
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  const getStatusInfo = (status: string) => {
      switch(status) {
          case 'Validé':
          case 'VALIDE':
          case 'TERMINE': return { color: 'bg-green-100 text-green-700', icon: Icons.CheckCircle };
          case 'Rejeté':
          case 'REJETE': return { color: 'bg-red-100 text-red-700', icon: Icons.XCircle };
          case 'Attente documents':
          case 'ATTENTE_DOCUMENTS': return { color: 'bg-orange-100 text-orange-700', icon: Icons.AlertTriangle };
          case 'Instruction':
          case 'EN_ATTENTE':
          case 'EN_ANALYSE':
          case 'ASSIGNE': return { color: 'bg-blue-100 text-blue-700', icon: Icons.Eye };
          default: return { color: 'bg-yellow-100 text-yellow-700', icon: Icons.Clock };
      }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Profil */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-12 flex flex-col md:flex-row items-center justify-between border border-gray-100">
          <div className="flex items-center mb-6 md:mb-0">
            <div className="h-20 w-20 bg-primary text-white rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg shadow-primary/20 mr-6">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Espace Citoyen</h1>
              <p className="text-gray-500 font-medium">Bienvenue, <span className="text-primary">{user.name}</span></p>
            </div>
          </div>
          <div className="flex gap-4">
             <button onClick={() => AuthService.exportData()} className="flex items-center px-5 py-3 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition border border-gray-100">
              <Icons.Download className="w-5 h-5 mr-2" /> Exporter
            </button>
            <button onClick={() => AuthService.logout()} className="flex items-center px-5 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition">
              <Icons.LogOut className="w-5 h-5 mr-2" /> Quitter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Liste des Dossiers */}
          <div className="lg:col-span-2 space-y-6">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-gray-900 flex items-center">
                    <Icons.FileText className="w-7 h-7 mr-3 text-primary" />
                    Mes Démarches
                </h2>
                <div className="flex gap-3">
                    <button 
                        onClick={() => navigate('/social')}
                        className="bg-purple-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-purple-700 transition shadow-lg flex items-center"
                    >
                        <Icons.Heart className="w-5 h-5 mr-2" />
                        Aide Sociale
                    </button>
                    <button 
                        onClick={() => navigate('/demarches')}
                        className="bg-primary text-white px-5 py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg flex items-center"
                    >
                        <Icons.PlusCircle className="w-5 h-5 mr-2" />
                        Nouveau Dossier
                    </button>
                </div>
             </div>

             {loading ? (
                 <div className="bg-white p-20 rounded-3xl border border-gray-100 text-center">
                     <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                     <p className="mt-4 text-gray-400 font-bold">Synchronisation de vos dossiers...</p>
                 </div>
             ) : history.length > 0 ? (
                 <div className="space-y-4">
                    {history.map((item) => {
                        const s = getStatusInfo(item.status);
                        const isSelected = selectedDossier?.id === item.id;
                        const isSocial = item.id.startsWith('SOC') || item.type.toLowerCase().includes('aide') || item.type.toLowerCase().includes('social');
                        
                        return (
                            <div 
                                key={item.id} 
                                onClick={() => setSelectedDossier(item)}
                                className={`bg-white p-6 rounded-2xl border transition-all duration-300 cursor-pointer hover:shadow-xl ${
                                    isSelected ? 'border-primary ring-4 ring-primary/5 shadow-xl transform scale-[1.02]' : 'border-gray-100'
                                }`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center">
                                        <div className={`p-3 rounded-xl mr-4 ${isSocial ? 'bg-purple-50 text-purple-600' : s.color}`}>
                                            {isSocial ? <Icons.Heart className="w-6 h-6" /> : <s.icon className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-gray-900 text-lg">{item.type}</h3>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Référence : {item.id}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between sm:flex-col sm:items-end">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${s.color}`}>
                                            {item.status}
                                        </span>
                                        <p className="text-xs text-gray-400 font-bold mt-2">Dépôt le {new Date(item.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                 </div>
             ) : (
                 <div className="bg-white p-20 rounded-3xl border-2 border-dashed border-gray-200 text-center">
                     <Icons.FolderSearch className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                     <h3 className="text-xl font-bold text-gray-900">Aucun dossier trouvé</h3>
                     <p className="text-gray-400 mt-2 max-w-xs mx-auto">Commencez votre première démarche en ligne dès aujourd'hui.</p>
                 </div>
             )}
          </div>

          {/* Détails du Dossier Sélectionné */}
          <div className="lg:col-span-1">
              <div className="sticky top-32">
                  {selectedDossier ? (
                      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-right">
                          <div className={`${selectedDossier.id.startsWith('SOC') ? 'bg-purple-600' : 'bg-primary'} p-6 text-white`}>
                              <h3 className="text-xl font-black mb-1">{selectedDossier.id.startsWith('SOC') ? 'Dossier Social' : 'Détails du Suivi'}</h3>
                              <p className="text-white/70 text-xs font-bold uppercase tracking-widest">{selectedDossier.id}</p>
                          </div>
                          
                          <div className="p-8">
                              {/* Timeline Statut */}
                              <div className="mb-10">
                                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center">
                                      <Icons.Activity className="w-4 h-4 mr-2" /> Cycle de vie
                                  </h4>
                                  <div className="space-y-6 relative">
                                      <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-gray-100"></div>
                                      
                                      {[
                                          { status: selectedDossier.status, date: selectedDossier.date, current: true, desc: 'Votre dossier est en cours de traitement par les services municipaux.' },
                                          { status: selectedDossier.assigned_service || (selectedDossier.id.startsWith('SOC') ? 'Commission Sociale' : 'Bureau du Courrier'), date: selectedDossier.date, current: false, desc: 'Dossier orienté vers le service compétent.' },
                                          { status: 'Dépôt du dossier', date: selectedDossier.date, current: false, desc: 'Dossier reçu et enregistré avec succès.' },
                                      ].map((h, i) => (
                                          <div key={i} className="flex items-start relative z-10">
                                              <div className={`w-5 h-5 rounded-full border-4 border-white shadow-sm flex-shrink-0 mt-1 ${h.current ? (selectedDossier.id.startsWith('SOC') ? 'bg-purple-600' : 'bg-primary') + ' scale-125' : 'bg-gray-200'}`}></div>
                                              <div className="ml-4">
                                                  <p className={`text-sm font-black ${h.current ? 'text-gray-900' : 'text-gray-400'}`}>{h.status}</p>
                                                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">{new Date(h.date).toLocaleDateString()}</p>
                                                  {h.current && <p className="text-xs text-gray-500 italic">{h.desc}</p>}
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              </div>

                              {/* Réponse Officielle */}
                              {selectedDossier.service_feedback && (
                                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mb-8 animate-fade-in">
                                  <div className="flex items-center gap-2 mb-3">
                                    <Icons.ShieldCheck className="w-4 h-4 text-primary" />
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Réponse Officielle</h4>
                                  </div>
                                  <p className="text-sm text-gray-800 leading-relaxed font-bold whitespace-pre-wrap">
                                      {selectedDossier.service_feedback}
                                  </p>
                                </div>
                              )}

                              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Récapitulatif</h4>
                                  <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                      {selectedDossier.description}
                                  </p>
                              </div>

                              {/* Actions Contextuelles */}
                              <div className="space-y-4">
                                  {selectedDossier.status === 'Validé' && (
                                      <button className="w-full bg-green-600 text-white py-4 rounded-2xl font-black hover:bg-green-700 transition shadow-lg shadow-green-200 flex items-center justify-center">
                                          <Icons.Download className="w-5 h-5 mr-2" />
                                          Télécharger mon Acte
                                      </button>
                                  )}
                                  
                                  {selectedDossier.status === 'Attente documents' && (
                                      <button className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black hover:bg-orange-600 transition shadow-lg shadow-orange-200 flex items-center justify-center">
                                          <Icons.Paperclip className="w-5 h-5 mr-2" />
                                          Compléter le dossier
                                      </button>
                                  )}

                                  <button className="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-black hover:bg-gray-200 transition flex items-center justify-center">
                                      <Icons.MessageSquare className="w-5 h-5 mr-2" />
                                      Poser une question
                                  </button>
                              </div>
                          </div>
                      </div>
                  ) : (
                      <div className="bg-gray-100 rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
                          <Icons.MousePointer2 className="w-12 h-12 text-gray-300 mx-auto mb-4 animate-bounce" />
                          <p className="text-gray-400 font-bold">Sélectionnez un dossier pour voir les détails et le suivi.</p>
                      </div>
                  )}
              </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
