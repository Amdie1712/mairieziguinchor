import React, { useState } from 'react';
import { Briefcase, Plus, Edit, Trash2, X, Save, CheckCircle, Clock } from 'lucide-react';
import { ContentService, ProcedureItem } from '../../services/api';

interface ProceduresMgtProps {
    procedures: ProcedureItem[];
    onRefresh: () => Promise<void>;
}

const ProceduresMgt: React.FC<ProceduresMgtProps> = ({ procedures, onRefresh }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProc, setEditingProc] = useState<ProcedureItem | null>(null);
    const [loading, setLoading] = useState(false);
    
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: 'Identité',
        delay: '',
        isOnline: true,
        dossierType: '',
        icon: 'FileText'
    });

    const handleOpenModal = (proc?: ProcedureItem) => {
        if (proc) {
            setEditingProc(proc);
            setForm({ 
                title: proc.title, 
                description: proc.description, 
                category: proc.category, 
                delay: proc.delay || '', 
                isOnline: !!proc.isOnline, 
                dossierType: proc.dossierType || '',
                icon: proc.icon || 'FileText'
            });
        } else {
            setEditingProc(null);
            setForm({ 
                title: '', 
                description: '', 
                category: 'Identité', 
                delay: '', 
                isOnline: true, 
                dossierType: '',
                icon: 'FileText'
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingProc) {
                await ContentService.updateProcedure(editingProc.id!, form);
            } else {
                await ContentService.addProcedure(form);
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
        if (window.confirm("Supprimer cette démarche ?")) {
            await ContentService.deleteProcedure(id);
            onRefresh();
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic flex items-center">
                        <Briefcase className="h-8 w-8 mr-3 text-primary" /> Catalogue des Démarches
                    </h2>
                    <p className="text-gray-500">Configurez les types de dossiers et services disponibles en ligne.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-primary text-white px-6 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition flex items-center">
                    <Plus className="h-5 w-5 mr-3" /> Nouvelle Démarche
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Démarche</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Catégorie</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Délai / Type</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {procedures.map((proc) => (
                            <tr key={proc.id} className="hover:bg-gray-50/50 transition">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            <Briefcase className="h-4 w-4 text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{proc.title}</p>
                                            <p className="text-[10px] text-gray-400 font-medium">Lien : {proc.dossierType}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{proc.category}</span>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-2">
                                        {proc.isOnline ? 
                                            <span className="text-green-600 text-[10px] font-black flex items-center uppercase"><CheckCircle className="h-3 w-3 mr-1" /> En ligne</span> :
                                            <span className="text-amber-600 text-[10px] font-black flex items-center uppercase"><Clock className="h-3 w-3 mr-1" /> Guichet</span>
                                        }
                                        <span className="text-gray-400 text-xs">• {proc.delay}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-right space-x-2">
                                    <button onClick={() => handleOpenModal(proc)} className="p-2 text-primary hover:bg-primary/5 rounded-xl transition">
                                        <Edit className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => handleDelete(proc.id!)} className="p-2 text-red-300 hover:text-red-500 transition">
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-scale-up">
                        <div className="bg-primary p-8 text-white flex justify-between items-center">
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Édition Démarche</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition"><X className="h-6 w-6" /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-8 space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Titre de la démarche</label>
                                <input 
                                    type="text" required
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Catégorie</label>
                                    <select 
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="Identité">Identité</option>
                                        <option value="Professionnels">Professionnels</option>
                                        <option value="Cadre de vie">Cadre de vie</option>
                                        <option value="Famille">Famille</option>
                                        <option value="Urbanisme">Urbanisme</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Délai estimé</label>
                                    <input 
                                        type="text" 
                                        value={form.delay}
                                        onChange={(e) => setForm({ ...form, delay: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Ex: 48h, 15 jours"
                                    />
                                </div>
                            </div>
                             <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type de dossier lié</label>
                                <input 
                                    type="text" 
                                    value={form.dossierType}
                                    onChange={(e) => setForm({ ...form, dossierType: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Ex: CNI, Passeport, Commerce..."
                                />
                            </div>
                            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-2xl">
                                <input 
                                    type="checkbox"
                                    checked={form.isOnline}
                                    onChange={(e) => setForm({ ...form, isOnline: e.target.checked })}
                                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="text-sm font-bold text-gray-600">Activer la demande en ligne</span>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-grow py-4 rounded-2xl font-black uppercase text-gray-400 hover:bg-gray-100 transition">Annuler</button>
                                <button type="submit" disabled={loading} className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black shadow-xl hover:scale-105 transition uppercase tracking-widest">
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

export default ProceduresMgt;
