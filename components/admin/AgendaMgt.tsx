import React, { useState } from 'react';
import { Calendar, Plus, Edit, Trash2, X, Save, Clock, MapPin, Camera, Upload } from 'lucide-react';
import { EventService, Event } from '../../services/api';

interface AgendaMgtProps {
    events: Event[];
    onRefresh: () => Promise<void>;
}

const AgendaMgt: React.FC<AgendaMgtProps> = ({ events, onRefresh }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    
    const [form, setForm] = useState({
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        location: '',
        description: '',
        imageUrl: '',
        category: 'Culture'
    });

    const handleOpenModal = (evt?: Event) => {
        if (evt) {
            setEditingEvent(evt);
            setForm({ 
                title: evt.title, 
                date: new Date(evt.date).toISOString().split('T')[0], 
                time: evt.time, 
                location: evt.location, 
                description: evt.description || '', 
                imageUrl: evt.imageUrl, 
                category: evt.category || 'Culture' 
            });
        } else {
            setEditingEvent(null);
            setForm({ 
                title: '', 
                date: new Date().toISOString().split('T')[0], 
                time: '10:00', 
                location: '', 
                description: '', 
                imageUrl: '', 
                category: 'Culture' 
            });
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
            formData.append('date', form.date);
            formData.append('time', form.time);
            formData.append('location', form.location);
            formData.append('description', form.description);
            formData.append('category', form.category);
            
            if (imageFile) {
                formData.append('image', imageFile);
            } else {
                formData.append('imageUrl', form.imageUrl);
            }

            if (editingEvent) {
                await EventService.update(editingEvent.id, formData);
            } else {
                await EventService.add(formData);
            }
            setIsModalOpen(false);
            onRefresh();
            alert('Événement enregistré');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Supprimer cet événement ?")) {
            await EventService.delete(id);
            onRefresh();
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic flex items-center">
                        <Calendar className="h-8 w-8 mr-3 text-primary" /> Agenda Municipal
                    </h2>
                    <p className="text-gray-500">Programmez les activités et manifestations de la ville.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-primary text-white px-6 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition flex items-center">
                    <Plus className="h-5 w-5 mr-3" /> Nouvel Événement
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Événement</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Date & Heure</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Lieu</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {events.map((evt) => (
                                <tr key={evt.id} className="hover:bg-gray-50/50 transition">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 bg-primary/10 rounded-xl flex flex-col items-center justify-center overflow-hidden">
                                                <span className="text-[10px] font-black text-primary uppercase">{new Date(evt.date).toLocaleString('fr', { month: 'short' })}</span>
                                                <span className="text-xl font-black text-primary -mt-1">{new Date(evt.date).getDate()}</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{evt.title}</p>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{evt.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <p className="text-sm font-black text-gray-600">{new Date(evt.date).toLocaleDateString()}</p>
                                        <p className="text-xs text-gray-400 font-bold">{evt.time}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                            <MapPin className="h-4 w-4 text-primary" /> {evt.location}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right space-x-2">
                                        <button onClick={() => handleOpenModal(evt)} className="p-3 bg-white text-primary rounded-2xl hover:bg-primary hover:text-white border border-gray-100 shadow-sm transition">
                                            <Edit className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => handleDelete(evt.id)} className="p-3 bg-white text-red-600 rounded-2xl hover:bg-red-50 border border-red-50 shadow-sm transition">
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Événement */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-md">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-scale-up">
                        <div className="bg-primary p-8 text-white flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-2xl">
                                    <Calendar className="h-8 w-8" />
                                </div>
                                <h2 className="text-2xl font-black tracking-tighter uppercase italic">{editingEvent ? 'Modifier' : 'Programmer'} un Événement</h2>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-white/10 rounded-2xl transition">
                                <X className="h-8 w-8" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom de l'événement</label>
                                <input 
                                    type="text" 
                                    required
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="Ex: Fête de la Jeunesse"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                                    <input 
                                        type="date" 
                                        required
                                        value={form.date}
                                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Heure</label>
                                    <input 
                                        type="time" 
                                        required
                                        value={form.time}
                                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Catégorie</label>
                                    <select 
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                    >
                                        <option value="Culture">Culture</option>
                                        <option value="Sport">Sport</option>
                                        <option value="Cérémonie">Cérémonie</option>
                                        <option value="Social">Social</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Lieu de l'événement</label>
                                <input 
                                    type="text" 
                                    required
                                    value={form.location}
                                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="Ex: Place du marché"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description (Optionnel)</label>
                                <textarea 
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px]"
                                    placeholder="Détails sur l'événement..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Affiche / Image</label>
                                <div className="flex gap-4">
                                    <input 
                                        type="text" 
                                        value={form.imageUrl}
                                        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                                        className="flex-grow bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                        placeholder="URL de l'affiche"
                                    />
                                    <label className="cursor-pointer bg-secondary text-white p-4 rounded-2xl hover:scale-105 transition shadow-lg shrink-0">
                                        <Camera className="h-6 w-6" />
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*" 
                                            onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                                        />
                                    </label>
                                </div>
                                {imageFile && <p className="text-xs text-secondary font-black mt-2"><Upload className="h-3 w-3 inline mr-1" /> {imageFile.name}</p>}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-grow py-5 rounded-[2rem] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition">
                                    Annuler
                                </button>
                                <button type="submit" disabled={loading} className="flex-[2] py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition flex items-center justify-center gap-3">
                                    {loading ? <ClockIcon className="animate-spin h-6 w-6" /> : <Save className="h-6 w-6" />}
                                    Confirmer l'événement
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgendaMgt;

const ClockIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
