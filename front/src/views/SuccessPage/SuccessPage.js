import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
// Config
import config from "../../config.json";
// Style
import "./style.css";


const SuccessPage = (props) => {
    const [session, setSession] = useState();

    const addToBack = () => {
        fetch(`${config.API_URL}/order/send`,
            {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(JSON.parse(localStorage.getItem("orderObject")))
            })
            .then(res => res.text())
            .then(message => console.log(message))
            .catch(err => console.log(err));

        // Suppression du panier et de la commande en cours du local storage
        localStorage.removeItem("cart");
        localStorage.removeItem("orderObject");
    }

    const sendToBack = (sessionId) => {
        fetch(`${config.API_URL}/sessionid/check`,
            {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ sessionId: sessionId })
            })
            .then(res => res.json())
            .then(json => json.permitted ? addToBack() : console.log("bien essayé"))
            .catch(err => console.log(err));
    }



    useEffect(() => {
        fetch(`${config.API_URL}/payment/checkout-session?id=${props.name}`)
            .then(res => res.json())
            .then(resSession => {
                setSession(resSession);
                if (resSession.payment_status === "paid") {
                    if (localStorage.getItem("orderObject") !== null) {
                        sendToBack(resSession.id)
                    }
                }
            })
            .catch(err => console.error(err))
    }, [])

    return (
        <div className="bodySuccesPage">
            {session ?
                <>
                    {(session.payment_status === "paid" ?
                        <>
                            <h2>Félicitations ! Votre commande a été validée.</h2>
                            <p className="pSubtitle">Vous pouvez suivre votre commande dans vos emails, et on vous enverra un email chaque fois que le statut de votre commande change.</p>

                        </>
                        :
                        <>
                            <h2>Il semble qu'il y ait un problème avec le paiement.</h2>
                        </>
                    )}
                    <Link to="/" className="homeLink" >Retour à la boutique</Link>
                </>
                :
                <FontAwesomeIcon color="#e20024" icon={faSpinner} className="spinner" />
            }
        </div>
    )
}

export default SuccessPage;