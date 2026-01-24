import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Users, Truck, Wallet, BarChart3, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import FeatureCard from '../components/FeatureCard';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const features = [
    {
      title: "Gestion des Chauffeurs",
      description: "Suivez et gérez facilement votre flotte de chauffeurs. Accédez à leurs profils, historiques de courses et performances en temps réel.",
      icon: Users,
      imageSrc: "https://img-wrapper.vercel.app/image?url=https://placehold.co/300x600/f3f4f6/d97706?text=Chauffeurs+App",
      delay: 0.1
    },
    {
      title: "Gestion des Bajaj",
      description: "Gardez un œil sur l'état de vos véhicules. Maintenance, disponibilité et assignation des Bajaj simplifiées.",
      icon: Truck,
      imageSrc: "https://img-wrapper.vercel.app/image?url=https://placehold.co/300x600/f3f4f6/d97706?text=Bajaj+Status",
      delay: 0.2
    },
    {
      title: "Gestion des Transactions",
      description: "Une transparence totale sur vos revenus. Suivez chaque transaction, les recettes journalières et les paiements en attente.",
      icon: Wallet,
      imageSrc: "https://img-wrapper.vercel.app/image?url=https://placehold.co/300x600/f3f4f6/d97706?text=Transactions",
      delay: 0.3
    },
    {
      title: "Statistiques Générales",
      description: "Des tableaux de bord détaillés pour analyser la croissance de votre activité. Prenez les bonnes décisions basées sur des données fiables.",
      icon: BarChart3,
      imageSrc: "https://img-wrapper.vercel.app/image?url=https://placehold.co/300x600/f3f4f6/d97706?text=Statistiques",
      delay: 0.4
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block p-4 rounded-full bg-yellow-50 mb-6">
                <Truck className="h-12 w-12 text-yellow-500 mx-auto" />
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
              Bajaj<span className="text-yellow-500">Sync</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              La solution complète pour la gestion de votre flotte de Bajaj. 
              Optimisez vos opérations, sécurisez vos revenus.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                to="/download"
                className="px-8 py-4 bg-yellow-500 text-white rounded-full font-bold text-lg shadow-xl hover:bg-yellow-600 transition-all transform hover:-translate-y-1"
              >
                Commencer maintenant
              </Link>
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition-all"
              >
                En savoir plus
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-yellow-600 font-semibold tracking-wide uppercase">Fonctionnalités</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Tout ce dont vous avez besoin
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-yellow-50 skew-y-3 transform origin-bottom-left -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Tarification Simple
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Choisissez la licence qui correspond à vos besoins.
            </p>
          </div>

          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="px-6 py-8 bg-gray-900 text-center">
              <h3 className="text-2xl font-bold text-white">Licence Pro</h3>
              <p className="mt-4 text-gray-400">Accès complet à toutes les fonctionnalités</p>
            </div>
            <div className="px-6 py-8">
              <div className="flex justify-center items-baseline">
                <span className="text-5xl font-extrabold text-gray-900">Contactez-nous</span>
              </div>
              <p className="mt-2 text-center text-gray-500">pour obtenir un devis personnalisé</p>
              
              <ul className="mt-8 space-y-4">
                {['Gestion illimitée de chauffeurs', 'Suivi en temps réel', 'Support prioritaire 7j/7', 'Mises à jour gratuites'].map((item) => (
                  <li key={item} className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-yellow-500 mr-3" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  to="/download"
                  className="block w-full bg-yellow-500 hover:bg-yellow-600 text-white text-center font-bold py-4 rounded-xl transition-colors shadow-lg"
                >
                  Télécharger l'application
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
                À propos de BajajSync
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                BajajSync est une solution innovante conçue pour moderniser le secteur du transport urbain. 
                Notre mission est d'apporter transparence et efficacité aux propriétaires de flottes.
              </p>
              <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-yellow-500">
                <p className="font-medium text-gray-900">
                  Développé avec passion par <span className="font-bold text-yellow-600">YoTech</span>, 
                  leader dans les solutions technologiques locales.
                </p>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 relative">
                <div className="absolute inset-0 bg-yellow-200 rounded-3xl transform rotate-3"></div>
                <img 
                    src="https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400/1f2937/FFFFFF?text=YoTech+Team" 
                    alt="YoTech Team" 
                    className="relative rounded-3xl shadow-lg w-full object-cover"
                />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Contactez-nous</h2>
            <p className="mt-4 text-xl text-gray-400">
              Une question ? Besoin d'assistance ? L'équipe YoTech est là pour vous.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-800 p-8 rounded-2xl text-center hover:bg-gray-750 transition-colors">
              <Mail className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Email</h3>
              <a href="mailto:contact@yotech.mg" className="text-gray-300 hover:text-white">contact@yotech.mg</a>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-2xl text-center hover:bg-gray-750 transition-colors">
              <Phone className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Téléphone 1</h3>
              <p className="text-gray-300">+261 34 00 000 00</p>
            </div>

            <div className="bg-gray-800 p-8 rounded-2xl text-center hover:bg-gray-750 transition-colors">
              <Phone className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Téléphone 2</h3>
              <p className="text-gray-300">+261 32 00 000 00</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
