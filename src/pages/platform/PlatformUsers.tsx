import { useState, useEffect } from 'react';
import { User } from '../../types';
import { Ban, CheckCircle, Search, Trash2 } from 'lucide-react';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { platformService } from '../../services/platform.service';

const PlatformUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'REVOKE_APP' | 'ACTIVATE_APP' | 'REVOKE_ONLINE' | 'ACTIVATE_ONLINE' | 'DELETE' | null>(null);

  const loadUsers = () => {
    setLoading(true);
    platformService.getUsers()
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter(u =>
    u.firstName.toLowerCase().includes(search.toLowerCase()) ||
    u.lastName.toLowerCase().includes(search.toLowerCase()) ||
    (u.email && u.email.includes(search)) ||
    (u.phone && u.phone.includes(search))
  );

  const handleAction = (user: User, type: 'REVOKE_APP' | 'ACTIVATE_APP' | 'REVOKE_ONLINE' | 'ACTIVATE_ONLINE' | 'DELETE') => {
    setSelectedUser(user);
    setActionType(type);
  };

  const confirmAction = async () => {
    if (!selectedUser || !actionType) return;
    try {
      if (actionType === 'DELETE') {
        await platformService.deleteUser(selectedUser.id);
        setUsers(users.filter(u => u.id !== selectedUser.id));
      } else if (actionType === 'REVOKE_APP' || actionType === 'ACTIVATE_APP') {
        const newStatus = actionType === 'REVOKE_APP' ? 'REVOKED' : 'ACTIVE';
        await platformService.updateUserStatus(selectedUser.id, newStatus);
        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: newStatus } : u));
      } else if (actionType === 'REVOKE_ONLINE' || actionType === 'ACTIVATE_ONLINE') {
        const newStatus = actionType === 'REVOKE_ONLINE' ? 'pending' : 'active';
        await platformService.updateCompanyStatus(selectedUser.company_id, newStatus);
        setUsers(users.map(u => u.company_id === selectedUser.company_id ? { ...u, company_status: newStatus } : u));
      }
    } catch (err) {
      console.error(`Erreur action ${actionType}`, err);
      alert('Une erreur est survenue lors de l\'opération.');
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-500">Liste complète des clients SaaS.</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher un client..."
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:Yellow-500 w-full sm:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Utilisateur</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Rôle</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Accès App</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Licence Online</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                    <div className="text-xs text-gray-500">{user.email || user.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-bold text-gray-600">{user.role}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {user.status === 'ACTIVE' || user.status === 'active'
                      ? <span className="text-green-600 text-[10px] font-bold bg-green-100 px-2 py-0.5 rounded-full">Autorisé</span>
                      : <span className="text-red-600 text-[10px] font-bold bg-red-100 px-2 py-0.5 rounded-full">Révoqué</span>
                    }
                  </td>
                  <td className="px-6 py-4 text-center">
                    {user.company_status === 'active'
                      ? <span className="text-green-600 text-[10px] font-bold bg-green-100 px-2 py-0.5 rounded-full">Active</span>
                      : user.company_status === 'suspended' || user.company_status === 'waiting'
                        ? <span className="text-amber-600 text-[10px] font-bold bg-amber-100 px-2 py-0.5 rounded-full">En attente</span>
                        : <span className="text-red-600 text-[10px] font-bold bg-red-100 px-2 py-0.5 rounded-full">Suspendue</span>
                    }
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {/* App Actions */}
                      {user.status === 'ACTIVE' || user.status === 'active' ? (
                        <button
                          onClick={() => handleAction(user, 'REVOKE_APP')}
                          className="text-amber-600 hover:bg-amber-50 p-1.5 rounded-lg text-xs font-bold transition-colors"
                          title="Révoquer accès App"
                        >
                          <Ban size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAction(user, 'ACTIVATE_APP')}
                          className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg text-xs font-bold transition-colors"
                          title="Réactiver accès App"
                        >
                          <CheckCircle size={14} />
                        </button>
                      )}

                      {/* Online Actions (Only for Owners) */}
                      {user.role_id === 2 && (
                        user.company_status === 'active' ? (
                          <button
                            onClick={() => handleAction(user, 'REVOKE_ONLINE')}
                            className="text-amber-600 hover:bg-amber-50 p-1.5 rounded-lg text-xs font-bold transition-colors border border-amber-100"
                            title="Suspendre licence Online"
                          >
                            <Search size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAction(user, 'ACTIVATE_ONLINE')}
                            className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg text-xs font-bold transition-colors border border-green-100"
                            title="Réactiver licence Online"
                          >
                            <CheckCircle size={14} />
                          </button>
                        )
                      )}

                      <button
                        onClick={() => handleAction(user, 'DELETE')}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors ml-2"
                        title="Supprimer définitivement"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500 italic">Aucun utilisateur trouvé.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!selectedUser}
        onClose={() => {
          setSelectedUser(null);
          setActionType(null);
        }}
        onConfirm={confirmAction}
        title={
          actionType === 'DELETE' ? "Supprimer le compte" :
            actionType === 'REVOKE_APP' ? "Révoquer l'accès Mobile" :
              actionType === 'ACTIVATE_APP' ? "Réactiver l'accès Mobile" :
                actionType === 'REVOKE_ONLINE' ? "Suspendre la licence Online" :
                  "Réactiver la licence Online"
        }
        message={
          actionType === 'DELETE'
            ? `⚠️ ATTENTION : Voulez-vous vraiment supprimer DÉFINITIVEMENT le compte de ${selectedUser?.firstName} ? Cette action supprimera également toutes ses données et est irréversible.`
            : actionType === 'REVOKE_APP'
              ? `Voulez-vous bloquer l'accès MOBILE de ${selectedUser?.firstName} ? L'application mobile ne pourra plus se synchroniser.`
              : actionType === 'ACTIVATE_APP'
                ? `Voulez-vous rétablir l'accès MOBILE pour ${selectedUser?.firstName} ?`
                : actionType === 'REVOKE_ONLINE'
                  ? `Voulez-vous suspendre la LICENCE ONLINE de ${selectedUser?.firstName} ? L'accès au tableau de bord sera bloqué.`
                  : `Voulez-vous réactiver la LICENCE ONLINE pour ${selectedUser?.firstName} ?`
        }
        confirmText={
          actionType === 'DELETE' ? "Supprimer Définitivement" :
            actionType?.startsWith('REVOKE') ? "Révoquer Accès" :
              "Confirmer"
        }
        type={actionType?.startsWith('ACTIVATE') ? 'success' : 'danger'}
      />
    </div>
  );
};

export default PlatformUsers;

