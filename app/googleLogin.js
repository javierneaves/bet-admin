import { GoogleAuthProvider, signInWithPopup  } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"
import { auth } from './firebase.js'
import  {webDomain} from "../main.js"
import { showMessages } from './showMessages.js'
const googleButton = document.querySelector('#googleButton')

googleButton.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider()
    try{
      const credentials = await signInWithPopup(auth, provider)
      console.log(credentials)
      window.open(webDomain + '/index.html', '_self');
      showMessages('Welcome ' + credentials.user.displayName, 'success')
    } catch (error){
        console.log(error)
    }
    
}) 

/*
site key
6Le4-Y0jAAAAAIFKQGEkMpXiLXtKPg_GOvZcgB3F
secret key
6Le4-Y0jAAAAAATCwlV80yS0l6koHtxzU49bOUNZ
*/
