import { useState, useEffect } from 'react';
import { User } from '../../types';
import { Ban, CheckCircle, Search } from 'lucide-react';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { platformService } from '../../services/platform.service';

const PlatformUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'REVOKE' | 'ACTIVATE' | null>(null);

  useEffect(() => {
    platformService.getUsers()
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter(u =>
    u.firstName.toLowerCase().includes(search.toLowerCase()) ||
    u.lastName.toLowerCase().includes(search.toLowerCase()) ||
    (u.email && u.email.includes(search)) ||
    (u.phone && u.phone.includes(search))
  );

  const handleAction = (user: User, type: 'REVOKE' | 'ACTIVATE') => {
    setSelectedUser(user);
    setActionType(type);
  };

  const confirmAction = async () => {
    if (!selectedUser || !actionType) return;
    const newStatus = actionType === 'REVOKE' ? 'REVOKED' : 'ACTIVE';
    try {
      await platformService.updateUserStatus(selectedUser.id, newStatus);
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: newStatus } : u));
    } catch (err) {
      console.error('Erreur mise à jour statut', err);
    } finally {
      setSelectedUser(null);
      setActionType(null);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400 font-medium">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-500">Liste complète des clients SaaS.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher un client..."
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Utilisateur</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Rôle</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-gray-900">{user.firstName} {user.lastName}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-bold text-gray-600">{user.role}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email || user.phone}</td>
                <td className="px-6 py-4">
                  {user.status === 'ACTIVE'
                    ? <span className="text-green-600 text-xs font-bold bg-green-100 px-2 py-1 rounded-full">Actif</span>
                    : <span className="text-red-600 text-xs font-bold bg-red-100 px-2 py-1 rounded-full">Révoqué</span>
                  }
                </td>
                <td className="px-6 py-4 text-right">
                  {user.status === 'ACTIVE' ? (
                    <button
                      onClick={() => handleAction(user, 'REVOKE')}
                      className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ml-auto"
                    >
                      <Ban size={14} /> Révoquer
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAction(user, 'ACTIVATE')}
                      className="text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ml-auto"
                    >
                      <CheckCircle size={14} /> Réactiver
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500 italic">Aucun utilisateur trouvé.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        onConfirm={confirmAction}
        title={actionType === 'REVOKE' ? "Révoquer l'accès" : "Réactiver le compte"}
        message={actionType === 'REVOKE'
          ? `Voulez-vous vraiment bloquer l'accès de ${selectedUser?.firstName} ? Il ne pourra plus se connecter à ses tableaux de bord.`
          : `Voulez-vous rétablir l'accès pour ${selectedUser?.firstName} ?`}
        confirmText={actionType === 'REVOKE' ? "Révoquer Accès" : "Réactiver"}
        type={actionType === 'REVOKE' ? 'danger' : 'success'}
      />
    </div>
  );
};

export default PlatformUsers;
