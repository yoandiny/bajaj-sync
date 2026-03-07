import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, ArrowLeft, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/auth.service';
import Logo from '../assets/logo.png';
import { cn } from '../lib/utils';

const ForgotPassword = () => {
    const [method, setMethod] = useState<'email' | 'sms'>('email');
    const [identifier, setIdentifier] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!identifier) {
            setError(`Veuillez entrer votre ${method === 'email' ? 'adresse e-mail' : 'numéro de téléphone'}.`);
            return;
        }
        setError('');
        setLoading(true);

        try {
            await authService.forgotPassword(identifier, method);
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Une erreur est survenue lors de l\'envoi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden border border-gray-100">

                {/* Header */}
                <div className="bg-yellow-500 p-8 text-center relative">
                    <button
                        onClick={() => navigate('/login')}
                        className="absolute left-6 top-8 text-white hover:bg-yellow-600 p-2 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="inline-block p-3 bg-white rounded-2xl shadow-lg mb-4">
                        <img src={Logo} alt="Logo" className="w-12 h-12" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Mot de passe oublié</h1>
                    <p className="text-yellow-100 text-sm mt-1">Réinitialisez l'accès à votre compte</p>
                </div>

                <div className="p-8">
                    {success ? (
                        <div className="text-center space-y-6 py-4">
                            <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Lien envoyé !</h3>
                                <p className="text-gray-500">
                                    Nous avons envoyé un lien de réinitialisation à <br /><strong className="text-gray-800">{identifier}</strong>.
                                    Il expirera dans 15 minutes.
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-all shadow-lg"
                            >
                                Retour à la connexion
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm font-medium">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            {/* Method Selector */}
                            <div className="flex bg-gray-100 p-1 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => { setMethod('email'); setIdentifier(''); setError(''); }}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all",
                                        method === 'email' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                                    )}
                                >
                                    <Mail size={16} /> E-mail
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setMethod('sms'); setIdentifier(''); setError(''); }}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all",
                                        method === 'sms' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                                    )}
                                >
                                    <Phone size={16} /> SMS
                                </button>
                            </div>

                            {/* Input Field */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700 ml-1">
                                    {method === 'email' ? 'Votre adresse e-mail' : 'Votre numéro de téléphone'}
                                </label>
                                <div className="relative group">
                                    {method === 'email' ? (
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors" size={20} />
                                    ) : (
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors" size={20} />
                                    )}

                                    <input
                                        type={method === 'email' ? 'email' : 'tel'}
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all font-medium"
                                        placeholder={method === 'email' ? 'jean.dupont@email.com' : '034 00 000 00'}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-yellow-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-yellow-600 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {loading ? 'Envoi en cours...' : (
                                    <>
                                        Envoyer le lien <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
