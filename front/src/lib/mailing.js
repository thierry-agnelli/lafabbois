import emailjs from 'emailjs-com';

//Constantes
const serviceID = "default_service";
const templateID = "template_xkj4zcn";
const userID = "user_uCJxYsOJAIpdzRiPOraai";


// Envoie d'un mail après paiement de la commande
// const sendInvoice = (orderObject, orderID) => {

//   let productList = "";
//   let cost = 0;

//   for (const product of orderObject.products) {
//     productList += `Mousse : ${product.foam.name} ${product.dimension.l}x${product.dimension.w}x${product.dimension.h}. Quantité : ${product.qty}. ${product.fabric ? "Tissu : " + product.fabric.name + "." : ""} Prix : ${product.cost.toFixed(2)} €.`
//     productList += " / ";
//     cost += product.cost;
//   }

//   const templateParams = {
//     mail_to: orderObject.billingAddress.emailAddress,
//     title: "Résumé de votre commande",
//     name: `M/Mme ${orderObject.billingAddress.lastName} ${orderObject.billingAddress.firstName}`,
//     message1: `Confirmation de la commande n° ${orderID}`,
//     message2: `${productList}`,
//     message3: `Coût total : ${cost.toFixed(2)} €`,
//     message4: `Votre commande est en statut : ${orderObject.orderStatus}`,
//     message5: `Un e-mail vous sera envoyé à chaque étape d'avancement de votre commande`,
//   };

//   emailjs.send(serviceID, templateID, templateParams, userID)
//     .then(() => {
//       console.log("mail envoyé");
//     }, (err) => {
//       console.log(JSON.stringify(err));
//     });
// };

// export { sendInvoice };


// Envoie d'un mail au changement de statut de la commande
const sendUpdateInvoice = (orderObject, orderID) => {

  let productList = "";
  let cost = 0;

  for (const product of orderObject.products) {
    productList += `Mousse : ${product.foam.name} ${product.dimension.l}x${product.dimension.w}x${product.dimension.h}. Quantité : ${product.qty}. ${product.fabric ? "Tissu : " + product.fabric.name + "." : ""} Prix : ${product.cost.toFixed(2)} €.`
    productList += " / ";
    cost += product.cost;
  }

  const templateParams = {
    mail_to: orderObject.billingAddress.emailAddress,
    title: "Mise à jour de votre commande",
    name: `M/Mme ${orderObject.billingAddress.lastName} ${orderObject.billingAddress.firstName}`,
    message1: `Votre commande n° ${orderID} avance`,
    message2: `Votre commande est désormais en statut : ${orderObject.orderStatus}`,
    message3: `Pour rappel contenu de votre commande :`,
    message4: `${productList}`,
    message5: `Coût total : ${cost.toFixed(2)} €`,
  };

  emailjs.send(serviceID, templateID, templateParams, userID)
    .then(() => {
      console.log("mail envoyé");
    }, (err) => {
      console.log(JSON.stringify(err));
    });
};

export {sendUpdateInvoice};


// Envoie d'un mail pour confirmation d'e-mail à l'inscription
// const sendRegistrationValidation = (data) => {

//   const templateParams = {
//     mail_to: data.email,
//     title: "Validation de votre compte",
//     name: data.firstName,
//     message1: "Vous venez de vous inscrire sur la Maison de la mousse, nous sommes heureux de vous souhaiter la bienvenue.",
//     message2: "Merci de cliquer sur le lien ci-dessous pour valider votre compte :",
//     message3: `http://localhost:3000/account-validation/${data.validationToken}`
//   };


//   emailjs.send(serviceID, templateID, templateParams, userID)
//     .then(() => {
//       console.log("mail envoyé");
//     }, (err) => {
//       console.log(JSON.stringify(err));
//     });
// }

// export { sendRegistrationValidation }