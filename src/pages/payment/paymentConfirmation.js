import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './css/paymentConfirmation.css';

const PaymentConfirmation = () => {
    const navigate = useNavigate();
    const [paymentRef] = useState(localStorage.getItem("paymentRef") || "");
    const [userInfo] = useState(JSON.parse(localStorage.getItem("userInfo")) || {});

    const handleDownload = () => {
        // Simulation du téléchargement
        alert("Le téléchargement de BajajSync version hors ligne va commencer...");
        // Ici, vous pourriez déclencher le téléchargement réel
        window.open("https://example.com/bajajsync-offline.exe", "_blank");
    };

    const handleBackToHome = () => {
        navigate("/");
    };

    useEffect(() => {
        // Vérifier si l'utilisateur a bien un paiement en attente
        const paymentPending = localStorage.getItem("paymentPending");
        if (!paymentPending) {
            navigate("/version-choose");
        }
    }, [navigate]);

    return (
        <div className="confirmation-container">
            <title>Confirmation de Paiement</title>
            
            <div className="confirmation-card">
                <div className="confirmation-header">
                    <div className="success-icon">
                        <i className="bx bx-check-circle"></i>
                    </div>
                    <h2>Paiement en cours de vérification</h2>
                    <p>Merci pour votre achat !</p>
                </div>

                <div className="confirmation-details">
                    <div className="detail-item">
                        <span className="label">Client :</span>
                        <span className="value">{userInfo.first_name} {userInfo.last_name}</span>
                    </div>
                    
                    <div className="detail-item">
                        <span className="label">Entreprise :</span>
                        <span className="value">{userInfo.company_name}</span>
                    </div>
                    
                    <div className="detail-item">
                        <span className="label">Produit :</span>
                        <span className="value">BajajSync - Version Hors Ligne</span>
                    </div>
                    
                    <div className="detail-item">
                        <span className="label">Montant :</span>
                        <span className="value">50 000 Ar</span>
                    </div>
                    
                    <div className="detail-item">
                        <span className="label">Référence :</span>
                        <span className="value">{paymentRef}</span>
                    </div>
                </div>

                <div className="confirmation-status">
                    <div className="status-indicator processing">
                        <i className="bx bx-time"></i>
                        <span>Vérification en cours...</span>
                    </div>
                    
                    <p className="status-message">
                        Votre paiement est en cours de vérification. Vous recevrez une confirmation 
                        par SMS dans les prochaines minutes. Une fois confirmé, vous pourrez 
                        télécharger votre version hors ligne de BajajSync.
                    </p>
                </div>

                <div className="confirmation-actions">
                    <button 
                        className="download-button disabled" 
                        onClick={handleDownload}
                        disabled
                    >
                        <i className="bx bx-download"></i>
                        Télécharger (En attente de confirmation)
                    </button>
                    
                    <button 
                        className="secondary-button" 
                        onClick={handleBackToHome}
                    >
                        Retour à l'accueil
                    </button>
                </div>

                <div className="confirmation-footer">
                    <div className="contact-info">
                        <h4>Besoin d'aide ?</h4>
                        <p>
                            <i className="bx bx-phone"></i>
                            Support : 034 12 345 67
                        </p>
                        <p>
                            <i className="bx bx-envelope"></i>
                            Email : support@bajajsync.mg
                        </p>
                    </div>
                    
                    <div className="next-steps">
                        <h4>Prochaines étapes :</h4>
                        <ul>
                            <li>Confirmation du paiement par SMS</li>
                            <li>Réception du lien de téléchargement</li>
                            <li>Installation de BajajSync hors ligne</li>
                            <li>Activation avec votre clé de licence</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentConfirmation;