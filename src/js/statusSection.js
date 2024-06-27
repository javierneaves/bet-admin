import { getStorage , ref, uploadBytes, getDownloadURL } 
from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js"
import { getFirestore, doc, getDoc, collection, getDocs, query, where, deleteDoc, orderBy, updateDoc, setDoc, addDoc  } 
from '../firebase/firebaseJs.js'
import { app, auth } from '../firebase/config.js'
import { onAuthStateChanged, updateProfile } from '../firebase/firebaseAuth.js';
import { getApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
const db = getFirestore(app) 

onAuthStateChanged(auth, async(user) => {
    if(user){
        let statusSection = document.getElementById('statusSection')
        statusSection.addEventListener('change', (e) => {
            if(e.target.matches('#proposalStatus')){
                let proposalStatus = e.target.value
                let contractDate = new Date()
                if (proposalStatus === 'Sold') {
                    saveStatusToServer('Project', contractDate)
                } else {
                    let contractDate = ''
                    saveStatusToServer('lead', contractDate)   
                }
            }
            // error se cambia a lead incluso siendo project, por lo que debemos saber si ya es project antes
            // tambien hay error en el contract date ya que este se borraria en caso de existir alguno
            if(e.target.matches('#projectType')){
                saveStatusToServerNewFunction() 
            }
            if(e.target.matches('#status')){
                console.log('#status');
                saveStatusToServerNewFunction()
            }
            if(e.target.matches('#progress')){
                saveStatusToServerNewFunction()
            }
            if(e.target.matches('#creditStatus')){
                saveStatusToServerNewFunction()
            }
            if(e.target.matches('#apptDate')){
                saveStatusToServerNewFunction()
            }
            if(e.target.matches('#ss')){
                saveStatusToServerNewFunction()
            }
            if(e.target.matches('#docs')){
                saveStatusToServerNewFunction()
            }
        })
        
    }else{
        console.log('no user logged');
    }
})

async function saveStatusToServer(leadStatus, contractDate){
    let voltioId = document.getElementById('leadVoltioId').value
    let proposalStatus = document.getElementById('proposalStatus').value
    let projectType = document.getElementById('projectType').value
    let status = document.getElementById('status').value
    let progress = document.getElementById('progress').value
    let apptDate = document.getElementById('apptDate').value
    let creditStatus = document.getElementById('creditStatus').value
    let ss = document.getElementById('ss').check
    let docs = document.getElementById('docs').check
      
    // se debe agregar el status a la bd leadData
      const projectInfoData = query(collection(db, 'leadData'), where('voltioIdKey', '==', voltioId));
      const querySnapshootData = await getDocs(projectInfoData)
      const docIdData = querySnapshootData.forEach( async(docs) => {
         await updateDoc(doc(db, "leadData", docs.id), {
             projectStatus: status,
             progress: progress,
             status: leadStatus,
             contractDate: contractDate
           })
      })

    await setDoc(doc(db, "leadStatus", voltioId), {
        proposalStatus: proposalStatus,
        projectType: projectType,
        status: status,
        progress: progress,
        apptDate: apptDate,
        creditStatus: creditStatus,
        
    }).then( async() => {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'updated!',
            showConfirmButton: false,
            timer: 1500
        })
        let progressBar = document.getElementById('progressBar')
        progressBar.innerHTML = progress
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
      ['Expecting MP1', '30%'],
      ['MP1 Paid', '33%'],
      ['Design and Permits', '34%'],
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
      ['MPU scheduled', '63%'],
      ['MPU installed', '66%'],
      ['Expecting MP2', '69%'],
      ['MP2 Paid', '72%'],
      ['Pending Final Inspection', '75%'],
      ['Final inspection scheduled', '78%'],
      ['Final inspection completed', '81%'],
      ['Corrections needed', '84%'],
      ['Submitted for PTO', '87%'],
      ['PTO In Progress', '90%'],
      ['Pending Utility Company', '90%'],
      ['System activated', '93%'],
      ['Final Documents', '95%'],
      ['Job completed', '100%']]
      let cons = progressValues.map( r => r[0])
      const posIndex = cons.indexOf(progress)
      const value = progressValues[posIndex][1]
      progressBar.style.width = value
      
    }).catch((error) => {
        // Swal.fire({
        //     position: 'top-end',
        //     icon: 'warning',
        //     title: 'An error has occurred, please try again. ' + error,
        //     showConfirmButton: false,
        //     timer: 1500
        //   })
        console.log(error);
          return
    })   
}

async function saveStatusToServerNewFunction(){
    let voltioId = document.getElementById('leadVoltioId').value
    let proposalStatus = document.getElementById('proposalStatus').value
    let projectType = document.getElementById('projectType').value
    let projectStatus = document.getElementById('status').value
    let progress = document.getElementById('progress').value
    let apptDate = document.getElementById('apptDate').value
    let creditStatus = document.getElementById('creditStatus').value
    let ss = document.getElementById('ss').check
    let docs = document.getElementById('docs').check
    let status = proposalStatus === 'Sold' ? 'Project' : 'lead'  
    // se debe agregar el status a la bd leadData
      const projectInfoData = query(collection(db, 'leadData'), where('voltioIdKey', '==', voltioId));
      const querySnapshootData = await getDocs(projectInfoData)
      const docIdData = querySnapshootData.forEach( async(docs) => {
         await updateDoc(doc(db, "leadData", docs.id), {
             progress: progress,
             status: status
           })
      })

    await setDoc(doc(db, "leadStatus", voltioId), {
        proposalStatus: proposalStatus,
        projectType: projectType,
        progress: progress,
        apptDate: apptDate,
        creditStatus: creditStatus,
        status: projectStatus
        
    }).then( async() => {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'updated!',
            showConfirmButton: false,
            timer: 1500
        })
        let progressBar = document.getElementById('progressBar')
        progressBar.innerHTML = progress
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
      ['Expecting MP1', '30%'],
      ['MP1 Paid', '33%'],
      ['Design and Permits', '34%'],
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
      ['MPU scheduled', '63%'],
      ['MPU installed', '66%'],
      ['Expecting MP2', '69%'],
      ['MP2 Paid', '72%'],
      ['Pending Final Inspection', '75%'],
      ['Final inspection scheduled', '78%'],
      ['Final inspection completed', '81%'],
      ['Corrections needed', '84%'],
      ['Submitted for PTO', '87%'],
      ['PTO In Progress', '90%'],
      ['Pending Utility Company', '90%'],
      ['System activated', '93%'],
      ['Final Documents', '95%'],
      ['Job completed', '100%']]
      let cons = progressValues.map( r => r[0])
      const posIndex = cons.indexOf(progress)
      const value = progressValues[posIndex][1]
      progressBar.style.width = value
      
    }).catch((error) => {
        // Swal.fire({
        //     position: 'top-end',
        //     icon: 'warning',
        //     title: 'An error has occurred, please try again. ' + error,
        //     showConfirmButton: false,
        //     timer: 1500
        //   })
        console.log(error);
          return
    })   
}