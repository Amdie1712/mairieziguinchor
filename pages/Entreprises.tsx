import React from 'react';
import { Briefcase, Building, TrendingUp, FileText, ShoppingCart, Users, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Entreprises: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900">Entreprises & Économie</h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Soutenir le tissu économique local, accompagner les porteurs de projets et gérer la commande publique.
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* Projet Burok Section - FEATURED */}
        <section className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-8 md:p-12 text-white shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                <Briefcase className="w-64 h-64" />
            </div>
            <div className="relative z-10">
                <div className="inline-flex items-center bg-white/20 px-3 py-1 rounded-full text-sm font-semibold mb-4 backdrop-blur-sm">
                    <Rocket className="w-4 h-4 mr-2" />
                    Initiative Municipale Phare
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Projet Burok</h2>
                <p className="text-lg text-green-50 max-w-2xl mb-8 leading-relaxed">
                    Le <strong>Projet Burok</strong> est un programme ambitieux pour l'employabilité des jeunes et l'entrepreneuriat des femmes à Ziguinchor. 
                    Il offre un dispositif complet d'accompagnement technique et financier pour transformer vos idées en entreprises viables.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={() => navigate('/faire-une-demarche', { state: { dossierType: 'Déposer un dossier Projet BUROK', category: 'Entreprises' } })}
                        className="bg-white text-green-800 px-6 py-3 rounded-lg font-bold hover:bg-green-50 transition shadow-lg flex items-center justify-center"
                    >
                        <FileText className="h-5 w-5 mr-2" />
                        Déposer un dossier
                    </button>
                    <button 
                        onClick={() => navigate('/faire-une-demarche', { state: { dossierType: 'Rejoindre le réseau Entreprises', category: 'Entreprises' } })}
                        className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white/10 transition flex items-center justify-center"
                    >
                        <Users className="h-5 w-5 mr-2" />
                        Rejoindre le réseau
                    </button>
                </div>
                
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-white/20 pt-8">
                    <div>
                        <div className="text-3xl font-bold mb-1">500+</div>
                        <div className="text-green-100 text-sm">Jeunes accompagnés</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold mb-1">100M</div>
                        <div className="text-green-100 text-sm">Fonds de financement (CFA)</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold mb-1">50</div>
                        <div className="text-green-100 text-sm">Startups incubées</div>
                    </div>
                </div>
            </div>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-blue-500">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-700">Création d'entreprise</h3>
                    <TrendingUp className="text-blue-500 h-6 w-6" />
                </div>
                <p className="text-sm text-gray-600 mb-4">Un guichet unique pour vous accompagner dans vos démarches administratives.</p>
                <a href="#" className="text-blue-600 text-sm font-medium hover:underline">Guide du créateur &rarr;</a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-primary">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-700">Marchés Publics</h3>
                    <FileText className="text-primary h-6 w-6" />
                </div>
                <p className="text-sm text-gray-600 mb-4">Consultez les appels d'offres en cours et déposez vos candidatures.</p>
                <a href="#" className="text-primary text-sm font-medium hover:underline">Plateforme des marchés &rarr;</a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-purple-500">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-700">Commerce local</h3>
                    <ShoppingCart className="text-purple-500 h-6 w-6" />
                </div>
                <p className="text-sm text-gray-600 mb-4">Dynamisation du centre-ville, foires et marchés hebdomadaires.</p>
                <a href="#" className="text-purple-600 text-sm font-medium hover:underline">Agenda commercial &rarr;</a>
            </div>
        </div>

        {/* Occupation Domaine Public */}
        <section className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row">
             <div className="md:w-1/3 bg-gray-100 flex items-center justify-center p-8">
                <Building className="h-24 w-24 text-gray-300" />
             </div>
             <div className="p-8 md:w-2/3">
                 <h2 className="text-2xl font-bold text-gray-900 mb-4">Occupation du Domaine Public</h2>
                 <p className="text-gray-600 mb-6">
                     Vous êtes commerçant, artisan ou entrepreneur de travaux ? Toute occupation du domaine public (terrasse, étalage, échafaudage, benne...) est soumise à autorisation préalable de la mairie.
                 </p>
                 <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={() => navigate('/dashboard', { state: { openNewDossier: true, dossierType: 'Occupation domaine public' } })}
                        className="bg-primary text-white px-5 py-2 rounded font-medium hover:bg-green-700 transition"
                    >
                        Faire une demande (Terrasse/Étalage)
                    </button>
                    <button 
                        onClick={() => navigate('/dashboard', { state: { openNewDossier: true, dossierType: 'Déclaration de travaux' } })}
                        className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded font-medium hover:bg-gray-50 transition"
                    >
                        Demande pour Travaux/Benne
                    </button>
                 </div>
             </div>
        </section>

        {/* Emploi, Stage & Volontariat */}
        <section className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-blue-900 mb-2">Emplois, Stages & Volontariat</h2>
                    <p className="text-blue-800 max-w-2xl">
                        Vous souhaitez mettre vos compétences au service de la commune ? Déposez votre candidature pour un emploi, un stage ou devenez volontaire pour les grands événements municipaux.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                        onClick={() => navigate('/faire-une-demarche', { state: { dossierType: 'Demande de Stage', category: 'Entreprises' } })}
                        className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-blue-100 transition text-sm"
                    >
                        Stage
                    </button>
                    <button 
                        onClick={() => navigate('/faire-une-demarche', { state: { dossierType: 'Demande d’Emploi', category: 'Entreprises' } })}
                        className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-blue-100 transition text-sm"
                    >
                        Emploi
                    </button>
                    <button 
                        onClick={() => navigate('/faire-une-demarche', { state: { dossierType: 'Être Volontaire', category: 'Entreprises' } })}
                        className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-blue-100 transition text-sm"
                    >
                        Volontariat
                    </button>
                </div>
            </div>
        </section>

        {/* Taxes locales */}
        <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Fiscalité & Taxes Locales</h2>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <p className="text-gray-600 mb-4">
                    Informations sur la Contribution Économique Locale (CEL), la Taxe sur la Publicité Extérieure (TLPE) et les tarifs des droits de place sur les marchés.
                </p>
                <ul className="space-y-3">
                    <li className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="font-medium text-gray-700">Grille tarifaire - Droits de place 2024</span>
                        <a href="#" className="text-primary hover:underline text-sm">Télécharger PDF</a>
                    </li>
                    <li className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="font-medium text-gray-700">Déclaration TLPE (Publicité)</span>
                        <a href="#" className="text-primary hover:underline text-sm">Télécharger PDF</a>
                    </li>
                </ul>
            </div>
        </section>

      </div>
    </div>
  );
};

export default Entreprises;