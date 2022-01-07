// Dépendances
import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
//Config
import config from "../../config.json";

// View selection de la gamme et du bois
const Range = () => {

    /* Variable d'états */
    const [images, setImages] = useState({});
    const [ranges, setRanges] = useState([]);
    const [validationRange, setValidationRange] = useState(false);

    useEffect(() => {
        // Récupération des différentes gammes de produits
        fetch(`${config.API_URL}/range/all`)
            .then(res => res.json())
            .then(json => {
                setRanges(json);
                // Récupération des images
                for (const index in json) {
                    fetch(`${config.API_URL}/images/get/${json[index].range}`)
                        .then(res => res.blob())
                        .then(blob => {
                            images[json[index].range] = URL.createObjectURL(blob);
                            setImages({ ...images });
                        })
                        .catch(err => console.log(err));
                }
            });
    }, []);

    /* Handle */
    const handleSubmitRange = (selectedRange) => {
        // Enregistrement de l'étape du configurateur
        sessionStorage.setItem("currentProduct", JSON.stringify({
            range: selectedRange,
        }));
        setValidationRange(true);
    };  

    return (
        <>
            <form className="form">
                <div className="formChild">
                    <div>
                        <div className="formTitle">
                            <div>Gamme de bois :</div>
                        </div>
                        <div className="flexContainer">
                            {ranges.map((element, index) =>
                                <div key={index} className="elementsCard">
                                    <h2>{element.range}</h2>
                                    <img className="elementsImage" src={images[element.range]} alt="Gamme" onClick={() => handleSubmitRange(element.range)} />
                                </div>)}
                        </div>
                    </div>
                    {validationRange ? <Redirect to= "/product-config/wood"/>:null}
                </div>
            </form>
        </>
    );
};

export default Range;
