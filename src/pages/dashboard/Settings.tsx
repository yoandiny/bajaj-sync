import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fleetService } from '../../services/fleet.service';
import { Save, Calendar, DollarSign, Loader2 } from 'lucide-react';
import { OfficeSettings } from '../../types';

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<OfficeSettings>({
    dailyTargetAmount: 0,
    restDay: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    // Si l'utilisateur est OWNER et n'a pas d'officeId, on récupère ses offices
    let officeId = user?.officeId;

    if (!officeId && user?.role === 'OWNER') {
      try {
        const offices = await fleetService.getOffices();
        if (offices.length > 0) {
          officeId = offices[0].id;
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des offices :", err);
      }
    }

    if (officeId) {
      try {
        setLoading(true);
        const data = await fleetService.getOfficeSettings(officeId);
        setSettings(data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des paramètres :", err);
        setError("Impossible de charger les paramètres.");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError("Aucun bureau associé à votre compte.");
    }
  }, [user]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSave = async () => {
    let officeId = user?.officeId;

    if (!officeId && user?.role === 'OWNER') {
      const offices = await fleetService.getOffices();
      if (offices.length > 0) {
        officeId = offices[0].id;
      }
    }

    if (!officeId) {
      alert("Erreur : Aucun bureau identifié.");
      return;
    }

    try {
      setSaving(true);
      await fleetService.updateOfficeSettings(officeId, settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde :", err);
      alert("Une erreur est survenue lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
        <p className="text-gray-500 font-medium">Chargement des paramètres...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres du Bureau</h1>
        <p className="text-gray-500">Configuration des versements et jours de repos.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl font-medium">
          {error}
        </div>
      )}

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
              onChange={(e) => setSettings({ ...settings, dailyTargetAmount: parseInt(e.target.value) || 0 })}
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
                onClick={() => setSettings({ ...settings, restDay: day.id })}
                className={`py-3 px-4 rounded-xl text-sm font-bold transition-all ${settings.restDay === day.id
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
            disabled={saving || !!error}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-200 disabled:shadow-none text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2 transition-all"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {success ? 'Enregistré !' : 'Enregistrer les paramètres'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;
