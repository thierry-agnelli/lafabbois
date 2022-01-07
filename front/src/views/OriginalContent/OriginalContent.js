// Dépendances
import { Link } from "react-router-dom";
// Style
import "./style.css";

const OriginalContent = () => {

    return(
        <section id="originalContentContainer">
            <h2>*Contenu du site original*</h2>
            <div>
                <a className="link" href="https://www.mdlmousse.fr/" target="_blank">https://www.mdlmousse.fr/</a>
                <Link className="link" to="/">Routour à la boutique</Link>
            </div>
        </section>
    );
};

export default OriginalContent;