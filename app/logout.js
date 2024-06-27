import { signOut } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"
import { auth } from './firebase.js'
import { webDomain } from "../main.js"

try{
    const userLoggedSub = document.getElementById('userLoggedSub')
    userLoggedSub.addEventListener('click', async () => {
    console.log("logout submenu clicked")
    await signOut(auth)
    window.open(webDomain + '/index.html', '_self');
})

} catch(error){
    
}

export function logOut(){   
    console.log("logout function")
    const logoutButton = document.querySelector('.userLogged')
    
    logoutButton.addEventListener('click', async () => {
        await signOut(auth)
        window.open(webDomain + '/index.html', '_self');
    })

    
        
}
     



