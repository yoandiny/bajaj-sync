import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Car, Users, Wallet, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { fleetService } from '../../services/fleet.service';

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center text-xs font-medium text-green-600">
        <span>+{trend}% ce mois-ci</span>
      </div>
    )}
  </div>
);

const DashboardHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fleetService.getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400 font-medium">Chargement des données...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500">Bienvenue, {user?.firstName}. Voici un aperçu de votre activité.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Véhicules Actifs"
          value={stats?.activeVehicles || 0}
          icon={Car}
          color="bg-blue-500"
        />
        <StatCard
          title="Chauffeurs"
          value={stats?.totalDrivers || 0}
          icon={Users}
          color="bg-yellow-500"
        />
        <StatCard
          title="Recettes du jour"
          value={`${(stats?.todayRevenue || 0).toLocaleString()} Ar`}
          icon={Wallet}
          color="bg-green-500"
        />
        <StatCard
          title="Alertes"
          value={stats?.maintenanceNeeded || 0}
          icon={AlertTriangle}
          color="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Clock size={18} className="text-blue-500" />
              Derniers versements
            </h3>
          </div>
          <div className="space-y-4">
            {stats?.recentPayments?.length > 0 ? stats.recentPayments.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs">
                    {p.plate_number?.substring(0, 2).toUpperCase() || 'TX'}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{p.plate_number}</p>
                    <p className="text-xs text-gray-500">{new Date(p.date).toLocaleDateString()} - {p.driver_name}</p>
                  </div>
                </div>
                <span className="font-bold text-gray-900">{p.amount.toLocaleString()} Ar</span>
              </div>
            )) : (
              <p className="text-sm text-gray-500 italic text-center py-4">Aucun versement récent.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500" />
            Maintenances requises
          </h3>
          <div className="space-y-4">
            {stats?.maintenanceList?.length > 0 ? (
              stats.maintenanceList.map((v: any) => (
                <div key={v.id} className="flex items-center gap-3 p-3 bg-red-50 text-red-700 rounded-xl border border-red-100">
                  <AlertTriangle size={18} className="shrink-0" />
                  <div className="text-sm">
                    <p className="font-bold">Véhicule {v.plate_number}</p>
                    <p className="text-xs opacity-80">Raison : {v.reason || 'Maintenance périodique'}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-gray-400">
                <CheckCircle size={32} className="mb-2 text-green-500 opacity-50" />
                <p className="text-sm italic">Tous les véhicules sont opérationnels.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
