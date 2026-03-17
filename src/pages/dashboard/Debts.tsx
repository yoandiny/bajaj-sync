import { useState, useEffect } from 'react';
import { fleetService } from '../../services/fleet.service';
import { Driver, Office } from '../../types';
import { Search, FileSpreadsheet, FileText, User, Building2, Wallet, ArrowRight, Loader2, RefreshCcw } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Link } from 'react-router-dom';

const Debts = () => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [offices, setOffices] = useState<Office[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            const [driversData, officesData] = await Promise.all([
                fleetService.getDrivers(),
                fleetService.getOffices()
            ]);
            setDrivers(driversData);
            setOffices(officesData);
        } catch (error) {
            console.error('Erreur lors du chargement des dettes:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const getOfficeName = (officeId: string) => {
        return offices.find(o => o.id === officeId)?.name || 'N/A';
    };

    const filteredDrivers = drivers.filter(driver => {
        const fullName = `${driver.firstName} ${driver.lastName}`.toLowerCase();
        const search = searchTerm.toLowerCase();
        return fullName.includes(search) || 
               driver.phone.includes(search) || 
               getOfficeName(driver.officeId).toLowerCase().includes(search);
    });

    const exportToExcel = () => {
        const data = filteredDrivers.map(d => ({
            'Nom': d.firstName,
            'Prénom': d.lastName,
            'Téléphone': d.phone,
            'Bureau': getOfficeName(d.officeId),
            'Dette Actuelle (Ar)': d.debt || 0,
            'Status': d.status
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Dettes');
        XLSX.writeFile(wb, `Suivi_Dettes_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Suivi des Dettes Chauffeurs', 14, 15);
        
        const tableData = filteredDrivers.map(d => [
            `${d.firstName} ${d.lastName}`,
            d.phone,
            getOfficeName(d.officeId),
            `${(d.debt || 0).toLocaleString()} Ar`,
            d.status
        ]);

        (doc as any).autoTable({
            head: [['Chauffeur', 'Téléphone', 'Bureau', 'Dette', 'Status']],
            body: tableData,
            startY: 20,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [234, 179, 8] } // yellow-500
        });

        doc.save(`Suivi_Dettes_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    if (loading && !refreshing) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
                <p className="text-gray-400 font-medium italic">Analyse des soldes en cours...</p>
            </div>
        );
    }

    const totalDebt = filteredDrivers.reduce((acc, d) => acc + (d.debt || 0), 0);

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Suivi des Dettes</h1>
                    <p className="text-gray-500 font-medium">Visualisez l'état des soldes de tous vos chauffeurs.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-yellow-500 hover:border-yellow-100 transition-all shadow-sm"
                        title="Rafraîchir"
                    >
                        <RefreshCcw size={20} className={refreshing ? 'animate-spin' : ''} />
                    </button>
                    <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
                        <button onClick={exportToExcel} className="p-2.5 hover:bg-green-50 text-green-600 rounded-xl transition-all" title="Excel">
                            <FileSpreadsheet size={20} />
                        </button>
                        <button onClick={exportToPDF} className="p-2.5 hover:bg-red-50 text-red-600 rounded-xl transition-all" title="PDF">
                            <FileText size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
                    <div className="p-4 bg-red-50 text-red-600 rounded-2xl font-black">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dette Totale</p>
                        <h3 className="text-2xl font-black text-gray-900">{totalDebt.toLocaleString()} Ar</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
                    <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl font-black">
                        <User size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chauffeurs Endettés</p>
                        <h3 className="text-2xl font-black text-gray-900">{filteredDrivers.filter(d => (d.debt || 0) > 0).length}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
                    <div className="p-4 bg-green-50 text-green-600 rounded-2xl font-black">
                        <CheckCircle2 size={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle-2" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">En règle / Avance</p>
                        <h3 className="text-2xl font-black text-gray-900">{filteredDrivers.filter(d => (d.debt || 0) <= 0).length}</h3>
                    </div>
                </div>
            </div>

            {/* Viewport search */}
            <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Rechercher un chauffeur, un bureau ou un numéro..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-3xl shadow-sm focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/5 transition-all font-medium text-gray-700"
                />
            </div>

            {/* Desktop Table view */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Chauffeur</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Bureau</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status Dette</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Solde Actuel</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredDrivers.length > 0 ? filteredDrivers.map((driver) => {
                                const debt = driver.debt || 0;
                                const isPositive = debt > 0;
                                const isNegative = debt < 0;

                                return (
                                    <tr key={driver.id} className="group hover:bg-gray-50/80 transition-all">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{driver.firstName} {driver.lastName}</p>
                                                    <p className="text-xs text-gray-400 font-medium">{driver.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-gray-500 font-medium">
                                                <Building2 size={16} className="text-gray-300" />
                                                {getOfficeName(driver.officeId)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                isPositive ? 'bg-red-50 text-red-600' :
                                                isNegative ? 'bg-green-50 text-green-600' :
                                                'bg-gray-100 text-gray-500'
                                            }`}>
                                                {isPositive ? 'À percevoir' : isNegative ? 'En avance' : 'À jour'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <p className={`text-lg font-black ${isPositive ? 'text-red-600' : isNegative ? 'text-green-600' : 'text-gray-900'}`}>
                                                {debt.toLocaleString()}
                                                <span className="text-[10px] ml-1 opacity-50 uppercase tracking-widest">Ar</span>
                                            </p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-center">
                                                <Link 
                                                    to={`/dashboard/payments?driverId=${driver.id}`}
                                                    className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-all group/btn flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                                                >
                                                    Historique
                                                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-gray-400 italic">
                                            <Search size={40} className="opacity-20" />
                                            <p className="font-medium">Aucun chauffeur trouvé pour cette recherche.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Simple Mock component for CheckCircle2 since it was failing to find it properly in some envs
const CheckCircle2 = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
    </svg>
);

export default Debts;
