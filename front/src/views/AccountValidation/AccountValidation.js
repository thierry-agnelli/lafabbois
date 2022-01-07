// Style
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./style.css";

// Validation du mail après inscription
const AccountValidation = () => {
    const user = useParams();
    console.log("validation")
    useEffect(() =>
    fetch("http://localhost:3001/user/accountValidation", {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json"
        },
        body: JSON.stringify({validationToken: user.validationToken})
    })
    ,[]);

    return(
        <div id="mailValidationContainer">
            <h2>Félicitation votre e-mail a bien été enregistré !</h2>
            <Link to="/connection">Vous connecter</Link>
        </div>
    );
};

export default AccountValidation;