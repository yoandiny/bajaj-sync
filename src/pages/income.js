import { use, useEffect, useState } from 'react';
import './css/income.css';
import Animation from '../component/animation';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Income = () =>{
    const [incomeList, setIncomeList] = useState( JSON.parse(localStorage.getItem('incomeList')) || []);
    const [bajajList] = useState(JSON.parse(localStorage.getItem('bajajList')) || []);
    const [driverList, setDriverList] = useState(JSON.parse(localStorage.getItem('driverList')) || []);
    const [userInfo] = useState(JSON.parse(localStorage.getItem('userInfo')) || {});
    const [incomeForm, setIncomeForm] = useState({
        companyId: userInfo.company_id || '',
        date: '',
        bajajId: '',
        driverId: '',
        amount: '',
        description: '',
        type: 'Versement'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setIncomeForm({
            ...incomeForm,
            [name]: value
        });
    };

    const getIncomeList = async (companyId) => {

        try {
            const response = await axios.get(`https://bajaj-sync-backend.onrender.com/transaction-list?companyId=${companyId}&transType=Versement`);
            if (response.status === 200) {
                console.log('response.data', response.data);
                setIncomeList(response.data);
                localStorage.setItem("incomeList", JSON.stringify(response.data));
            }
        } catch (error) {
            console.error("Error fetching income list:", error);
        }
    };

    

    const handleIncome = async(e, mode) =>{
        e.preventDefault();

        console.log(incomeForm.companyId);

        if(incomeForm.date && incomeForm.bajajId && incomeForm.driverId && incomeForm.amount){
            
            

            const sendIcome = await axios.post("https://bajaj-sync-backend.onrender.com/add-transaction", incomeForm);
                if(sendIcome.status === 200){
                    getIncomeList(userInfo.company_id);
                    setIncomeForm({
                        companyId: userInfo.company_id || '',
                        date: '',
                        bajaj: '',
                        driver: '',
                        amount: '',
                        description: '',
                        type: 'Versement'
                    });
                }
        }else{
            alert("Veuillez remplir tous les champs.");
        }
    };

    const handleCompleteIncome = async(e) => {
        e.preventDefault();
        if(incomeForm.date && incomeForm.bajajId && incomeForm.driverId){

            try {
                const fullForm = {
                companyId: userInfo.company_id,
                date: incomeForm.date,
                bajajId: incomeForm.bajajId,
                driverId: incomeForm.driverId,
                amount: parseInt(localStorage.getItem("dailyIncome")),
                type: 'Versement'
                }
            const completeIncome = await axios.post("https://bajaj-sync-backend.onrender.com/full-income", fullForm);
            if (completeIncome.status === 200) {
                getIncomeList(userInfo.company_id);
            }
        } catch (error) {
            console.error("Error completing income:", error);
        }

        }
        
    };

const handleDelete = async(id) => {
  try {
    const deleteIncome = await axios.post("https://bajaj-sync-backend.onrender.com/delete-transaction", { transactionId: id });
    if (deleteIncome.status === 200) {
        getIncomeList(userInfo.company_id);
    }
    
  } catch (error) {
    console.error("Error deleting income:", error);
    
  }
};

const navigate = useNavigate();
    const [isLogged] = useState(localStorage.getItem("isLogged")|| "false");
        
        const verifyLog = () =>{
            if(isLogged === "false"){
                navigate("/login");
                
            }
        }

useEffect(() => {
getIncomeList(userInfo.company_id);

  verifyLog();
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
                <select className='income-form-input' name="bajajId" id="income-bajaj-list" onChange={handleChange}>
                    <option value="">-- Sélectionner un Bajaj --</option>
                    {bajajList.map((bajaj) => (
                        <option value={bajaj.id}>{bajaj.name}</option>
                    ))}
                </select>
                <label htmlFor="driver"> Chauffeur</label>
                <select className='income-form-input' name="driverId" id="income-driver-list" onChange={handleChange}>
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
                <input className='income-form-input' type="text" name="description" id="income-note" onChange={handleChange} /><br />
                <div className="income-form-button-container">
                    <button onClick={handleIncome} id='add-income' className='income-form-button' type="submit">Ajouter</button>
                    <button onClick={handleCompleteIncome} id='complete-income' className='income-form-button'>Versement complet</button>
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
                                    <td>{new Date(income.date).toLocaleDateString('fr-FR')}</td>
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