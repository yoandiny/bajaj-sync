import { useNavigate } from 'react-router-dom';
import Finance from '../assets/finance.jpg';
import Driver from '../assets/driver.png';
import Bajaj from '../assets/bajaj.png';
import './css/landing.css';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className='landing-container'>
      
      <title>BajajSync</title>
      <h1 className='landing-title'>BajajSync</h1>

      <section id='features'>
        <span className="feature-card-container">
          <div className="feature-card">
            <img className='feature-card-image' src={Finance} alt="" />
          </div>
          <div className="feature-card">
            <img className='feature-card-image' src={Driver} alt="" />
          </div>
          
          <div className="feature-card">
            <img className='feature-card-image' src={Bajaj} alt="" />
          </div>
        </span>
      </section>

      <h1 className='landing-title'>Pricing</h1>

      <section id='pricing'>
        <span className="pricing-card-container">
          <div id='first-offer' className="pricing-card">
            <h2>Free</h2>
            <p>Basic features for free users.</p>
            <p>--------</p>
<<<<<<< HEAD
            <p><i class='bx bx-check-circle'></i> Online mode</p>
            <p><i class='bx bx-check-circle'></i> Gestion des Bajaj</p>
            <p><i class='bx bx-check-circle'></i> Gestion des chauffeurs</p>
            <p><i class='bx bx-check-circle'></i> Gestion des Versements</p>
            <p><i class='bx bx-check-circle'></i> Gestion des dépenses</p>
            <p><i class='bx bx-x-circle'></i> Gestion automatique</p>
            <p><i class='bx bx-x-circle'></i> Sauvegarde Cloud</p>
            <p><i class='bx bx-x-circle'></i> Service SMS</p>
            <button onClick={()=> navigate('/offline')} className='pricing-card-button'>
              Commander
            </button>
          </div>
          <div id='second-offer' className="pricing-card">
            <h2>Offline</h2>
            <p>Basic features for free users.</p>
            <p>--------</p>
            <p><i class='bx bx-x-circle'></i> Online mode</p>
            <p><i class='bx bx-check-circle'></i> Gestion des Bajaj</p>
            <p><i class='bx bx-check-circle'></i> Gestion des chauffeurs</p>
            <p><i class='bx bx-check-circle'></i> Gestion des Versements</p>
            <p><i class='bx bx-check-circle'></i> Gestion des dépenses</p>
            <p><i class='bx bx-x-circle'></i> Gestion automatique</p>
            <p><i class='bx bx-x-circle'></i> Sauvegarde Cloud</p>
            <p><i class='bx bx-x-circle'></i> Service SMS</p>
=======
            <p><i className='bx bx-x-circle'></i> Online mode</p>
            <p><i className='bx bx-check-circle'></i> Gestion des Bajaj</p>
            <p><i className='bx bx-check-circle'></i> Gestion des chauffeurs</p>
            <p><i className='bx bx-check-circle'></i> Gestion des Versements</p>
            <p><i className='bx bx-check-circle'></i> Gestion des dépenses</p>
            <p><i className='bx bx-x-circle'></i> Gestion automatique</p>
            <p><i className='bx bx-x-circle'></i> Service SMS</p>
>>>>>>> e01540fac123fbb6245fb7c38611f886b2b03ab0
            <button onClick={()=> navigate('/offline')} className='pricing-card-button'>
              Commander
            </button>
          </div>
          <div className="pricing-card"></div>
        </span>
      </section>

    </div>
  );
}