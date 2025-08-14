// App.js
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./component/navbar";
import './App.css';
import Dashboard from "./pages/dashboard";
import Bajaj from "./pages/bajaj";
import Drivers from "./pages/drivers";
import Income from "./pages/income";
import Expenses from "./pages/expenses";
import Register from "./pages/account/register";
import Login from "./pages/account/login";
import Profile from "./pages/account/profile";
import LandingNav from "./component/LandingNav";
import Landing from "./landing/Landing";
import VersionChoose from "./order/VersionChoose";
import OfflineLogin from "./pages/account/offlineLogin";
import OfflinePayment from "./pages/payment/offlinePayment";
import PaymentConfirmation from "./pages/payment/paymentConfirmation";


function AnimatedRoutes() {
  const location = useLocation();
  

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Navbar />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bajaj" element={<Bajaj />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/" element={<LandingNav />}>
        <Route index element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/version-choose" element={<VersionChoose />} />
        <Route path="/offline-login" element={<OfflineLogin />} />
        <Route path="/offline-payment" element={<OfflinePayment />} />
        <Route path="/payment-confirmation" element={<PaymentConfirmation />} />

        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
    

  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
