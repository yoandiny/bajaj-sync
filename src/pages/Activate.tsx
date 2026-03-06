import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, CheckCircle2, AlertCircle, Info, User, Check, X, ArrowLeft, Smartphone, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Logo from '../assets/logo.png';

const Activate = () => {
  const [phone, setPhone] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'check' | 'active' | 'payment'>('check');

  const [paymentPhone, setPaymentPhone] = useState('');
  const [reference, setReference] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'OM' | 'MVOLA'>('OM');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [userAccount, setUserAccount] = useState<{ lastName: string; firstName: string; status: string }>({
    lastName: '', firstName: '', status: ''
  });

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setAlert(null);

    try {
      const res = await axios.get(`https://bajaj-app.yotech.mg/check/${phone}`);
      if (res.data.status === 'active') {
        setStep('active');
        setUserAccount({ lastName: res.data.last_name, firstName: res.data.first_name, status: 'Actif' });
      } else {
        setStep('payment');
        setUserAccount({ lastName: res.data.last_name, firstName: res.data.first_name, status: 'Inactif' });
      }
    } catch {
      setAlert({ type: 'error', message: 'Compte introuvable. Vérifiez votre numéro et réessayez.' });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!paymentPhone || !reference) {
      setAlert({ type: 'error', message: 'Veuillez remplir tous les champs de paiement.' });
      return;
    }

    setIsSubmitting(true);
    setAlert(null);

    try {
      const res = await axios.post(`https://bajaj-app.yotech.mg/confirm/${phone}`, {
        paymentPhone,
        reference,
        paymentMethod: paymentMethod === 'OM' ? 'Orange Money' : 'Mvola'
      });

      if (res.data.status === 'error') {
        setAlert({ type: 'error', message: res.data.message });
        return;
      }

      if (res.data.status === 'sent') {
        setAlert({
          type: 'success',
          message: '✅ Demande envoyée ! Votre licence sera validée sous ~15 min. Vous recevrez un appel ou SMS de confirmation.'
        });
      }
    } catch {
      setAlert({ type: 'error', message: 'Erreur lors de la confirmation. Réessayez ou contactez le support.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => { setStep('check'); setPhone(''); setAlert(null); setPaymentPhone(''); setReference(''); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex flex-col font-sans">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <Link to="/download" className="flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition-colors text-sm font-bold">
          <ArrowLeft size={16} />
          Retour
        </Link>
        <div className="flex items-center gap-2">
          <img src={Logo} alt="BajajSync" className="w-6 h-6" />
          <span className="font-bold text-white text-sm">
            Bajaj<span className="text-yellow-500">Sync</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
          <Smartphone size={12} className="text-yellow-500" />
          <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">App Mobile</span>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center p-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Header card */}
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-yellow-500 rounded-3xl shadow-xl shadow-yellow-500/30 mb-5">
              <ShieldCheck className="text-gray-900" size={32} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Activation Licence</h1>
            <p className="text-gray-400 font-medium mt-2">
              Activez votre accès à l'application BajajSync mobile
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="p-6 sm:p-8 space-y-6">

              {/* Step 1 : Recherche du compte */}
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Numéro de compte BajajSync
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="tel"
                      placeholder="034 XX XXX XX"
                      disabled={step !== 'check'}
                      className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none transition-all font-medium ${step !== 'check'
                          ? 'bg-white/5 border border-white/5 text-gray-400'
                          : 'bg-white/10 border border-white/10 text-white placeholder:text-gray-600 focus:border-yellow-500/50 focus:bg-white/15'
                        }`}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                {step === 'check' && (
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 py-4 rounded-2xl font-black shadow-lg shadow-yellow-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isVerifying ? 'Vérification...' : 'Vérifier mon compte'}
                  </button>
                )}
              </form>

              <AnimatePresence mode="wait">
                {/* User card */}
                {step !== 'check' && (
                  <motion.div
                    key="user-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-2xl bg-white/10 border border-white/10 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center text-yellow-500 shrink-0">
                      <User size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white truncate">{userAccount.lastName} {userAccount.firstName}</h3>
                      <p className="text-sm text-gray-400 font-medium">{phone}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${step === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                      {userAccount.status}
                    </div>
                  </motion.div>
                )}

                {/* Déjà actif */}
                {step === 'active' && (
                  <motion.div
                    key="active"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-6 space-y-4"
                  >
                    <div className="inline-flex p-4 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                      <Check size={28} />
                    </div>
                    <p className="text-gray-300 font-medium">
                      Votre licence est <strong className="text-green-400">déjà activée</strong>. Ouvrez l'application et connectez-vous.
                    </p>
                    <button onClick={reset} className="text-yellow-500 font-bold text-sm hover:text-yellow-400 transition-colors">
                      Vérifier un autre numéro
                    </button>
                  </motion.div>
                )}

                {/* Formulaire paiement */}
                {step === 'payment' && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    <div className="h-px bg-white/10" />

                    {/* Instructions dépôt */}
                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex gap-3">
                      <Info className="text-blue-400 shrink-0 mt-0.5" size={18} />
                      <p className="text-sm text-blue-300 leading-relaxed font-medium">
                        Effectuez le transfert au <span className="font-black text-white">037 68 727 82</span> (DINY Fondàna Yoan), puis renseignez les détails ci-dessous.
                      </p>
                    </div>

                    {/* Choix opérateur */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Opérateur</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('OM')}
                          className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'OM'
                              ? 'border-orange-500 bg-orange-500/10'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                            }`}
                        >
                          <img src="https://approcarte.orange.mg/assets/images/ico-orangemoney.jpg" className="h-6 rounded-md" alt="Orange Money" />
                          <span className={`text-[10px] font-black uppercase ${paymentMethod === 'OM' ? 'text-orange-400' : 'text-gray-500'}`}>
                            Orange Money
                          </span>
                          {paymentMethod === 'OM' && <CheckCircle2 className="text-orange-400" size={14} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('MVOLA')}
                          className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'MVOLA'
                              ? 'border-yellow-500 bg-yellow-500/10'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                            }`}
                        >
                          <img src="https://www.mvola.mg/wp-content/themes/mvola/assets/images/logo-mvola.png" className="h-5" alt="Mvola" />
                          <span className={`text-[10px] font-black uppercase ${paymentMethod === 'MVOLA' ? 'text-yellow-400' : 'text-gray-500'}`}>
                            Mvola
                          </span>
                          {paymentMethod === 'MVOLA' && <CheckCircle2 className="text-yellow-400" size={14} />}
                        </button>
                      </div>
                    </div>

                    {/* Champs */}
                    <div className="space-y-3">
                      <input
                        type="tel"
                        placeholder="Votre numéro Orange Money / Mvola"
                        value={paymentPhone}
                        onChange={(e) => setPaymentPhone(e.target.value)}
                        className="w-full px-4 py-3.5 bg-white/10 border border-white/10 focus:border-yellow-500/50 rounded-2xl outline-none text-white placeholder:text-gray-600 font-medium transition-all"
                      />
                      <input
                        type="text"
                        placeholder="Référence de transaction (ID)"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        className="w-full px-4 py-3.5 bg-white/10 border border-white/10 focus:border-yellow-500/50 rounded-2xl outline-none text-white placeholder:text-gray-600 font-medium transition-all"
                      />
                    </div>

                    <button
                      onClick={handleConfirmPayment}
                      disabled={isSubmitting}
                      className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 py-4 rounded-2xl font-black shadow-lg shadow-yellow-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Validation en cours...' : 'Confirmer mon paiement'}
                    </button>

                    <button onClick={reset} className="w-full py-2 text-gray-500 text-xs font-bold uppercase tracking-wider hover:text-gray-300 transition-colors">
                      Annuler
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Alertes */}
              <AnimatePresence>
                {alert && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`p-4 rounded-2xl flex items-start gap-3 border ${alert.type === 'success'
                        ? 'bg-green-500/10 border-green-500/20 text-green-300'
                        : 'bg-red-500/10 border-red-500/20 text-red-300'
                      }`}
                  >
                    {alert.type === 'success' ? <CheckCircle2 size={18} className="shrink-0 mt-0.5" /> : <AlertCircle size={18} className="shrink-0 mt-0.5" />}
                    <p className="text-sm font-medium flex-1 leading-relaxed">{alert.message}</p>
                    <button onClick={() => setAlert(null)} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                      <X size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-6 sm:px-8 py-4 border-t border-white/5 bg-white/2 flex items-center justify-between">
              <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Support : +261 38 22 093 67</p>
              <img src={Logo} alt="BajajSync" className="h-5 opacity-30 grayscale" />
            </div>
          </div>

          <p className="text-center text-gray-600 text-xs font-bold uppercase tracking-[0.2em] mt-8">
            Propulsé par YoTech Digital Solutions
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Activate;
