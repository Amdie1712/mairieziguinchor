
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, User, ChevronDown, LayoutDashboard, LogOut } from 'lucide-react';
import { AuthService } from '../services/auth';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setIsLoggedIn(!!user);
    setIsAdmin(user?.role === 'admin');
  }, [location]);

  interface NavLink {
      name: string;
      path?: string;
      children?: { name: string; path: string }[];
  }

  const navLinks: NavLink[] = [
    { name: 'Accueil', path: '/' },
    { 
      name: 'La Mairie', 
      children: [
        { name: 'À propos', path: '/about' },
        { name: 'Conseil Municipal', path: '/conseil' },
        { name: 'Conseils de Quartier', path: '/conseils-quartier' },
        { name: 'Documents & Archives', path: '/documents' },
      ]
    },
    { 
      name: 'Services', 
      children: [
        { name: 'Services Municipaux', path: '/services' },
        { name: 'État Civil', path: '/etat-civil' },
        { name: 'Cadre de Vie', path: '/environnement' },
        { name: 'Voirie & Éclairage Public', path: '/urbanisme' },
        { name: 'Éducation & Formation', path: '/education' },
        { name: 'Santé & Action Sociale', path: '/social' },
        { name: 'Jeunesse, Sport & Culture', path: '/culture' },
        { name: 'Gouvernance des Quartiers', path: '/conseils-quartier' },
      ]
    },
    { name: 'Actualités', path: '/news' },
    { name: 'Projets', path: '/projets' },
    { name: 'Agenda', path: '/agenda' },
    { name: 'Participation', path: '/participation' },
    { name: 'Démarches', path: '/demarches' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path?: string) => path ? location.pathname === path : false;
  const isParentActive = (children: {path: string}[]) => children.some(c => isActive(c.path));

  const handleAuthClick = () => {
    if (isLoggedIn) {
        navigate('/dashboard');
    } else {
        navigate('/login');
    }
  };

  const handleLogout = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      AuthService.logout();
    }
  };

  const toggleMobileDropdown = (name: string) => {
      if (mobileDropdownOpen === name) {
          setMobileDropdownOpen(null);
      } else {
          setMobileDropdownOpen(name);
      }
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-primary text-white p-2 rounded-lg">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 leading-none">Mairie de</span>
                <span className="text-lg font-semibold text-primary leading-none">Ziguinchor</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-4">
            <nav className="flex space-x-1 xl:space-x-2">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group">
                    {link.path ? (
                        <Link
                            to={link.path}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                                isActive(link.path)
                                ? 'text-primary bg-green-50'
                                : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ) : (
                        <button
                            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap cursor-default ${
                                link.children && isParentActive(link.children)
                                ? 'text-primary bg-green-50'
                                : 'text-gray-600 group-hover:text-primary group-hover:bg-gray-50'
                            }`}
                        >
                            {link.name}
                            <ChevronDown className="ml-1 h-4 w-4" />
                        </button>
                    )}

                    {/* Dropdown Menu */}
                    {link.children && (
                        <div className="absolute left-0 mt-0 w-56 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50">
                            {link.children.map((child) => (
                                <Link
                                    key={child.name}
                                    to={child.path}
                                    className={`block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary ${isActive(child.path) ? 'bg-gray-50 text-primary font-semibold' : ''}`}
                                >
                                    {child.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
              ))}
            </nav>
            <div className="flex items-center space-x-3 border-l pl-4 border-gray-200">
                <button className="text-gray-500 hover:text-primary transition" title="Langue">
                    <Globe className="h-5 w-5" />
                </button>
                
                <div className="flex items-center gap-2">
                    {isAdmin ? (
                        <Link
                            to="/admin"
                            className="flex items-center space-x-2 px-4 py-2 rounded-md transition text-sm font-medium whitespace-nowrap bg-gray-800 text-white hover:bg-gray-900 shadow-sm"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Administration</span>
                        </Link>
                    ) : (
                        <button 
                            onClick={handleAuthClick}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition text-sm font-medium whitespace-nowrap shadow-sm ${isLoggedIn ? 'bg-green-100 text-primary hover:bg-green-200' : 'bg-primary text-white hover:bg-green-700'}`}
                        >
                            <User className="h-4 w-4" />
                            <span>{isLoggedIn ? 'Mon Compte' : 'Espace Citoyen'}</span>
                        </button>
                    )}

                    {isLoggedIn && (
                        <button 
                            onClick={handleLogout}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition group"
                            title="Déconnexion"
                        >
                            <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        </button>
                    )}
                </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
                <div key={link.name}>
                    {link.path ? (
                        <Link
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={`block px-3 py-2 rounded-md text-base font-medium ${
                            isActive(link.path)
                                ? 'text-primary bg-green-50'
                                : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ) : (
                        <div>
                            <button
                                onClick={() => toggleMobileDropdown(link.name)}
                                className={`w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium ${
                                    link.children && isParentActive(link.children)
                                    ? 'text-primary bg-green-50'
                                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                                }`}
                            >
                                {link.name}
                                <ChevronDown className={`h-5 w-5 transform transition-transform ${mobileDropdownOpen === link.name ? 'rotate-180' : ''}`} />
                            </button>
                            {/* Mobile Dropdown items */}
                            {mobileDropdownOpen === link.name && link.children && (
                                <div className="pl-4 space-y-1 bg-gray-50/50">
                                    {link.children.map(child => (
                                        <Link
                                            key={child.name}
                                            to={child.path}
                                            onClick={() => setIsOpen(false)}
                                            className={`block px-3 py-2 rounded-md text-sm font-medium ${
                                                isActive(child.path)
                                                    ? 'text-primary font-semibold'
                                                    : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                        >
                                            {child.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
             <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 px-2">
                {isAdmin && (
                    <Link 
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="w-full flex items-center justify-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition"
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Administration</span>
                    </Link>
                )}
                <button 
                    onClick={() => { handleAuthClick(); setIsOpen(false); }}
                    className="w-full flex items-center justify-center space-x-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                >
                    <User className="h-4 w-4" />
                    <span>{isLoggedIn ? 'Mon Compte' : 'Espace Citoyen'}</span>
                </button>
                {isLoggedIn && (
                    <button 
                        onClick={() => { handleLogout(); setIsOpen(false); }}
                        className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 transition border border-red-100"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Déconnexion</span>
                    </button>
                )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
