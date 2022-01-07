// Dépendances
import { useState, useContext } from "react";
import { useHistory, Redirect } from "react-router";
// Style
import "./style.css"
// Méthodes
import { logIn } from "../../lib/logMethods";
// Contexte
import { AppContext } from "../../App";
import { Link } from "react-router-dom";

// View Connexion utilisateurs
const Connection = () => {
    // Contexte
    const context = useContext(AppContext);

    /* State */
    const [mail, setMail] = useState("");
    const [pwd, setPwd] = useState("");
    const [stayLoggedIn, setStayLoggedIn] = useState(false);
    const [error, setError] = useState("");
    const [shopRedirect, setShopRedirect] = useState(false);
    // Création historique
    const history = useHistory();

    /* Handles */
    // Input utilisateurs du mail (login)
    const handleMailInput = (e) => {
        e.target.classList.remove("connectionFormError");
        setMail(e.target.value)
    }
    // Input utilisateurs du password
    const handlePwdInput = (e) => {
        e.target.classList.remove("connectionFormError");
        setPwd(e.target.value);
    }
    // Utilisateur appuie sur Entrée dans le champ d'e-mail ou de password
    const handleKeyPress = (e) => {
        if (e.key === 'Enter')
            handleConnectionBtn();
    };
    // Input utilisateurs Rester conencté
    const handleStayLoggedIn = (e) => {
        setStayLoggedIn(e.target.checked);
    }
    // Clic sur bouton de conenexion
    const handleConnectionBtn = () => {
        let valid = true;

        // Vérification champs d'input login/mdp renseigné (sinon affichage message d'erreur et input en rouge)
        if (mail === "") {
            valid = false;
            document.getElementById("mailInput").classList.add("connectionFormError");
        }
        if (pwd === "") {
            valid = false;
            document.getElementById("pwdInput").classList.add("connectionFormError");
        }

        // Si des données de connexions ont été renseignées
        if (valid) {

            logIn(mail, pwd, stayLoggedIn)
                .then((response) => {
                    // (Désactivé)Redirection vers la page avant la connexion (si il n'y en a pas redirection vers la boutique)
                    // if (history.length > 1) {
                    //     context.setUserLogged(true);
                    //     history.goBack();
                    // }
                    // else{
                    //      setShopRedirect(true);
                    //      context.setUserLogged(true);
                    // }

                    // Mise à jour userLogged à true
                    context.setUserLogged(true);
                    // Redirection vers la boutique
                    setShopRedirect(true);
                })
                .catch((err) => {
                    setError(err);
                });
        }
        else
            setError("E-mail ou mot de passe incorrect");
    }

    // Rendu
    return (
        <section id="connectionMainContainer">
            <div id="connectionContainer">
                <div className="connectionTitle">SE CONNECTER</div>
                <form>
                    <div className="connectionInputContainer">
                        <label htmlFor="mailInput">E-mail :</label>
                        <input id="mailInput" type="email" onChange={handleMailInput} onKeyPress={handleKeyPress} />
                    </div>
                    <div className="connectionInputContainer">
                        <div id="connectionInputPwdContainer">
                            <label htmlFor="pwdInput">Mot de passe :</label>
                            <Link to="/password/recovering">
                                <div id="forgottenPwd">Mot de passe oublié</div>
                            </Link>
                        </div>
                        <input id="pwdInput" type="password" onChange={handlePwdInput} onKeyPress={handleKeyPress} />
                    </div>
                </form>
                <button id="connexionBtn" onClick={handleConnectionBtn}>Connexion</button>
                <div>
                    <input type="checkbox" id="stayLoggedIn" onChange={handleStayLoggedIn} />
                    <label htmlFor="stayLoggedIn">Rester connecté</label>
                </div>
                <div className="connectionError"> {error ? error : ""} </div>
            </div>
            <div id="notRegisteredBtn">
                <Link to="/registration">
                    Pas encore inscrit ?
                </Link>
            </div>
            {shopRedirect ? <Redirect to="/" /> : null}
        </section>
    );
};

export default Connection;
