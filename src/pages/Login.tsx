import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import Logo from '../assets/logo.png';
import { MOCK_USERS } from '../data/mock'; // Import mock users to check role before navigation

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(identifier, password);
      
      // Check role to redirect correctly (using mock data logic since login returns void)
      // In a real app, login would return the user object
      const user = MOCK_USERS.find(u => u.email === identifier || u.phone === identifier);
      
      if (user?.role === 'SUPER_ADMIN') {
        navigate('/platform');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Identifiant ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-yellow-500 p-8 text-center">
          <div className="inline-block p-3 bg-white rounded-2xl shadow-lg mb-4">
            <img src={Logo} alt="Logo" className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-bold text-white">Connexion</h1>
          <p className="text-yellow-100 text-sm mt-1">Accès Sécurisé BajajSync</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm font-medium">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 ml-1">Email ou Téléphone</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all font-medium"
                  placeholder="ex: 0340000000"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 ml-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? 'Connexion...' : (
                <>
                  Se connecter <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-gray-400 hover:text-yellow-600 font-medium transition-colors">
              Retour au site principal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
