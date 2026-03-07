import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { PlatformLayout } from './layouts/PlatformLayout';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DownloadPage from './pages/Download';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import PaymentDashboard from './pages/PaymentDashboard';
import WaitingApproval from './pages/WaitingApproval';
import Activate from './pages/Activate';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import DashboardHome from './pages/dashboard/DashboardHome';
import Offices from './pages/dashboard/Offices';
import Vehicles from './pages/dashboard/Vehicles';
import Drivers from './pages/dashboard/Drivers';
import Payments from './pages/dashboard/Payments';
import Expenses from './pages/dashboard/Expenses';
import Settings from './pages/dashboard/Settings';
import Tracking from './pages/dashboard/Tracking';
import Feedback from './pages/dashboard/Feedback';
import Profile from './pages/dashboard/Profile';
import Managers from './pages/dashboard/Managers';
import PlatformDashboard from './pages/platform/PlatformDashboard';
import PlatformUsers from './pages/platform/PlatformUsers';
import PlatformCompanies from './pages/platform/PlatformCompanies';
import LicenseRequests from './pages/platform/LicenseRequests';
import DeviceRequests from './pages/platform/DeviceRequests';
import PlatformSettings from './pages/platform/PlatformSettings';
import PlatformFeedbacks from './pages/platform/PlatformFeedbacks';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PublicRoute } from './components/auth/PublicRoute';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen font-sans text-gray-900">
          <Routes>
            {/* Public Routes - Redirigent vers dashboard si déjà connecté */}
            <Route path="/" element={
              <div className="bg-gray-50">
                <Navbar />
                <main>
                  <Home />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/download" element={<DownloadPage />} />

            {/* Route publique - Activation licence application mobile (indépendante du login web) */}
            <Route path="/app/activate" element={<Activate />} />

            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

            {/* Routes d'activation et attente - Protégées mais gérées par ProtectedRoute */}
            <Route path="/activate" element={<ProtectedRoute><PaymentDashboard /></ProtectedRoute>} />
            <Route path="/waiting" element={<ProtectedRoute><WaitingApproval /></ProtectedRoute>} />


            {/* Protected Dashboard Routes (Fleet Managers) */}
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['OWNER', 'MANAGER']}><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<DashboardHome />} />
              <Route path="offices" element={<Offices />} />
              <Route path="vehicles" element={<Vehicles />} />
              <Route path="drivers" element={<Drivers />} />
              <Route path="payments" element={<Payments />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="settings" element={<Settings />} />
              <Route path="tracking" element={<Tracking />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="profile" element={<Profile />} />
              <Route path="managers" element={<Managers />} />
            </Route>

            {/* Platform Admin Routes (Super Admin) - Protégées par rôle */}
            <Route path="/platform" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><PlatformLayout /></ProtectedRoute>}>
              <Route index element={<PlatformDashboard />} />
              <Route path="users" element={<PlatformUsers />} />
              <Route path="companies" element={<PlatformCompanies />} />
              <Route path="licenses" element={<LicenseRequests />} />
              <Route path="devices" element={<DeviceRequests />} />
              <Route path="settings" element={<PlatformSettings />} />
              <Route path="feedbacks" element={<PlatformFeedbacks />} />
            </Route>

            {/* Catch all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
