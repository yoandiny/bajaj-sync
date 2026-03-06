import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fleetService } from '../../services/fleet.service';
import { Office, User } from '../../types';
import { Plus, MapPin, User as UserIcon, Edit2, Building2, Target, Calendar, Trash2, Loader2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

const Offices = () => {
  const { user } = useAuth();
  const [offices, setOffices] = useState<Office[]>([]);
  const [managers, setManagers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffice, setEditingOffice] = useState<Office | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    managerId: '',
    dailyTargetAmount: 30000,
    restDay: 0
  });

  const loadData = async () => {
    try {
      const [o, u] = await Promise.all([
        fleetService.getOffices(),
        fleetService.getManagers()
      ]);
      setOffices(o);
      setManagers(u.filter(m => m.role === 'MANAGER'));
    } catch (err) {
      console.error('Erreur chargement bureaux', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (office?: Office) => {
    if (office) {
      setEditingOffice(office);
      setFormData({
        name: office.name,
        location: office.location,
        managerId: office.managerId,
        dailyTargetAmount: office.settings?.dailyTargetAmount || 30000,
        restDay: office.settings?.restDay || 0
      });
    } else {
      setEditingOffice(null);
      setFormData({ name: '', location: '', managerId: '', dailyTargetAmount: 30000, restDay: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        company_id: user?.company_id,
        settings: {
          dailyTargetAmount: formData.dailyTargetAmount,
          restDay: formData.restDay
        }
      };

      if (editingOffice) {
        await fleetService.updateOffice(editingOffice.id, payload);
      } else {
        await fleetService.createOffice(payload);
      }

      await loadData();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Erreur sauvegarde bureau', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOffice = async (id: string, name: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'agence "${name}" ?`)) return;

    try {
      await fleetService.deleteOffice(id);
      loadData();
    } catch (err) {
      console.error('Erreur lors de la suppression du bureau', err);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Chargement des agences...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Agences</h1>
          <p className="text-gray-500">Configurez vos points de gestion et assignez des responsables.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-yellow-500/20 self-start sm:self-auto"
        >
          <Plus size={20} />
          Nouvelle Agence
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offices.map((office) => {
          const manager = managers.find(m => m.id === office.managerId);
          return (
            <div key={office.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-yellow-50 text-yellow-600 rounded-2xl shadow-inner">
                  <Building2 size={24} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(office)} className="p-2 hover:bg-yellow-50 rounded-xl text-gray-400 hover:text-yellow-600 transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDeleteOffice(office.id, office.name)} className="p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-extrabold text-gray-900 mb-1">{office.name}</h3>

              <div className="space-y-4 mt-4">
                <div className="flex items-center gap-3 text-sm text-gray-600 font-medium bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <MapPin size={18} className="text-red-400" />
                  {office.location}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 font-medium px-1">
                  <UserIcon size={18} className="text-gray-400" />
                  <span>Gérant : <span className="text-gray-900 font-bold">{manager ? `${manager.firstName} ${manager.lastName}` : 'Non assigné'}</span></span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-50">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Objectif Jour</span>
                    <div className="flex items-center gap-1 text-sm font-bold text-gray-900">
                      <Target size={14} className="text-yellow-500" />
                      {office.settings?.dailyTargetAmount?.toLocaleString() || '30,000'} Ar
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Repos</span>
                    <div className="flex items-center gap-1 text-sm font-bold text-gray-900">
                      <Calendar size={14} className="text-blue-500" />
                      {['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][office.settings?.restDay || 0]}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {offices.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 italic">Aucune agence configurée.</div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOffice ? "Paramétrage de l'agence" : "Créer une nouvelle agence"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nom de l'agence / point de vente</label>
            <input
              type="text" required
              value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-bold"
              placeholder="ex: Agence Analakely"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Ville / Quartier</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text" required
                value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-bold"
                placeholder="ex: Antananarivo, Madagascar"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Assigner un Gérant</label>
            <select
              value={formData.managerId}
              onChange={e => setFormData({ ...formData, managerId: e.target.value })}
              className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-bold appearance-none"
            >
              <option value="">Sélectionner un manager</option>
              {managers.map(m => (
                <option key={m.id} value={m.id}>{m.firstName} {m.lastName} ({m.phone})</option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Recette journalière (cible)</label>
              <input
                type="number"
                value={formData.dailyTargetAmount} onChange={e => setFormData({ ...formData, dailyTargetAmount: parseInt(e.target.value) })}
                className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Jour de repos (Off)</label>
              <select
                value={formData.restDay}
                onChange={e => setFormData({ ...formData, restDay: parseInt(e.target.value) })}
                className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-bold"
              >
                <option value={0}>Dimanche</option>
                <option value={1}>Lundi</option>
                <option value={2}>Mardi</option>
                <option value={3}>Mercredi</option>
                <option value={4}>Jeudi</option>
                <option value={5}>Vendredi</option>
                <option value={6}>Samedi</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold mt-4 shadow-lg shadow-yellow-500/30 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Traitement en cours...
              </>
            ) : (
              editingOffice ? 'Mettre à jour les paramètres' : 'Créer l\'agence'
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Offices;
