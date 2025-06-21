import { useState } from 'react';
import './css/addBajaj.css';


const AddBajaj = () => {
    const [tempList, setTempList] = useState(JSON.parse(localStorage.getItem('bajajList')) || []);
    const [bajajForm, setBajajForm] = useState({
        name:'',
        plate_number: '',
        driver: ''
    });
    const [driverList] = useState(JSON.parse(localStorage.getItem('driverList')) || []);

    const handleAdd = (e) =>{
        e.preventDefault();
        if(bajajForm.name !== '' && bajajForm.plate_number !== '' && bajajForm.driver !== ''){
            localStorage.setItem('bajajList', JSON.stringify([...tempList, bajajForm]));
            window.location.href = '/bajaj';
        }else{
            alert('Veuillez remplir tous les champs');
        }
    }

    const handleFormChange = (e) => {
        setBajajForm({
            ...bajajForm,
            [e.target.name]: e.target.value
        });
    }

    return (
        <div className='add-bajaj-container'>
            <button onClick={() =>{window.location.href = '/bajaj'}} className='close-button'>X</button>
            <h1 className='add-bajaj-title'>Ajouter un Bajaj</h1>
            <form className='add-bajaj-form' action="">
                <label htmlFor="">Nom du Bajaj</label>
                <input type="text" onChange={handleFormChange} name='name' placeholder='Nom du Bajaj' />
                <label htmlFor="">Plaque d'immatriculation</label>
                <input type="text" onChange={handleFormChange}  name='plate_number' placeholder="Plaque d'immatriculation " />
                <label htmlFor="">Chauffeur assigné</label>
                <select name="driver" onChange={handleFormChange}  id="driver-list">
                    <option value="">-- Sélectionnez un chauffeur --</option>
                    {driverList.map((driver) => (
                        <option value={driver.name}>{driver.name}</option>
                    ))}
                </select>

                <button onClick={handleAdd} className='add-bajaj-button' type='submit'>Ajouter</button>
            </form>
        </div>
    );
};

export default AddBajaj;