import { getFirestore, 
    doc, 
    getDoc, 
    collection, 
    getDocs, 
    query, 
    where, 
    deleteDoc, 
    orderBy, 
    updateDoc,
    addDoc  } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"
import { app } from './firebase.js'
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { auth } from './firebase.js'
import { webDomain } from "../main.js"
 
const db = getFirestore(app) 
getProductsShopping()
export function getProductsShopping(){
    console.log('product shopping');
    let mainDiv = document.getElementById('productosContainer')
    mainDiv.innerHTML=''
    let aShoppingCart = document.querySelector('.aShoppingCart ')
    aShoppingCart.href = webDomain + '/comprar.html' 
    onAuthStateChanged(auth, async (user) => {
        if (user) { 
            const productos = query(collection(db, 'productos'))
            const querySnapshot = await getDocs(productos)
            const allData = querySnapshot.forEach((doc) => {
                let divCol = document.createElement('div')
                let divCard = document.createElement('div')
                let img = document.createElement('img')
                let divBody = document.createElement('div')
                let h1Productprice = document.createElement('h1')
                let h3ProductTitle = document.createElement('h3')
                let pProductDesc = document.createElement('p')
                let divCardFooter = document.createElement('div')
                let addToCartButton = document.createElement('a')
                let spanIcon = document.createElement('span')
        
                divCol.className = 'col'; 
                divCard.className = 'card mb-2 rounded-3 shadow-sm'; 
                img.className = 'card-img-top p-2'; 
                divBody.className = 'card-body'
                h3ProductTitle.className = 'card-title text-center'; 
                pProductDesc.className = 'card-text'; 
                h1Productprice.className = 'card-title pricing-card-title display-4 text-center'
                divCardFooter.className = 'card-footer align-middle text-center'; 
                addToCartButton.className = 'btn btn-warning  addToCart py-3 align-middle'; 
                spanIcon.className = 'material-symbols-outlined'
                spanIcon.textContent = 'shopping_cart'
                divCard.style.width = '100%'; 
                divCard.style.height = '100%'
                img.src = doc.data().imageURL
                img.alt = '...'
                addToCartButton.textContent = 'Agregar al carrito  '
                addToCartButton.dataset.productId = doc.id
                addToCartButton.dataset.price = doc.data().precioArticulo
                addToCartButton.dataset.productName = doc.data().nombreArticulo
                addToCartButton.dataset.productDescription = doc.data().descripcionArticulo
                addToCartButton.dataset.imageURL = doc.data().imageURL
                h3ProductTitle.textContent = doc.data().nombreArticulo
                pProductDesc.textContent = doc.data().descripcionArticulo  
                h1Productprice.textContent = '$ ' + doc.data().precioArticulo  
        
                mainDiv.appendChild(divCol)
                divCol.append(divCard)
                divCard.append(img)
                divCard.append(divBody)
                divCard.append(divCardFooter)
                divBody.appendChild(h1Productprice)
                divBody.appendChild(h3ProductTitle)
                divBody.appendChild(pProductDesc)
                divCardFooter.appendChild(addToCartButton)
                addToCartButton.appendChild(spanIcon)

            })
            
            let shoppingCart = document.querySelectorAll('.addToCart')
            shoppingCart.forEach(btn => {

                btn.addEventListener('click', async(e) =>{
                        
                    onAuthStateChanged(auth, async (user) =>{
                        if(user){
                            console.log(e);
                            const docRef = await addDoc(collection(db, 'shoppingCart'),{
                                nombreArticulo: e.target.dataset.productName,
                                precioArticulo: e.target.dataset.price,
                                descripcionArticulo: e.target.dataset.productDescription,
                                userAuthId: user.uid,
                                imageURL: e.target.dataset.imageURL,
                                orderStatus: 'onProcess',
                                productId: e.target.dataset.productId,
                            })
                            .then( () => {
                                Swal.fire({
                                    text:'Producto agregado al carrito',
                                    icon:'success',
                                    showConfirmButton: true, 
                                    position: 'bottom-end',
                                })
                            }).catch((error) => {
                                console.log(error);
                            })
                        } else {
                            console.log('no user logged');
                        }
                    })
                    
                })
            })
            

        } else {
            console.log('no user logged');
        }
    }) 
}