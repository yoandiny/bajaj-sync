import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import { motion } from 'framer-motion';
import {
    CreditCard, Info, CheckCircle, AlertCircle, Phone,
    Hash, ArrowRight, LogOut, ShieldCheck, Sparkles,
    Zap, Gem, RefreshCcw
} from 'lucide-react';
import Logo from '../assets/logo.png';

const PaymentDashboard = () => {
    const [paymentPhone, setPaymentPhone] = useState('');
    const [reference, setReference] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'OM' | 'MVOLA'>('OM');
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState('50 000');
    const [error, setError] = useState('');
    const { logout } = useAuth();

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const config = await authService.getConfig();
                if (config.licence_monthly_price) {
                    const formatted = new Intl.NumberFormat('fr-FR').format(parseInt(config.licence_monthly_price));
                    setPrice(formatted);
                }
            } catch (err) {
                console.error("Erreur config:", err);
            }
        };
        fetchConfig();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.submitPayment({
                paymentPhone,
                reference,
                paymentMethod: paymentMethod === 'OM' ? 'Orange Money' : 'Mvola'
            });
            window.location.href = '/waiting';
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Erreur lors de la soumission");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 py-12 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl relative z-10"
            >
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden">
                    {/* Header Section */}
                    <div className="p-8 md:p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-500/20 to-transparent pointer-events-none" />

                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="inline-flex p-4 bg-yellow-500 rounded-3xl shadow-xl shadow-yellow-500/20 mb-6"
                        >
                            <Gem className="text-white" size={32} />
                        </motion.div>

                        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Activation Premium</h1>
                        <p className="text-gray-400 font-medium">Libérez tout le potentiel de votre flotte avec BajajSync</p>

                        <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
                            <span className="text-3xl font-black text-yellow-500">{price} Ar</span>
                            <span className="text-gray-500 font-bold">/ mois</span>
                        </div>
                    </div>

                    <div className="p-8 md:p-12 pt-0">
                        {/* Info Box */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group mb-8">
                            <Zap className="absolute right-[-10px] bottom-[-10px] text-white/10 w-32 h-32 group-hover:scale-110 transition-transform" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                                        <Info size={20} />
                                    </div>
                                    <p className="font-bold">Instructions de dépôt</p>
                                </div>
                                <p className="text-blue-100 text-sm leading-relaxed mb-4">
                                    Effectuez un transfert de <span className="font-bold text-white underline">{price} Ar</span> au numéro :
                                </p>
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Phone size={18} className="text-yellow-400" />
                                        <span className="text-xl font-black tracking-wider">037 68 727 82</span>
                                    </div>
                                    <div className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-blue-200 bg-blue-900/30 px-3 py-1 rounded-lg">
                                        YoTech Official
                                    </div>
                                </div>
                                <p className="text-[10px] text-blue-200 mt-3 font-bold flex items-center gap-1">
                                    <ShieldCheck size={12} /> Nom du compte : DINY Fondàna Yoan
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-medium"
                                >
                                    <AlertCircle size={20} />
                                    {error}
                                </motion.div>
                            )}

                            <div className="space-y-6">
                                {/* Payment Method Selector */}
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-400 ml-1 flex items-center gap-2">
                                        <CreditCard size={14} /> Choisir votre opérateur
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('OM')}
                                            className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'OM'
                                                    ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/10'
                                                    : 'border-white/5 bg-white/5 hover:border-white/20'
                                                }`}
                                        >
                                            <div className="h-8 flex items-center">
                                                <img src="https://approcarte.orange.mg/assets/images/ico-orangemoney.jpg" className="h-6 rounded-md" alt="OM" />
                                            </div>
                                            <span className={`text-xs font-bold ${paymentMethod === 'OM' ? 'text-orange-500' : 'text-gray-500'}`}>Orange Money</span>
                                            {paymentMethod === 'OM' && <CheckCircle className="text-orange-500 mt-1" size={16} />}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('MVOLA')}
                                            className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'MVOLA'
                                                    ? 'border-yellow-500 bg-yellow-500/10 shadow-lg shadow-yellow-500/10'
                                                    : 'border-white/5 bg-white/5 hover:border-white/20'
                                                }`}
                                        >
                                            <div className="h-8 flex items-center">
                                                <img src="https://www.mvola.mg/wp-content/themes/mvola/assets/images/logo-mvola.png" className="h-4" alt="MVOLA" />
                                            </div>
                                            <span className={`text-xs font-bold ${paymentMethod === 'MVOLA' ? 'text-yellow-500' : 'text-gray-500'}`}>Mvola</span>
                                            {paymentMethod === 'MVOLA' && <CheckCircle className="text-yellow-500 mt-1" size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-400 ml-1">Numéro de dépôt</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-500 transition-colors" size={20} />
                                            <input
                                                type="text"
                                                value={paymentPhone}
                                                onChange={(e) => setPaymentPhone(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-all font-medium text-white placeholder:text-gray-600"
                                                placeholder="03x xx xxx xx"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-400 ml-1">ID Transaction</label>
                                        <div className="relative group">
                                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-500 transition-colors" size={20} />
                                            <input
                                                type="text"
                                                value={reference}
                                                onChange={(e) => setReference(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-all font-medium text-white placeholder:text-gray-600"
                                                placeholder="Référence par SMS"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-yellow-500 text-[#0f172a] py-5 rounded-3xl font-black text-xl hover:bg-yellow-400 transition-all shadow-2xl shadow-yellow-500/20 flex items-center justify-center gap-3 group disabled:opacity-70"
                            >
                                {loading ? (
                                    <RefreshCcw className="animate-spin" size={24} />
                                ) : (
                                    <>
                                        Activer mon compte <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 mt-4">
                            <button
                                onClick={() => logout()}
                                className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 font-bold text-sm"
                            >
                                <LogOut size={16} /> Se déconnecter
                            </button>

                            <div className="flex items-center gap-4">
                                <img src={Logo} alt="YoTech" className="h-6 opacity-30 grayscale hover:opacity-100 transition-all" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                        <Sparkles size={12} className="text-yellow-500/50" /> Propulsé par YoTech Digital Solutions <Sparkles size={12} className="text-yellow-500/50" />
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentDashboard;
