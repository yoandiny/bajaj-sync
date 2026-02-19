import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_OFFICES } from '../../data/mock';
import { Save, Calendar, DollarSign } from 'lucide-react';
import { OfficeSettings } from '../../types';

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<OfficeSettings>({
    dailyTargetAmount: 0,
    restDay: 0
  });
  const [success, setSuccess] = useState(false);

  // Load settings based on user role
  useEffect(() => {
    if (user?.role === 'MANAGER' && user.officeId) {
      const office = MOCK_OFFICES.find(o => o.id === user.officeId);
      if (office && office.settings) {
        setSettings(office.settings);
      }
    }
    // Admin logic could be to select an office to edit, but for simplicity let's assume Admin edits the first office or a global default
    if (user?.role === 'ADMIN') {
        const office = MOCK_OFFICES[0]; // Demo: Admin edits first office
        if (office && office.settings) {
            setSettings(office.settings);
        }
    }
  }, [user]);

  const handleSave = () => {
    // Save logic (Mock)
    // In real app, API call to update office settings
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const days = [
    { id: 0, label: 'Dimanche' },
    { id: 1, label: 'Lundi' },
    { id: 2, label: 'Mardi' },
    { id: 3, label: 'Mercredi' },
    { id: 4, label: 'Jeudi' },
    { id: 5, label: 'Vendredi' },
    { id: 6, label: 'Samedi' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres du Bureau</h1>
        <p className="text-gray-500">Configuration des versements et jours de repos.</p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-8">
        
        {/* Versement Journalier */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gray-900 font-bold text-lg">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <DollarSign size={24} />
            </div>
            Versement Journalier Cible
          </div>
          <p className="text-sm text-gray-500">Définissez le montant standard attendu par véhicule par jour.</p>
          
          <div className="relative">
            <input
              type="number"
              value={settings.dailyTargetAmount}
              onChange={(e) => setSettings({...settings, dailyTargetAmount: parseInt(e.target.value) || 0})}
              className="w-full pl-4 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 font-bold text-lg"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Ar</span>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Jour de Repos */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gray-900 font-bold text-lg">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Calendar size={24} />
            </div>
            Jour de Repos Hebdomadaire
          </div>
          <p className="text-sm text-gray-500">Les versements effectués ce jour-là seront marqués comme exceptionnels.</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {days.map((day) => (
              <button
                key={day.id}
                onClick={() => setSettings({...settings, restDay: day.id})}
                className={`py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                  settings.restDay === day.id
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSave}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <Save size={20} />
            {success ? 'Enregistré !' : 'Enregistrer les paramètres'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;
