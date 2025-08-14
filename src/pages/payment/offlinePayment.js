import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './css/offlinePayment.css';

const OfflinePayment = () => {
    const navigate = useNavigate();
    const [userInfo] = useState(JSON.parse(localStorage.getItem("userInfo")) || {});
    const [isLogged] = useState(localStorage.getItem("isLogged") || "false");
    const [paymentForm, setPaymentForm] = useState({
        mobileMoneyRef: "",
        phoneNumber: "",
        amount: "50000", // Prix fixe pour la version hors ligne
        paymentMethod: "mvola"
    });
    const [isProcessing, setIsProcessing] = useState(false);

    const verifyLog = () => {
        if(isLogged === "false"){
            navigate("/offline-login");
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaymentForm({
            ...paymentForm,
            [name]: value
        });
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        
        if(!paymentForm.mobileMoneyRef || !paymentForm.phoneNumber) {
            alert("Veuillez remplir tous les champs requis");
            return;
        }

        setIsProcessing(true);

        try {
            // Simulation d'un appel API pour vérifier le paiement
            // Dans un vrai système, ceci ferait appel à l'API Mobile Money
            const paymentData = {
                userId: userInfo.id,
                companyId: userInfo.company_id,
                reference: paymentForm.mobileMoneyRef,
                phoneNumber: paymentForm.phoneNumber,
                amount: paymentForm.amount,
                paymentMethod: paymentForm.paymentMethod,
                productType: "offline_version"
            };

            console.log("Processing payment:", paymentData);

            // Simulation d'un délai de traitement
            setTimeout(() => {
                alert("Paiement en cours de vérification. Vous recevrez une confirmation par SMS.");
                localStorage.setItem("paymentPending", "true");
                localStorage.setItem("paymentRef", paymentForm.mobileMoneyRef);
                navigate("/payment-confirmation");
                setIsProcessing(false);
            }, 2000);

        } catch (error) {
            console.error("Erreur lors du paiement:", error);
            alert("Une erreur est survenue lors du traitement du paiement");
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        verifyLog();
    }, []);

    return (
        <div className="payment-container">
            <title>Paiement - Version Hors Ligne</title>
            
            <div className="payment-card">
                <div className="payment-header">
                    <h2>Paiement Version Hors Ligne</h2>
                    <p className="payment-subtitle">BajajSync - Licence Permanente</p>
                </div>

                <div className="payment-details">
                    <div className="price-section">
                        <h3>Détails de l'achat</h3>
                        <div className="price-item">
                            <span>Version Hors Ligne BajajSync</span>
                            <span className="price">50 000 Ar</span>
                        </div>
                        <div className="price-item total">
                            <span><strong>Total à payer</strong></span>
                            <span className="price"><strong>50 000 Ar</strong></span>
                        </div>
                    </div>

                    <div className="payment-instructions">
                        <h4>Instructions de paiement :</h4>
                        <ol>
                            <li>Effectuez un transfert Mobile Money de <strong>50 000 Ar</strong></li>
                            <li>Vers le numéro : <strong>034 12 345 67</strong></li>
                            <li>Copiez la référence de transaction reçue</li>
                            <li>Saisissez cette référence dans le formulaire ci-dessous</li>
                        </ol>
                    </div>

                    <form className="payment-form" onSubmit={handlePayment}>
                        <div className="form-group">
                            <label>Méthode de paiement</label>
                            <select 
                                name="paymentMethod" 
                                value={paymentForm.paymentMethod}
                                onChange={handleChange}
                                className="payment-input"
                            >
                                <option value="mvola">MVola</option>
                                <option value="orange_money">Orange Money</option>
                                <option value="airtel_money">Airtel Money</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Votre numéro de téléphone</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={paymentForm.phoneNumber}
                                onChange={handleChange}
                                placeholder="034 12 345 67"
                                className="payment-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Référence de transaction Mobile Money</label>
                            <input
                                type="text"
                                name="mobileMoneyRef"
                                value={paymentForm.mobileMoneyRef}
                                onChange={handleChange}
                                placeholder="Ex: MP240125.1234.A12345"
                                className="payment-input"
                                required
                            />
                            <small>Saisissez exactement la référence reçue par SMS</small>
                        </div>

                        <button 
                            type="submit" 
                            className={`payment-button ${isProcessing ? 'processing' : ''}`}
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Vérification en cours...' : 'Confirmer le paiement'}
                        </button>
                    </form>

                    <div className="payment-footer">
                        <p>
                            <i className="bx bx-shield-check"></i>
                            Paiement sécurisé - Vos données sont protégées
                        </p>
                        <a href="/version-choose" className="back-link">
                            ← Retour aux options
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfflinePayment;