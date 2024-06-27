import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { auth } from './firebase.js'
console.log('start Log In Log Out function')

window.onload = (() => {
    onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('user is logged' + auth)
        console.log(user.email)
        
    } else {
        
        console.log('user is not logged')
    }
    });
})