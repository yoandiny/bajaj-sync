import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_DRIVERS, MOCK_OFFICES } from '../../data/mock';
import { Driver } from '../../types';
import { Plus, Edit2, Phone, CreditCard } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { generateUUID } from '../../lib/utils';

const Drivers = () => {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState<Driver[]>(
    user?.role === 'ADMIN' ? MOCK_DRIVERS : MOCK_DRIVERS.filter(d => d.officeId === user?.officeId)
  );
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const [formData, setFormData] = useState<Partial<Driver>>({
    firstName: '',
    lastName: '',
    phone: '',
    licenseNumber: '',
    status: 'ACTIVE'
  });

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
        officeId: user?.officeId || MOCK_OFFICES[0].id
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDriver) {
      setDrivers(drivers.map(d => d.id === editingDriver.id ? { ...d, ...formData } as Driver : d));
    } else {
      const newDriver = { ...formData, id: generateUUID() } as Driver;
      setDrivers([...drivers, newDriver]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Chauffeurs</h1>
          <p className="text-gray-500">Liste des conducteurs et leurs statuts.</p>
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
        {drivers.map((driver) => (
          <div key={driver.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600">
                {driver.firstName.charAt(0)}{driver.lastName.charAt(0)}
              </div>
              <button onClick={() => handleOpenModal(driver)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                <Edit2 size={16} />
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900">{driver.firstName} {driver.lastName}</h3>
            <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mt-1 ${
                driver.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
                {driver.status}
            </span>

            <div className="space-y-3 mt-6 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone size={16} className="text-gray-400" />
                    {driver.phone}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CreditCard size={16} className="text-gray-400" />
                    Permis: <span className="font-mono font-medium">{driver.licenseNumber}</span>
                </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDriver ? "Modifier Chauffeur" : "Ajouter Chauffeur"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Prénom</label>
                    <input 
                        type="text" required
                        value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Nom</label>
                    <input 
                        type="text" required
                        value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Téléphone</label>
                <input 
                    type="tel" required
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Numéro Permis</label>
                <input 
                    type="text" required
                    value={formData.licenseNumber} onChange={e => setFormData({...formData, licenseNumber: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
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
                <label className="block text-sm font-bold text-gray-700 mb-1">Statut</label>
                <select 
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                >
                    <option value="ACTIVE">Actif</option>
                    <option value="INACTIVE">Inactif</option>
                    <option value="SUSPENDED">Suspendu</option>
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

export default Drivers;
