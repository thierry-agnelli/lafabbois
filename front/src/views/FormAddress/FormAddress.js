import { useState, useEffect, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserLock, faLock } from "@fortawesome/free-solid-svg-icons";
import { AppContext } from '../../App.js';
import "../FormAddress/style.css";

const FormAddress = () => {
  // Contexte
  const context = useContext(AppContext);

  // Constantes
  const isBigScreen = useMediaQuery({ query: "(min-device-width: 850px)" });
  const iconSize = (isBigScreen ? "2x" : "1x");
  const choice = ["Particulier", "Professionnel"];

  /* Variables d'états */
  const [userLogged, setUserLogged] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  //Billing Address
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const [company, setCompany] = useState("");
  const [siret, setSiret] = useState("");
  const [vat, setVat] = useState("");

  const [customerStatus, setCustomerStatus] = useState("");

  //Shipping Address
  const [shippingLastName, setShippingLastName] = useState("");
  const [shippingFirstName, setShippingFirstName] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingPostcode, setShippingPostcode] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingCountry, setShippingCountry] = useState("");
  const [shippingCompany, setShippingCompany] = useState("");

  const [customerShippingStatus, setCustomerShippingStatus] = useState("");

  const [checked, setChecked] = useState(false);

  const [accessGranted, setAccessGranted] = useState(false);
  const [validation, setValidation] = useState(false);

  /* Hooks */
  useEffect(() => {
    let cart = JSON.parse(localStorage.getItem("cart"));

    if (cart?.length) {
      cart = cart.filter(product => product.qty > 0);
      localStorage.setItem("cart", JSON.stringify(cart));

      if (cart.length)
        setAccessGranted(true);
    }
  }, []);

  // Utilisateur
  useEffect(() => {
    if (context.getUserLogged())
      setUserInfo(JSON.parse(sessionStorage.getItem("user")));

    setUserLogged(context.getUserLogged());
  }, [context.getUserLogged()]);

  /* Handler */
  const handleSelectBillingAddress = (e) => {
    let selectedAddress = null;

    if (e.target.value === "new") {
      setLastName("");
      setFirstName("");
      setPhone("");
      setEmail("");
      setAddress("");
      setPostcode("");
      setCity("");
      setCountry("");
      setCompany("");
      setSiret("");
      setVat("");
      setCustomerStatus("");
    }
    else {
      selectedAddress = userInfo.billingAddresses[e.target.value];

      setLastName(selectedAddress.lastName);
      setFirstName(selectedAddress.firstName);
      setPhone(selectedAddress.phoneNumber);
      setEmail(selectedAddress.email.toLowerCase());
      setAddress(selectedAddress.address);
      setPostcode(selectedAddress.postCode);
      setCity(selectedAddress.city);
      setCountry(selectedAddress.country);
      setCompany(selectedAddress.company);
      setSiret(selectedAddress.siret);
      setVat(selectedAddress.vat);
      setCustomerStatus(selectedAddress.isProfessional ? choice[1] : choice[0]);
    }
  };

  const handleSelectShippingAddress = (e) => {
    let selectedAddress = null;

    if (e.target.value === "new") {
      setShippingLastName("");
      setShippingFirstName("");
      setShippingPhone("");
      setShippingAddress("");
      setShippingPostcode("");
      setShippingCity("");
      setShippingCountry("");
      setShippingCompany("");
      setCustomerShippingStatus("");
    }
    else {
      selectedAddress = userInfo.shippingAddresses[e.target.value];

      setShippingLastName(selectedAddress.lastName);
      setShippingFirstName(selectedAddress.firstName);
      setShippingPhone(selectedAddress.phoneNumber);
      setShippingAddress(selectedAddress.address);
      setShippingPostcode(selectedAddress.postCode);
      setShippingCity(selectedAddress.city);
      setShippingCountry(selectedAddress.country);
      setShippingCompany(selectedAddress.company);
      setCustomerShippingStatus(selectedAddress.isProfessional ? choice[1] : choice[0]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (postcode.substring(0, 2) === "00" || shippingPostcode.substring(0, 2) === "00")
      alert("Code postal invalide : Il ne peut pas commencer par \"00\".");
    else {

      if (
        (lastName !== "" && firstName !== "" && phone !== "" && email !== ""
          && address !== "" && postcode !== "" && city !== "" && country !== ""
          && (customerStatus === choice[0] || (company !== "" && siret !== "" && vat !== "")))

        && (checked === false || (shippingLastName !== "" && shippingFirstName !== "" && shippingPhone !== ""
          && shippingAddress !== "" && shippingPostcode !== "" && shippingCity !== "" && shippingCountry !== ""
          && (customerShippingStatus === choice[0] || (shippingCompany !== ""))))
      ) {

        const orderObject =
        {
          // purchasedOn: new Date(),
          orderStatus: "En attente",
          products: JSON.parse(localStorage.getItem("cart")),

          // shippingAddressIsDifferent: checked,

          billingAddress:
          {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            emailAddress: email,
            fullBillingAddress:
            {
              address: address,
              postcode: postcode,
              city: city,
              country: country
            },
            isProfessional: customerStatus === choice[1],
            professionalInfo:
            {
              businessName: company,
              siret: siret,
              vatIntracomNumber: vat
            }
          },

          shippingAddress: checked ? {
            firstName: shippingFirstName,
            lastName: shippingLastName,
            phone: shippingPhone,
            fullShippingAddress:
            {
              address: shippingAddress,
              postcode: shippingPostcode,
              city: shippingCity,
              country: shippingCountry
            },
            isProfessional: customerShippingStatus === choice[1],
            professionalInfo:
            {
              businessName: shippingCompany
            }
          }: null
        };

        localStorage.setItem("orderObject", JSON.stringify(orderObject));
        setValidation(true);
      }
    }
  };

  const handleChange = () => {
    setChecked(!checked);
  };

  return (
    <section id="orderAddressContainer">
      <div id="addressTitle" >ADRESSES</div>
      {!accessGranted ?
        <div id="accessDenied">
          <FontAwesomeIcon color="#e20024" size={iconSize} icon={faUserLock} />
          <p>Votre panier est vide.</p>
          <Link to="/" className="link">Retour à la boutique</Link>
        </div>
        :
        <>
          {!userLogged ?
            <Link id="connectionBox" to="/connection">Connectez-vous pour un paiement rapide.</Link>
            :
            <select className="selectAddress" defaultValue="disabled" onChange={handleSelectBillingAddress}>
              <option disabled value="disabled">Choisissez une adresse de facturation</option>
              {userInfo.billingAddresses.map((e, i) =>
                <option key={i} value={i}>{e.isProfessional ? e.company : e.lastName + " " + e.firstName}{", "}
                  {e.address}, {e.postCode} {e.city}, {e.country}.</option>)
              }
              <option value="new">Nouvelle adresse</option>
            </select>
          }
          <h2>Adresse de facturation</h2>
          <form>
            <div className="radioForm">
              <input
                type="radio"
                value={choice[0]}
                id="part1"
                name="radiovalues"
                checked={customerStatus === choice[0]}
                onChange={(e) => setCustomerStatus(e.target.value)}
              />
              <label htmlFor="part1"><b>{choice[0]}</b></label>
              <input
                type="radio"
                value={choice[1]}
                id="pro1"
                name="radiovalues"
                checked={customerStatus === choice[1]}
                onChange={(e) => setCustomerStatus(e.target.value)}
              />
              <label htmlFor="pro1"><b>{choice[1]}</b></label>
            </div>
            <div className="addressForm">
              {customerStatus === choice[1] ?
                <>
                  <label htmlFor="company">Raison Sociale</label>
                  <input
                    className="inputForm"
                    id="company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                  <label htmlFor="siret">SIRET</label>
                  <input
                    className="inputForm"
                    id="siret"
                    type="text"
                    value={siret}
                    onChange={(e) => setSiret(e.target.value)}
                  />
                  <label htmlFor="vat">TVA Intracommunautaire</label>
                  <input
                    className="inputForm"
                    id="vat"
                    type="text"
                    value={vat}
                    onChange={(e) => setVat(e.target.value)}
                  />
                </>
                : null}
              <label htmlFor="lastName">Nom </label>
              <input
                className="inputForm"
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <label htmlFor="firstName">Prénom</label>
              <input
                className="inputForm"
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <label htmlFor="phone">Numéro de téléphone</label>
              <input
                className="inputForm"
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <label htmlFor="email">Email</label>
              <input
                className="inputForm"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="address">Adresse</label>
              <input
                className="inputForm"
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <label htmlFor="postcode">Code Postal</label>
              <input
                className="inputForm"
                id="postcode"
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
              />
              <label htmlFor="city">Ville</label>
              <input
                className="inputForm"
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <label htmlFor="country">Pays</label>
              <input
                className="inputForm"
                id="country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </form>
          <div className="checkboxAddress">
            <input
              type="checkbox"
              id="differentShippingAddress"
              value={checked}
              onChange={handleChange}
            />
            <label htmlFor="differentShippingAddress">L'adresse de livraison est différente</label>
          </div>
          {checked ?
            <>
              {userLogged ?
                <select className="selectAddress" defaultValue="disabled" id="selectShipping" onChange={handleSelectShippingAddress}>
                  <option disabled value="disabled">Choisissez une adresse de livraison</option>
                  {userInfo?.shippingAddress ? userInfo.shippingAddresses.map((e, i) =>
                    <option key={i} value={i}>{e.isProfessional ? e.company : e.lastName + " " + e.firstName}{", "}
                      {e.address}, {e.postcode} {e.city}, {e.country}.</option>)
                    : null}
                  <option value="new">Nouvelle adresse</option>
                </select>
                : null}
              <h2>Adresse de livraison</h2>
              <form>
                <div className="radioForm">
                  <input
                    type="radio"
                    value={choice[0]}
                    id="part2"
                    name="radiovalues"
                    checked={customerShippingStatus === choice[0]}
                    onChange={(e) =>
                      setCustomerShippingStatus(e.target.value)
                    }
                  />
                  <label htmlFor="part2"><b>{choice[0]}</b></label>
                  <input
                    type="radio"
                    value={choice[1]}
                    id="pro2"
                    name="radiovalues"
                    checked={customerShippingStatus === choice[1]}
                    onChange={(e) =>
                      setCustomerShippingStatus(e.target.value)
                    }
                  />
                  <label htmlFor="pro2"><b>{choice[1]}</b></label>
                </div>
                <div className="addressForm">
                  {customerShippingStatus === choice[1] && (
                    <>
                      <label htmlFor="shippingCompany">Raison Sociale</label>
                      <input
                        className="inputForm"
                        id="shippingCompany"
                        type="text"
                        value={shippingCompany}
                        onChange={(e) =>
                          setShippingCompany(e.target.value)
                        }
                      />
                    </>
                  )}
                  <label htmlFor="shippingLastName">Nom</label>
                  <input
                    className="inputForm"
                    id="shippingLastName"
                    type="text"
                    value={shippingLastName}
                    onChange={(e) =>
                      setShippingLastName(e.target.value)
                    }
                  />
                  <label htmlFor="shippingFirstName">Prénom</label>
                  <input
                    className="inputForm"
                    id="shippingFirstName"
                    type="text"
                    value={shippingFirstName}
                    onChange={(e) =>
                      setShippingFirstName(e.target.value)
                    }
                  />
                  <label htmlFor="shippingPhone">Numéro de téléphone</label>
                  <input
                    className="inputForm"
                    id="shippingPhone"
                    type="tel"
                    value={shippingPhone}
                    onChange={(e) =>
                      setShippingPhone(e.target.value)
                    }
                  />
                  <label htmlFor="shippingAddress">Adresse</label>
                  <input
                    className="inputForm"
                    id="shippingAddress"
                    type="text"
                    value={shippingAddress}
                    onChange={(e) =>
                      setShippingAddress(e.target.value)
                    }
                  />
                  <label htmlFor="shippingPostcode">Code Postal</label>
                  <input
                    className="inputForm"
                    id="shippingPostcode"
                    type="text"
                    value={shippingPostcode}
                    onChange={(e) =>
                      setShippingPostcode(e.target.value)
                    }
                  />
                  <label htmlFor="shippingCity">Ville</label>
                  <input
                    className="inputForm"
                    id="shippingCity"
                    type="text"
                    value={shippingCity}
                    onChange={(e) =>
                      setShippingCity(e.target.value)
                    }
                  />
                  <label htmlFor="shippingCountry">Pays</label>
                  <input
                    className="inputForm"
                    id="shippingCountry"
                    type="text"
                    value={shippingCountry}
                    onChange={(e) =>
                      setShippingCountry(e.target.value)
                    }
                  />
                </div>
              </form>
            </>
            : null}
          <button className="submitAddressButton" onClick={handleSubmit} type="submit">
            <FontAwesomeIcon className="addressBtnIcon" icon={faLock} /> Paiement
          </button>
          {validation ? <Redirect to="/payment"/> : null}
        </>}
    </section>
  );
};

export default FormAddress;
