import React, { useState, useEffect } from 'react';
import { Download, Search, FileText, Folder, Clock, Calendar, CheckCircle, Info } from 'lucide-react';
import { ContentService, DocumentItem } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';

const Documents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tout');
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ContentService.getDocuments()
        .then(setDocuments)
        .catch(console.error)
        .finally(() => setLoading(false));
  }, []);

  const categories = ["Tout", "Délibérations", "Finance", "Urbanisme", "Arrêtés", "Archives", "Autre"];

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'Tout' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Header simple et impactant */}
      <div className="bg-gray-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#fff,transparent)] transform scale-150 rotate-12"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic mb-6"
            >
                Portail de <span className="text-primary">Transparence</span>
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-400 max-w-2xl mx-auto text-lg font-medium"
            >
                Accédez à tous les documents officiels, rapports techniques et délibérations du Conseil Municipal de Ziguinchor.
            </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-20">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12">
            
            {/* Filtres et Recherche */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        className="w-full bg-gray-50 border-none rounded-2xl pl-16 pr-8 py-5 text-lg font-bold shadow-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                        placeholder="Rechercher par titre, mot-clé ou date..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative group">
                    <Folder className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 pointer-events-none" />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-2xl pl-16 pr-8 py-5 text-lg font-bold shadow-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none cursor-pointer"
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>

            {/* Aide et Information */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-12 flex gap-4 items-start">
                <Info className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                    <h3 className="font-bold text-blue-900 uppercase text-sm tracking-widest mb-1">Information Citoyenne</h3>
                    <p className="text-blue-700 text-sm italic">
                        Tous les documents publiés ici sont certifiés conformes. Pour toute demande de document spécifique non listé, veuillez contacter le service des archives à l'Hôtel de Ville.
                    </p>
                </div>
            </div>

            {/* Liste des Documents */}
            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                    <Clock className="h-12 w-12 animate-spin mb-4" />
                    <p className="font-bold uppercase tracking-widest text-[10px]">Chargement des archives...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredDocs.length > 0 ? (
                            filteredDocs.map((doc, idx) => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={doc.id || idx}
                                    className="group bg-white rounded-3xl border border-gray-100 p-6 hover:shadow-xl hover:border-primary/20 transition-all cursor-default"
                                >
                                    <div className="flex items-start gap-6">
                                        <div className="bg-red-50 text-red-500 p-4 rounded-2xl group-hover:bg-primary group-hover:text-white transition duration-500">
                                            <FileText className="h-8 w-8" />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="bg-gray-100 text-[9px] font-black uppercase text-gray-500 px-2 py-0.5 rounded tracking-widest">{doc.category}</span>
                                                <span className="flex items-center text-[9px] font-bold text-green-500 uppercase">
                                                    <CheckCircle className="h-3 w-3 mr-1" /> Public
                                                </span>
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition truncate mb-2">{doc.name}</h2>
                                            <p className="text-gray-500 text-sm line-clamp-2 italic mb-4 font-medium">
                                                {doc.description || "Aucune description supplémentaire fournie pour ce document."}
                                            </p>
                                            
                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                                <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                                    <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {doc.date ? new Date(doc.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</span>
                                                    <span className="flex items-center"><Download className="h-3 w-3 mr-1" /> {doc.size || 'PDF'}</span>
                                                </div>
                                                <a 
                                                    href={doc.fileUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    download={doc.name}
                                                    className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary transition shadow-md flex items-center gap-2"
                                                >
                                                    <Download className="h-4 w-4" /> Télécharger
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-2 py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-black text-gray-500 uppercase tracking-tight">Aucun document trouvé</h3>
                                <p className="text-gray-400 font-medium">Affiner votre recherche ou changer de catégorie.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Documents;