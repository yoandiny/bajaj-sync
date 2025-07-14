// src/component/LandingNav.js (Corrigé)

import logo from "../assets/logo.png";
import { Link, Outlet } from "react-router-dom";
import "./css/landingNav.css";

export default function LandingNav() {
  return (
    
    <>
      <nav className="landing-nav">
        <Link to="/">
          <img src={logo} alt="logo" className="logo" />
        </Link>
        <div className="links">
          <Link to="/features">Features</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          
          <Link to="/version-choose" id="launch-button">Launch App</Link>
        </div>
      </nav>

      
      <main>
        <Outlet />
      </main>
    </>
  );
}