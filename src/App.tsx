import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DownloadPage from './pages/Download';
import Footer from './components/Footer';
import Activate from './pages/Activate';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <Routes>
          <Route path="/" element={
            <>
              <Navbar />
              <main>
                <Home />
              </main>
              <Footer />
            </>
          } />
          <Route path="/download" element={<DownloadPage />} />
          <Route path="/activate" element={<Activate />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
