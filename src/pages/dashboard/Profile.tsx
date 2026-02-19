import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, SubscriptionPayment } from '../../types';
import { UserCircle, CreditCard, Save, Lock, AlertTriangle, CheckCircle2, XCircle, History } from 'lucide-react';
import { generateUUID } from '../../lib/utils';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'billing'>('profile');
  
  // Profile State
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
    confirmPassword: ''
  });
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Billing State
  const [payments, setPayments] = useState<SubscriptionPayment[]>([
    { id: 'sub-1', date: '2025-01-05', month: 'Janvier 2025', amount: 50000, method: 'ORANGE_MONEY', reference: 'OM123456', status: 'CONFIRMED' },
    { id: 'sub-2', date: '2025-02-05', month: 'Février 2025', amount: 50000, method: 'MVOLA', reference: 'MV987654', status: 'CONFIRMED' },
  ]);
  
  const [billingForm, setBillingForm] = useState({
    month: '',
    method: 'ORANGE_MONEY',
    reference: ''
  });
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPayment: SubscriptionPayment = {
        id: generateUUID(),
        date: new Date().toISOString().split('T')[0],
        month: billingForm.month,
        amount: 50000,
        method: billingForm.method as any,
        reference: billingForm.reference,
        status: 'PENDING'
    };
    setPayments([newPayment, ...payments]);
    setBillingForm({ month: '', method: 'ORANGE_MONEY', reference: '' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-2xl font-bold text-white">
            {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
        </div>
        <div>
            <h1 className="text-2xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h1>
            <p className="text-gray-500">{user?.role === 'ADMIN' ? 'Administrateur Principal' : 'Gérant de Bureau'}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 ${
            activeTab === 'profile' 
              ? 'border-yellow-500 text-yellow-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
            <div className="flex items-center gap-2">
                <UserCircle size={18} /> Mon Profil
            </div>
        </button>
        {user?.role === 'ADMIN' && (
            <button
            onClick={() => setActiveTab('billing')}
            className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 ${
                activeTab === 'billing' 
                ? 'border-yellow-500 text-yellow-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            >
                <div className="flex items-center gap-2">
                    <CreditCard size={18} /> Facturation & Abonnement
                </div>
            </button>
        )}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-2 gap-6">
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

                <div className="grid grid-cols-2 gap-6">
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
                </div>

                <hr className="border-gray-100" />

                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Lock size={20} className="text-gray-400" /> Sécurité
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nouveau mot de passe</label>
                            <input 
                                type="password" value={profileData.password} onChange={e => setProfileData({...profileData, password: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                                placeholder="Laisser vide si inchangé"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Confirmer mot de passe</label>
                            <input 
                                type="password" value={profileData.confirmPassword} onChange={e => setProfileData({...profileData, confirmPassword: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                                placeholder="Confirmer"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button type="submit" className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg">
                        <Save size={18} />
                        {profileSuccess ? 'Enregistré !' : 'Mettre à jour mon profil'}
                    </button>
                </div>
            </form>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && user?.role === 'ADMIN' && (
        <div className="space-y-8">
            {/* Payment Form */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Payer mon abonnement</h3>
                <form onSubmit={handlePaymentSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Mois de l'abonnement</label>
                        <select 
                            required
                            value={billingForm.month} onChange={e => setBillingForm({...billingForm, month: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                        >
                            <option value="">Sélectionner un mois</option>
                            <option value="Mars 2025">Mars 2025</option>
                            <option value="Avril 2025">Avril 2025</option>
                            <option value="Mai 2025">Mai 2025</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Moyen de paiement</label>
                        <select 
                            required
                            value={billingForm.method} onChange={e => setBillingForm({...billingForm, method: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                        >
                            <option value="ORANGE_MONEY">Orange Money</option>
                            <option value="MVOLA">Mvola</option>
                            <option value="BANK_TRANSFER" disabled>Virement Bancaire (Indisponible)</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Référence de transaction</label>
                        <input 
                            type="text" required
                            value={billingForm.reference} onChange={e => setBillingForm({...billingForm, reference: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                            placeholder="ex: OM12345678"
                        />
                         <p className="text-xs text-gray-500 mt-2">
                            Veuillez effectuer le transfert de <strong>50.000 Ar</strong> au <strong>034 00 000 00</strong> avant de valider.
                        </p>
                    </div>

                    <div className="md:col-span-2">
                        <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-yellow-500/20">
                            Enregistrer le paiement
                        </button>
                    </div>
                </form>
            </div>

            {/* History */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <History size={20} /> Historique des paiements
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Date</th>
                                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Mois</th>
                                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Méthode</th>
                                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Réf.</th>
                                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {payments.map(p => (
                                <tr key={p.id}>
                                    <td className="px-4 py-3 text-sm text-gray-600">{p.date}</td>
                                    <td className="px-4 py-3 font-bold text-gray-900">{p.month}</td>
                                    <td className="px-4 py-3 text-xs font-bold text-gray-500">{p.method.replace('_', ' ')}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{p.reference}</td>
                                    <td className="px-4 py-3">
                                        {p.status === 'CONFIRMED' ? (
                                            <span className="inline-flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
                                                <CheckCircle2 size={12} /> Confirmé
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-yellow-600 text-xs font-bold bg-yellow-50 px-2 py-1 rounded-full">
                                                <History size={12} /> En attente
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                        <AlertTriangle size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-red-900">Zone de Danger</h3>
                        <p className="text-red-700 text-sm mt-1">
                            Suspendre votre abonnement arrêtera immédiatement l'accès à la plateforme pour tous vos utilisateurs.
                        </p>
                        
                        {!showSuspendConfirm ? (
                            <button 
                                onClick={() => setShowSuspendConfirm(true)}
                                className="mt-4 px-4 py-2 bg-white border border-red-200 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors text-sm"
                            >
                                Suspendre l'abonnement
                            </button>
                        ) : (
                            <div className="mt-4 p-4 bg-white rounded-xl border border-red-200">
                                <p className="text-sm font-bold text-gray-900 mb-3">Êtes-vous vraiment sûr ?</p>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 text-sm">
                                        Oui, suspendre
                                    </button>
                                    <button 
                                        onClick={() => setShowSuspendConfirm(false)}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 text-sm"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
