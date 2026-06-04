import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ImageIcon, 
  PlayCircle, 
  Camera, 
  Video, 
  FileImage, 
  Download, 
  Maximize2, 
  ChevronRight, 
  ChevronLeft, 
  X,
  Calendar,
  MapPin,
  Users
} from 'lucide-react';
import { ProjectService, ProjectItem } from '../services/api';

const ProjectGallery: React.FC = () => {
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await ProjectService.getAll();
            setProjects(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Derived media items (mocking some for gallery feel)
    const mediaItems = (Array.isArray(projects) ? projects : []).flatMap(p => [
        { url: p.image_url, title: p.title, category: 'Photos', project: p.title, date: p.created_at || '2024', location: p.location_name },
        p.photo_before ? { url: p.photo_before, title: `Avant : ${p.title}`, category: 'Archives', project: p.title, date: '2023', location: p.location_name } : null,
        p.photo_after ? { url: p.photo_after, title: `Après : ${p.title}`, category: 'Photos', project: p.title, date: '2024', location: p.location_name } : null,
    ]).filter(Boolean);

    const filteredMedia = filter === 'all' ? mediaItems : mediaItems.filter(m => m?.category === filter);

    return (
        <div className="bg-[#fafafa] min-h-screen">
            
            <div className="bg-amber-400 text-black py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                            <Camera className="h-3 w-3" /> Mémoire & Réalisations
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter mb-6 leading-none">
                            Galerie des <br />
                            <span className="text-white">Projets</span>
                        </h1>
                        <p className="text-xl text-black/60 font-medium max-w-xl leading-relaxed">
                            L'évolution de Ziguinchor en images. Du premier coup de pioche à l'inauguration finale.
                        </p>
                    </motion.div>
                </div>
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-1/2 h-full flex items-center justify-end opacity-20 pointer-events-none">
                     <ImageIcon className="h-[500px] w-[500px] -mr-24" />
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-24 -mt-16 relative z-20">
                {/* Gallery Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
                    <div className="flex bg-white p-2 rounded-[2rem] shadow-sm border border-gray-100">
                        {[
                            { id: 'all', label: 'Tout', icon: ImageIcon },
                            { id: 'Photos', label: 'Photos', icon: FileImage },
                            { id: 'Vidéos', label: 'Vidéos', icon: PlayCircle },
                            { id: 'Archives', label: 'Avant / Après', icon: History }
                        ].map((btn) => (
                            <button 
                                key={btn.id}
                                onClick={() => setFilter(btn.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                                    filter === btn.id ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'text-gray-400 hover:text-gray-900'
                                }`}
                            >
                                <btn.icon className="h-4 w-4" />
                                {btn.label}
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <div className="text-[10px] font-black uppercase text-gray-400">Total Médias</div>
                            <div className="text-xl font-black italic">{mediaItems.length} Fichiers</div>
                        </div>
                        <button className="h-14 w-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-primary transition shadow-sm">
                            <Download className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {loading ? (
                        Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="bg-gray-100 rounded-[3rem] h-[300px] animate-pulse mb-8"></div>
                        ))
                    ) : filteredMedia.map((item, i) => (
                        <motion.div
                            key={i}
                            layout
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: (i % 3) * 0.1 }}
                            className="break-inside-avoid bg-white rounded-[3rem] overflow-hidden border border-gray-50 shadow-sm group relative cursor-pointer"
                            onClick={() => setSelectedImage(item?.url || null)}
                        >
                            <img src={item?.url} alt={item?.title} className="w-full h-auto scale-105 group-hover:scale-110 transition duration-1000" />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                                <div className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-2">{item?.category}</div>
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4 leading-none">{item?.title}</h3>
                                <div className="flex items-center gap-4 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                                    <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {item?.date}</div>
                                    <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {item?.location}</div>
                                </div>
                            </div>

                            <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition duration-500">
                                <div className="h-12 w-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white scale-75 group-hover:scale-100 transition duration-700 delay-100">
                                    <Maximize2 className="h-5 w-5" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Video Spotlight Section */}
                <div className="mt-40">
                    <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-12">Visites de <span className="text-primary italic">Terrrain</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {[
                            { title: 'Inauguration Rond-point Bel-Air', desc: 'Le maire inaugure les nouveaux aménagements urbains.', date: 'Avril 2024', img: 'https://images.unsplash.com/photo-1541888941259-79273ad46c2e?q=80&w=2670&auto=format&fit=crop' },
                            { title: 'Réhabilitation des Écoles', desc: 'Visite de chantier pour la mise aux normes des établissements scolaires.', date: 'Mars 2024', img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2622&auto=format&fit=crop' }
                        ].map((v, i) => (
                            <div key={i} className="bg-white rounded-[4rem] overflow-hidden border border-gray-100 shadow-sm group">
                                <div className="h-80 relative flex items-center justify-center overflow-hidden">
                                     <img src={v.img} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-1000" />
                                     <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition duration-500"></div>
                                     <button className="h-24 w-24 bg-white text-primary rounded-full flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition duration-500 z-10">
                                        <PlayCircle className="h-10 w-10" />
                                     </button>
                                </div>
                                <div className="p-12">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex justify-between">
                                        <span>REPORTAGE VIDÉO</span>
                                        <span>{v.date}</span>
                                    </div>
                                    <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4">{v.title}</h3>
                                    <p className="text-gray-500 font-medium">{v.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-8 md:p-24"
                    >
                        <button 
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-12 right-12 h-16 w-16 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition"
                        >
                            <X className="h-8 w-8" />
                        </button>
                        
                        <div className="flex gap-8 items-center w-full max-w-7xl">
                            <button className="h-16 w-16 bg-white/5 text-white rounded-full flex items-center justify-center hover:bg-white/10 transition hidden md:flex">
                                <ChevronLeft className="h-8 w-8" />
                            </button>
                            
                            <div className="flex-grow flex flex-col items-center">
                                <motion.img 
                                    initial={{ scale: 0.9, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    src={selectedImage} 
                                    className="max-h-[70vh] w-auto rounded-[3rem] shadow-2xl border border-white/10" 
                                />
                                <div className="mt-12 text-center">
                                    <div className="text-white text-3xl font-black uppercase italic tracking-tighter mb-4">Vue détaillée</div>
                                    <button className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition">
                                        <Download className="h-4 w-4" /> Enregistrer l'image
                                    </button>
                                </div>
                            </div>

                            <button className="h-16 w-16 bg-white/5 text-white rounded-full flex items-center justify-center hover:bg-white/10 transition hidden md:flex">
                                <ChevronRight className="h-8 w-8" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProjectGallery;
import { History } from 'lucide-react';
