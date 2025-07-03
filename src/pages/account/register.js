import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './register.css';

const Register = () => {
    const navigate = useNavigate();
    const [isLogged, setIsLogged] = useState(localStorage.getItem("isLogged")|| "false");
    const [registerForm, setRegisterForm] = useState({
        lastName: "",
        firstName: "",
        password: "",
        companyName: "",
        phone: "",
    });
        
        const verifyLog = () =>{
            
            if(isLogged == "true"){
                navigate("/");
                
            }
        }

        const handleSubmit = async (e) => {
            e.preventDefault();

           try {
             if (registerForm.lastName && registerForm.firstName && registerForm.companyName && registerForm.password && registerForm.phone) {
                if (registerForm.phone.length === 10) {
                    if(registerForm.password.length >= 6){
                        const registerUser = await axios.post("https://bajaj-sync-backend.glitch.me/register", registerForm)
                        if(registerUser.status === 200){
                            localStorage.setItem("isLogged", "true");
                            localStorage.setItem("userInfo", JSON.stringify(registerUser.data));
                            navigate("/profile");
                        }
                    
                    }
            }


        }
            
           } catch (error) {
            
            if(error.response.status === 409 || error.response.status === 400 || error.response.status === 500){
                alert(error.response.data.message);
            }
            
           }
    }

        const handleChange = (e) => {
            const { name, value } = e.target;
            setRegisterForm({
                ...registerForm,
                [name]: value
            });
        };
            



        useEffect(() => {
            verifyLog();
        },[])
    return (
        <div className="register-container">
            <title>S'inscrire</title>
            <form className="register-form" action="">
                <label htmlFor="">Nom</label>
                <input type="text" name="lastName" id="" onChange={handleChange} />
                <label htmlFor="">Prénom</label>
                <input type="text" name="firstName" id="" onChange={handleChange} />
                <label htmlFor="">Mot de passe</label>
                <input type="password" name="password" id="" onChange={handleChange} />
                <label htmlFor="">Nom de l'entreprise/Société</label>
                <input type="text" name="companyName" id="" onChange={handleChange} />
                <label htmlFor="">Numéro de téléphone</label>
                <input type="tel" name="phone" id="" onChange={handleChange} placeholder="03x xx xxx xx" />
                <p>Vous avez déjà un compte ? <a className="register-link" href="/login">Se connecter</a></p>
                <button onClick={handleSubmit}>S'inscrire</button>
            </form>
        </div>
    )
}

export default Register;