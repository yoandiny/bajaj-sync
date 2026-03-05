import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fleetService } from '../../services/fleet.service';
import { Vehicle, Driver, Office } from '../../types';
import { Plus, Edit2, CheckCircle2, FileText, Loader2, Star, RefreshCw, Upload, FileCheck, X } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

const Vehicles = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Vehicle> & { replacementDriverId?: string }>({
    plate: '',
    name: '',
    model: '',
    status: 'ACTIVE',
    insuranceExpiry: '',
    techVisitExpiry: '',
    titularDriverId: '',
    replacementDriverId: '',
    type: 'BAJAJ',
    officeId: ''
  });

  const loadData = async () => {
    try {
      const [v, d, o] = await Promise.all([
        fleetService.getVehicles(),
        fleetService.getDrivers(),
        fleetService.getOffices()
      ]);
      setVehicles(v);
      setDrivers(d);
      setOffices(o);
    } catch (err) {
      console.error('Erreur chargement flotte', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData({
        ...vehicle,
        titularDriverId: (vehicle as any).titularDriverId || (vehicle as any).principal_driver || '',
        replacementDriverId: (vehicle as any).replacementDriverId || (vehicle as any).secondary_driver || ''
      });
    } else {
      setEditingVehicle(null);
      setFormData({
        plate: '',
        name: '',
        model: '',
        status: 'ACTIVE',
        officeId: user?.officeId || (offices.length > 0 ? offices[0].id : ''),
        insuranceExpiry: '',
        techVisitExpiry: '',
        titularDriverId: '',
        replacementDriverId: '',
        type: 'BAJAJ'
      });
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const dataToSave = {
      ...formData,
      company_id: user?.company_id
    };

    console.log('Envoi données véhicule:', dataToSave);

    try {
      if (editingVehicle) {
        await fleetService.updateVehicle(editingVehicle.id, dataToSave);
      } else {
        await fleetService.createVehicle(dataToSave);
      }
      console.log('Véhicule sauvegardé avec succès');
      await loadData();
      setIsModalOpen(false);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erreur lors de la sauvegarde du véhicule.';
      console.error('Erreur sauvegarde véhicule:', err.response?.data || err.message);
      setError(msg);
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-700';
      case 'MAINTENANCE': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Chargement des véhicules...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion de la Flotte</h1>
          <p className="text-gray-500">Liste des véhicules et état technique.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-yellow-500/20"
        >
          <Plus size={20} />
          Ajouter Véhicule
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Véhicule</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Bureau</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Chauffeurs</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Docs</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vehicles.map((vehicle) => {
                const vAny = vehicle as any;
                const titularId = vAny.titularDriverId || vAny.principal_driver;
                const replacementId = vAny.replacementDriverId || vAny.secondary_driver;
                const titular = drivers.find(d => d.id === titularId);
                const replacement = drivers.find(d => d.id === replacementId);
                const office = offices.find(o => o.id === vehicle.officeId);
                return (
                  <tr key={vehicle.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center font-bold text-yellow-600">
                          {vehicle.type === 'MOTO' ? '🏍️' : vehicle.type === 'BUS' ? '🚐' : '🛺'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 leading-tight">{vehicle.name || 'Sans nom'}</p>
                          <p className="text-[10px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded inline-block mt-0.5 border border-blue-100 uppercase">{vehicle.plate}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{vehicle.model}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {office?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {titular ? (
                          <div className="flex items-center gap-1.5">
                            <Star size={11} className="text-blue-500 fill-blue-500 shrink-0" />
                            <span className="text-sm font-bold text-gray-900">{titular.firstName} {titular.lastName}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 italic">Non assigné</span>
                        )}
                        {replacement && (
                          <div className="flex items-center gap-1.5">
                            <RefreshCw size={10} className="text-orange-400 shrink-0" />
                            <span className="text-xs text-gray-500 font-medium">{replacement.firstName} {replacement.lastName}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <FileText size={16} className={vehicle.insuranceExpiry ? 'text-green-500' : 'text-gray-300'} />
                        <FileText size={16} className={vehicle.techVisitExpiry ? 'text-blue-500' : 'text-gray-300'} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(vehicle.status)}`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleOpenModal(vehicle)} className="text-gray-400 hover:text-yellow-600 transition-colors">
                        <Edit2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {vehicles.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500 italic">Aucun véhicule enregistré.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingVehicle ? "Modifier Véhicule" : "Ajouter Véhicule"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-bold">
              ⚠️ {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nom du véhicule</label>
              <input
                type="text" required
                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 font-bold"
                placeholder="ex: Le Brave"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Immatriculation</label>
              <input
                type="text" required
                value={formData.plate} onChange={e => setFormData({ ...formData, plate: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 font-bold"
                placeholder="ex: 1234 TBE"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Modèle / Marque</label>
            <input
              type="text" required
              value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
              placeholder="ex: Bajaj RE 4S 2024"
            />
          </div>

          {user?.role === 'OWNER' && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Bureau de rattachement</label>
              <select
                value={formData.officeId}
                onChange={e => setFormData({ ...formData, officeId: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
              >
                <option value="">Sélectionner un bureau</option>
                {offices.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Chauffeurs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Star size={12} className="text-blue-500 fill-blue-500" /> Chauffeur Titulaire
              </label>
              <select
                value={(formData as any).titularDriverId || ''}
                onChange={e => setFormData({ ...formData, titularDriverId: e.target.value } as any)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
              >
                <option value="">Aucun</option>
                {drivers.map(d => (
                  <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-1">
                <RefreshCw size={12} className="text-orange-400" /> Remplaçant <span className="text-gray-400 font-normal text-xs">(optionnel)</span>
              </label>
              <select
                value={(formData as any).replacementDriverId || ''}
                onChange={e => setFormData({ ...formData, replacementDriverId: e.target.value } as any)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
              >
                <option value="">Aucun</option>
                {drivers.map(d => (
                  <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Type de véhicule</label>
            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 font-bold"
            >
              <option value="BAJAJ">Bajaj / Rickshaw</option>
              <option value="MOTO">Moto / Scooter</option>
              <option value="BUS">Taxi-Brousse / Van</option>
              <option value="OTHER">Autre</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Assurance expire le</label>
              <input
                type="date"
                value={formData.insuranceExpiry} onChange={e => setFormData({ ...formData, insuranceExpiry: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Visite expire le</label>
              <input
                type="date"
                value={formData.techVisitExpiry} onChange={e => setFormData({ ...formData, techVisitExpiry: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Statut opérationnel</label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 font-bold"
            >
              <option value="ACTIVE">Actif / En service</option>
              <option value="MAINTENANCE">En Maintenance</option>
              <option value="STOPPED">À l'arrêt / Panne</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Document Assurance <span className="text-[10px] font-normal lowercase">(Optionnel)</span></label>
              <div className="flex items-center gap-2">
                <label className={`flex-1 flex items-center justify-between px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-all ${formData.insuranceUrl ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 hover:border-yellow-400'}`}>
                  <div className="flex items-center gap-2 overflow-hidden">
                    {formData.insuranceUrl ? <FileCheck size={18} /> : <FileText size={18} className="text-gray-400" />}
                    <span className="text-sm font-bold truncate">
                      {formData.insuranceUrl ? 'Assurance chargée' : 'Séléctionner PDF/Image'}
                    </span>
                  </div>
                  <Upload size={16} className={formData.insuranceUrl ? 'hidden' : 'text-gray-400'} />
                  <input
                    type="file" className="hidden" accept="image/*,.pdf"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          setSubmitting(true);
                          const url = await fleetService.uploadFile(file, 'vehicles/insurance');
                          setFormData({ ...formData, insuranceUrl: url });
                        } catch (err) { alert("Erreur upload"); } finally { setSubmitting(false); }
                      }
                    }}
                  />
                </label>
                {formData.insuranceUrl && (
                  <button type="button" onClick={() => setFormData({ ...formData, insuranceUrl: '' })} className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200"><X size={18} /></button>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Carte Grise / Papiers <span className="text-[10px] font-normal lowercase">(Optionnel)</span></label>
              <div className="flex items-center gap-2">
                <label className={`flex-1 flex items-center justify-between px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-all ${formData.registrationUrl ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 hover:border-yellow-400'}`}>
                  <div className="flex items-center gap-2 overflow-hidden">
                    {formData.registrationUrl ? <FileCheck size={18} /> : <FileText size={18} className="text-gray-400" />}
                    <span className="text-sm font-bold truncate">
                      {formData.registrationUrl ? 'Document chargé' : 'Séléctionner PDF/Image'}
                    </span>
                  </div>
                  <Upload size={16} className={formData.registrationUrl ? 'hidden' : 'text-gray-400'} />
                  <input
                    type="file" className="hidden" accept="image/*,.pdf"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          setSubmitting(true);
                          const url = await fleetService.uploadFile(file, 'vehicles/registration');
                          setFormData({ ...formData, registrationUrl: url });
                        } catch (err) { alert("Erreur upload"); } finally { setSubmitting(false); }
                      }
                    }}
                  />
                </label>
                {formData.registrationUrl && (
                  <button type="button" onClick={() => setFormData({ ...formData, registrationUrl: '' })} className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200"><X size={18} /></button>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold mt-4 shadow-lg shadow-yellow-500/30 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Traitement...
              </>
            ) : (
              <>
                <CheckCircle2 size={20} />
                {editingVehicle ? "Mettre à jour" : "Enregistrer le véhicule"}
              </>
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Vehicles;
