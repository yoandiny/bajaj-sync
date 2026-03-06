import React, { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle, CheckCircle, RefreshCcw, DollarSign, AlertTriangle, X } from 'lucide-react';
import { authService } from '../../services/auth.service';
import { motion, AnimatePresence } from 'framer-motion';

const PlatformSettings = () => {
    const [settings, setSettings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Modal de confirmation pour le prix de licence
    const [priceConfirm, setPriceConfirm] = useState<{ key: string; oldValue: string; newValue: string } | null>(null);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await authService.getSettings();
            console.log('[SETTINGS] Reçus du backend:', data);
            setSettings(data);
        } catch (err) {
            setError('Impossible de récupérer les paramètres');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleUpdate = async (key: string, value: string) => {
        setSaving(key);
        setError('');
        setSuccess('');
        try {
            await authService.updateSetting(key, value);
            setSuccess('Paramètre mis à jour avec succès');
            setTimeout(() => setSuccess(''), 3000);
            fetchSettings();
        } catch (err) {
            setError('Erreur lors de la mise à jour');
        } finally {
            setSaving(null);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>, setting: any) => {
        const newValue = e.target.value.trim();
        if (newValue === setting.value) return; // Pas de changement

        if (setting.key === 'licence_monthly_price') {
            // Demander confirmation pour le prix de licence
            setPriceConfirm({ key: setting.key, oldValue: setting.value, newValue });
        } else {
            handleUpdate(setting.key, newValue);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCcw className="animate-spin text-yellow-600" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Paramètres Système</h1>
                    <p className="text-gray-500">Gérez les configurations globales de BajajSync</p>
                </div>
                <Settings className="text-gray-400" size={32} />
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-2">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {success && (
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-green-600 flex items-center gap-2">
                    <CheckCircle size={20} />
                    {success}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Section Prix de base */}
                <div className="md:col-span-2 border-b border-gray-100 pb-2">
                    <h2 className="text-lg font-bold text-gray-800">Tarification de base</h2>
                </div>
                {settings.filter(s => ['licence_monthly_price', 'app_price'].includes(s.key)).map((setting) => (
                    <motion.div
                        key={setting.key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-50 rounded-xl text-yellow-600">
                                <DollarSign size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 uppercase">
                                    {setting.key === 'licence_monthly_price' ? 'Abonnement Mensuel' : 'Prix de l\'App (BajajSync)'}
                                </p>
                                <p className="text-xs text-gray-500">Dernière mise à jour : {new Date(setting.updated_at).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                key={setting.value}
                                type="number"
                                defaultValue={setting.value}
                                onBlur={(e) => handleBlur(e, setting)}
                                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-mono font-bold"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <span className="text-gray-400 font-bold text-sm">Ar</span>
                                {saving === setting.key ? (
                                    <RefreshCcw className="animate-spin text-gray-400" size={16} />
                                ) : (
                                    <Save className="text-gray-300" size={16} />
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Section Promotions */}
                <div className="md:col-span-2 border-b border-gray-100 pb-2 mt-4">
                    <h2 className="text-lg font-bold text-gray-800">Gestion des Promotions</h2>
                </div>

                {/* Promo Abonnement */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                                <AlertTriangle size={20} />
                            </div>
                            <h3 className="font-bold text-gray-900">Promo Abonnement</h3>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={settings.find(s => s.key === 'promo_sub_active')?.value === 'true'}
                                onChange={(e) => handleUpdate('promo_sub_active', e.target.checked ? 'true' : 'false')}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 text-xs font-bold text-gray-500 uppercase ml-1">Prix Promo</div>
                        <div className="space-y-1 text-xs font-bold text-gray-500 uppercase ml-1">Date d'expiration</div>
                        <input
                            type="number"
                            defaultValue={settings.find(s => s.key === 'promo_sub_price')?.value}
                            onBlur={(e) => handleUpdate('promo_sub_price', e.target.value)}
                            placeholder="Prix"
                            className="px-4 py-2 bg-gray-50 rounded-xl font-bold"
                        />
                        <input
                            type="date"
                            defaultValue={settings.find(s => s.key === 'promo_sub_expiry')?.value}
                            onBlur={(e) => handleUpdate('promo_sub_expiry', e.target.value)}
                            className="px-4 py-2 bg-gray-50 rounded-xl font-bold"
                        />
                    </div>
                </div>

                {/* Promo Application */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
                                <AlertTriangle size={20} />
                            </div>
                            <h3 className="font-bold text-gray-900">Promo Application</h3>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={settings.find(s => s.key === 'promo_app_active')?.value === 'true'}
                                onChange={(e) => handleUpdate('promo_app_active', e.target.checked ? 'true' : 'false')}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 text-xs font-bold text-gray-500 uppercase ml-1">Prix Promo</div>
                        <div className="space-y-1 text-xs font-bold text-gray-500 uppercase ml-1">Date d'expiration</div>
                        <input
                            type="number"
                            defaultValue={settings.find(s => s.key === 'promo_app_price')?.value}
                            onBlur={(e) => handleUpdate('promo_app_price', e.target.value)}
                            placeholder="Prix"
                            className="px-4 py-2 bg-gray-50 rounded-xl font-bold"
                        />
                        <input
                            type="date"
                            defaultValue={settings.find(s => s.key === 'promo_app_expiry')?.value}
                            onBlur={(e) => handleUpdate('promo_app_expiry', e.target.value)}
                            className="px-4 py-2 bg-gray-50 rounded-xl font-bold"
                        />
                    </div>
                </div>

                {/* Autres paramètres */}
                <div className="md:col-span-2 border-b border-gray-100 pb-2 mt-4">
                    <h2 className="text-lg font-bold text-gray-800">Autres configurations</h2>
                </div>
                {settings.filter(s => !['licence_monthly_price', 'app_price', 'promo_sub_active', 'promo_sub_price', 'promo_sub_expiry', 'promo_app_active', 'promo_app_price', 'promo_app_expiry'].includes(s.key)).map((setting) => (
                    <motion.div
                        key={setting.key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-50 rounded-xl text-gray-600">
                                <Settings size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 capitalize">
                                    {setting.key.replace(/_/g, ' ')}
                                </p>
                                <p className="text-xs text-gray-500">Dernière mise à jour : {new Date(setting.updated_at).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                key={setting.value}
                                type="text"
                                defaultValue={setting.value}
                                onBlur={(e) => handleBlur(e, setting)}
                                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-mono font-bold"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {saving === setting.key ? (
                                    <RefreshCcw className="animate-spin text-gray-400" size={16} />
                                ) : (
                                    <Save className="text-gray-300" size={16} />
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal de confirmation prix de licence */}
            <AnimatePresence>
                {priceConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
                        >
                            <div className="bg-red-500 px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3 text-white">
                                    <AlertTriangle size={22} />
                                    <span className="font-black text-lg">Confirmer la modification</span>
                                </div>
                                <button onClick={() => setPriceConfirm(null)} className="text-white/70 hover:text-white transition-colors">
                                    <X size={22} />
                                </button>
                            </div>
                            <div className="p-6 space-y-5">
                                <p className="text-gray-600 font-medium">
                                    Vous êtes sur le point de modifier le <strong>prix de la licence mensuelle</strong>. Cette valeur est affichée à tous les nouveaux gestionnaires lors de leur inscription.
                                </p>
                                <div className="bg-gray-50 rounded-2xl p-4 space-y-3 border border-gray-100">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500 font-medium">Ancien prix :</span>
                                        <span className="font-black text-gray-400 line-through">{Number(priceConfirm.oldValue).toLocaleString()} Ar</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500 font-medium">Nouveau prix :</span>
                                        <span className="font-black text-green-600 text-lg">{Number(priceConfirm.newValue).toLocaleString()} Ar</span>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => setPriceConfirm(null)}
                                        className="flex-1 py-3 rounded-xl border-2 border-gray-100 font-bold text-gray-500 hover:bg-gray-50 transition-all"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleUpdate(priceConfirm.key, priceConfirm.newValue);
                                            setPriceConfirm(null);
                                        }}
                                        className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 font-black text-white transition-all shadow-lg shadow-red-500/30"
                                    >
                                        Confirmer la modification
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PlatformSettings;
