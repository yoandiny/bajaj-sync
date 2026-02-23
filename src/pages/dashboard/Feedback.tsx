import { useState } from 'react';
import { Send, Star, MessageSquare, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fleetService } from '../../services/fleet.service';

const Feedback = () => {
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0 || !message.trim()) return;

        setSubmitting(true);
        setError(null);

        try {
            await fleetService.sendFeedback({ message, rating });
            setSubmitted(true);
            setMessage('');
            setRating(0);
            setTimeout(() => setSubmitted(false), 5000);
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Une erreur est survenue. Réessayez plus tard.';
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <div className="inline-flex p-4 bg-yellow-100 text-yellow-600 rounded-full mb-4">
                    <MessageSquare size={32} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Votre avis compte !</h1>
                <p className="text-gray-500 mt-2">Aidez-nous à améliorer BajajSync en partageant votre expérience.</p>
                {user && (
                    <p className="text-sm text-gray-400 mt-1">Connecté en tant que <span className="font-bold text-gray-600">{user.firstName} {user.lastName}</span></p>
                )}
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                {submitted ? (
                    <div className="text-center py-10">
                        <div className="inline-flex p-5 bg-green-100 text-green-600 rounded-full mb-4">
                            <Star size={36} fill="currentColor" />
                        </div>
                        <h3 className="text-xl font-black text-green-600 mb-2">Merci pour votre retour !</h3>
                        <p className="text-gray-500">Votre message a été transmis à l'équipe technique BajajSync.</p>
                        <button
                            onClick={() => setSubmitted(false)}
                            className="mt-6 text-yellow-600 font-bold hover:underline"
                        >
                            Envoyer un autre avis
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-bold">
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="flex flex-col items-center gap-2">
                            <label className="text-sm font-bold text-gray-700">Notez votre expérience</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="transition-transform hover:scale-110 focus:outline-none"
                                    >
                                        <Star
                                            size={36}
                                            fill={(hoverRating || rating) >= star ? "#EAB308" : "none"}
                                            className={(hoverRating || rating) >= star ? "text-yellow-500" : "text-gray-300"}
                                        />
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <p className="text-sm text-yellow-600 font-bold">
                                    {['', 'Très insuffisant', 'Insuffisant', 'Correct', 'Bien', 'Excellent !'][rating]}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Votre message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Dites-nous ce que vous aimez ou ce que nous devrions améliorer..."
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 min-h-[150px] resize-none"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={rating === 0 || !message.trim() || submitting}
                            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Envoi en cours...
                                </>
                            ) : (
                                <>
                                    <Send size={20} />
                                    Envoyer mon avis
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Feedback;
