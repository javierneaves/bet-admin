import { getFirestore, doc, getDoc, collection, getDocs, query, where, deleteDoc, orderBy, updateDoc, setDoc, addDoc, Timestamp  } from '../firebase/firebaseJs.js'
import { app, auth } from '../firebase/config.js'
import { onAuthStateChanged, updateProfile } from '../firebase/firebaseAuth.js';

const db = getFirestore(app) 
let taskTitleInput = document.getElementById('taskTitleInput');
let taskSubtitleInput = document.getElementById('taskSubtitleInput');
let taskDueDateInput = document.getElementById('taskDueDateInput');
let saveTaskModal = document.getElementById('saveTaskModal');
let taskVoltioIdInput = document.getElementById('taskVoltioIdInput');
let taskDescriptionInput = document.getElementById('taskDescriptionInput');
let taskAssignedTo = document.getElementById('taskAssignedTo');
let taskStatus = document.getElementById('taskStatus');
let userLogged
let viewAllTasksButton = document.getElementById('viewAllTasksButton');
let viewMyTasksButton = document.getElementById('viewMyTasksButton');
let userManager
let userRol
let managerUsers = []
onAuthStateChanged(auth, async(user)=>{
    if(user){
      userLogged = user.email
      const docRef = doc(db, "userProfile", user.email);
      const docSnap = await getDoc(docRef);
      userRol = docSnap.data().accessLevel      
      userManager = docSnap.data().manager
      console.log(userRol, userManager);      
      // seccion para obtener el listado de usaurios depende del manager
      const managerListOfUsers = collection(db, "userProfile");
      userManager = 'neaves@voltio.us'
      const qManager = query(managerListOfUsers, where("manager", "==", userManager));
      const querySnapshot = await getDocs(qManager);
      querySnapshot.forEach((doc) => {
        console.log(doc.id);
      });
    }else{
        'no user logged'
    }
})

viewAllTasksButton.addEventListener('click', function (e) {
  fetchAssignedTasks(userLogged, 'allTasks')
});

viewMyTasksButton.addEventListener('click', function (e) {
  fetchAssignedTasks(userLogged, 'myTasks')
});


function fetchAssignedTasks(userEmail, tasks) {

  const projectTasksRef = collection(db, "projectTasks");
  
  if(tasks === 'myTasks'){
    const q = query(projectTasksRef, where("data-assignedTo", "==", userEmail));
    viewTasks(q)
  } else {
    if(userRol === 'Rep'){
      return
    } else {
      const q = query(projectTasksRef);
      viewTasks(q)
    }
    
  }
  
}  

async function viewTasks(q) {
  try {
    const querySnapshot = await getDocs(q);
    const assignedTasks = [];
    let toDoAdminData = document.getElementById('toDoAdminData');
    let inProgressAdminCardData = document.getElementById('inProgressAdminCardData');
    let doneAdminCardData = document.getElementById('doneAdminCardData');
    doneAdminCardData.innerHTML = ''
    inProgressAdminCardData.innerHTML = ''
    toDoAdminData.innerHTML = ''
    querySnapshot.forEach((doc) => {
      assignedTasks.push(doc.data());
      createMessageRow(doc.data(), doc.id)
    });

    assignedTasks.forEach(function(item) {
      //createMessageRow(item)
    })

  } catch (error) {
    console.error("Error fetching assigned tasks: ", error);
    return [];
  }
}
  


// crea row de las tareas
function createMessageRow(data, docId) {
    const messageRow = document.createElement("div");
    messageRow.classList.add("row", "align-items-center", "border-bottom", "py-2", "custom-button", "mb-2", "border-info", "messageRow");
    messageRow.setAttribute("data-bs-toggle", "modal");
    messageRow.setAttribute("data-bs-target", "#addNewTaskModal");
    messageRow.setAttribute("data-id", data["data-id"]);
    messageRow.setAttribute("data-name", data["data-name"]);
    messageRow.setAttribute("data-subtitle", data["data-subtitle"]);
    messageRow.setAttribute("data-description", data["data-description"]);
    messageRow.setAttribute("data-duedate", data["data-duedate"]);
    messageRow.setAttribute("data-assignedto", data["data-assignedTo"]);
    messageRow.setAttribute("data-creationDate", data["data-creationDate"]);
    messageRow.setAttribute("data-taskstatus", data["data-taskStatus"]);
    messageRow.setAttribute("data-messageid", data["data-starred"]);
    messageRow.setAttribute("data-taskid", docId);
  
    const col4 = document.createElement("div");
    col4.classList.add("col-4");
    const idParagraph = document.createElement("p");
    idParagraph.textContent = data["data-id"];
    col4.appendChild(idParagraph);
  
    const col8 = document.createElement("div");
    col8.classList.add("col-8");
    const nameParagraph = document.createElement("p");
    nameParagraph.textContent = data["data-name"];
    col8.appendChild(nameParagraph);
  
    messageRow.appendChild(col4);
    messageRow.appendChild(col8);
    if (data["data-taskStatus"] === 'To Do') {
      toDoAdminData.appendChild(messageRow)  
    } else if(data["data-taskStatus"] === 'Done'){
      doneAdminCardData.appendChild(messageRow)  
    } else {
      inProgressAdminCardData.appendChild(messageRow)  
    }
    

    let messageRowSet = document.querySelectorAll('.messageRow');
    messageRowSet.forEach(function(item) {
        item.addEventListener('click', function (e) {
            if (e.target.closest('.messageRow')) {
              const text = item.dataset.duedate
              const regex = /\(([^)]+)\)/;
              const matches = text.match(regex);
              let values = {}
              values = matches[1].split(", ");
              let seconds = values[0]
              const numbers = seconds.replace(/\D/g, "");
              const date = new Date(numbers * 1000);
              //const formattedDate = date.toISOString().slice(0, 10);
              const fecha = new Date(date);
              const anio = fecha.getFullYear();
              const mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
              const dia = ('0' + fecha.getDate()).slice(-2);
            
              const fechaFormateada = `${anio}-${mes}-${dia}`;

                taskTitleInput.value = item.dataset.name
                taskVoltioIdInput.value = item.dataset.id
                taskSubtitleInput.value = item.dataset.subtitle
                taskDescriptionInput.value = item.dataset.description
                taskDueDateInput.value = fechaFormateada
                taskAssignedTo.value = item.dataset.assignedto
                taskStatus.value = item.dataset.taskstatus
                saveTaskModal.dataset.taskid = item.dataset.taskid
                saveTaskModal.dataset.messageid = item.dataset.messageid
                
              }
        });
    });
    
}
  
// SAVE TASKS

  saveTaskModal.addEventListener('click', function (e) {
    let taskId = e.target.dataset.taskid
    let messageId = e.target.dataset.messageid
    editProjectTask(taskId, messageId)
  });

  async function editProjectTask(taskId, messageId){
    const fecha = new Date(taskDueDateInput.value);
    let realDate = fecha.setDate(fecha.getDate() + 1);
    const taskRef = doc(db, 'projectTasks', taskId);
    const messageRef = doc(db, 'listOfleadNotes', messageId);
    try {
      await updateDoc(taskRef, {
        "data-name" :taskTitleInput.value,
        "data-id" : taskVoltioIdInput.value,
        "data-subtitle" : taskSubtitleInput.value,
        "data-description": taskDescriptionInput.value,
        "data-duedate": new Date(realDate),
        "data-assignedTo":taskAssignedTo.value,
        "data-taskStatus":taskStatus.value
      })
      await updateDoc(messageRef, {
        "customerComment": taskDescriptionInput.value,
      })
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Task updated!',
        showConfirmButton: false,
        timer: 1500
      })
      fetchAssignedTasks(userLogged, 'myTasks')
    } catch (error) {
      console.log(error);
    }
    
  }

  // error al guardar fecha despues de editar, ya que se guarda con un valor distinto.
  getRepDropdown()
  async function getRepDropdown() {
    const db = getFirestore();
  
    // const userProfileCollection = collection(db, 'userProfile');
  
    // const userProfileSnapshot = await getDocs(userProfileCollection);
    let userEmails = [];
    const q = query(collection(db, "userProfile")); // , where("accessLevel", "==", "Admin")
    const querySnapshot = await getDocs(q);
    userEmails = querySnapshot.docs.map((doc) => doc.data().userEmail);
            
    userEmails.forEach(function(item) {
        let el = document.createElement('option');
        el.innerHTML = item
        taskAssignedTo.appendChild(el)
    });
  
    return userEmails;
  }