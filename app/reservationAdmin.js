import { getFirestore, doc, getDoc, collection, getDocs, query, where, deleteDoc, orderBy, updateDoc  } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"
import { app } from './firebase.js'
const db = getFirestore(app) 
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { auth } from './firebase.js'

let nombreEstilista = document.getElementById('nombreEstilista');
let fechaHoraAsistencia = document.getElementById('fechaHoraAsistencia');
let entradaSalida = document.getElementById('entradaSalida');
let detallesDelSuceso = document.getElementById('detallesDelSuceso');
let imagenSuceso = document.getElementById('imagenSuceso');
let guardarEvento = document.getElementById('guardarEvento'); // boton de guardar
let buscarEstilista = document.getElementById('buscarEstilista');
let tableContent = document.getElementById('tableContent');


function setTableData(){
  
}








let orderByDateButton = document.querySelector('#orderByDateButton')
let viewCompleted = document.querySelector('#viewCompleted')

orderByDateButton.addEventListener('click', (e)=>{
  if(e.target.dataset.stat === 'asc'){
    let stat = 'asc'
    getReservas(e.target.dataset.stat, viewCompleted.value)
    e.target.dataset.stat = 'desc'
  } else if(e.target.dataset.stat === 'desc'){
    let stat = 'asc'
    getReservas(e.target.dataset.stat, viewCompleted.value)
    e.target.dataset.stat = 'asc'
  }
  
})

viewCompleted.addEventListener('change', (e)=>{
  if(e.target.value === 'proceso'){
    getReservas('asc', e.target.value)
  } else if(e.target.value === 'completada'){
    getReservas('asc', e.target.value)
  }
  
})

export function getReservas(stat, estatus){
  let reservasContainer = document.getElementById('reservasContainer')
  reservasContainer.innerHTML = ''
onAuthStateChanged(auth, async (user) => {
  if (user) {
    
    let orderByStat = stat
    console.log('estatus' +estatus);
    console.log('start' + stat);
    const reserva = query(collection(db, 'reservaciones'), where('estatus', '==', estatus), orderBy("start", stat));
    //query(collection(db, 'reservaciones'), where('email', '==', user.email));
    const querySnapshot = await getDocs(reserva);
    const allData = querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
      //console.log(doc.id, ' => ', doc.data());
      let cobrado = !doc.data().totalCobrado ? '' : doc.data().totalCobrado
      console.log(doc.data());
      let today = new Date()
      let newDate = new Date(doc.data().start)
      /*if(today>newDate){
        return
      }*/
      let months = ["enero", "febrero", "marzo", 'abril', "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
      let month = months[newDate.getMonth()] 
      let hours = newDate.getHours() < 10 ?  '0'+ newDate.getHours() : newDate.getHours()
      let minutes = newDate.getMinutes() < 10 ?  '0'+ newDate.getMinutes() : newDate.getMinutes()
      let date = newDate.getDate() + ' de ' + month + ' del ' + newDate.getFullYear() + ' ' + hours+':'+minutes+' hrs'
      let services = doc.data().services;
      // try {services.forEach(e => console.log(e))} catch(error){console.log(error);}
      
        //for(i=0, i < doc.data().services.length(), i++){
        // services.push(...doc.data().services)
      // }
      let mainDiv = document.getElementById('reservasContainer')
      let divContainer = document.createElement('div')
      let divCard = document.createElement('div')
      let divCardHeader = document.createElement('div')
      let h4Date = document.createElement('h4')
      let divCardBoddy = document.createElement('div')
      let h4CustomerName = document.createElement('h4')
      let pServicios = document.createElement('p')
      let divPrecioInicial = document.createElement('div')
      let divFormSelect = document.createElement('div')
      let selectAssignedName = document.createElement('select')
      let optionEmpty = document.createElement('option')
      let optionEmployee1 = document.createElement('option')
      let optionEmployee2 = document.createElement('option')
      let labelAssignedName = document.createElement('label')
      let divFormTotalCobrado = document.createElement('div')
      let inputTotalCobrado = document.createElement('input')
      let labelTotalCobrado = document.createElement('label')
      let divFormDesc = document.createElement('div')
      let inputDesc = document.createElement('input')
      let labelDesc = document.createElement('label')
      let divFormObservac = document.createElement('div')
      let textAreaObservac = document.createElement('textarea')
      let labelObservac = document.createElement('label')
      let divCardFooter = document.createElement('div')
      let divMenuDropdown = document.createElement('div')
      let buttonMenu = document.createElement('button')
      let ulDropdownMenu = document.createElement('ul')
      let liEditar = document.createElement('li')
      let liCancelar = document.createElement('li')
      let liReAgendar = document.createElement('li')
      let liCompletada = document.createElement('li')
      let btnCancelar = document.createElement('button')
      let btnReAgendar = document.createElement('button')
      let btnCompletada = document.createElement('button')

      divContainer.className = 'col'
      divCard.className = 'card shadow col h-100'
      divCardHeader.className = 'card-header'
      h4Date.className = 'fw-bold text-center'
      h4Date.textContent = date
      divCardBoddy.className = 'card-boddy p-2'
      h4CustomerName.className = 'fw-bold text-center'
      h4CustomerName.textContent = doc.data().title
      pServicios.className = 'text-center'
      pServicios.textContent = services
      divPrecioInicial.className = 'h5 p-2 fw-bolder text-end'
      divPrecioInicial.textContent = 'Precio Inicial: $ 500.00'
      divFormSelect.className = 'form-floating mb-2'
      selectAssignedName.className = 'form-select text-end persona'
      selectAssignedName.dataset.reservationId = doc.id
      optionEmployee1.textContent = 'Brenda'
      optionEmployee2.textContent = 'Ana'
      labelAssignedName.textContent = 'Asignado a:'
      divFormTotalCobrado.className = 'form-floating mb-2'
      inputTotalCobrado.className = 'form-control text-end totalCobrado'
      inputTotalCobrado.type = 'number'
      inputTotalCobrado.name = 'price'
      inputTotalCobrado.value = !doc.data().totalCobrado ? '' : doc.data().totalCobrado
      inputTotalCobrado.dataset.reservationId = doc.id
      labelTotalCobrado.textContent = 'Total cobrado'
      divFormDesc.className = 'form-floating mb-2'
      inputDesc.dataset.reservationId = doc.id
      inputDesc.className = 'form-control text-end codigoDescuento'
      inputDesc.type = 'text'
      inputDesc.name = 'descuento'
      inputDesc.value = !doc.data().codigoDescuento ? '' : doc.data().codigoDescuento
      labelDesc.textContent = 'Codigo de descuento'
      divFormObservac.className = 'form-floating mb-2'
      textAreaObservac.className = 'form-control observaciones'
      textAreaObservac.value = !doc.data().observaciones ? '' : doc.data().observaciones
      textAreaObservac.dataset.reservationId = doc.id
      textAreaObservac.style.height = '200px'
      textAreaObservac.textContent = 'Esta es la descripcion del servicio a realizar'
      labelObservac.textContent = 'Observaciones'
      divCardFooter.className = 'card-footer mt-auto py-3'
      divMenuDropdown.className = 'dropdown'
      buttonMenu.className = 'btn btn-primary dropdown-toggle'
      buttonMenu.type = 'button'
      buttonMenu.setAttribute("data-bs-toggle", "dropdown");
      buttonMenu.dataBsToggle="dropdown"
      buttonMenu.textContent="Acciones"
      ulDropdownMenu.className = 'dropdown-menu'
      liEditar
      liCancelar
      liReAgendar
      liCompletada
      btnCancelar.className = 'dropdown-item btnCancelarReserva'
      btnCancelar.type = 'button'
      btnCancelar.textContent = 'Cancelar'
      btnCancelar.dataset.startDate = doc.id
      btnReAgendar.className = 'dropdown-item'
      btnReAgendar.type = 'button'
      btnReAgendar.textContent = 'Re Agendar'
      btnCompletada.className = 'dropdown-item btnCompletada'
      btnCompletada.style.display = !doc.data().totalCobrado ? 'none' : 'block'
      btnCompletada.id = doc.id
      btnCompletada.type = 'button'
      btnCompletada.textContent = 'Completada'
      btnCompletada.dataset.reservationId = doc.id
      

      mainDiv.appendChild(divContainer)
      divContainer.appendChild(divCard)
      divCard.appendChild(divCardHeader)
      divCard.appendChild(divCardBoddy)
      divCard.appendChild(divCardFooter)
      divCardHeader.append(h4Date)
      divCardBoddy.append(h4CustomerName)
      divCardBoddy.append(pServicios)
      divCardBoddy.append(divPrecioInicial)
      divCardBoddy.append(divFormSelect)
      divCardBoddy.append(divFormTotalCobrado)
      divCardBoddy.append(divFormDesc)
      divCardBoddy.append(divFormObservac)
      divFormSelect.appendChild(selectAssignedName)
      selectAssignedName.append(optionEmpty)
      selectAssignedName.append(optionEmployee1)
      selectAssignedName.append(optionEmployee2)
      divFormSelect.appendChild(selectAssignedName)
      divFormTotalCobrado.appendChild(inputTotalCobrado)
      divFormTotalCobrado.appendChild(labelTotalCobrado)
      divFormDesc.appendChild(inputDesc)
      divFormDesc.appendChild(labelDesc)
      divFormObservac.appendChild(textAreaObservac)
      divFormObservac.appendChild(labelObservac)
      
      if(doc.data().estatus != 'completada'){
        divCardFooter.append(divMenuDropdown)
        divMenuDropdown.append(buttonMenu)
        divMenuDropdown.append(ulDropdownMenu)
        ulDropdownMenu.appendChild(liEditar)
        ulDropdownMenu.appendChild(liCancelar)
        ulDropdownMenu.appendChild(liReAgendar)
        ulDropdownMenu.appendChild(liCompletada)
        liCompletada.appendChild(btnCompletada)
        liCancelar.appendChild(btnCancelar)
        //liReAgendar.appendChild(btnReAgendar)
      } else{
        selectAssignedName.setAttribute('disabled', true);
        inputTotalCobrado.setAttribute('disabled', true);
        inputDesc.setAttribute('disabled', true);
        textAreaObservac.setAttribute('disabled', true);
        divCardFooter.textContent = 'Completada'
      }
      

      selectAssignedName.value = doc.data().empleado
      return cobrado
      
    })
  // Funcion al event listener de actualizar drop down --------------------
    let persona = document.querySelectorAll('.persona')
    let totalCobrado = document.querySelectorAll('.totalCobrado')
    let codigoDescuento = document.querySelectorAll('.codigoDescuento')
    let observaciones = document.querySelectorAll('.observaciones')
    let btnCompletada = document.querySelectorAll('.btnCompletada')
    let btnCancelarReserva = document.querySelectorAll('.btnCancelarReserva')

    persona.forEach( btn => {
      btn.addEventListener('change', async(e)=>{
        let reservationId = e.target.dataset.reservationId
        const docRef = doc(db, "reservaciones", reservationId) 
        await updateDoc ((docRef), {
          empleado: btn.value
        })
        .then(() => {
          // Data saved successfully!
          console.log('actualizado');
        })
        .catch((error) => {
          // The write failed...
          console.log('no actualizado');
        });
      })
    })
    
    totalCobrado.forEach( btn => {
      btn.addEventListener('blur', async(e)=>{
        let reservationId = e.target.dataset.reservationId
        let noPrice = e.target.value
        if (noPrice === ''){
          console.log('precio vacio');
        } else {
          let btnCompletadaSingle = document.getElementById(reservationId)
          btnCompletadaSingle.style.display = 'block'
          console.log(reservationId);
          const docRef = doc(db, "reservaciones", reservationId) 
          await updateDoc ((docRef), {
            totalCobrado: btn.value
          })
          .then(() => {
            // Data saved successfully!
            console.log('actualizado');
          })
          .catch((error) => {
            // The write failed...
            console.log('no actualizado');
          });
        }
        
      })
    })

    codigoDescuento.forEach( btn => {
      btn.addEventListener('blur', async(e)=>{
        let reservationId = e.target.dataset.reservationId
        console.log(reservationId);
        const docRef = doc(db, "reservaciones", reservationId) 
        await updateDoc ((docRef), {
          codigoDescuento: btn.value
        })
        .then(() => {
          // Data saved successfully!
          console.log('actualizado');
        })
        .catch((error) => {
          // The write failed...
          console.log('no actualizado');
        });
      })
    })

    observaciones.forEach( btn => {
      btn.addEventListener('blur', async(e)=>{
        let reservationId = e.target.dataset.reservationId
        console.log(reservationId);
        const docRef = doc(db, "reservaciones", reservationId) 
        await updateDoc ((docRef), {
          observaciones: btn.value
        })
        .then(() => {
          // Data saved successfully!
          console.log('actualizado');
        })
        .catch((error) => {
          // The write failed...
          console.log('no actualizado');
        });
      })
    })

    btnCancelarReserva.forEach( btn  => {
      btn.addEventListener('click', async (e) => {
        Swal.fire({
          title: 'Desea cancelar la reservación?',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Regresar',
          denyButtonText: `Cancelar reserva`,
        }).then(async(result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            Swal.fire({
              text:'La reserva no se ha cancelado',
              icon: 'info',  
              timer: 2000,
              showConfirmButton: false,
              position: 'top-end',
            })
          } else if (result.isDenied) {
            
            let startDate = e.target.dataset.startDate
            //const reservation = query(collection(db, 'reservaciones'), where('start', '==', e.target.dataset.startDate));
            //const querySnapshot = await getDocs(reservation);
            const docRef = doc(db, "reservaciones", startDate) 
            await deleteDoc(docRef);
            getReservas(stat)
            Swal.fire({
              text:'Reserva cancelada',
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

    btnCompletada.forEach( btn  => {
      btn.addEventListener('click', async (e) => {
        Swal.fire({
          title: 'Desea marcar como completada la reservación?',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Completada',
          denyButtonText: `Regresar`,
        }).then(async(result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            let reservationId = e.target.dataset.reservationId
            const docRef = doc(db, "reservaciones", reservationId) 
            await updateDoc ((docRef), {
              estatus: 'completada'
            }).then(()=>{
              getReservas('asc', 'proceso')
              Swal.fire({
                text:'Reserva actualizada',
                icon:'success',
                timer: 2000,
                showConfirmButton: false,
                position: 'bottom-end',
              })
              return
            }).catch((error) => {
              // The write failed...
              console.log('no actualizado');
            });
            
          } else if (result.isDenied) {
            Swal.fire({
              text:'La reserva no se ha actualizado',
              icon: 'info',  
              timer: 2000,
              showConfirmButton: false,
              position: 'top-end',
            })
          }
        })
        
      })
    })




} else {
  console.log('no user logged on reservation admin');
}
});
}


    
  
