import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Mail, Lock, Building, ArrowRight, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import Logo from '../assets/logo.png';

const Register = () => {
    const [formData, setFormData] = useState({
        isNewAccount: true,
        phone: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        companyName: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.phone && !formData.email) {
            setError('Veuillez renseigner au moins un numéro de téléphone ou un email.');
            return;
        }

        setLoading(true);

        try {
            await authService.registerWeb(formData);
            // Après inscription, on est automatiquement "loggé" par authService
            navigate('/activate');
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Erreur lors de l'inscription");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100"
            >
                {/* Header */}
                <div className="bg-gray-900 p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <div className="absolute top-[-10%] left-[-10%] w-40 h-40 bg-yellow-500 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-[-10%] right-[-10%] w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="inline-block p-3 bg-white rounded-2xl shadow-lg mb-4">
                            <img src={Logo} alt="Logo" className="w-12 h-12" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Créer mon compte</h1>
                        <p className="text-gray-400 text-sm mt-1">Rejoignez la révolution BajajSync</p>
                    </div>
                </div>

                <div className="p-8 md:p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium"
                            >
                                <AlertCircle size={18} className="shrink-0" />
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider text-center block">Type de compte</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, isNewAccount: true })}
                                    className={`p-4 rounded-2xl border-2 transition-all text-center flex flex-col items-center gap-1 ${formData.isNewAccount
                                        ? 'border-yellow-500 bg-yellow-50/50 shadow-lg'
                                        : 'border-gray-100 bg-gray-50'
                                        }`}
                                >
                                    <Sparkles className={formData.isNewAccount ? 'text-yellow-600' : 'text-gray-400'} size={20} />
                                    <span className="font-bold text-sm text-gray-900">Nouveau</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, isNewAccount: false })}
                                    className={`p-4 rounded-2xl border-2 transition-all text-center flex flex-col items-center gap-1 ${!formData.isNewAccount
                                        ? 'border-yellow-500 bg-yellow-50/50 shadow-lg'
                                        : 'border-gray-100 bg-gray-50'
                                        }`}
                                >
                                    <CheckCircle className={!formData.isNewAccount ? 'text-yellow-600' : 'text-gray-400'} size={20} />
                                    <span className="font-bold text-sm text-gray-900">Existant</span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {formData.isNewAccount && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-tight">Prénom</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-medium text-sm"
                                                placeholder="ex: Jean"
                                                required={formData.isNewAccount}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-tight">Nom</label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-medium text-sm"
                                            placeholder="ex: Rakoto"
                                            required={formData.isNewAccount}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-tight">Nom de l'entreprise</label>
                                <div className="relative">
                                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-bold text-sm"
                                        placeholder="ex: Transport Express"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-tight">
                                    Numéro de téléphone {!formData.email && <span className="text-red-500">*</span>}
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-bold text-sm"
                                        placeholder="034 00 000 00"
                                    />
                                </div>
                            </div>

                            {formData.isNewAccount && (
                                <>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-tight">
                                            Email {!formData.phone && <span className="text-red-500">*</span>}
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-medium text-sm"
                                                placeholder="votre@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-tight">Mot de passe</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-bold text-sm"
                                                placeholder="••••••••"
                                                required={formData.isNewAccount}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-yellow-500 text-white py-4 rounded-2xl font-black text-lg hover:bg-yellow-600 transition-all shadow-lg shadow-yellow-500/30 flex items-center justify-center gap-2 group disabled:opacity-70"
                        >
                            {loading ? 'Création...' : (
                                <>
                                    {formData.isNewAccount ? "Créer mon compte" : "Lier mon entreprise"} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-gray-100 pt-6">
                        <p className="text-sm text-gray-500 font-medium">
                            Déjà membre ?{' '}
                            <Link to="/login" className="text-yellow-600 font-extrabold hover:underline">
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
