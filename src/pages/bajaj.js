import "./css/bajaj.css";
import AddBajaj from '../component/addBajaj';
import { useState } from "react";

const Bajaj = () => {
  const [searchBajaj, setSearchBajaj] = useState("");
  const [bajajList, setBajajList] = useState( JSON.parse(localStorage.getItem("bajajList")) || []);
  const [popUpStatus, setPopUpStatus] = useState(localStorage.getItem("popupStatus") || "hide");

  const handleSearchBajaj = (e) => {
    setSearchBajaj(e.target.value);
  }



  return (
    <div className="bajaj-container">
      <title>Bajaj</title>
      <h3 className="title">Gestion des Bajaj</h3>
      <span className="search-bajaj">
        <input
          className="search-bajaj-input"
          type="text"
          name="search"
          id="search"
          placeholder="Rechercher un Bajaj"
          onChange={handleSearchBajaj}
        />
        <i class="bx bx-search-alt"></i>
      </span>

      <div className="bajaj-list-container">
        <table className="bajaj-list">
          <thead>
            <tr>
              <th>Identifiant</th>
              <th>Nom</th>
              <th>Plaque d'immatriculation</th>
              <th>Chauffeur assigné</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bajajList.map((bajaj) => (
              
            <tr>
              <td>{bajaj.id}</td>
              <td>{bajaj.name}</td>
              <td>{bajaj.plate_number}</td>
              <td>{bajaj.driver}</td>
              <td>{bajaj.status}</td>
              <td>
                <button className="bajaj-list-button">
                  <i class="bx bx-edit-alt"></i>
                </button>
              </td>
            </tr>
            ))}

          </tbody>
        </table>
      </div>
      <button onClick={() => setPopUpStatus("show")} className="bajaj-add">Ajouter</button>
      <div className={`bajaj-popup ${popUpStatus}`}>
        <AddBajaj />
      </div>
    </div>
  );
};

export default Bajaj;
