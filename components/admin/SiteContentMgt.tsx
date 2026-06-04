import React, { useState } from 'react';
import { Layout, Plus, Edit, Trash2, X, Save, FileText } from 'lucide-react';
import { ContentService, AboutSection } from '../../services/api';

interface SiteContentMgtProps {
    aboutSections: AboutSection[];
    onRefresh: () => Promise<void>;
}

const SiteContentMgt: React.FC<SiteContentMgtProps> = ({ aboutSections, onRefresh }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<AboutSection | null>(null);
    const [loading, setLoading] = useState(false);
    
    const [form, setForm] = useState({
        title: '',
        content: ''
    });

    const handleOpenModal = (section?: AboutSection) => {
        if (section) {
            setEditingSection(section);
            setForm({ title: section.title, content: section.content });
        } else {
            setEditingSection(null);
            setForm({ title: '', content: '' });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingSection) {
                await ContentService.updateAbout(editingSection.id!, form);
            } else {
                await ContentService.addAbout(form);
            }
            setIsModalOpen(false);
            onRefresh();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Supprimer cette section ?")) {
            await ContentService.deleteAbout(id);
            onRefresh();
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic flex items-center">
                        <Layout className="h-8 w-8 mr-3 text-primary" /> Contenu du Site
                    </h2>
                    <p className="text-gray-500">Gérez les textes institutionnels et les pages de présentation.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-primary text-white px-6 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition flex items-center">
                    <Plus className="h-5 w-5 mr-3" /> Nouvelle Section
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {aboutSections.map((section) => (
                    <div key={section.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-8 hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleOpenModal(section)} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-primary/10 hover:text-primary transition">
                                    <Edit className="h-5 w-5" />
                                </button>
                                <button onClick={() => handleDelete(section.id!)} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition">
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-xl font-black mb-4 uppercase tracking-tight">{section.title}</h3>
                        <div className="text-gray-600 line-clamp-4 leading-relaxed font-medium mb-6">
                            {section.content}
                        </div>
                        <div className="pt-6 border-t border-gray-100 flex justify-between items-center text-[10px] font-black uppercase text-gray-400 tracking-widest">
                            <span>Dernière modification : {section.created_at ? new Date(section.created_at).toLocaleDateString() : 'N/A'}</span>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-scale-up">
                        <div className="bg-primary p-8 text-white flex justify-between items-center">
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Édition Contenu</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition"><X className="h-6 w-6" /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-8 space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Titre de la section</label>
                                <input 
                                    type="text" required
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Ex: Mot du Maire, Histoire de la ville..."
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contenu (Texte intégral)</label>
                                <textarea 
                                    required
                                    value={form.content}
                                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20 min-h-[300px]"
                                    placeholder="Rédigez le contenu ici..."
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-grow py-4 rounded-2xl font-black uppercase text-gray-400 hover:bg-gray-100 transition">Annuler</button>
                                <button type="submit" disabled={loading} className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black shadow-xl hover:scale-105 transition uppercase tracking-widest flex items-center justify-center gap-2">
                                    <Save className="h-5 w-5" />
                                    {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SiteContentMgt;
