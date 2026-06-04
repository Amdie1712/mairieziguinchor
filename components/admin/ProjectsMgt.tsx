import React, { useState } from 'react';
import { HardHat, Plus, Edit, Trash2, X, Save, Clock, CheckCircle } from 'lucide-react';
import { ProjectService, ProjectItem } from '../../services/api';

interface ProjectsMgtProps {
    projects: ProjectItem[];
    onRefresh: () => Promise<void>;
}

const ProjectsMgt: React.FC<ProjectsMgtProps> = ({ projects, onRefresh }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
    const [loading, setLoading] = useState(false);
    
    const [form, setForm] = useState({
        title: '',
        description: '',
        status: 'En cours',
        image: '',
        color: 'blue'
    });

    const handleOpenModal = (project?: ProjectItem) => {
        if (project) {
            setEditingProject(project);
            setForm({ 
                title: project.title, 
                description: project.description, 
                status: project.status || 'En cours', 
                image: project.image || '',
                color: project.color || 'blue'
            });
        } else {
            setEditingProject(null);
            setForm({ title: '', description: '', status: 'En cours', image: '', color: 'blue' });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingProject) {
                await ProjectService.update(editingProject.id!, form);
            } else {
                await ProjectService.add(form);
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
        if (window.confirm("Supprimer ce grand projet ?")) {
            await ProjectService.delete(id);
            onRefresh();
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic flex items-center">
                        <HardHat className="h-8 w-8 mr-3 text-primary" /> Grands Travaux
                    </h2>
                    <p className="text-gray-500">Suivi des chantiers et grands projets structurants de la ville.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-primary text-white px-6 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition flex items-center">
                    <Plus className="h-5 w-5 mr-3" /> Nouveau Chantier
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((p) => (
                    <div key={p.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row h-full group">
                        <div className="md:w-1/3 relative h-48 md:h-auto overflow-hidden bg-gray-100">
                             <img src={p.image || 'https://picsum.photos/seed/construction/800/600'} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={p.title} />
                             <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-white shadow-lg bg-${p.color}-500`}>
                                {p.status}
                             </div>
                        </div>
                        <div className="md:w-2/3 p-8 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-black mb-2 uppercase tracking-tight">{p.title}</h3>
                                <p className="text-gray-500 text-sm line-clamp-3 mb-4 leading-relaxed font-medium">{p.description}</p>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center">
                                    <Clock className="h-3 w-3 mr-1" /> Mis à jour : {p.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A'}
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={() => handleOpenModal(p)} className="p-2 bg-gray-100 text-gray-400 rounded-lg hover:bg-primary/10 hover:text-primary transition">
                                        <Edit className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => handleDelete(p.id!)} className="p-2 bg-gray-100 text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-500 transition">
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-scale-up">
                        <div className="bg-primary p-8 text-white flex justify-between items-center">
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Édition Chantier</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition"><X className="h-6 w-6" /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-8 space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom du projet</label>
                                <input 
                                    type="text" required
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Statut</label>
                                    <input 
                                        type="text" 
                                        value={form.status}
                                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Ex: En cours, Terminé..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Code couleur (Tailwind)</label>
                                    <select 
                                        value={form.color}
                                        onChange={(e) => setForm({ ...form, color: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="blue">Bleu (En cours)</option>
                                        <option value="green">Vert (Terminé)</option>
                                        <option value="amber">Orange (Planifié)</option>
                                        <option value="red">Rouge (Urgent)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description détaillée</label>
                                <textarea 
                                    required
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20 min-h-[120px]"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Image URL</label>
                                <input 
                                    type="text" 
                                    value={form.image}
                                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-grow py-4 rounded-2xl font-black uppercase text-gray-400 hover:bg-gray-100 transition">Annuler</button>
                                <button type="submit" disabled={loading} className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black shadow-xl hover:scale-105 transition uppercase tracking-widest flex items-center justify-center gap-2">
                                    <CheckCircle className="h-5 w-5" />
                                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsMgt;
