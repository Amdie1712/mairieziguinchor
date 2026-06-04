import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Lock, Map } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary">Mairie de Ziguinchor</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Au service des citoyens pour le développement de notre commune.
              Une administration moderne, proche de vous et à votre écoute.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/services" className="hover:text-primary transition">État Civil</Link></li>
              <li><Link to="/documents" className="hover:text-primary transition">Délibérations</Link></li>
              <li><Link to="/news" className="hover:text-primary transition">Actualités</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition">Nous contacter</Link></li>
              <li><Link to="/guide" className="hover:text-primary transition font-bold text-gray-200 uppercase text-[10px]">Guide d'utilisation (PDF)</Link></li>
              <li><Link to="/plan-du-site" className="hover:text-primary transition">Plan du site</Link></li>
            </ul>
          </div>

          {/* Column 3: Horaires */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Horaires d'ouverture</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex justify-between"><span>Lundi - Vendredi:</span> <span>08h00 - 17h00</span></li>
              <li className="flex justify-between"><span>Samedi:</span> <span>09h00 - 12h00</span></li>
              <li className="flex justify-between"><span>Dimanche:</span> <span>Fermé</span></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Rue du Général de Gaulle,<br/>Ziguinchor, Sénégal</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span>+221 33 991 12 34</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span>contact@mairieziguinchor.sn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Mairie de Ziguinchor. Tous droits réservés.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
             <Link to="/plan-du-site" className="flex items-center hover:text-primary transition">
                 <Map className="h-3 w-3 mr-1" /> Plan du site
             </Link>
             <Link to="/admin" className="flex items-center hover:text-primary transition">
                 <Lock className="h-3 w-3 mr-1" /> Administration
             </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;