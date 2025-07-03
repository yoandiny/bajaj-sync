import "./css/navbar.css";
import Logo from "../assets/logo.png";
import Profile from "../assets/profile.png";
import menuLogo from "../assets/menu.png";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(localStorage.getItem("isLogged") || "false");
  const [profileShow, setProfileShow] = useState("hide");
  const navigate = useNavigate();
 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const showProfile = () => {
    if(isLogged === "true"){
      setProfileShow("show");
    }
  }

  useEffect(()=>{
    showProfile();
  },[isLogged]);

  return (
    <div className="nav-container">
      <link
        href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
        rel="stylesheet"
      />
      <div className="top-nav">
        <section className="nav-left">
          <button id="menu-toggle" onClick={toggleSidebar}>
            <img src={menuLogo} alt="Menu" className="menu-icon" />
          </button>
        </section>
        <div className="nav-brand">
          <img onClick={()=>{ navigate('/')}} src={Logo} alt="BajajSync Logo" className="nav-logo" />
        </div>
        <section className="nav-right">
          <div className="profile">

            <img className={`${profileShow}`} onClick={()=>{ navigate('/profile')}} src={Profile} alt="profile-picture" />
            <div className={`${profileShow} status`} ></div>
          </div>
          
        </section>
      </div>
      <section className="main-content">
        <div className={`sidebar ${isSidebarOpen ? "enable" : ""}`}>
          <ul>
            <li>
              <Link to="/" onClick={() => setIsSidebarOpen(false)}>
                <i className="bx bxs-dashboard"></i> Tableau de bord
              </Link>
            </li>
            <li>
              <Link to="/drivers" onClick={() => setIsSidebarOpen(false)}>
                <i className="bx bxs-id-card"></i> Chauffeurs
              </Link>
            </li>
            
            <li>
              <Link to="/bajaj" onClick={() => setIsSidebarOpen(false)}>
                <i className="bx bxs-taxi"></i> Bajaj
              </Link>
            </li>
            
            <li>
              <Link to="/income" onClick={() => setIsSidebarOpen(false)}>
                <i className="bx bx-wallet-alt"></i> Versements
              </Link>
            </li>
            <li>
              <Link to="/expenses" onClick={() => setIsSidebarOpen(false)}>
                <i className="bx bx-money-withdraw"></i> Charges
              </Link>
            </li>
          </ul>
        </div>
        <main className="page-content">
          <Outlet />
        </main>
      </section>
    </div>
  );
};

export default Navbar;
