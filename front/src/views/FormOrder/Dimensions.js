//Dépendances
import { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsAltV, faArrowsAltH, faExpandAlt, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
// Config
import config from "../../config.json";

const Dimensions = () => {
    /* Variables d'états */
    const [currentProduct, setCurrentProduct] = useState(JSON.parse(sessionStorage.getItem("currentProduct")));
    const [possibleThickness, setPossibleThickness] = useState([]);

    const [length, setLength] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [weight, setWeight] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const [validation, setValidation] = useState(false);
    const [returnToWood, setReturnToWood] = useState(false);

    /* Init Data */
    useEffect(() => {
        // Vérification si un type de bois a été choisi (sinon retour au choix du bois)
        if (currentProduct?.wood) {
            // Récupération des différents épaisseurs possibles du produit
            fetch(`${config.API_URL}/wood/getInfo/${currentProduct.wood}`)
                .then(res => res.json())
                .then(json => {
                    setWeight(json.weight);
                    setPossibleThickness(json.possibleThickness);
                })
                .catch(err => console.log(err));
        }
        else
            setReturnToWood(true);
    }, []);

    /* Handlers */
    // Longueur et Largeur
    const dimesionHandler = (e) => {
        let value
        switch (true) {
            case e.target.value < 50:
                value = 50;
                break;
            case e.target.value > 270:
                value = 270;
                break;
            default:
                value = e.target.value;
                break;
        }

        if (e.target.name === "length")
            setLength(value);
        else
            setWidth(value);
    };

    // Validation
    const handleValidation = (e) => {
        e.preventDefault();
        if (length > 0 && width > 0 && height > 0 && quantity > 0) {
            sessionStorage.setItem("currentProduct", JSON.stringify({
                ...currentProduct,
                qty: quantity,
                dimensions:
                {
                    l: length,
                    w: width,
                    h: height,
                },
                weight: Math.round((weight * length / 100 * width / 100 * height / 100) * 100) / 100
            }));

            setValidation(true);
        }
    };

    return (
        <form className="form">
            <div className="formChild">
                <p className="formTitle"><label htmlFor="length">Dimensions :</label></p>
                <div className="dimensionsContainer">
                    <div className="dimensionItem">
                        <div className="dimensionIcon"><FontAwesomeIcon icon={faArrowsAltH} size="1x" className="dimensionIcon" /></div>
                        <label htmlFor="length">Longueur (cm)*:</label>
                        <input id="length" className="dimensionInput" type="number" min="0" placeholder="0" name="length" onChange={dimesionHandler} />
                    </div>
                    <div className="dimensionItem">
                        <div className="dimensionIcon"><FontAwesomeIcon icon={faArrowsAltV} size="1x" className="dimensionIcon" /></div>
                        <label htmlFor="width">Largeur (cm)*:</label>
                        <input id="width" className="dimensionInput" type="number" min="0" placeholder="0" name="width" onChange={dimesionHandler} />
                    </div>
                    <div className="dimensionItem">
                        <div className="dimensionIcon"><FontAwesomeIcon icon={faExpandAlt} size="1x" className="dimensionIcon" /></div>
                        <label htmlFor="height">Epaisseur (cm):</label>
                        <select id="height" className="dimensionInput" defaultValue="disabled" onChange={(e) => setHeight(e.target.value)}>
                            <option disabled value="disabled">Choisissez l'épaisseur</option>
                            {possibleThickness.map((element, index) =>
                                <option key={index} value={element[0]}>{element[0]}</option>
                            )}
                        </select>
                    </div>
                    <div className="dimensionItem">
                        <div className="dimensionIcon"><FontAwesomeIcon icon={faEllipsisV} size="1x" className="dimensionIcon" /></div>
                        <label htmlFor="quantity">Quantité:</label>
                        <input id="quantity" type="number" className="dimensionInput" min="1" defaultValue="1" onChange={(e) => setQuantity(Math.floor(e.target.value))} />
                    </div>
                    <div>* taille minimum : 50 cm, et maximum: 270cm.</div>
                </div>
                <div id="formOrderBtnContainer">
                    <button className="formOrderBtn" onClick={(e) => handleValidation(e)}>Valider</button>
                    <button className="formOrderBtn" onClick={() => setReturnToWood(true)}>Retour</button>
                </div>
                {validation ? <Redirect to="/product-config/veneer" /> : null}
                {returnToWood ? <Redirect to="/product-config/wood" /> : null}
            </div>
        </form>
    );
};

export default Dimensions;

