import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ContactService } from '../services/api';

// Fix for default Leaflet icon not loading correctly in some environments
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Coordonnées approximatives de la Mairie de Ziguinchor
  const positionMairie: [number, number] = [12.5859, -16.2729];

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear errors when user types
    if (errors.length > 0) setErrors([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: string[] = [];
    if (!formData.name.trim()) newErrors.push("Le nom est obligatoire.");
    if (!formData.email.trim()) {
      newErrors.push("L'email est obligatoire.");
    } else if (!validateEmail(formData.email)) {
      newErrors.push("L'adresse email n'est pas valide.");
    }
    if (!formData.subject) newErrors.push("Veuillez choisir un sujet.");
    if (!formData.message.trim()) newErrors.push("Le message ne peut pas être vide.");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    ContactService.send(formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setErrors([]);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="bg-white">
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-extrabold">Contactez-nous</h1>
          <p className="mt-4 text-lg text-gray-300">
            Une question ? Une suggestion ? N'hésitez pas à nous écrire.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Form Side */}
          <div className="bg-gray-50 p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyer un message</h2>
            
            {errors.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      Veuillez corriger les erreurs suivantes :
                    </p>
                    <ul className="list-disc list-inside text-xs text-red-600 mt-1">
                      {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {submitted ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
                    <strong className="font-bold">Succès !</strong>
                    <span className="block sm:inline"> Votre message a bien été envoyé. Nous vous répondrons sous peu.</span>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom complet</label>
                    <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary bg-white border p-3"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse Email</label>
                    <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary bg-white border p-3"
                    />
                </div>
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Sujet</label>
                    <select
                    name="subject"
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary bg-white border p-3"
                    >
                    <option value="">Choisir un sujet...</option>
                    <option value="Etat Civil">État Civil</option>
                    <option value="Voirie">Voirie & Propreté</option>
                    <option value="Suggestion">Suggestion / Réclamation</option>
                    <option value="Autre">Autre</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea
                    name="message"
                    id="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary bg-white border p-3"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition"
                >
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer
                </button>
                </form>
            )}
          </div>

          {/* Info Side */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations Pratiques</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-3 text-base text-gray-500">
                    <p className="text-lg font-medium text-gray-900">Adresse</p>
                    <p className="mt-1">Mairie de Ziguinchor</p>
                    <p>Rue du Général de Gaulle</p>
                    <p>Ziguinchor, Sénégal</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-3 text-base text-gray-500">
                    <p className="text-lg font-medium text-gray-900">Téléphone</p>
                    <p className="mt-1">+221 33 991 12 34</p>
                    <p className="text-sm text-green-600 font-semibold mt-1">Numéro vert : 800 00 12 12</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-3 text-base text-gray-500">
                    <p className="text-lg font-medium text-gray-900">Email</p>
                    <p className="mt-1">contact@mairieziguinchor.sn</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Map */}
            <div className="w-full h-80 rounded-xl overflow-hidden shadow-lg border border-gray-200 z-0 relative">
               <MapContainer 
                  center={positionMairie} 
                  zoom={15} 
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={false}
               >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={positionMairie} icon={icon}>
                    <Popup>
                      <strong>Hôtel de Ville</strong><br />
                      Mairie de Ziguinchor<br />
                      Rue du Général de Gaulle
                    </Popup>
                  </Marker>
                </MapContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
