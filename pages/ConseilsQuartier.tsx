import React, { useState, useEffect } from 'react';
import { Map, Users, Calendar, FileText, ChevronRight, MessageSquare, MapPin, Info, X, Download, Navigation } from 'lucide-react';
import { ContentService, Neighborhood, DocumentItem } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

const ConseilsQuartier: React.FC = () => {
  const navigate = useNavigate();
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null);
  const [isMinutesModalOpen, setIsMinutesModalOpen] = useState(false);

  useEffect(() => {
    Promise.all([
        ContentService.getNeighborhoods(),
        ContentService.getDocuments()
    ]).then(([hoodData, docData]) => {
        if (hoodData && hoodData.length > 0) {
            setNeighborhoods(hoodData);
        } else {
            // ... fallback data ...
            setNeighborhoods([
                { id: 1, name: "Escale", representative: "Mme. Aminata Diallo", nextMeeting: "2024-03-15T10:00:00", location: "Centre Culturel Régional", description: "Le cœur historique et administratif de la ville, abritant les principaux commerces, l'hôtel de ville et le port. Un quartier mixte alliant habitat colonial et activités économiques." },
                { id: 2, name: "Boucott", representative: "M. Oumar Ndiaye", nextMeeting: "2024-03-18T16:00:00", location: "École Boucott Sud", description: "Quartier populaire et dynamique, connu pour son grand marché, ses artisans et sa vie associative très dense. C'est l'un des quartiers les plus peuplés de Ziguinchor." },
                { id: 3, name: "Lindiane", representative: "M. Pierre Gomis", nextMeeting: "2024-03-20T17:00:00", location: "Foyer des Jeunes", description: "Zone résidentielle en pleine expansion à l'ouest de la ville. Les priorités actuelles concernent l'extension du réseau électrique et l'aménagement de la voirie secondaire." },
                { id: 4, name: "Kandé", representative: "Mme. Sophie Badji", nextMeeting: "2024-03-22T15:30:00", location: "Place Publique", description: "Quartier traditionnel situé à proximité du fleuve. Les activités de pêche et de transformation des produits halieutiques y sont prédominantes." },
                { id: 5, name: "Néma", representative: "M. Jean Mendy", nextMeeting: "2024-03-25T09:00:00", location: "Centre Social", description: "Quartier calme abritant de nombreuses infrastructures scolaires et universitaires. Le conseil de quartier travaille activement sur la salubrité et les espaces verts." },
                { id: 6, name: "Tilène", representative: "M. Abdoulaye Cissé", nextMeeting: "2024-03-28T18:00:00", location: "Maison de Quartier", description: "Quartier charnière entre le centre et la périphérie, Tilène est un carrefour commercial important avec une forte jeunesse engagée dans le sport." }
            ]);
        }
        setDocuments(docData || []);
        setLoading(false);
    }).catch(err => {
        console.error("Erreur chargement données", err);
        setLoading(false);
    });
  }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const handleOpenMinutes = (hood: Neighborhood) => {
    setSelectedNeighborhood(hood);
    setIsMinutesModalOpen(true);
  };

  const hoodMinutes = documents.filter(d => 
    d.category === 'Conseils de Quartier' && 
    (d.description.toLowerCase().includes(selectedNeighborhood?.name.toLowerCase() || '') || 
     d.name.toLowerCase().includes(selectedNeighborhood?.name.toLowerCase() || ''))
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-3xl">
            Gouvernance & Quartiers
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-lg text-gray-500 font-medium">
            Coordination des quartiers, participation citoyenne et médiation sociale à Ziguinchor.
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Intro Section */}
        <section className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0 bg-white p-4 rounded-full shadow-sm">
                    <Users className="h-10 w-10 text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Qu'est-ce qu'un Conseil de Quartier ?</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Le Conseil de Quartier est un espace de dialogue, d'information et de proposition. Il permet aux habitants d'être acteurs de l'amélioration de leur cadre de vie et de relayer les préoccupations locales auprès de la municipalité. Chaque quartier dispose d'un bureau représentatif et organise des assemblées régulières.
                    </p>
                </div>
            </div>
        </section>

        {/* Neighborhood Services */}
        <section>
            <div className="text-center mb-12">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Services de Proximité</h2>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900">À votre service dans chaque quartier</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { t: 'Réclamations', d: 'Signalez un problème local directement à votre conseil.', i: MessageSquare, c: 'text-blue-600', b: 'bg-blue-50' },
                    { t: 'Médiation Sociale', d: 'Aide au règlement des conflits de voisinage.', i: Users, c: 'text-primary', b: 'bg-green-50' },
                    { t: 'Infos Administrative', d: 'Renseignements sur les démarches en mairie.', i: Info, c: 'text-amber-600', b: 'bg-amber-50' },
                    { t: 'Démarches Commu.', d: 'Appui aux initiatives locales et communautaires.', i: MapPin, c: 'text-indigo-600', b: 'bg-indigo-50' }
                ].map((item, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] shadow-xl border border-white hover:-translate-y-2 transition-all">
                        <div className={`p-3 rounded-2xl w-fit mb-4 ${item.b} ${item.c}`}>
                            <item.i className="h-6 w-6" />
                        </div>
                        <h3 className="font-black uppercase italic tracking-tighter text-gray-900 mb-2">{item.t}</h3>
                        <p className="text-xs font-medium text-gray-500 leading-relaxed">{item.d}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* Neighborhoods Grid */}
        <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <Map className="h-8 w-8 text-primary mr-3" /> Vos Quartiers
            </h2>
            
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-2 text-gray-500">Chargement des quartiers...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {neighborhoods.map((quartier) => (
                        <div key={quartier.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl transition duration-300 overflow-hidden flex flex-col group">
                            <div className="h-56 relative overflow-hidden">
                                <img 
                                    src={`https://picsum.photos/seed/${quartier.id + 'quartier'}/600/400`} 
                                    alt={quartier.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-4 left-4">
                                    <h3 className="text-2xl font-bold text-white shadow-sm">{quartier.name}</h3>
                                </div>
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    Ziguinchor
                                </div>
                            </div>
                            
                            <div className="p-6 flex-grow flex flex-col justify-between">
                                <div>
                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2 flex items-center">
                                            <Info className="h-4 w-4 mr-1 text-primary" /> À propos
                                        </h4>
                                        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                                            {quartier.description}
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <div className="flex items-center text-sm">
                                            <Users className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                                            <div>
                                                <span className="text-xs text-gray-500 block">Délégué de quartier</span>
                                                <span className="font-semibold text-gray-800">{quartier.representative}</span>
                                            </div>
                                        </div>
                                        <div className="h-px bg-gray-200"></div>
                                        <div className="flex items-center text-sm">
                                            <Calendar className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                                            <div>
                                                <span className="text-xs text-gray-500 block">Prochaine réunion</span>
                                                <span className="font-semibold text-gray-800">
                                                    {new Date(quartier.nextMeeting).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <MapPin className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                                            <div>
                                                <span className="text-xs text-gray-500 block">Lieu</span>
                                                <span className="font-medium text-gray-700 italic">{quartier.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center gap-3">
                                    <button 
                                        onClick={() => handleOpenMinutes(quartier)}
                                        className="flex-1 bg-white border border-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-50 hover:text-primary hover:border-primary transition flex items-center justify-center group/btn"
                                    >
                                        <FileText className="h-4 w-4 mr-2 text-gray-400 group-hover/btn:text-primary" />
                                        Comptes-rendus
                                    </button>
                                    <button 
                                        onClick={() => navigate('/contact', { state: { subject: `Contact Conseil de Quartier: ${quartier.name}` } })}
                                        className="flex-1 bg-primary text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-700 transition flex items-center justify-center shadow-sm"
                                    >
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Contacter
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-10 text-center text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-4">Devenez conseiller de quartier !</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8 text-lg">
                Vous souhaitez vous impliquer davantage dans la vie de votre quartier ? Rejoignez l'équipe des conseillers bénévoles et participez activement aux projets de la ville.
            </p>
            <button 
                onClick={() => navigate('/faire-une-demarche', { state: { dossierType: 'Candidature Conseiller de Quartier', category: 'Participation', neighborhoodName: neighborhoods[0]?.name } })}
                className="bg-primary hover:bg-green-600 text-white px-8 py-3 rounded-lg font-bold transition shadow-lg inline-flex items-center text-lg transform hover:-translate-y-1"
            >
                Candidater en ligne <ChevronRight className="ml-2 h-5 w-5" />
            </button>
        </section>

        {/* Neighborhood Boundaries Section */}
        <section id="limites" className="pt-24 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4 inline-block shadow-sm">Géographie Locale</span>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Limites des <span className="text-blue-600 italic">Quartiers</span></h2>
                    <p className="text-gray-500 mt-2 font-medium">Visualisez l'organisation spatiale et les limites administratives des différents quartiers de la ville.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Information Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
                        <div className="bg-amber-50 p-3 rounded-2xl w-fit mb-6">
                            <Info className="h-6 w-6 text-amber-600" />
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-tighter italic mb-4">Informations Territoriales</h3>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">
                            Ziguinchor est subdivisée en plusieurs quartiers historiques et récents, délimités par des axes majeurs (avenues), le fleuve Casamance ou des zones naturelles.
                        </p>
                        <div className="space-y-4">
                            {neighborhoods.slice(0, 6).map((l, i) => (
                                <div key={i} className="flex items-center text-xs">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                    <span className="font-bold text-gray-800 mr-2">{l.name} :</span>
                                    <span className="text-gray-500 line-clamp-1">{l.location}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-900 p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                        <h3 className="text-lg font-black uppercase tracking-tighter italic mb-4 relative z-10">Plan d'Urbanisme</h3>
                        <p className="text-xs text-gray-400 font-medium mb-6 relative z-10">
                            Consultez le Plan Directeur d'Urbanisme pour des informations détaillées sur le foncier.
                        </p>
                        <button className="flex items-center text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors relative z-10">
                            Télécharger le PDU <Download className="ml-2 h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Map */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl border-4 border-white overflow-hidden h-[600px] relative ring-1 ring-gray-100">
                        <MapContainer 
                            center={[12.5859, -16.2729]} 
                            zoom={14} 
                            style={{ height: '100%', width: '100%' }}
                            scrollWheelZoom={false}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            
                            {/* Neighborhood Markers from database */}
                            {neighborhoods.map((h, i) => (
                                (h.latitude && h.longitude) ? (
                                    <Marker key={h.id || i} position={[Number(h.latitude), Number(h.longitude)] as [number, number]}>
                                        <Popup>
                                            <div className="p-1">
                                                <h4 className="font-black text-sm uppercase tracking-tight mb-1">{h.name}</h4>
                                                <p className="text-xs text-gray-600 mb-2">{h.description?.substring(0, 100)}...</p>
                                                <div 
                                                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${h.latitude},${h.longitude}`, '_blank')}
                                                    className="flex items-center text-[9px] font-black text-primary uppercase cursor-pointer hover:underline"
                                                >
                                                    <Navigation className="h-3 w-3 mr-1" /> Voir sur Google Maps
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ) : null
                            ))}
                        </MapContainer>
                        
                        <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100 max-w-[200px]">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Légende Carte</p>
                            <div className="flex items-center mb-1">
                                <div className="w-3 h-3 bg-blue-500 rounded-sm mr-2"></div>
                                <span className="text-[9px] font-bold text-gray-700">Zone Administrative</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-sm mr-2"></div>
                                <span className="text-[9px] font-bold text-gray-700">Quartiers Résidentiels</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Minutes Modal */}
        {isMinutesModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in-up">
                    <div className="bg-gray-900 px-8 py-6 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-white">Comptes Rendus</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{selectedNeighborhood?.name}</p>
                        </div>
                        <button onClick={() => setIsMinutesModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition">
                            <X className="h-6 w-6 text-white" />
                        </button>
                    </div>
                    <div className="p-8">
                        {hoodMinutes.length > 0 ? (
                            <div className="space-y-4">
                                {hoodMinutes.map(doc => (
                                    <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary transition">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-white rounded-xl shadow-sm mr-4">
                                                <FileText className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{doc.name}</p>
                                                <p className="text-xs text-gray-500">{doc.date} • {doc.size}</p>
                                            </div>
                                        </div>
                                        <a 
                                            href={doc.fileUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="p-3 bg-white hover:bg-primary hover:text-white rounded-xl shadow-sm transition text-primary"
                                        >
                                            <Download className="h-5 w-5" />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Info className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 font-medium">Aucun compte rendu disponible pour le moment pour ce quartier.</p>
                            </div>
                        )}
                        <button 
                            onClick={() => setIsMinutesModalOpen(false)}
                            className="w-full mt-8 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default ConseilsQuartier;