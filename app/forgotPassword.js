import { showMessages } from "./showMessages.js"
import { sendPasswordResetEmail  } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { auth } from './firebase.js'

let forgotPassordButton = document.getElementById('forgotPasswordButton')
let getPassword = document.getElementById('getPassword')
let emailToRecover = document.getElementById('emailToRecover')

const myModal = new bootstrap.Modal(document.getElementById('forgotPassword', {
    keyboard: false
}))

forgotPassordButton.addEventListener('click', ()=>{
    myModal.show()
})

getPassword.addEventListener('click', () =>{
    sendPasswordResetEmail(auth, emailToRecover.value).then(() => {
        // Password reset confirmation sent. Ask user to check their email.
        showMessages('La contaseña ha sido enviada al correo ingresado, revisa tu correo', 'success')
        myModal.hide()
        console.log(emailToRecover.value);
      }).catch((error) => {
        console.log(emailToRecover.value);
        // Error encountered while sending password reset code.
        console.log(error);
      });
    
})

