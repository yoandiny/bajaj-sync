import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';
import {
    User as UserIcon, Lock, CreditCard, Save,
    AlertTriangle, Calendar, CheckCircle2, History,
    PauseCircle, Upload, Loader2, Sparkles,
    Gem, Zap, Phone, Hash, ArrowRight, TrendingUp
} from 'lucide-react';
import { fleetService } from '../../services/fleet.service';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';

const Profile = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'info' | 'security' | 'billing'>('info');

    // Profile State
    const [profileData, setProfileData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phone: user?.phone || '',
        email: user?.email || '',
        photoUrl: user?.photoUrl || '',
    });

    // Password State
    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    // Billing State
    const [transactions, setTransactions] = useState<any[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<'OM' | 'MVOLA'>('OM');
    const [paymentPhone, setPaymentPhone] = useState('');
    const [reference, setReference] = useState('');
    const [pricePerMonth, setPricePerMonth] = useState(25000);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Modals & Feedback
    const [showSuspendModal, setShowSuspendModal] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (activeTab === 'billing') {
            fetchHistory();
            fetchConfig();
        }
    }, [activeTab]);

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

    const fetchHistory = async () => {
        try {
            setLoadingHistory(true);
            const history = await authService.getPaymentHistory();
            setTransactions(history);
        } catch (err) {
            console.error("Erreur historique:", err);
        } finally {
            setLoadingHistory(false);
        }
    };

    const totalAmount = pricePerMonth;

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await fleetService.updateProfile(profileData);
            setSuccessMsg('Informations mises à jour avec succès.');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setErrorMsg("Erreur lors de la mise à jour du profil");
            setTimeout(() => setErrorMsg(''), 3000);
        } finally {
            setSubmitting(false);
        }
    };

    const handlePasswordUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            setErrorMsg("Les mots de passe ne correspondent pas.");
            setTimeout(() => setErrorMsg(''), 3000);
            return;
        }
        // API Call implementation would go here
        setSuccessMsg('Mot de passe modifié.');
        setPasswordData({ current: '', new: '', confirm: '' });
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMsg('');

        const period = `${String(selectedMonth).padStart(2, '0')}-${selectedYear}`;

        try {
            await authService.submitPayment({
                paymentPhone,
                reference,
                paymentMethod: paymentMethod === 'OM' ? 'Orange Money' : 'Mvola',
                amount: totalAmount,
                period: period,
                durationMonths: 1
            });
            setSuccessMsg('Paiement déclaré ! En attente de validation.');
            setPaymentPhone('');
            setReference('');
            fetchHistory();
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || "Erreur lors de la soumission");
            setTimeout(() => setErrorMsg(''), 3000);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSuspend = () => {
        // Implementation
        setShowSuspendModal(false);
        setSuccessMsg('Abonnement suspendu.');
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const hasActiveSubscription = user?.subscriptionUntil && new Date(user.subscriptionUntil) > new Date();

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Paramètres du Compte</h1>
                    <p className="text-gray-500 font-medium">Gérez vos informations personnelles et votre abonnement premium.</p>
                </div>
                {user?.role === 'OWNER' && (
                    <div className="flex items-center gap-3 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
                        <Gem className="text-yellow-600" size={20} />
                        <span className="text-sm font-black text-yellow-700 uppercase tracking-wider">Compte Propriétaire</span>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1.5 rounded-2xl w-fit border border-gray-200/50 shadow-sm">
                {[
                    { id: 'info', label: 'Profil', icon: UserIcon },
                    { id: 'security', label: 'Sécurité', icon: Lock },
                    ...(user?.role === 'OWNER' ? [{ id: 'billing', label: 'Abonnement & Factures', icon: CreditCard }] : [])
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                            ? 'bg-white text-gray-900 shadow-md ring-1 ring-black/5'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Messages Feedback */}
            <AnimatePresence>
                {(successMsg || errorMsg) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className={`px-6 py-4 rounded-2xl border flex items-center gap-3 font-bold shadow-lg ${successMsg ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                            }`}
                    >
                        {successMsg ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                        {successMsg || errorMsg}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden min-h-[500px]">
                {/* INFO TAB */}
                {activeTab === 'info' && (
                    <div className="p-8 md:p-12 space-y-10">
                        <div className="flex items-center gap-8 pb-10 border-b border-gray-100">
                            <div className="relative group">
                                <div className="w-28 h-28 rounded-[2rem] bg-gray-100 flex items-center justify-center border-4 border-white shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
                                    {profileData.photoUrl ? (
                                        <img src={profileData.photoUrl} alt="Profil" className="w-full h-full object-cover" />
                                    ) : (
                                        <UserIcon size={48} className="text-gray-300" />
                                    )}
                                </div>
                                <label className="absolute -bottom-2 -right-2 bg-gray-900 hover:bg-black text-white p-2.5 rounded-2xl cursor-pointer shadow-xl transition-all hover:scale-110 active:scale-90 ring-4 ring-white">
                                    <Upload size={18} />
                                    <input
                                        type="file" className="hidden" accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                try {
                                                    setSubmitting(true);
                                                    const url = await fleetService.uploadFile(file, 'profiles');
                                                    setProfileData({ ...profileData, photoUrl: url });
                                                } catch (err) {
                                                    setErrorMsg("Erreur lors de l'upload");
                                                } finally {
                                                    setSubmitting(false);
                                                }
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 mb-1">Photo de profil</h3>
                                <p className="text-gray-500 font-medium">Format JPEG ou PNG. Max 5Mo.</p>
                                {profileData.photoUrl && (
                                    <button
                                        type="button"
                                        onClick={() => setProfileData({ ...profileData, photoUrl: '' })}
                                        className="mt-2 text-red-500 text-xs font-bold hover:underline"
                                    >
                                        Supprimer la photo
                                    </button>
                                )}
                            </div>
                        </div>

                        <form onSubmit={handleProfileUpdate} className="space-y-8 max-w-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Prénom</label>
                                    <input
                                        type="text" value={profileData.firstName} onChange={e => setProfileData({ ...profileData, firstName: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Nom</label>
                                    <input
                                        type="text" value={profileData.lastName} onChange={e => setProfileData({ ...profileData, lastName: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
                                    <input
                                        type="email" value={profileData.email} onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Téléphone</label>
                                    <input
                                        type="tel" value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit" disabled={submitting}
                                className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-black transition-all flex items-center gap-3 shadow-xl shadow-gray-900/20 disabled:opacity-50 active:scale-95"
                            >
                                {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                Enregistrer les modifications
                            </button>
                        </form>
                    </div>
                )}

                {/* SECURITY TAB */}
                {activeTab === 'security' && (
                    <div className="p-8 md:p-12">
                        <div className="max-w-xl space-y-8">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 mb-2">Changer le mot de passe</h3>
                                <p className="text-gray-500 font-medium">Assurez-vous d'utiliser un mot de passe fort pour protéger votre accès.</p>
                            </div>
                            <form onSubmit={handlePasswordUpdate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Mot de passe actuel</label>
                                    <input
                                        type="password" required
                                        value={passwordData.current} onChange={e => setPasswordData({ ...passwordData, current: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Nouveau mot de passe</label>
                                    <input
                                        type="password" required
                                        value={passwordData.new} onChange={e => setPasswordData({ ...passwordData, new: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Confirmer le nouveau mot de passe</label>
                                    <input
                                        type="password" required
                                        value={passwordData.confirm} onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all"
                                    />
                                </div>
                                <button type="submit" className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-black transition-all flex items-center gap-3 shadow-xl shadow-gray-900/20 active:scale-95">
                                    <Lock size={20} />
                                    Mettre à jour le mot de passe
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* BILLING TAB */}
                {activeTab === 'billing' && user?.role === 'OWNER' && (
                    <div className="p-8 md:p-12 space-y-12">
                        {/* Status Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className={`col-span-1 md:col-span-2 p-8 rounded-[2rem] border relative overflow-hidden flex flex-col justify-between min-h-[180px] ${hasActiveSubscription ? 'bg-green-500/5 border-green-500/20 text-green-900' : 'bg-red-500/5 border-red-500/20 text-red-900'
                                }`}>
                                <Zap className={`absolute -right-8 -bottom-8 w-40 h-40 opacity-10 ${hasActiveSubscription ? 'text-green-500' : 'text-red-500'}`} />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`p-2 rounded-xl scale-90 ${hasActiveSubscription ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                            <CreditCard size={20} />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest opacity-60">Statut de l'abonnement</span>
                                    </div>
                                    <h3 className="text-3xl font-black mb-1">
                                        {hasActiveSubscription ? 'Premium Actif' : 'Abonnement Expiré'}
                                    </h3>
                                    <p className="text-sm font-bold opacity-70">
                                        {hasActiveSubscription
                                            ? `Prochaine échéance le ${new Date(user!.subscriptionUntil!).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`
                                            : 'Votre accès est restreint. Réactivez votre compte pour continuer.'}
                                    </p>
                                </div>
                                {hasActiveSubscription && (
                                    <button
                                        onClick={() => setShowSuspendModal(true)}
                                        className="w-fit text-xs font-black uppercase tracking-widest text-red-600 hover:text-red-700 transition-colors mt-6 flex items-center gap-1"
                                    >
                                        <PauseCircle size={14} /> Suspendre mon accès
                                    </button>
                                )}
                            </div>

                            <div className="bg-gray-900 rounded-[2rem] p-8 text-white relative overflow-hidden flex flex-col justify-center">
                                <Sparkles className="absolute right-[-10px] top-[-10px] text-white/10 w-24 h-24" />
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Support Premium</p>
                                <p className="text-lg font-bold leading-tight">Besoin d'aide pour votre paiement ?</p>
                                <a href="tel:0376872782" className="mt-4 flex items-center gap-3 text-yellow-500 font-black group">
                                    <div className="p-2 bg-yellow-500/20 rounded-lg group-hover:scale-110 transition-transform">
                                        <Phone size={18} />
                                    </div>
                                    037 68 727 82
                                </a>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            {/* NEW Payment Form */}
                            <div className="lg:col-span-7 space-y-8">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                                            <TrendingUp size={24} className="text-yellow-500" />
                                            Renouveler mon accès
                                        </h3>
                                        <p className="text-gray-500 font-medium">Déclarez votre paiement mensuel pour maintenir l'accès.</p>
                                    </div>

                                    <form onSubmit={handlePaymentSubmit} className="space-y-8 bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">


                                        {/* Month Selector */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Mois concerné</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="relative">
                                                    <select
                                                        value={selectedMonth}
                                                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                                        className="w-full px-4 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-yellow-500 transition-all font-bold text-gray-900 shadow-sm appearance-none cursor-pointer"
                                                    >
                                                        {[
                                                            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                                                            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
                                                        ].map((m, i) => (
                                                            <option key={i + 1} value={i + 1}>{m}</option>
                                                        ))}
                                                    </select>
                                                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                                </div>
                                                <div className="relative">
                                                    <select
                                                        value={selectedYear}
                                                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                                        className="w-full px-4 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-yellow-500 transition-all font-bold text-gray-900 shadow-sm appearance-none cursor-pointer"
                                                    >
                                                        {[new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1].map(y => (
                                                            <option key={y} value={y}>{y}</option>
                                                        ))}
                                                    </select>
                                                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment Selector */}
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    type="button" onClick={() => setPaymentMethod('OM')}
                                                    className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-3 ${paymentMethod === 'OM'
                                                        ? 'border-orange-500 bg-orange-50'
                                                        : 'border-white bg-white hover:border-gray-200'
                                                        }`}
                                                >
                                                    <img src="https://approcarte.orange.mg/assets/images/ico-orangemoney.jpg" className="h-5 rounded" alt="OM" />
                                                    <span className={`font-bold text-sm ${paymentMethod === 'OM' ? 'text-orange-700' : 'text-gray-500'}`}>Orange Money</span>
                                                </button>
                                                <button
                                                    type="button" onClick={() => setPaymentMethod('MVOLA')}
                                                    className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-3 ${paymentMethod === 'MVOLA'
                                                        ? 'border-yellow-500 bg-yellow-50'
                                                        : 'border-white bg-white hover:border-gray-200'
                                                        }`}
                                                >
                                                    <img src="https://www.mvola.mg/wp-content/themes/mvola/assets/images/logo-mvola.png" className="h-4" alt="MVOLA" />
                                                    <span className={`font-bold text-sm ${paymentMethod === 'MVOLA' ? 'text-yellow-700' : 'text-gray-500'}`}>Mvola</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Input Fields */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Numéro de dépôt</label>
                                                <div className="relative group">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors" size={18} />
                                                    <input
                                                        type="text" required value={paymentPhone} onChange={(e) => setPaymentPhone(e.target.value)}
                                                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-yellow-500 transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-sm"
                                                        placeholder="03x xx xxx xx"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">ID Transaction (SMS)</label>
                                                <div className="relative group">
                                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors" size={18} />
                                                    <input
                                                        type="text" required value={reference} onChange={(e) => setReference(e.target.value)}
                                                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-yellow-500 transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-sm"
                                                        placeholder="Référence transaction"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Submit Wrapper */}
                                        <div className="p-6 bg-yellow-500 rounded-3xl mt-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-[#0f172a] font-bold text-[10px] uppercase tracking-widest opacity-60">Paiement mensuel — 1 Mois</p>
                                                    <h4 className="text-2xl font-black text-[#0f172a]">
                                                        {new Intl.NumberFormat('fr-FR').format(totalAmount)} Ar
                                                    </h4>
                                                </div>
                                                <button
                                                    type="submit" disabled={submitting}
                                                    className="bg-[#0f172a] text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-70 disabled:scale-100 shadow-xl"
                                                >
                                                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <><ArrowRight size={20} /></>}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Real History */}
                            <div className="lg:col-span-5 space-y-6">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                                        <History size={24} className="text-gray-400" />
                                        Historique des paiements
                                    </h3>
                                    <p className="text-gray-500 font-medium">Suivez l'état de vos demandes.</p>
                                </div>
                                <div className="bg-gray-50 rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
                                    <div className="max-h-[500px] overflow-y-auto divide-y divide-gray-100 scrollbar-hide p-4">
                                        {loadingHistory ? (
                                            <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-gray-300" size={32} /></div>
                                        ) : transactions.length > 0 ? (
                                            transactions.map((tx) => (
                                                <div key={tx.id} className="p-5 bg-white mb-3 first:mt-0 last:mb-0 rounded-2xl shadow-sm border border-gray-100 hover:border-yellow-500/30 transition-colors flex justify-between items-center group">
                                                    <div>
                                                        <p className="font-black text-gray-900">{tx.period || 'Mois indéfini'}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Calendar size={12} className="text-gray-400" />
                                                            <span className="text-[10px] font-bold text-gray-500">{new Date(tx.date).toLocaleDateString('fr-FR')}</span>
                                                            <div className="w-1 h-1 bg-gray-300 rounded-full" />
                                                            <span className="text-[10px] font-black text-gray-400">{tx.method}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-black text-sm text-gray-900">{(tx.amount ?? 0).toLocaleString()} Ar</p>
                                                        <div className={`text-[9px] font-black uppercase mt-1 px-2 py-0.5 rounded-full inline-block ${tx.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                            tx.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            {tx.status === 'APPROVED' ? 'Validé' : tx.status === 'PENDING' ? 'En attente' : 'Rejeté'}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-12 text-center flex flex-col items-center gap-4">
                                                <div className="p-4 bg-gray-100 rounded-full text-gray-300"><History size={32} /></div>
                                                <p className="text-gray-400 font-bold text-sm italic">Aucun paiement enregistré pour le moment.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={showSuspendModal}
                onClose={() => setShowSuspendModal(false)}
                onConfirm={handleSuspend}
                title="Suspendre l'abonnement"
                message="Êtes-vous sûr de vouloir suspendre votre abonnement ? L'accès à vos données sera restreint jusqu'à la réactivation."
                confirmText="Confirmer la suspension"
                type="danger"
            />
        </div>
    );
};

export default Profile;
