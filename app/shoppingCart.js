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
 
const db = getFirestore(app) 
getShoppingCart()
export function getShoppingCart(){

    let mainDiv = document.querySelector('#shoppingCartContainer')
    mainDiv.innerHTML = ''
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            let shoppingCartSection = document.querySelector('#shoppingCartSection')
            shoppingCartSection.style.display = 'block'
            const shippingCart = query(collection(db, 'shoppingCart'),
                                        where("userAuthId", "==", user.uid),
                                        where("orderStatus", "==", 'onProcess'))
            const querySnapshot = await getDocs(shippingCart)
            let productCount = []
            const allData = querySnapshot.forEach((doc) => {
                
                    let liContainer = document.createElement('li')
                    let imgContainer = document.createElement('img')
                    let divTitle = document.createElement('div')
                    let h4ProductName = document.createElement('h4')
                    let h6ProductDescription = document.createElement('h6')
                    let spanPrice = document.createElement('span')
                    let btnRemoveProduct = document.createElement('button')
                    
                    liContainer.className = 'list-group-item d-flex justify-content-between lh-sm align-items-center'
                    imgContainer.src = doc.data().imageURL
                    imgContainer.alt = doc.data().nombreArticulo
                    imgContainer.style.height = '100px'
                    h4ProductName.className = 'my-0'
                    h6ProductDescription.className = 'text-muted'
                    spanPrice.className = 'text-muted'
                    btnRemoveProduct.className = 'btn btn-transparent text-muted btnRemoveProduct'
                    btnRemoveProduct.setAttribute('data-bs-toggle', 'tooltip')
                    btnRemoveProduct.setAttribute('data-bs-placement', 'bottom')
                    btnRemoveProduct.setAttribute('title', 'Remover producto')
                    btnRemoveProduct.textContent = 'X'
                    btnRemoveProduct.dataset.docId = doc.id

                    h4ProductName.textContent = doc.data().nombreArticulo
                    h6ProductDescription.textContent = doc.data().descripcionArticulo
                    spanPrice = parseFloat(doc.data().precioArticulo).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    })

                    mainDiv.appendChild(liContainer)
                    liContainer.append(imgContainer)
                    liContainer.append(divTitle)
                    divTitle.appendChild(h4ProductName)
                    divTitle.appendChild(h6ProductDescription)
                    liContainer.append(spanPrice)
                    liContainer.append(btnRemoveProduct)
                    productCount.push(parseFloat(doc.data().precioArticulo))

            });

            const reducer = (accumulator, curr) => accumulator + curr;
            let productSum = productCount == '' ? '' : productCount.reduce(reducer)
            
            let badgeProd = document.querySelector('.badgeProd')
            let spanPriceSubtotal = document.querySelector('.spanPriceSubtotal')
            let totalPrice = document.querySelector('.totalPrice')
            let btnRemoveProduct = document.querySelectorAll('.btnRemoveProduct')

            badgeProd.textContent = productCount.length
            spanPriceSubtotal.textContent = productSum.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })
            totalPrice.textContent =   parseFloat(productSum + 0).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              }) 

            btnRemoveProduct.forEach( btn => {
                btn.addEventListener('click', async (e) => {
                    let docId = e.target.dataset.docId
                    const docRef = doc(db, "shoppingCart", docId) 
                    await deleteDoc(docRef);
                    getShoppingCart()
                })
            })

              
        } else {
            let shoppingCartSection = document.querySelector('#shoppingCartSection')
            shoppingCartSection.style.display = 'block'
            let mainDiv = document.getElementById('shoppingCartSection')
            mainDiv.innerHTML = ''
            let divContainer = document.createElement('div')
            let divCol = document.createElement('div')
            let h2Text = document.createElement('h2')

            divContainer.className = 'container mb-5'
            divCol.className = 'col text-center'
            h2Text.textContent = 'Inicie sesión para ver el carrito'
            mainDiv.appendChild(divContainer)
            divContainer.appendChild(divCol)
            divCol.appendChild(h2Text)
        }
    })
} 
/*
<li class="list-group-item d-flex justify-content-between lh-sm align-items-center"> //liContainer
<img src="" alt="" height="100px">
<div>                               // divTitle
    <h4 class="my-0">               // h4ProductName
    Nombre del producto
    </h4>
    <h6 class="text-muted">         // h6ProductDescription
    Descripcion del producto
    </h6>
</div>
<span class="text-muted">$ 500</span>  // spanPrice
<button class="btn btn-transparent"   // btnRemoveProduct
data-bs-toggle='tooltip' 
data-bs-placement="bottom" 
title="Remover producto">x</button>
</li>
*/