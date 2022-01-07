// Dépendances
import { useState, useEffect, useContext } from "react";
import { useMediaQuery } from "react-responsive";
// Composants
import Member from "./Member.js";
import Order from "./Order.js";
// Contexte
import { AppContext } from "../../App.js";
// Icones
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserLock, faSyncAlt, faCheck, faSearch } from "@fortawesome/free-solid-svg-icons";
// Config
import config from "../../config.json";
// Style
import "./style.css";

const AdminPanel = () => {
  /* Constantes */
  const context = useContext(AppContext);
  const isBigScreen = useMediaQuery({ query: "(min-device-width: 850px)" });
  const iconSize = (isBigScreen ? "2x" : "1x");

  /* Variables d'états */
  const [userInfo, setUserInfo] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [picture, setPicture] = useState(null);
  const [binaryPic, setBinaryPic] = useState(null);
  const [picPreview, setPicPreview] = useState(null);
  const [category, setCategory] = useState("");

  const [members, setMembers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [filterStatus, setFilterStatus] = useState("Toutes");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterRef, setFilterRef] = useState("");

  /* Hooks */
  useEffect(() => {
    setUserInfo(JSON.parse(sessionStorage.getItem("user")));
    retrieveMembers();
    retrieveAllOrders();
  }, [context.getUserLogged()]);

  // Conversion en binaire au chargement de l'image
  useEffect(() => {
    if (picture)
      fileToBinary(picture)
        .then(binary => setBinaryPic(binary));
  }, [picture]);

  // Affichage preview
  useEffect(() => {
    if (binaryPic)
      fetch(binaryPic)
        .then(res => res.blob())
        .then(blob => setPicPreview(blob))
  }, [binaryPic]);

  /* Handlers */
  // Sélection d'une image à upload en base
  const imageSelection = (e) => setPicture(e.target.files[0]);
  // Entrée catégorie
  const categoryInput = (e) => setCategory(e.target.value);

  // Envoie de l'image en base
  const sendPic = (e) => {
    console.log(picture.name);

    fetch(`${config.API_URL}/images/store`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        name: picture.name.split('.')[0],
        category: category,
        binary: binaryPic.split(",")[1],
        contentType: picture.type
      })
    })
      .then(response => console.log("ok"))
      .catch(err => console.log("nok"));
  };


  /* Functions */
  const retrieveMembers = () => {
    fetch(`${config.API_URL}/user/all`)
      .then(res => res.json())
      .then(json => {
        const adminObj = json.find(e => e.status === "administrateur");
        const memberList = json.filter(e => e.status !== "administrateur");

        setAdmin(adminObj);
        setMembers(memberList);
      })
      .catch((err) => console.log(err));
  };

  const retrieveAllOrders = () => {
    fetch(`${config.API_URL}/order/all`)
      .then(res => res.json())
      .then(json => setOrders(json))
      .catch((err) => console.log(err));
  };

  const handleFilterStatus = () => {
    fetch(`${config.API_URL}/order/all/status/${filterStatus}`)
      .then(res => res.json())
      .then(json => setOrders(json));
  };

  const handleRefresh = () => {
    if (filterStatus === "Toutes")
      alert("Liste de l'ensemble des commandes rafraîchie.");
    else
      alert(`Liste des commandes "${filterStatus}" rafraîchie.`);
    handleFilterStatus();
  };

  const handleFilterText = () => {
    if (filterEmail !== "" && filterRef !== "") {
      alert("Les champs de l'email et de la référence sont tous les deux remplis. Videz-en un pour filtrer les commandes.");
    }
    else if (filterEmail !== "") {
      console.log(filterEmail);
      fetch(`${config.API_URL}/order/all/${filterEmail}`)
        .then(res => res.json())
        .then(json => {
          if (!json.length)
            alert("Adresse email invalide.");
          setOrders(json);
        })
        .catch((err) => console.log(err));
    }
    else if (filterRef !== "") {
      console.log(filterRef);
      fetch(`${config.API_URL}/order/one/${filterRef}`)
        .then(res => res.json())
        .then(json => {
          if (!json.length)
            alert("Référence invalide.");
          setOrders(json);
        })
        .catch((err) => console.log(err));
    }
    else {
      alert("Aucun champ n'est rempli.");
    }
  };

  /* Fonctions */
  // Conversion image en binaire
  const fileToBinary = (file) => new Promise((resolve, reject) => {
    // Création du reader
    const reader = new FileReader();
    // Déclaration event revoie du résultat au chargement du reader(ligne suivante)
    reader.onload = e => resolve(e.target.result);
    // Lecture du fichier
    reader.readAsDataURL(file);
  });

  return (
    <section id="adminPanel">
      <h2>PANNEAU ADMINISTRATEUR</h2>

      {!(context.getUserLogged() && userInfo?.status === "administrateur") ?
        <div id="accessDenied">
          <FontAwesomeIcon color="#e20024" size={iconSize} icon={faUserLock} />
          <p>Vous devez être connecté en tant qu'administrateur pour accéder à cette page.</p>
        </div>
        :
        <>
          <div id="newPictureContainer">
            <h3>Import nouvelle image</h3>
            <form id="addPictureForm">
              <span>Image : {picture ? <b>{picture.name}</b> : null}</span>
              <div id="pictureFormSubContainer">
                {picPreview ? <img id="picPreview" src={URL.createObjectURL(picPreview)} alt="Preview réalisation" />
                  : <div id="picPreview" />}
                <div id="pictureFormCategoryInput">
                  <label htmlFor="categoryInput">Catégorie</label>
                  <input type="text" id="categoryInput" onChange={categoryInput}/>
                </div>
              </div>
              <input type="file" id="makingPic" name="makingImage" accept="image/png, image/jpg" onChange={imageSelection} />
            </form>
            <button className="formButton" onClick={sendPic}>Envoyer</button>
          </div>
          <div className="section" id="stats">
            <h3>STATISTIQUES</h3>
          </div>

          <div className="section" id="products">
            <h2>PRODUITS</h2>
          </div>

          <div className="section" id="members">
            <h2>MEMBRES</h2>

            <div className="refresh">
              <div className="button" title="Actualiser les members" onClick={retrieveMembers}>
                <FontAwesomeIcon icon={faSyncAlt} />
                {" "} Rafraîchir
              </div>
            </div>

            {!admin && !members.length ? <p id="noMember">Pas de membre.</p>
              :
              <div id="divMembers">
                {admin ? <Member key={admin._id} member={admin} isAdmin={true} /> : null}
                {members.map(element => <Member key={element._id} member={element} isAdmin={false} />)}
              </div>
            }
          </div>

          <div className="section" id="orders">
            <h2>COMMANDES</h2>

            <div className="refresh">
              <div className="button" title="Actualiser les commandes" onClick={handleRefresh}>
                <FontAwesomeIcon icon={faSyncAlt} />
                {" "} Rafraîchir
              </div>
            </div>

            <div id="listStatus">
              <p>Statuts de commande possibles : En attente {">"} En cours {">"} Expédiée.<br />
                Autre statut possible : Annulée.</p>
            </div>

            <div id="filters">
              <select defaultValue="disabled" onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="disabled" disabled>Filtrer les commandes par statut</option>
                <option value="Toutes">Toutes les commandes</option>
                <optgroup label="Statuts">
                  <option value="En attente">En attente</option>
                  <option value="En cours">En cours</option>
                  <option value="Expédiée">Expédiée</option>
                  <option value="Annulée">Annulée</option>
                </optgroup>
              </select>
              <div onClick={handleFilterStatus}>
                <FontAwesomeIcon className="button" icon={faCheck} />
              </div>
            </div>
            <div id="search">
              {/* e.target.value.replace(/ /g, '') retire les espaces de e.target.value */}
              <input type="text" id="searchEmail" title="Filtrer par email" placeholder="email"
                value={filterEmail} onChange={e => setFilterEmail(e.target.value.replace(/ /g, ''))} />
              <input type="text" id="searchRef" title="Filtrer par référence" placeholder="reference"
                value={filterRef} onChange={e => setFilterRef(e.target.value.replace(/ /g, ''))} />
              <div onClick={handleFilterText}>
                <FontAwesomeIcon className="button" icon={faSearch} />
              </div>
            </div>

            {!orders.length ? <p id="noOrder">Pas de commande.</p>
              :
              <div id="divOrders">
                {orders.map(element => <Order key={element._id} order={element} updateOrders={retrieveAllOrders} />)}
              </div>
            }
          </div>
        </>}
    </section>
  );
};

export default AdminPanel;
