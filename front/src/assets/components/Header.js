// Dépendances
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
// Icones
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserCog, faUserShield, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faInstagram, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
// Logo
import lfbLogo from "../images/lfb_logo.png";
// Méthodes
import { logOut } from "../../lib/logMethods";
// Contexte
import { AppContext } from "../../App";


const Header = () => {
    /* Contexte */
    const context = useContext(AppContext);
    /* Variables d'états */
    const [userInfo, setUserInfo] = useState(null);
    /* Constantes */
    const isBigScreen = useMediaQuery({ query: "(min-device-width: 850px)" });
    const isMediumScreen = useMediaQuery({ query: "(min-device-width: 700px)" });
    const iconSize = (isBigScreen ? "2x" : "1x");
    const socialIconSize = (isMediumScreen ? "1x" : "xs");

    /* Hooks */
    // Mise à jour icones et infos utilisateur
    useEffect(() => {
        if (context.getUserLogged())
            setUserInfo(JSON.parse(sessionStorage.getItem("user")));
    }, [context.getUserLogged()]);

    /* Handlers */
    // Clic sur bouton déconnexion
    const handleUnlogBtn = () => {
        logOut();
        context.setUserLogged(false);
    };

    return (
        <header>
            {/* First row: Website logo + Login button and shopping cart button */}
            <div className="headerTopRow">
                <Link to="/">
                    <img className="headerLogo" alt="logo_fabrique_du_bois" src={lfbLogo} />
                </Link>

                <div className="loginAndCart">
                    {context.getUserLogged() ?
                        <>
                            {userInfo?.status === "administrateur" ?
                                <Link to="/admin">
                                    <FontAwesomeIcon id="adminIcon" color="#e20024" icon={faUserShield} size={iconSize} />
                                </Link>
                                : null}
                            <Link to="/userpage">
                                <FontAwesomeIcon color="#e20024" icon={faUserCog} size={iconSize} />
                            </Link>
                            <div id="headerUserContainer">
                                <div className="headerUserName">{`${userInfo?.firstName} ${userInfo?.lastName}`}</div>
                                <button className="signOutBtn Btn" onClick={handleUnlogBtn}>
                                    <p className="pUnLogin">Déconnexion</p>
                                </button>
                            </div>
                        </>
                        :
                        <>
                            <FontAwesomeIcon color="#e20024" icon={faUser} size={iconSize} />
                            <Link to="/connection">
                                <button className="signInBtn Btn">
                                    <p className="pLogin">Connexion</p>
                                </button>
                            </Link>
                        </>}
                    <Link to="/cart">
                        <button className="Btn">
                            <FontAwesomeIcon color="#e20024" icon={faShoppingCart} size={iconSize} />
                        </button>
                    </Link>
                </div>
            </div>

            {/* Second row: Nav bar + Social media bar */}
            <div className="headerBotRow">
                <nav className="navHeader">
                    <p className="navItem"><Link to="/original">ACCUEIL</Link></p>
                    <p className="navItem"><Link to="/original">QUI SOMMES-NOUS ?</Link></p>
                    <p className="navItem"><Link to="/original">NOS SERVICES</Link></p>
                    <p className="navItem"><Link to="/original">NOS RÉALISATIONS</Link></p>
                    <p className="navItem"><Link to="/original">CONTACT</Link></p>
                    <p className="navItem"><Link to="/" className="navLink red">BOUTIQUE</Link></p>
                </nav>

                <div className="socialMediaBar">
                    <Link to="/original">
                        <FontAwesomeIcon className="socialMediaIcon" icon={faFacebookF} size={socialIconSize} />
                    </Link>
                    <Link to="/original">
                        <FontAwesomeIcon className="socialMediaIcon" icon={faInstagram} size={socialIconSize} />
                    </Link>
                    <Link to="/original">
                        <FontAwesomeIcon className="socialMediaIcon" icon={faLinkedinIn} size={socialIconSize} />
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;

