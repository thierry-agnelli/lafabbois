import { useState, useEffect } from "react";
import { useLocation, Redirect } from "react-router-dom";
import config from "../../config.json";

const Veneer = () => {
    // const location = useLocation();
    /* Variable d'états */
    const [images, setImages] = useState({});
    const [currentProduct, setCurrentProduct] = useState(JSON.parse(sessionStorage.getItem("currentProduct")));
    const [veneers, setVeneers] = useState([]);
    const [validation, setValidation] = useState(false);
    const [returnToDimension, setReturnToDimension] = useState(false);

    useEffect(() => {
        // Vérification si les dimensions ont bien été saisies (sinon retour au choix des dimensions)
        if (currentProduct?.dimensions) {
            // Récupération des différents plaquages possibles du produit

            fetch(`${config.API_URL}/veneer/filter/${currentProduct.range}/${currentProduct.wood}`)
                .then((res) => res.json())
                .then(json => {
                    setVeneers(json);
                    for (const index in json) {
                        fetch(`${config.API_URL}/images/get/${json[index].name}`)
                            .then(res => res.blob())
                            .then(blob => {
                                images[json[index].name] = URL.createObjectURL(blob);
                                setImages({ ...images });
                            })
                            .catch(err => console.log(err));
                    }
                })
        }
        else
            setReturnToDimension(true);
    }, []);

    const calculatePrice = (veneer, e) => {
        e.preventDefault();
        fetch(`${config.API_URL}/price/productPrice`,
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    range: currentProduct.range,
                    woodType: currentProduct.wood, // objet foam
                    veneer: veneer ? veneer.name : "", // soit "" soit par exemple "Silvertex"
                    thickness: parseFloat(currentProduct.dimensions.h), // épaisseur
                    length: parseFloat(currentProduct.dimensions.l), // longueur
                    width: parseFloat(currentProduct.dimensions.w) // largeur
                })
            })
            .then(res => res.json())
            .then(json => {
                // Sauvegarde du produit en cours pour la session
                sessionStorage.setItem("currentProduct",JSON.stringify({
                    ...currentProduct,
                    veneer: veneer ? veneer.name : "",
                    price: json.price,
                }));
                
                setValidation(true);
            })
            .catch(err => console.log(err));
    };

    return (
        <form className="form">
            <div className="formChild">
                <p className="formTitle">Plaquage :</p>
                <div id="formOrderBtnContainer">
                    <button className="formOrderBtn" onClick={(e) => calculatePrice(null, e)}>Pas de plaquage</button>
                    <button className="formOrderBtn" onClick={() => setReturnToDimension(true)}>Retour</button>
                </div>
                <div className="flexContainer">
                    {veneers ? veneers.map((element, index) => {
                        return (
                            <div key={index} className="elementsCard">
                                <h2>{element.name}</h2>
                                <img className="elementsImage veneerImage" src={images[element.name]} alt={`${element.type} ${element.name}`} width="417px" height="250px" onClick={(e) => calculatePrice(element, e)} />
                                <p className="elementsDescription">Type : {element.type}</p>
                                <p className="elementsDescription">Gamme : {element.range}</p>
                            </div>
                        )
                    }) : null}
                </div>

                {validation ? <Redirect to="/product-config/validation" /> : null}
                {returnToDimension ? <Redirect to="/product-config/dimensions" /> : null}
            </div>
        </form>
    );
};

export default Veneer;
