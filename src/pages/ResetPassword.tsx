import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/auth.service';
import Logo from '../assets/logo.png';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const token = searchParams.get('t') || searchParams.get('token');
    const userId = searchParams.get('i') || searchParams.get('id');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token || !userId) {
            setError('Lien de réinitialisation invalide ou expiré.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        if (password.length < 5) {
            setError('Le mot de passe doit contenir au moins 5 caractères.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            await authService.resetPassword(userId, token, password);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 4000);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Une erreur est survenue.');
        } finally {
            setLoading(false);
        }
    };

    if (!token || !userId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8 text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Lien invalide</h2>
                    <p className="text-gray-500">Le lien de réinitialisation fourni est incomplet ou invalide.</p>
                    <button
                        onClick={() => navigate('/forgot-password')}
                        className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold mt-4"
                    >
                        Demander un nouveau lien
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden border border-gray-100">

                {/* Header */}
                <div className="bg-yellow-500 p-8 text-center">
                    <div className="inline-block p-3 bg-white rounded-2xl shadow-lg mb-4">
                        <img src={Logo} alt="Logo" className="w-12 h-12" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Nouveau mot de passe</h1>
                    <p className="text-yellow-100 text-sm mt-1">Sécurisez votre compte BajajSync</p>
                </div>

                <div className="p-8">
                    {success ? (
                        <div className="text-center space-y-4 py-4">
                            <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 animate-bounce">
                                <CheckCircle2 size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Mot de passeifié !</h3>
                            <p className="text-gray-500">
                                Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion...
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm font-medium">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Nouveau mot de passe</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors" size={20} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all font-medium"
                                            placeholder="••••••••"
                                            required
                                            minLength={5}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Confirmer le mot de passe</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors" size={20} />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all font-medium"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {loading ? 'Modification...' : (
                                    <>
                                        Enregistrer <ArrowRight size={20} />
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

export default ResetPassword;
