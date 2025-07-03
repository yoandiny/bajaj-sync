import { useState } from 'react';
import './css/addDriver.css';


const AddDriver = () => {
    const [tempList, setTempList] = useState(JSON.parse(localStorage.getItem('driverList')) || []);
    const [driverForm, setDriverForm] = useState({
        last_name:'',
        first_name: '',
        cin: ''
    });


    const handleAdd = (e) =>{
        e.preventDefault();
        if(driverForm.last_name !== '' && driverForm.first_name !== '' && driverForm.cin !== ''){
            localStorage.setItem('driverList', JSON.stringify([...tempList, driverForm]));
            window.location.href = '/drivers';
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
                <input type="text" onChange={handleFormChange} name='last_name' placeholder='Nom' />
                <label htmlFor="">Prénom</label>
                <input type="text" onChange={handleFormChange} name='first_name' placeholder='Prénom' />
                <label htmlFor="">Numéro de CIN</label>
                <input type="text" onChange={handleFormChange}  name='cin' placeholder="CIN " />
                

                <button onClick={handleAdd} className='add-bajaj-button' type='submit'>Ajouter</button>
            </form>
        </div>
    );
};

export default AddDriver;