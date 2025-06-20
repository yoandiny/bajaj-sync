import './css/income.css';

const Income = () =>{
    return(
        <div className="income-container">
            <title>Versement</title>
            <h3 className='title'>
                Gestion des versements
            </h3>

            <form className='income-form' action="">
                <div className="first-part">

                <label htmlFor="date">Date</label>
                <input className='income-form-input' type="date" name="date" id="income-date" />
                <label htmlFor="bajaj">Bajaj</label>
                <select className='income-form-input' name="bajaj" id="income-bajaj-list">
                    <option value="">-- Sélectionner un Bajaj --</option>
                </select>
                <label htmlFor="driver"> Chauffeur</label>
                <select className='income-form-input' name="driver" id="income-driver-list">
                    <option value="">-- Sélectionner un chauffeur --</option>
                </select>
                </div>
                <div className="second-part">

                <label htmlFor="amount">Montant</label>
                <input className='income-form-input' type="number" name="amount" id="income-amount" />
                <label htmlFor="note">Note</label>
                <input className='income-form-input' type="text" name="note" id="income-note" /><br />
                <button className='income-form-button' type="submit">Ajouter</button>
                </div>
            </form>

            <section className='income-list'>
                <table className='income-list-table'>

                </table>

            </section>
        </div>
    );
}

export default Income;