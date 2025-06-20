// App.js

import Navbar from "./component/navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Dashboard from "./pages/dashboard";
import Bajaj from "./pages/bajaj";
import Drivers from "./pages/drivers";
import Income from "./pages/income";
import Expenses from "./pages/expenses";


function App() {
  return (
    <Router>
      
      <Routes>
        
        <Route path="/" element={<Navbar />}>
          
          <Route index element={<Dashboard />} />
          <Route path="/bajaj" element={<Bajaj />} />
          <Route path="/drivers"element={<Drivers />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expenses" element={<Expenses />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;