import { useEffect, useState } from "react";
import "./css/dashboard.css";
import IncomeGraph from "../component/graph/incomeGraph";




const Dashboard = () => {
  const [date, setDate] = useState("");
  const [dailyIncome, setDailyIncome] = useState(localStorage.getItem("dailyIncome") || 0);
  const [workingBajaj] = useState(localStorage.getItem("workingBajaj") || 0);
  const [balance, setBalance] = useState(parseFloat(localStorage.getItem("balance")) || 0);
  const [bajajList] = useState( JSON.parse(localStorage.getItem("bajajList")) || []);
  const [symbol, setSymbol] = useState("Ar");

  const formatDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0"); // Ajoute un zéro devant si < 10
    const month = String(date.getMonth() + 1).padStart(2, "0"); // +1 car getMonth() commence à 0
    const year = date.getFullYear();

    setDate(`${day}/${month}/${year}`);
  };

  const handleOnChange = (e) => {
    setDailyIncome(e.target.value);
  };

  const handleDailyIncome = (e) => {
    e.preventDefault();
    localStorage.setItem("dailyIncome", dailyIncome);
    console.log('dailyIncome', dailyIncome);
    window.location.reload();
  };

  const fmgConvert = () => {
    if (symbol === "Ar") {
      setBalance((balance * 5).toFixed(2));
      setSymbol("FMG");
    } else {
      setBalance((balance / 5).toFixed(2));
      setSymbol("Ar");
    }
    localStorage.setItem("balance", balance);
    localStorage.setItem("symbol", symbol);
    
  };

  useEffect(() => {
    formatDate();
    
  }, []);

  return (
    <div className="dash-container">
      <title>Tableau de bord</title>
      
      <section className="info-card-container">
        <div className="info-card" id="date-card">
          <i class="bx bxs-calendar"></i>
          <p>{date}</p>
        </div>

        <div className="info-card" id="working-card">
          <i class="bx bx-stopwatch"></i>
          <p> {workingBajaj} / {bajajList.length} </p>
        </div>

        <div className="info-card" id="balance-card">
          <i class="bx bx-wallet"></i>
          <p onClick={fmgConvert}>{balance} {symbol}</p>
        </div>
      </section>
      <section className="content-container">
        <div className="line-section">
          <span className="graph-container">
            
            <IncomeGraph />
          </span>
          <span className="income-entry-container">
            <h3 className="title">Versement</h3>
            <p className="income-entry-text">Veuillez saisir le montant du versement journalier en Ariary</p>
            <form className="income-entry-form" action="">
              <input
                type="number"
                name="income-entry"
                id=""
                onChange={handleOnChange}
                placeholder="Saisir le montant"
              />
              <button onClick={(e) => handleDailyIncome(e)} className="income-entry-button">Confirmer</button>
            </form>
            <h3 className="income-entry-shows">Le versement journalier est de : {localStorage.getItem("dailyIncome")} Ariary</h3>
          </span>
        </div>
        <div className="status-container">
          <h3 className="title">
            Status Bajaj
          </h3>
          <table class="status-table">
    <thead>
        <tr>
            <th>Bajaj</th>
            <th>Numéro de plaque</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Bajaj 001</td>
            <td>1234 TAA</td>
            <td><span class="status actif">Actif</span></td>
        </tr>
        <tr>
            <td>Bajaj 002</td>
            <td>5678 TAA</td>
            <td><span class="status inactif">Inactif</span></td>
        </tr>
        <tr>
            <td>Bajaj 003</td>
            <td>9101 TAA</td>
            <td><span class="status en-panne">En panne</span></td>
        </tr>
        <tr>
            <td>Bajaj 004</td>
            <td>1121 TAA</td>
            <td><span class="status actif">Actif</span></td>
        </tr>
    </tbody>
</table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
