import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import  webDomain  from "../main"

window.onload = function(){
    console.log('reservacion')
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        //window.open('http://localhost:5501/src/reservacion.html', '_self');
        console.log('user is logged' + auth)
        console.log(user.email)
        return
        // ...
    } else {
        window.open( webDomain + '/acceso.html', '_self');
        console.log('user is not logged')
    }
    });

}
