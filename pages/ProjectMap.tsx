import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Map as MapIcon, 
  MapPin, 
  Navigation, 
  Layers, 
  Search, 
  Info, 
  Maximize2, 
  Minimize2, 
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { ProjectService, ProjectItem } from '../services/api';
import { Link } from 'react-router-dom';
import { APIProvider, Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

const MapCenterer = ({ center }: { center: { lat: number, lng: number } }) => {
    const map = useMap();
    useEffect(() => {
        if (map && center) {
            map.panTo(center);
            map.setZoom(16);
        }
    }, [map, center]);
    return null;
};

const ProjectMap: React.FC = () => {
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const data = await ProjectService.getAll();
            setProjects(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = (Array.isArray(projects) ? projects : []).filter(p => {
        const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             p.location_name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    if (!hasValidKey) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-gray-50 px-6 font-sans">
            <div className="bg-white p-12 rounded-[3rem] shadow-2xl max-w-xl w-full border border-gray-100">
              <div className="h-20 w-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-8 mx-auto">
                <MapIcon className="h-10 w-10" />
              </div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-center mb-6">Configuration de la Carte Requise</h2>
              <p className="text-gray-500 font-medium text-center mb-10 leading-relaxed">
                Pour afficher la carte interactive des projets de Ziguinchor, vous devez configurer une clé API Google Maps Platform.
              </p>
              
              <div className="space-y-6 bg-gray-50 p-8 rounded-3xl border border-gray-100 mb-10">
                <div className="flex gap-4">
                    <div className="h-6 w-6 bg-primary text-white rounded-full flex items-center justify-center text-[10px] font-black shrink-0">1</div>
                    <p className="text-sm font-bold text-gray-700">Obtenez une clé API sur la <a href="https://console.cloud.google.com/google/maps-apis/start" target="_blank" rel="noopener" className="text-primary hover:underline">Console Google Cloud</a></p>
                </div>
                <div className="flex gap-4">
                    <div className="h-6 w-6 bg-primary text-white rounded-full flex items-center justify-center text-[10px] font-black shrink-0">2</div>
                    <p className="text-sm font-bold text-gray-700">Ajoutez-la comme Secret dans <span className="bg-white px-2 py-1 rounded-lg border border-gray-200">Settings → Secrets</span> sous le nom <code>GOOGLE_MAPS_PLATFORM_KEY</code></p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">L'application redémarrera automatiquement après l'ajout du secret</p>
              </div>
            </div>
          </div>
        );
    }

    return (
        <div className="bg-[#fafafa] min-h-screen">
            <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row overflow-hidden italic-none">
                {/* Sidebar Info */}
                <div className="w-full md:w-[450px] bg-white shadow-2xl z-20 flex flex-col border-r border-gray-100">
                    <div className="p-8 border-b border-gray-100 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-black uppercase tracking-tighter italic">
                                Carte <span className="text-primary italic">Terrain</span>
                            </h1>
                            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <Layers className="h-5 w-5" />
                            </div>
                        </div>
                        
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input 
                                placeholder="Rechercher par zone ou quartier..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold transition outline-none"
                            />
                        </div>

                        <div className="flex gap-2">
                             {[
                                 { id: 'all', label: 'Tous', color: 'bg-gray-100' },
                                 { id: 'en_cours', label: 'En cours', color: 'bg-blue-500' },
                                 { id: 'realise', label: 'Réalisés', color: 'bg-emerald-500' },
                                 { id: 'avenir', label: 'À venir', color: 'bg-amber-500' }
                             ].map(f => (
                                 <button 
                                    key={f.id}
                                    onClick={() => setFilterStatus(f.id)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        filterStatus === f.id ? 'bg-black text-white' : 'bg-gray-50 text-gray-400 border border-gray-100'
                                    }`}
                                 >
                                     {f.label}
                                 </button>
                             ))}
                        </div>
                    </div>

                    <div className="flex-grow overflow-y-auto p-8 space-y-6">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-32 bg-gray-50 rounded-3xl animate-pulse"></div>
                            ))
                        ) : filteredProjects.length > 0 ? (
                            filteredProjects.map((p) => (
                                <button 
                                    key={p.id}
                                    onClick={() => setSelectedProject(p)}
                                    className={`w-full text-left p-6 rounded-[2rem] border transition-all duration-300 group ${
                                        selectedProject?.id === p.id 
                                        ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-[1.02]' 
                                        : 'bg-white border-gray-100 hover:border-primary/30 hover:bg-primary/5'
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`text-[9px] font-black uppercase tracking-widest ${selectedProject?.id === p.id ? 'text-white/70' : 'text-primary'}`}>{p.category}</div>
                                        <div className={`h-2 w-2 rounded-full ${p.status === 'realise' ? 'bg-emerald-500' : p.status === 'en_cours' ? 'bg-blue-500' : 'bg-amber-500'}`}></div>
                                    </div>
                                    <h4 className="font-black uppercase italic leading-tight mb-4">{p.title}</h4>
                                    <div className={`flex items-center justify-between text-[10px] font-bold ${selectedProject?.id === p.id ? 'text-white/60' : 'text-gray-400'}`}>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {p.location_name}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {p.progress_pct}%
                                        </div>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-gray-400 font-bold italic uppercase tracking-tighter">Aucun projet trouvé</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Map Interface */}
                <div className="flex-grow relative overflow-hidden bg-gray-100">
                    <APIProvider apiKey={API_KEY} version="weekly">
                        <Map
                            defaultCenter={{ lat: 12.5833, lng: -16.2719 }}
                            defaultZoom={13}
                            mapId="PROJECTS_MAP"
                            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                            gestureHandling={'greedy'}
                            disableDefaultUI={true}
                            style={{ width: '100%', height: '100%' }}
                        >
                            {selectedProject?.latitude && selectedProject?.longitude && (
                                <MapCenterer center={{ lat: parseFloat(selectedProject.latitude), lng: parseFloat(selectedProject.longitude) }} />
                            )}

                            {filteredProjects.map((p) => (
                                p.latitude && p.longitude && (
                                    <AdvancedMarker
                                        key={p.id}
                                        position={{ lat: parseFloat(p.latitude), lng: parseFloat(p.longitude) }}
                                        onClick={() => setSelectedProject(p)}
                                    >
                                        <div className="relative group cursor-pointer">
                                            <div className={`h-12 w-12 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform ${
                                                selectedProject?.id === p.id 
                                                ? 'bg-primary text-white scale-125 z-30' 
                                                : 'bg-white text-primary border-2 border-primary/20 hover:scale-110'
                                            }`}>
                                                <MapPin className="h-6 w-6" />
                                            </div>
                                            <div className={`absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black text-white text-[8px] font-black uppercase tracking-widest rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
                                                selectedProject?.id === p.id ? 'opacity-100' : ''
                                            }`}>
                                                {p.title}
                                            </div>
                                        </div>
                                    </AdvancedMarker>
                                )
                            ))}
                        </Map>
                    </APIProvider>

                    {/* Legend */}
                    <div className="absolute bottom-12 left-12 bg-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-8 border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/30"></div>
                            <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">En cours</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30"></div>
                            <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Réalisés</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-lg shadow-amber-500/30"></div>
                            <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">À venir</span>
                        </div>
                    </div>

                    {/* Selected Project Card Overlay */}
                    <AnimatePresence>
                        {selectedProject && (
                            <motion.div 
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 100 }}
                                className="absolute top-12 right-12 w-[420px] bg-white rounded-[3rem] shadow-2xl overflow-hidden shadow-black/10 border border-gray-50"
                            >
                                <div className="h-56 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                                    <img src={selectedProject.image_url} alt={selectedProject.title} className="w-full h-full object-cover transform hover:scale-110 transition duration-1000" />
                                    <button 
                                        onClick={() => setSelectedProject(null)}
                                        className="absolute top-6 right-6 h-12 w-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all z-20"
                                    >
                                        <Minimize2 className="h-6 w-6" />
                                    </button>
                                    <div className="absolute bottom-8 left-8 z-20">
                                        <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-2 inline-block">
                                            {selectedProject.category}
                                        </span>
                                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-tight">{selectedProject.title}</h3>
                                    </div>
                                </div>
                                <div className="p-10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className={`px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest ${
                                            selectedProject.status === 'realise' ? 'bg-emerald-50 text-emerald-600' : 
                                            selectedProject.status === 'en_cours' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                            {selectedProject.status === 'realise' ? 'Réalisé' : selectedProject.status === 'en_cours' ? 'En cours' : 'À venir'}
                                        </span>
                                        <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
                                            <MapPin className="h-4 w-4" />
                                            {selectedProject.location_name}
                                        </div>
                                    </div>

                                    <p className="text-gray-500 text-sm font-medium leading-relaxed mb-10 line-clamp-3">
                                        {selectedProject.description}
                                    </p>
                                    
                                    <div className="grid grid-cols-2 gap-6 mb-10">
                                        <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Budget</div>
                                            <div className="text-sm font-black italic text-gray-900">{selectedProject.budget}</div>
                                        </div>
                                        <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Avancement</div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-sm font-black italic text-gray-900">{selectedProject.progress_pct}%</div>
                                                <div className="flex-grow h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${selectedProject.progress_pct}%` }}
                                                        className="h-full bg-primary"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Link 
                                        to={`/projets/${selectedProject.id}`}
                                        className="group w-full flex items-center justify-between bg-black text-white px-10 py-6 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:bg-primary transition-all duration-300 text-xs"
                                    >
                                        Dossier complet <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ProjectMap;
