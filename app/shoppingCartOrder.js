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
import { getShoppingCart } from './shoppingCart.js'

const db = getFirestore(app) 

let orderProductButton = document.querySelector('#orderProductButton')
let shoppingCartContainer = document.querySelector('#shoppingCartContainer')

// -----------------Guardar las ordenes en el sistema

orderProductButton.addEventListener('click', async (e) => {
    if(shoppingCartContainer.innerHTML === ''){
        console.log('no products');
        Swal.fire({
            text:'No hay productos en tu carrito',
            icon:'error',
            timer: 2000,
            showConfirmButton: false,
            position: 'bottom-end',
          })
        return
    } else {
        setProductOrder(e)
    }
    
})
    
export function setProductOrder(e){
    
    onAuthStateChanged(auth, async (user) => {
        if(user){
            let docId = []
            const shippingCart = query(collection(db, 'shoppingCart'),
                                        where("userAuthId", "==", user.uid),
                                        where("orderStatus", "==", 'onProcess'),)
            const querySnapshot = await getDocs(shippingCart)
            const allData = querySnapshot.forEach( async(doc) => {
                docId.push({prodShippedId: doc.id, 
                            nameShippedArt: doc.data().nombreArticulo, 
                            imageShippedArt: doc.data().imageURL, 
                            priceShippedArt: doc.data().precioArticulo})
            });
            
            
            
// ORDERS --------------------------------------------------------   
            let ordersNo = []         
            const orders = query(collection(db, 'pedidos'))
            const ordersSnapshot = await getDocs(orders)
            ordersSnapshot.forEach((e) => {
                ordersNo.push(e.data().order)
            })
            console.log('ordersNo');
            console.log(ordersNo);
            let newOrder = Math.max(...ordersNo) + 1

            let date = new Date()
              let today = new Date()
              let months = ["enero", "febrero", "marzo", 'abril', "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
              let month = months[date.getMonth()] 
              let hour = date.getHours() < 10 ? '0'+date.getHours() : date.getHours()
              let year = date.getFullYear()
              let day = date.getDate() < 10 ? '0'+ date.getDate() : date.getDate()
              let orderDate = day + ' de ' + month + ' del ' + year
            // se usa la tabl a pedidos para obtener el numero de la orden, el resto se maneja desde shopping cart
            await addDoc(collection(db, "pedidos"), {
                order: newOrder,
                userAuth: user.uid,
                orderDate: orderDate,
            });
            
            docId.forEach(async(e) =>{
                console.log(e.prodShippedId);
                const docRef = doc(db, "shoppingCart", e.prodShippedId) 
                await updateDoc ((docRef), {
                    orderStatus: 'Ordered',
                    orderNumber: newOrder,
                    orderDate: orderDate,
                    shipped: 'Por surtir'
                    })
            })
// TERMINA ORDENES ----------------------------------------------            
            Swal.fire({
                text:'La orden ' + newOrder + ' ha sido creada',
                icon:'success',
                timer: 2000,
                showConfirmButton: false,
                position: 'bottom-end',
            })
            
            getShoppingCart()
           
            
        } else {
            console.log('no user logged');
        }
    })

}

// A continuacion se debe filtrar por los productos no ordenados para mostrar en el carrito
// Los productos Ordenados se deben agregar al historial de ordenes del cliente
// En historial de ordenes se van a registrar los productos que finalemtne fueron pagados y recogidos en el salon
// Esto lo hacen los empleados para registrar entrada de dinero