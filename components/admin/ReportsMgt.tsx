import React, { useState } from 'react';
import { AlertTriangle, Trash2, Eye, X, CheckCircle, Clock, Send, Filter, UserPlus } from 'lucide-react';
import { ReportingService, Report, MunicipalService } from '../../services/api';

interface ReportsMgtProps {
    reports: Report[];
    onRefresh: () => Promise<void>;
}

const ReportsMgt: React.FC<ReportsMgtProps> = ({ reports, onRefresh }) => {
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('Tout');
    const [loading, setLoading] = useState(false);
    
    const [treatmentForm, setTreatmentForm] = useState({
        status: 'Nouveau' as any,
        assigned_service: '' as MunicipalService | ''
    });

    const handleOpenModal = (report: Report) => {
        setSelectedReport(report);
        setTreatmentForm({
            status: report.status,
            assigned_service: report.assigned_service || ''
        });
    };

    const handleTreat = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedReport) return;
        
        setLoading(true);
        try {
            await ReportingService.treat(selectedReport.id, {
                status: treatmentForm.status,
                assigned_service: treatmentForm.assigned_service as string
            });
            setSelectedReport(null);
            onRefresh();
            alert('Signalement mis à jour');
        } catch (err) {
            console.error(err);
            alert('Erreur lors de la mise à jour');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Supprimer ce signalement ?')) {
            await ReportingService.delete(id);
            onRefresh();
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        let colorClass = 'bg-gray-100 text-gray-800';
        if (status === 'Résolu') colorClass = 'bg-green-100 text-green-700';
        if (status === 'Pris en compte') colorClass = 'bg-blue-100 text-blue-700';
        if (status === 'Nouveau') colorClass = 'bg-amber-100 text-amber-700';
        return <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-full tracking-wider ${colorClass}`}>{status}</span>;
    };

    const filteredReports = reports.filter(r => filterStatus === 'Tout' || r.status === filterStatus);

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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic flex items-center">
                        <AlertTriangle className="h-8 w-8 mr-3 text-amber-500" /> Gestion Signalements
                    </h2>
                    <p className="text-gray-500">Suivez et traitez les signalements des citoyens.</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                    <Filter className="h-4 w-4 text-gray-400 ml-2" />
                    <select 
                        value={filterStatus} 
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-transparent border-none text-sm font-bold outline-none pr-8 cursor-pointer"
                    >
                        <option value="Tout">Tous les statuts</option>
                        <option value="Nouveau">Nouveaux</option>
                        <option value="Pris en compte">En cours</option>
                        <option value="Résolu">Résolus</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Type & Lieu</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Date</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Assignation</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredReports.map((report) => (
                                <tr key={report.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900">{report.type}</span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <AlertTriangle className="h-3 w-3" /> {report.location}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                        {new Date(report.date).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={report.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs font-bold text-primary truncate max-w-[150px]">
                                            {report.assigned_service || 'Non assigné'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => handleOpenModal(report)} className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition shadow-sm bg-white border border-blue-100">
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => handleDelete(report.id)} className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition shadow-sm bg-white border border-red-100">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de traitement */}
            {selectedReport && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm shadow-2xl">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-scale-up">
                        <div className="bg-amber-500 p-8 text-white flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-2xl">
                                    <AlertTriangle className="h-8 w-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tighter uppercase italic">Détails Signalement</h2>
                                    <p className="text-white/70 text-sm font-medium">Réf: SIG-{selectedReport.id}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedReport(null)} className="p-3 hover:bg-white/10 rounded-2xl transition">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Description du citoyen</p>
                                <p className="text-gray-900 font-medium leading-relaxed italic">"{selectedReport.description}"</p>
                                <div className="mt-4 flex flex-wrap gap-4 pt-4 border-t border-gray-200">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</p>
                                        <p className="text-sm font-bold text-gray-700">{selectedReport.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Téléphone</p>
                                        <p className="text-sm font-bold text-gray-700">{selectedReport.phone}</p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleTreat} className="space-y-6 bg-white p-6 rounded-3xl border-2 border-gray-50 shadow-inner">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mise à jour du Statut</label>
                                        <select 
                                            value={treatmentForm.status} 
                                            onChange={(e) => setTreatmentForm({...treatmentForm, status: e.target.value as any})}
                                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-amber-500/20 outline-none"
                                        >
                                            <option value="Nouveau">Nouveau</option>
                                            <option value="Pris en compte">Pris en compte</option>
                                            <option value="Résolu">Résolu</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Assigner un Service</label>
                                        <select 
                                            value={treatmentForm.assigned_service} 
                                            onChange={(e) => setTreatmentForm({...treatmentForm, assigned_service: e.target.value as any})}
                                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-amber-500/20 outline-none"
                                        >
                                            <option value="">Aucun service assigné</option>
                                            {municipalServices.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full py-5 bg-amber-500 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3"
                                >
                                    {loading ? <Clock className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
                                    Appliquer les modifications
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsMgt;

const Save = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
);
