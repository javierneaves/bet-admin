import { getFirestore, doc, getDoc, collection, getDocs, query, where, deleteDoc, orderBy, updateDoc  } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"
import { app } from './firebase.js'
const db = getFirestore(app) 
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { auth } from './firebase.js'

let viewContacted = document.querySelector('#viewContacted')

viewContacted.addEventListener('change', (e) =>{
    if(e.target.value === 'porContactar'){
        getContactos('asc', e.target.value)
      } else if(e.target.value === 'contactada'){
        getContactos('asc', e.target.value)
      }
})

export function getContactos(order, estatus){
    let contactoContainer = document.querySelector('#contactoContainer')
    contactoContainer.innerHTML = ''

    onAuthStateChanged(auth, async (user) => {
        if(user){
            const comentariosBd = query(collection(db, 'contacto'), where('estatus', '==', estatus), orderBy("fecha", order));
            const querySnapshot = await getDocs(comentariosBd);
            const allData = querySnapshot.forEach((doc) => {
                let newDate = new Date(doc.data().fecha)
                let hours = newDate.getHours() < 10 ?  '0'+ newDate.getHours() : newDate.getHours()
                let minutes = newDate.getMinutes() < 10 ?  '0'+ newDate.getMinutes() : newDate.getMinutes()
                let date = newDate.getDate() + '/' + newDate.getMonth() + '/' + newDate.getFullYear() + ' ' + hours+':'+minutes+' hrs'
                
                let mainDiv = document.getElementById('contactoContainer')
                let divContainer = document.createElement('div')
                let divCard = document.createElement('div')
                let divCardHeader = document.createElement('div')
                let h4ContactName = document.createElement('h4')
                let divCardBoddy = document.createElement('div')
                let divEmail = document.createElement('div')
                let divTitle = document.createElement('div')
                let divMessage = document.createElement('div')
                let divDate = document.createElement('div')
                let divObservacionesContainer = document.createElement('div')
                let textareaObservaciones = document.createElement('textarea')
                let labelObservaciones = document.createElement('label')
                let divCardFooter = document.createElement('div')
                let divFooterButtonsContainer = document.createElement('div')
                let btnCompletado = document.createElement('button')
                let btnGuardar = document.createElement('button')

                divContainer.className = 'col'
                divCard.className = 'card shadow col h-100 m-2'
                divCardHeader.className = 'card-header'
                h4ContactName.className = 'fw-bold text-center'
                divCardBoddy.className = 'card-boddy p-1'
                divEmail.className = 'text-center p-1'
                divTitle.className = 'text-left fw-bold p-1'
                divMessage.className = 'text-left p-1'
                divDate.className = 'text-center p-1'
                divObservacionesContainer.className = 'form-floating mb-2'
                textareaObservaciones.className = 'form-control observaciones'
                textareaObservaciones.style.height = '100px'
                labelObservaciones.textContent = 'Observaciones'
                textareaObservaciones.dataset.commentsId = doc.id
                divCardFooter.className = 'card-footer mt-auto py-3'
                divFooterButtonsContainer.className = 'container text-center gx-5'
                btnCompletado.className = 'btn btn-success m-2 btnMarcarCompletada'
                btnCompletado.type = 'button'
                btnCompletado.textContent = 'Marcar como contactada'
                btnCompletado.dataset.commentsId = doc.id
                

                h4ContactName.textContent = doc.data().Nombre
                divEmail.textContent = doc.data().email
                divTitle.textContent = doc.data().asunto
                divMessage.textContent = doc.data().mensaje
                divDate.textContent = doc.data().fecha
                textareaObservaciones.value = !doc.data().newComments ? '' : doc.data().newComments

                mainDiv.appendChild(divContainer)
                divContainer.appendChild(divCard)
                divCard.appendChild(divCardHeader)
                divCard.appendChild(divCardBoddy)
                divCard.appendChild(divCardFooter)
                divCardHeader.append(h4ContactName)
                divCardBoddy.append(divEmail)
                divCardBoddy.append(divTitle)
                divCardBoddy.append(divMessage)
                divCardBoddy.append(divDate)
                divCardBoddy.append(divObservacionesContainer)
                divObservacionesContainer.appendChild(textareaObservaciones)
                divObservacionesContainer.appendChild(labelObservaciones)
                divCardFooter.append(divFooterButtonsContainer)
                divFooterButtonsContainer.append(btnCompletado)
    

            })

            let btnMarcarCompletada = document.querySelectorAll('.btnMarcarCompletada')
            let guardarObservaciones = document.querySelectorAll('.observaciones')

            btnMarcarCompletada.forEach( btn => {
                btn.addEventListener('click', async(e) =>{
                    let commentId = e.target.dataset.commentsId
                    const docRef = doc(db, 'contacto', commentId)
                    await updateDoc((docRef),{
                        estatus: 'contactada'
                    }).then( () => {
                        Swal.fire({
                            text:'Completada',
                            icon:'success',
                            timer: 2000,
                            showConfirmButton: false,
                            position: 'bottom-end',
                        })
                        getContactos('asc', 'porContactar')
                    })
                })
            })

            guardarObservaciones.forEach( btn => {
                btn.addEventListener('blur', async(e) =>{
                    let commentId = e.target.dataset.commentsId
                    const docRef = doc(db, 'contacto', commentId)
                    await updateDoc((docRef),{
                        newComments: btn.value
                    }).then( () => {
                        Swal.fire({
                            text:'Comentario guardado',
                            icon:'success',
                            timer: 2000,
                            showConfirmButton: false,
                            position: 'bottom-end',
                        })
                    })
                })
            })

        } else {
            console.log('no user on comments Admin');
        }
    })
}

/*
<div class="col">                                           // divContainer
    <div class="card shadow col h-100">                     // divCard
        <div class="card-header">                           // divCardHeader
            <h4 class="fw-bold text-center"></h4> // h4ContactName
        </div>
        <div class="card-boddy p-1">                        // divCardBoddy
            <div class="text-center p-1">rodrigoneaves@gmail.com</div> //divEmail
            <div class="text-left fw-bold p-1">Mensaje de prueba</div> // divTitle
            <div class="text-left p-1"></div>                           // divMessage
            <div class="text-center p-1">28/12/2022</div>               // divDate
            <div class="form-floating mb-2">                            // divObservacionesContainer
                <textarea class="form-control observaciones" style="height: 100px;"> //textareaObservaciones
                </textarea>
                <label>Observaciones</label>                                // labelObservaciones
            </div>
            
        </div>
        <div class="card-footer mt-auto py-3">                      // divCardFooter
        <div class="container text-center">                         // divFooterButtonsContainer
                <button class="btn btn-success p-2 btnMarcarCompletada" type="button">Marcar como contactada</button> //btnCompletado
                <button class="btn btn-primary p-2 btnGuardarComentario" type="button">Guardar comentarios</button>     // btnGuardar
        </div>
        </div>
    </div>
</div>
*/