// Style
import "./style.css";

// View mot de passe oublié
const PasswordRecovering = () => {

    return (
        <section id="recoveringPwdMainContainer">
            <h2>Mot de passe oublié</h2>
            <div id="recoveringMailInput">
                <label>Addresse mail correspondant à votre compte</label>
                <input type="text" />
            </div>
        </section>
    );
};

export default PasswordRecovering;
