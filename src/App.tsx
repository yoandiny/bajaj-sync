import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { PlatformLayout } from './layouts/PlatformLayout'; // Import Platform Layout

// Public Pages
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DownloadPage from './pages/Download';
import Footer from './components/Footer';
import Activate from './pages/Activate';
import Login from './pages/Login';

// Dashboard Pages
import DashboardHome from './pages/dashboard/DashboardHome';
import Offices from './pages/dashboard/Offices';
import Vehicles from './pages/dashboard/Vehicles';
import Drivers from './pages/dashboard/Drivers';
import Payments from './pages/dashboard/Payments';
import Expenses from './pages/dashboard/Expenses';
import Settings from './pages/dashboard/Settings';
import Tracking from './pages/dashboard/Tracking';
import Feedback from './pages/dashboard/Feedback';
import Profile from './pages/dashboard/Profile'; // Import Profile

// Platform Admin Pages
import PlatformDashboard from './pages/platform/PlatformDashboard';
import PlatformUsers from './pages/platform/PlatformUsers';
import LicenseRequests from './pages/platform/LicenseRequests';
import DeviceRequests from './pages/platform/DeviceRequests';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen font-sans text-gray-900">
          <Routes>
            {/* Public Routes */}
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
            <Route path="/activate" element={<Activate />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Dashboard Routes (Fleet Managers) */}
            <Route path="/dashboard" element={<DashboardLayout />}>
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
            </Route>

            {/* Platform Admin Routes (Super Admin) */}
            <Route path="/platform" element={<PlatformLayout />}>
              <Route index element={<PlatformDashboard />} />
              <Route path="users" element={<PlatformUsers />} />
              <Route path="licenses" element={<LicenseRequests />} />
              <Route path="devices" element={<DeviceRequests />} />
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
