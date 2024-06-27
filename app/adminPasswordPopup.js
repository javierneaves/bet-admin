import { GoogleAuthProvider, signInWithPopup  } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"
import { auth } from './firebase.js'
import  {webDomain} from "../main.js"
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
let adminDashboard = document.getElementById('adminDashboard')

adminDashboard.addEventListener('click', async (e) =>{
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            Swal.fire({
                text: 'Ingrese la contraseña de administrador',
                html:'<input type="password" name="adminPassword" id="adminPasswordInput" placeholder="admin password.."/>',
                showCancelButton: true,
                confirmButtonText: 'Acceder',
                showLoaderOnConfirm: true,
                preConfirm: () => {
                    let adminPasswordInput = document.getElementById('adminPasswordInput')
                    if(adminPasswordInput.value === 'admin123'){
                        window.open(webDomain + '/dashboard.html', '_self');
                    } else {
                        Swal.fire({
                            text: 'contraseña incorrecta',
                            showCancelButton: true,
                            confirmButtonText: 'Intentar nuevamente',
                            confirmButtonColor: '#3C8BF2',
                            icon: 'error',
                        }).then( () => {
                            console.log('object');
                        })
                    }
                    
                    console.log(adminPasswordInput.value);
                },
            })
            
        } else {
            Swal.fire({
              text: 'Inicie sesión para acceder',
              showDenyButton: true,
              showCancelButton: true,
              confirmButtonText: 'Iniciar con Google',
              confirmButtonColor: '#3C8BF2',
              denyButtonText: `Iniciar con email`,
              denyButtonColor:'#007172',
              icon: 'warning',
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
    })
})
