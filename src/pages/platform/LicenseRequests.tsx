import { useState } from 'react';
import { Check, X, Clock, CreditCard } from 'lucide-react';
import { MOCK_LICENSE_REQUESTS } from '../../data/mock';
import { LicenseRequest } from '../../types';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';

const LicenseRequests = () => {
  const [requests, setRequests] = useState<LicenseRequest[]>(MOCK_LICENSE_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<LicenseRequest | null>(null);
  const [modalAction, setModalAction] = useState<'APPROVE' | 'REJECT' | null>(null);

  const handleAction = (request: LicenseRequest, action: 'APPROVE' | 'REJECT') => {
    setSelectedRequest(request);
    setModalAction(action);
  };

  const confirmAction = () => {
    if (!selectedRequest || !modalAction) return;

    const newStatus = modalAction === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    setRequests(requests.map(r => r.id === selectedRequest.id ? { ...r, status: newStatus } : r));
    
    setSelectedRequest(null);
    setModalAction(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Demandes de Licence</h1>
        <p className="text-gray-500">Validez les paiements et activez les comptes clients.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Client</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Paiement</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Montant</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold text-sm text-gray-900">{req.userName}</p>
                    <p className="text-xs text-gray-500">{req.phone}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} className="text-gray-400" />
                    <div>
                        <p className="text-sm font-medium text-gray-700">{req.paymentMethod}</p>
                        <p className="text-xs text-gray-500 font-mono">Ref: {req.reference}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">{req.amount.toLocaleString()} Ar</td>
                <td className="px-6 py-4">
                  {req.status === 'PENDING' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                      <Clock size={12} /> En attente
                    </span>
                  )}
                  {req.status === 'APPROVED' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                      <Check size={12} /> Validé
                    </span>
                  )}
                  {req.status === 'REJECTED' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                      <X size={12} /> Rejeté
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {req.status === 'PENDING' && (
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleAction(req, 'APPROVE')}
                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                        title="Valider"
                      >
                        <Check size={18} />
                      </button>
                      <button 
                        onClick={() => handleAction(req, 'REJECT')}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="Rejeter"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onConfirm={confirmAction}
        title={modalAction === 'APPROVE' ? "Valider la licence" : "Rejeter la demande"}
        message={modalAction === 'APPROVE' 
            ? `Êtes-vous sûr de vouloir valider la licence pour ${selectedRequest?.userName} ? Cela activera immédiatement leur accès.` 
            : `Voulez-vous vraiment rejeter cette demande ? Cette action est irréversible.`
        }
        confirmText={modalAction === 'APPROVE' ? "Valider et Activer" : "Rejeter"}
        type={modalAction === 'APPROVE' ? 'success' : 'danger'}
      />
    </div>
  );
};

export default LicenseRequests;
