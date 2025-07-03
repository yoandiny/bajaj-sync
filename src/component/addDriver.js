import { useState } from 'react';
import './css/addDriver.css';
import axios from 'axios';


const AddDriver = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const [driverForm, setDriverForm] = useState({
        companyId: userInfo.company_id,
        lastName:'',
        firstName: '',
        cin: ''
    });


    const handleAdd = async(e) =>{
        e.preventDefault();
        if(driverForm.lastName !== '' && driverForm.firstName !== '' && driverForm.cin !== ''){
            const addDrriver = await axios.post('https://bajaj-sync-backend.glitch.me/add-driver', driverForm);
            if(addDrriver.status === 200){
                alert('Chauffeur ajouté avec succès');
                window.location.href = '/drivers';
            }
        }else{
            alert('Veuillez remplir tous les champs');
        }
    }

    const handleFormChange = (e) => {
        setDriverForm({
            ...driverForm,
            [e.target.name]: e.target.value
        });
    }

    return (
        <div className='add-bajaj-container'>
            <button onClick={() =>{window.location.href = '/drivers'}} className='close-button'>X</button>
            <h1 className='add-bajaj-title'>Ajouter un chauffeur</h1>
            <form className='add-bajaj-form' action="">
                <label htmlFor="">Nom</label>
                <input type="text" onChange={handleFormChange} name='lastName' placeholder='Nom' />
                <label htmlFor="">Prénom</label>
                <input type="text" onChange={handleFormChange} name='firstName' placeholder='Prénom' />
                <label htmlFor="">Numéro de CIN</label>
                <input type="text" onChange={handleFormChange}  name='cin' placeholder="CIN " />
                

                <button onClick={handleAdd} className='add-bajaj-button' type='submit'>Ajouter</button>
            </form>
        </div>
    );
};

export default AddDriver;