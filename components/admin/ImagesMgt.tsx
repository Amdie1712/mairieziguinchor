import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2, Search, Filter, Camera, Upload, X, CheckCircle } from 'lucide-react';
import { ImageService, ImageItem } from '../../services/api';

const ImagesMgt: React.FC = () => {
    const [images, setImages] = useState<ImageItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tout');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [form, setForm] = useState({
        name: '',
        category: 'Général',
        url: ''
    });

    const fetchImages = async () => {
        setLoading(true);
        try {
            const data = await ImageService.getAll();
            setImages(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('title', form.name);
            formData.append('category', form.category);
            
            if (imageFile) {
                formData.append('image', imageFile);
            } else {
                formData.append('url', form.url);
            }

            await ImageService.add(formData);
            fetchImages();
            setIsModalOpen(false);
            setImageFile(null);
            setForm({ name: '', category: 'Général', url: '' });
        } catch (err) {
            console.error(err);
            alert('Erreur lors de l\'ajout de l\'image');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Supprimer cette image définitivement ?")) {
            await ImageService.delete(id);
            fetchImages();
        }
    };

    const categories = ['Tout', 'Général', 'Quartiers', 'Conseil', 'Événements', 'Travaux'];
    
    const filteredImages = images.filter(img => {
        const matchesSearch = img.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Tout' || img.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic flex items-center">
                        <ImageIcon className="h-8 w-8 mr-3 text-primary" /> Médiathèque
                    </h2>
                    <p className="text-gray-500">Gérez la banque d'images de la plateforme.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary text-white px-6 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition flex items-center shrink-0"
                >
                    <Plus className="h-5 w-5 mr-3" /> Ajouter au Stock
                </button>
            </div>

            <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-[2rem] border border-gray-100">
                <div className="relative flex-grow min-w-[200px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Rechercher une image..." 
                        className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-6 py-3 font-bold outline-none ring-primary/20 focus:ring-2"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-gray-400" />
                    <div className="flex gap-2 overflow-x-auto pb-1 max-w-[400px]">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition shrink-0 ${
                                    selectedCategory === cat ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded-2xl"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredImages.map(img => (
                        <div key={img.id} className="group relative aspect-square bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all">
                            <img 
                                src={img.url} 
                                alt={img.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                                <p className="text-white font-bold text-center text-xs mb-3 line-clamp-2">{img.name}</p>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(img.url);
                                            alert("Lien copié !");
                                        }}
                                        className="p-2 bg-white text-gray-800 rounded-lg hover:bg-primary hover:text-white transition"
                                        title="Copier le lien"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(img.id!)}
                                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                        title="Supprimer"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                                <span className="absolute bottom-2 left-2 right-2 text-[8px] font-black uppercase tracking-widest text-white/50 text-center">
                                    {img.category}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-scale-up">
                        <div className="bg-primary p-8 text-white flex justify-between items-center">
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Ajouter une Image</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition"><X className="h-6 w-6" /></button>
                        </div>
                        <form onSubmit={handleUpload} className="p-8 space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom / Titre</label>
                                <input 
                                    type="text" required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Ex: Inauguration École..."
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Catégorie</label>
                                <select 
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    {categories.filter(c => c !== 'Tout').map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Source de l'image</label>
                                <div className="flex gap-3">
                                    <div className="flex-grow">
                                        <input 
                                            type="text"
                                            value={form.url}
                                            onChange={(e) => setForm({ ...form, url: e.target.value })}
                                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="URL ou téléchargez --->"
                                            disabled={!!imageFile}
                                        />
                                    </div>
                                    <label className="cursor-pointer bg-secondary text-white p-4 rounded-2xl hover:scale-105 transition shadow-lg flex items-center justify-center shrink-0">
                                        <Camera className="h-6 w-6" />
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*" 
                                            onChange={(e) => {
                                                setImageFile(e.target.files ? e.target.files[0] : null);
                                                if(e.target.files?.[0]) setForm({...form, url: ''});
                                            }}
                                        />
                                    </label>
                                </div>
                                {imageFile && (
                                    <p className="text-xs text-secondary font-bold flex items-center gap-2 mt-2">
                                        <Upload className="h-3 w-3" /> Fichier prêt : {imageFile.name}
                                        <button onClick={() => setImageFile(null)} className="text-red-500 hover:scale-110 ml-2"><X className="h-3 w-3" /></button>
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-grow py-4 rounded-2xl font-black uppercase text-gray-400 hover:bg-gray-100 transition">Annuler</button>
                                <button type="submit" disabled={uploading} className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black shadow-xl hover:scale-105 transition uppercase tracking-widest flex items-center justify-center gap-2">
                                    {uploading ? (
                                        <Clock className="animate-spin h-5 w-5" />
                                    ) : (
                                        <CheckCircle className="h-5 w-5" />
                                    )}
                                    {uploading ? 'Upload...' : 'Ajouter'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImagesMgt;

const Clock = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
