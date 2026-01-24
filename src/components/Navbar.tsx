import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    if (!isHome) {
      navigate('/', { state: { scrollTo: id } });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinks = [
    { name: 'Fonctionnalités', id: 'features' },
    { name: 'Prix', id: 'pricing' },
    { name: 'À propos', id: 'about' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer gap-2" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="bg-yellow-500 p-2 rounded-lg">
                <Truck className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-gray-900">BajajSync</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.id)}
                className="text-gray-600 hover:text-yellow-600 font-medium transition-colors duration-200"
              >
                {link.name}
              </button>
            ))}
            <Link
              to="/download"
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-lg shadow-yellow-500/30 transform hover:-translate-y-0.5"
            >
              Télécharger l'app
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-gray-100 absolute w-full"
        >
          <div className="px-4 pt-2 pb-6 space-y-2 shadow-lg">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.id)}
                className="block w-full text-left px-3 py-3 text-base font-medium text-gray-600 hover:text-yellow-600 hover:bg-gray-50 rounded-md"
              >
                {link.name}
              </button>
            ))}
            <div className="pt-4">
              <Link
                to="/download"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-yellow-500 text-white px-4 py-3 rounded-lg font-bold shadow-md"
              >
                Télécharger l'app
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
