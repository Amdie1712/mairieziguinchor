import React, { useState } from 'react';
import { File, Plus, Edit, Trash2, X, Save, Upload, Search, Filter, Download } from 'lucide-react';
import { ContentService, DocumentItem } from '../../services/api';

interface DocumentsMgtProps {
    documents: DocumentItem[];
    onRefresh: () => Promise<void>;
}

const DocumentsMgt: React.FC<DocumentsMgtProps> = ({ documents, onRefresh }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Tout');
    
    const [form, setForm] = useState({
        name: '',
        description: '',
        category: 'Délibérations',
        date: new Date().toISOString().split('T')[0],
        size: '',
        type: 'PDF'
    });

    const handleOpenModal = (doc?: DocumentItem) => {
        if (doc) {
            setEditingDoc(doc);
            setForm({ 
                name: doc.name, 
                description: doc.description || '', 
                category: doc.category, 
                date: doc.date ? new Date(doc.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0], 
                size: doc.size, 
                type: doc.type 
            });
        } else {
            setEditingDoc(null);
            setForm({ name: '', description: '', category: 'Délibérations', date: new Date().toISOString().split('T')[0], size: '', type: 'PDF' });
        }
        setFile(null);
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('description', form.description);
            formData.append('category', form.category);
            formData.append('date', form.date);
            formData.append('type', form.type);
            
            if (file) {
                formData.append('document', file);
            }

            if (editingDoc?.id) {
                await ContentService.updateDocument(editingDoc.id, formData);
            } else {
                await ContentService.addDocument(formData);
            }
            setIsModalOpen(false);
            onRefresh();
            alert('Document enregistré avec succès');
        } catch (err) {
            console.error(err);
            alert('Erreur lors de l\'enregistrement');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id?: number) => {
        if (id && window.confirm("Supprimer ce document ?")) {
            await ContentService.deleteDocument(id);
            onRefresh();
        }
    };

    const filteredDocs = documents.filter(doc => {
        const matchSearch = doc.name.toLowerCase().includes(search.toLowerCase()) || 
                           (doc.description && doc.description.toLowerCase().includes(search.toLowerCase()));
        const matchCategory = categoryFilter === 'Tout' || doc.category === categoryFilter;
        return matchSearch && matchCategory;
    });

    const categories = ['Délibérations', 'Finance', 'Urbanisme', 'Arrêtés', 'Archives', 'Autre'];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic flex items-center">
                        <File className="h-8 w-8 mr-3 text-primary" /> Actes & Documents
                    </h2>
                    <p className="text-gray-500">Publiez les documents officiels et délibérations.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-primary text-white px-6 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition flex items-center">
                    <Plus className="h-5 w-5 mr-3" /> Nouveau Document
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Rechercher un document..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-6 py-4 font-bold shadow-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <div className="w-full md:w-64">
                    <select 
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 font-bold shadow-sm outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="Tout">Toutes catégories</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Document</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Catégorie</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Taille / Format</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredDocs.map((doc) => (
                                <tr key={doc.id} className="hover:bg-gray-50/50 transition">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-red-50 text-red-500 rounded-xl">
                                                <File className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{doc.name}</p>
                                                <p className="text-xs text-gray-400 font-medium">{doc.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">{doc.category}</span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <p className="text-xs font-black text-gray-500 uppercase">{doc.size || 'N/A'}</p>
                                        <p className="text-[10px] font-bold text-gray-400">{doc.type}</p>
                                    </td>
                                    <td className="px-8 py-5 text-right space-x-2">
                                        {doc.fileUrl && (
                                            <a href={doc.fileUrl} download={doc.name} className="inline-block p-3 bg-white text-green-600 rounded-2xl hover:bg-green-50 border border-gray-100 shadow-sm transition">
                                                <Download className="h-5 w-5" />
                                            </a>
                                        )}
                                        <button onClick={() => handleOpenModal(doc)} className="p-3 bg-white text-primary rounded-2xl hover:bg-primary hover:text-white border border-gray-100 shadow-sm transition">
                                            <Edit className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => handleDelete(doc.id)} className="p-3 bg-white text-red-600 rounded-2xl hover:bg-red-50 border border-red-50 shadow-sm transition">
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Document */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-md">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-scale-up">
                        <div className="bg-primary p-8 text-white flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-2xl">
                                    <File className="h-8 w-8" />
                                </div>
                                <h2 className="text-2xl font-black tracking-tighter uppercase italic">{editingDoc ? 'Modifier' : 'Ajouter'} un Document</h2>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-white/10 rounded-2xl transition">
                                <X className="h-8 w-8" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom du Document</label>
                                <input 
                                    type="text" 
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="Ex: Procès Verbal du 12 Avril 2024"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Catégorie</label>
                                    <select 
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date de publication</label>
                                    <input 
                                        type="date" 
                                        required
                                        value={form.date}
                                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Brève description (Optionnel)</label>
                                <textarea 
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none min-h-[80px]"
                                    placeholder="Précisez le contenu du document..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fichier PDF</label>
                                <label className="flex flex-col items-center justify-center w-full h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] cursor-pointer hover:bg-gray-100 transition relative overflow-hidden">
                                     {file ? (
                                        <div className="flex flex-col items-center">
                                            <File className="h-8 w-8 text-primary mb-2" />
                                            <span className="text-xs font-black text-primary truncate max-w-[200px]">{file.name}</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Cliquez pour ajouter un PDF</span>
                                        </div>
                                    )}
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="application/pdf"
                                        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                                    />
                                </label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-grow py-5 rounded-[2rem] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition">
                                    Annuler
                                </button>
                                <button type="submit" disabled={loading} className="flex-[2] py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition disabled:opacity-50 flex items-center justify-center gap-3">
                                    {loading ? <Clock className="animate-spin h-6 w-6" /> : <Save className="h-6 w-6" />}
                                    Publier le document
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentsMgt;

const Clock = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
