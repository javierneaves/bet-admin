import { getFirestore, doc, getDoc, collection, getDocs, query, where, deleteDoc, orderBy, updateDoc  } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"
import { app } from './firebase.js'
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { auth } from './firebase.js'

const db = getFirestore(app) 
getProductos()
export function getProductos(){
    let mainDiv = document.getElementById('productContainer')
    mainDiv.innerHTML=''
    onAuthStateChanged(auth, async (user) => {
        if (user) { 
            const productos = query(collection(db, 'productos'))
            const querySnapshot = await getDocs(productos)
            const allData = querySnapshot.forEach((doc) => {
                let divCol = document.createElement('div')
                let divCard = document.createElement('div')
                let img = document.createElement('img')
                let divBody = document.createElement('div')
                let h3ProductTitle = document.createElement('h3')
                let pProductDesc = document.createElement('p')
                let divProductprice = document.createElement('div')
                let spanMoneySign = document.createElement('span')
                let inputProductPrice = document.createElement('input')
                let spanMoneyCero = document.createElement('span')
                let divFormFloating = document.createElement('div')
                let inputInventario = document.createElement('input')
                let labelInventario = document.createElement('label')
                let divCardFooter = document.createElement('div')
                let aEliminarButton = document.createElement('a')
        
                divCol.className = 'col'; 
                divCard.className = 'card shadow col'; 
                img.className = 'card-img-top p-2'; 
                divBody.className = 'card-body'
                spanMoneySign.className = 'input-group-text'; 
                spanMoneyCero.className = 'input-group-text'; 
                inputProductPrice.className = 'form-control inputProductPrice'
                h3ProductTitle.className = 'card-title'; 
                pProductDesc.className = 'card-text'; 
                divProductprice.className = 'input-group mb-3 p-2'
                divFormFloating.className = 'form-floating mb-3 p-2'; 
                inputInventario.className = 'form-control inputInventario'
                divCardFooter.className = 'card-footer'; 
                aEliminarButton.className = 'card-link aEliminarButton'; 
                divCard.style.width = '100%'; 
                divCard.style.height = '100%'
                inputProductPrice.type = 'number'
                img.src = doc.data().imageURL
                img.alt = '...'
                inputInventario.type = 'number'; 
                labelInventario.for = 'productId'
                aEliminarButton.href = '#'; 
                aEliminarButton.textContent = 'Eliminar'
                aEliminarButton.dataset.productId = doc.id
                h3ProductTitle.textContent = doc.data().nombreArticulo
                pProductDesc.textContent = doc.data().descripcionArticulo  
                inputProductPrice.value = doc.data().precioArticulo
                inputProductPrice.dataset.productId = doc.id
                inputInventario.value = doc.data().inventarioActual
                inputInventario.dataset.productId = doc.id
                spanMoneySign.textContent = '$'
                labelInventario.textContent = 'Inventario'
        
                mainDiv.appendChild(divCol)
                divCol.append(divCard)
                divCard.append(img)
                divCard.append(divBody)
                divCard.append(divFormFloating)
                divCard.append(divProductprice)
                divCard.append(divCardFooter)
                divBody.appendChild(h3ProductTitle)
                divBody.appendChild(pProductDesc)
                divFormFloating.appendChild(inputInventario)
                divFormFloating.appendChild(labelInventario)
                divCardFooter.appendChild(aEliminarButton)
                divProductprice.appendChild(spanMoneySign)
                divProductprice.appendChild(inputProductPrice)
            })
            
            let productPrice = document.querySelectorAll('.inputProductPrice')
            let inputInventario = document.querySelectorAll('.inputInventario')
            let aEliminarButton = document.querySelectorAll('.aEliminarButton')
            let currentInventario = inputInventario.value
            

            productPrice.forEach( btn => {
                let currentPrice = btn.value
                btn.addEventListener('blur', async(e) =>{
                    console.log(currentPrice);
                    let productId = e.target.dataset.productId
                    const docRef = doc(db, 'productos', productId)
                    await updateDoc( (docRef), {
                        precioArticulo: btn.value
                    }).then( () => {
                        Swal.fire({
                            text:'Precio actualizado!',
                            icon:'success',
                            timer: 2000,
                            showConfirmButton: false,
                            position: 'bottom-end',
                            })
                    }).catch((error) => {
                        console.log(error);
                    })
                })
            })

            inputInventario.forEach( btn => {
                
                btn.addEventListener('blur', async(e) =>{
                    let productId = e.target.dataset.productId
                    const docRef = doc(db, 'productos', productId)
                    await updateDoc( (docRef), {
                        inventarioActual: btn.value
                    }).then( () => {
                        Swal.fire({
                            text:'Inventario actualizado',
                            icon:'success',
                            timer: 2000,
                            showConfirmButton: false,
                            position: 'bottom-end',
                            })
                    }).catch((error) => {
                        console.log(error);
                    })
                })
            })

            aEliminarButton.forEach( btn  => {
                btn.addEventListener('click', async (e) => {
                    console.log('click eliminar');
                  Swal.fire({
                    title: 'Requiere permisos de administrador',
                    text:'Solo el administrador puede eliminar este producto, favor de enviar un correo a neaves@voltio.us',
                    showDenyButton: false,
                    showCancelButton: true,
                    confirmButtonText: 'Regresar',
                    denyButtonText: `Eliminar`,
                    icon: 'warning'
                  }).then(async(result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                      Swal.fire({
                        text:'El producto no se ha eliminado',
                        icon: 'info',  
                        timer: 2000,
                        showConfirmButton: false,
                        position: 'bottom-end',
                      })
                    } else if (result.isDenied) {
                      
                        let productId = e.target.dataset.productId
                      
                      const docRef = doc(db, "productos", productId) 
                      await deleteDoc(docRef);
                      getProductos()
                      Swal.fire({
                        text:'Producto eliminado',
                        icon:'success',
                        timer: 2000,
                        showConfirmButton: false,
                        position: 'bottom-end',
                      })
                      return
                    }
                  })
                  
                })
              })

        } else {
            console.log('no user logged');
        }
    }) 
}


/*
<div class="col"> // divCol
    <div class="card shadow col" style="width: 100%; height: 100%;"> // divCard
    <img src="sa" class="card-img-top" alt="..."> // img
    <div class="card-body">                         // divBody
        <h3 class="card-title">Shampoo</h3>             // h3ProductTitle
        <p class="card-text">Shampoo Matizador</p>      // pProductDesc
        <p class="card-text">$29.99</p>                 // pProductprice
    </div>
    <div class="form-floating mb-3 p-2">            // divFormFloating
        <input type="number" class="form-control" id="inventarioProductoCard"/> // inputInventario
        <label for="inventarioProductoCard">Inventario</label> // labelInventario
    </div>
    <div class="card-footer">                      // divCardFooter
        <a href="#" class="card-link">Eliminar</a>      // aEliminarButton
        <a href="#" class="card-link">Guardar</a>       // aGuardarButton
    </div>
    </div>
</div> 

<div class="input-group mb-3"> // divProductprice
    <span class="input-group-text">$</span> //spanMoneySign
    <input type="text" class="form-control" aria-label="Amount (to the nearest dollar)"> // inputProductPrice
    <span class="input-group-text">.00</span> //spanMoneyCero
</div>
*/