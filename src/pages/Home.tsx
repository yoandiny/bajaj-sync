import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Users, Car, Wallet, BarChart3, Mail, Phone, CheckCircle2, Laptop, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import FeatureCard from '../components/FeatureCard';
import Logo from '../assets/logo.png';
import Drivers from '../assets/drivers.png';
import Bajaj from '../assets/bajaj.png';
import Income from '../assets/income.png';
import Dashboard from '../assets/dashboard.png';
import Expense from '../assets/expense.png';

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
      imageSrc: Drivers,
      delay: 0.1
    },
    {
      title: "Gestion de la Flotte",
      description: "Gardez un œil sur l'état de vos véhicules (Bajaj, Taxi, Moto). Maintenance, disponibilité et assignation simplifiées pour tout type de transport.",
      icon: Car,
      imageSrc: Bajaj,
      delay: 0.2
    },
    {
      title: "Gestion des Versements",
      description: "Une transparence totale sur vos revenus. Suivez chaque versement, les recettes journalières et les paiements en attente par véhicule.",
      icon: Wallet,
      imageSrc: Income,
      delay: 0.3
    },
    {
      title: "Gestion des Dépenses",
      description: "Maîtrisez vos coûts opérationnels. Suivez chaque transaction, de l'entretien mécanique aux frais administratifs.",
      icon: Wallet,
      imageSrc: Expense,
      delay: 0.4
    },
    {
      title: "Statistiques Générales",
      description: "Des tableaux de bord détaillés pour analyser la croissance de votre activité. Prenez les bonnes décisions basées sur des données fiables.",
      icon: BarChart3,
      imageSrc: Dashboard,
      delay: 0.5
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
                <img className="h-20 w-20 md:h-24 md:w-24" src={Logo} alt="BajajSync Logo" />
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
              Bajaj<span className="text-yellow-500">Sync</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 leading-relaxed">
              La solution complète <span className="font-bold text-gray-900">Mobile & Web</span> pour la gestion de votre flotte de transport. 
              Centralisez vos opérations, du chauffeur au bureau.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 text-sm font-bold text-gray-600 uppercase tracking-widest">
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                    <Smartphone size={18} className="text-yellow-500" />
                    App Android
                </div>
                <div className="hidden sm:block text-gray-300">•</div>
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                    <Laptop size={18} className="text-yellow-500" />
                    Plateforme Web SaaS
                </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/download"
                className="px-8 py-4 bg-yellow-500 text-white rounded-full font-bold text-lg shadow-xl hover:bg-yellow-600 transition-all transform hover:-translate-y-1"
              >
                Télécharger l'App
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-lg shadow-xl hover:bg-black transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Accès Gérant
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Web Platform Promo Section */}
      <section className="py-20 bg-gray-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-yellow-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                <div className="mb-10 lg:mb-0">
                    <h2 className="text-3xl font-extrabold sm:text-4xl mb-6">
                        Nouveau : Gérez tout depuis votre bureau
                    </h2>
                    <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                        Pour les propriétaires de flotte et les gérants, découvrez notre nouvelle interface web. 
                        Plus besoin de votre téléphone pour tout contrôler.
                    </p>
                    <ul className="space-y-4 mb-8">
                        {[
                            'Gestion multi-sites et bureaux',
                            'Création de comptes Managers',
                            'Vue d\'ensemble sur grand écran',
                            'Export des rapports financiers',
                            'Suivi GPS en temps réel (Bientôt)'
                        ].map((item, i) => (
                            <li key={i} className="flex items-center">
                                <div className="bg-yellow-500 rounded-full p-1 mr-3">
                                    <CheckCircle2 size={14} className="text-gray-900" />
                                </div>
                                <span className="font-medium">{item}</span>
                            </li>
                        ))}
                    </ul>
                    <Link to="/login" className="inline-flex items-center text-yellow-400 font-bold hover:text-yellow-300 transition-colors">
                        Accéder à la démo <Laptop size={18} className="ml-2" />
                    </Link>
                </div>
                <div className="relative">
                     {/* Abstract Browser Window */}
                    <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
                        <div className="bg-gray-700 px-4 py-3 flex items-center gap-2 border-b border-gray-600">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="p-1">
                            <img src={Dashboard} alt="Interface Web" className="w-full rounded-lg opacity-90" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-yellow-600 font-semibold tracking-wide uppercase">Fonctionnalités</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Tout ce dont vous avez besoin pour votre flotte
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
              Offre de Lancement Exclusive
            </h2>
            <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
              Rejoignez la révolution <span className="text-yellow-600 font-bold">BajajSync</span> dès aujourd'hui et profitez de notre tarif préférentiel multi-véhicules.
            </p>
          </div>

          <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-yellow-500 relative">
            <div className="absolute top-5 right-[-35px] bg-red-600 text-white font-bold py-1 px-12 rotate-45 shadow-md">
              OFFRE LIMITÉE
            </div>

            <div className="px-6 py-10 bg-gray-900 text-center">
              <span className="px-4 py-1 bg-yellow-500 text-gray-900 text-xs font-black rounded-full uppercase tracking-widest">
                Lancement YoTech
              </span>
              <h3 className="text-3xl font-bold text-white mt-4">Licence Complète</h3>
              <p className="mt-2 text-gray-400">Accès illimité à tous les outils de gestion</p>
            </div>

            <div className="px-6 py-10">
              <div className="text-center mb-8">
                <div className="inline-block bg-red-50 text-red-700 text-sm font-bold px-4 py-2 rounded-lg mb-4 border border-red-100">
                  ⏱️ Expire dans les 15 prochains jours
                </div>
                <div className="flex justify-center items-center">
                  <span className="text-6xl font-extrabold text-gray-900">50.000 Ar</span>
                </div>
                <p className="text-gray-500 mt-4 italic">
                  Tarif unique sans abonnement mensuel
                </p>
              </div>
              
              <ul className="space-y-4 mb-10">
                {[
                  'Gestion illimitée de véhicules et chauffeurs',
                  'Suivi précis des versements quotidiens',
                  'Contrôle total des dépenses et maintenance',
                  'Tableaux de bord et Statistiques avancées',
                  'Support prioritaire YoTech 7j/7',
                  'Mises à jour incluses'
                ].map((item) => (
                  <li key={item} className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/download"
                className="block w-full bg-yellow-500 hover:bg-yellow-600 text-white text-center font-bold py-5 rounded-2xl transition-all shadow-lg hover:shadow-yellow-200 transform hover:-translate-y-1"
              >
                OBTENIR MA LICENCE MAINTENANT
              </Link>
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
                BajajSync est une solution innovante conçue pour moderniser la gestion du transport urbain. 
                Que vous possédiez des Bajaj, des taxis ou des motos, notre mission est d'apporter transparence 
                et rentabilité à votre activité de versement.
              </p>
              <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-yellow-500">
                <p className="font-medium text-gray-900">
                  Développé avec passion par <span className="font-bold text-yellow-600">YoTech</span>, 
                  votre partenaire local en solutions technologiques.
                </p>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 relative">
                <div className="absolute inset-0 bg-yellow-200 rounded-3xl transform rotate-3"></div>
                <img 
                    src="https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400/1f2937/FFFFFF?text=YoTech+Gestion+Flotte" 
                    alt="YoTech Team" 
                    className="relative rounded-3xl shadow-lg w-full object-cover"
                />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section reste identique... */}
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
              <a href="mailto:yoan@yotech.mg" className="text-gray-300 hover:text-white">yoan@yotech.mg</a>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-2xl text-center hover:bg-gray-750 transition-colors">
              <Phone className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Téléphone 1</h3>
              <p className="text-gray-300">+261 37 68 727 82</p>
            </div>

            <div className="bg-gray-800 p-8 rounded-2xl text-center hover:bg-gray-750 transition-colors">
              <Phone className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Téléphone 2</h3>
              <p className="text-gray-300">+261 38 22 093 67</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
