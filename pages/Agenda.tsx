import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Filter, X } from 'lucide-react';
import { EventService, Event } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Agenda: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filterCategory, setFilterCategory] = useState("Tout");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    EventService.getAll().then(setEvents).catch(console.error);
  }, []);

  const categories = ["Tout", "Culture", "Politique", "Sport", "Citoyenneté"];

  const filteredEvents = events.filter(e => {
      // Category Filter
      const matchesCategory = filterCategory === "Tout" || e.category === filterCategory;
      
      // Date Filter
      let matchesDate = true;
      if (startDate || endDate) {
          const eventDate = new Date(e.date);
          // Reset hours for accurate date comparison
          eventDate.setHours(0, 0, 0, 0);

          if (startDate) {
              const start = new Date(startDate);
              start.setHours(0, 0, 0, 0);
              if (eventDate < start) matchesDate = false;
          }
          if (endDate) {
              const end = new Date(endDate);
              end.setHours(0, 0, 0, 0);
              if (eventDate > end) matchesDate = false;
          }
      }

      return matchesCategory && matchesDate;
  });

  const getMonth = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('fr-FR', { month: 'short' });
  };

  const getDay = (dateString: string) => {
      return new Date(dateString).getDate();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">Agenda Municipal</h1>
          <p className="mt-4 text-xl text-gray-500">
            Retrouvez tous les événements, réunions et manifestations à Ziguinchor.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters Section */}
        <div className="mb-12 space-y-6">
            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-4">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                            filterCategory === cat
                            ? 'bg-primary text-white shadow-lg'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Date Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-4 justify-center">
                <div className="flex items-center text-gray-700 font-medium">
                    <Filter className="h-4 w-4 mr-2" />
                    <span>Filtrer par date :</span>
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <span className="text-sm text-gray-500">Du</span>
                    <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <span className="text-sm text-gray-500">Au</span>
                    <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                    />
                </div>

                {(startDate || endDate) && (
                    <button 
                        onClick={() => {setStartDate(''); setEndDate('');}}
                        className="flex items-center text-sm text-red-500 hover:text-red-700 font-medium transition"
                    >
                        <X className="h-4 w-4 mr-1" />
                        Effacer
                    </button>
                )}
            </div>
        </div>

        {/* Events List */}
        <div className="space-y-6">
            {filteredEvents.map((event) => (
                <div 
                    key={event.id} 
                    onClick={() => navigate(`/agenda/${event.id}`)}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition border border-gray-100 flex flex-col md:flex-row group cursor-pointer"
                >
                    {/* Date Badge */}
                    <div className="md:w-32 bg-primary group-hover:bg-green-700 transition text-white flex flex-col items-center justify-center p-4 md:p-0">
                        <span className="text-3xl font-bold">{getDay(event.date)}</span>
                        <span className="text-lg uppercase font-medium">{getMonth(event.date)}</span>
                        <span className="text-sm opacity-80">{new Date(event.date).getFullYear()}</span>
                    </div>

                    {/* Image */}
                    <div className="md:w-64 h-48 md:h-auto relative">
                        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-gray-800 uppercase shadow-sm">
                            {event.category}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary transition">{event.title}</h3>
                            <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-primary" />
                                {event.time}
                            </div>
                            <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-primary" />
                                {event.location}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {filteredEvents.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Aucun événement trouvé pour cette période ou catégorie.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Agenda;