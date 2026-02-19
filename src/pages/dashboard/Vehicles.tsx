import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_VEHICLES, MOCK_DRIVERS, MOCK_OFFICES } from '../../data/mock';
import { Vehicle } from '../../types';
import { Plus, Edit2, Trash2, AlertCircle, CheckCircle2, FileText } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { generateUUID } from '../../lib/utils';

const Vehicles = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>(
    user?.role === 'ADMIN' ? MOCK_VEHICLES : MOCK_VEHICLES.filter(v => v.officeId === user?.officeId)
  );
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Filtered drivers for selection
  const availableDrivers = user?.role === 'ADMIN' 
    ? MOCK_DRIVERS 
    : MOCK_DRIVERS.filter(d => d.officeId === user?.officeId);

  const [formData, setFormData] = useState<Partial<Vehicle>>({
    plate: '',
    type: 'BAJAJ',
    model: '',
    status: 'ACTIVE',
    insuranceExpiry: '',
    techVisitExpiry: ''
  });

  const handleOpenModal = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData(vehicle);
    } else {
      setEditingVehicle(null);
      setFormData({
        plate: '',
        type: 'BAJAJ',
        model: '',
        status: 'ACTIVE',
        officeId: user?.officeId || MOCK_OFFICES[0].id, // Default for admin
        insuranceExpiry: '',
        techVisitExpiry: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVehicle) {
      setVehicles(vehicles.map(v => v.id === editingVehicle.id ? { ...v, ...formData } as Vehicle : v));
    } else {
      const newVehicle = { ...formData, id: generateUUID() } as Vehicle;
      setVehicles([...vehicles, newVehicle]);
    }
    setIsModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ACTIVE': return 'bg-green-100 text-green-700';
      case 'MAINTENANCE': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

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
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Chauffeur Titulaire</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Documents</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vehicles.map((vehicle) => {
                const driver = availableDrivers.find(d => d.id === vehicle.titularDriverId);
                return (
                  <tr key={vehicle.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                          {vehicle.type === 'BAJAJ' ? '🛺' : (vehicle.type === 'TAXI' ? '🚕' : '🏍️')}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{vehicle.plate}</p>
                          <p className="text-xs text-gray-500">{vehicle.model}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {driver ? (
                        <span className="text-sm font-medium text-gray-900">{driver.firstName} {driver.lastName}</span>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Non assigné</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <div className="group relative">
                            <FileText size={18} className="text-green-500 cursor-help" />
                            <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded whitespace-nowrap">
                                Assu: {vehicle.insuranceExpiry}
                            </span>
                        </div>
                        <div className="group relative">
                            <FileText size={18} className="text-blue-500 cursor-help" />
                            <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded whitespace-nowrap">
                                Visite: {vehicle.techVisitExpiry}
                            </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(vehicle.status)}`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleOpenModal(vehicle)} className="text-gray-400 hover:text-yellow-600 transition-colors mr-3">
                        <Edit2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Immatriculation</label>
              <input 
                type="text" required
                value={formData.plate} onChange={e => setFormData({...formData, plate: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                placeholder="1234 TBE"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
              <select 
                value={formData.type} 
                onChange={e => setFormData({...formData, type: e.target.value as any})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
              >
                <option value="BAJAJ">Bajaj</option>
                <option value="TAXI">Taxi</option>
                <option value="MOTO">Moto</option>
              </select>
            </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 mb-1">Modèle</label>
              <input 
                type="text" required
                value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                placeholder="ex: Bajaj RE 4S"
              />
          </div>

          {user?.role === 'ADMIN' && (
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Bureau de rattachement</label>
                <select 
                    value={formData.officeId}
                    onChange={e => setFormData({...formData, officeId: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                >
                    {MOCK_OFFICES.map(o => (
                        <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                </select>
             </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Chauffeur Titulaire</label>
            <select 
                value={formData.titularDriverId || ''}
                onChange={e => setFormData({...formData, titularDriverId: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
            >
                <option value="">Aucun</option>
                {availableDrivers.map(d => (
                    <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Expiration Assurance</label>
                <input 
                    type="date"
                    value={formData.insuranceExpiry} onChange={e => setFormData({...formData, insuranceExpiry: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                />
             </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Expiration Visite</label>
                <input 
                    type="date"
                    value={formData.techVisitExpiry} onChange={e => setFormData({...formData, techVisitExpiry: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                />
             </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Statut</label>
            <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as any})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
            >
                <option value="ACTIVE">Actif</option>
                <option value="MAINTENANCE">En Maintenance</option>
                <option value="STOPPED">À l'arrêt</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-bold mt-4 shadow-lg shadow-yellow-500/20">
            Enregistrer
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Vehicles;
