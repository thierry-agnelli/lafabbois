// Dépendances
import React, { useState, useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js';
// Icones
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
// COnfig
import config from "../../config.json";
// Style
import "./style.css";

// const stripePublicKey = "pk_test_51JEwKQGznPLZznQyvjoxhReZKxeGPiO3rj3cQH8ozJggCqR3h6HOjJ3a2blfs2hf2PCNOeYAHtQM2sRDMIbTEsrx00XaMz7Z7B";

const ProductDisplay = () => {
  /* Variablesd'états */
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")));
  const [zone, setZone] = useState(null);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [tva, setTva] = useState(0);
  const [tvaPart, setTvaPart] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [htPrice, setHtPrice] = useState(0);
  const [ttcPrice, setTtcPrice] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const orderObject = JSON.parse(localStorage.getItem("orderObject"))

  /* Hooks */
  useEffect(() => {
    // Récupération de la zone d'envoi
    setZone(orderObject.shippingAddress ? orderObject.shippingAddress.fullShippingAddress.postcode.slice(0, 2)
      : orderObject.billingAddress.fullBillingAddress.postcode.slice(0, 2));

    // Calcul du prx et du poids total de la commande
    let price = 0;
    let weight = 0;

    cart.map(element => {
      price += (element.price.wood + element.price.veneer) * element.qty
      weight += element.weight * element.qty;
    });

    setHtPrice(price);
    setTotalWeight(Math.round(weight*100)/100);

    // Récupération TVA
    fetch(`${config.API_URL}/taxe/byname/TVA`)
      .then(res => res.json())
      .then(json => setTva(json.value))
      .catch(err => console.log(err));

  }, []);

  // Calcul des frais de livraison
  useEffect(() => {
    if (zone) {
      fetch(`${config.API_URL}/shipping/byZone/${zone}/${totalWeight}`)
        .then(res => res.json())
        .then(json => {
          setShippingPrice(json.price);
          setShippingCost(Math.round(json.price * totalWeight*100)/100);
          })
        .catch(err => console.log(err));
    }
  }, [totalWeight]);

  // Calcul de la tva
  useEffect(() => {
    setTvaPart(Math.round(htPrice * tva) / 100);
  }, [tva]);

  // Calcul du prix ttc
  useEffect(() => {
    setTtcPrice(htPrice + tvaPart);
  }, [tvaPart]);

  // Calcul du coût total
  useEffect(() => {
    setTotalCost(Math.round((ttcPrice + shippingCost)*100)/100);
  }, [ttcPrice, shippingCost]);

  const submitPayment = () => {
    console.log("totalCost", totalCost);
    const orderObject = JSON.parse(localStorage.getItem("orderObject"));
    // Ajout du pcoût total de la commande au localStorage
    localStorage.setItem("orderObject",JSON.stringify({
      totalCost: totalCost,
      ...orderObject
    }));

    fetch(`${config.API_URL}/payment/create-checkout-session`,{
        method: "POST",
        redirect: 'follow',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          products: orderObject.products,
          tva: tvaPart,
          shippingCost: shippingCost,
          purchasedOn: new Date(),
          })
      })
      .then(res => res.json())
      .then(async (session) => {
        const stripe = await loadStripe(config.stripePublicKey);
        stripe.redirectToCheckout({ sessionId: session.id })
      })
      .catch(err => console.log(err));
  };

  return (
    <section>
      <div className="centeredColumn">
        <div className="columnHeader itemRowBorder">
            <h3>RECAPITULATIF DE LA COMMANDE</h3>
        </div>
        <div className="cartRow">
          {cart.map((item, index) => {
            return (
              <div key={index} className="itemRow itemRowBorder">
                <div className="itemDetail">
                  <div><b>{item.wood}</b></div>
                </div>
                <div className="itemDetail dimensions">
                  <span className="dimensionsItem">long : {item.dimensions.l}</span>
                  <span className="dimensionsItem">larg : {item.dimensions.w}</span>
                  <span className="dimensionsItem">épaiss : {item.dimensions.h}</span>
                </div>
                <div className="itemDetail">
                  <div className="fabric">Plaquage : {item.veneer ? item.veneer : "sans plaquage"}</div>
                </div>
                <div className="itemDetail">
                  <div>Quantité : {item.qty}</div>
                </div>
                <div className="itemDetail">
                  <div className="prix">Prix HT : {((item.price.wood + item.price.veneer) * item.qty).toFixed(2)} €</div>
                </div>
              </div>
            )
          })}
          <div id="orderPriceContainer">
            <div className="priceEdge itemRowBorder" ></div>
            <div className="priceCenter  itemRowBorder">
              <div className="priceRow  itemRowBorder">
                <div className="totalTitleDiv">
                  <div>TOTAL DE LA COMMANDE:</div>
                </div>
                <div className="totalPriceDiv">
                  <div className="totalCost">{htPrice.toFixed(2)} € HT</div>
                  <div className="totalCost">{ttcPrice.toFixed(2)} € TTC</div>
                  <div className="totalCost costClarification">*dont tva {tva}% : {tvaPart} €</div>
                </div>
              </div>
              <div className="priceRow itemRowBorder">
                <div className="totalTitleDiv">
                  <div>FRAIS DE LIVRAISON:</div>
                </div>
                <div className="totalPriceDiv">
                  <div className="totalCost">{shippingCost.toFixed(2)} €</div>
                  <div className="totalCost costClarification">*{shippingPrice.toFixed(2)} €/kg</div>
                </div>
              </div>
              <div className="priceRow totalPriceRow">
                <div className="totalTitleDiv">
                  <div>COÛT TOTAL:</div>
                </div>
                <div className="totalPriceDiv">
                  <div className="totalCost">{totalCost.toFixed(2)} €</div>                  
                </div>
              </div>
            </div>
            <div className="priceEdge itemRowBorder" />
          </div>
        </div>
        <button className="btn" onClick={submitPayment}>
          <FontAwesomeIcon className="btnIcon" color="#e20024" icon={faShoppingCart} size="1x" />
          Paiement
        </button>
      </div>
    </section>
  )
};

const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

function Payment() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);

  return message ? (
    <Message message={message} />
  ) : (
    <ProductDisplay />
  );
}

export default Payment;
