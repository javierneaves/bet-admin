import { auth } from './firebase.js'
import { showMessages } from './showMessages.js'
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"
import { getStorage , ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js"
import { getApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { app } from './firebase.js'
import { getProductos } from './productAdminGetList.js'


const db = getFirestore(app) 

let asistenciaSection = document.getElementById('asistenciaSection');
let nombreEstilista = document.getElementById('nombreEstilista');
let fechaHoraEntrada = document.getElementById('fechaHoraEntrada');
let fechaHoraSalida = document.getElementById('fechaHoraSalida');
let detallesDelSuceso = document.getElementById('detallesDelSuceso');
let imagenSuceso = document.getElementById('imagenSuceso');
// seccion de buscar estilista
let buscarEstilista = document.getElementById('buscarEstilista');
// boton para guardar asistencia
let guardarEvento = document.getElementById('guardarEvento');
let eventData = []
let asistenciaId
let dbId
let dataId // guarda el id de la bd registroAsistencia para usarlo en imagenesAsistencia, despues de dar click al row y abrir el modal

guardarEvento.addEventListener('click', async function (e) {

    eventData = [
        nombreEstilista.value,
        fechaHoraEntrada.value,
        fechaHoraSalida.value,
        detallesDelSuceso.value
    ]

    try {

        const docRef = await addDoc(collection(db, 'registroAsistencia'), {
            nombreEstilista: nombreEstilista.value,
            fechaHoraEntrada: fechaHoraEntrada.value,
            fechaHoraSalida: fechaHoraSalida.value,
            detallesDelSuceso: detallesDelSuceso.value
        })

        dbId = docRef.id
        console.log("Document written with ID: ", docRef.id);
        appendRowToTable()
        
      } catch (error) {
        console.error('Error al guardar los datos:', error);
      }
    
});

// START SECTION TO UPLOAD IMAGES
// folder de imagenes 1d0BNUODkxWoQWDnYEjJ32vUyJ9opmROi
// https://docs.google.com/spreadsheets/d/18OB60J-mGNK0TDWMflpHoi1utKpXpsT8dMn1KD6Vxr8/edit#gid=0

imagenSuceso.addEventListener('change', function (e) {
  // Inicia el sweet alert 
  const progressAlert = Swal.fire({
    title: 'loading file...',
    html: '<div class="progress"><div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>',
    showCancelButton: false,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false
  });
  // termina el sweet alert

  console.log('customer files upload chganged');
  let url = "https://script.google.com/macros/s/AKfycbywfFmRp00P7vFhQWgvr3k8fVwcEGIAB4GucWkM44Zxu78eB93jPxlTNcPD0KpIHb8/exec"
  console.log('file change');
  let fr = new FileReader()
  fr.addEventListener('loadend', function (e) {
    let res = fr.result
    
    let spt = res.split('base64,')[1]
    console.log(imagenSuceso.files[0].type);
    let obj = {
      base64:spt,
      type:imagenSuceso.files[0].type,
      name:"imagenes"
    }
    console.log(obj);
    let response =  fetch(url, {
        method:'POST',
        body: JSON.stringify(obj),
      })
    .then(r=>r.text())
    .then(data => {
      console.log(data);
      try {
        const response = JSON.parse(data);
        console.log(response.link);
         
        saveToUtilityBillCollection(response.link)
        // Cerrar el Sweet Alert
        progressAlert.close();
        // Mostrar una alerta de éxito
        Swal.fire({
          icon: 'success',
          title: 'File loaded',
          text: `The file has been loaded`,
          confirmButtonText: 'OK'
        });
      } catch (e) {
        console.error("Error al analizar la respuesta JSON: ", e);
      }
    })
    .catch(err => {
      console.error("Error en la solicitud POST: ", err);
    });
  });
  fr.readAsDataURL(imagenSuceso.files[0])
});

async function saveToUtilityBillCollection(link) {
  try {

    const docRef = await addDoc(collection(db, 'imagenesAsistencia'), {
      asistenciaId: dataId,
      link: link,
      timestamp: new Date().toISOString()
    }).then(getImagesFromUtilityBillCollection())

  } catch (error) {
    console.error('Error al guardar los datos:', error);
  }
}

/*let viewCustomersImageButton = document.getElementById('viewCustomersImageButton');

viewCustomersImageButton.addEventListener('click', function (e) {
  getImagesFromUtilityBillCollection()
});
*/
async function getImagesFromUtilityBillCollection(){
  const billsCol = collection(db, 'imagenesAsistencia');
  const q = query(billsCol, where('asistenciaId', '==', dataId));
  const querySnapshot = await getDocs(q);
  const bills = querySnapshot.docs.map((doc) => doc.data());
  //generateUtilityBillImagesHTML(bills)
  const thumbnailElements = bills.map((thumbnail) => generateThumbnail(thumbnail.link, thumbnail.dataId));
  insertThumbnails(thumbnailElements);
  
}

function generateUtilityBillImagesHTML(array) {
  const container = document.getElementById('utilityBillImagesContainer');
  container.innerHTML = ""
  array.forEach(item => {
    const div = document.createElement('div');
    div.className = 'col-sm-6 col-md-3';
    
    const thumbnail = document.createElement('div');
    thumbnail.className = 'thumbnail';
    
    const img = document.createElement('img');
    img.src = item.link;
    img.alt = item.voltioId;
    img.className = 'img-thumbnail mb-2';
    img.addEventListener("click", () => {
      window.open(item.link);
    });
    thumbnail.appendChild(img);
    div.appendChild(thumbnail);
    
    container.appendChild(div);
  });
}

function generateThumbnail(link) {
  const thumbnailDiv = document.createElement('div');
  thumbnailDiv.classList.add('col-sm-6', 'col-md-3');

  const thumbnail = document.createElement('div');
  thumbnail.classList.add('thumbnail');

  const image = document.createElement('img');
  image.classList.add('img-thumbnail', 'mb-2');
  image.src = link;
  image.alt = dataId;

  const closeButton = document.createElement('button');
  closeButton.classList.add('close');
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', () => thumbnailDiv.remove());

  thumbnail.appendChild(image);
  //thumbnail.appendChild(closeButton);
  thumbnailDiv.appendChild(thumbnail);

  image.addEventListener('click', () => window.open(link, '_blank'));

  return thumbnailDiv;
}

function insertThumbnails(thumbnails) {
  const container = document.getElementById('imagenesDeAsistencia');
  const imagenSuceso = document.getElementById('imagenSuceso');
  imagenSuceso.value = ''
  container.innerHTML = ''
  thumbnails.forEach((thumbnail) => container.appendChild(thumbnail));
}
// END OF UPLOAD IMAGE SECTION

let addRowWithJs = document.getElementById('addRowWithJs');
addRowWithJs.addEventListener('click', function (e) {
    appendRowToTable()
});

function appendRowToTable() {
    // Crear un nuevo elemento <tr>
    const newRow = document.createElement('tr');
    
    // Agregar atributos al elemento <tr>
    newRow.setAttribute('data-bs-toggle', 'modal');
    newRow.setAttribute('data-bs-target', '#detalleDeAsistenciaModal');
    newRow.dataset.id = dbId
    newRow.dataset.comments = eventData[4]
    newRow.classList.add('asistenciaRow')
    // Crear y configurar elementos <th> y <td>
    const th = document.createElement('th');
    th.className = '';
    th.textContent = eventData[0];
  
    const td1 = document.createElement('td');
    td1.className = '';
    td1.textContent = eventData[1];
  
    const td2 = document.createElement('td');
    td2.className = '';
    td2.textContent = eventData[2];
  
    const td3 = document.createElement('td');
    td3.className = '';
    td3.textContent = eventData[3];
  
    const td4 = document.createElement('td');
    td4.className = '';
    td4.textContent = eventData[4];
  
    // Agregar elementos <th> y <td> al elemento <tr>
    newRow.appendChild(th);
    newRow.appendChild(td1);
    newRow.appendChild(td2);
    newRow.appendChild(td3);
    newRow.appendChild(td4);
  
    // Obtener la tabla por su id y agregar la nueva fila
    const table = document.getElementById('tableContent');
    table.appendChild(newRow);
    openModalWithData()
  }

  function openModalWithData(){
    
    let asistenciaRow = document.querySelectorAll('.asistenciaRow');
    asistenciaRow.forEach(function(item) {
      item.addEventListener('click', () => {
        dataId = item.getAttribute('data-id');
        const comments = item.getAttribute('data-comments');
        let comentariosModal = document.getElementById('comentariosModal');
        comentariosModal.value = comments
        console.log('Data-ID del elemento clickeado:', dataId);
        // se abre el modal y debe cargar las imagenes que corresponden a ese dataId
        // se deben ver los comentarios 

      });
    });

  }