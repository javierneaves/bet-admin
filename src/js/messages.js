import { getFirestore, doc, getDoc, collection, getDocs, query, where, deleteDoc, orderBy, updateDoc, setDoc, limit, addDoc  } from '../firebase/firebaseJs.js'
import { app, auth } from '../firebase/config.js'
import { onAuthStateChanged, updateProfile } from '../firebase/firebaseAuth.js';

//import { messaging } from '../firebase/config.js';
import { getToken, onMessage } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-messaging.js'
const db = getFirestore(app) 

/*
function initializeFireBaseMessaging(){
    messaging
        .requestPermission()
        .then(function(){
            console.log('Notification Permission');
            return messaging.getToken()
        })
        .then(function(token){
            console.log('Token: '+token);
        })
        .catch(function(reason){
            console.log(reason);
        })
}

messaging.onMessage(function(payload){
    console.log(payload);
})

messaging.onTokenRefresh(function () {
    messaging.getToken()
        .then(function (newtoken) {
            console.log('New token: '+ newtoken);
        })
        .catch(function (reason){
            console.log(reason);
        })
})

initializeFireBaseMessaging()
*/
// Crear un array para almacenar los últimos registros por voltioId
let latestLeadNotes = [];
let voltioId
let leadName
let backToMessagesListBtn = document.getElementById('backToMessagesListBtn');
let listMessagesSection = document.getElementById('listMessagesSection');
let detailedMessagesSection = document.getElementById('detailedMessagesSection');
let searchLeadText = document.getElementById('searchLeadText');
let currentUserName
let currentUserEmail
let loading = document.getElementById('loading');
let userId
let latestLeadNotesArray
let subscriptionJson
let goToLeadDetailFromMessage = document.getElementById('goToLeadDetailFromMessage');
let projectsCheckbox = document.getElementById('projectsCheckbox');

projectsCheckbox.addEventListener('change', function (e) {
    if(e.target.checked){
        console.log('checked');
        getMessagesList('Project')
    } else {
        console.log('unchecked');
        getMessagesList('lead')
    }
});
// startLoading()

function startLoading(){
  loading.classList.remove("invisible");
}

function endLoading(){
  loading.classList.add("invisible");
}

onAuthStateChanged(auth, async(user) => {
    if (user) {
        // El usuario está autenticado

        currentUserName = user.displayName;
        userId = user.uid
        currentUserEmail = user.email
        getMessagesList('lead')
      } else {
        // El usuario no está autenticado
        console.log('No hay usuario autenticado');
      }
})

 
async function getMessagesList(project){
    latestLeadNotes = []
    // Crear una consulta para obtener los documentos ordenados por voltioId y fecha descendente
    const q = query(collection(db, 'leadData'), orderBy('voltioIdKey'), where('status', '==', project), where('project', '==', 'roofing'));

    // Obtener los documentos ordenados por voltioId y fecha descendente
    const querySnapshot = await getDocs(q);

    // Iterar sobre los documentos y guardar el último registro por voltioId en el objeto
    querySnapshot.forEach((doc) => {
        
    let data = doc.data();
    const voltioId = data.voltioIdKey;
    latestLeadNotes[voltioId] = data;
    data = ''
    });
    latestLeadNotesArray = ''
    // Convertir el objeto en u n array de los últimos registros
    latestLeadNotesArray = Object.values(latestLeadNotes);
    createListOfMessages(latestLeadNotesArray)
}

function createListOfMessages(latestLeadNotesArray){
    let messagesListContainer = document.getElementById('messagesListContainer');
    messagesListContainer.innerHTML = ''
    latestLeadNotesArray.forEach(function(item) {
        // Crear el elemento div
        const container = document.createElement("div");
        container.classList.add("container", "messageRow");
        container.dataset.id = item.voltioIdKey;
        container.dataset.name = item.customerName;
         
        // Crear el contenido del elemento
        const content = `
            <div class="row">
            <div class="col-12">
                <div class="row align-items-center border-bottom py-2 custom-button">
                    <div class="col-2">
                        <div class="circle">${item.voltioIdKey}</div>
                    </div>
                    <div class="col-10">
                        <p class="customerName p-4 ${item.status}">${item.customerName}</p>
                    </div>
                </div>
            </div>
            </div>
        `;
        
        // Asignar el contenido al elemento div
        container.innerHTML = content;
        
        // Agregar el elemento al DOM
        messagesListContainer.appendChild(container);
        
    });
    endLoading()

    let messageRow = document.querySelectorAll('.messageRow');
    
    messageRow.forEach(function(item) {
        item.addEventListener('click', function (e) {
            if (e.target.closest('.messageRow')) {
                voltioId = item.dataset.id
                leadName = item.dataset.name
                getDetailMessages()
                listMessagesSection.style.display = 'none'
                detailedMessagesSection.style.display = 'block'             
              }
        });
    });
    
    truncateWords()
    
}

async function getDetailMessages(){
    /* container.dataset.id = item.voltioId;
        container.dataset.name = item.leadName; 
    */
    let chatTitleLeadname = document.getElementById('chatTitleLeadname');
    let chatTitleVoltioId = document.getElementById('chatTitleVoltioId');
    chatTitleVoltioId.innerHTML = voltioId
    chatTitleLeadname.innerHTML = leadName
    goToLeadDetailFromMessage.setAttribute("name", voltioId);
    let messagesDetailContainer = document.getElementById('messagesDetailContainer')
    messagesDetailContainer.innerHTML = ''
    const collectionRef = collection(db, 'listOfleadNotes');
    const q = query(collectionRef, where('voltioId', '==', voltioId), orderBy('date', 'desc'));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
    const data = doc.data();
    const registerId = doc.id
    const { userName, customerComment, date, starred } = data;

    const chatElement = document.createElement('div');
    chatElement.classList.add('container');

    const rowElement = document.createElement('div');
    rowElement.classList.add('row');

    const colElement = document.createElement('div');
    colElement.classList.add('col-12');

    const contentElement = document.createElement('div');

    // ajusta la fecha y hora a formato visible
    const timestamp =  date ;
    const dateNew = new Date(timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000));
    
    let month = dateNew.getMonth() < 10 ? '0'+ (dateNew.getMonth() + 1): (dateNew.getMonth()+ 1)
    let day = dateNew.getDate() < 10 ? '0' + dateNew.getDate() : dateNew.getDate()
    let hours = dateNew.getHours() < 10 ? '0' + dateNew.getHours() : dateNew.getHours();
    let minutes = dateNew.getMinutes() < 10 ? '0' + dateNew.getMinutes() : dateNew.getMinutes();
    let seconds = dateNew.getSeconds() < 10 ? '0' + dateNew.getSeconds() : dateNew.getSeconds();

    const formattedDate = `${month}/${day}/${dateNew.getFullYear()} ${hours}:${minutes}:${seconds}`;
    

    if (userName !== currentUserName) {
        contentElement.classList.add('receiverMessageBox', 'chat', 'text-box', 'col-10', 'mb-2');
        contentElement.innerHTML = `
        <h5 class="chat-title receiverName">${userName}</h5>
        <p class="chat-message receiverMessage">${customerComment}</p>
        <p class="chat-date receiverDate mb-2">${formattedDate}</p>
            <label class="toggle-button-message">
            <input type="checkbox" class="toggle-input-message createTask"
            id='${registerId}'
            data-id= '${voltioId}' 
            data-name= '${leadName}'
            data-subtitle='Task created from messages'
            data-description='${customerComment}'
            data-duedate='${formattedDate}'
            data-assignedTo= '${currentUserEmail}'
            data-creationDate='${formattedDate}'
            data-taskStatus='To Do'
            data-createdBy= '${currentUserEmail}'
            data-starred='${registerId}'
            >
            <span class="star-icon">&#9734;</span>
            </label>
        `;
        
    } else {
        contentElement.classList.add('senderMessageBox', 'chat', 'col-10', 'offset-2', 'mb-2');
        contentElement.innerHTML = `
        <h5 class="chat-title senderName">${userName}</h5>
        <p class="chat-message senderMessage">${customerComment}</p>
        <p class="chat-date senderDate mb-2">${formattedDate}</p>
        <div class="senderDate">
            <label class="toggle-button-message">
            <input type="checkbox" class="toggle-input-message createTask"
            id='${registerId}'
            data-id= '${voltioId}' 
            data-name= '${leadName}'
            data-subtitle='Task created from messages'
            data-description='${customerComment}'
            data-duedate='${formattedDate}'
            data-assignedTo= '${currentUserEmail}'
            data-creationDate='${formattedDate}'
            data-taskStatus='To Do'
            data-createdBy= '${currentUserEmail}'
            data-starred='${registerId}'
            >
            <span class="star-icon">&#9734;</span>
            </label>
        </div>
        `;
         
    }

    colElement.appendChild(contentElement);
    rowElement.appendChild(colElement);
    chatElement.appendChild(rowElement);

    // Agregar el elemento creado al documento o contenedor deseado
    messagesDetailContainer.appendChild(chatElement);
    console.log(registerId);
    let registerIdTarget = document.getElementById(registerId);
    console.log(registerIdTarget);
    if (!registerId) {
        console.log('no starred');
    } else if(starred === 'yes'){
        console.log('starred');
        registerIdTarget.checked = true;
    }
    });
    
    let createTask = document.querySelectorAll('.createTask');
    createTask.forEach(function(item) {
        item.addEventListener('click', function (e) {
            const isChecked = e.target.checked
            if (e.target.checked) {
                console.log(e.target.dataset.description);
                let messageData={
                    "data-id": voltioId,
                    "data-name": leadName,
                    "data-subtitle": "Task created by message",
                    "data-description": e.target.dataset.description,
                    "data-duedate": new Date(),
                    "data-assignedTo": currentUserEmail,
                    "data-creationDate": new Date(),
                    "data-taskStatus": "To Do",
                    "data-createdBy": currentUserEmail,
                    "data-starred": e.target.dataset.starred,
                }
                updateStarredInfo(e.target.dataset.starred)
                addProjectTask(messageData)
                // se toman todos los dataset y se guardan en firebase, falta agregar el id de esa collection para borrar registro
                return
            } else {
                console.log('no checked');
                Swal.fire({
                    title: 'Do you want to delete this task?',
                    showDenyButton: true,
                    denyButtonText: 'Delete',
                    confirmButtonText: `Back`,
                  }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        Swal.fire('Changes are not saved', '', 'info')
                        e.target.checked = true;  
                    } else if (result.isDenied) {
                        deleteTaskByStarredValue(e.target.dataset.starred)
                        Swal.fire('Deleted!', '', 'success')
                    }
                  })
                
                
            }
            
        });
    });
    
}

async function updateStarredInfo(taskId){
    const taskRef = doc(db, 'listOfleadNotes', taskId);
    try {
      await updateDoc(taskRef, {
        "starred": 'yes'
      })
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Task created!',
        showConfirmButton: false,
        timer: 1500
      })
    } catch (error) {
      console.log(error);
    }
}

async function deleteTaskByStarredValue(starredValue) {
    const collectionRef = collection(db, 'projectTasks');
    const q = query(collectionRef, where('data-starred', '==', starredValue));
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref)
        .then(() => {
          console.log(`Documento eliminado: ${doc.id}`);
        })
        .catch((error) => {
          console.error('Error al eliminar el documento: ', error);
        });
    });
    const taskRef = doc(db, 'listOfleadNotes', starredValue);
    await updateDoc(taskRef, {
        "starred": 'no'
    })
  }


async function addProjectTask(messageData) {
    const projectTasksRef = collection(db, "projectTasks");
  
    const taskData = {
      
    };
  
    try {
      const docRef = await addDoc(projectTasksRef, messageData);
      console.log("Document added with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
}

function truncateWords(){
    const messagePreview = document.querySelectorAll('.messagePreview');
    messagePreview.forEach(function(item) {
        // body
        const words = item.textContent.trim().split(' ');
        const truncatedText = words.slice(0, 5).join(' ');
        if (words.length < 5) {
            item.textContent = truncatedText;    
        } else {
            item.textContent = truncatedText + '...';
        }
        
    });
    
}

backToMessagesListBtn.addEventListener('click', function (e) {
    listMessagesSection.style.display = 'block'
    listMessagesSection.classList.remove('d-none')
    detailedMessagesSection.style.display = 'none'     
});

let isFunctionRunning = false;

let sendMessageBotton = document.getElementById('sendMessageBotton');

sendMessageBotton.addEventListener('click', function (e) {
    if (!isFunctionRunning){
        isFunctionRunning = true;
        sendComment()
        setTimeout(function() {
            isFunctionRunning = false;
          }, 500);
    }
});

// const webPush = require("web-push")
function sendPushNotification(){
    
}


textBox.addEventListener('keydown', function (e) {
    if (e.key === 'Enter'){
        if (!isFunctionRunning){
            isFunctionRunning = true;
            sendComment()
            setTimeout(function() {
                isFunctionRunning = false;
              }, 500);
        }
    }
});

async function sendComment(){
    let date = new Date() 
    let textBox = document.getElementById('textBox'); 
    let message = textBox.value
    if(textBox.value != ""){
        await addDoc(collection(db, 'listOfleadNotes'), {
            voltioId: voltioId,
            customerComment: message,
            date: date,
            userName: currentUserName,
            userId: userId,
            leadName: leadName
        }).then( async() => {
            getDetailMessages()
            sendPushNotification(message, currentUserName)
        }).catch((error) => {
            Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: 'An error has occurred, please try again. ' + error,
                showConfirmButton: false,
                timer: 1500
              })
              return
        })       

        textBox.value = ""
    } else{
        return
    }
}

searchLeadText.addEventListener('input', filterListName);

function filterListName(){
    const filterText = searchLeadText.value.toUpperCase()
    const filteredArray = latestLeadNotesArray.filter(item => {
        const leadName = item.customerName.toUpperCase()
        return leadName.includes(filterText)
    })
    createListOfMessages(filteredArray)
}
