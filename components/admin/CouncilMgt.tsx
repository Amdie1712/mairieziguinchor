import React, { useState } from 'react';
import { Gavel, Plus, Edit, Trash2, X, Save, Clock, Users, Calendar, Upload, FileText } from 'lucide-react';
import { CouncilService, CouncilMember, CouncilSession } from '../../services/api';

interface CouncilMgtProps {
    members: CouncilMember[];
    sessions: CouncilSession[];
    onRefresh: () => Promise<void>;
}

const CouncilMgt: React.FC<CouncilMgtProps> = ({ members, sessions, onRefresh }) => {
    const [subTab, setSubTab] = useState<'members' | 'sessions'>('members');
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
    
    const [editingMember, setEditingMember] = useState<CouncilMember | null>(null);
    const [editingSession, setEditingSession] = useState<CouncilSession | null>(null);
    
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [docFile, setDocFile] = useState<File | null>(null);

    const [memberForm, setMemberForm] = useState({ name: '', role: '', image: '', commission: '' });
    const [sessionForm, setSessionForm] = useState({ date: '', title: '', status: 'A venir' as any, docUrl: '' });

    const handleOpenMemberModal = (m?: CouncilMember) => {
        if (m) {
            setEditingMember(m);
            setMemberForm({ name: m.name, role: m.role, image: m.image, commission: m.commission || '' });
        } else {
            setEditingMember(null);
            setMemberForm({ name: '', role: '', image: '', commission: '' });
        }
        setImageFile(null);
        setIsMemberModalOpen(true);
    };

    const handleOpenSessionModal = (s?: CouncilSession) => {
        if (s) {
            setEditingSession(s);
            setSessionForm({ date: s.date, title: s.title, status: s.status, docUrl: s.docUrl || '' });
        } else {
            setEditingSession(null);
            setSessionForm({ date: '', title: '', status: 'A venir', docUrl: '' });
        }
        setDocFile(null);
        setIsSessionModalOpen(true);
    };

    const handleSaveMember = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', memberForm.name);
            formData.append('role', memberForm.role);
            formData.append('commission', memberForm.commission);
            if (imageFile) formData.append('image', imageFile);
            else formData.append('image', memberForm.image);

            if (editingMember) await CouncilService.updateMember(editingMember.id, formData);
            else await CouncilService.addMember(formData);
            
            setIsMemberModalOpen(false);
            onRefresh();
            alert('Membre enregistré');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSession = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('date', sessionForm.date);
            formData.append('title', sessionForm.title);
            formData.append('status', sessionForm.status);
            if (docFile) formData.append('document', docFile);
            else formData.append('docUrl', sessionForm.docUrl);

            if (editingSession) await CouncilService.updateSession(editingSession.id, formData);
            else await CouncilService.addSession(formData);
            
            setIsSessionModalOpen(false);
            onRefresh();
            alert('Séance enregistrée');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic flex items-center">
                        <Gavel className="h-8 w-8 mr-3 text-primary" /> Conseil Municipal
                    </h2>
                    <p className="text-gray-500">Gérez les élus et les séances de l'assemblée.</p>
                </div>
            </div>

            <div className="flex gap-4 p-1.5 bg-gray-100 rounded-2xl w-fit">
                <button onClick={() => setSubTab('members')} className={`px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition ${subTab === 'members' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
                    Élus
                </button>
                <button onClick={() => setSubTab('sessions')} className={`px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition ${subTab === 'sessions' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
                    Séances
                </button>
            </div>

            {subTab === 'members' ? (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                         <h3 className="text-xl font-bold flex items-center gap-2"><Users className="h-6 w-6 text-primary" /> Liste des Élus</h3>
                         <button onClick={() => handleOpenMemberModal()} className="bg-primary text-white px-5 py-3 rounded-xl font-black text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition">
                            <Plus className="h-5 w-5" /> Ajouter un(e) Élu(e)
                         </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {members.map(m => (
                            <div key={m.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group">
                                <div className="h-56 relative bg-gray-50">
                                    <img src={m.image || 'https://via.placeholder.com/300x400?text=Membre'} className="w-full h-full object-cover" alt={m.name} />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button onClick={() => handleOpenMemberModal(m)} className="p-3 bg-white text-primary rounded-xl"><Edit className="h-5 w-5" /></button>
                                        <button onClick={async () => { if(window.confirm('Supprimer?')) { await CouncilService.deleteMember(m.id); onRefresh(); } }} className="p-3 bg-red-500 text-white rounded-xl"><Trash2 className="h-5 w-5" /></button>
                                    </div>
                                </div>
                                <div className="p-4 text-center">
                                    <p className="font-black text-gray-900 line-clamp-1">{m.name}</p>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">{m.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                         <h3 className="text-xl font-bold flex items-center gap-2"><Calendar className="h-6 w-6 text-primary" /> Séances du Conseil</h3>
                         <button onClick={() => handleOpenSessionModal()} className="bg-primary text-white px-5 py-3 rounded-xl font-black text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition">
                            <Plus className="h-5 w-5" /> Programmer une Séance
                         </button>
                    </div>
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase">Date</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase">Titre de la Séance</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase">Statut</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sessions.map(s => (
                                    <tr key={s.id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-8 py-5 text-sm font-bold">{new Date(s.date).toLocaleDateString()}</td>
                                        <td className="px-8 py-5 font-bold text-gray-900">{s.title}</td>
                                        <td className="px-8 py-5">
                                            <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-full tracking-widest ${s.status === 'Passé' ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'}`}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right space-x-2">
                                            <button onClick={() => handleOpenSessionModal(s)} className="p-2 text-primary border border-gray-100 rounded-lg hover:bg-gray-50"><Edit className="h-4 w-4" /></button>
                                            <button onClick={async () => { if(window.confirm('Supprimer?')) { await CouncilService.deleteSession(s.id); onRefresh(); } }} className="p-2 text-red-600 border border-gray-100 rounded-lg hover:bg-gray-50"><Trash2 className="h-4 w-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modals are simplified here for brevity, assuming standard form logic */}
            {isMemberModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter">{editingMember ? 'Modifier' : 'Ajouter'} Élu</h2>
                            <button onClick={() => setIsMemberModalOpen(false)}><X className="h-6 w-6 text-gray-400" /></button>
                        </div>
                        <form onSubmit={handleSaveMember} className="space-y-4">
                            <input type="text" required placeholder="Nom et Prénom" value={memberForm.name} onChange={e => setMemberForm({...memberForm, name: e.target.value})} className="w-full bg-gray-50 px-6 py-4 rounded-xl border-none font-bold" />
                            <input type="text" required placeholder="Rôle (ex: Adjoint au Maire)" value={memberForm.role} onChange={e => setMemberForm({...memberForm, role: e.target.value})} className="w-full bg-gray-50 px-6 py-4 rounded-xl border-none font-bold" />
                            <input type="text" placeholder="Commission (optionnel)" value={memberForm.commission} onChange={e => setMemberForm({...memberForm, commission: e.target.value})} className="w-full bg-gray-50 px-6 py-4 rounded-xl border-none font-bold" />
                            <div className="flex gap-4 items-center">
                                <input type="text" placeholder="URL Image" value={memberForm.image} onChange={e => setMemberForm({...memberForm, image: e.target.value})} className="flex-grow bg-gray-50 px-6 py-4 rounded-xl border-none font-bold" />
                                <label className="cursor-pointer bg-secondary text-white p-4 rounded-xl shadow-lg">
                                    <Upload className="h-5 w-5" />
                                    <input type="file" className="hidden" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                                </label>
                            </div>
                            <button type="submit" disabled={loading} className="w-full py-4 bg-primary text-white rounded-xl font-black uppercase tracking-widest shadow-xl">
                                {loading ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {isSessionModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Séance Conseil</h2>
                            <button onClick={() => setIsSessionModalOpen(false)}><X className="h-6 w-6 text-gray-400" /></button>
                        </div>
                        <form onSubmit={handleSaveSession} className="space-y-4">
                            <input type="date" required value={sessionForm.date} onChange={e => setSessionForm({...sessionForm, date: e.target.value})} className="w-full bg-gray-50 px-6 py-4 rounded-xl border-none font-bold" />
                            <input type="text" required placeholder="Titre de la séance" value={sessionForm.title} onChange={e => setSessionForm({...sessionForm, title: e.target.value})} className="w-full bg-gray-50 px-6 py-4 rounded-xl border-none font-bold" />
                            <select value={sessionForm.status} onChange={e => setSessionForm({...sessionForm, status: e.target.value as any})} className="w-full bg-gray-50 px-6 py-4 rounded-xl border-none font-bold">
                                <option value="A venir">A venir</option>
                                <option value="Passé">Passé</option>
                            </select>
                             <div className="flex gap-4 items-center">
                                <input type="text" placeholder="URL Compte-Rendu" value={sessionForm.docUrl} onChange={e => setSessionForm({...sessionForm, docUrl: e.target.value})} className="flex-grow bg-gray-50 px-6 py-4 rounded-xl border-none font-bold" />
                                <label className="cursor-pointer bg-secondary text-white p-4 rounded-xl shadow-lg">
                                    <FileText className="h-5 w-5" />
                                    <input type="file" className="hidden" onChange={e => setDocFile(e.target.files?.[0] || null)} />
                                </label>
                            </div>
                            <button type="submit" disabled={loading} className="w-full py-4 bg-primary text-white rounded-xl font-black uppercase tracking-widest shadow-xl">
                                {loading ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CouncilMgt;
