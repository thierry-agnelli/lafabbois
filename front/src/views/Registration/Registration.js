// Dépendances
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
// Config
import config from "../../config.json";
// Style
import "./style.css"

// Page d'inscription
const Registration = () => {
    /* Variables d'état */
    // Affichage ou non de la partie adresse de livraison
    const [shippingAddressContainer, setShippingAddressContainer] = useState(false);
    // Utilisateur enregistré
    const [registratedUser, setRegistratedUser] = useState(false);
    // Affichage du message d'erreur
    const [error, setError] = useState("");
    // Données utilisateur
    const [userInfos, setUserInfos] = useState({
        email: "",
        pwd: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        billingAddress: {
            isProfessional: false,
            company: "",
            siret: "",
            vat: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            address: "",
            postCode: "",
            city: "",
            country: "",
        },
        shippingAddress: {
            isProfessional: false,
            company: "",
            lastName: "",
            firstName: "",
            phoneNumber: "",
            address: "",
            postCode: "",
            city: "",
            country: "",
        },
    });
    // Mot de passe répété
    const [repeatedPwd, setRepeatedPwd] = useState("");
    // Adresses
    const [address, setAddress] = useState({
        billingAddress: {
            addressPart1: "",
            addressPart2: "",
            addressPart3: "",
        },
        shippingAddress: {
            addressPart1: "",
            addressPart2: "",
            addressPart3: "",
        }
    });

    /* Références */
    // Infos générales
    const repeatPwdRef = useRef(null);
    // Adresse de facturation
    const billingCityRef = useRef(null);
    // Adresse de livraison
    const shippingCityRef = useRef(null);

    /* Méthodes */
    // Vérification des champs adresses Facturation/livraison
    const addressChecking = (addressCategory, professionalfields) => {
        const missingAddressInfo = [];

        // Parcours de tous les champs d'adresse
        for (const field in userInfos[addressCategory]) {
            // Vérifivations si le champs fait partie de la liste champs pro (passé en paramètre)
            if (professionalfields.includes(field)) {
                // Si le champs est pRo est activé et que le champs est vide
                if (userInfos[addressCategory].isProfessional && userInfos[addressCategory][field] === "") {
                    missingAddressInfo.push(`${addressCategory}-${field}`);

                }
            }
            // Tous les autres champs (autre que le booléen isProfessionnal) si ils sont vide
            else if (field !== "isProfessional" && userInfos[addressCategory][field] === "") {
                missingAddressInfo.push(`${addressCategory}-${field}${field === "address" ? "Part1" : ""}`);
            }
        }
        return missingAddressInfo;
    };

    // Vérifications si un input obligatoire est vide
    const userInfosChecking = () => {
        const notCompletedField = [];
        // Parcours de tous les champs de userinfos
        for (const field in userInfos) {
            switch (field) {
                // Champs email
                case "email":
                    // Expression régulière pour vérification email au format *@*.* (* = n fois n'importe quel caractère)
                    const regex = new RegExp(".+@.+[.].+");
                    // Si le mail ne correspond pas
                    if (!regex.exec(userInfos[field]))
                        notCompletedField.push(field);
                    break;
                // Champs adresse de facturation
                case "billingAddress":
                    notCompletedField.push(...addressChecking(field, ["company", "siret", "vat"]));
                    break;
                // Champs adresse de livraison
                case "shippingAddress":
                    // Si la case adresse de livraison est cochée
                    if (shippingAddressContainer)
                        notCompletedField.push(...addressChecking(field, ["company"]));
                    break;
                // Champs généraux
                default:
                    // Si ils sont vides
                    if (userInfos[field] === "")
                        notCompletedField.push(field);
                    break;
            }
        }

        if (repeatPwdRef.current.value === "")
            notCompletedField.push("repeatPwd");

        return notCompletedField;
    };

    /* Handle */
    // Infos générales
    const handleGeneralInfoInput = (e) => {
        // Retrait de la class CSS d'erreur à l'entrée d'infos dans le champ
        e.target.classList.remove("inputFormError");

        // Si champs Nom/Prénom/numéro de tel/email préremplissage du champs du mêmem nom dans facturation
        if (["lastName", "firstName", "phoneNumber", "email"].includes(e.target.id))
            userInfos.billingAddress[e.target.id] = e.target.value;

        setUserInfos({ ...userInfos, [e.target.id]: e.target.value })
    };
    // Infos Répéter Password
    const handleRepeatPwdInput = (e) => {
        setRepeatedPwd(e.target.value);

        if (e.target.value !== userInfos.pwd)
            e.target.classList.add("inputFormError");
        else
            e.target.classList.remove("inputFormError");
    };
    // IsProfessional
    const handleIsProfessionnal = (e) => {
        // Changement du booléen isProfessionnal selon la catégorie facturation/livraison
        userInfos[e.target.name.split("-")[0]].isProfessional = e.target.value !== "private";
        setUserInfos({ ...userInfos });
    };

    // Infos adresse de facturation/livraison
    const handleAddressInfoInput = (e) => {
        // Retrait de la class CSS d'erreur à l'entrée d'infos dans le champ
        e.target.classList.remove("inputFormError");

        // Enregistrement de l'information concernée selon la catégorie facturation/livraison
        userInfos[e.target.id.split("-")[0]][e.target.id.split("-")[1]] = e.target.value;
        setUserInfos({ ...userInfos })
    };

    // Adresse de facturation/livraisons
    const handleAddressInput = (e) => {
        // Retrait de la class CSS d'erreur à l'entrée d'infos dans le champ
        e.target.classList.remove("inputFormError");

        // Enregistrement de l'adresse selon la catégorie facturation/livraison
        address[e.target.id.split("-")[0]][e.target.id.split("-")[1]] = e.target.value;
        setAddress({ ...address, });

        // Concaténation des 3 partie de l'adresse dans le state userInfos selon la catégorie facturation/livraison
        userInfos[e.target.id.split("-")[0]].address = userInfos[e.target.id.split("-")[0]].address = address[e.target.id.split("-")[0]].addressPart1 +
            (address[e.target.id.split("-")[0]].addressPart2 ? " " + address[e.target.id.split("-")[0]].addressPart2 : "") +
            (address[e.target.id.split("-")[0]].addressPart3 ? " " + address[e.target.id.split("-")[0]].addressPart3 : "");
        setUserInfos({ ...userInfos });
    };

    // Récupération du nom de la ville par le code postale et enregistrement des 2
    const handleGetCityBypostCode = (e) => {
        // Retrait de la class CSS d'erreur à l'entrée d'infos dans le champ
        e.target.classList.remove("inputFormError");
        // Récupération de l'info saisie
        const postCode = e.target.value;

        // Si supression du code postal supression du nom de la ville
        if (postCode === "") {
            if (e.target.id.split("-")[0] === "billingAddress")
                billingCityRef.current.value = "";
            else
                shippingCityRef.current.value = "";
        }

        // Récupération du nom de la ville lorsqu'un code postale complet est saisie
        if (postCode.length === 5) {

            // Enregistrement du code postal
            userInfos[e.target.id.split("-")[0]].postCode = postCode;

            fetch(`https://geo.api.gouv.fr/communes?codePostal=${postCode}`)
                .then(response => response.json())
                .then(jsonResponse => {
                    if (e.target.id.split("-")[0] === "billingAddress") {
                        // Mise à jour et enregistrement de la ville
                        billingCityRef.current.value = jsonResponse[0].nom;
                        userInfos.billingAddress.city = billingCityRef.current.value;
                        setUserInfos({ ...userInfos });
                    }
                    else {
                        // Mise à jour et enregistrement de la ville
                        shippingCityRef.current.value = jsonResponse[0].nom;
                        userInfos.shippingAddress.city = shippingCityRef.current.value;
                        setUserInfos({ ...userInfos });
                    }
                })
                // SI code postal non trouvé
                .catch(err => {
                    if (e.target.id.split("-")[0] === "billingAddress") {
                        // Suppression du nom de la ville dans le formulaire
                        billingCityRef.current.value = "";
                        // Enregistrement des données
                        userInfos.billingAddress.city = "";
                        setUserInfos({ ...userInfos });
                    }
                    else {
                        // Suppression du nom de la ville dans le formulaire
                        shippingCityRef.current.value = "";
                        // Enregistrement des données
                        userInfos.shippingAddress.city = "";
                        setUserInfos({ ...userInfos });
                    }
                });
        }
        // Si le code postal n'est pas complet
        else {
            if (e.target.id.split("-")[0] === "billingAddress") {
                // Suppression du nom de la ville dans le formulaire
                billingCityRef.current.value = "";
                // Enregistrement des données
                userInfos.billingAddress.city = "";
                userInfos.billingAddress.postCode = "";
                setUserInfos({ ...userInfos });
            }
            else {
                // Suppression du nom de la ville dans le formulaire
                shippingCityRef.current.value = "";
                // Enregistrement des données
                userInfos.shippingAddress.city = "";
                userInfos.shippingAddress.postCode = "";
                setUserInfos({ ...userInfos });
            }
        }
    };

    // Adresse de livraison
    const handleShippingAddressCheckBox = (e) => {
        setShippingAddressContainer(e.target.checked);
    }

    // Soumettre l'inscription
    const handleSubmitBtn = () => {

        const missingUserInfosChecker = userInfosChecking();

        for (const elementId of missingUserInfosChecker) {
            document.getElementById(elementId).classList.add("inputFormError");
        }

        if (missingUserInfosChecker.length === 0 && userInfos.pwd === repeatedPwd) {

            fetch(`${config.API_URL}/user/registration`, {
                method: "post",
                headers: {
                    "Accept": "application/json",
                    "Content-type": "application/json"
                },
                body: JSON.stringify(userInfos)
            })
                .then(response => {
                    if (response.status === 200) {
                        return response.text();
                    }
                    else
                        return Promise.reject(response);
                })
                .then(message => {
                    // sendRegistrationValidation(jsonResponse);
                    console.log(message);
                    setRegistratedUser(true);
                })
                .catch(resError => {
                    resError.text()
                        .then(message => {
                            setError(message);
                        })
                });
        }
    };

    return (
        <section id="mainRegistrationContainer">
            {!registratedUser ?
                <>
                    <h2 className="title">CREER UN COMPTE</h2>
                    <form id="registrationMainFormContainer">
                        {/* Informations générales */}
                        <div className="registrationPartContainer">
                            <label className="headerPartLabel">Informations générales</label>
                            <div className="registrationFormContainer">
                                <label htmlFor="email">E-mail*</label>
                                <input id="email" className="registrationTextinput" type="text" onChange={handleGeneralInfoInput} required />
                                <label htmlFor="lastName">Nom*</label>
                                <input id="lastName" className="registrationTextinput" type="text" onChange={handleGeneralInfoInput} />
                                <label htmlFor="firstName">Prénom*</label>
                                <input id="firstName" className="registrationTextinput" type="text" onChange={handleGeneralInfoInput} />
                                <label htmlFor="phoneNumber">Numéro de téléphone*</label>
                                <input id="phoneNumber" className="registrationTextinput" type="text" onChange={handleGeneralInfoInput} />
                                <label htmlFor="pwd">Mot de passe*</label>
                                <input id="pwd" className="registrationTextinput" type="password" onChange={handleGeneralInfoInput} />
                                <label htmlFor="repeatPwd">Répéter mot de passe*</label>
                                <input id="repeatPwd" className="registrationTextinput" ref={repeatPwdRef} type="password" onChange={handleRepeatPwdInput} />
                            </div>
                        </div>
                        {/* Address de facturation */}
                        <div className="registrationPartContainer">
                            <label className="headerPartLabel">Adresse de facturation</label>
                            <div className="registrationFormContainer">
                                <div>
                                    <input id="privateBilling" name="billingAddress-isProfessional" type="radio" value="private" onChange={handleIsProfessionnal} checked={!userInfos.billingAddress.isProfessional} />
                                    <label htmlFor="privateBilling">Particulier</label>
                                    <input id="professionalBilling" name="billingAddress-isProfessional" type="radio" value="professional" onChange={handleIsProfessionnal} checked={userInfos.billingAddress.isProfessional} />
                                    <label htmlFor="professionalBilling">Professionnel</label>
                                </div>
                                {userInfos.billingAddress.isProfessional ?
                                    <div className="companyContainer">
                                        <label htmlFor="billingAddress-company">Société*</label>
                                        <input id="billingAddress-company" className="registrationTextinput" type="text" onChange={handleAddressInfoInput} />
                                        <label htmlFor="billingAddress-siret">Siret*</label>
                                        <input id="billingAddress-siret" className="registrationTextinput" type="text" onChange={handleAddressInfoInput} />
                                        <label htmlFor="billingAddress-vat">TVA*</label>
                                        <input id="billingAddress-vat" className="registrationTextinput" type="text" onChange={handleAddressInfoInput} />
                                    </div>
                                    : null}
                                <label htmlFor="billingAddress-lastName">Nom*</label>
                                <input id="billingAddress-lastName" className="registrationTextinput" type="text" onChange={handleAddressInfoInput} value={userInfos.billingAddress.lastName} />
                                <label htmlFor="billingAddress-firstName">Prénom*</label>
                                <input id="billingAddress-firstName" className="registrationTextinput" type="text" onChange={handleAddressInfoInput} value={userInfos.billingAddress.firstName} />
                                <label htmlFor="billingAddress-phoneNumber">Numéro de téléphone*</label>
                                <input id="billingAddress-phoneNumber" className="registrationTextinput" type="text" onChange={handleAddressInfoInput} value={userInfos.billingAddress.phoneNumber} />
                                <label htmlFor="billingAddress-email">E-mail*</label>
                                <input id="billingAddress-email" className="registrationTextinput" type="text" onChange={handleAddressInfoInput} value={userInfos.billingAddress.email} />
                                <label htmlFor="billingAddress-addressPart1">Adresse partie 1*</label>
                                <input id="billingAddress-addressPart1" className="registrationTextinput" type="text" onChange={handleAddressInput} />
                                <label htmlFor="billingAddress-addressPart2">Adresse partie 2</label>
                                <input id="billingAddress-addressPart2" className="registrationTextinput" type="text" onChange={handleAddressInput} />
                                <label htmlFor="billingAddress-addressPart3">Adresse partie 3</label>
                                <input id="billingAddress-addressPart3" className="registrationTextinput" type="text" onChange={handleAddressInput} />
                                <label htmlFor="billingAddress-postCode">Code Postal*</label>
                                <input id="billingAddress-postCode" className="registrationTextinput" type="text" onChange={handleGetCityBypostCode} />
                                <label htmlFor="billingAddress-city">Ville*</label>
                                <input id="billingAddress-city" className="registrationTextinput" ref={billingCityRef} onChange={handleAddressInfoInput} />
                                <label htmlFor="billingAddress-country">Pays*</label>
                                <input id="billingAddress-country" className="registrationTextinput" onChange={handleAddressInfoInput} />
                            </div>
                        </div>
                        {/* Adresse de livraison */}
                        <div className="registrationPartContainer">
                            <div id="shippingAddressCheckBox">
                                <input id="shippingAddress" type="checkBox" onChange={handleShippingAddressCheckBox} />
                                <label htmlFor="shippingAddress">Adresse de livraison (optionnel)</label>
                            </div>
                            {shippingAddressContainer ?
                                <>
                                    <label className="headerPartLabel">Adresse de livraison</label>
                                    <div className="registrationFormContainer">
                                        <div>
                                            <input id="privateShipping" name="shippingAddress-isProfessional" type="radio" value="private" onChange={handleIsProfessionnal} checked={!userInfos.shippingAddress.isProfessional} />
                                            <label htmlFor="privateShipping">Particulier</label>
                                            <input id="professionalShiping" name="shippingAddress-isProfessional" type="radio" value="professional" onChange={handleIsProfessionnal} checked={userInfos.shippingAddress.isProfessional} />
                                            <label htmlFor="professionalShiping">Professionnel</label>
                                        </div>
                                        {userInfos.shippingAddress.isProfessional ?
                                            <div className="companyContainer">
                                                <label htmlFor="shippingAddress-company">Société*</label>
                                                <input id="shippingAddress-company" className="registrationTextinput" type="text" onChange={handleAddressInfoInput} />
                                            </div>
                                            : null}
                                        <label htmlFor="shippingAddress-lastName">Nom*</label>
                                        <input id="shippingAddress-lastName" className="registrationTextinput" type="text" onChange={handleAddressInfoInput} />
                                        <label htmlFor="shippingAddress-firstName">Prénom*</label>
                                        <input id="shippingAddress-firstName" className="registrationTextinput" type="text" onChange={handleAddressInfoInput} />
                                        <label htmlFor="shippingAddress-phoneNumber">Numéro de téléphone*</label>
                                        <input id="shippingAddress-phoneNumber" className="registrationTextinput" type="text" onChange={handleAddressInfoInput} />
                                        <label htmlFor="shippingAddress-addressPart1">Adresse partie 1*</label>
                                        <input id="shippingAddress-addressPart1" className="registrationTextinput" type="text" onChange={handleAddressInput} />
                                        <label htmlFor="shippingAddress-addressPart2">Adresse partie 2</label>
                                        <input id="shippingAddress-addressPart2" className="registrationTextinput" type="text" onChange={handleAddressInput} />
                                        <label htmlFor="shippingAddress-addressPart3">Adresse partie 3</label>
                                        <input id="shippingAddress-addressPart3" className="registrationTextinput" type="text" onChange={handleAddressInput} />
                                        <label htmlFor="shippingAddress-phoneNumber">Numéro de téléphone*</label>
                                        <input id="shippingAddress-phoneNumber" className="registrationTextinput" type="text" onChange={handleAddressInfoInput} />
                                        <label htmlFor="shippingAddress-postCode">Code Postal*</label>
                                        <input id="shippingAddress-postCode" className="registrationTextinput" type="text" onChange={handleGetCityBypostCode} />
                                        <label htmlFor="shippingAddress-city">Ville*</label>
                                        <input id="shippingAddress-city" className="registrationTextinput" ref={shippingCityRef} onChange={handleAddressInfoInput} />
                                        <label htmlFor="shippingAddress-country">Pays*</label>
                                        <input id="shippingAddress-country" className="registrationTextinput" onChange={handleAddressInfoInput} />
                                    </div>
                                </> : null}
                        </div>

                    </form>
                    <button id="registrationBtn" onClick={handleSubmitBtn}>S'inscrire</button>
                    <div className="registrationError">{error}</div>
                </>
                : <div id="registratedUserContainer">
                    <h2>Un e-mail de confirmation vous été envoyé.</h2>
                    <Link to="/">Retour à la boutique</Link>
                </div>}
        </section>
    );
};

export default Registration;