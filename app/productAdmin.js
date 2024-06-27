import { auth } from './firebase.js'
import { showMessages } from './showMessages.js'
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { getFirestore, collection, addDoc, } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"
import { getStorage , ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js"
import { getApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { app } from './firebase.js'
import { getProductos } from './productAdminGetList.js'


const db = getFirestore(app) 

let nombreArticulo = document.getElementById('nombreArticulo')
let precioArticulo = document.getElementById('precioArticulo') 
let inventarioActual = document.getElementById('inventarioActual')
let descripcionArticulo = document.getElementById('descripcionArticulo')
let imagenArticulo = document.getElementById('imagenArticulo')
let imageURL
let imagesRef
let file
let addProductButton = document.getElementById('addProductButton')

imagenArticulo.addEventListener('change', (e) => {
    file = e.target.files[0]
    console.log(file.name);
    // Get a non-default Storage bucket
    const firebaseApp = getApp();
    const storage = getStorage(firebaseApp, "gs://bombshell-dcf3d.appspot.com"); 
    imagesRef = ref(storage, 'images/' + file.name)
    console.log(imagesRef.bucket);// 'file' viene del archivo seleccionado
})

addProductButton.addEventListener('click', async (e) => {
    e.preventDefault() 
    onAuthStateChanged(auth, async (user) => {
        if(user) {
            let nombreCliente = user.displayName
            let userAuthId = user.uid
            if(!nombreArticulo.value ||!imagenArticulo.value || !precioArticulo.value || !inventarioActual.value || !descripcionArticulo.value){
                showMessages('Todos los campos son obligatorios', 'no')
                return
            } else {
                try{
                    uploadBytes(imagesRef, file).then((snapshot) => {
                        console.log('Uploaded a blob or file!');
                        imageURL = getDownloadURL(snapshot.ref).then(  async (downloadURL) => {
                            const docRef = await addDoc(collection(db, 'productos'),{
                                nombreArticulo: nombreArticulo.value,
                                precioArticulo: precioArticulo.value,
                                inventarioActual: parseInt(inventarioActual.value),
                                descripcionArticulo: descripcionArticulo.value,
                                nombreCliente: nombreCliente,
                                userAuthId: userAuthId,
                                imageURL: downloadURL,
                            })

                            nombreArticulo.value = ''
                            precioArticulo.value = ''
                            inventarioActual.value = ''
                            descripcionArticulo.value = ''
                            imagenArticulo.value = ''
                            getProductos()
                        });
                        
                    });    
                    
                    showMessages('Prodcto agregado!')
                } catch(error){
                    console.log(error);
                }
            }
            
        } else {
            console.log('user is not logged')
        }
    })
})

