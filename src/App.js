// App.js
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./component/navbar";
import './App.css';
import Dashboard from "./pages/dashboard";
import Bajaj from "./pages/bajaj";
import Drivers from "./pages/drivers";
import Income from "./pages/income";
import Expenses from "./pages/expenses";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Dashboard />} />
          <Route path="/bajaj" element={<Bajaj />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expenses" element={<Expenses />} />
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
