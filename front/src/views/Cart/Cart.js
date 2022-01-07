// Dépendances
import { useState, useEffect, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
// Config
import config from "../../config.json";
// Context
import { AppContext } from "../../App";
// Style
import "./style.css";


// Page Panier
const Cart = () => {
    /* Contexte */
    const context = useContext(AppContext);
    /* State */
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")));
    const [sumPrice, setSumPrice] = useState(0);
    const [sumWeight, setSumWeight] = useState(null);
    const [tva, setTva] = useState(0);
    const [tvaPart, setTvaPart] = useState(0);
    const [shippingZone, setShippingZone] = useState(null);
    const [shippingCost, setShippingCost] = useState(null);
    const [validation, setValidation] = useState(false);

    /* Hook */
    useEffect(() => {
        // Mise à jour sous-total
        totalsSumming();

        // Récupération TVA
        fetch(`${config.API_URL}/taxe/byname/TVA`)
            .then(res => res.json())
            .then(json => setTva(json.value))
            .catch(err => console.log(err));
    }, []);

    // Mise à joure Utilisateur
    useEffect(() => {
        if (context.getUserLogged)
            setUser(JSON.parse(sessionStorage.getItem("user")));
    }, [context.getUserLogged()])

    // Mise à jour part TVA au chamgement du sous-total
    useEffect(() => setTvaPart(Math.round(tva * sumPrice) / 100), [sumPrice, tva]);

    // Récupération estimation frais de livraison en fonction du poids
    useEffect(() => {
        // Si utilisateur connecté récupération zone de livraison
        user && (setShippingZone(user.billingAddresses[0].postCode.slice(0, 2)));

        // Sécurité tant que le poinds n'ets pas calculé
        if (sumWeight) {
            // Si un utilisateur est trouvé récupération du prix de son addresse de livraisonpar défaut 
            if (user) {
                const zone = user.billingAddresses[0].postCode.slice(0, 2);

                fetch(`${config.API_URL}/shipping/byZone/${zone}/${sumWeight}`)
                    .then(res => res.json())
                    .then(json => setShippingCost({
                        zone: zone,
                        price: json.price,
                    }))
                    .catch(err => console.log(err));
            }
            // Sinon récupération d'une estimation min et max
            else {
                fetch(`${config.API_URL}/shipping/minmax/${sumWeight}`)
                    .then(res => res.json())
                    .then(json => setShippingCost({
                        min: json.min,
                        max: json.max
                    }))
                    .catch(err => console.log(err));
            }
        }
        else
            setShippingCost(null);

    }, [sumWeight, user]);

    /* Handler */
    // Changement quantité
    const handleQtyChange = (e) => {
        // Modifcation de la quantité du produit ciblé
        cart[e.target.dataset.index].qty = Number(e.target.value);
        setCart([...cart]);

        // Enregistrement du panier modifié dans le local storage
        localStorage.setItem("cart", JSON.stringify(cart));

        // Mise à jour sous-total
        totalsSumming();
    };

    // Suppression d'un produit du panier
    const handleDeleteProduct = (e) => {
        // Suppression du produit ciblé
        const newCart = cart;
        newCart.splice(e.target.dataset.index, 1);

        // Enregistrement du panier modifié dans le local storage
        if (newCart.length === 0) {
            localStorage.removeItem("cart");
            setCart(null);
        }
        else {
            localStorage.setItem("cart", JSON.stringify(cart));
            setCart(newCart);
        }

        // Mise à jour sous-total
        totalsSumming();
    };

    // Bouton "Valider la commande"
    const handleSubmit = () => {
        // Si il y a au moins un produit
        if (cart && cart.length > 0)
            setValidation(true);
    };
    
    /* Fonctions */
    // Calcul du sous-total et du poids
    const totalsSumming = () => {

        let totalPrice = 0
        let totalWeight = 0;

        // Vérification si un panier existe
        if (!(!cart || cart.length === 0))
            // Calcul somme total
            cart.map(product => {
                totalPrice += (product.price.wood + product.price.veneer) * product.qty;
                totalWeight += product.weight * product.qty;
            });

        setSumPrice(Math.round(totalPrice * 100) / 100);
        setSumWeight(Math.round(totalWeight * 100) / 100);
    };

    return (
        <section id="cartMainContainer">
            <div id="cartContainer">
                <div id="cartHeaderRow" className="cartSeparator">
                    <div className="cartTitle">MON PANIER</div>
                    <Link id="keepShoppingLink" to="/">Continuer mes achats {">"}</Link>
                </div>

                {cart ? cart.map((product, index) =>
                    <div key={index} className="productItem cartSeparator">
                        <div className="productTopRow">
                            <div className="productName">Bois : {product.wood}</div>
                            <input type="number" min="0" data-index={index} className="productQty" onChange={handleQtyChange} value={product.qty} />
                            <div className="productCostContainer">
                                <div className="productCost">{((product.price.wood + product.price.veneer) * product.qty).toFixed(2)} €*</div>
                                <div className="unitaryCost productDetails">
                                    *HT, Prix unitaire: bois: {product.price.wood}€
                                    {product.veneer ? <span>, plaquage: {product.price.veneer}€</span> : null}
                                </div>
                            </div>
                        </div>
                        <div className="productDetails">Plaquage : {product.veneer ? product.veneer : "Non"}</div>
                        <div className="productDetails">{`${product.dimensions.l}x${product.dimensions.w}x${product.dimensions.h}`}</div>
                        <div className="productDetails">Poids: {(product.weight * product.qty).toFixed(2)}kg</div>
                        <div className="productBottomRow">
                            <button id="cartDeleteProductBtn" data-index={index} onClick={handleDeleteProduct}>Supprimer le produit</button>
                        </div>
                    </div>
                ) : null}
            </div>
            <div id="orderSummary">
                <div className="cartTitle cartSeparator">RESUME DE LA COMMANDE</div>
                <div className="costItem cartSeparator">
                    <div className="cartCostPreview"><b>Sous-total :</b> {cart ? sumPrice.toFixed(2) : "- "}€*</div>
                    <div className="cartMention">*Hors taxes et frais de livraison</div>
                    <div className="cartCostPreview"><b>TVA:</b> {cart ? tvaPart.toFixed(2) : "- "}€* </div>
                    <div className="cartMention">*{tva}%</div>
                </div>
                <div className="costItem cartSeparator">
                    <div className="cartCostPreview"><b>Total:</b> {cart ? (sumPrice + tvaPart).toFixed(2) : "- "}€* </div>
                    <div className="cartMention">*TTC</div>
                    {user ?
                        <>
                            <div className="cartCostPreview">Frais de livraison: {shippingCost ? `${ Math.round(shippingCost.price * sumWeight * 100) / 100}€` : "- €"}*</div>
                            <div className="cartMention">* Livraison dans le {shippingZone} {sumWeight ? `, poids total de: ${sumWeight} kg ${shippingCost ? `(${shippingCost.price}€/kg)`:""}.` : ", prix selon poids."}</div>
                        </> :
                        <>
                            <div className="cartCostPreview"><b>Frais de livraison:</b> {shippingCost ? `${ Math.round(shippingCost.min * sumWeight * 100) / 100}€ - ${ Math.round(shippingCost.min * sumWeight * 100) / 100}€` : "- €"}*</div>
                            <div className="cartMention">*Estimation min et max selon distance{sumWeight ? ` pour un poids total de: ${sumWeight} kg.` : " et poids."}</div>
                            <div className="cartMention">{sumWeight ? `(${shippingCost?.min} - ${shippingCost?.max} €/kg)` : ""}</div>
                        </>}
                </div>
                <button id="cartPaymentBtn" onClick={handleSubmit}>Valider la commande</button>
            </div>
            {validation ? <Redirect to="/address" /> : null}
        </section>
    );
};

export default Cart;

