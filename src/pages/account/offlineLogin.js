import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './login.css';
import axios from "axios";

const OfflineLogin = () => {
    const navigate = useNavigate();
    const [isLogged] = useState(localStorage.getItem("isLogged") || "false");
    const [loginForm, setLoginForm] = useState({
        phone: "",
        password: ""
    });
    
    const verifyLog = () => {
        if(isLogged === "true"){
            navigate("/offline-payment");
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
                const logUser = await axios.post("https://bajaj-sync-backend.onrender.com/login", loginForm)

                if(logUser.status === 200){
                    localStorage.setItem("isLogged", "true");
                    localStorage.setItem("userInfo", JSON.stringify(logUser.data));
                    navigate("/offline-payment");
                }
            } else {
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
    }, [])

    return(
        <div className="login-container">
            <title>Connexion - Version Hors Ligne</title>
            <form className="login-form" action="">
                <h2 style={{marginBottom: '1em', color: '#333'}}>Version Hors Ligne</h2>
                <p style={{marginBottom: '1em', textAlign: 'center', fontSize: '0.9em'}}>
                    Connectez-vous pour procéder au paiement
                </p>
                
                <label htmlFor="">Numéro de téléphone</label>
                <input 
                    type="tel" 
                    name="phone" 
                    placeholder="03x xx xxx xx" 
                    onChange={handleChange} 
                />

                <label htmlFor="">Mot de passe</label>
                <input 
                    type="password" 
                    name="password" 
                    onChange={handleChange} 
                />

                <p>Pas encore de compte ? <a className="login-link" href="/register">S'inscrire</a></p>

                <button onClick={handleLogin}>Se Connecter</button>
                
                <div style={{marginTop: '1em'}}>
                    <a href="/version-choose" style={{color: '#666', fontSize: '0.8em'}}>
                        ← Retour aux options
                    </a>
                </div>
            </form>
        </div>
    );
}

export default OfflineLogin;