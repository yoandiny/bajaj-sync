import { Map, Construction } from 'lucide-react';

const Tracking = () => {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center text-center p-8">
      <div className="bg-yellow-50 p-6 rounded-full mb-6 relative">
        <div className="absolute inset-0 bg-yellow-200 rounded-full animate-ping opacity-20"></div>
        <Map size={64} className="text-yellow-600 relative z-10" />
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Suivi GPS en temps réel</h1>
      <p className="text-lg text-gray-500 max-w-md mb-8">
        Cette fonctionnalité est en cours de développement. Bientôt, vous pourrez suivre la position exacte de tous vos véhicules sur une carte interactive.
      </p>

      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-600 text-sm font-bold uppercase tracking-wider">
        <Construction size={18} />
        Module en construction
      </div>
    </div>
  );
};

export default Tracking;
