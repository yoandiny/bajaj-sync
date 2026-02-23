import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Clock, MessageCircle, LogOut, ArrowLeft, ShieldAlert } from 'lucide-react';
import Logo from '../assets/logo.png';

const WaitingApproval = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 text-center"
            >
                <div className="bg-yellow-500 p-8 flex justify-center">
                    <div className="p-4 bg-white rounded-3xl shadow-lg ring-8 ring-yellow-400/50">
                        <Clock className="text-yellow-600 animate-pulse" size={48} />
                    </div>
                </div>

                <div className="p-10 space-y-6">
                    <h1 className="text-3xl font-bold text-gray-900">Validation en cours</h1>
                    <div className="space-y-4">
                        <p className="text-gray-600 leading-relaxed font-medium">
                            Bonjour <span className="text-gray-900 font-bold">{user?.firstName}</span>,
                        </p>
                        <p className="text-gray-500 leading-relaxed">
                            Votre demande d'activation pour <span className="font-bold text-gray-800">BajajSync</span> a bien été reçue.
                            Nos équipes YoTech procèdent actuellement à la vérification de votre paiement.
                        </p>
                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-blue-700 text-sm font-medium flex items-center gap-3">
                            <ShieldAlert size={20} className="shrink-0" />
                            <span>L'activation prend généralement moins de 15 minutes durant les heures d'ouverture.</span>
                        </div>
                    </div>

                    <div className="pt-6 space-y-3">
                        <a
                            href="https://wa.me/261376872782" // Remplacer par vrai numéro YoTech
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                        >
                            <MessageCircle size={24} /> Contacter YoTech via WhatsApp
                        </a>

                        <button
                            onClick={logout}
                            className="w-full bg-white text-gray-500 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 border border-gray-100"
                        >
                            <LogOut size={20} /> Se déconnecter
                        </button>
                    </div>

                    <div className="pt-6 flex justify-center">
                        <img src={Logo} alt="YoTech Logo" className="h-8 opacity-20 grayscale" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default WaitingApproval;
