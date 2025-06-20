import './css/drivers.css';

const Drivers = () => {
  return (
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
              <th>Nom</th>
              <th>Prénom</th>
              <th>Numéro CIN</th>
              <th>Status</th>
              <th>Dette</th>
              <th>Dernière activitée</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John</td>
              <td>Doe</td>
              <td>123456</td>
              <td>Disponible</td>
              <td>125.000Ar</td>
              <td>10 Juin 2024</td>
              <td>
                <button className="driver-list-button">
                  <i className="bx bx-edit-alt"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td>John</td>
              <td>Doe</td>
              <td>123456</td>
              <td>Disponible</td>
              <td>125.000Ar</td>
              <td>10 Juin 2024</td>
              <td>
                <button className="driver-list-button">
                  <i className="bx bx-edit-alt"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td>John</td>
              <td>Doe</td>
              <td>123456</td>
              <td>Disponible</td>
              <td>125.000Ar</td>
              <td>10 Juin 2024</td>
              <td>
                <button className="driver-list-button">
                  <i className="bx bx-edit-alt"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td>John</td>
              <td>Doe</td>
              <td>123456</td>
              <td>Disponible</td>
              <td>125.000Ar</td>
              <td>10 Juin 2024</td>
              <td>
                <button className="driver-list-button">
                  <i className="bx bx-edit-alt"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td>John</td>
              <td>Doe</td>
              <td>123456</td>
              <td>Disponible</td>
              <td>125.000Ar</td>
              <td>10 Juin 2024</td>
              <td>
                <button className="driver-list-button">
                  <i className="bx bx-edit-alt"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td>John</td>
              <td>Doe</td>
              <td>123456</td>
              <td>Disponible</td>
              <td>125.000Ar</td>
              <td>10 Juin 2024</td>
              <td>
                <button className="driver-list-button">
                  <i className="bx bx-edit-alt"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button className="driver-add">Ajouter</button>
    </div>
  );
};

export default Drivers;