import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Baby, HeartHandshake, FileX, Info, ArrowRight, UserCheck } from 'lucide-react';
import { AuthService } from '../services/auth';

const EtatCivil: React.FC = () => {
  const navigate = useNavigate();

  const handleRequest = (type: string) => {
    const user = AuthService.getCurrentUser();
    if (user) {
        // Redirect to dashboard with intent to open the specific modal
        navigate('/dashboard', { state: { openNewDossier: true, dossierType: type } });
    } else {
        // Redirect to login then dashboard (simplified here to just login)
        alert("Vous devez être connecté pour effectuer cette démarche.");
        navigate('/login');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-3xl">
            Services de l'État Civil
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-lg text-gray-500 font-medium">
            Gestion des actes administratifs et documents officiels des citoyens de Ziguinchor.
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Intro Alert */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <div className="flex">
                <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                    <p className="text-sm text-blue-700">
                    La délivrance d'actes d'état civil est gratuite. Les demandes peuvent être effectuées en ligne via votre Espace Citoyen ou directement au guichet de la Mairie.
                    </p>
                </div>
            </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Naissance */}
            <div className="bg-white rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 border border-white overflow-hidden group">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 flex flex-col items-center justify-center border-b border-gray-100">
                    <div className="bg-white p-5 rounded-3xl shadow-sm mb-4 group-hover:scale-110 transition-transform duration-500">
                        <Baby className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Citoyenneté</h3>
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">Actes de Naissance</h2>
                </div>
                <div className="p-8">
                    <ul className="text-sm font-medium text-gray-500 mb-8 space-y-3">
                        {['Demande d’acte de naissance', 'Copie littérale', 'Extrait de naissance', 'Déclaration de naissance'].map((item, i) => (
                          <li key={i} className="flex items-center group/item hover:text-primary transition-colors">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary/30 mr-3 group-hover/item:scale-150 transition-transform" />
                            {item}
                          </li>
                        ))}
                    </ul>
                    <button 
                        onClick={() => handleRequest('Acte de naissance')}
                        className="w-full flex items-center justify-center px-6 py-4 bg-primary text-white font-black uppercase italic tracking-tighter rounded-2xl hover:bg-green-700 transition-all shadow-lg shadow-green-200 group"
                    >
                        Démarrer la démarche
                        <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Mariage & Décès */}
            <div className="bg-white rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 border border-white overflow-hidden group">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 flex flex-col items-center justify-center border-b border-gray-100">
                    <div className="bg-white p-5 rounded-3xl shadow-sm mb-4 group-hover:scale-110 transition-transform duration-500">
                        <HeartHandshake className="h-10 w-10 text-blue-600" />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Famille</h3>
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">Mariage & Décès</h2>
                </div>
                <div className="p-8">
                    <ul className="text-sm font-medium text-gray-500 mb-8 space-y-3">
                        {['Acte de mariage', 'Acte de décès', 'Dossier de mariage'].map((item, i) => (
                          <li key={i} className="flex items-center group/item hover:text-blue-600 transition-colors">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-400/30 mr-3 group-hover/item:scale-150 transition-transform" />
                            {item}
                          </li>
                        ))}
                    </ul>
                    <button 
                        onClick={() => handleRequest('Actes familiaux')}
                        className="w-full flex items-center justify-center px-6 py-4 bg-blue-600 text-white font-black uppercase italic tracking-tighter rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 group"
                    >
                        Démarrer la démarche
                        <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Documents Officiels */}
            <div className="bg-white rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 border border-white overflow-hidden group">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 flex flex-col items-center justify-center border-b border-gray-100">
                    <div className="bg-white p-5 rounded-3xl shadow-sm mb-4 group-hover:scale-110 transition-transform duration-500">
                        <UserCheck className="h-10 w-10 text-amber-600" />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Administration</h3>
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">Autres Documents</h2>
                </div>
                <div className="p-8">
                    <ul className="text-sm font-medium text-gray-500 mb-8 space-y-3">
                        {['Légalisation de documents', 'Certificat de résidence', 'Légalité de signature'].map((item, i) => (
                          <li key={i} className="flex items-center group/item hover:text-amber-600 transition-colors">
                            <div className="h-1.5 w-1.5 rounded-full bg-amber-400/30 mr-3 group-hover/item:scale-150 transition-transform" />
                            {item}
                          </li>
                        ))}
                    </ul>
                    <button 
                        onClick={() => handleRequest('Documents administratifs')}
                        className="w-full flex items-center justify-center px-6 py-4 bg-amber-600 text-white font-black uppercase italic tracking-tighter rounded-2xl hover:bg-amber-700 transition-all shadow-lg shadow-amber-200 group"
                    >
                        Démarrer la démarche
                        <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>

        </div>

        {/* Identité Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
                <div className="flex items-center mb-2">
                    <UserCheck className="h-6 w-6 text-primary mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900">Carte d'Identité & Passeport</h2>
                </div>
                <p className="text-gray-600 max-w-2xl">
                    Les demandes de Carte Nationale d'Identité (CNI) et de Passeport se font uniquement sur rendez-vous au service de l'État Civil. La présence du demandeur est obligatoire pour la prise d'empreintes.
                </p>
            </div>
            <button 
                onClick={() => navigate('/contact')}
                className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition shadow-lg"
            >
                Prendre rendez-vous
            </button>
        </div>
      </div>
    </div>
  );
};

export default EtatCivil;