import { auth } from './firebase.js'
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"
import { app } from './firebase.js'
import { showMessages } from './showMessages.js'

// Initialize Firebase
const db = getFirestore(app) 
const recomendationButton = document.getElementById('recomendationButton')
const emailRecomendation  = document.getElementById('emailRecomendation')

recomendationButton.addEventListener('click', async (e) =>{
    e.preventDefault()
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            let nombreCliente = user.displayName
            let email = user.email
            let userAuthId = user.uid
            let regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            if( !emailRecomendation.value ){
                showMessages('Ingrese una dirección de correo', 'error')
                return
            } if (!regex.test(emailRecomendation.value)) {
              showMessages('Correo invalido', 'error')
              return
            }
            try {
                const docRef = await addDoc(collection(db, "recomendaciones"), {
                  cliente: nombreCliente,
                  email: email,
                  userAuth: userAuthId,
                  recomendarEmail: emailRecomendation.value,
                });
                showMessages('Gracias por tu recomendación', 'success')
                emailRecomendation.value = ""
                return
              } catch (e) {
                console.error("Error adding document: ", e);
              }
        } else {
            showMessages('Es necesario iniciar sesión para poder enviar una recomendación, podrás obtener puntos por cada referido', "error")
            return
        }
        });

})