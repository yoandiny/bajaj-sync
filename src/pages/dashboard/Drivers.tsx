import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fleetService } from '../../services/fleet.service';
import { Driver, Office } from '../../types';
import { Plus, Edit2, Phone, CreditCard, User, Building, CheckCircle2, Loader2, Car, Star, RefreshCw, Upload, X } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

const Drivers = () => {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Driver>>({
    firstName: '',
    lastName: '',
    phone: '',
    licenseNumber: '',
    status: 'ACTIVE'
  });

  const loadData = async () => {
    try {
      const [d, o] = await Promise.all([
        fleetService.getDrivers(),
        fleetService.getOffices()
      ]);
      setDrivers(d);
      setOffices(o);
    } catch (err) {
      console.error('Erreur chargement chauffeurs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (driver?: Driver) => {
    if (driver) {
      setEditingDriver(driver);
      setFormData(driver);
    } else {
      setEditingDriver(null);
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        licenseNumber: '',
        status: 'ACTIVE',
        officeId: user?.officeId || (offices.length > 0 ? offices[0].id : '')
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

    console.log('Envoi données chauffeur:', dataToSave);

    try {
      if (editingDriver) {
        await fleetService.updateDriver(editingDriver.id, dataToSave);
      } else {
        await fleetService.createDriver(dataToSave);
      }
      console.log('Chauffeur sauvegardé avec succès');
      await loadData();
      setIsModalOpen(false);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erreur lors de la sauvegarde du chauffeur.';
      console.error('Erreur sauvegarde chauffeur:', err.response?.data || err.message);
      setError(msg);
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleBadge = (driver: any) => {
    if (driver.vehicleRole === 'TITULAR') {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider">
          <Star size={9} className="fill-blue-600" />
          Titulaire
        </span>
      );
    }
    if (driver.vehicleRole === 'REPLACEMENT') {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-wider">
          <RefreshCw size={9} />
          Remplaçant
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-wider">
        Non affecté
      </span>
    );
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Chargement des chauffeurs...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Chauffeurs</h1>
          <p className="text-gray-500">Liste des conducteurs, leurs rôles et leurs véhicules.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-yellow-500/20"
        >
          <Plus size={20} />
          Ajouter Chauffeur
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map((driver: any) => {
          const office = offices.find(o => o.id === driver.officeId);
          return (
            <div key={driver.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center text-xl font-bold text-gray-600 group-hover:bg-yellow-500 group-hover:text-white transition-colors shadow-inner overflow-hidden border-2 border-white">
                  {driver.photoUrl ? (
                    <img src={driver.photoUrl} alt="Photo" className="w-full h-full object-cover" />
                  ) : (
                    <span>{driver.firstName.charAt(0)}{driver.lastName.charAt(0)}</span>
                  )}
                </div>
                <button onClick={() => handleOpenModal(driver)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-yellow-600 transition-colors">
                  <Edit2 size={18} />
                </button>
              </div>

              <h3 className="text-lg font-extrabold text-gray-900">{driver.firstName} {driver.lastName}</h3>

              {/* Badges : Statut + Rôle + Agence */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${driver.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                  driver.status === 'SUSPENDED' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                  {driver.status === 'ACTIVE' ? 'Actif' : driver.status === 'SUSPENDED' ? 'Suspendu' : 'Inactif'}
                </span>
                {getRoleBadge(driver)}
                {office && (
                  <span className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase">
                    <Building size={10} /> {office.name}
                  </span>
                )}
              </div>

              {/* Dette du chauffeur */}
              <div className="mt-4 flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${driver.debt > 0 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                    <CreditCard size={14} />
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">Solde Dette</span>
                </div>
                <span className={`text-base font-black ${driver.debt > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  {Number(driver.debt || 0).toLocaleString()} Ar
                </span>
              </div>

              {/* Véhicule associé */}
              {driver.vehicleId && (
                <div className="mt-4 bg-gray-50 rounded-2xl px-4 py-3 flex items-center gap-3 border border-gray-100">
                  <div className="p-2 bg-yellow-100 rounded-xl text-yellow-600">
                    <Car size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-700 leading-tight">
                      {driver.vehicleName || driver.vehiclePlate}
                    </p>
                    {driver.vehicleName && (
                      <p className="text-[10px] font-mono text-gray-400 uppercase">{driver.vehiclePlate}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-3 mt-4 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><Phone size={14} /></div>
                  {driver.phone}
                </div>
                {(driver.licenseNumber || driver.cin) && (
                  <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-500"><CreditCard size={14} /></div>
                    CIN/Permis: <span className="font-mono font-bold text-gray-900">{driver.licenseNumber || driver.cin}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {drivers.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 italic">Aucun chauffeur enregistré.</div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDriver ? "Modifier Chauffeur" : "Ajouter Chauffeur"}
      >
        <div className="space-y-6">
          {/* Section Photo */}
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="relative group">
              <div className="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
                {formData.photoUrl ? (
                  <img src={formData.photoUrl} alt="Aperçu" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-gray-300" />
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-xl cursor-pointer shadow-lg transition-transform hover:scale-110">
                <Upload size={16} />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        setSubmitting(true);
                        const url = await fleetService.uploadFile(file, 'drivers');
                        setFormData({ ...formData, photoUrl: url });
                      } catch (err) {
                        alert("Erreur lors de l'upload de la photo");
                      } finally {
                        setSubmitting(false);
                      }
                    }
                  }}
                />
              </label>
              {formData.photoUrl && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, photoUrl: '' })}
                  className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Photo du Chauffeur <span className="font-normal lowercase">(Facultatif)</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm font-bold animate-shake">
                ⚠️ {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Prénom</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text" required
                    value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-bold"
                    placeholder="ex: Jean"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nom</label>
                <input
                  type="text" required
                  value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-bold"
                  placeholder="ex: Rakoto"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel" required
                  value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-bold"
                  placeholder="034 00 000 00"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Numéro Permis / CIN</label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text" required
                  value={(formData as any).cin || (formData as any).licenseNumber || ''}
                  onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-bold"
                  placeholder="Référence pièce d'identité"
                />
              </div>
            </div>

            {user?.role === 'OWNER' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Bureau de rattachement</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    value={formData.officeId}
                    onChange={e => setFormData({ ...formData, officeId: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-bold appearance-none"
                  >
                    <option value="">Sélectionner un bureau</option>
                    {offices.map(o => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Statut disciplinaire</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-bold"
              >
                <option value="ACTIVE">Actif / En règle</option>
                <option value="INACTIVE">Inactif / Congé</option>
                <option value="SUSPENDED">Suspendu / Sanction</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Dette actuelle (Ar)</label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="number"
                  value={(formData as any).debt || 0}
                  onChange={e => setFormData({ ...formData, debt: Number(e.target.value) } as any)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all font-bold text-orange-600"
                  placeholder="Montant de la dette"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold mt-4 shadow-lg shadow-yellow-500/30 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                <>
                  <CheckCircle2 size={24} />
                  {editingDriver ? "Confirmer les modifications" : "Ajouter le chauffeur"}
                </>
              )}
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Drivers;
