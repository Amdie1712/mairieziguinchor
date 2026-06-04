import React, { useState } from 'react';
import { FileText, Eye, Trash2, X, CheckCircle, Clock, MapPin, Send, Filter, UserPlus, Info, CheckCircle2 } from 'lucide-react';
import { DossierService, Dossier, MunicipalService } from '../../services/api';

interface DossiersMgtProps {
    dossiers: Dossier[];
    onRefresh: () => Promise<void>;
}

const DossiersMgt: React.FC<DossiersMgtProps> = ({ dossiers, onRefresh }) => {
    const [selectedDossier, setSelectedDossier] = useState<Dossier | null>(null);
    const [filterService, setFilterService] = useState<string>('Tout');
    const [filterCategory, setFilterCategory] = useState<string>('Tout');
    const [loading, setLoading] = useState(false);
    
    const [treatmentForm, setTreatmentForm] = useState({
        status: 'Instruction' as any,
        assigned_service: '' as MunicipalService | '',
        internal_notes: '',
        service_feedback: ''
    });

    const handleOpenModal = (dossier: Dossier) => {
        setSelectedDossier(dossier);
        setTreatmentForm({
            status: dossier.status,
            assigned_service: dossier.assigned_service || '',
            internal_notes: dossier.internal_notes || '',
            service_feedback: dossier.service_feedback || ''
        });
    };

    const handleTreat = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDossier) return;
        
        setLoading(true);
        try {
            await DossierService.treat(selectedDossier.id, {
                status: treatmentForm.status,
                assigned_service: treatmentForm.assigned_service as string,
                internal_notes: treatmentForm.internal_notes,
                service_feedback: treatmentForm.service_feedback
            });
            setSelectedDossier(null);
            onRefresh();
            alert('Dossier mis à jour');
        } catch (err) {
            console.error(err);
            alert('Erreur lors de la mise à jour');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Supprimer ce dossier définitivement ?')) {
            await DossierService.delete(id);
            onRefresh();
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        let colorClass = 'bg-gray-100 text-gray-800';
        if (status === 'Validé') colorClass = 'bg-green-100 text-green-700';
        if (status === 'Rejeté') colorClass = 'bg-red-100 text-red-700';
        if (status === 'Instruction') colorClass = 'bg-blue-100 text-blue-700';
        if (status === 'Attente documents') colorClass = 'bg-amber-100 text-amber-700';
        return <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-full tracking-wider ${colorClass}`}>{status}</span>;
    };

    const filteredDossiers = dossiers.filter(d => {
        const matchService = filterService === 'Tout' || d.assigned_service === filterService;
        const matchType = filterCategory === 'Tout' || d.type === filterCategory;
        return matchService && matchType;
    });

    const categories = Array.from(new Set(dossiers.map(d => d.type)));
    
    const municipalServices: MunicipalService[] = [
        'État Civil',
        'Assainissement, Cadre de Vie & Équipements Marchands',
        'Voirie & Éclairage Public',
        'Éducation, Alphabétisation & Formation',
        'Santé & Action Sociale',
        'Jeunesse, Sport, Loisirs & Culture',
        'Gouvernance & Organisation des Quartiers'
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic flex items-center">
                        <FileText className="h-8 w-8 mr-3 text-primary" /> Instruction des Dossiers
                    </h2>
                    <p className="text-gray-500">Traitez les demandes administratives des administrés.</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Filtre Service</p>
                        <select 
                            value={filterService} 
                            onChange={(e) => setFilterService(e.target.value)}
                            className="bg-white border border-gray-100 rounded-2xl px-5 py-3 text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="Tout">Tous les services</option>
                            {municipalServices.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Filtre Type</p>
                        <select 
                            value={filterCategory} 
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="bg-white border border-gray-100 rounded-2xl px-5 py-3 text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="Tout">Tous les types</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Dossier / Citoyen</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Statut</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Pris en charge par</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Date</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredDossiers.map((dossier) => (
                                <tr key={dossier.id} className="hover:bg-gray-50/50 transition border-l-4 border-transparent hover:border-primary">
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-black text-gray-900 tracking-tight">{dossier.type}</span>
                                            <span className="text-xs text-gray-400 font-bold uppercase tracking-tighter">{dossier.user_name || 'Inconnu'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <StatusBadge status={dossier.status} />
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded-lg ${dossier.assigned_service ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                                                <UserPlus className="h-3 w-3" />
                                            </div>
                                            <span className="text-xs font-bold text-gray-600">{dossier.assigned_service || 'Non assigné'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm text-gray-500 font-medium">
                                        {new Date(dossier.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-5 text-right space-x-2">
                                        <button onClick={() => handleOpenModal(dossier)} className="p-3 bg-white text-gray-900 rounded-2xl hover:bg-gray-100 border border-gray-100 shadow-sm transition">
                                            <Eye className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => handleDelete(dossier.id)} className="p-3 bg-white text-red-600 rounded-2xl hover:bg-red-50 border border-red-50 shadow-sm transition">
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Instruction */}
            {selectedDossier && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-md">
                    <div className="bg-white w-full max-w-4xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-scale-up flex flex-col max-h-[90vh]">
                        <div className="bg-primary p-8 text-white flex justify-between items-center flex-shrink-0">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-white/20 rounded-3xl">
                                    <FileText className="h-10 w-10" />
                                </div>
                                <div>
                                    <p className="text-white/60 text-xs font-black uppercase tracking-[0.2em]">Instruction Administrative</p>
                                    <h2 className="text-3xl font-black tracking-tighter uppercase italic">{selectedDossier.type}</h2>
                                </div>
                            </div>
                            <button onClick={() => setSelectedDossier(null)} className="p-4 hover:bg-white/10 rounded-3xl transition">
                                <X className="h-8 w-8" />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <UserPlus className="h-4 w-4" /> Détails de l'Administré
                                    </h3>
                                    <div className="bg-gray-50 border border-gray-100 p-6 rounded-[2rem] space-y-4">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase">Nom Complet</p>
                                            <p className="font-black text-xl text-gray-900">{selectedDossier.user_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase">Email de contact</p>
                                            <p className="font-bold text-gray-600">{selectedDossier.user_email}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase">Description / Contexte</p>
                                            <p className="text-gray-600 leading-relaxed bg-white p-4 rounded-xl border border-gray-200 mt-2 italic shadow-inner">
                                                "{selectedDossier.description}"
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {selectedDossier.formData && (
                                     <div>
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Info className="h-4 w-4" /> Données de Formulaire
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {Object.entries(selectedDossier.formData).map(([key, val]: [string, any]) => (
                                                <div key={key} className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                                    <p className="text-[9px] font-black text-primary uppercase tracking-tighter truncate" title={key}>{key}</p>
                                                    <p className="font-bold text-gray-800 text-sm truncate">{String(val)}</p>
                                                </div>
                                            ))}
                                        </div>
                                     </div>
                                )}
                            </div>

                            <form onSubmit={handleTreat} className="space-y-6 flex flex-col">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" /> Action Administrative
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Service Assigné</label>
                                        <select 
                                            value={treatmentForm.assigned_service} 
                                            onChange={(e) => setTreatmentForm({...treatmentForm, assigned_service: e.target.value as any})}
                                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                        >
                                            <option value="">Non assigné</option>
                                            {municipalServices.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nouveau Statut</label>
                                        <select 
                                            value={treatmentForm.status} 
                                            onChange={(e) => setTreatmentForm({...treatmentForm, status: e.target.value as any})}
                                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                        >
                                            <option value="Instruction">Instruction</option>
                                            <option value="Attente documents">Attente documents</option>
                                            <option value="Validé">Validé</option>
                                            <option value="Rejeté">Rejeté</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Notes Internes (Service)</label>
                                    <textarea 
                                        value={treatmentForm.internal_notes}
                                        onChange={(e) => setTreatmentForm({...treatmentForm, internal_notes: e.target.value})}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px]"
                                        placeholder="Notes visibles uniquement par l'administration..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Retour pour le Citoyen</label>
                                    <textarea 
                                        value={treatmentForm.service_feedback}
                                        onChange={(e) => setTreatmentForm({...treatmentForm, service_feedback: e.target.value})}
                                        className="w-full bg-primary/5 border-2 border-primary/10 rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px]"
                                        placeholder="Message envoyé au citoyen concernant l'avancement..."
                                    />
                                </div>

                                <div className="mt-auto pt-6 flex gap-4">
                                     <button type="button" onClick={() => setSelectedDossier(null)} className="flex-grow py-5 rounded-[2rem] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition">
                                        Fermer
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="flex-[2] py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {loading ? <Clock className="animate-spin h-6 w-6" /> : <Save className="h-6 w-6" />}
                                        Enregistrer l'instruction
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DossiersMgt;

const Save = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
);
