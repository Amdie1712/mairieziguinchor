import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  Map as MapIcon, 
  BarChart3, 
  Handshake, 
  Image as ImageIcon 
} from 'lucide-react';

const ProjectNav: React.FC = () => {
    const location = useLocation();
    
    const tabs = [
        { label: 'Liste des Projets', path: '/projets', icon: LayoutGrid },
        { label: 'Carte Collaborative', path: '/projets/carte', icon: MapIcon },
        { label: 'Suivi & Stats', path: '/projets/stats', icon: BarChart3 },
        { label: 'Partenaires', path: '/projets/partenaires', icon: Handshake },
        { label: 'Galerie Média', path: '/projets/galerie', icon: ImageIcon },
    ];

    return (
        <div className="flex flex-wrap justify-center gap-4 mb-12">
            {tabs.map((tab) => (
                <Link
                    key={tab.path}
                    to={tab.path}
                    className={`flex items-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] transition-all shadow-lg md:shadow-xl ${
                        location.pathname === tab.path 
                            ? 'bg-primary text-white scale-105 shadow-primary/20' 
                            : 'bg-white text-gray-400 hover:text-gray-900 border border-gray-100 hover:scale-105'
                    }`}
                >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                </Link>
            ))}
        </div>
    );
};

export default ProjectNav;
