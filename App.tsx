
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import News from './pages/News';
import ArticleDetail from './pages/ArticleDetail';
import Documents from './pages/Documents';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EtatCivil from './pages/EtatCivil';
import Agenda from './pages/Agenda';
import EventDetail from './pages/EventDetail';
import Conseil from './pages/Conseil';
import Signalement from './pages/Signalement';
import Demarches from './pages/Demarches';
import Urbanisme from './pages/Urbanisme';
import Social from './pages/Social';
import Environnement from './pages/Environnement';
import Entreprises from './pages/Entreprises';
import Tourisme from './pages/Tourisme';
import PlanDuSite from './pages/PlanDuSite';
import ConseilsQuartier from './pages/ConseilsQuartier';
import ProcedureForm from './pages/ProcedureForm';
import Participation from './pages/Participation';
import Guide from './pages/Guide';
import Culture from './pages/Culture';
import Projects from './pages/Projects';
import ProjectPartners from './pages/ProjectPartners';
import ProjectMap from './pages/ProjectMap';
import ProjectStats from './pages/ProjectStats';
import ProjectGallery from './pages/ProjectGallery';
import ProjectDetail from './pages/ProjectDetail';
import ProjectPAI from './pages/ProjectPAI';
import ProjectPTI from './pages/ProjectPTI';
import ProjectCooperation from './pages/ProjectCooperation';

import Education from './pages/Education';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projets" element={<Projects />} />
            <Route path="/projets/pai" element={<ProjectPAI />} />
            <Route path="/projets/pti" element={<ProjectPTI />} />
            <Route path="/projets/cooperation" element={<ProjectCooperation />} />
            <Route path="/projets/partenaires" element={<ProjectPartners />} />
            <Route path="/projets/carte" element={<ProjectMap />} />
            <Route path="/projets/stats" element={<ProjectStats />} />
            <Route path="/projets/galerie" element={<ProjectGallery />} />
            <Route path="/projets/:id" element={<ProjectDetail />} />
            <Route path="/conseil" element={<Conseil />} />
            <Route path="/conseils-quartier" element={<ConseilsQuartier />} />
            
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<ArticleDetail />} />
            
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/agenda/:id" element={<EventDetail />} />
            
            <Route path="/services" element={<Services />} />
            <Route path="/demarches" element={<Demarches />} />
            <Route path="/faire-une-demarche" element={<ProcedureForm />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signalement" element={<Signalement />} />
            <Route path="/participation" element={<Participation />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/etat-civil" element={<EtatCivil />} />
            
            {/* New Pages */}
            <Route path="/urbanisme" element={<Urbanisme />} />
            <Route path="/social" element={<Social />} />
            <Route path="/environnement" element={<Environnement />} />
            <Route path="/culture" element={<Culture />} />
            <Route path="/entreprises" element={<Entreprises />} />
            <Route path="/tourisme" element={<Tourisme />} />
            <Route path="/education" element={<Education />} />
            <Route path="/plan-du-site" element={<PlanDuSite />} />
            <Route path="/guide" element={<Guide />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        {/* Le ChatWidget est placé ici pour être visible sur toutes les pages */}
        <ChatWidget />
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
