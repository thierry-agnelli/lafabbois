// Dépendances
import { Switch, Route, useLocation, Redirect } from "react-router-dom";
// Composants
import Registration from "../../views/Registration/Registration.js";
import AccountValidation from "../../views/AccountValidation/AccountValidation.js";
import Connection from "../../views/Connection/Connection.js";
import PasswordRecovering from "../../views/PwdRecovering/PwdRecovering.js";
import UserPage from "../../views/UserPage/UserPage.js";
import FormOrder from "../../views/FormOrder/FormOrder.js";
import Range from "../../views/FormOrder/Range.js";
import Wood from "../../views/FormOrder/Wood.js";
import Dimensions from "../../views/FormOrder/Dimensions.js";
import Veneer from "../../views/FormOrder/Veneer.js";
import PageValidation from "../../views/FormOrder/PageValidation.js";
import Cart from "../../views/Cart/Cart.js";
import FormAddress from "../../views/FormAddress/FormAddress.js";
import Payment from "../../views/Payment/Payment.js";
import SuccessPage from "../../views/SuccessPage/SuccessPage.js"
import AdminPanel from "../../views/AdminPanel/AdminPanel.js";
import WorkInProgress from "../../views/WorkInProgress/WorkInProgress.js";
import OriginalContent from "../../views/OriginalContent/OriginalContent.js";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Body = () => {

    let query = useQuery();

    return (
        <>
        <Redirect to="/product-config/range"/>
        <Switch>
            {/* View du générateur de produit */}
            <Route exact path="/">
                <Redirect to="/product-config/range"/>
            </Route>

            <Route path="/product-config/range">
                <FormOrder target={<Range />} />
            </Route>

            <Route path="/product-config/wood">
                <FormOrder target={<Wood />} />
            </Route>

            <Route path="/product-config/dimensions">
                <FormOrder target={<Dimensions />} />
            </Route>

            <Route path="/product-config/veneer">
                <FormOrder target={<Veneer />} />
            </Route>

            <Route path="/product-config/validation">
                <PageValidation />
            </Route>

            {/* Views de la connexion, inscription, validation compte et du panier */}
            <Route path="/connection">
                <Connection />
            </Route>

            <Route path="/registration">
                <Registration />
            </Route>

            <Route path="/account-validation/:validationToken" children={<AccountValidation />} />

            <Route path="/password/recovering">
                {/* <PasswordRecovering /> */}
                <WorkInProgress />
            </Route>

            <Route path="/cart">
                <Cart />
            </Route>

            {/* Formulaires d'adresses */}
            <Route path="/address">
                <FormAddress />
            </Route>

            {/* Formulaire de paiement */}
            <Route path="/payment">
                <Payment />
            </Route>
            {/* Formulaire d'informations utilisateur */}
            <Route path="/userpage">
                <UserPage />
            </Route>

            {/* Panneau administrateur */}
            <Route path="/admin">
                <AdminPanel />
            </Route>

            {/* Réussite du paiement */}
            <Route path="/success">
                <SuccessPage name={query.get("id")} />
            </Route>

            {/* Contenu du site original */}
            <Route path="/original">
                <OriginalContent/>
            </Route>
        </Switch>
        </>
    );
};

export default Body;

