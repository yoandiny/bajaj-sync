import "./css/bajaj.css";
import AddBajaj from '../component/addBajaj';
import { useEffect, useState } from "react";
import Animation from "../component/animation";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Bajaj = () => {
  const [searchBajaj, setSearchBajaj] = useState("");
  const [bajajList, setBajajList] = useState( JSON.parse(localStorage.getItem("bajajList")) || []);
  const [popUpStatus, setPopUpStatus] = useState(localStorage.getItem("popupStatus") || "hide");

  const handleSearchBajaj = (e) => {
    setSearchBajaj(e.target.value);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchBajaj){
      const filteredBajaj = bajajList.filter((bajaj) =>
        bajaj.name.toLowerCase().includes(searchBajaj.toLowerCase())
      );
      setBajajList(filteredBajaj);
    }else{
      setBajajList(JSON.parse(localStorage.getItem("bajajList")) || []);
    }
  };

   const navigate = useNavigate();
      const [isLogged] = useState(localStorage.getItem("isLogged")|| "false");
          
          const verifyLog = () =>{
              if(isLogged === "false"){
                  navigate("/login");
                  
              }
          }

    const handleBajajList = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    try {
        const getBajajList = await axios.get(`https://bajaj-sync-backend.glitch.me/bajaj-list?company_id=${userInfo.company_id}`);
        if(getBajajList.status === 200){
            setBajajList(getBajajList.data);
            localStorage.setItem("bajajList", JSON.stringify(getBajajList.data));
        }
    }
    catch (error) {
        if(error.response){
          if(error.response.status === 404){
            setBajajList([]);
            localStorage.setItem("bajajList", JSON.stringify([]));
          }
        }
    }
    };

  useEffect(() => {
    verifyLog();
    handleBajajList();
  },[])



  return (
    <Animation>
      <div className="bajaj-container">
      <title>Bajaj</title>
      <h3 className="title">Gestion des Bajaj</h3>
      <span className="search-bajaj">
        <input
        onSubmit={handleSearch}
          className="search-bajaj-input"
          type="text"
          name="search"
          id="search"
          placeholder="Rechercher un Bajaj"
          onChange={handleSearchBajaj}
        />
        <i onClick={handleSearch} class="bx bx-search-alt"></i>
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
              <td>{bajaj.last_name} {bajaj.first_name}</td>
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
      </Animation>
  );
};

export default Bajaj;
