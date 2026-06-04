
import React from 'react';
import { Heart, Users, Baby, Activity, Phone, GraduationCap, AlertCircle, Clock, FileCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Social: React.FC = () => {
  const navigate = useNavigate();

  const socialPrograms = [
    {
      id: 'familles',
      title: 'Aide aux familles vulnérables',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      desc: 'Soutien financier et matériel pour les ménages à revenus limités.',
      eligibility: ['Résider à Ziguinchor depuis > 6 mois', 'Revenu mensuel inférieur au seuil social'],
      docs: ['Certificat de résidence', 'Justificatif de revenus', 'Livret de famille'],
      delay: '15 jours'
    },
    {
      id: 'seniors',
      title: 'Aide aux personnes âgées',
      icon: Heart,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      desc: 'Accompagnement au maintien à domicile et aide à l\'autonomie.',
      eligibility: ['Avoir plus de 65 ans', 'Perte d\'autonomie constatée'],
      docs: ['CNI', 'Certificat médical', 'Dernière quittance électricité'],
      delay: '10 jours'
    },
    {
      id: 'handicap',
      title: 'Soutien au handicap',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      desc: 'Aménagement du logement et aide à l\'appareillage.',
      eligibility: ['Carte d\'égalité des chances', 'Besoin technique justifié'],
      docs: ['Certificat de handicap', 'Devis appareillage', 'CNI'],
      delay: '20 jours'
    },
    {
      id: 'urgence',
      title: 'Assistance sociale d\'urgence',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      desc: 'Aide immédiate en cas de sinistre ou situation de détresse extrême.',
      eligibility: ['Urgence vitale ou matérielle immédiate'],
      docs: ['Pièce d\'identité (si possible)', 'Procès-verbal de sinistre'],
      delay: '48h max'
    },
    {
      id: 'bourses',
      title: 'Bourses & Aides scolaires',
      icon: GraduationCap,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      desc: 'Soutien à la scolarisation des enfants issus de milieux défavorisés.',
      eligibility: ['Enfant scolarisé en primaire ou collège', 'Bonne assiduité scolaire'],
      docs: ['Certificat de scolarité', 'Bulletins de notes', 'Attestation de revenus parents'],
      delay: '30 jours'
    },
    {
      id: 'medical',
      title: 'Aide médicale ponctuelle',
      icon: Baby,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      desc: 'Prise en charge partielle de frais de santé ou d\'examens médicaux.',
      eligibility: ['Non-bénéficiaire de couverture maladie', 'Indigence constatée'],
      docs: ['Ordonnance médicale', 'Attestation d\'indigence', 'CNI'],
      delay: '5 jours'
    },
    {
      id: 'femmes',
      title: 'Appui aux femmes et enfants',
      icon: Users,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      desc: 'Programmes spécifiques de protection de l\'enfance et d\'autonomisation des femmes.',
      eligibility: ['Femme chef de ménage ou mineur en situation difficile'],
      docs: ['CNI ou Acte de naissance', 'Justificatif de situation'],
      delay: '10 jours'
    },
    {
      id: 'sante',
      title: 'Sensibilisation sanitaire',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      desc: 'Campagnes de prévention, hygiène maternelle et infanto-juvénile.',
      eligibility: ['Tout citoyen de la commune'],
      docs: ['Sans condition'],
      delay: 'Immédiat'
    }
  ];

  const handleStartDemarche = (program: any) => {
    navigate('/faire-une-demarche', { 
        state: { 
            dossierType: program.title,
            category: 'Social'
        } 
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-green-800 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
            <Heart className="w-96 h-96 -mr-20 -mt-20" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-6">Action Sociale & Solidarité</h1>
          <p className="text-green-100 text-xl max-w-3xl mx-auto leading-relaxed">
            La Mairie de Ziguinchor accompagne ses citoyens les plus fragiles à travers des programmes d'aide personnalisés.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Info Banner */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16 flex flex-col md:flex-row items-center justify-between border border-gray-100">
            <div className="flex items-center mb-6 md:mb-0">
                <div className="bg-primary/10 p-4 rounded-full mr-6">
                    <Phone className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-black text-gray-900">Numéro Vert Social</h3>
                    <p className="text-gray-500 font-bold">Appel Gratuit : <span className="text-primary">800 00 12 12</span></p>
                </div>
            </div>
            <div className="h-px w-full md:h-12 md:w-px bg-gray-100 my-4 md:my-0"></div>
            <div className="text-center md:text-left">
                <p className="text-sm text-gray-400 uppercase tracking-widest font-black mb-1">Centre Social CCAS</p>
                <p className="text-gray-700 font-bold">Boulevard des 54m, Ziguinchor</p>
            </div>
            <button onClick={() => navigate('/contact')} className="mt-6 md:mt-0 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg">
                Prendre rendez-vous
            </button>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            {socialPrograms.map((prog) => (
                <div key={prog.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300 group">
                    <div className="p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div className={`p-4 rounded-2xl ${prog.bgColor} ${prog.color}`}>
                                <prog.icon className="h-8 w-8" />
                            </div>
                            <div className="flex items-center text-xs font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                                <Clock className="h-3 w-3 mr-1" /> {prog.delay}
                            </div>
                        </div>
                        
                        <h3 className="text-2xl font-black text-gray-900 mb-3">{prog.title}</h3>
                        <p className="text-gray-500 mb-8 leading-relaxed font-medium">{prog.desc}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center">
                                    <FileCheck className="h-4 w-4 mr-2 text-primary" /> Éligibilité
                                </h4>
                                <ul className="space-y-2">
                                    {prog.eligibility.map((item, i) => (
                                        <li key={i} className="flex items-start text-sm text-gray-600">
                                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center">
                                    <FileCheck className="h-4 w-4 mr-2 text-primary" /> Documents
                                </h4>
                                <ul className="space-y-2">
                                    {prog.docs.map((item, i) => (
                                        <li key={i} className="flex items-start text-sm text-gray-500 italic">
                                            <div className="w-1 h-1 bg-gray-300 rounded-full mr-2 mt-2"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <button 
                            onClick={() => handleStartDemarche(prog)}
                            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black flex items-center justify-center group-hover:bg-primary transition-colors"
                        >
                            Soumettre un dossier social
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {/* Process Steps */}
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 mb-20">
            <h2 className="text-3xl font-black text-gray-900 mb-12 text-center">Comment se déroule votre demande ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                    { n: '01', t: 'Saisie', d: 'Vous remplissez le formulaire social en ligne.' },
                    { n: '02', t: 'Dépôt', d: 'Vous joignez vos justificatifs (scan ou photo).' },
                    { n: '03', t: 'Évaluation', d: 'Un agent social étudie votre situation.' },
                    { n: '04', t: 'Notification', d: 'Vous recevez la décision dans votre espace.' }
                ].map((step, i) => (
                    <div key={i} className="text-center">
                        <div className="text-5xl font-black text-primary/10 mb-4">{step.n}</div>
                        <h4 className="font-black text-gray-900 mb-2">{step.t}</h4>
                        <p className="text-gray-500 text-sm font-medium">{step.d}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Social;
