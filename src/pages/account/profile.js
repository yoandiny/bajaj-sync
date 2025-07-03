import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();
    const [isLogged, setIsLogged] = useState(localStorage.getItem("isLogged")|| "false");
        
        const verifyLog = () =>{
            if(isLogged == "false"){
                navigate("/login");
                
            }
        }
  return (
    <div>
      <title>Profil</title>
      <h1>Profile Page</h1>
      <p>This is the profile page.</p>
    </div>
  );
}

export default Profile;