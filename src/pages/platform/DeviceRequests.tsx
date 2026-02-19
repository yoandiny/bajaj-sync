import { useState } from 'react';
import { Smartphone, Check, X, AlertTriangle } from 'lucide-react';
import { MOCK_DEVICE_REQUESTS } from '../../data/mock';
import { DeviceRequest } from '../../types';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';

const DeviceRequests = () => {
  const [requests, setRequests] = useState<DeviceRequest[]>(MOCK_DEVICE_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<DeviceRequest | null>(null);
  const [modalAction, setModalAction] = useState<'APPROVE' | 'REJECT' | null>(null);

  const handleAction = (request: DeviceRequest, action: 'APPROVE' | 'REJECT') => {
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
        <h1 className="text-2xl font-bold text-gray-900">Changements d'Appareil</h1>
        <p className="text-gray-500">Gérez les demandes de réinitialisation d'Android ID.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Utilisateur</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Raison</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">ID Actuel</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-gray-900">{req.userName}</td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{req.reason}</td>
                <td className="px-6 py-4 text-xs font-mono text-gray-500">{req.currentDeviceId}</td>
                <td className="px-6 py-4">
                  {req.status === 'PENDING' && <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">En attente</span>}
                  {req.status === 'APPROVED' && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">Approuvé</span>}
                  {req.status === 'REJECTED' && <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">Rejeté</span>}
                </td>
                <td className="px-6 py-4 text-right">
                  {req.status === 'PENDING' && (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleAction(req, 'APPROVE')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"><Check size={18} /></button>
                      <button onClick={() => handleAction(req, 'REJECT')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><X size={18} /></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Aucune demande en attente.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onConfirm={confirmAction}
        title="Confirmation de changement"
        message={modalAction === 'APPROVE' 
            ? "Cela dissociera l'ancien appareil et permettra à l'utilisateur de se connecter sur un nouveau téléphone." 
            : "Refuser cette demande empêchera l'utilisateur de changer d'appareil."}
        confirmText={modalAction === 'APPROVE' ? "Autoriser le changement" : "Refuser"}
        type={modalAction === 'APPROVE' ? 'warning' : 'danger'}
      />
    </div>
  );
};

export default DeviceRequests;
