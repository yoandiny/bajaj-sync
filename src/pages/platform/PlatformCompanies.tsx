import { useState, useEffect } from 'react';
import { platformService, PlatformCompany } from '../../services/platform.service';
import { Search, Building2, Calendar, Phone, Mail } from 'lucide-react';

const PlatformCompanies = () => {
    const [companies, setCompanies] = useState<PlatformCompany[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const loadCompanies = () => {
        setLoading(true);
        platformService.getCompanies()
            .then(setCompanies)
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadCompanies();
    }, []);

    const filteredCompanies = companies.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.ownerName.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return <div className="flex items-center justify-center h-64 text-gray-400 font-medium">Chargement...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestion des Entreprises</h1>
                    <p className="text-gray-500">Liste des flottes et propriétaires sur la plateforme.</p>
                </div>
                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher une entreprise..."
                        className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 w-full sm:w-64"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Entreprise</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Propriétaire</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Abonnement Cloud</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Expire le</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCompanies.map((company) => (
                                <tr key={company.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                                                <Building2 size={20} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{company.name}</div>
                                                <div className="text-xs text-gray-500">Créé le {new Date(company.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{company.ownerName}</div>
                                        <div className="flex flex-col gap-0.5 mt-1">
                                            {company.ownerEmail && (
                                                <div className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                                                    <Mail size={12} /> {company.ownerEmail}
                                                </div>
                                            )}
                                            {company.ownerPhone && (
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Phone size={12} /> {company.ownerPhone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {company.status === 'active'
                                            ? <span className="text-green-600 text-[10px] font-bold bg-green-100 px-2 py-0.5 rounded-full">Actif</span>
                                            : company.status === 'suspended' || company.status === 'waiting'
                                                ? <span className="text-amber-600 text-[10px] font-bold bg-amber-100 px-2 py-0.5 rounded-full">En attente</span>
                                                : <span className="text-red-600 text-[10px] font-bold bg-red-100 px-2 py-0.5 rounded-full">Suspendu</span>
                                        }
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar size={14} className="text-gray-400" />
                                            {company.subscription_until ? new Date(company.subscription_until).toLocaleDateString() : '—'}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredCompanies.length === 0 && (
                                <tr><td colSpan={4} className="p-8 text-center text-gray-500 italic">Aucune entreprise trouvée.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PlatformCompanies;
