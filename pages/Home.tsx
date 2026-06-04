import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Calendar, Users, Activity, Shield, Clock, Smartphone } from 'lucide-react';
import { ArticleService, Article } from '../services/api';

const Home: React.FC = () => {
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get latest 3 articles (Async)
    // getAll(page=1, limit=3, category='Tout')
    ArticleService.getAll(1, 3, 'Tout').then(response => {
        if (response && response.data) {
            setRecentArticles(response.data);
        } else {
             setRecentArticles([]);
        }
    }).catch(err => {
        console.error(err);
        setRecentArticles([]);
    });
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white h-[500px] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/images/accueil/hero.jpg"
            alt="Commune de Ziguinchor"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
            Bienvenue à <span className="text-primary">Ziguinchor</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-2xl">
            Découvrez votre commune, accédez aux services administratifs et restez informés des dernières actualités municipales.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/demarches"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-green-700 transition"
            >
              Démarches en ligne
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-gray-900 transition"
            >
              Découvrir la Mairie
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Access Grid */}
      <section className="py-12 bg-white -mt-16 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: FileText, title: 'État Civil', desc: 'Actes de naissance, mariage...', link: '/etat-civil' },
            { icon: Calendar, title: 'Agenda', desc: 'Événements à venir', link: '/agenda' },
            { icon: Users, title: 'Conseil Municipal', desc: 'Vos élus et les délibérations', link: '/conseil' },
            { icon: Activity, title: 'Signalement', desc: 'Problème de voirie, éclairage', link: '/signalement' },
          ].map((item, index) => (
            <Link to={item.link} key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition transform hover:-translate-y-1 group">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary transition">
                <item.icon className="h-6 w-6 text-primary group-hover:text-white transition" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Maire Quote Section (Positioned higher) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-green-50 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 shadow-sm border border-green-100">
            <div className="flex-shrink-0 relative group">
               <div className="absolute inset-0 bg-primary rounded-full transform translate-x-2 translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 transition"></div>
               <img
                src="/images/elus/maire.jpg"
                alt="Le Maire"
                className="w-48 h-48 rounded-full border-4 border-white shadow-lg object-cover relative z-10"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Le mot du Maire</h2>
              <blockquote className="text-xl text-gray-700 italic mb-6 leading-relaxed">
                "Notre ambition est de faire de Ziguinchor une ville modèle, verte et inclusive, où chaque citoyen participe activement au développement local. Ensemble, construisons l'avenir de notre belle cité."
              </blockquote>
              <div className="flex flex-col md:flex-row items-center md:justify-between">
                  <div className="mb-6 md:mb-0 text-center md:text-left">
                      <div className="font-bold text-xl text-gray-900">Djibril Sonko</div>
                      <div className="text-primary font-medium">Maire de Ziguinchor</div>
                  </div>
                  <Link to="/conseil" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-green-700 transition shadow-md">
                      Rencontrer le Conseil Municipal <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Espace Citoyen Promo Section */}
      <section className="py-16 bg-white border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-primary mb-4">
                Nouveau
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                Votre Mairie à portée de clic avec l'Espace Citoyen
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Simplifiez votre quotidien en réalisant vos démarches administratives en ligne. Créez votre compte gratuitement pour accéder à des services personnalisés et sécurisés.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  { icon: Clock, text: "Disponible 24h/24 et 7j/7 sans déplacement" },
                  { icon: Shield, text: "Données personnelles sécurisées" },
                  { icon: Smartphone, text: "Suivi de vos demandes en temps réel" }
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center text-primary">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <span className="ml-4 text-gray-700 font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-green-700 transition shadow-lg hover:shadow-xl">
                  Créer mon compte
                </Link>
                <Link to="/dashboard" className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition">
                  Se connecter
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-secondary rounded-2xl transform rotate-3 scale-105 opacity-20"></div>
              <img 
                src="/images/accueil/en_un_clic.png" 
                alt="Espace Citoyen sur ordinateur" 
                className="relative rounded-2xl shadow-2xl w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Documents Section */}
      {/* <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 order-2 md:order-1">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                Transparence & Accès aux Documents
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                La Mairie de Ziguinchor s'engage pour la transparence. Consultez et téléchargez librement tous les actes administratifs, arrêtés et rapports officiels.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  "Arrêtés Municipaux",
                  "Procès-Verbaux",
                  "Budgets & Finances",
                  "Urbanisme & PLU"
                ].map(item => (
                  <div key={item} className="flex items-center space-x-2 text-gray-700">
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/documents" className="inline-flex items-center text-primary font-bold hover:underline group">
                Consulter la bibliothèque de documents 
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="flex-1 order-1 md:order-2 grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-8">
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition">
                  <FileText className="h-10 w-10 text-red-500 mb-3" />
                  <span className="text-[10px] font-black uppercase text-gray-400">PDF officiel</span>
                  <p className="font-bold text-gray-800 text-sm mt-1">Arrêtés de circulation</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition">
                  <FileText className="h-10 w-10 text-blue-500 mb-3" />
                  <span className="text-[10px] font-black uppercase text-gray-400">Rapport</span>
                  <p className="font-bold text-gray-800 text-sm mt-1">Budget Municipal</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-green-50 p-6 rounded-2xl border border-green-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition">
                  <FileText className="h-10 w-10 text-primary mb-3" />
                  <span className="text-[10px] font-black uppercase text-gray-400">Urbanisme</span>
                  <p className="font-bold text-gray-800 text-sm mt-1">Plan de construction</p>
                </div>
                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition">
                  <FileText className="h-10 w-10 text-amber-500 mb-3" />
                  <span className="text-[10px] font-black uppercase text-gray-400">Archives</span>
                  <p className="font-bold text-gray-800 text-sm mt-1">Mémoire de la ville</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
 */}
      {/* News Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Actualités récentes</h2>
              <p className="mt-2 text-gray-600">Les dernières informations de votre commune.</p>
            </div>
            <Link to="/news" className="hidden sm:flex items-center text-primary font-semibold hover:text-green-700">
              Voir tout <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {recentArticles && recentArticles.length > 0 ? (
                 recentArticles.map((article) => (
                  <article 
                    key={article.id} 
                    onClick={() => navigate(`/news/${article.id}`)}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer group"
                  >
                    <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover group-hover:scale-105 transition duration-500" />
                    <div className="p-6">
                      <div className="text-sm text-primary font-semibold mb-2">{article.category}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition">{article.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {article.content}
                      </p>
                      <div className="text-xs text-gray-400">Publié le {new Date(article.date).toLocaleDateString()}</div>
                    </div>
                  </article>
                 ))
             ) : (
                <div className="col-span-3 text-center py-8 text-gray-500">
                    Chargement des actualités...
                </div>
             )}
          </div>
          <div className="mt-8 text-center sm:hidden">
             <Link to="/news" className="inline-flex items-center text-primary font-semibold">
              Voir toutes les actualités <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;