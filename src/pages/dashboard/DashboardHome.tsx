import { useAuth } from '../../context/AuthContext';
import { Car, Users, Wallet, AlertTriangle } from 'lucide-react';
import { MOCK_VEHICLES, MOCK_DRIVERS } from '../../data/mock';

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

  // Filter data based on role
  const vehicles = user?.role === 'ADMIN' 
    ? MOCK_VEHICLES 
    : MOCK_VEHICLES.filter(v => v.officeId === user?.officeId);

  const drivers = user?.role === 'ADMIN'
    ? MOCK_DRIVERS
    : MOCK_DRIVERS.filter(d => d.officeId === user?.officeId);

  const activeVehicles = vehicles.filter(v => v.status === 'ACTIVE').length;
  const maintenanceVehicles = vehicles.filter(v => v.status === 'MAINTENANCE').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500">Bienvenue, {user?.firstName}. Voici un aperçu de votre activité.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Véhicules Actifs" 
          value={activeVehicles} 
          icon={Car} 
          color="bg-blue-500"
        />
        <StatCard 
          title="Chauffeurs" 
          value={drivers.length} 
          icon={Users} 
          color="bg-yellow-500"
        />
        <StatCard 
          title="Recettes du jour" 
          value="125.000 Ar" 
          icon={Wallet} 
          color="bg-green-500"
          trend="12"
        />
        <StatCard 
          title="En Maintenance" 
          value={maintenanceVehicles} 
          icon={AlertTriangle} 
          color="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Derniers versements</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs">
                    TB
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">1234 TBE</p>
                    <p className="text-xs text-gray-500">Aujourd'hui, 10:30</p>
                  </div>
                </div>
                <span className="font-bold text-gray-900">35.000 Ar</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Alertes Maintenance</h3>
          <div className="space-y-4">
             {vehicles.filter(v => v.status === 'MAINTENANCE').length > 0 ? (
                vehicles.filter(v => v.status === 'MAINTENANCE').map(v => (
                  <div key={v.id} className="flex items-center gap-3 p-3 bg-red-50 text-red-700 rounded-xl border border-red-100">
                    <AlertTriangle size={18} />
                    <span className="text-sm font-medium">Véhicule <strong>{v.plate}</strong> en maintenance.</span>
                  </div>
                ))
             ) : (
               <p className="text-sm text-gray-500 italic">Aucune alerte pour le moment.</p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
