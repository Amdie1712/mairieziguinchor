import React, { useState } from 'react';
import { Mail, Trash2, X, Clock, MessageSquare, CheckCircle, Reply } from 'lucide-react';
import { ContactService, Message } from '../../services/api';

interface MessagesMgtProps {
    messages: Message[];
    onRefresh: () => Promise<void>;
}

const MessagesMgt: React.FC<MessagesMgtProps> = ({ messages, onRefresh }) => {
    const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);
    const [loading, setLoading] = useState(false);

    const handleUpdateStatus = async (id: number, status: string) => {
        try {
            await ContactService.updateStatus(id, status);
            onRefresh();
            if (selectedMsg?.id === id) {
                setSelectedMsg({ ...selectedMsg, status: status as any });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Supprimer ce message ?')) {
            await ContactService.delete(id);
            onRefresh();
            setSelectedMsg(null);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        let colorClass = 'bg-gray-100 text-gray-800';
        if (status === 'Traité') colorClass = 'bg-green-100 text-green-700';
        if (status === 'En cours') colorClass = 'bg-blue-100 text-blue-700';
        if (status === 'Nouveau') colorClass = 'bg-amber-100 text-amber-700';
        return <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-full ${colorClass}`}>{status}</span>;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-3xl font-black tracking-tighter uppercase italic flex items-center">
                    <Mail className="h-8 w-8 mr-3 text-primary" /> Messagerie Citoyenne
                </h2>
                <p className="text-gray-500">Gérez les demandes de contact et questions des usagers.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {messages.map((m) => (
                    <div 
                        key={m.id} 
                        className={`bg-white p-6 rounded-[2rem] border transition-all cursor-pointer hover:shadow-lg ${m.status === 'Nouveau' ? 'border-primary ring-4 ring-primary/5' : 'border-gray-100'}`}
                        onClick={() => setSelectedMsg(m)}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center">
                                    <MessageSquare className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-black text-gray-900">{m.subject}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Par {m.name} • {new Date(m.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <StatusBadge status={m.status} />
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2 italic">"{m.message}"</p>
                        <div className="mt-4 flex justify-end gap-2">
                             {m.status === 'Nouveau' && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleUpdateStatus(m.id, 'Traité'); }}
                                    className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition"
                                >
                                    Marquer Traité
                                </button>
                             )}
                             <button 
                                onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }}
                                className="p-2 text-red-300 hover:text-red-500 transition"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Message */}
            {selectedMsg && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-scale-up">
                        <div className="bg-primary p-8 text-white flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-2xl">
                                    <Mail className="h-8 w-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tighter uppercase italic">Détails Message</h2>
                                    <p className="text-white/70 text-xs font-black uppercase tracking-widest">Depuis le formulaire de contact</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedMsg(null)} className="p-3 hover:bg-white/10 rounded-2xl transition">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-3xl">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expéditeur</p>
                                    <p className="font-black text-gray-900">{selectedMsg.name}</p>
                                    <p className="text-xs text-primary font-bold">{selectedMsg.email}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date Réception</p>
                                    <p className="font-bold text-gray-600">{new Date(selectedMsg.date).toLocaleString()}</p>
                                    <StatusBadge status={selectedMsg.status} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Message</p>
                                    <div className="bg-white border-2 border-gray-50 p-6 rounded-3xl italic text-gray-700 leading-relaxed shadow-inner">
                                        "{selectedMsg.message}"
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-4">
                                     <a href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.subject}`} className="flex-grow py-5 bg-black text-white rounded-[2rem] font-black uppercase tracking-widest text-center shadow-xl hover:scale-105 transition flex items-center justify-center gap-3">
                                        <Reply className="h-5 w-5" /> Répondre par mail
                                    </a>
                                    {selectedMsg.status !== 'Traité' && (
                                        <button 
                                            onClick={() => handleUpdateStatus(selectedMsg.id, 'Traité')}
                                            className="flex-grow py-5 bg-green-500 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition flex items-center justify-center gap-3"
                                        >
                                            <CheckCircle className="h-5 w-5" /> Classer Traité
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessagesMgt;
