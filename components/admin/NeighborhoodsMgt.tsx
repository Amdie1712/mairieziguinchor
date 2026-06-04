import React, { useState } from 'react';
import { Map as MapIcon, Plus, Edit, Trash2, X, Save, Camera, Upload, MapPin, UserPlus } from 'lucide-react';
import { ContentService, Neighborhood } from '../../services/api';

interface NeighborhoodsMgtProps {
    neighborhoods: Neighborhood[];
    onRefresh: () => Promise<void>;
}

const NeighborhoodsMgt: React.FC<NeighborhoodsMgtProps> = ({ neighborhoods, onRefresh }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNeighborhood, setEditingNeighborhood] = useState<Neighborhood | null>(null);
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    
    const [form, setForm] = useState({
        name: '',
        representative: '',
        nextMeeting: '',
        location: '',
        description: '',
        image: ''
    });

    const handleOpenModal = (nh?: Neighborhood) => {
        if (nh) {
            setEditingNeighborhood(nh);
            setForm({ 
                name: nh.name || '', 
                representative: nh.representative || '', 
                nextMeeting: nh.nextMeeting || '', 
                location: nh.location || '', 
                description: nh.description || '', 
                image: nh.image || '' 
            });
        } else {
            setEditingNeighborhood(null);
            setForm({ name: '', representative: '', nextMeeting: '', location: '', description: '', image: '' });
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('representative', form.representative);
            formData.append('nextMeeting', form.nextMeeting);
            formData.append('location', form.location);
            formData.append('description', form.description);
            
            if (imageFile) {
                formData.append('image', imageFile);
            } else {
                formData.append('image', form.image || '');
            }

            if (editingNeighborhood) {
                await ContentService.updateNeighborhood(editingNeighborhood.id, formData);
            } else {
                await ContentService.addNeighborhood(formData);
            }
            setIsModalOpen(false);
            onRefresh();
            alert('Conseil de quartier enregistré avec succès');
        } catch (err) {
            console.error(err);
            alert('Erreur lors de l\'enregistrement du quartier');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Supprimer ce conseil de quartier ?")) {
            await ContentService.deleteNeighborhood(id);
            onRefresh();
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic flex items-center">
                        <MapIcon className="h-8 w-8 mr-3 text-primary" /> Conseils de Quartier
                    </h2>
                    <p className="text-gray-500">Gérez les structures de démocratie de proximité.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-primary text-white px-6 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition flex items-center">
                    <Plus className="h-5 w-5 mr-3" /> Nouveau Conseil
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {neighborhoods.map((nh) => (
                    <div key={nh.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden group">
                        <div className="h-48 relative overflow-hidden bg-gray-100">
                            <img src={nh.image || 'https://picsum.photos/seed/neighborhood/800/600'} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt={nh.name} />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button onClick={() => handleOpenModal(nh)} className="p-3 bg-white text-primary rounded-xl hover:bg-primary hover:text-white transition shadow-lg">
                                    <Edit className="h-5 w-5" />
                                </button>
                                <button onClick={() => handleDelete(nh.id)} className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition shadow-lg">
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-black mb-1">{nh.name}</h3>
                            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase mb-4">
                                <UserPlus className="h-4 w-4" /> {nh.representative}
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-2xl">
                                    <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Lieu habituel</p>
                                        <p className="text-sm font-bold">{nh.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-2xl">
                                    <Clock className="h-4 w-4 text-gray-400 mt-1" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Prochaine réunion</p>
                                        <p className="text-sm font-bold text-primary">{nh.nextMeeting}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-scale-up">
                        <div className="bg-primary p-8 text-white flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-2xl">
                                    <MapIcon className="h-8 w-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tighter uppercase italic">{editingNeighborhood ? 'Modifier' : 'Ajouter'} un Quartier</h2>
                                    <p className="text-white/70 text-sm font-medium">Configurez les informations du conseil</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom du Quartier</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                        placeholder="Ex: Santhiaba"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Président / Référent</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={form.representative}
                                        onChange={(e) => setForm({ ...form, representative: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                        placeholder="Nom du responsable"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Prochaine réunion</label>
                                    <input 
                                        type="text" 
                                        value={form.nextMeeting}
                                        onChange={(e) => setForm({ ...form, nextMeeting: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                        placeholder="Ex: Samedi 25 oct. à 17h"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Lieu</label>
                                    <input 
                                        type="text" 
                                        value={form.location}
                                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                        placeholder="Ex: École Primaire Santhiaba"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description / Notes</label>
                                <textarea 
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px]"
                                    placeholder="Détails sur l'activité du conseil..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Illustration du quartier</label>
                                <div className="flex gap-4">
                                    <div className="flex-grow">
                                        <input 
                                            type="text" 
                                            value={form.image}
                                            onChange={(e) => setForm({ ...form, image: e.target.value })}
                                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                            placeholder="URL de l'image (ou téléchargez ci-contre)"
                                        />
                                    </div>
                                    <label className="cursor-pointer bg-secondary text-white p-4 rounded-2xl hover:scale-105 transition shadow-lg flex items-center justify-center">
                                        <Camera className="h-6 w-6" />
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*" 
                                            onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                                        />
                                    </label>
                                </div>
                                {imageFile && <p className="text-xs text-secondary font-bold flex items-center gap-2 mt-2"><Upload className="h-3 w-3" /> Fichier sélectionné : {imageFile.name}</p>}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-grow py-4 rounded-2xl font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition">
                                    Annuler
                                </button>
                                <button type="submit" disabled={loading} className="flex-grow py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3">
                                    {loading ? <Clock className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NeighborhoodsMgt;

const Clock = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
