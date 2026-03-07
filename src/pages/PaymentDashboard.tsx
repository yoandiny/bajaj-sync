import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import { motion } from 'framer-motion';
import {
    Info, CheckCircle, AlertCircle, Phone,
    Hash, ArrowRight, LogOut, ShieldCheck, Sparkles,
    Gem, RefreshCcw, Clock
} from 'lucide-react';
import Logo from '../assets/logo.png';

const PLANS = [
    { months: 1, label: '1 Mois', discount: 0 },
    { months: 3, label: '3 Mois', discount: 5 },
    { months: 6, label: '6 Mois', discount: 10 },
    { months: 12, label: '12 Mois', discount: 20 },
];

const PaymentDashboard = () => {
    const { user, logout } = useAuth();
    const [paymentPhone, setPaymentPhone] = useState('');
    const [reference, setReference] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'OM' | 'MVOLA'>('OM');
    const [selectedPlan, setSelectedPlan] = useState(PLANS[0]);
    const [loading, setLoading] = useState(false);
    const [pricePerMonth, setPricePerMonth] = useState(25000);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const config = await authService.getConfig();
                if (config.licence_monthly_price) {
                    setPricePerMonth(parseInt(config.licence_monthly_price));
                }
            } catch (err) {
                console.error("Erreur config:", err);
            }
        };
        fetchConfig();
    }, []);

    const totalAmount = Math.round(pricePerMonth * selectedPlan.months * (1 - selectedPlan.discount / 100));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Calculer la période (Mois actuel et année)
        const now = new Date();
        const period = `${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;

        try {
            await authService.submitPayment({
                paymentPhone,
                reference,
                paymentMethod: paymentMethod === 'OM' ? 'Orange Money' : 'Mvola',
                amount: totalAmount,
                period: period,
                durationMonths: selectedPlan.months
            });
            setSuccess(true);
            setTimeout(() => {
                window.location.href = '/waiting';
            }, 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Erreur lors de la soumission");
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/5 backdrop-blur-2xl border border-green-500/20 p-12 rounded-[3rem] text-center max-w-md"
                >
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
                        <CheckCircle className="text-white" size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4">Paiement Envoyé !</h2>
                    <p className="text-gray-400 font-medium leading-relaxed">
                        Votre demande est en cours de vérification par notre équipe. Vous allez être redirigé...
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 py-12 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-yellow-500/10 blur-[150px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
                {/* Left Side: Info & Status */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 h-full flex flex-col justify-between">
                        <div>
                            <div className="inline-flex p-3 bg-yellow-500 rounded-2xl shadow-lg shadow-yellow-500/20 mb-6">
                                <Gem className="text-white" size={24} />
                            </div>
                            <h1 className="text-3xl font-black text-white mb-2 leading-tight">
                                BajajSync <span className="text-yellow-500">Premium</span>
                            </h1>
                            <p className="text-gray-400 font-medium mb-8">
                                Gérez votre activité sans limites et avec une sérénité totale.
                            </p>

                            {/* Status Card */}
                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Clock size={16} className="text-yellow-500" />
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Statut Actuel</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-black text-white">
                                            {user?.subscriptionUntil ? 'Abonné' : 'Non activé'}
                                        </span>
                                        {user?.subscriptionUntil && (
                                            <span className="text-[10px] font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded-md">
                                                Jusqu'au {new Date(user.subscriptionUntil).toLocaleDateString('fr-FR')}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/20 rounded-2xl relative overflow-hidden group">
                                    <ShieldCheck className="absolute -right-4 -bottom-4 text-blue-500/10 w-24 h-24" />
                                    <h4 className="text-sm font-bold text-blue-400 mb-1">Garantie YoTech</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                        Vos transactions sont sécurisées et vérifiées manuellement sous 2h ouvrables.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 mt-8 border-t border-white/5">
                            <div className="flex items-center gap-4">
                                <img src={Logo} alt="YoTech" className="h-6 opacity-30 grayscale" />
                                <div className="h-4 w-px bg-white/10" />
                                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Version 2.0</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Payment Form */}
                <div className="lg:col-span-7">
                    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden h-full">
                        <div className="p-8 md:p-10">
                            {/* Plan Selection */}
                            <div className="mb-8">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 block ml-1">
                                    1. Choisissez votre forfait
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {PLANS.map((plan) => (
                                        <button
                                            key={plan.months}
                                            type="button"
                                            onClick={() => setSelectedPlan(plan)}
                                            className={`relative p-4 rounded-2xl border-2 transition-all text-center group ${selectedPlan.months === plan.months
                                                ? 'border-yellow-500 bg-yellow-500/10'
                                                : 'border-white/5 bg-white/5 hover:border-white/20'
                                                }`}
                                        >
                                            <div className={`text-xl font-black mb-1 ${selectedPlan.months === plan.months ? 'text-white' : 'text-gray-400'}`}>
                                                {plan.label}
                                            </div>
                                            {plan.discount > 0 && (
                                                <div className="absolute -top-2 -right-2 bg-green-500 text-[#0f172a] text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg">
                                                    -{plan.discount}%
                                                </div>
                                            )}
                                            <div className={`text-[10px] font-bold ${selectedPlan.months === plan.months ? 'text-yellow-500' : 'text-gray-600'}`}>
                                                {plan.months === 1 ? 'Standard' : 'Économisez'}
                                            </div>
                                        </button>
                                    ))}
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

                                {/* Payment Method */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">
                                        2. Opérateur de paiement
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('OM')}
                                            className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-3 ${paymentMethod === 'OM'
                                                ? 'border-orange-500 bg-orange-500/10'
                                                : 'border-white/5 bg-white/5 hover:border-white/10'
                                                }`}
                                        >
                                            <img src="https://approcarte.orange.mg/assets/images/ico-orangemoney.jpg" className="h-5 rounded" alt="OM" />
                                            <span className={`font-bold text-sm ${paymentMethod === 'OM' ? 'text-white' : 'text-gray-500'}`}>Orange Money</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('MVOLA')}
                                            className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-3 ${paymentMethod === 'MVOLA'
                                                ? 'border-yellow-500 bg-yellow-500/10'
                                                : 'border-white/5 bg-white/5 hover:border-white/10'
                                                }`}
                                        >
                                            <img src="https://www.mvola.mg/wp-content/themes/mvola/assets/images/logo-mvola.png" className="h-4" alt="MVOLA" />
                                            <span className={`font-bold text-sm ${paymentMethod === 'MVOLA' ? 'text-white' : 'text-gray-500'}`}>Mvola</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Numéro de dépôt</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-yellow-500 transition-colors" size={18} />
                                            <input
                                                type="text"
                                                value={paymentPhone}
                                                onChange={(e) => setPaymentPhone(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-all font-bold text-white placeholder:text-gray-700"
                                                placeholder="03x xx xxx xx"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">ID Transaction (SMS)</label>
                                        <div className="relative group">
                                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-yellow-500 transition-colors" size={18} />
                                            <input
                                                type="text"
                                                value={reference}
                                                onChange={(e) => setReference(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-all font-bold text-white placeholder:text-gray-700"
                                                placeholder="Référence transaction"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Total Section */}
                                <div className="p-6 bg-yellow-500 rounded-3xl relative overflow-hidden">
                                    <Sparkles className="absolute right-[-10px] top-[-10px] text-white/20 w-24 h-24" />
                                    <div className="flex items-center justify-between relative z-10">
                                        <div>
                                            <p className="text-[#0f172a] font-bold text-xs uppercase tracking-widest opacity-60">Total à payer</p>
                                            <h3 className="text-3xl font-black text-[#0f172a]">
                                                {new Intl.NumberFormat('fr-FR').format(totalAmount)} Ar
                                            </h3>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-[#0f172a] text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-70 disabled:scale-100"
                                        >
                                            {loading ? <RefreshCcw className="animate-spin" size={20} /> : (
                                                <>Valider <ArrowRight size={20} /></>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <div className="mt-8 flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                                <Info size={16} className="text-blue-400 mt-1 shrink-0" />
                                <div className="text-[10px] text-gray-450 font-medium leading-relaxed">
                                    Envoyez le montant exact au <span className="text-white font-bold">037 68 727 82</span> (DINY Fondàna Yoan).
                                    Une fois validé, votre accès sera automatiquement étendu de <span className="text-yellow-500 font-bold">{selectedPlan.label}</span>.
                                </div>
                            </div>

                            <button
                                onClick={() => logout()}
                                className="mt-8 text-gray-600 hover:text-white transition-colors flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"
                            >
                                <LogOut size={14} /> Se déconnecter
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentDashboard;

