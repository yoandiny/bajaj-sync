import './css/expenses.css';

const Expenses = () => {
    return (
        <div className="expense-container">
            <title>Charges</title>
            <h3 className='title'>
                Gestion des Charges
            </h3>

            <form className='expense-form' action="">
                <div className="first-part">
                    <label htmlFor="expense-date">Date</label>
                    <input className='expense-form-input' type="date" name="date" id="expense-date" />

                    <label htmlFor="expense-bajaj-list">Bajaj</label>
                    <select className='expense-form-input' name="bajaj" id="expense-bajaj-list">
                        <option value="">-- Sélectionner un Bajaj --</option>
                    </select>

                    <label htmlFor="expense-driver-list">Chauffeur</label>
                    <select className='expense-form-input' name="driver" id="expense-driver-list">
                        <option value="">-- Sélectionner un chauffeur --</option>
                    </select>
                </div>

                <div className="second-part">
                    <label htmlFor="expense-amount">Montant</label>
                    <input className='expense-form-input' type="number" name="amount" id="expense-amount" />

                    <label htmlFor="expense-note">Note</label>
                    <input className='expense-form-input' type="text" name="note" id="expense-note" />
                    
                    <button className='expense-form-button' type="submit">Ajouter</button>
                </div>
            </form>

            <section className="expense-list">
                <table className='expense-list-table'>
                    {/* Le contenu de votre tableau (en-têtes, lignes) ira ici */}
                </table>
            </section>
        </div>
    );
}

export default Expenses;