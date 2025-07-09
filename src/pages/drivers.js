import './css/drivers.css';
import AddDriver from '../component/addDriver';
import { useState, useEffect } from 'react';
import Animation from '../component/animation';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Drivers = () => {
  const [popUpStatus, setPopUpStatus] = useState(localStorage.getItem("popupStatus") || "hide");
  const [driverList, setDriverList] = useState( JSON.parse(localStorage.getItem("driverList")) || []);
   const navigate = useNavigate();
    const [isLogged] = useState(localStorage.getItem("isLogged")|| "false");
        
        const verifyLog = () =>{
            if(isLogged === "false"){
                navigate("/login");
                
            }
        };

  const handleDriverList = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    try {
      const getDriverList = await axios.get(`https://bajaj-sync-backend.onrender.com/driver-list?company_id=${userInfo.company_id}`);
      if (getDriverList.status === 200) {
        setDriverList(getDriverList.data);
        localStorage.setItem("driverList", JSON.stringify(getDriverList.data));
      }
    } catch (error) {
      if(error.response){
        if(error.response.status === 404){
          setDriverList([]);
          localStorage.setItem("driverList", JSON.stringify([]));
        }
      }
    }
  };

  useEffect(() => {
    verifyLog();
    handleDriverList();
  }, []);



  return (
    <Animation>
    <div className="driver-container">
      <title>Chauffeurs</title>
      <h3 className="title">Gestion des chauffeurs</h3>
      <span className="search-driver">
        <input
          className="search-driver-input"
          type="text"
          name="search"
          id="search"
          placeholder="Rechercher un chauffeur"
        />
        <i className="bx bx-search-alt"></i>
      </span>

      <div className="driver-list-container">
        <table className="driver-list">
          <thead>
            <tr>
              <th>Identifiant</th>
              <th>Nom et Prénom</th>
              <th>Numéro CIN</th>
              <th>Status</th>
              <th>Dette</th>
              <th>Dernière activitée</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {driverList.map((driver) => (
              <tr>
              <td>{driver.id}  </td>
              <td> {driver.last_name} {driver.first_name} </td>
              <td> {driver.cin} </td>
              <td> {driver.status} </td>
              <td> {driver.debt} Ar </td>
              <td> {driver.last_activity} </td>
              <td>
                <button className="driver-list-button">
                  <i className="bx bx-edit-alt"></i>
                </button>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={()=>{setPopUpStatus("show")}} className="driver-add">Ajouter</button>

      <div className={`add-driver-popup ${popUpStatus}`}>
        <AddDriver />
      </div>
    </div>
    </Animation>
  );
};

export default Drivers;