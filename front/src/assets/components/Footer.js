// Dépendances
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
// Logo
import lfbLogo from "../images/lfb_logo.png"



const ComputerFooter = () => 
{
    return (
        <footer>
            <div className="footerLogoColumn">
                <img className="footerLogo1" alt="logo fabrique du bois" src={lfbLogo}/>
            </div>
            <div className="footerRow">
                <nav className="footerNav">
                    <p className="footerNavItem"><Link to="/original">Mentions légales</Link></p>
                    <p className="footerNavItem"><Link to="/original">CGV</Link></p>
                    <p className="footerNavItem"><Link to="/original">FAQ</Link></p>
                </nav>

                <div className="footerCopyContainer">
                    <p className="copyrightLine">2021 Fabrique du bois</p>
                </div>
            </div>
        </footer>
    );
};

const PhoneFooter = () => 
{
    return (
        <footer className="phoneColumn">
            <img className="footerLogo1" alt="logo fabrique du bois" src={lfbLogo}/>

            <p className="phoneFooterText"><Link to="/original">Mentions légales</Link></p>
            <p className="phoneFooterText"><Link to="/original">CGV</Link></p>
            <p className="phoneFooterText"><Link to="/original">FAQ</Link></p>

            <div className="footerCopyContainer">
                <p className="phoneFooterText cancelUnderline">2021 Fabrique du bois</p>
            </div>
        </footer>
    );
};

const Footer = () => 
{
    const isPhone = useMediaQuery({ query: "(max-device-width: 601px)" });

    return isPhone ? <PhoneFooter /> : <ComputerFooter/>;
};

export default Footer;

