import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faForward, faBan, faRedoAlt, faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
// import { sendUpdateInvoice } from "../../lib/mailing.js";
// Config
import config from "../../config.json";

const Order = (props) => {
  const [isOrderDeployed, setIsOrderDeployed] = useState(false);
  const [isProductListDeployed, setIsProductListDeployed] = useState(false);

  const upgradeOrderStatus = () => {
    fetch(`${config.API_URL}/order/status/next`,
      {
        method: "PUT",
        headers:
        {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(props.order)
      })
      .then(res => res.json())
      .then(json => {
        alert(json.message);
        if (json.canBeUpdated)
        {
          props.updateOrders();
          // sendUpdateInvoice(json.order, json.order._id);
        }
      })
      .catch(err => console.log(err));
  };

  const cancelOrder = () => {
    fetch(`${config.API_URL}/order/status/cancelled`,
      {
        method: "PUT",
        headers:
        {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(props.order)
      })
      .then(res => res.json())
      .then(json => {
        alert(json.message);
        if (json.canBeUpdated)
        {
          props.updateOrders();
          // sendUpdateInvoice(json.order, json.order._id);
        }
      })
      .catch(err => console.log(err));
  };

  const resetOrderStatus = () => {
    fetch(`${config.API_URL}/order/status/reset`,
      {
        method: "PUT",
        headers:
        {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(props.order)
      })
      .then(res => res.json())
      .then(json => {
        alert(json.message);
        if (json.canBeUpdated)
        {
          props.updateOrders();
          // sendUpdateInvoice(json.order, json.order._id);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="divOrder">
      <h3 onClick={() => isOrderDeployed ? setIsOrderDeployed(false) : setIsOrderDeployed(true)}>
        <span>
          <FontAwesomeIcon icon={isOrderDeployed ? faAngleUp : faAngleDown} />
        </span>
        {" "}
        Commande ref. {props.order._id.toUpperCase()}
        {" "}
        <span>
          <FontAwesomeIcon icon={isOrderDeployed ? faAngleUp : faAngleDown} />
        </span>
      </h3>

      <div className="divOrderBody">
        <div className="divOrderStatus">
          <p>Statut : {props.order.orderStatus}.</p>
          {isOrderDeployed ?
            <div className="divOrderStatusBtn">
              <FontAwesomeIcon icon={faForward} className="button" title="Statut suivant" onClick={upgradeOrderStatus} />
              <FontAwesomeIcon icon={faBan} className="button" title="Annuler la commande" onClick={cancelOrder} />
              <FontAwesomeIcon icon={faRedoAlt} className="button" title="Restaurer le statut" onClick={resetOrderStatus} />
            </div>
            : null}
        </div>

        {isOrderDeployed ?
          <div>
            <div className="divBilling">
              <strong className="title">ADRESSE DE FACTURATION</strong>
              <ul className="listBilling">
                <li>Catégorie : {props.order.billingAddress.isProfessional ? "Professionnel" : "Particulier"}.</li>
                <li>Nom : {props.order.billingAddress.lastName.toUpperCase()} {props.order.billingAddress.firstName}.</li>
                <li>Tél. : {props.order.billingAddress.phone}</li>
                <li>Email : {props.order.billingAddress.emailAddress}</li>
                <li>Adresse : {props.order.billingAddress.fullBillingAddress.address}, {" "}
                  {props.order.billingAddress.fullBillingAddress.postcode} {props.order.billingAddress.fullBillingAddress.city}, {" "}
                  {props.order.billingAddress.fullBillingAddress.country}.</li>

                {props.order.billingAddress.isProfessional ?
                  <>
                    <li>Raison sociale : {props.order.billingAddress.professionalInfo.businessName}.</li>
                    <li>SIRET : {props.order.billingAddress.professionalInfo.siret}.</li>
                    <li>TVA intracom. : {props.order.billingAddress.professionalInfo.vatIntracomNumber}.</li>
                  </>
                  : null}
              </ul>
            </div>

            <div className="divShipping">
              {!props.order.shippingAddressIsDifferent ?
                <p className="title sameShipping">L'adresse de livraison est identique.</p>
                :
                <>
                  <p><strong className="title">ADRESSE DE LIVRAISON</strong></p>
                  <ul className="listShipping">
                    <li>Catégorie : {props.order.shippingAddress.isProfessional ? "Professionnel" : "Particulier"}.</li>
                    <li>Nom : {props.order.shippingAddress.lastName.toUpperCase()} {props.order.shippingAddress.firstName}.</li>
                    <li>Tél. : {props.order.shippingAddress.phone}</li>
                    <li>Adresse : {props.order.shippingAddress.fullShippingAddress.address}, {" "}
                      {props.order.shippingAddress.fullShippingAddress.postcode} {props.order.shippingAddress.fullShippingAddress.city}, {" "}
                      {props.order.shippingAddress.fullShippingAddress.country}.</li>

                    {props.order.shippingAddress.isProfessional ?
                      <li>Raison sociale : {props.order.shippingAddress.professionalInfo.businessName}.</li>
                      : null}
                  </ul>
                </>}
            </div>

            <div className="divProducts">
              <p className="productsTitleP" onClick={() => isProductListDeployed ? setIsProductListDeployed(false) : setIsProductListDeployed(true)}>
                <span>
                  <FontAwesomeIcon icon={isProductListDeployed ? faAngleUp : faAngleDown} />
                </span>
                <strong className="title productsTitle">PRODUITS</strong>
                <span>
                  <FontAwesomeIcon icon={isProductListDeployed ? faAngleUp : faAngleDown} />
                </span>
              </p>
              <p>Nombre de produits : {props.order.products ? props.order.products.length : "0"}.</p>

              {props.order.products && isProductListDeployed ?
                props.order.products.map((e, i) =>
                  <div className="divIndividualProduct" key={props.order._id + "_" + i}>
                    <p><strong>Produit n°{i + 1}</strong></p>
                    <ul>
                      <li>Mousse : {e.foam.name}</li>
                      <li>Dimensions : {e.dimension.l}x{e.dimension.w}x{e.dimension.h}</li>
                      <li>Tissu : {e.fabric ? e.fabric.name : "Non"}</li>
                      <li>Quantité : {e.qty}</li>
                      <li>Prix : {e.cost}</li>
                    </ul>
                  </div>
                )
                :
                isProductListDeployed ?
                  <div className="emptyCart">
                    <p>Panier vide.</p>
                  </div>
                  : null
              }
            </div>
          </div>
          : null}
      </div>
    </div>
  );
};

export default Order;
