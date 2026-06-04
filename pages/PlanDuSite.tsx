import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Building, FileText, User, Briefcase, Map, Info, ChevronRight, LayoutGrid } from 'lucide-react';

const PlanDuSite: React.FC = () => {
  const sections = [
    {
      title: "Général",
      icon: Home,
      links: [
        { name: "Accueil", path: "/" },
        { name: "À propos de la Mairie", path: "/about" },
        { name: "Contactez-nous", path: "/contact" },
      ]
    },
    {
      title: "Vie Municipale",
      icon: Building,
      links: [
        { name: "Conseil Municipal", path: "/conseil" },
        { name: "Actualités", path: "/news" },
        { name: "Agenda", path: "/agenda" },
        { name: "Documents & Archives", path: "/documents" },
      ]
    },
    {
      title: "Services & Démarches",
      icon: FileText,
      links: [
        { name: "Tous les services", path: "/services" },
        { name: "Démarches en ligne", path: "/demarches" },
        { name: "État Civil", path: "/etat-civil" },
        { name: "Urbanisme", path: "/urbanisme" },
        { name: "Action Sociale", path: "/social" },
        { name: "Environnement & Voirie", path: "/environnement" },
        { name: "Entreprises & Économie", path: "/entreprises" },
        { name: "Tourisme & Culture", path: "/tourisme" },
        { name: "Signalement d'incident", path: "/signalement" },
      ]
    },
    {
      title: "Espace Citoyen",
      icon: User,
      links: [
        { name: "Connexion", path: "/login" },
        { name: "Inscription", path: "/register" },
        { name: "Tableau de bord", path: "/dashboard" },
      ]
    },
    {
      title: "Administration",
      icon: Briefcase,
      links: [
        { name: "Espace Administration", path: "/admin" },
      ]
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 flex items-center justify-center">
                <LayoutGrid className="mr-3 h-10 w-10 text-primary" />
                Plan du Site
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Retrouvez l'ensemble des pages et services disponibles sur le site de la Mairie de Ziguinchor pour faciliter votre navigation.
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition duration-300">
                    <div className="flex items-center mb-6">
                        <div className="bg-green-50 p-3 rounded-lg mr-4">
                            <section.icon className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                    </div>
                    <ul className="space-y-3">
                        {section.links.map((link, linkIdx) => (
                            <li key={linkIdx}>
                                <Link 
                                    to={link.path} 
                                    className="flex items-center text-gray-600 hover:text-primary transition group pl-2 border-l-2 border-transparent hover:border-primary"
                                >
                                    <ChevronRight className="h-4 w-4 mr-2 text-gray-300 group-hover:text-primary transition" />
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PlanDuSite;