import { use, useState } from 'react';
import './css/addBajaj.css';
import axios from 'axios';


const AddBajaj = () => {
    
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const [bajajForm, setBajajForm] = useState({
        companyId : userInfo.company_id,
        name:'',
        plateNumber: '',
        driverId: ''
    });
    const [driverList] = useState(JSON.parse(localStorage.getItem('driverList')) || []);

    const handleAdd = async (e) =>{
        e.preventDefault();
        console.log('bajajForm', bajajForm);
        try {
            if(bajajForm.name !== '' && bajajForm.plateNumber !== '' && bajajForm.driver !== ''){
           const addBajaj = await axios.post('https://bajaj-sync-backend.glitch.me/add-bajaj', bajajForm);
           if(addBajaj.status === 200){
                alert('Bajaj ajouté avec succès');
                window.location.href = '/bajaj';
            
            }
        }else{
            alert('Veuillez remplir tous les champs');
        }
        } catch (error) {
            if(error.response){
                if(error.response.status === 400){
                    alert("Veuillez remplir tous les champs");
                }else if(error.response.status === 500){
                    alert("Une erreur est survenue, veuillez réessayer plus tard");
                }
            }else{
                alert("Une erreur est survenue, veuillez vérifier votre connexion internet");
            }
            
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
                <input type="text" onChange={handleFormChange}  name='plateNumber' placeholder="Plaque d'immatriculation " />
                <label htmlFor="">Chauffeur assigné</label>
                <select name="driverId" onChange={handleFormChange}  id="driver-list">
                    <option value="">-- Sélectionnez un chauffeur --</option>
                    {driverList.map((driver) => (
                        <option value={driver.id}>{driver.last_name} {driver.first_name} </option>
                    ))}
                </select>

                <button onClick={handleAdd} className='add-bajaj-button' type='submit'>Ajouter</button>
            </form>
        </div>
    );
};

export default AddBajaj;