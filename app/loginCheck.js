import { logOut } from './logout.js'
import { webDomain } from "../main.js"

let username
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { auth } from './firebase.js'

onAuthStateChanged(auth, async(user) => {
    var currentHostname = window.location.pathname;
    if (user) {
        console.log(user.email);
        username = user.displayName
        return
    } else {
        
        if(currentHostname == '/dashboard.html'){
           // window.open(webDomain + '/index.html', '_self');
        }

        console.log('user is not logged loginCheck.js')
    }
    });


export const loginCheck = user => {
    if (user) {
        const noUserLogged = document.querySelectorAll('.noUserLogged')
        const userLogged = document.querySelectorAll('.userLogged')
        const userLoggedSub = document.querySelectorAll('.userLoggedSub')
        
        noUserLogged.forEach( link => link.style.display = 'none')
        userLogged.forEach( link => link.style.display = 'block')
        userLoggedSub.forEach( link => link.style.display = 'block')
        const loginButtonsContainer = document.getElementById('loginButtonsContainer') 

        let liUserEnTitulo = document.createElement("li")
        let liIngresaAquiButton = document.createElement("li")
        let liLogoutButton = document.createElement("li")
        
        let aUsuarioEnTitulo = document.createElement("a")
        let aIngresaAquiButton = document.createElement("a")
        let aLogoutButton = document.createElement("a")
        let aShoppingCart = document.createElement("a")
        let spanIcon = document.createElement('span')
    
        aUsuarioEnTitulo.className = 'p-2'
        aUsuarioEnTitulo.id = 'usuarioEnTitulo'
        aUsuarioEnTitulo.textContent = user.displayName
        
        aIngresaAquiButton.href = 'acceso.html'
        aIngresaAquiButton.className = 'button noUserLogged'
        aIngresaAquiButton.id = 'ingresaAquiButton'
        aIngresaAquiButton.innerHTML = 'Ingresa Aquí'
        
        aLogoutButton.href = '#'
        aLogoutButton.className = 'button userLogged logoutButton'
        aLogoutButton.id = 'logoutButton'
        aLogoutButton.innerHTML = 'Logout'

        aShoppingCart.href = webDomain + '/comprar.html' 
        aShoppingCart.className = 'btn btn-warning aShoppingCart text-dark'
        aShoppingCart.id = 'aShoppingCart'
        aShoppingCart.innerHTML = ''
        aShoppingCart.setAttribute("data-bs-toggle", "tooltip");
        aShoppingCart.setAttribute("data-bs-placement", "bottom");
        aShoppingCart.setAttribute("title", "Ir al carrito de compras");

        spanIcon.className = 'material-symbols-outlined'
        spanIcon.textContent = 'shopping_cart'
    
        loginButtonsContainer.append(liUserEnTitulo)
        loginButtonsContainer.append(liIngresaAquiButton)
        loginButtonsContainer.append(liLogoutButton)
        liUserEnTitulo.appendChild(aUsuarioEnTitulo)
        liUserEnTitulo.appendChild(aShoppingCart)
       // liIngresaAquiButton.appendChild(aIngresaAquiButton)
        liLogoutButton.appendChild(aLogoutButton)
        aShoppingCart.appendChild(spanIcon)
        
        

        logOut()
       

    } else {
        const noUserLogged = document.querySelectorAll('.noUserLogged')
        const userLogged = document.querySelectorAll('.userLogged')
        const userLoggedSub = document.querySelectorAll('.userLoggedSub')
        
        noUserLogged.forEach( link => link.style.display = 'block')
        userLogged.forEach( link => link.style.display = 'none')
        userLoggedSub.forEach( link => link.style.display = 'none')

        const loginButtonsContainer = document.getElementById('loginButtonsContainer') 

        let liUserEnTitulo = document.createElement("li")
        let liIngresaAquiButton = document.createElement("li")
        let liLogoutButton = document.createElement("li")
        
        let aUsuarioEnTitulo = document.createElement("a")
        let aIngresaAquiButton = document.createElement("a")
        let aLogoutButton = document.createElement("a")
    
        aUsuarioEnTitulo.className = 'p-2'
        aUsuarioEnTitulo.id = 'usuarioEnTitulo'
        
        aIngresaAquiButton.href = 'acceso.html'
        aIngresaAquiButton.className = 'button noUserLogged'
        aIngresaAquiButton.id = 'ingresaAquiButton'
        aIngresaAquiButton.innerHTML = 'Ingresa Aquí'
        
        aLogoutButton.href = '#'
        aLogoutButton.className = 'button userLogged'
        aLogoutButton.id = 'logoutButton'
        aLogoutButton.innerHTML = 'Logout'
    
        loginButtonsContainer.append(liUserEnTitulo)
        loginButtonsContainer.append(liIngresaAquiButton)
        loginButtonsContainer.append(liLogoutButton)
        //liUserEnTitulo.appendChild(aUsuarioEnTitulo)
        liIngresaAquiButton.appendChild(aIngresaAquiButton)
        //liLogoutButton.appendChild(aLogoutButton)
        

        //logOut()
       

    }
}

