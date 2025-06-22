import { useEffect, useState } from 'react';
import './css/expenses.css';

const Expenses = () => {
    const [expenseList, setExpenseList] = useState(JSON.parse(localStorage.getItem('expenseList')) || []);
    const [bajajList] = useState(JSON.parse(localStorage.getItem('bajajList')) || []);
    const [driverList] = useState(JSON.parse(localStorage.getItem('driverList')) || []);
    const [expenseForm, setExpenseForm] = useState({
        date: '',
        bajaj: '',
        driver: '', 
        amount: '',
        note: ''
    });

    const handleAddExpense = (e) => {
    e.preventDefault();
    console.log('expenseForm', expenseForm);
    if (expenseForm.date && expenseForm.bajaj && expenseForm.amount) {
      const lastId = parseInt(localStorage.getItem('expenseIdCounter')) || 0;
      const newId = lastId + 1;
      localStorage.setItem('expenseIdCounter', newId.toString());

      const newExpense = {
        id: newId,
        date: expenseForm.date,
        bajaj: expenseForm.bajaj,
        driver: expenseForm.driver,
        amount: expenseForm.amount,
        note: expenseForm.note
      };

      const updatedExpenseList = [...expenseList, newExpense];
      localStorage.setItem('expenseList', JSON.stringify(updatedExpenseList));
      setExpenseForm({
        date: '',
        bajaj: '',
        driver: '',
        amount: '',
        note: ''
      });
      // window.location.reload(); // Remplacé par une mise à jour d'état
      setExpenseList(updatedExpenseList); // Mise à jour immédiate sans rechargement
    } else {
      alert('Veuillez remplir tous les champs.');
    };
    
  };

  const handleDelete = (id) => {
    const filteredList = expenseList.filter((expense) => expense.id !== id);
    localStorage.setItem('expenseList', JSON.stringify(filteredList));
    setExpenseList(filteredList);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setExpenseForm({
      ...expenseForm,
      [name]: value
    });
  };

  useEffect(() => {
    if (!localStorage.getItem('expenseIdCounter')) {
      localStorage.setItem('expenseIdCounter', '0');
    }
  }, []);

    return (
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
    );
}

export default Expenses;