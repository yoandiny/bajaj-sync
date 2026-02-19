import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, SubscriptionTransaction } from '../../types';
import { MOCK_SUBSCRIPTION_TRANSACTIONS } from '../../data/mock';
import { User as UserIcon, Lock, CreditCard, Save, AlertTriangle, Calendar, CheckCircle2, History, PauseCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { generateUUID } from '../../lib/utils';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'billing'>('info');
  
  // Profile State
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Billing State
  const [transactions, setTransactions] = useState<SubscriptionTransaction[]>(
    MOCK_SUBSCRIPTION_TRANSACTIONS.filter(t => t.userId === user?.id)
  );
  const [isSubscribed, setIsSubscribed] = useState(true); // Mock status
  const [paymentForm, setPaymentForm] = useState({
    method: 'ORANGE_MONEY',
    reference: '',
    amount: 50000
  });

  // Modals
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // API Call would go here
    setSuccessMsg('Informations mises à jour avec succès.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
        alert("Les mots de passe ne correspondent pas.");
        return;
    }
    // API Call
    setSuccessMsg('Mot de passe modifié.');
    setPasswordData({ current: '', new: '', confirm: '' });
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTx: SubscriptionTransaction = {
        id: generateUUID(),
        userId: user?.id || '',
        date: new Date().toISOString().split('T')[0],
        amount: paymentForm.amount,
        method: paymentForm.method as any,
        reference: paymentForm.reference,
        period: new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' }),
        status: 'PENDING'
    };
    setTransactions([newTx, ...transactions]);
    setPaymentForm({ ...paymentForm, reference: '' });
    setSuccessMsg('Paiement déclaré ! En attente de validation.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSuspend = () => {
    setIsSubscribed(false);
    setShowSuspendModal(false);
    setSuccessMsg('Abonnement suspendu.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Calculate Next Billing Date (Mock)
  const nextBillingDate = new Date();
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
  const formattedNextDate = nextBillingDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
        <p className="text-gray-500">Gérez vos informations personnelles et votre abonnement.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[
            { id: 'info', label: 'Informations', icon: UserIcon },
            { id: 'security', label: 'Sécurité', icon: Lock },
            ...(user?.role === 'ADMIN' ? [{ id: 'billing', label: 'Facturation & Abo', icon: CreditCard }] : [])
        ].map((tab) => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeTab === tab.id 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <tab.icon size={16} />
                {tab.label}
            </button>
        ))}
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {successMsg && (
            <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-100 flex items-center gap-2 font-medium"
            >
                <CheckCircle2 size={18} />
                {successMsg}
            </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        
        {/* INFO TAB */}
        {activeTab === 'info' && (
            <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-lg">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Prénom</label>
                        <input 
                            type="text" value={profileData.firstName} onChange={e => setProfileData({...profileData, firstName: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nom</label>
                        <input 
                            type="text" value={profileData.lastName} onChange={e => setProfileData({...profileData, lastName: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                    <input 
                        type="email" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Téléphone</label>
                    <input 
                        type="tel" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                    />
                </div>
                <button type="submit" className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors flex items-center gap-2">
                    <Save size={18} />
                    Enregistrer
                </button>
            </form>
        )}

        {/* SECURITY TAB */}
        {activeTab === 'security' && (
            <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-lg">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Mot de passe actuel</label>
                    <input 
                        type="password" required
                        value={passwordData.current} onChange={e => setPasswordData({...passwordData, current: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Nouveau mot de passe</label>
                    <input 
                        type="password" required
                        value={passwordData.new} onChange={e => setPasswordData({...passwordData, new: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Confirmer le mot de passe</label>
                    <input 
                        type="password" required
                        value={passwordData.confirm} onChange={e => setPasswordData({...passwordData, confirm: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                    />
                </div>
                <button type="submit" className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors flex items-center gap-2">
                    <Save size={18} />
                    Mettre à jour
                </button>
            </form>
        )}

        {/* BILLING TAB */}
        {activeTab === 'billing' && user?.role === 'ADMIN' && (
            <div className="space-y-8">
                {/* Status Card */}
                <div className={`p-6 rounded-2xl border ${isSubscribed ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                    <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                            <div className={`p-3 rounded-xl ${isSubscribed ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                                <CreditCard size={24} />
                            </div>
                            <div>
                                <h3 className={`text-lg font-bold ${isSubscribed ? 'text-green-800' : 'text-red-800'}`}>
                                    {isSubscribed ? 'Abonnement Actif' : 'Abonnement Suspendu'}
                                </h3>
                                <p className={`text-sm ${isSubscribed ? 'text-green-600' : 'text-red-600'}`}>
                                    {isSubscribed 
                                        ? `Prochaine échéance le ${formattedNextDate}` 
                                        : 'Votre accès est limité. Réactivez votre compte pour continuer.'}
                                </p>
                            </div>
                        </div>
                        {isSubscribed && (
                            <button 
                                onClick={() => setShowSuspendModal(true)}
                                className="text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                            >
                                <PauseCircle size={14} /> Suspendre
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Payment Form */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <CreditCard size={20} className="text-yellow-500" />
                            Déclarer un paiement
                        </h3>
                        <form onSubmit={handlePaymentSubmit} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mois concerné</label>
                                <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium">
                                    <Calendar size={18} className="text-gray-400" />
                                    {new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Méthode de paiement</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentForm({...paymentForm, method: 'ORANGE_MONEY'})}
                                        className={`py-3 px-2 rounded-xl border-2 text-xs font-bold transition-all ${
                                            paymentForm.method === 'ORANGE_MONEY' 
                                            ? 'border-yellow-500 bg-yellow-50 text-yellow-800' 
                                            : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                                        }`}
                                    >
                                        Orange Money
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentForm({...paymentForm, method: 'MVOLA'})}
                                        className={`py-3 px-2 rounded-xl border-2 text-xs font-bold transition-all ${
                                            paymentForm.method === 'MVOLA' 
                                            ? 'border-yellow-500 bg-yellow-50 text-yellow-800' 
                                            : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                                        }`}
                                    >
                                        Mvola
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Référence Transaction</label>
                                <input 
                                    type="text" required
                                    value={paymentForm.reference} onChange={e => setPaymentForm({...paymentForm, reference: e.target.value})}
                                    placeholder="ex: TX12345678"
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                                />
                            </div>

                            <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors shadow-lg">
                                Confirmer le paiement
                            </button>
                        </form>
                    </div>

                    {/* History */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <History size={20} className="text-gray-400" />
                            Historique
                        </h3>
                        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                            <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-100">
                                {transactions.map((tx) => (
                                    <div key={tx.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-sm text-gray-900">{tx.period}</p>
                                            <p className="text-xs text-gray-500">{tx.date} • {tx.method === 'ORANGE_MONEY' ? 'OM' : 'Mvola'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm text-gray-900">{tx.amount.toLocaleString()} Ar</p>
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                                tx.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                                                tx.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {tx.status === 'APPROVED' ? 'Validé' : tx.status === 'PENDING' ? 'En attente' : 'Rejeté'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {transactions.length === 0 && (
                                    <div className="p-6 text-center text-gray-400 text-sm italic">Aucun historique disponible.</div>
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
