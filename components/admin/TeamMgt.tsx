import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Trash2, Shield, Mail, Briefcase, X, User } from 'lucide-react';
import { UserService } from '../../services/api';

const TeamMgt: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'agent',
        assigned_service: 'Administrateur'
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await UserService.getAll();
            setUsers(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await UserService.add(form);
            setIsModalOpen(false);
            setForm({ name: '', email: '', password: '', role: 'agent', assigned_service: 'Administrateur' });
            fetchUsers();
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'ajout de l'utilisateur");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Supprimer cet accès ?")) {
            await UserService.delete(id);
            fetchUsers();
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic flex items-center">
                        <Users className="h-8 w-8 mr-3 text-primary" /> Équipe Municipale
                    </h2>
                    <p className="text-gray-500">Gérez les comptes des agents et administrateurs de la ville.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-6 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition flex items-center">
                    <UserPlus className="h-5 w-5 mr-3" /> Nouvel Agent
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((u) => (
                    <div key={u.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-6 hover:shadow-xl transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-16 w-16 bg-gray-100 rounded-2xl flex items-center justify-center text-primary font-black text-2xl">
                                {u.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-black text-lg">{u.name}</h3>
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <Mail className="h-3 w-3" /> {u.email}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Rôle</span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    u.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                                }`}>
                                    <Shield className="h-3 w-3 inline mr-1" /> {u.role === 'admin' ? 'Super Admin' : 'Agent'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Service</span>
                                <span className="text-sm font-bold text-gray-700 flex items-center">
                                    <Briefcase className="h-3 w-3 mr-2 text-primary" /> {u.assigned_service || 'Général'}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => handleDelete(u.id)} className="w-full py-3 bg-red-50 text-red-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition flex items-center justify-center">
                                <Trash2 className="h-4 w-4 mr-2" /> Révoquer l'accès
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-scale-up">
                        <div className="bg-primary p-8 text-white flex justify-between items-center">
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Nouvel Utilisateur</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition"><X className="h-6 w-6" /></button>
                        </div>
                        <form onSubmit={handleAddUser} className="p-8 space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom complet</label>
                                <input 
                                    type="text" required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email professionnel</label>
                                <input 
                                    type="email" required
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mot de passe temporaire</label>
                                <input 
                                    type="password" required
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rôle</label>
                                    <select 
                                        value={form.role}
                                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="agent">Agent</option>
                                        <option value="admin">Administrateur</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Service</label>
                                    <select 
                                        value={form.assigned_service}
                                        onChange={(e) => setForm({ ...form, assigned_service: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="Administrateur">Administrateur</option>
                                        <option value="État Civil">État Civil</option>
                                        <option value="Urbanisme">Urbanisme</option>
                                        <option value="Action Sociale">Action Sociale</option>
                                        <option value="Services Techniques">Services Techniques</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-grow py-4 rounded-2xl font-black uppercase text-gray-400 hover:bg-gray-100 transition">Annuler</button>
                                <button type="submit" className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black shadow-xl hover:scale-105 transition uppercase tracking-widest flex items-center justify-center gap-2">
                                    <User className="h-5 w-5" /> Créer le compte
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamMgt;
