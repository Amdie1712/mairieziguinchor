import React, { useEffect, useState } from 'react';
import { Users, Building, Map, TrendingUp } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { ContentService, AboutSection, AboutStat, CouncilMember, CouncilService } from '../services/api';

const About: React.FC = () => {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [stats, setStats] = useState<AboutStat[]>([]);
  const [members, setMembers] = useState<CouncilMember[]>([]);

  useEffect(() => {
    Promise.all([
      ContentService.getAbout(),
      ContentService.getAboutStats(),
      CouncilService.getMembers()
    ]).then(([aboutSections, aboutStats, councilMembers]) => {
      setSections(aboutSections);
      setStats(aboutStats);
      setMembers(councilMembers.slice(0, 4)); // Only first 4 for team preview
    }).catch(console.error);
  }, []);

  const IconComponent = ({ name, className }: { name: string; className: string }) => {
    const Icon = (LucideIcons as any)[name] || Building;
    return <Icon className={className} />;
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-gray-900">À propos de la Mairie</h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl">
            Découvrez l'histoire, l'organisation et les missions de l'institution municipale de Ziguinchor.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        
        {sections.map((section, idx) => (
          <section key={section.id} className={`${idx % 2 === 1 ? 'bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-20' : ''}`}>
             <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div className={idx % 2 === 1 ? 'md:order-2' : ''}>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 font-primary">{section.title}</h2>
                  <div className="text-gray-600 mb-6 leading-relaxed whitespace-pre-line text-lg">
                    {section.content}
                  </div>
                </div>
                <div className={`bg-gray-200 rounded-3xl h-96 overflow-hidden shadow-2xl ${idx % 2 === 1 ? 'md:order-1' : ''}`}>
                   <img 
                    src={`https://picsum.photos/seed/${section.title}/800/600`} 
                    alt={section.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
                   />
                </div>
             </div>
          </section>
        ))}

        {sections.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl">
             <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
             <p className="text-gray-500 font-medium">Aucun contenu disponible pour le moment.</p>
          </div>
        )}

        {/* Chiffres Clés - The "Third Column" section */}
        {stats.length > 0 && (
          <section className="bg-primary text-white rounded-3xl p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <TrendingUp className="h-48 w-48" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-12 text-center">Ziguinchor en chiffres</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat) => (
                  <div key={stat.id} className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                    <div className="bg-white text-primary h-14 w-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <IconComponent name={stat.icon || 'TrendingUp'} className="h-7 w-7" />
                    </div>
                    <div className="text-4xl font-extrabold mb-2">{stat.value}</div>
                    <div className="text-white/80 font-medium tracking-wide uppercase text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Organization / Team */}
       {/*  <section className="pt-20 border-t border-gray-100">
          <div className="flex items-center mb-8">
            <Users className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">L'Équipe Municipale</h2>
          </div>
          <p className="text-gray-600 mb-12 text-lg">Le Conseil Municipal travaille quotidiennement pour servir les intérêts de la population.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
            {members.map((member) => (
              <div key={member.id} className="text-center group">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-primary rounded-full scale-0 group-hover:scale-105 transition-transform duration-300 opacity-20"></div>
                  <img 
                    src={member.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`} 
                    alt={member.name} 
                    className="w-48 h-48 rounded-full mx-auto relative z-10 object-cover border-4 border-white shadow-lg group-hover:shadow-xl transition-all duration-300"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary font-semibold text-sm tracking-widest uppercase">{member.role}</p>
              </div>
            ))}
          </div>
        </section>
 */}
      </div>
    </div>
  );
};

export default About;
