import { useEffect, useState } from "react";
import "./css/dashboard.css";
import IncomeGraph from "../component/graph/incomeGraph";
import Animation from "../component/animation";
import { useNavigate } from "react-router-dom";




const Dashboard = () => {
  const [date, setDate] = useState("");
  const [dailyIncome, setDailyIncome] = useState(localStorage.getItem("dailyIncome") || 0);
  const [workingBajaj] = useState(localStorage.getItem("workingBajaj") || 0);
  const [balance, setBalance] = useState(parseInt(localStorage.getItem("balance")) || 0);
  const [bajajList] = useState( JSON.parse(localStorage.getItem("bajajList")) || []);
  const [symbol, setSymbol] = useState("Ar");
  const [isFmg, setIsFmg] = useState("");
  

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
      setIsFmg("fmg-text");
      setBalance((balance * 5).toFixed(2));
      setSymbol("Fmg");
    } else {
      setBalance((balance / 5).toFixed(2));
      setSymbol("Ar");
    }
  };

  const getBalance = () => {
    const incomeList = JSON.parse(localStorage.getItem("incomeList")) || [];
    const expensesList = JSON.parse(localStorage.getItem("expenseList")) || [];

    const totalIncome = incomeList.reduce((acc, income) => acc + parseFloat(income.amount || 0), 0);
    const totalExpenses = expensesList.reduce((acc, expense) => acc + parseFloat(expense.amount || 0), 0);
    const totalBalance = totalIncome - totalExpenses;
    localStorage.setItem("balance", totalBalance.toFixed(2));
    setBalance(totalBalance.toFixed(2));
  };

   const navigate = useNavigate();
    const [isLogged] = useState(localStorage.getItem("isLogged")|| "false");
        
        const verifyLog = () =>{
            if(isLogged === "false"){
                navigate("/login");
                
            }
        }

  useEffect(() => {
    formatDate();
    getBalance();
    verifyLog();
    
    
  }, []);

  return (
    <Animation >
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
          <p className={`${isFmg}`} onClick={fmgConvert}>{balance} {symbol}</p>
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
            <th>Chauffeur</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
        {bajajList.map((bajaj) => (
              
            <tr>
              <td>{bajaj.name}</td>
              <td>{bajaj.plate_number}</td>
              <td>{bajaj.driver}</td>
              <td>{bajaj.status}</td>
             
            </tr>
            ))}

    </tbody>
</table>
        </div>
      </section>
    </div>
    </Animation>
  );
};

export default Dashboard;
