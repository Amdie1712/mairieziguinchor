
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { AuthService } from '../services/auth';
import { DossierService } from '../services/api';

const ProcedureForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dossierType = location.state?.dossierType || 'Acte de naissance';
  const category = location.state?.category || 'Général';
  const neighborhoodName = location.state?.neighborhoodName || '';
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = AuthService.getCurrentUser();

  const [formData, setFormData] = useState({
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    reason: '',
    specificInfo: '',
    // Champs sociaux optionnels
    maritalStatus: 'Célibataire',
    childrenCount: '0',
    monthlyIncome: '',
    vulnerabilityType: 'Aucune',
    // Nouveaux champs pour candidatures quartiers/entreprises
    neighborhood: neighborhoodName,
    profession: '',
    motivation: '',
    companyName: '',
    networkReason: '',
    // Actes état civil
    eventDate: '',
    eventPlace: '',
    concernedName: '',
    // Places / Occupation
    occupationType: 'Boutique',
    duration: '',
    // Emploi / Stage / Volontariat
    applicationType: 'Stage',
    studyDomain: '',
    experienceLevel: 'Débutant',
    availabilityDate: '',
    // Scolaire
    childFirstName: '',
    childLastName: '',
    childBirthDate: '',
    schoolLevel: 'Maternelle',
    schoolName: '',
  });

  const [files, setFiles] = useState<{name: string, type: string}[]>([]);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (s: number) => {
    const newErrors: Record<string, string> = {};
    if (s === 1) {
      if (!formData.firstName) newErrors.firstName = "Le prénom est obligatoire";
      if (!formData.lastName) newErrors.lastName = "Le nom est obligatoire";
      if (!formData.phone) newErrors.phone = "Le numéro de téléphone est obligatoire";
      if (!formData.email) {
        newErrors.email = "L'adresse email est obligatoire";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Format d'email invalide";
      }
    } else if (s === 2) {
      if (dossierType === 'Candidature Conseiller de Quartier') {
        if (!formData.profession) newErrors.profession = "La profession est obligatoire";
        if (!formData.motivation) newErrors.motivation = "La motivation est obligatoire";
      } else if (dossierType === 'Rejoindre le réseau Entreprises') {
        if (!formData.companyName) newErrors.companyName = "Le nom de l'entreprise est obligatoire";
        if (!formData.networkReason) newErrors.networkReason = "Le motif est obligatoire";
      } else if (dossierType.toLowerCase().includes('acte de')) {
        if (!formData.eventDate) newErrors.eventDate = "La date de l'événement est obligatoire";
        if (!formData.eventPlace) newErrors.eventPlace = "Le lieu de l'événement est obligatoire";
        if (!formData.concernedName) newErrors.concernedName = "Le nom de la personne concernée est obligatoire";
      } else if (dossierType.toLowerCase().includes('stage') || dossierType.toLowerCase().includes('emploi') || dossierType.toLowerCase().includes('volontaire') || dossierType.toLowerCase().includes('candidat rh')) {
        if (!formData.studyDomain) newErrors.studyDomain = "Le domaine est obligatoire";
        if (!formData.availabilityDate) newErrors.availabilityDate = "La date de disponibilité est obligatoire";
        if (!formData.motivation) newErrors.motivation = "La motivation est obligatoire";
      } else if (dossierType.toLowerCase().includes('scolaire')) {
        if (!formData.childFirstName) newErrors.childFirstName = "Le prénom de l'enfant est obligatoire";
        if (!formData.childLastName) newErrors.childLastName = "Le nom de l'enfant est obligatoire";
        if (!formData.schoolName) newErrors.schoolName = "L'établissement est obligatoire";
      } else if (dossierType.toLowerCase().includes('place') || dossierType.toLowerCase().includes('espace') || dossierType.toLowerCase().includes('spectacle')) {
        if (!formData.reason) newErrors.reason = "Précisez l'usage ou le projet";
        if (!formData.duration) newErrors.duration = "La durée souhaitée est obligatoire";
      } else {
        if (!formData.reason) newErrors.reason = "Le motif est obligatoire";
        if (category === 'Social') {
          if (!formData.monthlyIncome) newErrors.monthlyIncome = "Le revenu est obligatoire";
          if (formData.childrenCount === "") newErrors.childrenCount = "Précisez le nombre d'enfants";
        } else {
          if (!formData.specificInfo) newErrors.specificInfo = "Les informations complémentaires sont obligatoires";
        }
      }
    } else if (s === 3) {
      if (files.length === 0) newErrors.files = "Veuillez joindre au moins un document justificatif";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(s => s + 1);
    } else {
        // En option, on peut scroller en haut de la page ou vers le premier champ en erreur
        window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };
  const handlePrev = () => {
    setErrors({});
    setStep(s => s - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    
    // Check if agreement is checked at step 4
    const agreeChecked = (document.getElementById('agree') as HTMLInputElement)?.checked;
    if (!agreeChecked) {
        setErrors({ agree: "Vous devez certifier l'exactitude des informations" });
        return;
    }

    setIsSubmitting(true);
    try {
      const description = `${dossierType} pour ${formData.firstName} ${formData.lastName}. Catégorie: ${category}`;
      await DossierService.create({
          userId: user?.id,
          type: dossierType,
          description: description,
          formData: formData
      });
      setStep(5); // Success step
    } catch (e) {
      alert("Erreur lors de la soumission du dossier.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setFiles([...files, { name: file.name, type: file.type }]);
      }
  };

  const renderStepIcon = (s: number, icon: string) => {
      const Icon = (Icons as any)[icon];
      const isActive = step === s;
      const isDone = step > s;
      
      return (
          <div className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive ? 'bg-primary text-white scale-110 shadow-lg' : 
                  isDone ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                  {isDone ? <Icons.Check className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
              </div>
              <span className={`text-[10px] mt-2 font-bold uppercase tracking-tight ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                  Étape {s}
              </span>
          </div>
      );
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        <div className="mb-12">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-primary mb-6 transition">
                <Icons.ArrowLeft className="w-4 h-4 mr-2" /> Retour
            </button>
            <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-2xl">
                    {category === 'Social' ? <Icons.Heart className="text-primary w-6 h-6" /> : <Icons.FileText className="text-primary w-6 h-6" />}
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">{dossierType}</h1>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">{category}</p>
                </div>
            </div>
        </div>

        {step < 5 && (
            <div className="flex justify-between mb-12 relative">
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
                {renderStepIcon(1, 'User')}
                {renderStepIcon(2, 'FileText')}
                {renderStepIcon(3, 'Paperclip')}
                {renderStepIcon(4, 'Eye')}
            </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8 md:p-12">
                
                {/* ETAPE 1 : IDENTITÉ */}
                {step === 1 && (
                    <div className="animate-fade-in-up">
                        <h2 className="text-2xl font-bold mb-8">Informations Personnelles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Prénom <span className="text-red-500">*</span></label>
                                <input type="text" className={`w-full border rounded-xl p-4 bg-gray-50 focus:ring-2 outline-none transition ${errors.firstName ? 'border-red-500 ring-red-500/20' : 'focus:ring-primary/20'}`} value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                                {errors.firstName && <p className="text-red-500 text-xs font-bold">{errors.firstName}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Nom <span className="text-red-500">*</span></label>
                                <input type="text" className={`w-full border rounded-xl p-4 bg-gray-50 focus:ring-2 outline-none transition ${errors.lastName ? 'border-red-500 ring-red-500/20' : 'focus:ring-primary/20'}`} value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                                {errors.lastName && <p className="text-red-500 text-xs font-bold">{errors.lastName}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Email <span className="text-red-500">*</span></label>
                                <input type="email" className={`w-full border rounded-xl p-4 bg-gray-50 focus:ring-2 outline-none transition ${errors.email ? 'border-red-500 ring-red-500/20' : 'focus:ring-primary/20'}`} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                                {errors.email && <p className="text-red-500 text-xs font-bold">{errors.email}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Téléphone <span className="text-red-500">*</span></label>
                                <input type="tel" className={`w-full border rounded-xl p-4 focus:ring-2 outline-none transition ${errors.phone ? 'border-red-500 ring-red-500/20' : 'focus:ring-primary/20'}`} placeholder="77 000 00 00" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                {errors.phone && <p className="text-red-500 text-xs font-bold">{errors.phone}</p>}
                            </div>
                        </div>
                    </div>
                )}

                {/* ETAPE 2 : DETAILS DEMANDE (Conditionnel pour Social) */}
                {step === 2 && (
                    <div className="animate-fade-in-up">
                        <h2 className="text-2xl font-bold mb-8">{category === 'Social' ? 'Ma situation sociale' : 'Détails de la demande'}</h2>
                        
                        {category === 'Social' ? (
                            <div className="space-y-6">
                                {/* ... existing social fields ... */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Situation Matrimoniale</label>
                                        <select className="w-full border rounded-xl p-4" value={formData.maritalStatus} onChange={e => setFormData({...formData, maritalStatus: e.target.value})}>
                                            <option>Célibataire</option>
                                            <option>Marié(e)</option>
                                            <option>Divorcé(e)</option>
                                            <option>Veuf/Veuve</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Nombre d'enfants à charge <span className="text-red-500">*</span></label>
                                        <input type="number" min="0" className={`w-full border rounded-xl p-4 ${errors.childrenCount ? 'border-red-500 shadow-sm shadow-red-100' : ''}`} value={formData.childrenCount} onChange={e => setFormData({...formData, childrenCount: e.target.value})} />
                                        {errors.childrenCount && <p className="text-red-500 text-xs font-bold">{errors.childrenCount}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Revenu mensuel estimé (CFA) <span className="text-red-500">*</span></label>
                                        <input type="text" className={`w-full border rounded-xl p-4 ${errors.monthlyIncome ? 'border-red-500' : ''}`} placeholder="Ex: 50000" value={formData.monthlyIncome} onChange={e => setFormData({...formData, monthlyIncome: e.target.value})} />
                                        {errors.monthlyIncome && <p className="text-red-500 text-xs font-bold">{errors.monthlyIncome}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Type de vulnérabilité</label>
                                        <select className="w-full border rounded-xl p-4" value={formData.vulnerabilityType} onChange={e => setFormData({...formData, vulnerabilityType: e.target.value})}>
                                            <option>Aucune</option>
                                            <option>Maladie chronique</option>
                                            <option>Handicap moteur</option>
                                            <option>Handicap visuel/auditif</option>
                                            <option>Perte d'emploi</option>
                                            <option>Sinistre (Incendie/Inondation)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Expliquez votre situation et votre besoin <span className="text-red-500">*</span></label>
                                    <textarea className={`w-full border rounded-xl p-4 min-h-[120px] ${errors.reason ? 'border-red-500' : ''}`} placeholder="Détaillez ici les raisons de votre demande d'aide..." value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})}></textarea>
                                    {errors.reason && <p className="text-red-500 text-xs font-bold">{errors.reason}</p>}
                                </div>
                            </div>
                        ) : dossierType === 'Candidature Conseiller de Quartier' ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Quartier concerné <span className="text-red-500">*</span></label>
                                        <input type="text" disabled className="w-full border rounded-xl p-4 bg-gray-100 font-bold" value={formData.neighborhood} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Profession <span className="text-red-500">*</span></label>
                                        <input type="text" className={`w-full border rounded-xl p-4 ${errors.profession ? 'border-red-500' : ''}`} value={formData.profession} onChange={e => setFormData({...formData, profession: e.target.value})} />
                                        {errors.profession && <p className="text-red-500 text-xs font-bold">{errors.profession}</p>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Vos motivations pour rejoindre le conseil <span className="text-red-500">*</span></label>
                                    <textarea className={`w-full border rounded-xl p-4 min-h-[120px] ${errors.motivation ? 'border-red-500' : ''}`} placeholder="Pourquoi voulez-vous devenir conseiller ?" value={formData.motivation} onChange={e => setFormData({...formData, motivation: e.target.value})}></textarea>
                                    {errors.motivation && <p className="text-red-500 text-xs font-bold">{errors.motivation}</p>}
                                </div>
                            </div>
                        ) : dossierType === 'Rejoindre le réseau Entreprises' ? (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Nom de votre entreprise <span className="text-red-500">*</span></label>
                                    <input type="text" className={`w-full border rounded-xl p-4 ${errors.companyName ? 'border-red-500' : ''}`} value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
                                    {errors.companyName && <p className="text-red-500 text-xs font-bold">{errors.companyName}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Pourquoi souhaitez-vous rejoindre le réseau ? <span className="text-red-500">*</span></label>
                                    <textarea className={`w-full border rounded-xl p-4 min-h-[120px] ${errors.networkReason ? 'border-red-500' : ''}`} value={formData.networkReason} onChange={e => setFormData({...formData, networkReason: e.target.value})}></textarea>
                                    {errors.networkReason && <p className="text-red-500 text-xs font-bold">{errors.networkReason}</p>}
                                </div>
                            </div>
                        ) : dossierType.toLowerCase().includes('acte de') ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Nom complet de la personne concernée <span className="text-red-500">*</span></label>
                                        <input type="text" className={`w-full border rounded-xl p-4 ${errors.concernedName ? 'border-red-500' : ''}`} value={formData.concernedName} onChange={e => setFormData({...formData, concernedName: e.target.value})} placeholder="Nom et Prénom" />
                                        {errors.concernedName && <p className="text-red-500 text-xs font-bold">{errors.concernedName}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Date de l'événement <span className="text-red-500">*</span></label>
                                        <input type="date" className={`w-full border rounded-xl p-4 ${errors.eventDate ? 'border-red-500' : ''}`} value={formData.eventDate} onChange={e => setFormData({...formData, eventDate: e.target.value})} />
                                        {errors.eventDate && <p className="text-red-500 text-xs font-bold">{errors.eventDate}</p>}
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-bold text-gray-700">Lieu de l'événement <span className="text-red-500">*</span></label>
                                        <input type="text" className={`w-full border rounded-xl p-4 ${errors.eventPlace ? 'border-red-500' : ''}`} value={formData.eventPlace} onChange={e => setFormData({...formData, eventPlace: e.target.value})} placeholder="Hôpital, domicile, commune..." />
                                        {errors.eventPlace && <p className="text-red-500 text-xs font-bold">{errors.eventPlace}</p>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Motif de la demande ou détails <span className="text-red-500">*</span></label>
                                    <textarea className={`w-full border rounded-xl p-4 min-h-[100px] ${errors.reason ? 'border-red-500' : ''}`} placeholder="Ex: Pour dossier scolaire, passeport..." value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})}></textarea>
                                    {errors.reason && <p className="text-red-500 text-xs font-bold">{errors.reason}</p>}
                                </div>
                            </div>
                        ) : (dossierType.toLowerCase().includes('place') || dossierType.toLowerCase().includes('espace') || dossierType.toLowerCase().includes('spectacle')) ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Type d'occupation souhaitée</label>
                                        <select className="w-full border rounded-xl p-4" value={formData.occupationType} onChange={e => setFormData({...formData, occupationType: e.target.value})}>
                                            <option>Cantine scolaire</option>
                                            <option>Boutique municipale</option>
                                            <option>Espace public (Marché, Place)</option>
                                            <option>Salle de spectacle / fête</option>
                                            <option>Autre espace municipal</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Durée souhaitée <span className="text-red-500">*</span></label>
                                        <input type="text" className={`w-full border rounded-xl p-4 ${errors.duration ? 'border-red-500' : ''}`} placeholder="Ex: 1 jour, 12 mois, permanent..." value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
                                        {errors.duration && <p className="text-red-500 text-xs font-bold">{errors.duration}</p>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Description détaillée du projet / usage <span className="text-red-500">*</span></label>
                                    <textarea className={`w-full border rounded-xl p-4 min-h-[120px] ${errors.reason ? 'border-red-500' : ''}`} placeholder="Détaillez ici votre projet ou l'événement prévu..." value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})}></textarea>
                                    {errors.reason && <p className="text-red-500 text-xs font-bold">{errors.reason}</p>}
                                </div>
                            </div>
                        ) : (dossierType.toLowerCase().includes('stage') || dossierType.toLowerCase().includes('emploi') || dossierType.toLowerCase().includes('volontaire') || dossierType.toLowerCase().includes('candidat rh')) ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Type de candidature</label>
                                        <select className="w-full border rounded-xl p-4" value={formData.applicationType} onChange={e => setFormData({...formData, applicationType: e.target.value})}>
                                            <option value="Stage">Demande de Stage</option>
                                            <option value="Emploi">Demande d'Emploi</option>
                                            <option value="Volontariat">Devenir Volontaire</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Domaine / Expertise <span className="text-red-500">*</span></label>
                                        <input type="text" className={`w-full border rounded-xl p-4 ${errors.studyDomain ? 'border-red-500' : ''}`} placeholder="Ex: Informatique, Santé, Social..." value={formData.studyDomain} onChange={e => setFormData({...formData, studyDomain: e.target.value})} />
                                        {errors.studyDomain && <p className="text-red-500 text-xs font-bold">{errors.studyDomain}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Niveau d'expérience</label>
                                        <select className="w-full border rounded-xl p-4" value={formData.experienceLevel} onChange={e => setFormData({...formData, experienceLevel: e.target.value})}>
                                            <option>Débutant / Étudiant</option>
                                            <option>Intermédiaire</option>
                                            <option>Confirmé / Senior</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Date de disponibilité <span className="text-red-500">*</span></label>
                                        <input type="date" className={`w-full border rounded-xl p-4 ${errors.availabilityDate ? 'border-red-500' : ''}`} value={formData.availabilityDate} onChange={e => setFormData({...formData, availabilityDate: e.target.value})} />
                                        {errors.availabilityDate && <p className="text-red-500 text-xs font-bold">{errors.availabilityDate}</p>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Vos motivations et objectifs <span className="text-red-500">*</span></label>
                                    <textarea className={`w-full border rounded-xl p-4 min-h-[120px] ${errors.motivation ? 'border-red-500' : ''}`} placeholder="Décrivez votre parcours et ce que vous souhaitez apporter à la Mairie..." value={formData.motivation} onChange={e => setFormData({...formData, motivation: e.target.value})}></textarea>
                                    {errors.motivation && <p className="text-red-500 text-xs font-bold">{errors.motivation}</p>}
                                </div>
                            </div>
                        ) : dossierType.toLowerCase().includes('scolaire') ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Prénom de l'enfant <span className="text-red-500">*</span></label>
                                        <input type="text" className={`w-full border rounded-xl p-4 ${errors.childFirstName ? 'border-red-500' : ''}`} value={formData.childFirstName} onChange={e => setFormData({...formData, childFirstName: e.target.value})} />
                                        {errors.childFirstName && <p className="text-red-500 text-xs font-bold">{errors.childFirstName}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Nom de l'enfant <span className="text-red-500">*</span></label>
                                        <input type="text" className={`w-full border rounded-xl p-4 ${errors.childLastName ? 'border-red-500' : ''}`} value={formData.childLastName} onChange={e => setFormData({...formData, childLastName: e.target.value})} />
                                        {errors.childLastName && <p className="text-red-500 text-xs font-bold">{errors.childLastName}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Date de naissance <span className="text-red-500">*</span></label>
                                        <input type="date" className="w-full border rounded-xl p-4" value={formData.childBirthDate} onChange={e => setFormData({...formData, childBirthDate: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Niveau scolaire</label>
                                        <select className="w-full border rounded-xl p-4" value={formData.schoolLevel} onChange={e => setFormData({...formData, schoolLevel: e.target.value})}>
                                            <option>Maternelle (CI/CP)</option>
                                            <option>Élémentaire (CE1/CE2)</option>
                                            <option>Élémentaire (CM1/CM2)</option>
                                            <option>Secondaire</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-bold text-gray-700">Établissement souhaité / fréquenté <span className="text-red-500">*</span></label>
                                        <input type="text" className={`w-full border rounded-xl p-4 ${errors.schoolName ? 'border-red-500' : ''}`} value={formData.schoolName} onChange={e => setFormData({...formData, schoolName: e.target.value})} placeholder="Ex: École de Boutoute" />
                                        {errors.schoolName && <p className="text-red-500 text-xs font-bold">{errors.schoolName}</p>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Informations complémentaires</label>
                                    <textarea className="w-full border rounded-xl p-4 min-h-[100px]" placeholder="Précisez ici toute information utile (régime spécial, handicap, etc.)" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})}></textarea>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Objet / Motif de la demande <span className="text-red-500">*</span></label>
                                    <textarea className={`w-full border rounded-xl p-4 min-h-[100px] ${errors.reason ? 'border-red-500' : ''}`} placeholder="Pourquoi avez-vous besoin de ce document ?" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})}></textarea>
                                    {errors.reason && <p className="text-red-500 text-xs font-bold">{errors.reason}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Informations complémentaires (Dates, lieux...) <span className="text-red-500">*</span></label>
                                    <textarea className={`w-full border rounded-xl p-4 min-h-[100px] ${errors.specificInfo ? 'border-red-500 ring-red-500/10' : ''}`} placeholder="Ex: Date de naissance pour un acte, adresse pour un permis..." value={formData.specificInfo} onChange={e => setFormData({...formData, specificInfo: e.target.value})}></textarea>
                                    {errors.specificInfo && <p className="text-red-500 text-xs font-bold">{errors.specificInfo}</p>}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ETAPE 3 : DOCUMENTS */}
                {step === 3 && (
                    <div className="animate-fade-in-up">
                        <h2 className="text-2xl font-bold mb-8">Pièces Justificatives</h2>
                        <p className="text-sm text-gray-500 mb-8">
                            {category === 'Social' 
                                ? 'Veuillez joindre votre CNI, votre certificat de résidence et tout justificatif de revenus ou médical.'
                                : 'Veuillez joindre une copie lisible de votre CNI et tout document appuyant votre demande.'}
                        </p>
                        
                        <div className={`border-2 border-dashed rounded-3xl p-12 text-center hover:border-primary transition cursor-pointer relative bg-gray-50 ${errors.files ? 'border-red-300' : 'border-gray-200'}`}>
                            <Icons.Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 font-bold">Cliquez ou glissez vos fichiers ici <span className="text-red-500">*</span></p>
                            <p className="text-xs text-gray-400 mt-2">PDF, JPG, PNG (Max 5Mo par fichier)</p>
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={addFile} multiple />
                        </div>
                        {errors.files && <p className="text-red-500 text-center mt-3 font-bold text-xs animate-shake">{errors.files}</p>}

                        {files.length > 0 && (
                            <div className="mt-8 space-y-3">
                                {files.map((f, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="flex items-center">
                                            <Icons.File className="w-5 h-5 text-primary mr-3" />
                                            <span className="text-sm font-medium text-gray-700">{f.name}</span>
                                        </div>
                                        <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">
                                            <Icons.Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ETAPE 4 : RECAPITULATIF */}
                {step === 4 && (
                    <div className="animate-fade-in-up">
                        <h2 className="text-2xl font-bold mb-8">Vérification Finale</h2>
                        <div className="bg-gray-50 rounded-2xl p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                 <div><span className="text-gray-400 font-bold uppercase text-[10px]">Type :</span><p className="font-bold">{dossierType}</p></div>
                                <div><span className="text-gray-400 font-bold uppercase text-[10px]">Demandeur :</span><p className="font-bold">{formData.firstName} {formData.lastName}</p></div>
                                 {category === 'Social' && (
                                    <>
                                        <div><span className="text-gray-400 font-bold uppercase text-[10px]">Sit. Familiale :</span><p className="font-bold">{formData.maritalStatus} ({formData.childrenCount} enf.)</p></div>
                                        <div><span className="text-gray-400 font-bold uppercase text-[10px]">Vulnérabilité :</span><p className="font-bold">{formData.vulnerabilityType}</p></div>
                                        <div><span className="text-gray-400 font-bold uppercase text-[10px]">Revenus :</span><p className="font-bold">{formData.monthlyIncome} CFA</p></div>
                                    </>
                                )}
                                {dossierType.toLowerCase().includes('acte de') && (
                                    <>
                                        <div><span className="text-gray-400 font-bold uppercase text-[10px]">Concerné :</span><p className="font-bold">{formData.concernedName}</p></div>
                                        <div><span className="text-gray-400 font-bold uppercase text-[10px]">Date/Lieu :</span><p className="font-bold text-xs">{formData.eventDate} à {formData.eventPlace}</p></div>
                                    </>
                                )}
                                {(dossierType.toLowerCase().includes('place') || dossierType.toLowerCase().includes('espace') || dossierType.toLowerCase().includes('spectacle')) && (
                                    <>
                                        <div><span className="text-gray-400 font-bold uppercase text-[10px]">Espace :</span><p className="font-bold">{formData.occupationType}</p></div>
                                        <div><span className="text-gray-400 font-bold uppercase text-[10px]">Durée :</span><p className="font-bold">{formData.duration}</p></div>
                                    </>
                                )}
                                {(dossierType.toLowerCase().includes('stage') || dossierType.toLowerCase().includes('emploi') || dossierType.toLowerCase().includes('volontaire')) && (
                                    <>
                                        <div><span className="text-gray-400 font-bold uppercase text-[10px]">Candidature :</span><p className="font-bold">{formData.applicationType}</p></div>
                                        <div><span className="text-gray-400 font-bold uppercase text-[10px]">Domaine :</span><p className="font-bold">{formData.studyDomain}</p></div>
                                        <div><span className="text-gray-400 font-bold uppercase text-[10px]">Expérience :</span><p className="font-bold">{formData.experienceLevel}</p></div>
                                        <div><span className="text-gray-400 font-bold uppercase text-[10px]">Dispo :</span><p className="font-bold">{formData.availabilityDate}</p></div>
                                    </>
                                )}
                                {dossierType.toLowerCase().includes('scolaire') && (
                                    <>
                                        <div><span className="text-gray-400 font-bold uppercase text-[10px]">Enfant :</span><p className="font-bold">{formData.childFirstName} {formData.childLastName}</p></div>
                                        <div><span className="text-gray-400 font-bold uppercase text-[10px]">École/Niveau :</span><p className="font-bold">{formData.schoolName} ({formData.schoolLevel})</p></div>
                                    </>
                                )}
                            </div>
                            <div className="border-t pt-4">
                                <span className="text-gray-400 font-bold uppercase text-[10px]">Motif / Description :</span>
                                <p className="text-sm mt-1">{formData.reason}</p>
                            </div>
                            <div className="border-t pt-4">
                                <span className="text-gray-400 font-bold uppercase text-[10px]">Fichiers joints :</span>
                                <p className="text-sm mt-1">{files.length} document(s)</p>
                            </div>
                        </div>
                        <div className="mt-8 flex flex-col bg-amber-50 p-4 rounded-xl border border-amber-100">
                            <div className="flex items-start">
                                <input type="checkbox" className="mt-1 h-5 w-5 text-primary rounded border-gray-300" id="agree" />
                                <label htmlFor="agree" className="ml-3 text-xs text-amber-800 font-medium">
                                    Je certifie sur l'honneur que les informations fournies sont exactes. Je comprends que toute fausse déclaration peut entraîner le rejet de ma demande sociale.
                                </label>
                            </div>
                            {errors.agree && <p className="text-red-500 text-[10px] font-black uppercase mt-2 ml-8">{errors.agree}</p>}
                        </div>
                    </div>
                )}

                {/* ETAPE 5 : SUCCESS */}
                {step === 5 && (
                    <div className="text-center py-8 animate-fade-in">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Icons.Check className="w-12 h-12" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Demande Enregistrée !</h2>
                        <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto">
                            {category === 'Social' 
                                ? "Votre dossier a été transmis au service d'Action Sociale (CCAS). Un travailleur social étudiera votre demande sous peu."
                                : dossierType.toLowerCase().includes('acte de')
                                ? "Votre demande d'acte d'état civil a été reçue. Elle sera traitée par les services municipaux dans les meilleurs délais."
                                : (dossierType.toLowerCase().includes('stage') || dossierType.toLowerCase().includes('emploi') || dossierType.toLowerCase().includes('volontaire'))
                                ? "Votre candidature a été transmise au service des Ressources Humaines. Vous recevrez une réponse après étude de votre profil."
                                : dossierType.toLowerCase().includes('scolaire')
                                ? "Votre demande d'inscription scolaire a été enregistrée. Elle sera traitée par le service de l'Éducation."
                                : "Votre demande a bien été transmise aux services compétents de la Mairie. Vous recevrez une notification par email de son avancement."}
                        </p>
                        <div className="bg-primary/5 p-6 rounded-2xl mb-12 border border-primary/10">
                            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Référence Dossier</p>
                            <p className="text-3xl font-black text-gray-900 tracking-tighter">
                                {category === 'Social' ? 'SOC' : dossierType.toLowerCase().includes('acte de') ? 'CIV' : (dossierType.toLowerCase().includes('stage') || dossierType.toLowerCase().includes('emploi') || dossierType.toLowerCase().includes('volontaire') || dossierType.toLowerCase().includes('candidat rh')) ? 'RH' : dossierType.toLowerCase().includes('scolaire') ? 'EDU' : 'ADM'}-2024-{Math.floor(1000 + Math.random() * 9000)}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button onClick={() => navigate('/dashboard')} className="bg-primary text-white px-10 py-4 rounded-2xl font-black hover:bg-green-700 transition shadow-lg">
                                Suivre mon dossier
                            </button>
                            <button onClick={() => navigate('/')} className="text-gray-600 font-bold px-8 py-4 hover:bg-gray-100 rounded-2xl transition">
                                Retour à l'accueil
                            </button>
                        </div>
                    </div>
                )}

                {/* ACTIONS */}
                {step < 5 && (
                    <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
                        {step > 1 ? (
                            <button onClick={handlePrev} className="px-6 py-3 font-bold text-gray-400 hover:text-gray-900 flex items-center transition">
                                <Icons.ChevronLeft className="w-5 h-5 mr-1" /> Précédent
                            </button>
                        ) : <div></div>}
                        
                        {step < 4 ? (
                            <button onClick={handleNext} className="bg-primary text-white px-10 py-4 rounded-2xl font-black hover:bg-green-700 transition shadow-lg flex items-center">
                                Continuer <Icons.ChevronRight className="w-5 h-5 ml-1" />
                            </button>
                        ) : (
                            <button 
                                onClick={handleSubmit} 
                                disabled={isSubmitting}
                                className="bg-green-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-green-700 transition shadow-xl flex items-center disabled:opacity-50"
                            >
                                {isSubmitting ? 'Envoi...' : 'Valider et Soumettre'}
                                <Icons.Send className="w-5 h-5 ml-2" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProcedureForm;
