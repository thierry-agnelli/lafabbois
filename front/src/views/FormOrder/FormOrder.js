// Dépendances
import "./style.css";
// Config
import config from "../../config.json";

const FormOrder = (props) => {
    
    return (
        <section>
            <h2>GENERER UN PRODUIT</h2>
            {props.target}
        </section>
    );
};

export default FormOrder;

