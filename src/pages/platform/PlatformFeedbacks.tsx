import { useState, useEffect } from 'react';
import { authService } from '../../services/auth.service';
import { MessageSquare, Star, ArrowUpDown, ArrowUp, ArrowDown, Search, User, Calendar, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PlatformFeedbacks = () => {
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filtres et Tri
    const [filterRole, setFilterRole] = useState('ALL');
    const [filterRating, setFilterRating] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc'); // Date par défaut
    const [sortRating, setSortRating] = useState<'none' | 'desc' | 'asc'>('none');

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const data = await authService.getFeedbacks();
            setFeedbacks(data);
        } catch (err) {
            console.error('Erreur lors du chargement des avis:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const filteredFeedbacks = feedbacks.filter(f => {
        const matchesRole = filterRole === 'ALL' || f.role === filterRole;
        const matchesRating = filterRating === 'ALL' || f.rating === Number(filterRating);
        const matchesSearch = f.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.message.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesRole && matchesRating && matchesSearch;
    });

    const sortedFeedbacks = [...filteredFeedbacks].sort((a, b) => {
        if (sortRating !== 'none') {
            return sortRating === 'desc' ? b.rating - a.rating : a.rating - b.rating;
        }
        // Par défaut Date
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    const toggleSortRating = () => {
        if (sortRating === 'none') setSortRating('desc');
        else if (sortRating === 'desc') setSortRating('asc');
        else setSortRating('none');
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
                <p className="text-gray-500 font-medium">Chargement des retours utilisateurs...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Retours Utilisateurs</h1>
                    <p className="text-gray-500">Consultez et analysez les avis de vos utilisateurs.</p>
                </div>
                <div className="bg-white border-2 border-yellow-100 rounded-2xl px-5 py-2.5 flex flex-col shadow-sm">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Note Moyenne</span>
                    <div className="flex items-center gap-2">
                        <span className="font-black text-gray-900 text-xl">
                            {(feedbacks.reduce((acc, f) => acc + f.rating, 0) / (feedbacks.length || 1)).toFixed(1)}
                        </span>
                        <div className="flex gap-0.5 text-yellow-400">
                            <Star size={18} fill="currentColor" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bar de Filtres */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Recherche */}
                    <div className="relative col-span-1 md:col-span-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all text-sm font-medium"
                        />
                    </div>

                    {/* Filtre Rôle */}
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all text-sm font-bold appearance-none"
                    >
                        <option value="ALL">Tous les rôles</option>
                        <option value="OWNER">Gérants (OWNER)</option>
                        <option value="MANAGER">Collaborateurs (MANAGER)</option>
                    </select>

                    {/* Filtre Note */}
                    <select
                        value={filterRating}
                        onChange={(e) => setFilterRating(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-yellow-500 focus:bg-white transition-all text-sm font-bold appearance-none"
                    >
                        <option value="ALL">Toutes les notes</option>
                        <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                        <option value="4">⭐⭐⭐⭐ (4/5)</option>
                        <option value="3">⭐⭐⭐ (3/5)</option>
                        <option value="2">⭐⭐ (2/5)</option>
                        <option value="1">⭐ (1/5)</option>
                    </select>

                    {/* Tri */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all text-sm font-bold text-gray-700 border border-gray-100"
                        >
                            <Calendar size={16} />
                            {sortOrder === 'desc' ? 'Récent' : 'Ancien'}
                            {sortOrder === 'desc' ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
                        </button>
                        <button
                            onClick={toggleSortRating}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all text-sm font-bold border ${sortRating !== 'none' ? 'bg-yellow-500 text-gray-900 border-yellow-600' : 'bg-gray-50 text-gray-700 border-gray-100 hover:bg-gray-100'
                                }`}
                        >
                            <Star size={16} fill={sortRating !== 'none' ? 'currentColor' : 'none'} />
                            Note
                            {sortRating === 'none' ? <ArrowUpDown size={14} /> : sortRating === 'desc' ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Liste des avis */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {sortedFeedbacks.map((f) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={f.id}
                            className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
                        >
                            {/* Header de la carte */}
                            <div className="p-5 flex items-start justify-between border-b border-gray-50 bg-gray-50/30">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-black shrink-0">
                                        {f.userName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 leading-tight">{f.userName}</h3>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${f.role === 'OWNER' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-100 text-gray-500 border-gray-200'
                                                }`}>
                                                {f.role || 'Gérant'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-0.5 mt-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={14}
                                            fill={f.rating >= star ? "#EAB308" : "none"}
                                            className={f.rating >= star ? "text-yellow-500" : "text-gray-200"}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Message */}
                            <div className="p-6 flex-1">
                                <div className="relative">
                                    <MessageSquare className="absolute -left-1 -top-1 text-gray-50 -scale-x-100" size={40} />
                                    <p className="relative text-gray-700 leading-relaxed font-medium italic z-10">
                                        "{f.message}"
                                    </p>
                                </div>
                            </div>

                            {/* Footer de la carte */}
                            <div className="px-6 py-4 bg-gray-50/50 flex items-center justify-between text-[11px] font-bold text-gray-400 border-t border-gray-50">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={12} />
                                    {new Date(f.date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <User size={12} />
                                    ID: #{f.userId.substring(0, 5)}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {sortedFeedbacks.length === 0 && (
                <div className="bg-white p-20 rounded-[2rem] border border-gray-100 flex flex-col items-center justify-center text-center gap-4 shadow-sm">
                    <div className="p-5 bg-gray-50 rounded-full text-gray-200">
                        <MessageSquare size={64} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-gray-900">Aucun avis trouvé</h3>
                        <p className="text-gray-500 max-w-xs">Ajustez vos filtres ou effectuez une nouvelle recherche.</p>
                    </div>
                    <button
                        onClick={() => {
                            setFilterRole('ALL');
                            setFilterRating('ALL');
                            setSearchTerm('');
                        }}
                        className="text-yellow-600 font-bold hover:underline mt-2"
                    >
                        Réinitialiser les filtres
                    </button>
                </div>
            )}
        </div>
    );
};

export default PlatformFeedbacks;
