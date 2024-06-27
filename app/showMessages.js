import { GoogleAuthProvider, signInWithPopup  } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"
import { auth } from './firebase.js'
import  {webDomain} from "../main.js"
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";


export function showMessages(messages, type='success'){
  if(type === 'success'){
    Swal.fire({
      text: messages,
      icon: type,
      timer: 1500,
      position: 'bottom-start',
      showConfirmButton: false,
    })
  } else {
    const user = auth.currentUser;
    console.log(user);
      if (user) {
        Swal.fire({
          text: messages,
          icon: type,
          timer: 1500,
          position: 'bottom-end',
          showConfirmButton: false,
        })
        return
      } else if(!user){
        Swal.fire({
          text: messages,
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Iniciar con Google',
          confirmButtonColor: '#3C8BF2',
          denyButtonText: `Iniciar con email`,
          denyButtonColor:'#007172',
          icon: type,
          customClass: {
            denyButton: 'color: #fffff'
          }
        }).then( async (result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
              console.log('iniciar sesion')
              const provider = new GoogleAuthProvider()
              try{
                const credentials = await signInWithPopup(auth, provider)
                messages = ""
                type = ""
                return
              } catch (error){
                  console.log(error)
              }
          } else if (result.isDenied) {
            window.open(webDomain + '/acceso.html', '_self');
          }
        }) 
    
      }
    
  }
  
}


