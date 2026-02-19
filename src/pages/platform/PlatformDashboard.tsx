import { Users, ShieldCheck, MessageSquare, TrendingUp, Star } from 'lucide-react';
import { MOCK_USERS, MOCK_FEEDBACKS, MOCK_LICENSE_REQUESTS } from '../../data/mock';

const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
    {subtext && (
      <div className="mt-4 flex items-center text-xs font-medium text-gray-400">
        {subtext}
      </div>
    )}
  </div>
);

const PlatformDashboard = () => {
  const totalUsers = MOCK_USERS.filter(u => u.role !== 'SUPER_ADMIN').length;
  const pendingLicenses = MOCK_LICENSE_REQUESTS.filter(l => l.status === 'PENDING').length;
  const totalFeedbacks = MOCK_FEEDBACKS.length;
  const averageRating = (MOCK_FEEDBACKS.reduce((acc, curr) => acc + curr.rating, 0) / totalFeedbacks).toFixed(1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Plateforme</h1>
        <p className="text-gray-500 mt-1">Vue d'ensemble des performances de BajajSync.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Utilisateurs Totaux" 
          value={totalUsers} 
          icon={Users} 
          color="bg-blue-600"
          subtext="+5 cette semaine"
        />
        <StatCard 
          title="Licences en attente" 
          value={pendingLicenses} 
          icon={ShieldCheck} 
          color="bg-yellow-500"
          subtext="Action requise"
        />
        <StatCard 
          title="Note Moyenne" 
          value={averageRating} 
          icon={Star} 
          color="bg-green-500"
          subtext={`Basé sur ${totalFeedbacks} avis`}
        />
        <StatCard 
          title="Revenus Mensuels" 
          value="2.5M Ar" 
          icon={TrendingUp} 
          color="bg-purple-600"
          subtext="+12% vs mois dernier"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Feedbacks */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <MessageSquare size={20} className="text-blue-500" />
              Feedbacks Récents
            </h3>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Derniers avis</span>
          </div>
          <div className="divide-y divide-gray-100">
            {MOCK_FEEDBACKS.map((fb) => (
              <div key={fb.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-xs">
                      {fb.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">{fb.userName}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">{fb.role}</p>
                    </div>
                  </div>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill={i < fb.rating ? "currentColor" : "none"} className={i < fb.rating ? "" : "text-gray-300"} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                  "{fb.message}"
                </p>
                <p className="text-xs text-gray-400 mt-2 text-right">{fb.date}</p>
              </div>
            ))}
            {MOCK_FEEDBACKS.length === 0 && (
              <div className="p-8 text-center text-gray-500 italic">Aucun feedback pour le moment.</div>
            )}
          </div>
        </div>

        {/* Recent Registrations (Mock) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <Users size={20} className="text-green-500" />
              Inscriptions Récentes
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {MOCK_USERS.filter(u => u.role !== 'SUPER_ADMIN').slice(0, 5).map((u) => (
              <div key={u.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    {u.firstName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{u.firstName} {u.lastName}</p>
                    <p className="text-xs text-gray-500">{u.email || u.phone}</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-md">
                  {u.joinedDate || 'Récemment'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformDashboard;
