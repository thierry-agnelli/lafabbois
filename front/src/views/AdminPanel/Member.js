import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";

const Member = (props) => {
    const [isMemberDeployed, setIsMemberDeployed] = useState(false);
    const [isBillingListDeployed, setIsBillingListDeployed] = useState(false);
    const [isShippingListDeployed, setIsShippingListDeployed] = useState(false);

    return (
        <div className="divMember">
            <h3 onClick={() => isMemberDeployed ? setIsMemberDeployed(false) : setIsMemberDeployed(true)}>
                <span>
                    <FontAwesomeIcon icon={isMemberDeployed ? faAngleUp : faAngleDown} />
                </span>
                {" "}
                {props.member.lastName.toUpperCase() + " " + props.member.firstName}
                {" "}
                <span>
                    <FontAwesomeIcon icon={isMemberDeployed ? faAngleUp : faAngleDown} />
                </span>
            </h3>

            {isMemberDeployed ?
            <div className="divMemberBody">
                    <div className="divAccount">
                        <strong className="title">COMPTE</strong>
                        <ul>
                            {props.isAdmin ? <li>Administrateur</li>
                            : <li>Inscrit le : {props.member.registered}.</li>}

                            <li>Nom : {props.member.lastName}.</li>
                            <li>Prénom : {props.member.firstName}.</li>
                            <li>Tél. : {props.member.phoneNumber}.</li>
                            <li>Email : {props.member.email}.</li>
                        </ul>
                    </div>

                    <div className="divBilling">
                        {!isBillingListDeployed ?
                        <>
                            <p className="title cursor" onClick={() => setIsBillingListDeployed(true)}>
                                <FontAwesomeIcon icon={faAngleDown} />
                                <strong>{" ADRESSES DE FACTURATION "}</strong>
                                <FontAwesomeIcon icon={faAngleDown} />
                            </p>
                            <p>Nombre d'adresses : {props.member.billingAddresses.length}.</p>
                        </>
                        :
                        <>
                            <p className="title cursor" onClick={() => setIsBillingListDeployed(false)}>
                                <FontAwesomeIcon icon={faAngleUp} />
                                <strong>{" ADRESSES DE FACTURATION "}</strong>
                                <FontAwesomeIcon icon={faAngleUp} />
                            </p>
                            <p>Nombre d'adresses : {props.member.billingAddresses.length}.</p>

                            {props.member.billingAddresses.map((e, i) => 
                            <div key={props.member._id + "bill" + i}>
                                <p><strong>Adresse n°{i + 1}</strong></p>
                                <ul>
                                    {e.isProfessional ?
                                    <>
                                        <li>Catégorie : Professionnel.</li>
                                        <li>Raison sociale : {e.company}.</li>
                                        <li>SIRET : {e.siret}.</li>
                                        <li>TVA intracom. : {e.vat}.</li>
                                    </>
                                    : 
                                        <li>Catégorie : Particulier.</li>
                                    }
                                    <li>Nom : {e.lastName.toUpperCase()} {e.firstName}.</li>
                                    <li>Tél. : {e.phoneNumber}</li>
                                    <li>Email : {e.email}</li>
                                    <li>Adresse : {e.address}, {e.postcode} {e.city}, {e.country}.</li>
                                </ul>
                            </div>)}
                        </>
                        }
                    </div>

                    <div className="divShipping">
                    {!isShippingListDeployed ?
                        <>
                            <p className="title cursor" onClick={() => setIsShippingListDeployed(true)}>
                                <FontAwesomeIcon icon={faAngleDown} />
                                <strong>{" ADRESSES DE LIVRAISON "}</strong>
                                <FontAwesomeIcon icon={faAngleDown} />
                            </p>
                            <p>Nombre d'adresses : {props.member.shippingAddresses.length}.</p>
                        </>
                        :
                        <>
                            <p className="title cursor" onClick={() => setIsShippingListDeployed(false)}>
                                <FontAwesomeIcon icon={faAngleUp} />
                                <strong>{" ADRESSES DE LIVRAISON "}</strong>
                                <FontAwesomeIcon icon={faAngleUp} />
                            </p>
                            <p>Nombre d'adresses : {props.member.shippingAddresses.length}.</p>

                            {props.member.shippingAddresses.map((e, i) => 
                            <div key={props.member._id + "ship" + i}>
                                <p><strong>Adresse n°{i + 1}</strong></p>
                                <ul>
                                    {e.isProfessional ?
                                    <>
                                        <li>Catégorie : Professionnel.</li>
                                        <li>Raison sociale : {e.company}.</li>
                                    </>
                                    : 
                                    <li>Catégorie : Particulier.</li>
                                    }
                                    <li>Nom : {e.lastName.toUpperCase()} {e.firstName}.</li>
                                    <li>Tél. : {e.phoneNumber}</li>
                                    <li>Adresse : {e.address}, {e.postcode} {e.city}, {e.country}.</li>
                                </ul>
                            </div>)}
                        </>}
                    </div>
                </div>
            : null}
        </div>
    );
};

export default Member;
