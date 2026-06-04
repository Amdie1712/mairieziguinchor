import React, { useState, useEffect } from 'react';
import { Users, FileText, Calendar, Download, Mail, Quote, Target, History, MapPin, Phone, Clock, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { CouncilService, CouncilMember, CouncilSession, ContentService, ServiceItem } from '../services/api';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
// @ts-ignore
import markerIcon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
// @ts-ignore
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIconRetina,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper to center map
const RecenterMap = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 16);
    }, [center, map]);
    return null;
};

const Conseil: React.FC = () => {
  const [members, setMembers] = useState<CouncilMember[]>([]);
  const [sessions, setSessions] = useState<CouncilSession[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([12.5859, -16.2729]);

  useEffect(() => {
    CouncilService.getMembers().then(data => setMembers(Array.isArray(data) ? data : [])).catch(err => {
        console.error(err);
        setMembers([]);
    });
    CouncilService.getSessions().then(data => {
        setSessions(Array.isArray(data) ? data : []);
    }).catch(err => {
        console.error('Frontend Sessions Error:', err);
        setSessions([]);
    });
    ContentService.getServices().then(data => {
        const servicesData = Array.isArray(data) ? data : [];
        console.log('Services loaded in Conseil:', servicesData);
        setServices(servicesData);
        // Center map on the first service with valid coordinates if any
        const firstValid = servicesData.find(s => s.latitude && s.longitude);
        if (firstValid) {
            setMapCenter([Number(firstValid.latitude), Number(firstValid.longitude)]);
        }
    }).catch(err => {
        console.error(err);
        setServices([]);
    });
}, []);
  
    const findHub = (name: string) => {
        const firstWord = name.split(' ')[0].toLowerCase().replace('é', 'e');
        const found = services.find(s => s.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(firstWord));
        if (found && found.latitude && found.longitude) {
            setMapCenter([Number(found.latitude), Number(found.longitude)]);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 800);
        return () => clearTimeout(timer);
    }, [services, mapCenter]);

    const membersArray = Array.isArray(members) ? members : [];
  const sessionsArray = Array.isArray(sessions) ? sessions.map(s => ({
    ...s,
    status: s.status ? s.status.trim() : 'Passé'
  })) : [];

  const maire = membersArray.find(m => m.role.toLowerCase().includes("maire") && !m.role.toLowerCase().includes("adjoint"));
  const deputies = membersArray.filter(m => m.role.toLowerCase().includes("adjoint")).sort((a, b) => {
      // Sort by role (1er, 2ème...)
      const getNum = (s: string) => {
          const m = s.match(/(\d+)/);
          return m ? parseInt(m[1]) : 99;
      };
      return getNum(a.role) - getNum(b.role);
  });
  const councilors = membersArray.filter(m => 
      !m.role.toLowerCase().includes("maire") && 
      !m.role.toLowerCase().includes("adjoint")
  );

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M0,50 Q25,0 50,50 T100,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </svg>
        </div>
        <div className="max-w-7xl mx-auto py-4 px-6 relative z-10">
            <div className="flex flex-col items-center text-center">
                <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-sm">Institutions Communales</span>
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase italic">
                    Conseil <span className="text-primary italic">Municipal</span>
                </h1>
                <p className="mt-8 max-w-2xl text-lg text-gray-500 font-medium leading-relaxed">
                    Découvrez vos élus, le fonctionnement de l'assemblée délibérante et consultez les comptes-rendus des séances qui façonnent l'avenir de Ziguinchor.
                </p>
               {/*  <div className="flex flex-wrap justify-center gap-4 mt-10">
                    <a href="#sessions" className="group flex items-center px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-gray-900 transition-all active:scale-95">
                        <Calendar className="w-4 h-4 mr-3" />
                        Agenda du Conseil
                    </a>
                    <a href="#sessions" className="group flex items-center px-8 py-4 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:border-primary hover:text-primary transition-all shadow-sm">
                        <FileText className="w-4 h-4 mr-3" />
                        Ordre du jour
                    </a>
                </div> */}
            </div>
        </div>
      </div>
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* <div className="max-w-7xl mx-auto px-6 py-16 space-y-24"> */}
        
        {/* Le Maire - Profile Card */}
        {maire && (
            <>
            <section className="relative">
                <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row min-h-[500px]">
                    <div className="md:w-2/5 relative">
                        <img 
                           //  className="absolute inset-0 h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                            className="absolute inset-0 h-full w-full object-cover transition-all duration-700" 
                            src={maire.image} 
                            alt={maire.name} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-40"></div>
                    </div>
                    <div className="p-10 md:p-16 md:w-3/5 flex flex-col justify-center relative bg-white">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.05] hidden md:block">
                            <Quote className="w-32 h-32" />
                        </div>
                        <div className="flex items-center mb-6">
                            <span className="bg-primary text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest">Le Maire de Ziguinchor</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase italic mb-4">
                            {maire.name}
                        </h2>
                        <div className="h-1.5 w-24 bg-primary rounded-full mb-8"></div>
                        
                        <blockquote className="text-2xl font-bold text-gray-800 leading-tight tracking-tight mb-10 italic">
                            "Bâtir ensemble une commune solidaire, dynamique et respectueuse de son environnement. Transformer nos ambitions en réalités concrètes."
                        </blockquote>
                        
                        <div className="flex flex-wrap gap-6">
                             <a href="mailto:maire@mairieziguinchor.sn" className="group relative px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] overflow-hidden transition-all hover:pr-12">
                                <span className="relative z-10">Contacter le Maire</span>
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                             </a>
                            {/*  <a href="#sessions" className="group flex items-center px-8 py-4 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:border-primary hover:text-primary transition-all">
                                <Calendar className="w-4 h-4 mr-2" />
                                Agenda du Conseil
                             </a>
                             <a href="#sessions" className="group flex items-center px-8 py-4 bg-primary/5 text-primary rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all">
                                <FileText className="w-4 h-4 mr-2" />
                                Ordre du jour
                             </a> */}
                        </div>
                    </div>
                </div>

                {/* Info Cards Overlay */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-[-3rem] px-8 relative z-20">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-50 flex items-start space-x-6">
                        <div className="bg-blue-50 p-4 rounded-2xl">
                            <History className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 mb-3">Parcours & Engagement</h3>
                            <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                Natif de la région, {maire.name} a consacré sa carrière au service public. Diplômé en administration, il a occupé divers postes à responsabilité avant d'être élu à la tête de la municipalité.
                            </p>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-50 flex items-start space-x-6">
                        <div className="bg-green-50 p-4 rounded-2xl">
                            <Target className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-3">Vision Stratégique</h3>
                            <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                Sa vision repose sur une Ziguinchor verte, prospère et solidaire. Son mandat se concentre sur la modernisation urbaine, l'économie sociale et la transition écologique.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            </>
        )}

        {/* Les Adjoints */}
        <section id="adjoints" className="scroll-mt-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4 inline-block shadow-sm">L'Exécutif Municipal</span>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Les <span className="text-primary italic">Adjoints</span> au Maire</h2>
                    <p className="text-gray-500 mt-2 font-medium">L'équipe de 16 adjoints qui anime les différentes commissions thématiques.</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {deputies.map((deputy, index) => (
                    <div 
                        key={deputy.id} 
                        className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group ${index < 4 ? 'ring-2 ring-primary/5' : ''}`}
                    >
                        <div className="relative h-80 overflow-hidden bg-gray-100">
                             <img 
                                className="w-full h-full object-cover object-top transition duration-700 group-hover:scale-110" 
                                src={deputy.image} 
                                alt={deputy.name} 
                            />
                             <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity"></div>
                           {/*  {index < 4 && (
                                <div className="absolute top-4 right-4 h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center font-black text-xs shadow-lg transform -rotate-12">
                                    TOP
                                </div>
                            )} */}
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-80">{deputy.role}</p>
                                <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none">{deputy.name}</h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-2 opacity-60">Délégation & Mission</p>
                                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 group-hover:border-primary/20 group-hover:bg-primary/5 transition-colors">
                                        <p className="text-[11px] font-bold text-gray-700 leading-relaxed italic">
                                            {deputy.commission || "Membre de l'exécutif municipal"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Les Conseillers (Simple List/Grid) */}
        <section>
            <div className="flex items-center mb-8">
                <div className="h-8 w-1.5 bg-primary rounded-full mr-4"></div>
                <h2 className="text-2xl font-black uppercase tracking-tighter italic">Les Conseillers Municipaux</h2>
            </div>
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                     {councilors.map(c => (
                         <div key={c.id} className="flex items-center space-x-6 p-4 rounded-2xl transition-all hover:bg-gray-50 border border-transparent hover:border-gray-100 group">
                             <div className="h-16 w-16 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden shadow-lg border-2 border-white ring-1 ring-gray-100 transition-transform group-hover:scale-110">
                                 <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
                             </div>
                             <div>
                                 <p className="text-sm font-black uppercase tracking-tight text-gray-900 group-hover:text-primary transition-colors">{c.name}</p>
                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 leading-tight">
                                     {c.commission || "Conseiller municipal"}
                                 </p>
                             </div>
                         </div>
                     ))}
                 </div>
            </div>
        </section>

        {/* Agenda et Ordre du Jour */}
        <section id="sessions" className="space-y-12 pt-24 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4 inline-block shadow-sm">Calendrier & Actes</span>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Agenda du <span className="text-primary italic">Conseil</span></h2>
                    <p className="text-gray-500 mt-2 font-medium">Consultez les dates des prochaines sessions et les documents officiels.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Prochaine Séance Detail */}
                <div className="lg:col-span-1 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl p-10 shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-primary rounded-full opacity-20 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                     <div className="flex items-center mb-10 translate-z-0">
                         <div className="bg-primary/20 p-3 rounded-2xl mr-4 backdrop-blur-md border border-white/10">
                            <Calendar className="h-6 w-6 text-primary" />
                         </div>
                         <h3 className="text-xl font-black uppercase tracking-tighter italic">Prochaine Séance</h3>
                     </div>
                     
                     {sessionsArray.filter(s => s.status === 'A venir').slice(0, 1).map(s => (
                        <div key={s.id} className="relative z-10">
                            <div className="flex items-baseline mb-6">
                                <span className="text-7xl font-black text-primary leading-none tracking-tighter">{new Date(s.date).getDate()}</span>
                                <div className="ml-4">
                                    <p className="text-2xl font-bold uppercase tracking-widest leading-none mb-1">{new Date(s.date).toLocaleDateString('fr-FR', { month: 'long' })}</p>
                                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">{new Date(s.date).getFullYear()}</p>
                                </div>
                            </div>
                            <h4 className="text-2xl font-black mb-6 leading-tight italic uppercase tracking-tighter">{s.title}</h4>
                            <div className="space-y-4 mb-10">
                                <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                                    <Clock className="w-4 h-4 mr-3 text-primary" />
                                    Ouverture à 09h00
                                </div>
                                <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                                    <MapPin className="w-4 h-4 mr-3 text-primary" />
                                    Hôtel de Ville
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <button 
                                    onClick={() => {
                                        document.getElementById('ordre-du-jour')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="w-full bg-primary text-white py-5 px-6 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-white hover:text-gray-900 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95"
                                >
                                    <FileText className="w-4 h-4" />
                                    Voir l'ordre du jour
                                </button>
                            </div>
                        </div>
                     ))}
                     {sessionsArray.filter(s => s.status === 'A venir').length === 0 && (
                        <div className="relative z-10 py-16 text-center">
                            <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                               <Calendar className="h-10 w-10 text-gray-600" />
                            </div>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">En attente de programmation</p>
                        </div>
                     )}
                </div>

                {/* Comptes Rendus & Dernières Séances */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    {/* Ordre du jour detail */}
                    <div id="ordre-du-jour" className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-10 scroll-mt-28">
                        <div className="flex items-center mb-8">
                            <div className="bg-primary/10 p-3 rounded-2xl mr-4">
                                <Quote className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tighter italic text-gray-900">Ordre du jour (Séance à venir)</h3>
                        </div>
                        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                             <ul className="space-y-4">
                                {sessionsArray.find(s => s.status === 'A venir')?.agenda ? (
                                    sessionsArray.find(s => s.status === 'A venir')?.agenda?.split(/\\n|\n/).map((item, i) => (
                                        <li key={i} className="flex items-start">
                                            <div className="h-2 w-2 rounded-full bg-primary mt-1.5 mr-4 flex-shrink-0"></div>
                                            <span className="text-sm font-bold text-gray-700 italic">{item}</span>
                                        </li>
                                    ))
                                ) : (
                                    [
                                        "Approbation du procès-verbal de la séance précédente",
                                        "Débat d'Orientation Budgétaire (DOB) pour l'exercice 2024",
                                        "Vote des taux des taxes locales",
                                        "Présentation du Plan de Modernisation de l'éclairage public",
                                        "Subventions aux associations sportives et culturelles",
                                        "Questions diverses"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start">
                                            <div className="h-2 w-2 rounded-full bg-primary mt-1.5 mr-4 flex-shrink-0"></div>
                                            <span className="text-sm font-bold text-gray-700 italic">{item}</span>
                                        </li>
                                    ))
                                )}
                             </ul>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-10 flex flex-col">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center">
                                <div className="bg-red-50 p-3 rounded-2xl mr-4 border border-red-100">
                                    <FileText className="h-6 w-6 text-red-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tighter italic text-gray-900">Dernières Délibérations</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">PV & Actes administratifs</p>
                                </div>
                            </div>
                            <a href="#/documents" className="p-3 bg-gray-50 rounded-xl hover:bg-gray-900 group transition-all">
                                <Download className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                            </a>
                        </div>
                        
                        <div className="space-y-4 flex-grow">
                            {sessionsArray.filter(s => s.status === 'Passé').slice(0, 3).map((session) => (
                            <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-gray-50 rounded-[2rem] hover:bg-white hover:shadow-2xl transition-all group border border-transparent hover:border-gray-100">
                                <div className="flex items-center mb-4 sm:mb-0">
                                    <div className="flex-shrink-0 h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-red-500 shadow-xl border border-gray-100 group-hover:scale-110 group-hover:rotate-3 transition-all">
                                        <FileText className="h-7 w-7" />
                                    </div>
                                    <div className="ml-6">
                                        <h4 className="text-base font-black uppercase tracking-tight text-gray-900 group-hover:text-primary transition">{session.title}</h4>
                                        <div className="flex items-center mt-1.5 opacity-40">
                                            <Calendar className="w-3 h-3 mr-2" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">Séance du {new Date(session.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                </div>
                                <a 
                              href="http://localhost:3000/#/documents"
                              target="_blank"
                              rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-200 shadow-sm text-[10px] font-black uppercase tracking-widest rounded-2xl text-gray-900 bg-white hover:bg-gray-900 hover:text-white transition-all active:scale-95 group/btn"
                                >
                                    <Download className="mr-2 h-4 w-4 opacity-50 group-hover/btn:scale-125 transition-transform" />
                                    Télécharger PV
                                </a>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic max-w-sm text-center sm:text-left">
                            Les comptes-rendus officiels sont publiés dans un délai de 8 jours ouvrés après la tenue de la séance.
                        </p>
                        <a
                          href="http://localhost:3000/#/documents"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-gray-900 transition-colors"
                        >
                          Voir toutes les archives
                          <ExternalLink className="w-4 h-4 font-black" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>


        {/* Informations Pratiques du Conseil */}
        <section className="bg-green-900 rounded-xl shadow-lg p-8 md:p-12 text-white">
            <h2 className="text-2xl font-bold mb-8 text-white border-b border-green-700 pb-4">Informations Pratiques du Conseil</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Contact */}
                <div>
                    <h3 className="text-lg font-bold mb-6 flex items-center text-green-300">
                        <Phone className="mr-2 h-5 w-5" /> Contact Secrétariat
                    </h3>
                    <ul className="space-y-4 text-green-50">
                        <li className="flex items-start">
                            <MapPin className="h-5 w-5 mr-3 mt-0.5 text-green-400" />
                            <span>Hôtel de Ville, Aile Ouest<br/>Rue du Général de Gaulle</span>
                        </li>
                        <li className="flex items-center">
                            <Phone className="h-5 w-5 mr-3 text-green-400" />
                            <span>+221 33 991 12 34 (Poste 102)</span>
                        </li>
                        <li className="flex items-center">
                            <Mail className="h-5 w-5 mr-3 text-green-400" />
                            <span>conseil@mairieziguinchor.sn</span>
                        </li>
                    </ul>
                </div>

                {/* Horaires */}
                <div>
                    <h3 className="text-lg font-bold mb-6 flex items-center text-green-300">
                        <Clock className="mr-2 h-5 w-5" /> Horaires d'ouverture
                    </h3>
                    <div className="text-green-50 space-y-2">
                        <p className="flex justify-between border-b border-green-800 pb-2">
                            <span>Lundi - Jeudi</span>
                            <span>08h30 - 16h30</span>
                        </p>
                        <p className="flex justify-between border-b border-green-800 pb-2">
                            <span>Vendredi</span>
                            <span>08h30 - 13h30</span>
                        </p>
                        <p className="text-sm mt-4 text-green-300 italic">
                            * Les élus reçoivent sur rendez-vous uniquement.
                        </p>
                    </div>
                </div>

                {/* Liens Rapides */}
                <div>
                    <h3 className="text-lg font-bold mb-6 flex items-center text-green-300">
                        <LinkIcon className="mr-2 h-5 w-5" /> Liens Rapides
                    </h3>
                    <ul className="space-y-3">
                        <li>
                            <a href="#/documents" className="flex items-center text-green-100 hover:text-white transition group">
                                <ExternalLink className="h-4 w-4 mr-2 group-hover:text-green-300" />
                                Règlement intérieur du Conseil
                            </a>
                        </li>
                        <li>
                            <a href="#/documents" className="flex items-center text-green-100 hover:text-white transition group">
                                <ExternalLink className="h-4 w-4 mr-2 group-hover:text-green-300" />
                                Archives des délibérations
                            </a>
                        </li>
                        <li>
                            <a href="#/contact" className="flex items-center text-green-100 hover:text-white transition group">
                                <ExternalLink className="h-4 w-4 mr-2 group-hover:text-green-300" />
                                Demander une audience
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </section>

       {/* Map Section */}
               <section>
                   <div className="flex items-center mb-8">
                        <div className="bg-blue-100 p-2 rounded-lg mr-4">
                            <MapPin className="h-6 w-6 text-blue-600" />
                       </div>
                       <div>
                           <h2 className="text-3xl font-bold text-gray-900">Localisation des Services</h2>
                           <p className="text-gray-500 mt-1">Retrouvez les principaux bâtiments administratifs de la commune.</p>
                       </div>
                   </div>
                   
                   <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                           {/* List */}
                           <div className="space-y-2">
                               {[
                                   { name: "Hôtel de Ville", address: "Rue du Général de Gaulle", type: "Siège / État Civil" },
                                   { name: "Ancienne Mairie", address: "Centre-ville-Boudoddy Escale", type: "Compétences Transférées" },
                                   { name: "Perception Municipale", address: "Centre-ville-Boudoddy Escale", type: "Finances" },
                                   { name: "Centre secondaire d'état civil", address: "HÔPITAL REGIONAL-HLM NEMA", type: "État Civil" },
                                   { name: "Services Techniques", address: "Zone Industrielle-Boudoddy Escale", type: "Voirie / Urbanisme" },
                                  /*  { name: "Centre Social (CCAS)", address: "Boulevard des 54m", type: "Action Sociale" } */
                               ].map((loc, idx) => (
                                   <div key={idx} className="group flex items-start p-4 rounded-lg hover:bg-gray-50 transition border border-gray-100 hover:border-gray-200 cursor-pointer">
                                       <div className="mt-1 mr-4 bg-gray-100 p-2 rounded-full group-hover:bg-white group-hover:shadow-sm transition">
                                           <MapPin className="h-5 w-5 text-primary" />
                                       </div>
                                       <div>
                                           <h4 className="font-bold text-gray-900">{loc.name}</h4>
                                           <p className="text-sm text-gray-500 mb-2">{loc.address}</p>
                                           <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                               {loc.type}
                                           </span>
                                       </div>
                                   </div>
                               ))}
                           </div>
       
                           {/* Map */}
    <div className="lg:col-span-2 h-full min-h-[500px] bg-gray-100 rounded-xl overflow-hidden shadow-inner relative border border-gray-200">

        <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src="https://www.openstreetmap.org/export/embed.html?bbox=-16.2858%2C12.5786%2C-16.2600%2C12.5932&amp;layer=mapnik&amp;marker=12.5859%2C-16.2729"
            title="Carte Mairie Ziguinchor"
        ></iframe>

        <div className="absolute bottom-4 left-4">
            <a
                href="https://www.openstreetmap.org/?mlat=12.5859&amp;mlon=-16.2729#map=16/12.5859/-16.2729"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-xs font-bold px-3 py-1.5 rounded shadow hover:bg-gray-50 text-gray-700"
            >
                Agrandir la carte
            </a>
        </div>

    </div>

                       </div>
                   </div>
               </section>
       
      </div>
    </div>
  );
};

export default Conseil;