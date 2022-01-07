// Dépendances
import { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Contexte
import { AppContext } from "../../App.js";
// Config
import config from "../../config.json";
// Icones
import { faUserLock } from "@fortawesome/free-solid-svg-icons";
// Style
import "./style.css";

const UserPage = () => {
  /* Contexte */
  const context = useContext(AppContext);
  // const userInfo = context.getUserInfo();
  /* Constantes */
  const isBigScreen = useMediaQuery({ query: "(min-device-width: 850px)" });
  const iconSize = (isBigScreen ? "2x" : "1x");

  /* Variables d'états */
  const [userInfo, setUserInfo] = useState({});
  const [openForm, setOpenForm] = useState(false);
  const [redirect, setRedirect] = useState(false);

  /* Hooks */
  useEffect(() => {
    if (context.getUserLogged())
      setUserInfo(JSON.parse(sessionStorage.getItem("user")));
    else
      setRedirect(true);
  }, [context.getUserLogged()]);

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

  return (
    <section id="userPageContainer">
      {redirect ? <Redirect to="/" /> : null}
      <h2>GESTION DU PROFIL</h2>
      <div id="profileContainer">
        <div className="profileItem">
          <div className="profileItemLabel">Nom:</div>
          <div className="profileItemInfo">{userInfo.lastName}</div>
        </div>
        <div className="profileItem">
          <div className="profileItemLabel">Prénom:</div>
          <div className="profileItemInfo">{userInfo.firstName}</div>
        </div>
        <div className="profileItem">
          <div className="profileItemLabel">E-mail: </div>
          <div className="profileItemInfo">{userInfo.email}</div>
        </div>
        <div className="profileItem">
          <div className="profileItemLabel">Numero de téléphone: </div>
          <div className="profileItemInfo">{userInfo.phoneNumber}</div>
        </div>
        <div className="profileItem profileItemLabel">Mes Addresses :</div>
        <div className="profileItem">
          <div className="profileItemLabel">Facturation: </div>
          <div>
            {userInfo.billingAddresses?.map((address, index) => <div key={index}>{`${address.isProfessional ? address.company + ',' : ""} ${address.address}`}</div>)}
          </div>
        </div>
        <div className="profileItem">
          <div className="profileItemLabel">Livraison: </div>
          <div>
            {userInfo.shippingAddresses?.map((address, index) => <div key={index}>{`${address.isProfessional ? address.company + ',' : ""} ${address.address}`}</div>)}
          </div>
        </div>
      </div>
      <button className="updateUserInfoBtn" onClick={() => setOpenForm(true)}>Modifier mes informations</button>
      {openForm ?
        <div>
          <p>A venir</p>
          <button className="updateUserInfoBtn" onClick={() => setOpenForm(false)}>OK</button>
        </div>
        : null}
    </section>
  );
}

export default UserPage;
