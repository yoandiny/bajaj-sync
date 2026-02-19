import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_PAYMENTS, MOCK_VEHICLES, MOCK_DRIVERS, MOCK_OFFICES } from '../../data/mock';
import { Payment } from '../../types';
import { Plus, Filter, Calendar, AlertCircle } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { SearchableSelect } from '../../components/ui/SearchableSelect';
import { generateUUID } from '../../lib/utils';

const Payments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>(
    user?.role === 'ADMIN' ? MOCK_PAYMENTS : MOCK_PAYMENTS.filter(p => p.officeId === user?.officeId)
  );
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  
  // Data Filtering Context
  const myVehicles = useMemo(() => 
    user?.role === 'ADMIN' ? MOCK_VEHICLES : MOCK_VEHICLES.filter(v => v.officeId === user?.officeId),
  [user]);
  
  const myDrivers = useMemo(() => 
    user?.role === 'ADMIN' ? MOCK_DRIVERS : MOCK_DRIVERS.filter(d => d.officeId === user?.officeId),
  [user]);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    vehicleId: '',
    driverId: '',
    notes: ''
  });

  // Helper to check Rest Day
  const isRestDay = (dateStr: string) => {
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay(); // 0 = Sunday
    
    // Find settings for current context
    let settings = { restDay: -1 }; // Default no rest day
    if (user?.role === 'MANAGER') {
       const office = MOCK_OFFICES.find(o => o.id === user.officeId);
       if (office?.settings) settings = office.settings;
    } else {
       // Admin: check based on selected vehicle's office or default
       if (MOCK_OFFICES[0]?.settings) settings = MOCK_OFFICES[0].settings;
    }
    
    return dayOfWeek === settings.restDay;
  };

  // Helper to get default amount
  const getDefaultAmount = () => {
    if (user?.role === 'MANAGER') {
        const office = MOCK_OFFICES.find(o => o.id === user.officeId);
        if (office?.settings?.dailyTargetAmount) {
            return office.settings.dailyTargetAmount.toString();
        }
    }
    // For Admin, we could default to the first office or 0
    // If Admin selects a vehicle, we could update it, but for initial state:
    if (user?.role === 'ADMIN' && MOCK_OFFICES[0]?.settings?.dailyTargetAmount) {
        return MOCK_OFFICES[0].settings.dailyTargetAmount.toString();
    }
    return '';
  };

  const handleOpenModal = () => {
      setFormData({
          date: new Date().toISOString().split('T')[0],
          amount: getDefaultAmount(),
          vehicleId: '',
          driverId: '',
          notes: ''
      });
      setIsModalOpen(true);
  };

  const handleVehicleChange = (vehicleId: string) => {
    const vehicle = myVehicles.find(v => v.id === vehicleId);
    setFormData(prev => ({
      ...prev,
      vehicleId,
      // Auto-select titular driver if available
      driverId: vehicle?.titularDriverId || prev.driverId
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPayment: Payment = {
      id: generateUUID(),
      date: formData.date,
      amount: Number(formData.amount),
      vehicleId: formData.vehicleId,
      driverId: formData.driverId,
      officeId: user?.officeId || MOCK_OFFICES[0].id,
      isRestDay: isRestDay(formData.date),
      notes: formData.notes
    };
    setPayments([newPayment, ...payments]);
    setIsModalOpen(false);
  };

  // Filtered List
  const filteredPayments = payments.filter(p => {
    if (filterDate && p.date !== filterDate) return false;
    return true;
  });

  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Versements</h1>
          <p className="text-gray-500">Suivi des recettes journalières.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 flex items-center gap-2">
            <span className="text-sm text-gray-500">Total affiché:</span>
            <span className="font-bold text-green-600">{totalAmount.toLocaleString()} Ar</span>
          </div>
          <button 
            onClick={handleOpenModal}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-yellow-500/20"
          >
            <Plus size={20} />
            Nouveau Versement
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
        <Filter size={20} className="text-gray-400" />
        <input 
          type="date" 
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="bg-gray-50 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
        />
        {filterDate && (
            <button onClick={() => setFilterDate('')} className="text-xs text-red-500 font-bold hover:underline">Effacer filtre</button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Véhicule</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Chauffeur</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Montant</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPayments.map((payment) => {
              const vehicle = myVehicles.find(v => v.id === payment.vehicleId);
              const driver = myDrivers.find(d => d.id === payment.driverId);
              return (
                <tr key={payment.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{payment.date}</span>
                        {payment.isRestDay && (
                            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold uppercase">Repos</span>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">{vehicle?.plate || 'Inconnu'}</td>
                  <td className="px-6 py-4 text-gray-600">{driver?.firstName} {driver?.lastName}</td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900">{payment.amount.toLocaleString()} Ar</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredPayments.length === 0 && (
            <div className="p-8 text-center text-gray-500">Aucun versement trouvé.</div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ajouter un Versement"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
            <input 
              type="date" required
              value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
            />
            {isRestDay(formData.date) && (
                <div className="mt-2 flex items-center gap-2 text-blue-600 text-xs font-bold bg-blue-50 p-2 rounded-lg">
                    <Calendar size={14} />
                    C'est un jour de repos. Ce versement sera marqué comme exceptionnel.
                </div>
            )}
          </div>

          <SearchableSelect
            label="Véhicule"
            options={myVehicles.map(v => ({ id: v.id, label: v.plate, subLabel: v.model }))}
            value={formData.vehicleId}
            onChange={handleVehicleChange}
            placeholder="Choisir véhicule..."
          />

          <SearchableSelect
            label="Chauffeur"
            options={myDrivers.map(d => ({ id: d.id, label: `${d.firstName} ${d.lastName}`, subLabel: d.phone }))}
            value={formData.driverId}
            onChange={(val) => setFormData({...formData, driverId: val})}
            placeholder="Choisir chauffeur..."
          />

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Montant (Ar)</label>
            <input 
              type="number" required min="0"
              value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 font-bold"
              placeholder="ex: 40000"
            />
            <p className="text-xs text-gray-400 mt-1 ml-1">Montant cible par défaut appliqué.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Notes (Optionnel)</label>
            <textarea 
              value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 h-20 resize-none"
              placeholder="Remarques..."
            />
          </div>

          <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-bold mt-4 shadow-lg shadow-yellow-500/20">
            Enregistrer le versement
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Payments;
