
import React, { useState, useRef } from 'react';
import { AlertTriangle, MapPin, Camera, Send, Crosshair, CheckCircle, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { ReportingService } from '../services/api';

const Signalement: React.FC = () => {
  const [formData, setFormData] = useState({
    type: 'Voirie',
    location: '',
    description: '',
    email: '',
    phone: ''
  });
  const [image, setImage] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    // Format Sénégal: 70/75/76/77/78 suivi de 7 chiffres
    // On accepte aussi avec +221 ou 00221
    const cleaned = phone.replace(/[\s\.\-\(\)]/g, '');
    return /^((\+221|00221)?(7[05678]|33)\d{7})$/.test(cleaned);
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
        alert("La géolocalisation n'est pas supportée par votre navigateur.");
        return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            setFormData(prev => ({...prev, location: `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`}));
            setIsLocating(false);
        },
        () => {
            alert("Impossible de récupérer votre position.");
            setIsLocating(false);
        }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerCamera = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: string[] = [];
    if (!formData.location.trim()) newErrors.push("La localisation est obligatoire.");
    if (!formData.description.trim()) newErrors.push("La description est obligatoire.");
    
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.push("L'adresse email n'est pas valide.");
    }
    
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.push("Le numéro de téléphone n'est pas valide (Format Sénégal attendu).");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      // Scroll to top of form or where errors are
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    // On inclut l'image dans l'objet envoyé au service
    ReportingService.submit({ ...formData, image });
    setSubmitted(true);
    setFormData({ type: 'Voirie', location: '', description: '', email: '', phone: '' });
    setImage(null);
    setErrors([]);
  };

  if (submitted) {
      return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center animate-fade-in-up">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                      <CheckCircle className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Signalement envoyé !</h2>
                  <p className="text-gray-600 mb-6">
                      Merci pour votre contribution citoyenne. Nos services techniques ont bien reçu votre signalement (incluant votre photo) et interviendront dans les plus brefs délais.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="w-full bg-primary text-white py-3 px-4 rounded-xl font-bold hover:bg-green-700 transition shadow-lg"
                  >
                      Effectuer un autre signalement
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="bg-white min-h-screen font-sans">
       {/* Hero */}
      <div className="bg-amber-500 py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
            <AlertTriangle className="w-64 h-64 -mr-10 -mt-10 rotate-12" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Signalement d'incident</h1>
          <p className="text-amber-100 text-lg max-w-2xl mx-auto font-medium">
            Une rue abîmée ? Un lampadaire éteint ? Prenez une photo et prévenez-nous en quelques clics.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Form */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center">
                    <Send className="h-6 w-6 mr-3 text-amber-500" /> Détails de l'incident
                </h2>
                
                {errors.length > 0 && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm font-bold text-red-700">
                          Erreurs de validation :
                        </p>
                        <ul className="list-disc list-inside text-xs text-red-600 mt-1 font-medium">
                          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Type d'incident */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Nature du problème</label>
                        <select 
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                            className="block w-full border-gray-200 rounded-xl shadow-sm py-4 px-4 focus:ring-amber-500 focus:border-amber-500 border bg-white font-medium"
                        >
                            <option value="Voirie">Voirie (nid de poule, trottoir abîmé...)</option>
                            <option value="Eclairage">Éclairage public défectueux</option>
                            <option value="Propreté">Propreté / Dépôt sauvage</option>
                            <option value="Espaces Verts">Espaces verts (arbre dangereux...)</option>
                            <option value="Sécurité">Sécurité / Stationnement gênant</option>
                            <option value="Autre">Autre incident</option>
                        </select>
                    </div>

                    {/* Photo Capture Section */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Photo de l'incident (Recommandé)</label>
                        {!image ? (
                            <div 
                                onClick={triggerCamera}
                                className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-amber-500 hover:bg-amber-50 transition cursor-pointer group bg-white"
                            >
                                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3 group-hover:text-amber-500 group-hover:scale-110 transition-transform" />
                                <p className="text-gray-600 font-bold">Prendre une photo</p>
                                <p className="text-xs text-gray-400 mt-2">Cliquez pour utiliser votre appareil ou choisir un fichier</p>
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    capture="environment"
                                    className="hidden"
                                />
                            </div>
                        ) : (
                            <div className="relative rounded-2xl overflow-hidden shadow-lg border-4 border-white aspect-video bg-gray-200">
                                <img src={image} alt="Prévisualisation" className="w-full h-full object-cover" />
                                <button 
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition"
                                    title="Supprimer la photo"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                                <div className="absolute bottom-0 inset-x-0 bg-black/50 backdrop-blur-sm p-3 text-white text-xs font-bold flex items-center justify-center">
                                    <ImageIcon className="h-4 w-4 mr-2" /> Photo prête à être envoyée
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Localisation */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Où cela se trouve-t-il ?</label>
                        <div className="flex gap-2">
                             <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    placeholder="Adresse ou repère précis"
                                    value={formData.location}
                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                    className="block w-full pl-12 border-gray-200 rounded-xl shadow-sm py-4 px-4 focus:ring-amber-500 focus:border-amber-500 border bg-white font-medium"
                                />
                            </div>
                            <button 
                                type="button"
                                onClick={handleLocate}
                                disabled={isLocating}
                                className="bg-white border border-gray-200 px-5 rounded-xl text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition flex items-center justify-center min-w-[60px] shadow-sm"
                                title="Utiliser ma position GPS"
                            >
                                {isLocating ? <Loader2 className="h-6 w-6 animate-spin text-amber-500" /> : <Crosshair className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Précisions sur le problème</label>
                        <textarea 
                            rows={4}
                            required
                            placeholder="Décrivez ce que vous constatez..."
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="block w-full border-gray-200 rounded-xl shadow-sm py-4 px-4 focus:ring-amber-500 focus:border-amber-500 border bg-white font-medium"
                        ></textarea>
                    </div>
                    
                    {/* Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Email pour le suivi</label>
                            <input
                                type="email"
                                placeholder="votre@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="block w-full border-gray-200 rounded-xl shadow-sm py-4 px-4 focus:ring-amber-500 focus:border-amber-500 border bg-white font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Numéro de téléphone</label>
                            <input
                                type="tel"
                                placeholder="77 000 00 00"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="block w-full border-gray-200 rounded-xl shadow-sm py-4 px-4 focus:ring-amber-500 focus:border-amber-500 border bg-white font-medium"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="w-full flex justify-center py-5 px-4 border border-transparent rounded-2xl shadow-xl text-lg font-black text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-500/30 transition transform active:scale-[0.98]"
                    >
                        Envoyer le signalement
                    </button>
                </form>
            </div>

            {/* Aide / Informations */}
            <div className="space-y-8">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 group">
                    <div className="h-64 relative">
                        <img 
                            src="https://picsum.photos/id/1047/800/600" 
                            alt="Ville de Ziguinchor" 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                             <span className="text-white font-black text-xl">Service Citoyen de Proximité</span>
                             <span className="text-amber-300 text-sm font-bold">Intervention sous 48h à 72h</span>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-900 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-blue-800 rounded-full opacity-50"></div>
                    <h3 className="text-2xl font-black mb-6 relative z-10">Pourquoi signaler ?</h3>
                    <ul className="space-y-6 relative z-10">
                        <li className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10 rounded-2xl bg-blue-800 flex items-center justify-center font-black mr-4 shadow-inner">1</div>
                            <div>
                                <p className="font-bold text-lg">Plus rapide</p>
                                <p className="text-blue-200 text-sm font-medium">Les photos aident nos techniciens à préparer le bon matériel avant de se déplacer.</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10 rounded-2xl bg-blue-800 flex items-center justify-center font-black mr-4 shadow-inner">2</div>
                            <div>
                                <p className="font-bold text-lg">Suivi direct</p>
                                <p className="text-blue-200 text-sm font-medium">Vous recevez un email dès que l'incident est pris en charge et résolu.</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10 rounded-2xl bg-blue-800 flex items-center justify-center font-black mr-4 shadow-inner">3</div>
                            <div>
                                <p className="font-bold text-lg">Citoyenneté</p>
                                <p className="text-blue-200 text-sm font-medium">Votre action contribue directement à la sécurité et à la propreté de Ziguinchor.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 flex items-center gap-4">
                    <div className="bg-amber-200 p-3 rounded-2xl">
                        <AlertTriangle className="h-6 w-6 text-amber-700" />
                    </div>
                    <div>
                        <p className="text-amber-900 font-bold">Urgence vitale ?</p>
                        <p className="text-amber-800 text-sm">Pour une menace immédiate sur la sécurité des personnes, appelez les Sapeurs-Pompiers au 18.</p>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Signalement;
