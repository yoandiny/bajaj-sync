import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_OFFICES, MOCK_USERS } from '../../data/mock';
import { Office } from '../../types';
import { Plus, MapPin, User as UserIcon, Edit2, Trash2, Building2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { SearchableSelect } from '../../components/ui/SearchableSelect';
import { generateTempPassword, generateUUID } from '../../lib/utils';

const Offices = () => {
  const { user } = useAuth();
  const [offices, setOffices] = useState<Office[]>(MOCK_OFFICES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffice, setEditingOffice] = useState<Office | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    managerId: ''
  });

  const [tempPassword, setTempPassword] = useState<string | null>(null);

  if (user?.role !== 'ADMIN') {
    return <div className="p-8 text-center text-gray-500">Accès non autorisé.</div>;
  }

  // Filter managers who are NOT assigned to any office OR are the manager of the current editing office
  const availableManagers = MOCK_USERS.filter(u => 
    u.role === 'MANAGER' && 
    (!u.officeId || (editingOffice && u.id === editingOffice.managerId))
  ).map(u => ({
    id: u.id,
    label: `${u.firstName} ${u.lastName}`,
    subLabel: u.phone || u.email
  }));

  const handleOpenModal = (office?: Office) => {
    if (office) {
      setEditingOffice(office);
      setFormData({
        name: office.name,
        location: office.location,
        managerId: office.managerId
      });
    } else {
      setEditingOffice(null);
      setFormData({ name: '', location: '', managerId: '' });
    }
    setTempPassword(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingOffice) {
      // Update logic (Mock)
      setOffices(offices.map(o => o.id === editingOffice.id ? { 
        ...o, 
        name: formData.name, 
        location: formData.location,
        managerId: formData.managerId
      } : o));
    } else {
      // Create Logic
      const newOfficeId = generateUUID();
      
      // Note: In real app, we would assign the officeId to the user here
      const newOffice: Office = {
        id: newOfficeId,
        name: formData.name,
        location: formData.location,
        managerId: formData.managerId,
        settings: { dailyTargetAmount: 0, restDay: 0 } // Default settings
      };

      setOffices([...offices, newOffice]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Bureaux</h1>
          <p className="text-gray-500">Gérez vos agences et assignez les responsables.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-yellow-500/20"
        >
          <Plus size={20} />
          Nouveau Bureau
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offices.map((office) => {
          const manager = MOCK_USERS.find(u => u.id === office.managerId);
          return (
            <div key={office.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
                  <Building2 size={24} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(office)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                    <Edit2 size={16} />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-lg text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-1">{office.name}</h3>
              
              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin size={16} className="text-gray-400" />
                  {office.location}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <UserIcon size={16} className="text-gray-400" />
                  <span className="font-medium">{manager ? `${manager.firstName} ${manager.lastName}` : 'Non assigné'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOffice ? "Modifier le bureau" : "Créer un nouveau bureau"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nom du bureau</label>
            <input 
              type="text" required
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
              placeholder="ex: Agence Centre-Ville"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Localisation</label>
            <input 
              type="text" required
              value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
              placeholder="ex: Analakely, Antananarivo"
            />
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <h4 className="font-bold text-gray-900 mb-3">Assignation Gérant</h4>
            <SearchableSelect
              label="Sélectionner un gérant disponible"
              options={availableManagers}
              value={formData.managerId}
              onChange={(val) => setFormData({...formData, managerId: val})}
              placeholder="Rechercher un manager..."
            />
            <p className="text-xs text-gray-500 mt-2">
              Seuls les managers non assignés apparaissent ici. Créez d'abord un compte manager si nécessaire.
            </p>
          </div>

          <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-bold mt-4 shadow-lg shadow-yellow-500/20">
            {editingOffice ? 'Enregistrer les modifications' : 'Créer le bureau'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Offices;
