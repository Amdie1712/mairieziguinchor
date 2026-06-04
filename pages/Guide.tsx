import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  User, 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  LayoutDashboard, 
  Printer,
  ChevronRight,
  Info,
  Calendar,
  Users,
  Mail,
  Zap,
  Lock,
  MessageSquare,
  HelpCircle,
  Download,
  Search,
  CheckCircle2,
  List,
  ChevronDown,
  Camera,
  Map as MapIcon,
  HeartHandshake,
  Building,
  Truck,
  Apple,
  Coffee,
  Building2,
  DollarSign
} from 'lucide-react';

const Guide: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('presentation');
  const [isTocVisible, setIsTocVisible] = useState(false);
  
  const handlePrint = () => {
    window.print();
  };

  const sections = [
    { id: 'presentation', title: 'Présentation', icon: BookOpen },
    { id: 'navigation', title: 'Navigation Portal', icon: Search },
    { id: 'citoyen', title: 'Services Citoyens', icon: User },
    { id: 'demarches', title: 'Dossiers & Suivi', icon: FileText },
    { id: 'signalements', title: 'Signalements', icon: AlertTriangle },
    { id: 'admin', title: 'Espace Agent', icon: ShieldCheck },
    { id: 'securite', title: 'Sécurité & Données', icon: Lock },
    { id: 'faq', title: 'FAQ', icon: HelpCircle },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 120,
        behavior: 'smooth'
      });
      setIsTocVisible(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <style>{`
        @media print {
          nav, footer, .chat-widget, .no-print, .toc-sidebar, .toc-mobile-btn {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
            padding: 0 !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
          .guide-container {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .page-break {
            page-break-before: always;
            padding-top: 2rem;
          }
          .print-header {
            display: block !important;
            margin-bottom: 2rem;
            border-bottom: 2px solid #000;
            padding-bottom: 1rem;
          }
          section {
            break-inside: avoid;
            margin-bottom: 3rem;
            padding: 1rem 0;
          }
          h1, h2, h3 {
            orphans: 3;
            widows: 3;
            color: black !important;
          }
          p, li {
            font-size: 11pt !important;
            line-height: 1.6 !important;
          }
          a {
            text-decoration: none !important;
            color: black !important;
          }
          .bg-primary { background-color: #059669 !important; -webkit-print-color-adjust: exact; }
          .text-primary { color: #059669 !important; -webkit-print-color-adjust: exact; }
          .rounded-[3rem], .rounded-3xl, .rounded-2xl {
            border-radius: 0.5rem !important;
          }
          .shadow-sm, .shadow-xl {
            box-shadow: none !important;
            border: 1px solid #eee !important;
          }
          .grid {
            display: block !important;
          }
          .grid > div {
            margin-bottom: 1.5rem !important;
          }
        }
      `}</style>

      {/* Mobile TOC Toggle */}
      <div className="toc-mobile-btn fixed bottom-24 right-6 xl:hidden z-[60] no-print">
        <button 
          onClick={() => setIsTocVisible(!isTocVisible)}
          className="bg-black text-white h-14 w-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition"
        >
          <List className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile TOC Overlay */}
      <AnimatePresence>
        {isTocVisible && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-x-0 bottom-0 top-0 bg-white z-[70] p-8 overflow-y-auto no-print"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black uppercase italic">Sommaire</h3>
              <button onClick={() => setIsTocVisible(false)} className="p-2 bg-gray-100 rounded-full">
                <ChevronDown className="h-6 w-6 rotate-180" />
              </button>
            </div>
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="w-full flex items-center gap-4 px-6 py-4 bg-gray-50 rounded-2xl text-left font-bold"
                >
                  <section.icon className="h-5 w-5 text-primary" />
                  {section.title}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table of Contents - Desktop Sidebar */}
      <div className="toc-sidebar fixed left-8 top-32 w-64 hidden xl:block z-20 no-print">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6 px-2">
            <List className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sommaire</span>
          </div>
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-sm font-bold ${
                  activeSection === section.id 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <section.icon className={`h-4 w-4 ${activeSection === section.id ? 'text-white' : 'text-gray-400'}`} />
                {section.title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto guide-container">
          {/* Header */}
          <div className="bg-white p-8 md:p-16 rounded-[3.5rem] shadow-sm border border-gray-100 mb-16 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 print:shadow-none print:border-none print:p-0 print:mb-24">
            <div className="relative z-10 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-6 no-print">
                <BookOpen className="h-3 w-3" /> Manuel de l'Utilisateur Citoyen
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-none mb-6">
                Le Guide <br className="hidden md:block" />
                <span className="text-primary">Complet</span>
              </h1>
              <p className="text-gray-500 max-w-md font-medium text-xl leading-relaxed mx-auto md:mx-0">
                Maîtrisez votre espace numérique citoyen étape par étape.
              </p>
            </div>
            
            <div className="flex flex-col gap-4 no-print shrink-0">
              <button 
                onClick={handlePrint}
                className="bg-black text-white px-10 py-6 rounded-3xl font-black shadow-2xl hover:scale-105 transition flex items-center gap-3 active:scale-95 group"
              >
                <Download className="h-6 w-6 group-hover:translate-y-1 transition-transform" /> 
                <div className="text-left">
                  <span className="block leading-none">Exporter</span>
                  <span className="text-[10px] opacity-50 uppercase tracking-widest">Version PDF</span>
                </div>
              </button>
              <div className="text-center">
                <span className="text-[10px] font-black uppercase text-gray-300">Version 1.0 • Sénégal 2024</span>
              </div>
            </div>

            {/* Background elements */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/5 rounded-full no-print"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent no-print"></div>
          </div>

          <div className="space-y-32 print:space-y-16">
            
            {/* PART 1: Presentation */}
            <section id="presentation" className="scroll-mt-32">
              <div className="flex items-center gap-8 mb-12">
                <div className="h-20 w-20 bg-primary text-white rounded-[2rem] flex items-center justify-center font-black italic text-3xl shadow-2xl shadow-primary/30">01</div>
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none mb-2">Introduction</h2>
                  <div className="h-1.5 w-24 bg-primary rounded-full"></div>
                </div>
              </div>
              
              <div className="prose prose-xl max-w-none text-gray-600 leading-relaxed space-y-8">
                <p className="text-2xl font-black text-gray-900 border-l-[10px] border-primary pl-8 py-4 bg-gray-50 rounded-r-3xl italic">
                  &quot;Une ville connectée, des citoyens épanouis.&quot;
                </p>
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm leading-relaxed">
                  <p className="mb-6">
                    Bienvenue dans le guide officiel du portail numérique de la <strong>Mairie de Ziguinchor</strong>. Ce document a été élaboré pour vous accompagner dans la prise en main de cet outil moderne qui simplifie vos interactions administratives.
                  </p>
                  <p>
                    Notre objectif est de supprimer les barrières physiques et temporelles, vous permettant d'accéder aux services municipaux 24h/24 et 7j/7, où que vous soyez.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 no-print">
                  <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100">
                    <h4 className="font-black uppercase italic text-blue-600 mb-4 flex items-center gap-2">
                       <Zap className="h-5 w-5" /> Immédiateté
                    </h4>
                    <p className="text-sm font-medium text-blue-900/70 leading-relaxed">Plus de files d'attente. Soumettez vos demandes en quelques clics depuis votre téléphone ou ordinateur.</p>
                  </div>
                  <div className="p-8 bg-emerald-50/50 rounded-3xl border border-emerald-100">
                    <h4 className="font-black uppercase italic text-emerald-600 mb-4 flex items-center gap-2">
                       <ShieldCheck className="h-5 w-5" /> Traçabilité
                    </h4>
                    <p className="text-sm font-medium text-emerald-900/70 leading-relaxed">Suivez l'état réel de votre dossier. Soyez prévenu dès qu'une action est effectuée par nos services.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* PART 2: Navigation */}
            <section id="navigation" className="scroll-mt-32 page-break">
              <div className="flex items-center gap-8 mb-12">
                <div className="h-20 w-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center font-black italic text-3xl shadow-2xl shadow-blue-600/30">02</div>
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none mb-2">Navigation</h2>
                  <div className="h-1.5 w-24 bg-blue-600 rounded-full"></div>
                </div>
              </div>

              <div className="space-y-12">
                <p className="text-lg text-gray-500 font-medium">L'interface a été conçue pour être intuitive, même pour les utilisateurs novices.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { title: "L'Accueil", desc: "Vue d'ensemble des actualités et accès rapide aux démarches phares.", icon: LayoutDashboard },
                    { title: "Annuaire", desc: "Retrouvez tous les services municipaux classés par thématique.", icon: Search },
                    { title: "Profil", desc: "Gérez vos informations et consultez l'historique de vos demandes.", icon: User }
                  ].map((feat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 text-center hover:border-blue-500 transition-colors">
                      <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <feat.icon className="h-6 w-6" />
                      </div>
                      <h4 className="font-black uppercase italic text-gray-900 mb-2">{feat.title}</h4>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* PART 3: Citizen Services */}
            <section id="citoyen" className="scroll-mt-32 page-break">
              <div className="flex items-center gap-8 mb-12">
                <div className="h-20 w-20 bg-amber-500 text-white rounded-[2rem] flex items-center justify-center font-black italic text-3xl shadow-2xl shadow-amber-500/30">03</div>
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none mb-2">Services Citoyens</h2>
                  <div className="h-1.5 w-24 bg-amber-500 rounded-full"></div>
                </div>
              </div>

              <div className="bg-white rounded-[3rem] p-12 border border-gray-100 relative overflow-hidden">
                <div className="prose prose-lg max-w-none text-gray-600 space-y-10">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-4">
                      <span className="h-10 w-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-sm">A</span>
                      Effectuer une demande en ligne
                    </h3>
                    <div className="space-y-6 pl-14">
                      {[
                        { t: "Choix du Service", d: "Rendez-vous dans la section 'Services' et choisissez votre thématique (Social, État Civil, etc.)." },
                        { t: "Saisie des données", d: "Remplissez les champs obligatoires mentionnés par une astérisque (*). Soyez précis." },
                        { t: "Pièces Justificatives", d: "Prenez en photo vos documents avec votre téléphone ou utilisez un scanner." },
                        { t: "Confirmation", d: "Vérifiez vos données puis validez. Un accusé de réception vous est envoyé." }
                      ].map((step, i) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-14 top-2 h-0.5 w-8 bg-amber-100"></div>
                          <h4 className="font-black uppercase italic text-sm text-gray-900 mb-1">{step.t}</h4>
                          <p className="text-sm font-medium text-gray-500">{step.d}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-10 border-t border-gray-100">
                    <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-4">
                      <span className="h-10 w-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-sm">B</span>
                      Documents Autorisés
                    </h3>
                    <div className="flex flex-wrap gap-4 no-print">
                      {['PDF (Recommandé)', 'JPEG', 'PNG'].map(ext => (
                        <span key={ext} className="px-6 py-3 bg-gray-100 rounded-xl font-black text-[10px] uppercase tracking-widest">{ext}</span>
                      ))}
                    </div>
                    <div className="mt-6 flex items-start gap-4 p-6 bg-amber-50 rounded-2xl border border-amber-100">
                      <Info className="h-6 w-6 text-amber-500 shrink-0 mt-1" />
                      <p className="text-sm font-medium text-amber-900/70 italic">
                        Attention : La taille maximale par fichier est de 5Mo. Assurez-vous que les textes sur vos photos sont lisibles.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* PART 4: Dossiers & Follow up */}
            <section id="demarches" className="scroll-mt-32 page-break">
              <div className="flex items-center gap-8 mb-12">
                <div className="h-20 w-20 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center font-black italic text-3xl shadow-2xl shadow-indigo-600/30">04</div>
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none mb-2">Suivi & Dossiers</h2>
                  <div className="h-1.5 w-24 bg-indigo-600 rounded-full"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <h3 className="text-2xl font-black uppercase italic">Le Cycle de Vie</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Nouveau', desc: "Votre dossier vient d'être soumis et attend l'ouverture par un agent.", color: 'bg-blue-500' },
                      { label: 'En Cours', desc: "Un agent municipal vérifie vos pièces et traite votre demande.", color: 'bg-amber-500' },
                      { label: 'Complétude', desc: "Des informations manquantes vous sont demandées.", color: 'bg-indigo-500' },
                      { label: 'Traité', desc: "Votre demande a été honorée. Vous pouvez retirer votre document.", color: 'bg-emerald-500' }
                    ].map((status, i) => (
                      <div key={i} className="flex gap-6 items-start p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className={`h-3 w-3 rounded-full mt-2 shrink-0 ${status.color}`}></div>
                        <div>
                          <h4 className="font-black uppercase italic text-xs mb-1">{status.label}</h4>
                          <p className="text-sm text-gray-500 font-medium leading-relaxed">{status.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-indigo-50/50 rounded-[3rem] p-10 border border-indigo-100 flex flex-col justify-center text-center italic text-indigo-900 group">
                  <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-900/5 group-hover:rotate-12 transition-transform">
                    <Mail className="h-10 w-10 text-indigo-600" />
                  </div>
                  <h4 className="text-xl font-black uppercase mb-4 tracking-tighter">Notifications Automatiques</h4>
                  <p className="font-medium text-indigo-900/60 leading-relaxed mb-6">
                    Plus besoin de vous connecter sans cesse. Vous recevez un email automatique à chaque changement d'état de votre dossier.
                  </p>
                  <div className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase mx-auto">Activé par défaut</div>
                </div>
              </div>
            </section>

            {/* PART 5: Signalements */}
            <section id="signalements" className="scroll-mt-32 page-break">
              <div className="flex items-center gap-8 mb-12">
                <div className="h-20 w-20 bg-rose-500 text-white rounded-[2rem] flex items-center justify-center font-black italic text-3xl shadow-2xl shadow-rose-500/30">05</div>
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none mb-2">Signalements</h2>
                  <div className="h-1.5 w-24 bg-rose-500 rounded-full"></div>
                </div>
              </div>

              <div className="bg-white rounded-[3rem] p-12 border border-gray-100 relative overflow-hidden">
                <div className="flex flex-col md:flex-row gap-16 items-center">
                  <div className="shrink-0 relative no-print">
                    <div className="h-48 w-48 bg-rose-50 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-24 w-24 text-rose-500 opacity-20" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-32 w-32 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center border border-rose-100">
                        <Camera className="h-12 w-12 text-rose-500" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <h3 className="text-2xl font-black text-gray-900 uppercase italic">Ziguinchor propre et sûre</h3>
                    <div className="prose text-gray-600 font-medium">
                      <p>
                        Un lampadaire en panne ? Un nid-de-poule ? Une fuite d'eau sur la voie publique ? 
                        Contribuez à l'amélioration de votre cadre de vie en 3 clics :
                      </p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 list-none p-0">
                        {[
                          { t: "Prendre Photo", i: Camera },
                          { t: "Préciser Lieu", i: MapIcon },
                          { t: "Décrire Problème", i: MessageSquare },
                          { t: "Étape Finale", i: CheckCircle2 }
                        ].map((item, idx) => (
                           <li key={idx} className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                             <item.i className="h-5 w-5 text-rose-500" />
                             <span className="text-sm font-black uppercase italic">{item.t}</span>
                           </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* PART 6: Administration */}
            <section id="admin" className="scroll-mt-32 page-break">
              <div className="flex items-center gap-8 mb-12">
                <div className="h-20 w-20 bg-gray-900 text-white rounded-[2rem] flex items-center justify-center font-black italic text-3xl shadow-2xl shadow-gray-900/30">06</div>
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none mb-2">Espace Agent</h2>
                  <div className="h-1.5 w-24 bg-gray-900 rounded-full"></div>
                </div>
              </div>

              <div className="bg-gray-900 text-white rounded-[3.5rem] p-12 md:p-20 relative overflow-hidden">
                <div className="relative z-10 max-w-2xl space-y-10">
                  <div>
                    <h3 className="text-3xl font-black uppercase italic italic text-primary mb-6 leading-none">Gestion de Proximité</h3>
                    <p className="text-gray-400 text-xl font-medium leading-relaxed">
                      L'interface agent centralise toutes les interactions pour une réponse rapide et coordonnée aux besoins citoyens.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="h-1.5 w-12 bg-primary mb-6"></div>
                      <h4 className="font-black uppercase tracking-widest text-xs">Pilotage</h4>
                      <ul className="space-y-4 text-sm text-gray-400 font-medium list-none p-0">
                        <li className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-primary" /> Modération des contenus</li>
                        <li className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-primary" /> Validation des signalements</li>
                        <li className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-primary" /> Édition de l'agenda</li>
                      </ul>
                    </div>
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 no-print">
                      <h4 className="font-black uppercase italic mb-4 text-sm">Dashboard Agent</h4>
                      <div className="space-y-3 opacity-50 select-none">
                        <div className="h-3 w-full bg-white/20 rounded-full"></div>
                        <div className="h-3 w-2/3 bg-white/20 rounded-full"></div>
                        <div className="h-3 w-4/5 bg-white/20 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Background patterns */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full pointer-events-none opacity-5 flex items-center justify-center -rotate-12 no-print">
                  <div className="grid grid-cols-10 gap-8 h-full w-full">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div key={i} className="bg-white h-4 w-4 rounded-full"></div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* PART 7: Security */}
            <section id="securite" className="scroll-mt-32 page-break">
              <div className="flex items-center gap-8 mb-12">
                <div className="h-20 w-20 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center font-black italic text-3xl shadow-2xl shadow-emerald-500/30">07</div>
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none mb-2">Sécurité</h2>
                  <div className="h-1.5 w-24 bg-emerald-500 rounded-full"></div>
                </div>
              </div>

              <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-12 md:p-16 flex flex-col md:flex-row gap-16">
                  <div className="shrink-0 no-print">
                    <div className="h-32 w-32 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-500">
                      <Lock className="h-12 w-12" />
                    </div>
                  </div>
                  <div className="prose prose-lg max-w-none text-gray-500 space-y-8">
                     <h3 className="text-2xl font-black text-gray-900 leading-tight">La protection de vos données est notre priorité absolue.</h3>
                     <p className="font-medium text-lg italic">
                       Conformément aux lois sénégalaises sur la protection des données personnelles, vos informations sont cryptées et inaccessibles aux tiers.
                     </p>
                     
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 no-print">
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                          <h4 className="font-black uppercase text-xs mb-3 text-emerald-600">Souveraineté</h4>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hébergement Sénégalais</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                          <h4 className="font-black uppercase text-xs mb-3 text-emerald-600">Confidentialité</h4>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Accès restreint</p>
                        </div>
                     </div>
                  </div>
                </div>
                <div className="bg-emerald-500 p-8 text-center text-white font-black uppercase italic tracking-widest text-xs">
                  CERTIFIÉ SÉCURISÉ • CRYPTAGE END-TO-END • 2024
                </div>
              </div>
            </section>

            {/* PART 8: FAQ */}
            <section id="faq" className="scroll-mt-32 page-break">
              <div className="flex items-center gap-8 mb-12">
                <div className="h-20 w-20 bg-amber-500 text-white rounded-[2rem] flex items-center justify-center font-black italic text-3xl shadow-2xl shadow-amber-500/30">08</div>
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none mb-2">FAQ</h2>
                  <div className="h-1.5 w-24 bg-amber-500 rounded-full"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { q: "Quels sont les délais moyens ?", a: "Comptez entre 48h et 15 jours ouvrés selon le type de demande." },
                  { q: "Comment modifier mon dossier ?", a: "Après validation, un dossier n'est plus modifiable. Contactez le service via le chat." },
                  { q: "Est-ce gratuit ?", a: "Oui, l'utilisation du portail est 100% gratuite pour tous les citoyens." },
                  { q: "Où retirer mes documents ?", a: "Certains sont téléchargeables, d'autres nécessitent un retrait physique en mairie." }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-start gap-6 group hover:translate-y-[-4px] transition-transform">
                    <div className="h-10 w-10 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center shrink-0 font-black italic text-xs">Q</div>
                    <div>
                      <h4 className="font-black text-gray-900 mb-3 uppercase italic leading-tight">{item.q}</h4>
                      <p className="text-sm font-medium text-gray-500 leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Assistance Section */}
            <section id="assistance" className="page-break scroll-mt-32">
               <div className="bg-primary p-12 md:p-20 rounded-[4rem] text-center text-white relative overflow-hidden shadow-2xl shadow-primary/20">
                 <div className="relative z-10">
                   <div className="h-24 w-24 bg-white/20 backdrop-blur-3xl rounded-[2rem] flex items-center justify-center mx-auto mb-10 rotate-12">
                     <HelpCircle className="h-12 w-12 text-white" />
                   </div>
                   <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic mb-8">Besoin de nous ?</h2>
                   <p className="text-white/80 max-w-xl mx-auto mb-12 text-xl font-medium leading-relaxed">
                     Nos équipes sont à votre disposition pour vous aider dans vos premiers pas numériques.
                   </p>
                   
                   <div className="flex flex-wrap justify-center gap-6 no-print">
                      <a href="mailto:contact@ziguinchor.sn" className="px-8 py-5 bg-white text-primary rounded-3xl font-black flex items-center gap-3 hover:scale-105 transition active:scale-95 text-sm uppercase">
                        <Mail className="h-5 w-5" /> Nous écrire
                      </a>
                      <a href="tel:+221" className="px-8 py-5 bg-black/20 text-white rounded-3xl font-black flex items-center gap-3 hover:bg-black/30 transition active:scale-95 text-sm uppercase border border-white/10">
                        <Users className="h-5 w-5" /> Contacter le DSI
                      </a>
                   </div>
                 </div>
                 
                 {/* Decorative circles */}
                 <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
               </div>
            </section>
          </div>

          {/* Footer of the guide */}
          <div className="mt-40 border-t border-gray-100 pt-20 text-center space-y-4 print:mt-12">
            <div className="text-[10px] font-black uppercase text-gray-300 tracking-[0.4em]">Mairie de Ziguinchor • République du Sénégal</div>
            <div className="text-[9px] font-medium text-gray-300 italic">© 2024 - Document généré dynamiquement depuis le Portail Officiel. Version d'impression PDF certifiée.</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Guide;
