import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// Style
import "./style.css";

const PageValidation = () => {
    const [currentProduct, setCurrentProduct] = useState(JSON.parse(sessionStorage.getItem("currentProduct")));

    // Enregistrement du produit dans le localStorage
    useEffect(() => {
        if (currentProduct) {
            const cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
            cart.push(currentProduct);
            localStorage.setItem("cart", JSON.stringify(cart));
            sessionStorage.removeItem("currentProduct");
        }
    }, []);

    return (
        <section id="validationContainer">
            {!currentProduct ?
                <>
                    <h2>Oups, il semble y avoir une erreur avec votre article...</h2>
                    <p>Aucun produit</p>
                    <div>
                        <Link to="/"><button className="formOrderBtn validationPageBtn">Reprendre mes achats</button></Link>
                    </div>
                </>
                :
                <>
                    <h2>Félicitations, vous venez de valider votre article !</h2>
                    <div id="resumeCurrentProduct">
                        <div>
                            <div id="currentProduct"><b>{currentProduct.wood}{currentProduct.veneer ? `, plaquage: ${currentProduct.veneer}` : ""}</b></div>
                            <div className="details">{currentProduct.dimensions.l}x{currentProduct.dimensions.w}x{currentProduct.dimensions.h}</div>
                            <div className="details">Qté: {currentProduct.qty}</div>
                        </div>
                        <div>
                            <div id="currentProductPrice">Prix: {((currentProduct.price.wood + currentProduct.price.veneer) * currentProduct.qty).toFixed(2)} €</div>
                            {/* {currentProduct.qty > 1 ? */}
                            <div className="details">
                                <span>(Prix unitaire: bois: {(currentProduct.price.wood).toFixed(2)}€
                                    {currentProduct.veneer ? <span>, plaquage: {(currentProduct.price.veneer).toFixed(2)}€</span> : null}
                                    )</span>
                            </div>
                            {/* : null} */}
                        </div>
                    </div>
                    <div>
                        <Link to="/">
                            <button className="formOrderBtn validationPageBtn" >Poursuivre mes achats</button>
                        </Link>

                        <Link to="/cart">
                            <button className="formOrderBtn validationPageBtn" >Voir mon panier</button>
                        </Link>
                    </div>
                </>}
        </section>
    );
};

export default PageValidation;

