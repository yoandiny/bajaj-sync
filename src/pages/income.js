import { useEffect, useState } from 'react';
import './css/income.css';
import Animation from '../component/animation';

const Income = () =>{
    const [incomeList, setIncomeList] = useState( JSON.parse(localStorage.getItem('incomeList')) || []);
    const [bajajList] = useState(JSON.parse(localStorage.getItem('bajajList')) || []);
    const [driverList, setDriverList] = useState(JSON.parse(localStorage.getItem('driverList')) || []);
    const [incomeForm, setIncomeForm] = useState({
        date: '',
        bajaj: '',
        driver: '',
        amount: '',
        note: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setIncomeForm({
            ...incomeForm,
            [name]: value
        });
    };

    const fullIncome = (e) => {
        e.preventDefault();

        if(incomeForm.date && incomeForm.bajaj && incomeForm.driver){
            const lastId = parseInt(localStorage.getItem("incomeIdCounter")) || 0;
  const newId = lastId + 1;
  localStorage.setItem("incomeIdCounter", newId.toString());

  const newIncome = {
    id: newId,
    date: incomeForm.date,
    bajaj: incomeForm.bajaj,
    driver: incomeForm.driver,
    amount: parseInt(localStorage.getItem("dailyIncome")) ,
    note: `Versement complet ${incomeForm.driver} ${incomeForm.bajaj}`
  };

  const updatedIncomeList = [...incomeList, newIncome];
  localStorage.setItem('incomeList', JSON.stringify(updatedIncomeList));

  setIncomeForm({
    date: '',
    bajaj: '',
    driver: '',
    amount: '',
    note: ''
  });

  window.location.reload();
        }else{
            alert("Veuillez remplir tous les champs.");
        }
    };

    const handleIncome = (e) =>{
        e.preventDefault();

        if(incomeForm.date && incomeForm.bajaj && incomeForm.driver && incomeForm.amount){
            // Obtenir et incrémenter le dernier ID
  const lastId = parseInt(localStorage.getItem("incomeIdCounter")) || 0;
  const newId = lastId + 1;
  localStorage.setItem("incomeIdCounter", newId.toString());

  const newIncome = {
    id: newId,
    date: incomeForm.date,
    bajaj: incomeForm.bajaj,
    driver: incomeForm.driver,
    amount: incomeForm.amount,
    note: incomeForm.note
  };

  const updatedIncomeList = [...incomeList, newIncome];
  localStorage.setItem('incomeList', JSON.stringify(updatedIncomeList));

  setIncomeForm({
    date: '',
    bajaj: '',
    driver: '',
    amount: '',
    note: ''
  });

  window.location.reload();
        }else{
            alert("Veuillez remplir tous les champs.");
        }
    };

const handleDelete = (id) => {
  const filteredList = incomeList.filter(income => income.id !== id);
  localStorage.setItem("incomeList", JSON.stringify(filteredList));
  setIncomeList(filteredList);
};

useEffect(() => {
  if (!localStorage.getItem("incomeIdCounter")) {
    localStorage.setItem("incomeIdCounter", "0");
  }
}, []);

    return(
       <Animation>
         <div className="income-container">
            <title>Versement</title>
            <h3 className='title'>
                Gestion des versements
            </h3>

            <form className='income-form' action="">
                <div className="first-part">

                <label htmlFor="date">Date</label>
                <input className='income-form-input' type="date" name="date" id="income-date" onChange={handleChange} />
                <label htmlFor="bajaj">Bajaj</label>
                <select className='income-form-input' name="bajaj" id="income-bajaj-list" onChange={handleChange}>
                    <option value="">-- Sélectionner un Bajaj --</option>
                    {bajajList.map((bajaj) => (
                        <option value={bajaj.id}>{bajaj.name}</option>
                    ))}
                </select>
                <label htmlFor="driver"> Chauffeur</label>
                <select className='income-form-input' name="driver" id="income-driver-list" onChange={handleChange}>
                    <option value="">-- Sélectionner un chauffeur --</option>
                    {driverList.map((driver) => (
                        <option value={driver.id}>{driver.last_name} {driver.first_name} </option>
                    ))}
                </select>
                </div>
                <div className="second-part">

                <label htmlFor="amount">Montant</label>
                <input className='income-form-input' type="number" name="amount" id="income-amount" onChange={handleChange} />
                <label htmlFor="note">Note</label>
                <input className='income-form-input' type="text" name="note" id="income-note" onChange={handleChange} /><br />
                <div className="income-form-button-container">
                    <button onClick={handleIncome} id='add-income' className='income-form-button' type="submit">Ajouter</button>
                    <button onClick={fullIncome} id='complete-income' className='income-form-button'>Versement complet</button>
                </div>
                </div>
            </form>

            <section className='income-list'>
                <table className='income-list-table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Bajaj</th>
                            <th>Chauffeur</th>
                            <th>Montant (Ar)</th>
                            <th>Note</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incomeList.length > 0 ? (
                            incomeList.map((income) => (
                                <tr>
                                    <td>{income.id}</td>
                                    <td>{income.date}</td>
                                    <td>{income.bajaj}</td>
                                    <td>{income.driver}</td>
                                    <td>{income.amount}</td>
                                    <td>{income.note}</td>
                                    <td>
                                        <button onClick={() => handleDelete(income.id)}>Supprimer</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">Aucun versement enregistré.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </section>
        </div>
        </Animation>
    );
}

export default Income;