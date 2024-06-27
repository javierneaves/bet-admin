import { getFirestore, doc, getDoc, collection, getDocs, query, where, deleteDoc, orderBy, updateDoc, setDoc, addDoc, collectionGroup, startAfter, limit, serverTimestamp  } from '../firebase/firebaseJs.js'
import { app, auth } from '../firebase/config.js'
import { onAuthStateChanged, updateProfile } from '../firebase/firebaseAuth.js';
import { calculations } from '../js/calculator.js'
import '../js/signature_pad.js'
import { showLoadingAlert } from '../js/loadSweetAlert.js'

const db = getFirestore(app) 
let voltioId 
let installer
let sumOfAdders
let solarPanelLocation
let roofConditionData
let data = []  
let addersData = []
let addersDataBd = [] 
let projectRedline
let mpu
let inputBox = document.getElementById('searchLeadInput')
let searchLeadViewSection = document.querySelectorAll('.searchLeadViewSection')
let clearInputsElement = document.querySelectorAll('.clearInputs')
let customerNameOnTop = document.getElementById('customerNameOnTop')
let panelLocationClass = document.querySelectorAll('.panelLocationClass');
let addersBadgeContainer = document.getElementById('addersBadgeContainer');
let projectUsage = document.getElementById('projectUsage');
let totalYearlyPayment = document.getElementById('totalYearlyPayment');
let designArea = document.getElementById('designArea');
let proyectInstaller = document.getElementById('proyectInstaller');
let proyectFinancial = document.getElementById('proyectFinancial');
let projectPanelsNumber = document.getElementById('projectPanelsNumber');
let projectAddOnSystem = document.getElementById('projectAddOnSystem');
let ProjectCustomerCashBack = document.getElementById('ProjectCustomerCashBack');
let projectCmsModInput = document.getElementById('projectCmsMod')
let roofCondition = document.getElementById('roofCondition');
let utilityAverageMonthly = document.getElementById('utilityAverageMonthly');
let systemSizeText = document.getElementById('systemSizeText');
let KwhKw = document.getElementById('KwhKw');
let genKwH = document.getElementById('genKwH');
let offsetText = document.getElementById('offsetText');
let totalAdders = document.getElementById('totalAdders');
let averageMonthlyPayment = document.getElementById('averageMonthlyPayment');
let projectCmsModLabel = document.getElementById('projectCmsModLabel')
let projectMPU = document.getElementById('projectMPU')
let saveCurrentProjectButton =document.getElementById('saveCurrentProjectButton');
let targetCommission = document.getElementById('targetCommission');
let projectCost = document.getElementById('projectCost');
let viewProjectsButton = document.getElementById('viewProjectsButton');
let navTabUtility = document.getElementById('navTabUtility');
let navTabDesign = document.getElementById('navTabDesign');
let navTabPricing = document.getElementById('navTabPricing');
let navTabDetails = document.getElementById('navTabDetails');
let projectRedlineEl = document.getElementById('projectRedline');
let navTabUtilityContainer = document.getElementById('navTabUtilityContainer');
let navTabDesignContainer = document.getElementById('navTabDesignContainer');
let navTabPricingContainer = document.getElementById('navTabPricingContainer');
let navTabDetailsContainer = document.getElementById('navTabDetailsContainer');

let navProposalsMenu = document.getElementById('navProposalsMenu');
let proposalViewsAccordionItem = document.getElementById('proposalViewsAccordionItem');
let status = 'lead'
let statusFilter = document.getElementById('statusFilter');
let statusFilterData = 'In-Progress 🚀'
let progressFilter
let runCreditView = document.getElementById('runCreditView');
let upFileCustomer = document.getElementById('upFileCustomer');
let getProjectImagesButton = document.getElementById('getProjectImagesButton');
let creditLinksName = document.getElementById('creditLinksName');
let creditLinks = document.getElementById('creditLinks');
let refreshCreditLinksButton = document.getElementById('refreshCreditLinksButton');
let saveCreditLinksButton = document.getElementById('saveCreditLinksButton');
let loading = document.getElementById('loading');

let goToLeadDetailFromMessage = document.getElementById('goToLeadDetailFromMessage');

goToLeadDetailFromMessage.addEventListener('click', function (e) {
  console.log('Go to searchLeadMessages.js line 77 to remove return');
  return
  document.querySelector('#chatSection').style.display = 'none'
  voltioId = goToLeadDetailFromMessage.getAttribute("name")
  clearInputs()
  setDataToProfileView(voltioId) 
});

startLoading()

function startLoading(){
  loading.classList.remove("invisible");
}

function endLoading(){
  loading.classList.add("invisible");
}


navProposalsMenu.addEventListener('click', function (e) {
  if(e.target.id === 'navTabUtility'){
    navTabUtilityContainer.style.display = 'block'
    navTabDesignContainer.style.display = 'none'
    navTabPricingContainer.style.display = 'none'
    navTabDetailsContainer.style.display = 'none'
    navTabUtility.classList.add('active')
    navTabDesign.classList.remove('active')
    navTabPricing.classList.remove('active')
    navTabDetails.classList.remove('active')
  }
  if(e.target.id === 'navTabDesign'){
    navTabUtilityContainer.style.display = 'none'
    navTabDesignContainer.style.display = 'block'
    navTabPricingContainer.style.display = 'none'
    navTabDetailsContainer.style.display = 'none'
    navTabUtility.classList.remove('active')
    navTabDesign.classList.add('active')
    navTabPricing.classList.remove('active')
    navTabDetails.classList.remove('active')
  }
  if(e.target.id === 'navTabPricing'){
    navTabUtilityContainer.style.display = 'none'
    navTabDesignContainer.style.display = 'none'
    navTabPricingContainer.style.display = 'block'
    navTabDetailsContainer.style.display = 'none'
    navTabUtility.classList.remove('active')
    navTabDesign.classList.remove('active')
    navTabPricing.classList.add('active')
    navTabDetails.classList.remove('active')
  }
  if(e.target.id === 'navTabDetails'){
    navTabUtilityContainer.style.display = 'none'
    navTabDesignContainer.style.display = 'none'
    navTabPricingContainer.style.display = 'none'
    navTabDetailsContainer.style.display = 'block'
    navTabUtility.classList.remove('active')
    navTabDesign.classList.remove('active')
    navTabPricing.classList.remove('active')
    navTabDetails.classList.add('active')
  }
});


onAuthStateChanged(auth, async(user) => {
    if(user){
      viewProjectsButton.addEventListener('click', (e) => {
        if(viewProjectsButton.dataset.status === 'Project'){
          status = 'Project'
          getLeadOrProjectData()
          viewProjectsButton.dataset.status = 'lead'
          viewProjectsButton.innerHTML = 'VIEW LEADS'
          inputBox.value = ''
          viewProjectsButton.value = ''
          statusFilter.value = ''
          
        } else {
          viewProjectsButton.dataset.status = 'Project'
          status = 'lead'
          getLeadOrProjectData()
          viewProjectsButton.innerHTML = 'VIEW PROJECTS'
          inputBox.value = ''
          viewProjectsButton.value = ''
          statusFilter.value = ''
        }
        
      })


      //getFirestoreDataToPagination()
      //getLeadOrProjectData()

      statusFilter.addEventListener('change', function (e) {
        statusFilterData = e.target.value
        getLeadOrProjectData(statusFilterData)
      });

      async function getLeadOrProjectData(filter){
        data = []
        if(!filter){
          let querySnapshoot
          const projectInfo = query(collection(db, 'leadData'), where('status', '==', status), where('project', '==', 'solar'));
          querySnapshoot = await getDocs(projectInfo)

          const allData = querySnapshoot.forEach( async(doc) => {
            let profileCloser =   !doc.data().profileCloser ? '' : doc.data().profileCloser
            let profileSetter = ! doc.data().profileSetter ? '' : doc.data().profileSetter
            let systemSize = !doc.data().systemSize ? '' : doc.data().systemSize
                data.push([
                  doc.data().voltioIdKey,
                  doc.data().customerName,
                  doc.data().progress,
                  doc.data().projectStatus,
                  profileCloser,
                  profileSetter,
                  systemSize,
                  doc.data().creationDate,
  
                ])
          })
          
          searchLeadByInput()
        } else {
          let querySnapshoot
          if(statusFilterData === ''){
            const projectInfo = query(collection(db, 'leadData'), where('status', '==', status), where('project', '==', 'solar'));
            querySnapshoot = await getDocs(projectInfo)
          } else if(!progressFilter){
            const projectInfo = query(collection(db, 'leadData'), where('status', '==', status), where('projectStatus', '==', statusFilterData), where('project', '==', 'solar'));
            querySnapshoot = await getDocs(projectInfo)
          }  

          const allData = querySnapshoot.forEach( async(doc) => {
            let profileCloser =   !doc.data().profileCloser ? '' : doc.data().profileCloser
            let profileSetter = ! doc.data().profileSetter ? '' : doc.data().profileSetter
            let systemSize = !doc.data().systemSize ? '' : doc.data().systemSize
                data.push([
                  doc.data().voltioIdKey,
                  doc.data().customerName,
                  doc.data().progress,
                  doc.data().projectStatus,
                  profileCloser,
                  profileSetter,
                  systemSize,
                  doc.data().creationDate,
  
                ])
          })
          console.log(data);
          searchLeadByInput()

        }
          
      }

      searchLeadViewSection.forEach( (e) => { 
        // se ejecuta despues de dar click al boton .searchLeadViewSection para que refresque la info en caso de algun cambio
        e.addEventListener('click', async (e) => {
          data = []  
          document.querySelector('#addNewLeadSection').style.display = 'none'
          document.querySelector('#searchProjectSection').style.display = 'block'
          document.querySelector('#profileViewSection').style.display = 'none'
          document.querySelector('#chatSection').style.display = 'none'
          viewProjectsButton.innerHTML = 'VIEW PROJECTS'
          //document.getElementById('imageCustomerGallery').innerHTML = ''
          document.getElementById('customerFilesUpload').value = ''
          const projectInfo = query(collection(db, 'leadData'), where('status', '==', 'lead'), where('project', '==', 'solar'));
          const querySnapshoot = await getDocs(projectInfo)
          const allData = querySnapshoot.forEach( async(doc) => {
            let profileCloser =   !doc.data().profileCloser ? '' : doc.data().profileCloser
            let profileSetter = ! doc.data().profileSetter ? '' : doc.data().profileSetter
            let systemSize = !doc.data().systemSize ? '' : doc.data().systemSize
                data.push([
                  doc.data().voltioIdKey,
                  doc.data().customerName,
                  doc.data().progress,
                  doc.data().projectStatus,
                  profileCloser,
                  profileSetter,
                  systemSize,
                  doc.data().creationDate,
  
                ])
          })
          clearProjectInfo()
          searchLeadByInput()
          
        })

      })
        
    } else {
    }
})

inputBox.addEventListener('input', () => {
  searchLeadByInput()})

function searchLeadByInput(){

  let searchInput = document.getElementById("searchLeadInput").value.toString().toLowerCase().trim()
  let searchWords = searchInput.split(/\w^/)

  let resultsArray = searchInput === "" ? data : data.filter(function(r){
    return searchWords.every(function(word){
      return [1].some(function(colIndex){
        return r[colIndex].toString().toLowerCase().indexOf(word) !== -1
      })
    })
  })

  let searchResultsBox = document.getElementById("searchResults")
  let templateBox = document.getElementById("rowTemplate")
  let template = templateBox.content

  searchResultsBox.innerHTML = ""
  resultsArray.forEach(function(r){
    let tr = template.cloneNode(true)
    let leadId = tr.querySelector(".leadId");
    let leadProgress = tr.querySelector(".leadProgress");
    let leadStage = tr.querySelector(".leadStage");
    let editButton = tr.querySelector(".editLeadButton"); // BUTTON THAT CONTAINS CUSTOMER NAME
    let profileSetter = tr.querySelector('.profileSetter');
    let profileCloser = tr.querySelector('.profileCloser');
    let systemSize = tr.querySelector('.systemSize');
    let leadCreatedDate = tr.querySelector('.leadCreatedDate');
    const timestamp =  r[7] ;
    const dateNew = new Date(timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000));
    const date = new Date (r[7] * 1000)    
    let month = dateNew.getMonth() < 10 ? '0'+ (dateNew.getMonth() + 1): (dateNew.getMonth()+ 1)
    let day = dateNew.getDate() < 10 ? '0' + dateNew.getDate() : dateNew.getDate()
    const formattedDate = `${month}/${day}/${dateNew.getFullYear()}`;

    leadId.textContent = r[0]
    editButton.textContent = r[1]
    leadProgress.textContent = r[2]
    leadStage.textContent = r[3]
    profileSetter.textContent = r[5]
    profileCloser.textContent = r[4]
    systemSize.textContent = r[6]
    leadCreatedDate.textContent = formattedDate
    
    editButton.dataset.leadVoltioId = r[0]; 
    
    searchResultsBox.appendChild(tr)
    
  })

  let viewProfileButton = document.querySelectorAll('.editLeadButton')
  viewProfileButton.forEach( btn => {
    btn.addEventListener('click', async (e) => { 
        voltioId = e.target.dataset.leadVoltioId
        clearInputs()
        setDataToProfileView(voltioId) 
    })
  })
  endLoading()
}

projectAddOnSystem.addEventListener('change', function (e) {
  calculations()
});
// THIS LET IS USED TO GET PROJECT DOC ID, AND HANDLE EDIT ACTIONS
let docId

// FUNCTION TO READ ALL LEAD INFO FROM DB AND SET ON EACH FIELD
async function setDataToProfileView(voltioId){
    getRepDropdown()
    getFinancialDropdown()
    document.getElementById('titleOfEditLeadView').innerHTML = 'Lead'
    document.getElementById('searchProjectSection').style.display = 'none'
    document.getElementById('profileViewSection').style.display = 'block'
    let progressBar = document.getElementById('progressBar')
    // THIS QUERY GET LEAD PROFILE DATA
    const projectInfo = query(collection(db, 'leadData'), where('voltioIdKey', '==', voltioId));
        const querySnapshoot = await getDocs(projectInfo)
        const allData = querySnapshoot.forEach( async(doc) => {
            customerNameOnTop.innerHTML = doc.data().voltioIdKey.toUpperCase() + ' - ' + doc.data().customerName.toUpperCase()
            document.getElementById('leadVoltioId').value = doc.data().voltioIdKey.toUpperCase()
            document.getElementById('leadName').value = doc.data().customerName.toUpperCase()
            document.getElementById('leadPhone').value = doc.data().customerPhoneNumber
            document.getElementById('leadAddress').value = doc.data().customerAddress.toUpperCase()
            document.getElementById('leadLanguage').value = doc.data().customerLanguage.toUpperCase()
            document.getElementById('leadCity').value = doc.data().inputCity.toUpperCase()
            document.getElementById('stateDropdown').value = doc.data().inputState.toUpperCase()
            document.getElementById('leadZip').value = doc.data().inputZip
            document.getElementById('leadEmail').value = doc.data().customerEmail
            document.getElementById('leadCloser').value = doc.data().profileCloser
            document.getElementById('leadSetter').value = doc.data().profileSetter
            document.getElementById('leadBirth').value = doc.data().profileBirth
            docId = doc.id
        })
    // WE USE LEAD STATUS TO SET DATA ON STATUS VIEW SECTION
    const docRef = doc(db, "leadStatus", voltioId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      document.getElementById('proposalStatus').value = docSnap.data().proposalStatus
      document.getElementById('projectType').value = docSnap.data().projectType
      document.getElementById('status').value = docSnap.data().status
      document.getElementById('progress').value = docSnap.data().progress
      progressBar.innerHTML = docSnap.data().progress
      document.getElementById('apptDate').value = docSnap.data().apptDate
      document.getElementById('creditStatus').value = docSnap.data().creditStatus
      document.getElementById('ss').check = docSnap.data().ss
      document.getElementById('docs').check = docSnap.data().docs
      let progressValues = 
      [['Missing stips', '3%'],
      ['Missing utility bill', '6%'],
      ['Site survey scheduled', '9%'],
      ['Site survey completed', '12%'],
      ['Pending site survey', '15%'],
      ['Reschedule site survey', '18%'],
      ['Plans ordered', '21%'],
      ['Waiting for NTP', '24%'],
      ['NTP completed', '27%'],
      ['Expecting MPONE', '30%'],
      ['MPONE Paid', '33%'],
      ['Design', '34%'],
      ['Engineering', '35%'],
      ['Permits', '36%'],
      ['Needs roof quote', '39%'],
      ['Resign docs', '42%'],
      ['Pending Reroof', '43%'],
      ['Reroof scheduled', '45%'],
      ['Reroof completed', '48%'],
      ['Pending PV install', '51%'],
      ['PV Install Reschedule', '52%'],
      ['PV Install scheduled', '54%'],
      ['PV Installed', '57%'],
      ['MPU pending', '60%'],
      ['MPU schedule', '63%'],
      ['MPU installed', '66%'],
      ['Expecting MPTWO', '69%'],
      ['MPTWO Paid', '72%'],
      ['Pending Final Inspection', '75%'],
      ['Final inspection scheduled', '78%'],
      ['Final inspection completed', '81%'],
      ['Corrections needed', '84%'],
      ['Submitted for PTO', '87%'],
      ['PTO approved', '90%'],
      ['System activated', '93%'],
      ['Final Documents', '95%'],
      ['Job completed', '100%']]
      let cons = progressValues.map( r => r[0])
      const posIndex = cons.indexOf(docSnap.data().progress)
      const value = progressValues[posIndex][1]
      progressBar.style.width = value
      // THIS FUNCTIONS AREA USED TO COMPLETE DATA ON SOME SECTIONS
      // LIKE COMMENTS, CALCULATOR DATA AND CREDIT INFO, JUST IS PENDING CREDIT LINKS
      getComments()
      getDataFromProjectDetails()
      getCreditInfo()
      

    } else {
      // doc.data() will be undefined in this case
    }
        
}

projectPanelsNumber.addEventListener('blur', function (e) {
  calculations()
});

let editLeadButtonToServer = document.getElementById('editLeadButtonToServer')

editLeadButtonToServer.addEventListener('click', (e) => {
  saveLeadToServer()
})

async function saveLeadToServer(){
  const docRef = doc(db, 'leadData', docId)
    await updateDoc(docRef, {
      customerName: document.getElementById('leadName').value,
      customerPhoneNumber: document.getElementById('leadPhone').value,
      customerAddress: document.getElementById('leadAddress').value,
      customerLanguage: document.getElementById('leadLanguage').value,
      inputCity: document.getElementById('leadCity').value,
      inputState: document.getElementById('stateDropdown').value,
      inputZip: document.getElementById('leadZip').value,
      customerEmail: document.getElementById('leadEmail').value,
      profileCloser: document.getElementById('leadCloser').value,
      profileSetter: document.getElementById('leadSetter').value,
      systemSize: document.getElementById('systemSizeText').innerHTML,
      profileBirth: document.getElementById('leadBirth').value
    }).then( () => {
      Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your data has been saved',
          showConfirmButton: false,
          timer: 1500
        })
  }).catch( (error) => {
      console.log(error);
  })
}

function clearInputs(){
  clearInputsElement.forEach((e) => {
    e.innerHTML = ''
  })
}

async function getComments(){
  let commentsBd = ['listOfCommentsCustomer', 'listOfCommentsAdmin', 'listOfInternalNotes', 'listOfleadNotes']
  let voltioId = document.getElementById("leadVoltioId").value
  for(var n = 0; n <=commentsBd.length -1 ; n++){
    let dataNotes = []
  const voltioIds = query(collection(db, commentsBd[n]), where('voltioId', '==', voltioId), orderBy("date", 'desc'))
      const voltioIdsSnapshot = await getDocs(voltioIds)
      voltioIdsSnapshot.forEach((e) => {
          dataNotes.push([e.data().customerComment, e.data().date, e.data().userName])
      })

  document.getElementById(commentsBd[n]).innerHTML = ""
  let mainDiv = document.getElementById(commentsBd[n])
  let noteContainer = document.createElement("div")
  let userNameTitle = document.createElement("strong")
  let textOfComment = document.createElement("p")
  let dateContainer = document.createElement("div")
  let dateOfComment = document.createElement("p")
  
  for( var i=0;i <=dataNotes.length - 1; i++){
      let noteContainer = document.createElement("div")
      let userNameTitle = document.createElement("strong")
      let textOfComment = document.createElement("p")
      let dateContainer = document.createElement("div")
      let dateOfComment = document.createElement("p")    
      noteContainer.className = "row border-bottom border-info-subtle p-2"
      //noteContainer.classList.add("mb-2")
      dateContainer.classList.add("row")
      dateOfComment.classList.add("text-end")
      dateOfComment.classList.add("fs-6")
      dateOfComment.classList.add("fw-light")
      textOfComment.classList.add("text-light")
      userNameTitle.classList.add("text-light")
      dateOfComment.classList.add("text-light")
      userNameTitle.innerHTML = dataNotes[i][2]
      textOfComment.innerHTML = dataNotes[i][0]
      dateOfComment.innerHTML = dataNotes[i][1]
      mainDiv.appendChild(noteContainer)
      noteContainer.append(userNameTitle)
      noteContainer.append(textOfComment)
      noteContainer.append(dateContainer)
      dateContainer.append(dateOfComment)
  }
  }
  
}

projectCmsModInput.addEventListener('change', (e) => {
  projectCmsModLabel.innerHTML = 'CMS MOD ' + projectCmsModInput.value + '%'
})

projectMPU.addEventListener('change', () => {
  if(projectMPU.value === 'YES'){
    document.getElementById('projectMPUPrice').value = 3000
  } else {
    document.getElementById('projectMPUPrice').value = 0
  }
  
  
})

designArea.addEventListener('change', async function (e) {
  let designAreaValue = designArea.value
   designAreaOnChange(designAreaValue)
  
});

proyectInstaller.addEventListener('change', function (e) {
  installer = e.target.value
  getAddersByInstaller()
  
});

proyectFinancial.addEventListener('change', async function (e) {
  let documentId = proyectFinancial.value
  const documentRef = doc(db, 'loanData', documentId);
  const documentSnapshot = await getDoc(documentRef);

  if (documentSnapshot.exists()) {
    const data = documentSnapshot.data();
    projectRedline = parseFloat(data.loanRedline)
    document.getElementById('projectRedline').value = projectRedline
    sumOfAddersfunction()
  } else {
    console.log("El documento no existe.");
  }

});

async function getAddersByInstaller(){
  const docRef = doc(db, "installerList", installer);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // projectRedline = docSnap.data().installerRedline
    mpu = docSnap.data().epcMPU
    let addersArray = []
    let addersList = docSnap.data().adders
    addersList.forEach(function(item) {
      let adderNameData = item.adderNameData
      let qtyData = item.qtyData
      addersArray.push([adderNameData, qtyData])
    })
      addNewAdderRow(addersArray)
      setRedlineAndMPU()
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}

// function to create new adder row
function addNewAdderRow(adderNameData, qtyData){
  let mainContainer = document.getElementById("addersContainers")
  mainContainer.innerHTML = ''
  let addersTitleContainer = document.createElement("tr");
  
   let adderTableRow = document.createElement("tr");
   let adderNameTableData = document.createElement("td");
   let valueTableData = document.createElement("td");
   let valueInput = document.createElement("input");
   let valueInputAdderName = document.createElement("select");
   let emptyOption = document.createElement('option');
   
   valueTableData.className = "bg-transparent text-light border-info"
   valueInput.className = "form-control bg-transparent text-light border-info sumOfAdders"
   adderTableRow.className = "bg-transparent text-light border-info table-row"
   adderNameTableData.className = "bg-transparent text-light border-info"
   valueInput.type = "number"
   valueInput.name = "qty"
   valueInput.value = !qtyData ? 0 : qtyData
   emptyOption.innerHTML = ''
   valueInputAdderName.className = "form-select bg-dark shadow text-light border-info text-start stateNameDropdown"
   valueInputAdderName.name = "adderName"
   valueInputAdderName.value = !adderNameData ? '' : adderNameData

   mainContainer.append(adderTableRow)
   adderTableRow.appendChild(adderNameTableData)
   adderTableRow.appendChild(valueTableData)
   // adderTableRow.appendChild(deleteButton)
   // valueTableData.appendChild(valueInput)
   adderNameTableData.appendChild(valueInputAdderName)
   valueInputAdderName.append(emptyOption)

   adderNameData.forEach(function(item) {
    let option = document.createElement('option');
    valueInputAdderName.append(option)    
    option.innerHTML = item[0] 
    option.label = item[0] 
    option.value = parseFloat(item[1])+','+item[0]
    
   });

    let stateNameDropdown = document.querySelectorAll('.stateNameDropdown');
    stateNameDropdown.forEach(function(item) {
      item.addEventListener('change', function (e) {
        let value = e.target.value
        let name = value.split(',')
        let newName = name[1]
        let newValue = name[0]
        if(!newName){
          return
        } else {
          createAdderButton(newName, newValue)
          
        }
       
      });
    });
    
}

function sumOfAddersfunction(){
  
  var arr = document.querySelectorAll('.qtyButton');
  var tot=0;
  arr.forEach(function(item) {
    tot += parseInt(item.dataset.value);
  });

  sumOfAdders = tot
  
  totalAdders.value = sumOfAdders
  totalAdders.innerHTML = sumOfAdders.toLocaleString('en-US', {style: 'currency', currency: 'USD',})
  calculations(tot) 
}

function createAdderButton(newName, newValue){
  
  let btnAdderContainer = document.createElement('btn');
  btnAdderContainer.className = 'btn btn-outline-info position-relative qtyButton p-2 m-2'
  btnAdderContainer.type = 'button'
  btnAdderContainer.innerHTML = newName
  btnAdderContainer.dataset.value = parseFloat(newValue)
  btnAdderContainer.dataset.name = newName
  addersBadgeContainer.append(btnAdderContainer)
  sumOfAddersfunction()
  removeButton()
  
}

function removeButton(){
  let buttonAdderName = document.querySelectorAll('.qtyButton');
  buttonAdderName.forEach(function(item) {
    item.addEventListener('click', function (e) {
      e.target.remove();
      sumOfAddersfunction()
    });
    
  });
}

ProjectCustomerCashBack.addEventListener('blur', function (e) {
  sumOfAddersfunction()
});

panelLocationClass.forEach(function(item) {
  item.addEventListener('click', function (e) {
    // body
    panelLocationClass.forEach((e)=>{ e.classList.remove('border-info')})
    e.target.classList.toggle('border-info')
    solarPanelLocation = e.target.id
    
  });
});

function setRedlineAndMPU(){
  document.getElementById('projectMPUPrice').value = mpu
}

// SAVE PROJECT
function getAddersDataToSaveOnDataBase(){
  addersData = []
  let addersDataButtons = document.querySelectorAll('.qtyButton');
  addersDataButtons.forEach(function(item) {
    let newValue = item.dataset.value
    let newName = item.dataset.name
    addersData.push([newName, newValue])
    
  });
  
}

proposalViewsAccordionItem.addEventListener('blur', function (e) {
  if(e.target.id = projectUsage.id){console.log('projectUsage xxxxxxxxxx');}
});

saveCurrentProjectButton.addEventListener('click', async function (e) {
  startLoading()
  getAddersDataToSaveOnDataBase()
  addersDataBd = []
  addersData.forEach(function(item) {
    let rowData = {}
    rowData.qtyData = parseFloat(item[1])
    rowData.adderNameData = item[0]
    addersDataBd.push(rowData)
  });
  const projectRef = doc(db, 'projectDetails', voltioId);
  await updateDoc(projectRef, { addersData: null })
  .then(() => {
    console.log('El campo addersData ha sido borrado exitosamente');
  })
  .catch((error) => {
    console.error('Error borrando el campo addersData: ', error);
    endLoading()
    Swal.fire({
      icon: 'error',
      title: 'An error has been occurred',
      text: `Please contact system admin`,
      confirmButtonText: 'OK'
    });
  });
  
  await setDoc(doc(db, "projectDetails", voltioId), {
    projectUsage: projectUsage.value,
    totalYearlyPayment: totalYearlyPayment.value,
    designArea: designArea.value,
    proyectInstaller: proyectInstaller.value,
    projectPanelsNumber: projectPanelsNumber.value,
    projectAddOnSystem: projectAddOnSystem.value,
    ProjectCustomerCashBack: ProjectCustomerCashBack.value,
    projectCmsModInput: projectCmsModInput.value,
    solarPanelLocation: !solarPanelLocation ? '' : solarPanelLocation,
    roofCondition: roofCondition.value,
    roofingMaterial: roofingMaterial.value,
    projectElectricPanelBrand: projectElectricPanelBrand.value,
    addersData: addersDataBd,
    proyectFinancial: proyectFinancial.value,
    projectRedlineEl: projectRedlineEl.value
  }).then(() => {
    saveLeadToServer()
    endLoading()
    Swal.fire({
      icon: 'success',
      title: 'Proposal saved',
      text: `The proposal has been saved successfully`,
      confirmButtonText: 'OK'
    });
  })
  .catch((error) => {
    endLoading()
    Swal.fire({
      icon: 'error',
      title: 'Error ocurred',
      text: `Please try again.`,
      confirmButtonText: 'OK'
    });
  });

});

let formControl = document.querySelectorAll('.form-control');
formControl.forEach(function(item) {
  item.addEventListener('focus', function (e) {
    e.target.classList.add('border-info')
  });
  item.addEventListener('blur', function (e) {
    e.target.classList.remove('border-info')
  });
});

function getDataFromProjectDetails(){
  const docsRef = collection(db, 'projectDetails');
  const docRef = doc(docsRef, voltioId);

  getDoc(docRef)
    .then((doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const dataArray = Object.keys(data).map((key) => data[key]);
        setProjectDetailsToForm(data)
      } else {
        console.log("No existe ningún documento con ese ID");
      }
    })
    .catch((error) => {
      console.log("Error al obtener el documento:", error);
    });
}

function setProjectDetailsToForm(data){
  projectUsage.value = data.projectUsage
  totalYearlyPayment.value = data.totalYearlyPayment
  designArea.value = data.designArea
  projectPanelsNumber.value = data.projectPanelsNumber
  projectAddOnSystem.value = data.projectAddOnSystem
  ProjectCustomerCashBack.value = data.ProjectCustomerCashBack
  projectCmsModInput.value = data.projectCmsModInput
  solarPanelLocation = data.solarPanelLocation
  roofCondition.value = data.roofCondition
  roofingMaterial.value = data.roofingMaterial
  projectElectricPanelBrand.value = data.projectElectricPanelBrand
  designAreaOnChangeWithPromise(data.designArea, data.proyectInstaller)
  installer = data.proyectInstaller
  addersDataBd = data.addersData
  getAddersByInstaller()
  proyectFinancial.value = data.proyectFinancial
  projectRedlineEl.value = data.projectRedlineEl
  let sum = 0 // LET USED TO SUM ADDS
  addersDataBd.forEach(function(item) {
      // NO ES POSIBLE SUMAR DESDE AQUI LOS ADDERS AL MENOS QUE SE PUEDA MODIFICAR LA VARIABLE AL CAMBIAR ADDERS EN EL DROPDOWN
      // revisar por que no se han agregado los adders al lead
      
      sum += item.qtyData
      let newName = item.adderNameData
      let newValue = item.qtyData
      createAdderButton(newName, newValue)
      calculations()
  });

  panelLocationClass.forEach((e)=>{ e.classList.remove('border-info')})
  document.getElementById(data.solarPanelLocation).classList.toggle('border-info');
  utilityAverageMonthly.value = (projectUsage.value / 12 ).toFixed(0)
  averageMonthlyPayment.value = (totalYearlyPayment.value / 12).toFixed(0)
}

async function designAreaOnChangeWithPromise(designArea, installer) {
  
  return new Promise((resolve) => {
    designAreaOnChange(designArea, installer);
    resolve();
  }).then(() => {
    proyectInstaller
    .value = installer;
    
  });
}

async function designAreaOnChange(designArea, installer){
  console.log(designArea, installer);
  const docRef = doc(db, "coverageArea", designArea);
  const docSnap = await getDoc(docRef);
  let proyectInstaller = document.getElementById('proyectInstaller');
  proyectInstaller.innerHTML = ''
  if (docSnap.exists()) {
    let installers = docSnap.data().installer
    let emptyOption = document.createElement('option');
    emptyOption.innerHTML = ''
    proyectInstaller.append(emptyOption)
    installers.forEach(function(item) {
      let option = document.createElement('option');
      option.innerHTML = item
      option.value = item
      proyectInstaller.append(option)
    });
    proyectInstaller.value = installer;
    calculations()

  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}

// START SECTION TO UPLOAD IMAGES

  let customerFilesUpload =  document.querySelector('#customerFilesUpload');
  
  customerFilesUpload.addEventListener('change', function (e) {
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
    let url = "https://script.google.com/macros/s/AKfycbxXIJUh1IuSUsuaktTU4m6zd82FTMJXpK7H1D7x5EdRhD0CchBon0OvkoY_nDuQt_10/exec"
    console.log('file change');
    let fr = new FileReader()
    fr.addEventListener('loadend', function (e) {
      let res = fr.result
      
      let spt = res.split('base64,')[1]
      console.log(customerFilesUpload.files[0].type);
      let obj = {
        base64:spt,
        type:customerFilesUpload.files[0].type,
        name:voltioId
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
    fr.readAsDataURL(customerFilesUpload.files[0])
  });

  async function saveToUtilityBillCollection(link) {
    try {

      const docRef = await addDoc(collection(db, 'utilityBill'), {
        voltioId: voltioId,
        link: link,
        timestamp: new Date().toISOString()
      }).then(getImagesFromUtilityBillCollection())

    } catch (error) {
      console.error('Error al guardar los datos:', error);
    }
  }
  
  let viewCustomersImageButton = document.getElementById('viewCustomersImageButton');

  viewCustomersImageButton.addEventListener('click', function (e) {
    getImagesFromUtilityBillCollection()
  });

  async function getImagesFromUtilityBillCollection(){
    const billsCol = collection(db, 'utilityBill');
    const q = query(billsCol, where('voltioId', '==', voltioId));
    const querySnapshot = await getDocs(q);
    const bills = querySnapshot.docs.map((doc) => doc.data());
    //generateUtilityBillImagesHTML(bills)
    const thumbnailElements = bills.map((thumbnail) => generateThumbnail(thumbnail.link, thumbnail.voltioId));
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

  function generateThumbnail(link, voltioId) {
    const thumbnailDiv = document.createElement('div');
    thumbnailDiv.classList.add('col-sm-6', 'col-md-3');
  
    const thumbnail = document.createElement('div');
    thumbnail.classList.add('thumbnail');
  
    const image = document.createElement('img');
    image.classList.add('img-thumbnail', 'mb-2');
    image.src = link;
    image.alt = voltioId;
  
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
    const container = document.getElementById('utilityBillImagesContainer');
    const customerFilesUpload = document.getElementById('customerFilesUpload');
    customerFilesUpload.value = ''
    container.innerHTML = ''
    thumbnails.forEach((thumbnail) => container.appendChild(thumbnail));
  }
// END OF UPLOAD IMAGE SECTION

// START SECTION TO UPLOAD IMAGES DESIGN PHOTOS

let designFilesUpload =  document.querySelector('#designFilesUpload');
  
designFilesUpload.addEventListener('change', function (e) {
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

  let url = "https://script.google.com/macros/s/AKfycbwdETh-O86DI8AdAh7_mRjVuOqF2Fq99nyA0WfPrbJa9wL4HvKdoa_Vlvzj3HfQcbF9/exec"
  let fr = new FileReader()
  fr.addEventListener('loadend', function (e) {
    let res = fr.result
    
    let spt = res.split('base64,')[1]
    let obj = {
      base64:spt,
      type:designFilesUpload.files[0].type,
      name:voltioId
    }
    let response =  fetch(url, {
        method:'POST',
        body: JSON.stringify(obj),
      })
    .then(r=>r.text())
    .then(data => {
      try {
        const response = JSON.parse(data);
        
        saveToDesignImagesCollection(response.link)
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
  fr.readAsDataURL(designFilesUpload.files[0])
});

async function saveToDesignImagesCollection(link) {
  try {

    const docRef = await addDoc(collection(db, 'designImages'), {
      voltioId: voltioId,
      link: link,
      timestamp: new Date().toISOString()
    }).then(getImagesFromDesignImagesCollection())

  } catch (error) {
    console.error('Error al guardar los datos:', error);
  }
}

let viewDesignImageButton = document.getElementById('viewDesignImageButton');

viewDesignImageButton.addEventListener('click', function (e) {
  getImagesFromDesignImagesCollection()
});

async function getImagesFromDesignImagesCollection(){
  const billsCol = collection(db, 'designImages');
  const q = query(billsCol, where('voltioId', '==', voltioId));
  const querySnapshot = await getDocs(q);
  const bills = querySnapshot.docs.map((doc) => doc.data());
  const thumbnailElements = bills.map((thumbnail) => generateThumbnail(thumbnail.link, thumbnail.voltioId));
  insertThumbnailsDesign(thumbnailElements);
  
}

function insertThumbnailsDesign(thumbnails) {
  const container = document.getElementById('designFilesImagesContainer');
  const designFilesUpload = document.getElementById('designFilesUpload');
  designFilesUpload.value = ''
  container.innerHTML = ''
  thumbnails.forEach((thumbnail) => container.appendChild(thumbnail));
}
// END OF UPLOAD IMAGE SECTION


// FUNCTION TO CLEAR PROJECT ITS USED TO RESET PROJECT VIEW
  function clearProjectInfo(){
    projectUsage.value = 0
    totalYearlyPayment.value = 0
    designArea.value = ''
    proyectInstaller.value = ''
    projectPanelsNumber.value = 0
    projectAddOnSystem.value = 'YES'
    ProjectCustomerCashBack.value = 0
    projectCmsModInput.value = .9
    roofCondition.value = ''
    roofingMaterial.value = ''
    projectElectricPanelBrand.value = ''
    panelLocationClass.forEach((e)=>{ e.classList.remove('border-info')})
    addersBadgeContainer.innerHTML = ''
    systemSizeText.innerHTML = 0
    KwhKw.innerHTML = 0
    genKwH.innerHTML = 0
    offsetText.innerHTML = 0
    totalAdders.innerHTML = ''
    utilityAverageMonthly.value = 0
    averageMonthlyPayment.value = 0
    targetCommission.innerHTML = ''
    projectCost.innerHTML = ''
    proyectFinancial.innerHTML = ''
    projectRedlineEl.value = 0
  }

  // START CREDIT INFO SECTION
let runCreditDataView = document.getElementById('runCreditDataView');

runCreditDataView.addEventListener('change', function (e) {
    let dob = document.getElementById('leadDob').value;
    let job = document.getElementById('leadJobOcupation').value;
    let ssn = document.getElementById('leadSSN').value;
    let annualIncome = document.getElementById('leadAnnualIncome').value;    
    createOrEditCreditInfo(dob, job, ssn, annualIncome)
});

// Función para crear o editar un elemento de la colección "creditInfo"
async function createOrEditCreditInfo(dob, job, ssn, annualIncome) {
  const creditInfoRef = doc(collection(db, "creditInfo"), voltioId);
  const timestamp = serverTimestamp();
  
  // Datos a guardar en Firestore
  const data = {
    dob,
    job,
    ssn,
    annualIncome,
    editedAt: timestamp
  };

  try {
    // Se guarda el elemento en Firestore
    await setDoc(creditInfoRef, data, { merge: true });
    console.log("Elemento creado o editado correctamente");
  } catch (error) {
    console.error("Error al crear o editar elemento: ", error);
  }
}

const leadSSN = document.getElementById("leadSSN");
leadSSN.addEventListener("input", () => {
  const value = leadSSN.value;
  if (value.length > 9) {
    leadSSN.style.borderColor = "red";
    leadSSN.value = value.slice(0, 9);
  } else {
    leadSSN.style.borderColor = "";
  }
});

// get credit info

async function getCreditInfo() {
  try {
    // Obtener la referencia del documento
    const docRef = doc(db, 'creditInfo', voltioId);

    // Obtener los datos del documento
    const docSnap = await getDoc(docRef);

    // Comprobar si el documento existe
    if (docSnap.exists()) {
      // Obtener los datos del documento
       const  voltioData = docSnap.data()
        document.getElementById('leadDob').value = voltioData.dob
        document.getElementById('leadJobOcupation').value = voltioData.job
        document.getElementById('leadSSN').value = voltioData.ssn
        document.getElementById('leadAnnualIncome').value = voltioData.annualIncome
        // Devolver el objeto con los datos de Voltio
      
    } else {
      console.log('El documento no existe');
    }
  } catch (error) {
    console.error(error);
  }
}

// firmar pad

// Obtener los elementos del DOM
const canvas = document.getElementById("siganturePad");
const saveSignatureButton = document.getElementById("saveSignature");
const clearSignature = document.getElementById('clearSignature');

// Configuración del canvas y del SignaturePad
const signaturePad = new SignaturePad(canvas, {
  backgroundColor: "black",
  penColor: "white"
});
let progressAlert
// Función para guardar la firma como imagen
function saveSignature() {
  saveSignatureButton.style.display = 'none'
  if (signaturePad.isEmpty()) {
    alert("Por favor, firme antes de guardar");
    saveSignatureButton.style.display = 'block'
  } else {
    // Inicia el sweet alert 
    progressAlert = Swal.fire({
      title: 'loading file...',
      html: '<div class="progress"><div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>',
      showCancelButton: false,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
    });
    // termina el sweet alert
    // Convertir la firma a una imagen base64
    const dataUrl = signaturePad.toDataURL();
    // Hacer algo con la imagen, como enviarla al servidor o guardarla en Firebase Storage
    savePadSignatureOnDrive(dataUrl)
    
  }
}

// Agregar un evento de clic al botón de guardar
saveSignatureButton.addEventListener("click", saveSignature);


clearSignature.addEventListener('click', function (e) {
  signaturePad.clear()
});


function savePadSignatureOnDrive(dataUrl){
  let url = "https://script.google.com/macros/s/AKfycbx6tLgqSVmHw_tXzQON94hdpkhRhj1nvgaJtmzs7-AGhONwpKS4V0jISQxBN1lFXIxrHw/exec"
  let spt = dataUrl.split('base64,')[1]
    
    let obj = {
      base64:spt,
      type:'image/png',
      name:voltioId
    }
    let response =  fetch(url, {
        method:'POST',
        body: JSON.stringify(obj),
      })
    .then(r=>r.text())
    .then(data => {
      try {
        const response = JSON.parse(data);
        
        saveToSignaturePadCollection(response.link)
      } catch (e) {
        console.error("Error al analizar la respuesta JSON: ", e);
      }
    })
    .catch(err => {
      console.error("Error en la solicitud POST: ", err);
    })
  }

 async function saveToSignaturePadCollection(link){
    try {
      const docRef = await addDoc(collection(db, 'signaturePad'), {
        voltioId: voltioId,
        link: link,
        timestamp: new Date().toISOString()
      }).then(getImagesFromSignaturePadCollection())
    } catch (error) {
      console.error('Error al guardar los datos:', error);
    }
  }

async function getImagesFromSignaturePadCollection(){
    const billsCol = collection(db, 'signaturePad');
    const q = query(billsCol, where('voltioId', '==', voltioId));
    const querySnapshot = await getDocs(q);
    const bills = querySnapshot.docs.map((doc) => doc.data());
    const thumbnailElements = bills.map((thumbnail) => generateThumbnailSignature(thumbnail.link, thumbnail.voltioId));
    insertThumbnailsSignature(thumbnailElements);
  }

  function generateThumbnailSignature(link, voltioId) {
    const thumbnailDiv = document.createElement('div');
    thumbnailDiv.classList.add('col-sm-6', 'col-md-3');
  
    const thumbnail = document.createElement('div');
    thumbnail.classList.add('thumbnail');
  
    const image = document.createElement('img');
    image.classList.add('img-thumbnail', 'mb-2');
    image.src = link;
    image.alt = voltioId;
  
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

  function insertThumbnailsSignature(thumbnails) {
    const container = document.getElementById('imageViewerSignature');
    signaturePad.clear()
    container.innerHTML = ''
    thumbnails.forEach((thumbnail) => container.appendChild(thumbnail));
    saveSignatureButton.style.display = 'block'
    // Cerrar el Sweet Alert
    progressAlert.close();
    // Mostrar una alerta de éxito
    Swal.fire({
      icon: 'success',
      title: 'File loaded',
      text: `The file has been loaded`,
      confirmButtonText: 'OK'
    });
    
  }

  // add an event to get signature images
  let viewSignatures = document.getElementById('viewSignatures');
  viewSignatures.addEventListener('click', function (e) {
    getImagesFromSignaturePadCollection()
  });
  // approve credit by Admin
  let approvedByAdminBtn = document.getElementById('approvedByAdminBtn');

  approvedByAdminBtn.addEventListener('click', async function (e) {
    const creditInfoRef = doc(collection(db, "creditInfo"), voltioId);
    try {
      // Se guarda el elemento en Firestore
      await setDoc(creditInfoRef, {approved: 'Yes'}, { merge: true });
      console.log("Elemento creado o editado correctamente");
    } catch (error) {
      console.error("Error al crear o editar elemento: ", error);
    }
  });

  // START SECTION TO UPLOAD CREDIT IMAGES

  let creditFilesUpload = document.getElementById('creditFilesUpload');

  
  creditFilesUpload.addEventListener('change', function (e) {
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

    let url = "https://script.google.com/macros/s/AKfycbweLOiqVU501vGESJXZ1iZo0Z-lJQaIbZef1PRazpHtZe_BxAh_KPrkSeLwOe-7yhsL/exec"
    let fr = new FileReader()
    fr.addEventListener('loadend', function (e) {
      let res = fr.result
      
      let spt = res.split('base64,')[1]
      let obj = {
        base64:spt,
        type:creditFilesUpload.files[0].type,
        name:voltioId
      }
      let response =  fetch(url, {
          method:'POST',
          body: JSON.stringify(obj),
        })
      .then(r=>r.text())
      .then(data => {
        try {
          const response = JSON.parse(data);
          
          saveToCreditInfoImagesCollection(response.link)
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
    fr.readAsDataURL(creditFilesUpload.files[0])
});

async function saveToCreditInfoImagesCollection(link) {
  try {

    const docRef = await addDoc(collection(db, 'creditInfoImages'), {
      voltioId: voltioId,
      link: link,
      timestamp: new Date().toISOString()
    }).then(getImagesFromcreditInfoImagesCollection())

  } catch (error) {
    console.error('Error al guardar los datos:', error);
  }
}

let viewCreditImageButton = document.getElementById('viewCreditImageButton');
viewCreditImageButton.addEventListener('click', function (e) {
  getImagesFromcreditInfoImagesCollection()
});

async function getImagesFromcreditInfoImagesCollection(){
  const billsCol = collection(db, 'creditInfoImages');
  const q = query(billsCol, where('voltioId', '==', voltioId));
  const querySnapshot = await getDocs(q);
  const bills = querySnapshot.docs.map((doc) => doc.data());
  const thumbnailElements = bills.map((thumbnail) => generateThumbnail(thumbnail.link, thumbnail.voltioId));
  insertThumbnailsCredit(thumbnailElements);
  
}

function insertThumbnailsCredit(thumbnails) {
  const container = document.getElementById('previewCreditFiles');
  const upFileCredit = document.getElementById('creditFilesUpload');
  upFileCredit.value = ''
  container.innerHTML = ''
  thumbnails.forEach((thumbnail) => container.appendChild(thumbnail));
}
// END OF UPLOAD IMAGE SECTION

// START PROJECT IMAGES UPLOAD SECTION
projectImagesInput
getProjectImagesButton 


  
projectImagesInput.addEventListener('change', function (e) {
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

  let url = "https://script.google.com/macros/s/AKfycbypzkBqI-Hl-8b-J_Pz7u7-nzHuE69moHyUJD6ufU1s0Qrl-oZGeDvF6gdtwwDT7buEZg/exec"
  let fr = new FileReader()
  fr.addEventListener('loadend', function (e) {
    let res = fr.result
    
    let spt = res.split('base64,')[1]
    let obj = {
      base64:spt,
      type:projectImagesInput.files[0].type,
      name:voltioId
    }
    let response =  fetch(url, {
        method:'POST',
        body: JSON.stringify(obj),
      })
    .then(r=>r.text())
    .then(data => {
      try {
        const response = JSON.parse(data);
        
        saveToProjectImagesCollection(response.link)
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
  fr.readAsDataURL(projectImagesInput.files[0])
});

async function saveToProjectImagesCollection(link) {
try {

  const docRef = await addDoc(collection(db, 'projectImages'), {
    voltioId: voltioId,
    link: link,
    timestamp: new Date().toISOString()
  }).then(getImagesFromProjectImagesCollection())

} catch (error) {
  console.error('Error al guardar los datos:', error);
}
}

getProjectImagesButton.addEventListener('click', function (e) {
getImagesFromProjectImagesCollection()
});

async function getImagesFromProjectImagesCollection(){
const projectCol = collection(db, 'projectImages');
const q = query(projectCol, where('voltioId', '==', voltioId));
const querySnapshot = await getDocs(q);
const images = querySnapshot.docs.map((doc) => doc.data());
const thumbnailElements = images.map((thumbnail) => generateThumbnail(thumbnail.link, thumbnail.voltioId));
insertThumbnailsProjectImages(thumbnailElements);

}

function insertThumbnailsProjectImages(thumbnails) {
const container = document.getElementById('imageProjectGallery');
const projectImagesInput = document.getElementById('projectImagesInput');
projectImagesInput.value = ''
container.innerHTML = ''
thumbnails.forEach((thumbnail) => container.appendChild(thumbnail));
}
// END OF UPLOAD PROJECT IMAGE SECTION


async function getRepDropdown() {
  const db = getFirestore();

  // const userProfileCollection = collection(db, 'userProfile');

  // const userProfileSnapshot = await getDocs(userProfileCollection);
  let userEmails = [];
  const q = query(collection(db, "userProfile"), where("accessLevel", "!=", "Admin"));
  const querySnapshot = await getDocs(q);
  userEmails = querySnapshot.docs.map((doc) => doc.data().userEmail);
  leadCloser.innerHTML = ' '
  leadCloser.appendChild(document.createElement('option'))
  leadSetter.innerHTML = ' '
  leadSetter.appendChild(document.createElement('option'))             
  userEmails.forEach(function(item) {
      let el = document.createElement('option');
      el.innerHTML = item
      leadSetter.appendChild(el)
  });

  userEmails.forEach(function(item) {
      let el = document.createElement('option');
      el.innerHTML = item
      leadCloser.appendChild(el)
  });

  return userEmails;
}

async function getFinancialDropdown(){
  const db = getFirestore();

  // const userProfileCollection = collection(db, 'userProfile');

  // const userProfileSnapshot = await getDocs(userProfileCollection);
  let loanName = [];
  const q = query(collection(db, "loanData"));
  const querySnapshot = await getDocs(q);
  loanName = querySnapshot.docs.map((doc) => doc.id);
  proyectFinancial.appendChild(document.createElement('option'))       
  loanName.forEach(function(item) {
      let el = document.createElement('option');
      el.innerHTML = item
      proyectFinancial.appendChild(el)
  });

}

saveCreditLinksButton.addEventListener('click', function (e) {
  saveCreditLinks()
});

function saveCreditLinks() {
  let creditLinksCollection = collection(db, "creditLinks");
  
  let creditLinksName = document.getElementById("creditLinksName").value;
  let creditLinks = document.getElementById("creditLinks").value;

  let linkRule = creditLinks.slice(0,4) === 'http'|| creditLinks.slice(0,5) === 'https' ? 1 : 0
  if (linkRule === 1) {
    // El valor cumple con el patrón
    let creditLinkData = {
      name: creditLinksName,
      link: creditLinks,
      voltioId: voltioId
    };

    addDoc(creditLinksCollection, creditLinkData)
          .then( () => {
            document.getElementById("creditLinksName").value = ''
            document.getElementById("creditLinks").value = ''
            getCreditLinks()
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Your data has been saved',
                showConfirmButton: false,
                timer: 1500
              })
        }).catch( (error) => {
            console.log(error);
        })
    // Aquí puedes realizar las operaciones adicionales que desees
  } else {
    // El valor no cumple con el patrón
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Please confirm your data',
      showConfirmButton: false,
      timer: 1500
    })
    // Puedes mostrar un mensaje de error o tomar alguna acción apropiada
  }

  

}

refreshCreditLinksButton.addEventListener('click', function (e) {
  getCreditLinks()
});

async function getCreditLinks(){
  const creditLinksCol = collection(db, "creditLinks");
  const q = query(creditLinksCol, where("voltioId", "==", voltioId));
  const creditLinksArray = [];

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // Obtener los datos del documento y agregarlos al array
      const creditLinkData = doc.data();
      let creditLinkId = doc.id
      creditLinksArray.unshift({
        id: creditLinkId,
        ...creditLinkData
      });
    });

    // Hacer algo con el array de creditLinks
    const divPrincipal = document.getElementById("linkPreviews");
    divPrincipal.innerHTML = ''

    creditLinksArray.forEach(link => {
      let linkData = link.link
      let linkName = link.name
      let linkId = link.id

      var divCol = document.createElement("div");
      divCol.className = "col-lg-4 col-sm-12 mb-4";

      var divCard = document.createElement("div");
      divCard.className = "card h-100";

      var iframe = document.createElement("iframe");
      iframe.src = linkData;
      iframe.className = "col-sm-6 col-md-12";

      var divCardBody = document.createElement("div");
      divCardBody.className = "card-body";

      var h5 = document.createElement("h5");
      h5.className = "card-title";
      h5.textContent = linkName;

      var link = document.createElement("a");
      link.href = linkData;
      link.dataset.id = linkId
      link.target = "_blank";
      link.className = "btn btn-primary";
      link.textContent = "Ir al enlace";

      divCardBody.appendChild(h5);
      divCardBody.appendChild(link);

      divCard.appendChild(iframe);
      divCard.appendChild(divCardBody);

      divCol.appendChild(divCard);

      divPrincipal.appendChild(divCol);
      });
  } catch (error) {
    console.log("Error obteniendo los creditLinks:", error);
  }
}

// Función para generar el código HTML
function generarTarjetas(linkData, linkName) {
    
    var iframeSrc = linkData;
    var h5Text = linkName;
    var linkHref = linkData;

                          
}



