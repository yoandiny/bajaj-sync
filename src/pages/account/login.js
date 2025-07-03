import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './login.css';
import { useEffect } from "react";
import axios from "axios";

const Login = () =>{
    const navigate = useNavigate();
    const [isLogged] = useState(localStorage.getItem("isLogged")|| "false");
    const [loginForm, setLoginForm] = useState({
        phone: "",
        password: ""
    });
    
    const verifyLog = () =>{
        if(isLogged === "true"){
            navigate("/profile");
            
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginForm({
            ...loginForm,
            [name]: value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('loginForm', loginForm);

        try {

            if(loginForm.phone && loginForm.password){
             const logUser = await axios.post("https://bajaj-sync-backend.glitch.me/login", loginForm)

                if(logUser.status === 200){
                    localStorage.setItem("isLogged", "true");
                    localStorage.setItem("userInfo", JSON.stringify(logUser.data));
                    navigate("/profile");
                }
            
        }else{
            alert("Tous les champs sont requis");
        }
            
        } catch (error) {
           if(error.response){
             if(error.response.status === 400 || error.response.status === 401 || error.response.status === 500){
                alert(error.response.data.message);
            }
           }
            
        }

    }

    useEffect(() => {
        verifyLog();
    },[])

    return(
        <div className="login-container">
            <title>Connexion</title>
            <form className="login-form" action="">
                <label htmlFor="">Numéro de téléphone</label>
                <input type="tel" name="phone" id="" placeholder="03x xx xxx xx" onChange={handleChange} />

                <label htmlFor="">Mot de passe</label>
                <input type="password" name="password" id="" onChange={handleChange} />

                <p>Vous avez déjà un compte ? <a className="login-link" href="/register">S'inscrire</a></p>

                <button onClick={handleLogin}>Se Connecter</button>
                
            </form>
        </div>
    );

}

export default Login;