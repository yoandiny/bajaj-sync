import { useState, useEffect } from 'react';
import { Users, ShieldCheck, MessageSquare, TrendingUp, Star } from 'lucide-react';
import { platformService } from '../../services/platform.service';
import { Feedback, LicenseRequest } from '../../types';

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
  const [stats, setStats] = useState({ totalUsers: 0, pendingLicenses: 0, totalFeedbacks: 0, activeUsers: 0 });
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [recentRequests, setRecentRequests] = useState<LicenseRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [s, fb, req] = await Promise.all([
          platformService.getStats(),
          platformService.getFeedbacks(),
          platformService.getLicenseRequests()
        ]);
        setStats(s);
        setFeedbacks(fb.slice(0, 3));
        setRecentRequests(req.slice(0, 5));
      } catch (err) {
        console.error('Erreur chargement dashboard plateforme', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const averageRating = feedbacks.length
    ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)
    : '—';

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400 font-medium">Chargement...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Plateforme</h1>
        <p className="text-gray-500 mt-1">Vue d'ensemble des performances de BajajSync.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Utilisateurs Totaux" value={stats.totalUsers} icon={Users} color="bg-blue-600" subtext={`${stats.activeUsers} actifs`} />
        <StatCard title="Licences en attente" value={stats.pendingLicenses} icon={ShieldCheck} color="bg-yellow-500" subtext="Action requise" />
        <StatCard title="Note Moyenne" value={averageRating} icon={Star} color="bg-green-500" subtext={`Basé sur ${stats.totalFeedbacks} avis`} />
        <StatCard title="Feedbacks" value={stats.totalFeedbacks} icon={MessageSquare} color="bg-purple-600" subtext="Total reçus" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Feedbacks */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <MessageSquare size={20} className="text-blue-500" />
              Feedbacks Récents
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {feedbacks.map((fb) => (
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
              </div>
            ))}
            {feedbacks.length === 0 && (
              <div className="p-8 text-center text-gray-500 italic">Aucun feedback pour le moment.</div>
            )}
          </div>
        </div>

        {/* Recent License Requests */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <ShieldCheck size={20} className="text-green-500" />
              Demandes Récentes
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {recentRequests.map((req) => (
              <div key={req.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center font-bold">
                    {req.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{req.userName}</p>
                    <p className="text-xs text-gray-500">{req.phone}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    req.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                  }`}>
                  {req.status === 'PENDING' ? 'En attente' : req.status === 'APPROVED' ? 'Validé' : 'Rejeté'}
                </span>
              </div>
            ))}
            {recentRequests.length === 0 && (
              <div className="p-8 text-center text-gray-500 italic">Aucune demande pour le moment.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformDashboard;
