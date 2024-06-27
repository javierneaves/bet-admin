import { auth } from './firebase.js'
import { showMessages } from './showMessages.js'
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { getFirestore, collection, getDoc, doc, getDocs,  addDoc, setDoc  } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"
import { app } from './firebase.js'

// Initialize Firebase
const db = getFirestore(app) 

export function runCompleteUserData (telefono, fechaDeCumple){
    onAuthStateChanged(auth, async (user) => {
        console.log(user)
        if (user) {
            console.log('usuario logueado setReservation');
            let nombreCliente = user.displayName
            let email = user.email
            let userAuthId = user.uid
            
            try {
                const docRef = await addDoc(collection(db, "customerData"), {
                  nombre: nombreCliente,
                  email: email,
                  telefono: telefono,
                  userAuth: userAuthId,
                  telefono: telefono,
                  fechaDeCumple
                });
                console.log("Document written with ID: ", docRef.id);
                userId = docRef.id
              } catch (e) {
                console.error("Error adding document: ", e);
          
              }
    
        } else {
            
            console.log('user is not logged')
        }
        });
}
