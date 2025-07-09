import { useEffect, useState } from 'react';
import './css/expenses.css';
import Animation from '../component/animation';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



const Expenses = () => {
    const [expenseList, setExpenseList] = useState(JSON.parse(localStorage.getItem('expenseList')) || []);
    const [userInfo] = useState(JSON.parse(localStorage.getItem('userInfo')) || {});
    const [bajajList] = useState(JSON.parse(localStorage.getItem('bajajList')) || []);
    const [driverList] = useState(JSON.parse(localStorage.getItem('driverList')) || []);
    const [expenseForm, setExpenseForm] = useState({
        date: '',
        bajaj: '',
        driver: '', 
        amount: '',
        description: '',
        type: 'Charge'
    });

    const handleAddExpense = (e) => {
    e.preventDefault();
    console.log('expenseForm', expenseForm);
    if (expenseForm.date && expenseForm.bajaj && expenseForm.amount) {
      const addExpense = async () => {
        try {
          const response = await axios.post('https://bajaj-sync-backend.onrender.com/add-transaction', expenseForm);
          if (response.status === 200) {
            getExpensesList(userInfo.company_id);
            setExpenseForm({
              date: '',
              bajaj: '',
              driver: '',
              amount: '',
              description: '',
              type: 'Charge'
            });
          }
        } catch (error) {
          console.error('Error adding expense:', error);
        }
      };
      addExpense();
    } else {
      alert('Veuillez remplir tous les champs.');
    };
    
  };

  const getExpensesList = async (companyId) => {
  
          try {
              const response = await axios.get(`https://bajaj-sync-backend.onrender.com/transaction-list?companyId=${companyId}&transType=Charge`);
              if (response.status === 200) {
                  setExpenseForm(response.data);
                  localStorage.setItem("expenseList", JSON.stringify(response.data));
              }
          } catch (error) {
              console.error("Error fetching income list:", error);
          }
      };

  const handleDelete = async(id) => {
  try {
    const deleteIncome = await axios.post("https://bajaj-sync-backend.onrender.com/delete-transaction", { transactionId: id });
    if (deleteIncome.status === 200) {
        getExpensesList(userInfo.company_id);
    }
    
  } catch (error) {
    console.error("Error deleting income:", error);
    
  }
};

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setExpenseForm({
      ...expenseForm,
      [name]: value
    });
  };

  const navigate = useNavigate();
    const [isLogged] = useState(localStorage.getItem("isLogged")|| "false");
        
        const verifyLog = () =>{
            if(isLogged === "false"){
                navigate("/login");
                
            }
        }

  useEffect(() => {
    getExpensesList(userInfo.company_id);

    verifyLog();
  }, []);

    return (
        <Animation>
            <div className="expense-container">
            <title>Charges</title>
            <h3 className='title'>
                Gestion des Charges
            </h3>

            <form className='expense-form' action="">
                <div className="first-part">
                    <label htmlFor="expense-date">Date</label>
                    <input onChange={handleFormChange} className='expense-form-input' type="date" name="date" id="expense-date" />

                    <label htmlFor="expense-bajaj-list">Bajaj</label>
                    <select onChange={handleFormChange} className='expense-form-input' name="bajaj" id="expense-bajaj-list">
                        <option value="">-- Sélectionner un Bajaj --</option>
                        {bajajList.map((bajaj) => (
                            <option key={bajaj.id} value={bajaj.id}>{bajaj.name}</option>
                        ))}
                    </select>

                    <label htmlFor="expense-driver-list">Chauffeur</label>
                    <select onChange={handleFormChange} className='expense-form-input' name="driver" id="expense-driver-list">
                        <option value="">-- Sélectionner un chauffeur --</option>
                        {driverList.map((driver) => (
                            <option key={driver.id} value={driver.id}>{driver.last_name} {driver.first_name} </option>
                        ))}
                    </select>
                </div>

                <div className="second-part">
                    <label htmlFor="expense-amount">Montant</label>
                    <input onChange={handleFormChange} className='expense-form-input' type="number" name="amount" id="expense-amount" />

                    <label htmlFor="expense-note">Note</label>
                    <input onChange={handleFormChange} className='expense-form-input' type="text" name="note" id="expense-note" />
                    
                    <button onClick={handleAddExpense} className='expense-form-button' type="submit">Ajouter</button>
                </div>
            </form>

            <section className="expense-list">
                <table className='expense-list-table'>
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
                        {expenseList.length > 0 ? (
                            expenseList.map((expense, index) => (
                                <tr>
                                    <td>{expense.id}</td>
                                    <td>{expense.date}</td>
                                    <td>{expense.bajaj}</td>
                                    <td>{expense.driver}</td>
                                    <td>{expense.amount}</td>
                                    <td>{expense.note}</td>
                                    <td>
                                        <button onClick={() => handleDelete(expense.id)}>Supprimer</button>
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

export default Expenses;