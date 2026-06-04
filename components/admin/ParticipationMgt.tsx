import React, { useState } from 'react';
import { Lightbulb, Plus, Trash2, CheckCircle, Clock as ClockIcon, TrendingUp, X } from 'lucide-react';
import { ParticipationService, ParticipationProject } from '../../services/api';

interface ParticipationMgtProps {
    projects: ParticipationProject[];
    onRefresh: () => Promise<void>;
}

const ParticipationMgt: React.FC<ParticipationMgtProps> = ({ projects, onRefresh }) => {
    const [loading, setLoading] = useState(false);
    
    const handleUpdateStatus = async (id: number, status: string) => {
        setLoading(true);
        try {
            await ParticipationService.updateStatus(id, status);
            onRefresh();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Supprimer ce projet participatif ?")) {
            await ParticipationService.delete(id);
            onRefresh();
        }
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Réalisé': return 'bg-green-100 text-green-600';
            case 'En cours': return 'bg-blue-100 text-blue-600';
            case 'Validé': return 'bg-purple-100 text-purple-600';
            case 'Soumis': return 'bg-gray-100 text-gray-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic flex items-center">
                        <Lightbulb className="h-8 w-8 mr-3 text-primary" /> Budget Participatif
                    </h2>
                    <p className="text-gray-500">Gérez les projets citoyens et suivez leur avancement.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {projects.map((p) => (
                    <div key={p.id} className="bg-white rounded-[2rem] border border-gray-100 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center hover:shadow-lg transition-shadow">
                        <div className="h-24 w-24 rounded-2xl bg-gray-100 overflow-hidden shrink-0">
                            <img src={p.image_url || 'https://picsum.photos/seed/project/200/200'} className="w-full h-full object-cover" alt={p.title} />
                        </div>
                        
                        <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(p.status)}`}>
                                    {p.status}
                                </span>
                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{p.category}</span>
                            </div>
                            <h3 className="text-xl font-black mb-1">{p.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-1">{p.description}</p>
                            <div className="flex items-center gap-4 mt-3">
                                <div className="text-[10px] font-black uppercase text-gray-400">Par : <span className="text-gray-900">{p.author_name}</span></div>
                                <div className="text-[10px] font-black uppercase text-gray-400">Budget : <span className="text-primary">{p.budget_estimate} FCFA</span></div>
                                <div className="text-[10px] font-black uppercase text-gray-400">Votes : <span className="text-secondary">{p.votes_count}</span></div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 shrink-0">
                            <button 
                                onClick={() => handleUpdateStatus(p.id, 'Validé')}
                                className="p-3 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-600 hover:text-white transition"
                                title="Valider"
                            >
                                <CheckCircle className="h-5 w-5" />
                            </button>
                            <button 
                                onClick={() => handleUpdateStatus(p.id, 'En cours')}
                                className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition"
                                title="En cours"
                            >
                                <TrendingUp className="h-5 w-5" />
                            </button>
                            <button 
                                onClick={() => handleUpdateStatus(p.id, 'Réalisé')}
                                className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition"
                                title="Terminé"
                            >
                                <CheckCircle className="h-5 w-5" />
                            </button>
                            <button 
                                onClick={() => handleDelete(p.id)}
                                className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ParticipationMgt;
