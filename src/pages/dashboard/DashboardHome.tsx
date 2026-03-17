import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Car, Users, Wallet, AlertTriangle, Clock, CheckCircle, BarChart3, TrendingUp, Repeat, Infinity as InfinityIcon } from 'lucide-react';
import { fleetService } from '../../services/fleet.service';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { Link } from 'react-router-dom';

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
    console.log('[DASHBOARD] Fetching stats...');
    fleetService.getDashboardStats()
      .then(data => {
        console.log('[DASHBOARD] Received stats:', data);
        setStats(data);
      })
      .catch(err => {
        console.error('[DASHBOARD] Error fetching stats:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 font-medium tracking-wide">Chargement de vos statistiques...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 font-medium">Bienvenue, {user?.firstName}. Voici un aperçu de votre activité.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest shadow-sm">
          <Clock size={14} className="text-blue-500" />
          Dernière mise à jour: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Véhicules Actifs"
          value={stats?.activeVehicles || 0}
          icon={Car}
          color="bg-blue-600"
        />
        <StatCard
          title="Total Chauffeurs"
          value={stats?.totalDrivers || 0}
          icon={Users}
          color="bg-yellow-500"
        />
        <StatCard
          title="Recettes (Aujourd'hui)"
          value={`${(stats?.dailyRevenue || 0).toLocaleString()} Ar`}
          icon={Wallet}
          color="bg-green-600"
        />
        <StatCard
          title="Alertes Maintenance"
          value={stats?.maintenanceList?.length || 0}
          icon={AlertTriangle}
          color="bg-red-500"
        />
      </div>

      {/* Barre de progression de l'objectif */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <TrendingUp size={20} className="text-yellow-500" />
              Objectif du jour
            </h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
              {stats?.paymentMode === 'VARIABLE' ? 'Mode Libre — Aucun objectif cible' : `Cible : ${(stats?.dailyTarget || 0).toLocaleString()} Ar`}
            </p>
          </div>
          {/* Badge cycle de paiement */}
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
              stats?.paymentCycle === 'WEEKLY' ? 'bg-purple-100 text-purple-700' :
              stats?.paymentCycle === 'MONTHLY' ? 'bg-blue-100 text-blue-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              <Repeat size={12} />
              {stats?.paymentCycle === 'WEEKLY' ? 'Hebdomadaire' : stats?.paymentCycle === 'MONTHLY' ? 'Mensuel' : 'Quotidien'}
            </span>
            {stats?.paymentMode === 'VARIABLE' ? (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-indigo-100 text-indigo-700">
                <InfinityIcon size={12} />
                Mode Libre
              </span>
            ) : (
              <div className="text-right">
                <span className="text-2xl font-black text-gray-900">
                  {Math.min(100, Math.round(((stats?.dailyRevenue || 0) / (stats?.dailyTarget || 40000)) * 100))}%
                </span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Atteint</span>
              </div>
            )}
          </div>
        </div>

        {stats?.paymentMode === 'VARIABLE' ? (
          /* Mode VARIABLE — afficher les recettes sans objectif fixe */
          <div className="flex items-center gap-4 bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
            <div className="p-3 bg-white rounded-xl text-indigo-500 shadow-sm">
              <Wallet size={22} />
            </div>
            <div>
              <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">Recettes aujourd'hui</p>
              <p className="text-2xl font-black text-gray-900">{(stats?.dailyRevenue || 0).toLocaleString()} <span className="text-sm font-bold text-gray-400">Ar</span></p>
            </div>
          </div>
        ) : (
          /* Mode FIXED — barre de progression */
          <>
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner p-1">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${
                  ((stats?.dailyRevenue || 0) / (stats?.dailyTarget || 40000)) >= 1
                    ? 'bg-gradient-to-r from-green-400 to-green-600'
                    : 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                }`}
                style={{ width: `${Math.min(100, Math.round(((stats?.dailyRevenue || 0) / (stats?.dailyTarget || 40000)) * 100))}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-3 px-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">0 Ar</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{(stats?.dailyTarget || 40000).toLocaleString()} Ar</span>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <BarChart3 size={20} className="text-yellow-500" />
                Performance des 7 derniers jours
              </h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Revenus & Dépenses</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-[10px] font-black text-gray-400 uppercase">Revenus</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <span className="text-[10px] font-black text-gray-400 uppercase">Dépenses</span>
              </div>
            </div>
          </div>

          <div className="h-[300px] w-full relative min-h-[300px]">
            {stats?.history && stats.history.length > 0 ? (
              <ResponsiveContainer width="99.9%" height={300}>
                <AreaChart data={stats.history}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 700, fontSize: 10 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 700, fontSize: 10 }} tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="expenses" stroke="#f87171" strokeWidth={4} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center text-gray-400 gap-2">
                <BarChart3 size={40} className="opacity-20" />
                <p className="text-sm font-bold italic">Données en cours de génération...</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-black text-gray-900 mb-8 flex items-center gap-2">
            <TrendingUp size={20} className="text-green-500" />
            Répartition
          </h3>
          <div className="h-[300px] w-full relative flex-grow">
            {stats?.history && stats.history.length > 0 ? (
              <ResponsiveContainer width="99.9%" height={300}>
                <BarChart data={stats.history.slice(-3)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 700, fontSize: 10 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={20} />
                  <Bar dataKey="expenses" fill="#f87171" radius={[6, 6, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center text-gray-400 gap-2">
                <TrendingUp size={40} className="opacity-20" />
                <p className="text-sm font-bold italic">Calcul en cours...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Clock size={20} className="text-blue-500" />
              Derniers versements
            </h3>
            <Link to="/dashboard/payments" className="text-xs font-black text-blue-500 hover:text-blue-700 uppercase tracking-widest">Voir tout</Link>
          </div>
          <div className="space-y-4">
            {stats?.recentPayments?.length > 0 ? stats.recentPayments.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 font-extrabold text-sm shadow-sm group-hover:shadow-md transition-all">
                    {p.plate_number?.substring(0, 2).toUpperCase() || 'BS'}
                  </div>
                  <div>
                    <p className="font-black text-sm text-gray-900">{p.plate_number}</p>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-tight">{new Date(p.date).toLocaleDateString()} • {p.driver_name}</p>
                  </div>
                </div>
                <span className="font-extrabold text-gray-900 text-lg">{p.amount.toLocaleString()} <span className="text-[10px] text-gray-400 ml-0.5">Ar</span></span>
              </div>
            )) : (
              <div className="py-12 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-sm font-bold italic tracking-wide">Aucun versement récent.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-black text-gray-900 mb-8 flex items-center gap-2">
            <AlertTriangle size={20} className="text-red-500" />
            Maintenances critiques
          </h3>
          <div className="space-y-4">
            {stats?.maintenanceList?.length > 0 ? (
              stats.maintenanceList.map((v: any) => (
                <div key={v.id} className="flex items-center gap-4 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100">
                  <div className="p-3 bg-white rounded-xl text-red-500 shadow-sm">
                    <AlertTriangle size={20} />
                  </div>
                  <div className="text-sm">
                    <p className="font-black text-gray-900">Véhicule {v.plate_number}</p>
                    <p className="text-xs font-bold opacity-80 uppercase tracking-tight mt-0.5">{v.reason}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <CheckCircle size={40} className="mb-3 text-green-500 opacity-30" />
                <p className="text-sm font-bold italic tracking-wide">Flotte 100% opérationnelle.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
            <Car size={20} className="text-blue-500" />
            Répartition par Status
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.vehicleStats?.byStatus || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="status"
                >
                  {(stats?.vehicleStats?.byStatus || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.status === 'ACTIVE' ? '#10B981' : '#F59E0B'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-purple-500" />
            Répartition par Type
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.vehicleStats?.byType || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="type"
                >
                  {(stats?.vehicleStats?.byType || []).map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
