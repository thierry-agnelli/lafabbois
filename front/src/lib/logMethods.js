// Config
import config from '../config.json';

// Méthode de connexion
export const logIn = async (mail, pwd, stayLoggedIn) => new Promise((resolve, reject) => {

    // Appel au serveur pour athentification
    fetch(`${config.API_URL}/user/auth`, {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: mail,
            pwd: pwd,
            stayLoggedIn: stayLoggedIn,
        }),
    })
        // Si authentifications OK
        .then(response => {
            if (response.status === 200)
                return response.json();
            else
                throw response;
        })
        .then(json => {
            // Récupération et stockages token d'authentification et infos utilisateurs
            localStorage.setItem("session", JSON.stringify(json.token));
            sessionStorage.setItem("user", JSON.stringify(json.userInfo));

            resolve("Connexion OK");
        })
        // Si authentifications NOK affichage message d'erreur
        .catch(err => {
            if (err.status >= 400)
                err.text().then(message => reject(message));
            else
                reject("Une errreur est survenue");
        });
});


// Méthode de déconnexion
export const logOut = () => {
    localStorage.removeItem("session");
    sessionStorage.removeItem("user");
};

export const checkLogin = async (setUserLogged) => {

    const token = JSON.parse(localStorage.getItem("session"));

    if (token)
        fetch(`${config.API_URL}/user/getinfo/${token}`)
            .then(res => res.json())
            .then(json => {
                sessionStorage.setItem("user", JSON.stringify(json));
                setUserLogged(true);
            })
            .catch(err => console.log(err));
};


/* Méthode de récupération des infos */
// export const fetchUserInfo = (userLogged, setUserInfo) => {

//     if (userLogged) {
//         const tokens = JSON.parse(localStorage.getItem("tokens"));
//         fetch(`${config.API_URL}/user/getinfo`, {
//             headers: {
//                 Authorization: `${tokens.userId} ${tokens.token}`,
//                 "content-type": "application/json"
//             },
//         })
//             .then(response => response.json())
//             .then(jsonResponse => {
//                 setUserInfo(jsonResponse);
//             });
//     }
// };
