import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fleetService } from '../../services/fleet.service';
import { Payment, Vehicle, Driver, Office } from '../../types';
import { Plus, Filter, Calendar, CheckCircle2, Wallet, ReceiptText, Loader2, Edit2, Trash2, Moon } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

const Payments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [filterDate, setFilterDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    vehicleId: '',
    driverId: '',
    notes: ''
  });

  const loadData = async () => {
    try {
      const [p, v, d, o] = await Promise.all([
        fleetService.getPayments(),
        fleetService.getVehicles(),
        fleetService.getDrivers(),
        fleetService.getOffices()
      ]);
      setPayments(p);
      setVehicles(v);
      setDrivers(d);
      setOffices(o);
    } catch (err) {
      console.error('Erreur chargement paiements', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (payment?: Payment) => {
    if (payment) {
      // Mode édition
      setEditingPayment(payment);
      setFormData({
        date: payment.date,
        amount: String(payment.amount),
        vehicleId: payment.vehicleId || '',
        driverId: payment.driverId || '',
        notes: payment.notes || ''
      });
    } else {
      // Mode création
      setEditingPayment(null);
      let defaultAmount = '30000';
      if (user?.officeId) {
        const office = offices.find(o => o.id === user.officeId);
        if (office?.settings?.dailyTargetAmount) {
          defaultAmount = office.settings.dailyTargetAmount.toString();
        }
      }
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: defaultAmount,
        vehicleId: '',
        driverId: '',
        notes: ''
      });
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleVehicleChange = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    setFormData(prev => ({
      ...prev,
      vehicleId,
      driverId: (vehicle as any).principal_driver || (vehicle as any).titularDriverId || prev.driverId
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const dataToSave = {
      ...formData,
      amount: Number(formData.amount)
    };

    try {
      if (editingPayment) {
        await fleetService.updatePayment(editingPayment.id, dataToSave);
      } else {
        await fleetService.createPayment(dataToSave);
      }
      await loadData();
      setIsModalOpen(false);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erreur lors de l\'enregistrement du versement.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (payment: Payment) => {
    const vehicle = vehicles.find(v => v.id === payment.vehicleId);
    const label = `${new Date(payment.date).toLocaleDateString()} — ${vehicle?.name || vehicle?.plate} — ${payment.amount.toLocaleString()} Ar`;

    if (!window.confirm(`⚠️ Confirmer la suppression du versement :\n\n${label}\n\nCette action est irréversible.`)) return;

    try {
      await fleetService.deletePayment(payment.id);
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur lors de la suppression.');
    }
  };

  const filteredPayments = payments.filter(p => {
    if (filterDate && p.date !== filterDate) return false;
    return true;
  });

  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Chargement des versements...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Versements</h1>
          <p className="text-gray-500">Suivi des recettes journalières de votre flotte.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border-2 border-green-100 rounded-2xl px-5 py-2.5 flex flex-col shadow-sm">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Période</span>
            <span className="font-black text-green-600 text-lg">{totalAmount.toLocaleString()} Ar</span>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-yellow-500/30 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Plus size={20} />
            Nouveau Versement
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
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Date & Infos</th>
                {user?.role === 'OWNER' && (
                  <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Bureau</th>
                )}
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Véhicule</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Chauffeur</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Montant</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPayments.map((payment) => {
                const vehicle = vehicles.find(v => v.id === payment.vehicleId);
                const driver = drivers.find(d => d.id === payment.driverId);
                return (
                  <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-blue-400" />
                        <span className="font-bold text-gray-900">{new Date(payment.date).toLocaleDateString()}</span>
                        {payment.isRestDay && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[9px] font-black uppercase tracking-tighter">
                            <Moon size={9} /> Repos
                          </span>
                        )}
                      </div>
                      {payment.notes && (
                        <p className="text-[11px] text-gray-400 italic mt-0.5 pl-5">{payment.notes}</p>
                      )}
                    </td>
                    {user?.role === 'OWNER' && (
                      <td className="px-6 py-4">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded-lg">
                          {payment.officeName || '---'}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <p className="font-extrabold text-blue-600 leading-tight">{vehicle?.name || vehicle?.plate || '---'}</p>
                      {vehicle?.name && <p className="text-[10px] text-gray-400 font-mono uppercase">{vehicle.plate}</p>}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600 group-hover:text-gray-900">
                      {driver?.firstName} {driver?.lastName}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-black text-gray-900 text-base">{payment.amount.toLocaleString()} Ar</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenModal(payment)}
                          className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(payment)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredPayments.length === 0 && (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <ReceiptText size={48} className="text-gray-200" />
            <p className="text-gray-400 font-medium italic">Aucun versement enregistré sur cette période.</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPayment ? "Modifier le Versement" : "Enregistrer un Versement"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm font-bold">
              ⚠️ {error}
            </div>
          )}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Date du versement</label>
            <input
              type="date" required
              value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Véhicule concerné</label>
            <select
              value={formData.vehicleId}
              onChange={(e) => handleVehicleChange(e.target.value)}
              required
              className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-bold appearance-none"
            >
              <option value="">Sélectionner un véhicule</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.name ? `${v.name} (${v.plate})` : v.plate} - {v.model}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Chauffeur qui effectue le versement</label>
            <select
              value={formData.driverId}
              onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
              required
              className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-bold appearance-none"
            >
              <option value="">Sélectionner un chauffeur</option>
              {drivers.map(d => (
                <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Montant versé (Ar)</label>
            <div className="relative">
              <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="number" required min="1"
                value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-black text-lg text-green-600"
                placeholder="ex: 40000"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Notes ou observations</label>
            <textarea
              value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white h-24 resize-none font-medium"
              placeholder="Ex: Versement partiel, panne signalée..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white py-4 rounded-[1.5rem] font-extrabold text-lg mt-4 shadow-lg shadow-yellow-500/30 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                Traitement...
              </>
            ) : (
              <>
                <CheckCircle2 size={24} />
                {editingPayment ? "Modifier le versement" : "Valider le versement"}
              </>
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Payments;
