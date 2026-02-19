import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_EXPENSES, MOCK_VEHICLES, MOCK_DRIVERS, MOCK_OFFICES } from '../../data/mock';
import { Expense, ExpenseScope } from '../../types';
import { Plus, Filter, Receipt } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { SearchableSelect } from '../../components/ui/SearchableSelect';
import { generateUUID } from '../../lib/utils';

const Expenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>(
    user?.role === 'ADMIN' ? MOCK_EXPENSES : MOCK_EXPENSES.filter(e => e.officeId === user?.officeId)
  );
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterDate, setFilterDate] = useState('');

  const myVehicles = useMemo(() => 
    user?.role === 'ADMIN' ? MOCK_VEHICLES : MOCK_VEHICLES.filter(v => v.officeId === user?.officeId),
  [user]);
  
  const myDrivers = useMemo(() => 
    user?.role === 'ADMIN' ? MOCK_DRIVERS : MOCK_DRIVERS.filter(d => d.officeId === user?.officeId),
  [user]);

  const [formData, setFormData] = useState<{
    date: string;
    amount: string;
    category: string;
    scope: ExpenseScope;
    vehicleId: string;
    driverId: string;
    description: string;
  }>({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'Carburant',
    scope: 'GENERAL',
    vehicleId: '',
    driverId: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: Expense = {
      id: generateUUID(),
      date: formData.date,
      amount: Number(formData.amount),
      category: formData.category,
      scope: formData.scope,
      vehicleId: formData.scope === 'GENERAL' || formData.scope === 'DRIVER' ? undefined : formData.vehicleId,
      driverId: formData.scope === 'GENERAL' || formData.scope === 'VEHICLE' ? undefined : formData.driverId,
      officeId: user?.officeId || MOCK_OFFICES[0].id,
      description: formData.description
    };
    setExpenses([newExpense, ...expenses]);
    setIsModalOpen(false);
    // Reset form
    setFormData({ ...formData, amount: '', description: '' });
  };

  const filteredExpenses = expenses.filter(e => {
    if (filterDate && e.date !== filterDate) return false;
    return true;
  });

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dépenses</h1>
          <p className="text-gray-500">Gestion des coûts opérationnels.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 flex items-center gap-2">
                <span className="text-sm text-gray-500">Total:</span>
                <span className="font-bold text-red-600">{totalExpenses.toLocaleString()} Ar</span>
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-gray-900 hover:bg-black text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg"
            >
                <Plus size={20} />
                Nouvelle Dépense
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
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Catégorie</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Concerne</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Montant</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredExpenses.map((expense) => {
              const vehicle = myVehicles.find(v => v.id === expense.vehicleId);
              const driver = myDrivers.find(d => d.id === expense.driverId);
              
              let concernText = 'Général';
              if (expense.scope === 'VEHICLE' && vehicle) concernText = vehicle.plate;
              if (expense.scope === 'DRIVER' && driver) concernText = `${driver.firstName} ${driver.lastName}`;
              if (expense.scope === 'BOTH') concernText = `${vehicle?.plate} / ${driver?.firstName}`;

              return (
                <tr key={expense.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-gray-900">{expense.date}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-bold text-gray-600 uppercase">
                        {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{concernText}</td>
                  <td className="px-6 py-4 text-right font-bold text-red-600">-{expense.amount.toLocaleString()} Ar</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ajouter une Dépense"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                <input 
                type="date" required
                value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Catégorie</label>
                <select 
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                >
                    <option>Carburant</option>
                    <option>Maintenance</option>
                    <option>Réparation</option>
                    <option>Salaire</option>
                    <option>Administratif</option>
                    <option>Divers</option>
                </select>
            </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 mb-1">Portée de la dépense</label>
             <div className="grid grid-cols-2 gap-2">
                {[
                    { val: 'GENERAL', label: 'Générale' },
                    { val: 'VEHICLE', label: 'Véhicule' },
                    { val: 'DRIVER', label: 'Chauffeur' },
                    { val: 'BOTH', label: 'Véhicule + Chauffeur' }
                ].map(opt => (
                    <button
                        key={opt.val}
                        type="button"
                        onClick={() => setFormData({...formData, scope: opt.val as any})}
                        className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                            formData.scope === opt.val 
                            ? 'bg-gray-900 text-white border-gray-900' 
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {opt.label}
                    </button>
                ))}
             </div>
          </div>

          {(formData.scope === 'VEHICLE' || formData.scope === 'BOTH') && (
             <SearchableSelect
                label="Véhicule concerné"
                options={myVehicles.map(v => ({ id: v.id, label: v.plate, subLabel: v.model }))}
                value={formData.vehicleId}
                onChange={(val) => setFormData({...formData, vehicleId: val})}
             />
          )}

          {(formData.scope === 'DRIVER' || formData.scope === 'BOTH') && (
             <SearchableSelect
                label="Chauffeur concerné"
                options={myDrivers.map(d => ({ id: d.id, label: `${d.firstName} ${d.lastName}`, subLabel: d.phone }))}
                value={formData.driverId}
                onChange={(val) => setFormData({...formData, driverId: val})}
             />
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Montant (Ar)</label>
            <input 
              type="number" required min="0"
              value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
            <input 
              type="text" required
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
              placeholder="Détails de la dépense..."
            />
          </div>

          <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-bold mt-4 shadow-lg">
            Enregistrer la dépense
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Expenses;
