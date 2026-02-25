import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fleetService } from '../../services/fleet.service';
import { Expense, Vehicle, Driver, ExpenseScope } from '../../types';
import { Plus, Filter, Receipt, CheckCircle2, ShoppingCart, Settings, CreditCard, Loader2, User } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

const Expenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    date: string;
    amount: string;
    scope: ExpenseScope;
    vehicleId: string;
    driverId: string;
    description: string;
  }>({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    scope: 'GENERAL',
    vehicleId: '',
    driverId: '',
    description: ''
  });

  const loadData = async () => {
    try {
      const [e, v, d] = await Promise.all([
        fleetService.getExpenses(),
        fleetService.getVehicles(),
        fleetService.getDrivers(),
      ]);
      setExpenses(e);
      setVehicles(v);
      setDrivers(d);
    } catch (err) {
      console.error('Erreur chargement dépenses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const dataToSave = {
      ...formData,
      amount: Number(formData.amount),
      category: 'Divers' // Catégorie fixe, la justification suffit
    };

    try {
      await fleetService.createExpense(dataToSave);
      await loadData();
      setIsModalOpen(false);
      setFormData({ ...formData, amount: '', description: '' });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erreur lors de l\'enregistrement de la dépense.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredExpenses = expenses.filter(e => {
    if (filterDate && e.date !== filterDate) return false;
    return true;
  });

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const getScopeLabel = (expense: Expense) => {
    const vehicle = vehicles.find(v => v.id === expense.vehicleId);
    const driver = drivers.find(d => d.id === expense.driverId);
    if (expense.scope === 'VEHICLE' && vehicle) return `🛺 ${vehicle.name || vehicle.plate}`;
    if (expense.scope === 'DRIVER' && driver) return `👤 ${driver.firstName} ${driver.lastName}`;
    if (expense.scope === 'BOTH') return `${vehicle?.name || vehicle?.plate || '?'} + ${driver?.lastName || '?'}`;
    return '🏢 Agence';
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Chargement des dépenses...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dépenses</h1>
          <p className="text-gray-500">Suivi des coûts d'exploitation (entretien, pièces, frais).</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border-2 border-red-50 rounded-2xl px-5 py-2.5 flex flex-col shadow-sm">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Dépenses</span>
            <span className="font-black text-red-600 text-lg">{totalExpenses.toLocaleString()} Ar</span>
          </div>
          <button
            onClick={() => { setError(null); setIsModalOpen(true); }}
            className="bg-gray-900 hover:bg-black text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg transition-all hover:scale-[1.02] active:scale-95"
          >
            <Plus size={20} />
            Nouvelle Dépense
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center gap-4 shadow-sm">
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
          <Filter size={18} className="text-gray-400" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-transparent border-none text-sm font-bold focus:outline-none text-gray-700"
          />
        </div>
        {filterDate && (
          <button onClick={() => setFilterDate('')} className="text-xs text-red-500 font-bold hover:underline bg-red-50 px-3 py-2 rounded-lg">Effacer le filtre</button>
        )}
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
                {user?.role === 'OWNER' && (
                  <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Bureau</th>
                )}
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Concerne</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Justification</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{new Date(expense.date).toLocaleDateString()}</td>
                  {user?.role === 'OWNER' && (
                    <td className="px-6 py-4">
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded-lg">
                        {expense.officeName || '---'}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4 text-sm font-bold text-gray-600">{getScopeLabel(expense)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 italic max-w-xs truncate">
                    {expense.description || <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-black text-red-600 text-base">-{expense.amount.toLocaleString()} Ar</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredExpenses.length === 0 && (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <Receipt size={48} className="text-gray-200" />
            <p className="text-gray-400 font-medium italic">Aucune dépense enregistrée.</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Enregistrer une Dépense"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm font-bold">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Date</label>
            <input
              type="date" required
              value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-bold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Concerne</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { val: 'GENERAL', label: 'Agence / Générale', icon: Settings },
                { val: 'VEHICLE', label: 'Véhicule', icon: CreditCard },
                { val: 'DRIVER', label: 'Chauffeur', icon: User },
                { val: 'BOTH', label: 'Véhicule + Chauffeur', icon: CreditCard }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setFormData({ ...formData, scope: opt.val as any })}
                  className={`py-3 px-4 rounded-2xl text-[11px] font-black uppercase tracking-wider border-2 transition-all flex items-center justify-center gap-2 ${formData.scope === opt.val
                    ? 'bg-gray-900 text-white border-gray-900 shadow-lg'
                    : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                    }`}
                >
                  <opt.icon size={14} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {(formData.scope === 'VEHICLE' || formData.scope === 'BOTH') && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Véhicule</label>
              <select
                value={formData.vehicleId}
                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                required
                className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-bold appearance-none"
              >
                <option value="">Choisir...</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.name ? `${v.name} (${v.plate})` : v.plate}</option>
                ))}
              </select>
            </div>
          )}

          {(formData.scope === 'DRIVER' || formData.scope === 'BOTH') && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Chauffeur</label>
              <select
                value={formData.driverId}
                onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                required
                className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-bold appearance-none"
              >
                <option value="">Choisir...</option>
                {drivers.map(d => (
                  <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Montant (Ar)</label>
            <div className="relative">
              <ShoppingCart className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="number" required min="1"
                value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-black text-lg text-red-600"
                placeholder="ex: 15000"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Justification <span className="text-gray-400 font-normal text-xs">(requis)</span></label>
            <input
              type="text" required
              value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-medium"
              placeholder="Ex: Achat bougie d'allumage, vidange huile..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gray-900 hover:bg-black disabled:bg-gray-200 disabled:cursor-not-allowed text-white py-4 rounded-[1.5rem] font-extrabold text-lg mt-4 shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <CheckCircle2 size={24} />
                Enregistrer la dépense
              </>
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Expenses;
