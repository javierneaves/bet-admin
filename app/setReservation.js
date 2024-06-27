import { auth } from './firebase.js'
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"
import { app } from './firebase.js'
import { showMessages } from './showMessages.js'

// Initialize Firebase
const db = getFirestore(app) 
const reservationButton = document.getElementById('reservationButton')

reservationButton.addEventListener('click', async (e) =>{

    e.preventDefault()
    
    console.log(e.target.dataset.reservationDate) 
    
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log('usuario logueado setReservation');
            let nombreCliente = user.displayName == null ? user.email : user.displayName
            let email = user.email
            let userAuthId = user.uid
            let reserveDate = document.getElementById('start').textContent
            let reservationText = document.querySelector('#reservationText')
            
            let serviceCheck = document.querySelectorAll('.serviceCheck')
                  
              let services = []
              serviceCheck.forEach( function(element) {
                try{
                  if(element.checked){
                    services.push(element.attributes[4].value )
                  }
                  
                } catch(error){
                  console.log(error);
                }})   
                
            try {
                const docRef = await addDoc(collection(db, "reservaciones"), {
                  title: nombreCliente,
                  email: email,
                  userAuth: userAuthId,
                  start: e.target.dataset.reservationDate,
                  endTime: parseFloat(e.target.dataset.reservationEndtHour),
                  reservationStartHour: parseFloat(e.target.dataset.reservationStartHour),
                  reservationDateDay: e.target.dataset.reservationDateDay,
                  services: reservationText.innerHTML,
                  estatus: 'proceso'
                  
                });

                console.log("Document written with ID: ", docRef.id);
                document.location.reload(true)
                // refresh calendar
                var calendarEl = document.getElementById('calendar');
                var calendar = new FullCalendar.Calendar(calendarEl)
                calendar.refetchEvents(),
                calendar.render();
                showMessages('Tu cita ha sido creada')
              //  userId = docRef.id
              } catch (e) {
                console.error("Error adding document: ", e);
          
              }
    
        } else {
            
            console.log('user is not logged')
        }
        });
    
})



    