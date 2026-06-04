import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { EventService, Event } from '../services/api';
import { ArrowLeft, Calendar, MapPin, Clock, Share2, Facebook, Twitter, CalendarPlus } from 'lucide-react';

const EventDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    EventService.getById(Number(id)).then(data => {
        setEvent(data);
        setLoading(false);
    }).catch(err => {
        console.error(err);
        setLoading(false);
    });
  }, [id]);

  if (loading) {
      return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
      );
  }

  if (!event) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Événement introuvable</h2>
            <button onClick={() => navigate('/agenda')} className="text-primary hover:underline">
                Retour à l'agenda
            </button>
        </div>
    );
  }

  const handleAddToCalendar = () => {
      alert("Fonctionnalité d'ajout au calendrier en cours de développement.");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
       {/* Hero / Header */}
       <div className="bg-white border-b border-gray-200">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
               <Link to="/agenda" className="inline-flex items-center text-gray-500 hover:text-primary mb-6 transition">
                   <ArrowLeft className="h-4 w-4 mr-2" />
                   Retour à l'agenda
               </Link>
               <div className="flex flex-col md:flex-row gap-8">
                   {/* Image */}
                   <div className="md:w-1/2 lg:w-2/5">
                       <div className="rounded-2xl overflow-hidden shadow-lg h-80">
                           <img 
                               src={event.imageUrl} 
                               alt={event.title} 
                               className="w-full h-full object-cover"
                            />
                       </div>
                   </div>
                   
                   {/* Info */}
                   <div className="md:w-1/2 lg:w-3/5 flex flex-col justify-center">
                       <span className="text-primary font-bold uppercase tracking-wider mb-2">{event.category}</span>
                       <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">{event.title}</h1>
                       
                       <div className="space-y-4 mb-8">
                           <div className="flex items-center text-gray-700">
                               <Calendar className="h-5 w-5 mr-3 text-primary" />
                               <span className="text-lg font-medium">
                                   {new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                               </span>
                           </div>
                           <div className="flex items-center text-gray-700">
                               <Clock className="h-5 w-5 mr-3 text-primary" />
                               <span className="text-lg">{event.time}</span>
                           </div>
                           <div className="flex items-center text-gray-700">
                               <MapPin className="h-5 w-5 mr-3 text-primary" />
                               <span className="text-lg">{event.location}</span>
                           </div>
                       </div>

                       <div className="flex gap-4">
                           <button onClick={handleAddToCalendar} className="bg-primary hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center">
                               <CalendarPlus className="h-5 w-5 mr-2" />
                               Ajouter au calendrier
                           </button>
                           <div className="flex gap-2">
                                <button className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition">
                                    <Facebook className="h-5 w-5" />
                                </button>
                                <button className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition">
                                    <Twitter className="h-5 w-5" />
                                </button>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       </div>

       {/* Details */}
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               <div className="md:col-span-2">
                   <h2 className="text-2xl font-bold text-gray-900 mb-6">À propos de l'événement</h2>
                   <div className="prose prose-lg text-gray-600">
                       <p className="text-lg font-medium text-gray-800 mb-4">{event.description}</p>
                       <p>
                           Venez nombreux participer à cet événement exceptionnel organisé par la Mairie de Ziguinchor. C'est l'occasion de découvrir la richesse culturelle et dynamique de notre commune.
                       </p>
                       <p>
                           L'entrée est libre et ouverte à tous. Des stands de restauration et d'artisanat seront disponibles sur place.
                       </p>
                   </div>
               </div>
               
               <div className="md:col-span-1">
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                       <h3 className="font-bold text-gray-900 mb-4">Informations pratiques</h3>
                       <div className="space-y-4 text-sm text-gray-600">
                           <p>
                               <strong>Accès :</strong><br/>
                               Parking gratuit à proximité. Accessible aux personnes à mobilité réduite.
                           </p>
                           <p>
                               <strong>Organisateur :</strong><br/>
                               Service Culturel de la Mairie
                           </p>
                           <p>
                               <strong>Contact :</strong><br/>
                               033 991 12 34<br/>
                               culture@mairieziguinchor.sn
                           </p>
                       </div>
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
};

export default EventDetail;