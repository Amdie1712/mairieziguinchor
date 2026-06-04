import React, { useState, useEffect } from 'react';
import { Newspaper, Plus, Edit, Trash2, X, Save, Camera, Upload, Search, Filter, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { ArticleService, Article } from '../../services/api';

interface ArticlesMgtProps {
    articles: Article[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onRefresh: () => Promise<void>;
}

const ArticlesMgt: React.FC<ArticlesMgtProps> = ({ articles, currentPage, totalPages, onPageChange, onRefresh }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    
    const [form, setForm] = useState({
        title: '',
        category: 'Actualité',
        content: '',
        imageUrl: '',
        isFeatured: false
    });

    const handleOpenModal = (art?: Article) => {
        if (art) {
            setEditingArticle(art);
            setForm({ 
                title: art.title, 
                category: art.category, 
                content: art.content, 
                imageUrl: art.imageUrl, 
                isFeatured: !!art.isFeatured 
            });
        } else {
            setEditingArticle(null);
            setForm({ title: '', category: 'Actualité', content: '', imageUrl: '', isFeatured: false });
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('category', form.category);
            formData.append('content', form.content);
            formData.append('isFeatured', String(form.isFeatured));
            
            if (imageFile) {
                formData.append('image', imageFile);
            } else {
                formData.append('imageUrl', form.imageUrl);
            }

            if (editingArticle) {
                await ArticleService.update(editingArticle.id, formData);
            } else {
                await ArticleService.add(formData);
            }
            setIsModalOpen(false);
            onRefresh();
            alert('Article publié avec succès');
        } catch (err) {
            console.error(err);
            alert('Erreur lors de la publication');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Supprimer cet article ?")) {
            await ArticleService.delete(id);
            onRefresh();
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic flex items-center">
                        <Newspaper className="h-8 w-8 mr-3 text-primary" /> Actualités & Presse
                    </h2>
                    <p className="text-gray-500">Gérez la communication officielle de la ville.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-primary text-white px-6 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition flex items-center">
                    <Plus className="h-5 w-5 mr-3" /> Nouvel Article
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Article</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Catégorie</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Date</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Mise en avant</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {articles.map((art) => (
                                <tr key={art.id} className="hover:bg-gray-50/50 transition">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <img src={art.imageUrl || '/placeholder.jpg'} className="h-12 w-20 object-cover rounded-xl shadow-sm" alt="" />
                                            <span className="font-bold text-gray-900 line-clamp-1 max-w-[300px]">{art.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-widest">{art.category}</span>
                                    </td>
                                    <td className="px-8 py-5 text-sm text-gray-500 font-medium">
                                        {new Date(art.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        {art.isFeatured ? <Star className="h-5 w-5 text-amber-400 fill-amber-400 mx-auto" /> : <Star className="h-5 w-5 text-gray-200 mx-auto" />}
                                    </td>
                                    <td className="px-8 py-5 text-right space-x-2">
                                        <button onClick={() => handleOpenModal(art)} className="p-3 bg-white text-primary rounded-2xl hover:bg-primary hover:text-white border border-gray-100 shadow-sm transition">
                                            <Edit className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => handleDelete(art.id)} className="p-3 bg-white text-red-600 rounded-2xl hover:bg-red-50 border border-red-50 shadow-sm transition">
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-8 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-500">Page {currentPage} sur {totalPages}</p>
                    <div className="flex gap-2">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => onPageChange(currentPage - 1)}
                            className="p-3 bg-white rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => onPageChange(currentPage + 1)}
                            className="p-3 bg-white rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Article */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-md">
                    <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-scale-up flex flex-col max-h-[95vh]">
                        <div className="bg-primary p-8 text-white flex justify-between items-center flex-shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-2xl">
                                    <Newspaper className="h-8 w-8" />
                                </div>
                                <h2 className="text-2xl font-black tracking-tighter uppercase italic">{editingArticle ? 'Modifier' : 'Publier'} un Article</h2>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-white/10 rounded-2xl transition">
                                <X className="h-8 w-8" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Titre de l'article</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                        placeholder="Ex: Inauguration du nouveau marché"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Catégorie</label>
                                    <select 
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                    >
                                        <option value="Actualité">Actualité</option>
                                        <option value="Événement">Événement</option>
                                        <option value="Communiqué">Communiqué</option>
                                        <option value="Travaux">Travaux</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contenu de l'article</label>
                                <textarea 
                                    required
                                    value={form.content}
                                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none min-h-[250px]"
                                    placeholder="Rédigez votre article ici..."
                                />
                            </div>

                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-grow space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Image d'illustration (URL)</label>
                                    <div className="flex gap-4">
                                        <input 
                                            type="text" 
                                            value={form.imageUrl}
                                            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                                            className="flex-grow bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                            placeholder="https://..."
                                        />
                                        <label className="cursor-pointer bg-secondary text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:scale-105 transition flex items-center gap-3">
                                            <Camera className="h-5 w-5" /> Télécharger
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept="image/*" 
                                                onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                                            />
                                        </label>
                                    </div>
                                    {imageFile && <p className="text-xs text-secondary font-black flex items-center gap-2 px-2"><Upload className="h-3 w-3" /> {imageFile.name}</p>}
                                </div>
                                <div className="md:w-64 flex flex-col justify-end">
                                    <label className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
                                        <input 
                                            type="checkbox" 
                                            checked={form.isFeatured}
                                            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                                            className="h-6 w-6 rounded-lg text-primary focus:ring-primary"
                                        />
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest">En Une</p>
                                            <p className="text-[10px] text-gray-500 font-bold">Mettre en avant sur l'accueil</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 sticky bottom-0 bg-white border-t border-gray-100 mt-auto">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-grow py-5 rounded-[2rem] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition">
                                    Annuler
                                </button>
                                <button type="submit" disabled={loading} className="flex-[2] py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition disabled:opacity-50 flex items-center justify-center gap-3">
                                    {loading ? <Clock className="animate-spin h-6 w-6" /> : <Save className="h-6 w-6" />}
                                    Confirmer la publication
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArticlesMgt;

const Clock = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
