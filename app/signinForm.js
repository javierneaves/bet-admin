import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"
import { auth } from './firebase.js'
import { showMessages } from './showMessages.js'
import  {webDomain} from "../main.js"

const signInButton = document.querySelector('#signInButton')



signInButton.addEventListener('click', async () => {
    const user = document.querySelector('#user').value
    const password = document.querySelector('#password').value
    console.log(user)
    console.log(password)
    try{
        const credentials = await signInWithEmailAndPassword(auth, user, password)
        console.log(credentials)
        window.open(webDomain + '/index.html', '_self');
        showMessages('Welcome '+ credentials.user.email)
    }catch(error) {
        console.log(error)
        if(error.code === 'auth/wrong-password'){
            showMessages('Password incorrecto', 'error')
        } else if(error.code === 'auth/user-not-found'){
            showMessages('Usuario no encontrado', 'error')
        } else if(error.code === 'auth/invalid-email'){
            showMessages('Correo no valido', 'error')
        } else {
            showMessages('Revise los datos ingresados', 'www')
        }
    }
})