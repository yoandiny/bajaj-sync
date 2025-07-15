// src/component/LandingNav.js (Corrigé)

import logo from "../assets/logo.png";
import { Link, Outlet } from "react-router-dom";
import "./css/landingNav.css";
import { useState } from 'react'; // Import useState for managing menu state

export default function LandingNav() {
  const [isOpen, setIsOpen] = useState(false); // State to control menu open/close

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className="landing-nav">
        <Link to="/">
          <img src={logo} alt="logo" className="logo" />
        </Link>

        {/* Hamburger menu icon */}
        <div className="menu-toggle" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        {/* Apply 'open' class based on isOpen state */}
        <div className={`links ${isOpen ? 'open' : ''}`}>
          <Link to="/features" onClick={() => setIsOpen(false)}>Features</Link>
          <Link to="/pricing" onClick={() => setIsOpen(false)}>Pricing</Link>
          <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
          
          <Link to="/version-choose" id="launch-button" onClick={() => setIsOpen(false)}>Launch App</Link>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </>
  );
}