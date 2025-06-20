import "./css/bajaj.css";

const Bajaj = () => {
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
        />
        <i class="bx bx-search-alt"></i>
      </span>

      <div className="bajaj-list-container">
        <table className="bajaj-list">
          <thead>
            <tr>
              <th>Identifiant</th>
              <th>Plaque d'immatriculation</th>
              <th>Chauffeur assigné</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>ABC-123</td>
              <td>John Doe</td>
              <td>Disponible</td>
              <td>
                <button className="bajaj-list-button">
                  <i class="bx bx-edit-alt"></i>
                </button>
              </td>
            </tr>

            <tr>
              <td>2</td>
              <td>ABC-123</td>
              <td>John Doe</td>
              <td>Disponible</td>
              <td>
                <button className="bajaj-list-button">
                  <i class="bx bx-edit-alt"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td>3</td>
              <td>ABC-123</td>
              <td>John Doe</td>
              <td>Disponible</td>
              <td>
                <button className="bajaj-list-button">
                  <i class="bx bx-edit-alt"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td>4</td>
              <td>ABC-123</td>
              <td>John Doe</td>
              <td>Disponible</td>
              <td>
                <button className="bajaj-list-button">
                  <i class="bx bx-edit-alt"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td>5</td>
              <td>ABC-123</td>
              <td>John Doe</td>
              <td>Disponible</td>
              <td>
                <button className="bajaj-list-button">
                  <i class="bx bx-edit-alt"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td>6</td>
              <td>ABC-123</td>
              <td>John Doe</td>
              <td>Disponible</td>
              <td>
                <button className="bajaj-list-button">
                  <i class="bx bx-edit-alt"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button className="bajaj-add">Ajouter</button>
    </div>
  );
};

export default Bajaj;
