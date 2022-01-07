import { createContext, useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./assets/components/Header.js"
import Body from "./assets/components/Body.js";
import Footer from "./assets/components/Footer.js";
import "./style.css";
// Méthodes
import { checkLogin, fetchUserInfo } from "./lib/logMethods.js";
/* 
    La racine du projet est maintenant ".", vous le voyez dans le package.json du front, au champ "homepage".
    Du coup, vous écrivez vos chemins de lien directement avec le slash, pas besoin du point devant.
    Ainsi, quand l'app sera intégrée au site, les chemins seront bien à partir de la boutique, 
    et non de la racine de tout le site.
*/

// Création du context
export const AppContext = createContext({});

const App = () => {
    /* Variables d'état */
    const [userLogged, setUserLogged] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    
    // Vérification si l'utilisateur doit être connecté à l'ouverture de la page
    useEffect(() => checkLogin(setUserLogged), []);


    /* Méthodes */
    // Récupération booléen loggé vrai ou faux
    const getUserLogged = () => userLogged;
    // Récupération des infos utilisateurs
    // const getUserInfo = () => userInfo;

    /* Valeur du context */
    const contextValue = {
        getUserLogged,
        setUserLogged,
        // getUserInfo,
        // setUserInfo,
    };

    return (
        <AppContext.Provider value={contextValue}>
            <Router basename="/portefolio/lafabbois">
                <Header />
                <Body />
                <Footer />
            </Router>
       </AppContext.Provider>
    );
};

export default App;

