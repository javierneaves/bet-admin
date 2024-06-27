import { auth } from './firebase.js'
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";


window.onload = function(){
    
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        console.log(user.email)
        document.querySelector('#user').value = user.email
        // ...
    } else {
        // User is signed out
        // ...
    }
    });

}