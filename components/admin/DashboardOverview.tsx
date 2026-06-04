import React from 'react';
import { AlertTriangle, MessageSquare, FileText, Calendar } from 'lucide-react';
import { Report, Message, Dossier, Event } from '../../services/api';

interface DashboardOverviewProps {
    reports: Report[];
    messages: Message[];
    dossiers: Dossier[];
    events: Event[];
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ reports, messages, dossiers, events }) => {
    const stats = [
        { label: 'Signalements', val: reports.length, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
        { label: 'Messages', val: messages.length, icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Dossiers', val: dossiers.length, icon: FileText, color: 'text-green-500', bg: 'bg-green-50' },
        { label: 'Événements', val: events.length, icon: Calendar, color: 'text-rose-500', bg: 'bg-rose-50' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6">
                        <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                            <stat.icon className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-3xl font-black text-gray-900">{stat.val}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold mb-6">Activités Récentes</h3>
                    <div className="space-y-4">
                        {reports.slice(0, 5).map((r, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                                        <AlertTriangle className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">{r.type}</p>
                                        <p className="text-xs text-gray-500">{r.location}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black uppercase text-gray-400">{new Date(r.date).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold mb-6">Derniers Messages</h3>
                    <div className="space-y-4">
                        {messages.slice(0, 5).map((m, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                        <MessageSquare className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">{m.subject}</p>
                                        <p className="text-xs text-gray-500">{m.name}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black uppercase text-gray-400">{new Date(m.date).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
