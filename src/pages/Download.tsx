import { Download, AlertTriangle, CreditCard, Smartphone, ArrowLeft, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const DownloadPage = () => {
  const megaURL = "https://mega.nz/file/U2ZXkTYD#dfAXmLELiKjNjCrSSgAC5aToNGD7xgBPV97AOwSysYI";
  const facebookURL = "https://web.facebook.com/yotech14"; // Lien à ajuster si besoin

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-yellow-600 mb-8 transition-colors font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
        </Link>
        
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          {/* Header */}
          <div className="bg-yellow-500 px-8 py-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-5 pattern-grid-lg"></div>
            <div className="relative z-10">
                <div className="bg-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform rotate-3">
                    <Download className="h-10 w-10 text-yellow-600" />
                </div>
                <h1 className="text-3xl font-extrabold text-white sm:text-4xl mb-2">
                Télécharger BajajSync
                </h1>
                <p className="text-yellow-50 font-medium text-lg">
                Version 1.1.2 • Android
                </p>
            </div>
          </div>

          <div className="px-8 py-10 space-y-10">
            
            {/* Download Action */}
            <div className="text-center">
              <a href={megaURL} target="_blank" rel="noopener noreferrer">
                <button className="w-full sm:w-auto px-10 py-4 bg-gray-900 text-white rounded-xl font-bold text-lg shadow-xl hover:bg-gray-800 transition-all transform hover:-translate-y-1 flex items-center justify-center mx-auto gap-3">
                <Download className="h-6 w-6" />
                Télécharger l'APK
              </button>
              </a>
              <p className="mt-4 text-sm text-gray-500">
                Compatible avec Android 8.0 et versions ultérieures
              </p>
            </div>

            <hr className="border-gray-100" />

            {/* Steps */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <CheckCircle className="h-6 w-6 text-yellow-500 mr-2" />
                    Procédure d'activation
                </h2>
                <div className="space-y-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-yellow-100 text-yellow-600 font-bold">1</div>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Installation & Inscription</h3>
                            <p className="mt-1 text-gray-600">Installez l'application et créez votre compte directement depuis l'interface d'accueil sur votre mobile.</p>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-yellow-100 text-yellow-600 font-bold">2</div>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Activation de la licence</h3>
                            <p className="mt-1 text-gray-600">
                              Utilisez notre portail d'activation en ligne ou contactez directement YoTech pour valider votre accès.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* DEUX CHOIX D'ACTIVATION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/activate" className="group p-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl hover:border-yellow-500 transition-all">
                <ShieldCheck className="h-8 w-8 text-yellow-600 mb-3" />
                <h4 className="font-bold text-gray-900 mb-1 text-lg">Activation en ligne</h4>
                <p className="text-sm text-yellow-800/80 mb-4">Validez votre licence instantanément via notre formulaire sécurisé.</p>
                <span className="text-yellow-700 font-bold text-sm inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Accéder au portail <ArrowLeft className="h-4 w-4 rotate-180" />
                </span>
              </Link>

              <a href={facebookURL} target="_blank" rel="noopener noreferrer" className="group p-6 bg-blue-50 border-2 border-blue-100 rounded-2xl hover:border-blue-400 transition-all">
                <Smartphone className="h-8 w-8 text-blue-600 mb-3" />
                <h4 className="font-bold text-gray-900 mb-1 text-lg">Contacter YoTech</h4>
                <p className="text-sm text-blue-800/80 mb-4">Besoin d'aide ou paiement direct ? Envoyez un message à YoTech.</p>
                <span className="text-blue-700 font-bold text-sm inline-flex items-center gap-2">
                  Ouvrir la page YoTech <ExternalLink className="h-4 w-4" />
                </span>
              </a>
            </div>

            {/* Critical Warning */}
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-red-500" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-red-800">Attention : Liaison Appareil</h3>
                  <div className="mt-2 text-red-700 text-sm leading-relaxed">
                    <p className="mb-2">
                        Veuillez vous inscrire avec l'appareil que vous comptez utiliser quotidiennement.
                    </p>
                    <p>
                        Votre compte sera <strong>définitivement lié à l'identifiant unique de cet appareil</strong>. 
                        Pour changer d'appareil, une demande spécifique auprès de YoTech sera nécessaire.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Info */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center text-gray-600">
                    <CreditCard className="h-5 w-5 mr-3 text-gray-400" />
                    <span className="text-sm font-medium">Orange Money disponible</span>
                </div>
                <div className="flex items-center text-gray-600 font-bold">
                    <Smartphone className="h-5 w-5 mr-3 text-yellow-600" />
                    <span>Assistance : +261 38 22 093 67</span>
                </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DownloadPage;