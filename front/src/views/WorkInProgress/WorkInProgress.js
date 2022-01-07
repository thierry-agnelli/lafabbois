// Dépendances
import { useHistory } from "react-router";

// Style
import "./style.css";

// View mot de passe oublié
const WorkInProgress = () => {
    const history = useHistory();

    // Handle
    const handleReturn = () => {
        history.goBack();
    }

    return(
        <section id="WipMainContainer">
            <h2>## WORK IN PROGRESS ##</h2>
            <button id="wipReturnBtn" onClick={handleReturn}>Retour</button>
        </section>
    );
};

export default WorkInProgress;
