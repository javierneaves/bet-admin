import { getFirestore, 
    
    getDoc, 
    collection, 
    getDocs, 
    query, 
    where, 
    doc, 
    deleteDoc, 
    orderBy, 
    updateDoc,
    addDoc  } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"
import { app } from './firebase.js'
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { auth } from './firebase.js'

const db = getFirestore(app) 
let orderStatus = 'Por surtir'
let orderStatusDropdown = document.querySelector('#orderStatusDropdown')
orderStatusDropdown.addEventListener('change', () => {
    orderStatus = orderStatusDropdown.value
    console.log(orderStatus);
    getOrdersByCustomer()
})

getOrdersByCustomer()
function getOrdersByCustomer() {
    onAuthStateChanged(auth, async (user) => {
        if (user){
            console.log('mis pedidos con user');
            let mainDiv = document.querySelector('#ordersContainer')
            mainDiv.innerHTML = ''
            const ordersQuery = query(collection(db, 'shoppingCart'),
                                where("userAuthId", "==", user.uid),
                                where('shipped', '==', orderStatus)
                                )
            const querySnapshot = await getDocs(ordersQuery)

                let liMainContainer = document.createElement('li')
                let divCol = document.createElement('div')
                let divCard = document.createElement('div')
                let divCarHeader = document.createElement('div')
                let h4OrderNumber = document.createElement('h4')
                let divCardBoddy = document.createElement('div')
                let olProductList = document.createElement('ol')
                let liProduct = document.createElement('li')
                let divContainProduct = document.createElement('div')
                let divContainImage = document.createElement('div')
                let imgProduct = document.createElement('img')
                let divContainName = document.createElement('div')
                let h2ProductName = document.createElement('h2') 
                let divContainPrice = document.createElement('div')
                let h2Price = document.createElement('h2')

                liMainContainer.className = 'mb-2'
                divCol.className = 'col'
                divCard.className = 'card shadow col h-100'
                divCarHeader.className = 'card-header'
                h4OrderNumber.className = 'fw-bold text-center'
                divCardBoddy.className = 'card-boddy p-1'
                olProductList.className = 'list-group list-group-numbered searchResults'
                divContainProduct.className = 'row g-0 align-items-center mb-2'
                divContainImage.className = 'col-md-4'
                imgProduct.className = 'card-img-top'
                divContainName.className = 'col-md-5'
                h2ProductName.className = 'text-start'
                h2Price.className = 'text-start'
                divContainPrice.className = 'col-md-3'
                h4OrderNumber.textContent = 'Mis pedidos'

                mainDiv.appendChild(liMainContainer)
                liMainContainer.appendChild(divCol)
                divCol.appendChild(divCard)
                divCard.append(divCarHeader)
                divCard.append(divCardBoddy)
                divCarHeader.appendChild(h4OrderNumber)
                divCardBoddy.appendChild(olProductList)

                var searchResultsBox = document.querySelector(".searchResults");
                let templateBox = document.querySelector(".rowTemplate");
                let template = templateBox.content;

                const allData = querySnapshot.forEach( async(docs) => {
                    console.log(docs);
                    var tr = template.cloneNode(true);
                    let imgProg = tr.querySelector(".imgProg");
                    let nameProd = tr.querySelector(".nameProd");
                    let priceProd = tr.querySelector(".priceProd");
                    let ordenNumber = tr.querySelector(".ordenNumber");
                    let estatusDropdown = tr.querySelector(".estatusDropdown");
                    let price = docs.data().precioArticulo
                    imgProg.src = docs.data().imageURL
                    imgProg.alt = docs.data().nombreArticulo
                    nameProd.textContent = docs.data().nombreArticulo
                    ordenNumber.textContent = 'orden: ' + docs.data().orderNumber
                    priceProd.textContent = parseFloat(price).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    })
                    estatusDropdown.value = docs.data().shipped
                    estatusDropdown.dataset.shippedId = docs.id
                    estatusDropdown.dataset.productId = docs.data().productId
                    
                    searchResultsBox.appendChild(tr)
                })

                let dropdownOrderStatus = document.querySelectorAll('.estatusDropdown')
                dropdownOrderStatus.forEach( btn => {
                btn.addEventListener('change', async(e) => {
                    let shippedId = e.target.dataset.shippedId
                    let productId = e.target.dataset.productId
                    let shippedStatus = e.target.value
                    const docRef = doc(db, 'shoppingCart', shippedId)
                    await updateDoc( (docRef), {
                        shipped: shippedStatus
                    }).then( async() => {
                        Swal.fire({
                            text:'Pedido actualizado!',
                            icon:'success',
                            timer: 2000,
                            showConfirmButton: false,
                            position: 'bottom-end',
                            })
                            getOrdersByCustomer()
// La siguiente funcion suma o resta del actual inventario de productos.
// Depende si es por surtir o surtido                            
                            const docRefProd = doc(db, 'productos', productId)
                            const docSnapProd = await getDoc(docRefProd)
                            let inventarioActual = docSnapProd.data().inventarioActual
                            console.log(inventarioActual);
                            if(shippedStatus === 'Por surtir'){
                                await updateDoc( (docRefProd), {
                                    inventarioActual: inventarioActual + 1
                                })
                            } else {
                                await updateDoc( (docRefProd), {
                                    inventarioActual: inventarioActual - 1
                                })
                            }
                            
                            updateProdInventory(productId)
                    }).catch((error) => {
                        console.log(error);
                    })
                })
                })
        } else {
            console.log('no user logged');
        }
    })
        
}

function updateProdInventory(productId){
    console.log(productId);
}