// Dépendances
import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
// Config
import config from "../../config.json";


// View selection de la gamme et du bois
const Wood = () => {
    /* Variable d'états */
    const [images, setImages] = useState({});
    const [currentProduct, setCurrentProduct] = useState(JSON.parse(sessionStorage.getItem("currentProduct")));
    const [woods, setWoods] = useState([]);

    const [foam, setFoam] = useState(null);
    const [returnToRange, setReturnToRange] = useState(false);
    const [validationWood, setValidationWood] = useState(false);

    /* Init Data */
    useEffect(() => {
        // Vérification si une gamme a été choisie (sinon retour au choix de gamme)
        if (currentProduct?.range) {
            // Récupération des différentes produits de la gamme choisie
            fetch(`${config.API_URL}/wood/range/${currentProduct.range}`)
                .then(res => res.json())
                .then(json => {
                    setWoods(json)
                    // Récupération des images
                    for (const index in json) {
                        fetch(`${config.API_URL}/images/get/${json[index].name}`)
                            .then(res => res.blob())
                            .then(blob => {
                                images[json[index].name] = URL.createObjectURL(blob);
                                setImages({ ...images });
                            })
                            .catch(err => console.log(err));
                    }
                });
        }
        else
            setReturnToRange(true);
    }, []);

    /* Handle */
    const handleSubmitWood = (selectedWood) => {
        setFoam(woods.find(element => element.name === selectedWood));

        sessionStorage.setItem("currentProduct", JSON.stringify({ wood: selectedWood, ...currentProduct }));
        setValidationWood(true);
    };

    return (
        <>
            <form className="form">
                <div className="formChild">
                    <div className="formTitle">
                        <div> Bois :</div>
                    </div>
                    <div className="flexContainer">
                        {woods.map((element, index) =>
                            <div key={index} className="elementsCard">
                                <h2>{element.name}</h2>
                                <img className="elementsImage" alt="Bois" src={images[element.name]} onClick={() => handleSubmitWood(element.name)} />
                            </div>
                        )}
                    </div>
                    <div id="formOrderBtnContainer">
                        <button className="formOrderBtn" onClick={() => setReturnToRange(true)}>Retour</button>
                    </div>
                    {returnToRange ? <Redirect to="/product-config/range" /> : null}
                    {validationWood ? <Redirect to="/product-config/dimensions" /> : null}
                </div>
            </form>
        </>
    );
};

export default Wood;
