import { auth } from './firebase.js'
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"
import { app } from './firebase.js'
import { showMessages } from './showMessages.js'

// Initialize Firebase
const db = getFirestore(app) 
const contactButton = document.getElementById('contactoButton')
console.log('access contacto page');
let name = document.getElementById('name')
let email = document.getElementById('email')
let subject = document.getElementById('subject')
let message = document.getElementById('message')

onAuthStateChanged(auth, async (user) => {
    if (user) {
        name.value = user.displayName
        email.value = user.email
    } else {
        return
    }
})

contactButton.addEventListener('click', async (e) =>{
    e.preventDefault()
    try {
        if(!name.value || !email.value || !subject.value || !message.value){
            showMessages('Todos los campos son requeridos', 'error')
            return
        } else {
            let newDate = new Date()
            let hours = newDate.getHours() < 10 ?  '0'+ newDate.getHours() : newDate.getHours()
            let minutes = newDate.getMinutes() < 10 ?  '0'+ newDate.getMinutes() : newDate.getMinutes()
            let date = newDate.getDate() + '/' + newDate.getMonth() + '/' + newDate.getFullYear() + ' ' + hours+':'+minutes+' hrs'
            const docRef = await addDoc(collection(db, "contacto"),{
                Nombre: name.value,
                asunto: subject.value,
                email: email.value,
                mensaje: message.value,
                fecha: date,
                estatus: 'porContactar'
            })
            showMessages('Mensaje enviado')
            name.value = ''
            email.value = ''
            subject.value = ''
            message.value = ''
        }
        
    } catch (error){
        console.log(error);
    }
})