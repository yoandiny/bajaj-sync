import { useState, useEffect } from 'react';
import { fleetService } from '../../services/fleet.service';
import { User as UserType, Office } from '../../types';
import { Plus, Mail, Phone, Lock, User, ShieldCheck, MailWarning, PhoneCall, Loader2, Search, Building2, Upload, X, Trash2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

const Managers = () => {
    const [managers, setManagers] = useState<UserType[]>([]);
    const [offices, setOffices] = useState<Office[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        officeId: '',
        photoUrl: ''
    });

    const loadData = async () => {
        try {
            setLoading(true);
            const [m, o] = await Promise.all([
                fleetService.getManagers(),
                fleetService.getOffices()
            ]);
            setManagers(m);
            setOffices(o);
        } catch (err) {
            console.error('Erreur chargement données managers', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.phone && !formData.email) {
            alert("Veuillez fournir au moins un email ou un numéro de téléphone.");
            return;
        }

        try {
            setSaving(true);
            await fleetService.createManager(formData);
            await loadData();
            setIsModalOpen(false);
            setFormData({ firstName: '', lastName: '', phone: '', email: '', password: '', officeId: '', photoUrl: '' });
        } catch (err: any) {
            console.error('Erreur création manager', err);
            alert(err.response?.data?.message || 'Erreur lors de la création du manager.');
        } finally {
            setSaving(false);
        }
    };

    const filteredManagers = managers.filter(m =>
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.phone?.includes(searchQuery) ||
        m.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
            <p className="text-gray-500 font-medium">Chargement des collaborateurs...</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestion des Gérants</h1>
                    <p className="text-gray-500 font-medium">Créez et gérez les comptes de vos responsables d'agences.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-yellow-500/20 active:scale-95"
                >
                    <Plus size={20} />
                    Nouveau Gérant
                </button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Rechercher par nom, téléphone ou email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-yellow-500 shadow-sm font-medium"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredManagers.map((m) => (
                    <div key={m.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 flex gap-2">
                            <button
                                onClick={async () => {
                                    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le gérant ${m.firstName} ${m.lastName} ?`)) {
                                        try {
                                            setLoading(true);
                                            await fleetService.deleteManager(m.id);
                                            await loadData();
                                        } catch (err: any) {
                                            alert(err.response?.data?.message || "Erreur lors de la suppression.");
                                        } finally {
                                            setLoading(false);
                                        }
                                    }
                                }}
                                className="bg-red-50 text-red-500 p-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                title="Supprimer ce gérant"
                            >
                                <Trash2 size={16} />
                            </button>
                            <div className="bg-green-100 text-green-600 p-1.5 rounded-lg h-fit">
                                <ShieldCheck size={16} />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center text-yellow-500 font-black text-xl shadow-lg overflow-hidden">
                                {m.photoUrl ? (
                                    <img src={m.photoUrl} alt="Photo" className="w-full h-full object-cover" />
                                ) : (
                                    <span>{m.firstName.charAt(0)}{m.lastName.charAt(0)}</span>
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-gray-900 leading-tight">{m.firstName} {m.lastName}</h3>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Gérant Agence</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {m.phone ? (
                                <div className="flex items-center gap-3 text-sm font-bold text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <PhoneCall size={16} className="text-yellow-600" />
                                    {m.phone}
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 text-sm font-bold text-gray-400 bg-red-50/30 p-3 rounded-xl border border-dashed border-red-100 italic">
                                    <PhoneCall size={16} className="text-red-200" />
                                    Aucun téléphone
                                </div>
                            )}

                            {m.email ? (
                                <div className="flex items-center gap-3 text-sm font-bold text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 truncate">
                                    <Mail size={16} className="text-blue-500" />
                                    <span className="truncate">{m.email}</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 text-sm font-bold text-gray-400 bg-red-50/30 p-3 rounded-xl border border-dashed border-red-100 italic">
                                    <MailWarning size={16} className="text-red-200" />
                                    Aucun email
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <span>Inscrit le</span>
                            <span className="text-gray-900">{m.joinedDate ? new Date(m.joinedDate).toLocaleDateString() : 'N/A'}</span>
                        </div>
                    </div>
                ))}
                {filteredManagers.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 italic font-medium">Aucun gérant trouvé.</p>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Ajouter un Gérant"
            >
                <div className="space-y-6">
                    {/* Photo Upload Section */}
                    <div className="flex flex-col items-center gap-3 py-2">
                        <div className="relative group">
                            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden group-hover:border-yellow-100 transition-colors">
                                {formData.photoUrl ? (
                                    <img src={formData.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={32} className="text-gray-300" />
                                )}
                            </div>
                            <label className="absolute -bottom-1 -right-1 bg-yellow-500 hover:bg-yellow-600 text-white p-1.5 rounded-lg cursor-pointer shadow-md transition-transform hover:scale-110">
                                <Upload size={14} />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            try {
                                                setSaving(true);
                                                const url = await fleetService.uploadFile(file, 'managers');
                                                setFormData({ ...formData, photoUrl: url });
                                            } catch (err) {
                                                alert("Erreur lors de l'upload de la photo");
                                            } finally {
                                                setSaving(false);
                                            }
                                        }
                                    }}
                                />
                            </label>
                            {formData.photoUrl && (
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, photoUrl: '' })}
                                    className="absolute -top-1 -right-1 bg-red-100 text-red-600 p-1 rounded-md hover:bg-red-200 transition-colors"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Photo de profil <span className="font-normal lowercase">(Facultatif)</span></p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Prénom</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text" required
                                        value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-bold"
                                        placeholder="Jean"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nom</label>
                                <input
                                    type="text" required
                                    value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-bold"
                                    placeholder="Rakoto"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Numéro de téléphone</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="tel"
                                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-bold"
                                    placeholder="034 00 000 00"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Adresse Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-bold"
                                    placeholder="jean@email.com"
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 italic">* Au moins un identifiant (téléphone ou email) est requis pour la connexion.</p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Agence de rattachement</label>
                            <div className="relative">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <select
                                    required
                                    value={formData.officeId}
                                    onChange={e => setFormData({ ...formData, officeId: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-bold appearance-none"
                                >
                                    <option value="">Choisir une agence...</option>
                                    {offices.map(o => (
                                        <option key={o.id} value={o.id}>{o.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Mot de passe provisoire</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password" required
                                    value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-bold"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-black mt-4 shadow-lg shadow-gray-900/10 transition-all flex items-center justify-center gap-2"
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                            Créer le compte Gérant
                        </button>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default Managers;
