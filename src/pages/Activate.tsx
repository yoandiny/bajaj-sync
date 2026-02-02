import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, CheckCircle2, AlertCircle, Info, User, Clock, Check, X, Home } from 'lucide-react'; // Ajout de Home
import axios from 'axios';

const Activate = () => {
  const [phone, setPhone] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'check' | 'active' | 'payment'>('check');
  
  const [paymentPhone, setPaymentPhone] = useState('');
  const [reference, setReference] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const [userAccount, setUserAccount] = useState<{ lastName: string, firstName: string, status: string }>({ 
    lastName: '', firstName: '', status: '' 
  });

  const handleVerify = async(e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setAlert(null);
    
    try {
      const res = await axios.get(`https://bajaj-app.yotech.mg/check/${phone}`);
      
      if(res.data.status === 'active') {
        setStep('active');
        setUserAccount({ lastName: res.data.last_name, firstName: res.data.first_name, status: 'Actif' });
      } else {
        setStep('payment');
        setUserAccount({ lastName: res.data.last_name, firstName: res.data.first_name, status: 'Inactif' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: "Compte introuvable ou erreur serveur." });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleConfirmPayment = async() => {
    try {
      if (!paymentPhone || !reference) {
        setAlert({ type: 'error', message: 'Veuillez remplir tous les champs de paiement.' });
        return;
      }

      setIsSubmitting(true);

      const res = await axios.post(`https://bajaj-app.yotech.mg/confirm/${phone}`, { 
        paymentPhone, 
        reference,
        paymentMethod: 'Orange Money' 
      });

      if(res.data.status === 'error') {
        setIsSubmitting(false);
        setAlert({ type: 'error', message: res.data.message });
        return;
      }

      if(res.data.status === 'sent') {
        setIsSubmitting(false);
        setAlert({ 
          type: 'success', 
          message: 'Demande envoyée ! Votre licence sera validée après vérification manuelle (env. 15 min). Vous recevrez un appel ou un SMS de confirmation.' 
        });
      }
      
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      setAlert({ type: 'error', message: 'Une erreur est survenue lors de la confirmation du paiement.' });
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gray-50 flex justify-center px-4 font-sans">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl w-full">
        
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-yellow-500 p-8 text-white text-center">
            <h1 className="text-3xl font-bold tracking-tight">BajajSync</h1>
            <p className="opacity-90 mt-1 font-medium">Activation de compte</p>
          </div>

          <div className="p-8">
            {/* ETAPE 1 : Recherche */}
            <form onSubmit={handleVerify} className="space-y-4">
              <label className="block text-sm font-bold text-gray-700">Numéro du compte BajajSync</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel" placeholder="034 XX XXX XX" disabled={step !== 'check'}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl outline-none transition-all ${
                    step !== 'check' ? 'bg-gray-50 border-gray-100 text-gray-500' : 'border-gray-200 focus:border-yellow-500'
                  }`}
                  value={phone} onChange={(e) => setPhone(e.target.value)} required
                />
              </div>
              {step === 'check' && (
                <button type="submit" disabled={isVerifying} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-yellow-500/30 transition-all">
                  {isVerifying ? "Recherche du compte..." : "Vérifier mon compte"}
                </button>
              )}
            </form>

            <AnimatePresence mode="wait">
              {/* CARD UTILISATEUR */}
              {step !== 'check' && (
                <motion.div key="user-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 p-5 rounded-3xl bg-gray-50 border border-gray-100 flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-yellow-600">
                    <User size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{userAccount.lastName} {userAccount.firstName}</h3>
                    <p className="text-sm text-gray-500 font-medium">{phone}</p>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                    step === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {userAccount.status}
                  </div>
                </motion.div>
              )}

              {/* CONTENU : DÉJÀ ACTIF */}
              {step === 'active' && (
                <motion.div key="active-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-center py-6 space-y-4">
                  <div className="inline-flex p-4 bg-green-100 text-green-600 rounded-full"><Check size={32} /></div>
                  <p className="text-gray-600 font-medium px-4">Votre licence est déjà activée. Vous pouvez utiliser toutes les fonctionnalités.</p>
                  <button onClick={() => {setStep('check'); setPhone(''); setAlert(null);}} className="text-yellow-600 font-bold text-sm">Vérifier un autre numéro</button>
                </motion.div>
              )}

              {/* CONTENU : PAIEMENT */}
              {step === 'payment' && (
                <motion.div key="payment-content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-6">
                  <div className="h-px bg-gray-100 w-full" />
                  
                  <div className="space-y-4">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Choisir le mode de paiement</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 border-2 border-yellow-500 rounded-2xl bg-yellow-50/50 flex flex-col items-center gap-2 cursor-pointer transition-all hover:bg-yellow-50">
                        <img src="https://approcarte.orange.mg/assets/images/ico-orangemoney.jpg" className="h-6" alt="Orange" />
                        <span className="text-[10px] font-bold text-yellow-700 uppercase">Transfert Orange</span>
                      </div>
                      <div className="p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 flex flex-col items-center gap-2 relative opacity-50 grayscale cursor-not-allowed">
                        <div className="absolute inset-0 bg-white/20 flex items-center justify-center z-10 rounded-2xl">
                          <span className="bg-gray-800 text-[8px] text-white px-2 py-0.5 rounded-full font-bold">INDISPONIBLE</span>
                        </div>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH_ZUgonSGrVjcdcdhJDS-xPkrKAlYRtPvYg&s" className="h-6" alt="Mvola" />
                        <span className="text-[10px] font-bold">Mvola</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex gap-3">
                    <Info className="text-blue-500 shrink-0" size={18} />
                    <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                      Effectuez le transfert au <span className="font-bold">037 68 727 82</span> (DINY Fondàna Yoan). Une fois terminé, renseignez les détails ci-dessous.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <input 
                      type="text" placeholder="Votre numéro Orange Money" value={paymentPhone} onChange={(e) => setPaymentPhone(e.target.value)}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-yellow-500 focus:bg-white rounded-2xl outline-none transition-all text-sm font-medium"
                    />
                    <input 
                      type="text" placeholder="Référence de transaction (ID)" value={reference} onChange={(e) => setReference(e.target.value)}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-yellow-500 focus:bg-white rounded-2xl outline-none transition-all text-sm font-medium"
                    />
                    <button 
                      onClick={handleConfirmPayment} disabled={isSubmitting}
                      className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg flex justify-center items-center gap-2"
                    >
                      {isSubmitting ? "Validation en cours..." : "Confirmer mon paiement"}
                    </button>
                    <button onClick={() => setStep('check')} className="w-full py-2 text-gray-400 text-xs font-bold uppercase tracking-wider">Annuler</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Système d'Alertes - EN BAS */}
            <AnimatePresence>
              {alert && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className={`mt-6 p-4 rounded-2xl flex items-center gap-3 border shadow-sm ${
                    alert.type === 'success' ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'
                  }`}
                >
                  {alert.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  <p className="text-sm font-bold flex-1">{alert.message}</p>
                  <button onClick={() => setAlert(null)}><X size={18} /></button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* BOUTON RETOUR ACCUEIL */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
              <button 
                onClick={() => window.location.href = '/'} 
                className="flex items-center gap-2 text-gray-400 hover:text-yellow-600 transition-all text-xs font-bold uppercase tracking-widest"
              >
                <Home size={14} />
                Retour à l'accueil
              </button>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Activate;