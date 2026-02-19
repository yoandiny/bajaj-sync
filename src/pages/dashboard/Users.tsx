import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_USERS, MOCK_OFFICES } from '../../data/mock';
import { User } from '../../types';
import { Plus, Edit2, Trash2, Shield, User as UserIcon, Phone, Mail, Lock } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { generateUUID, generateTempPassword } from '../../lib/utils';

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'MANAGER' as const,
    password: ''
  });

  if (user?.role !== 'ADMIN') {
    return <div className="p-8 text-center text-gray-500">Accès réservé aux administrateurs.</div>;
  }

  const handleOpenModal = (targetUser?: User) => {
    if (targetUser) {
      setEditingUser(targetUser);
      setFormData({
        firstName: targetUser.firstName,
        lastName: targetUser.lastName,
        email: targetUser.email || '',
        phone: targetUser.phone || '',
        role: targetUser.role,
        password: targetUser.password || ''
      });
    } else {
      setEditingUser(null);
      const tempPass = generateTempPassword();
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'MANAGER',
        password: tempPass
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
    } else {
      const newUser: User = {
        id: generateUUID(),
        ...formData,
        officeId: undefined // New users are unassigned by default
      };
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-500">Créez et gérez les accès des gérants de bureaux.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-yellow-500/20"
        >
          <Plus size={20} />
          Nouvel Utilisateur
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((u) => {
          const office = MOCK_OFFICES.find(o => o.id === u.officeId);
          return (
            <div key={u.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
              {u.role === 'ADMIN' && (
                <div className="absolute top-0 right-0 bg-gray-900 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                  ADMIN
                </div>
              )}
              
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                    u.role === 'ADMIN' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-50 text-yellow-600'
                }`}>
                  {u.firstName.charAt(0)}{u.lastName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{u.firstName} {u.lastName}</h3>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{u.role}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                {u.email && (
                    <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" />
                        <span className="truncate">{u.email}</span>
                    </div>
                )}
                {u.phone && (
                    <div className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-400" />
                        <span>{u.phone}</span>
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <Shield size={14} className="text-gray-400" />
                    <span className={office ? 'text-green-600 font-medium' : 'text-gray-400 italic'}>
                        {office ? `Gérant: ${office.name}` : 'Non assigné'}
                    </span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-50">
                <button onClick={() => handleOpenModal(u)} className="flex-1 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium text-xs flex items-center justify-center gap-2">
                    <Edit2 size={14} /> Modifier
                </button>
                {u.role !== 'ADMIN' && (
                    <button className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500">
                        <Trash2 size={16} />
                    </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Modifier Utilisateur" : "Créer un Utilisateur"}
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
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input 
              type="email"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
              placeholder="optionnel"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Téléphone</label>
            <input 
              type="tel"
              value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
              placeholder="optionnel si email présent"
            />
          </div>

          {!editingUser && (
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                <label className="block text-sm font-bold text-yellow-800 mb-1 flex items-center gap-2">
                    <Lock size={14} /> Mot de passe provisoire
                </label>
                <div className="flex items-center gap-2">
                    <code className="bg-white px-3 py-1 rounded border border-yellow-200 font-mono text-lg font-bold text-gray-800">
                        {formData.password}
                    </code>
                    <span className="text-xs text-yellow-700">À communiquer à l'utilisateur</span>
                </div>
            </div>
          )}

          <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-bold mt-4 shadow-lg shadow-yellow-500/20">
            {editingUser ? 'Enregistrer les modifications' : 'Créer l\'utilisateur'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
