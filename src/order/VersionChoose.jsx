import './css/versionChoose.css'
import { Link } from 'react-router-dom'

const VersionChoose = () => {
    return (
        <div className="version-choose">
            <h1>Choisissez votre version de BajajSync</h1>
            <div className="version-choose-buttons">
                
                    <button className="version-choose-button">
                        <Link onClick={()=> window.location.href = "https://bajaj-sync-demo.vercel.app"}>
                        Version de démo
                        </Link>
                    </button>
                
                
                    <button className="version-choose-button">
                        <Link to="/offline-login">
                        Version offline
                        </Link>
                        </button>
                
                
                    <button className="version-choose-button">
                        <Link to="/dashboard">
                        Version web
                        </Link>
                    </button>
                
            </div>
        </div>
    )
}

export default VersionChoose
