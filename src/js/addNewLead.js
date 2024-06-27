import { getFirestore, doc, getDoc, collection, getDocs, query, where, deleteDoc, orderBy, updateDoc, setDoc, addDoc  } from '../firebase/firebaseJs.js'
import { app, auth } from '../firebase/config.js'
import { onAuthStateChanged, updateProfile } from '../firebase/firebaseAuth.js';
const db = getFirestore(app) 

let saveLeadButton = document.querySelector('#updateProfileButton')

let leadData
let addNewLeadViewSection = document.querySelectorAll('.addNewLeadViewSection')
let customerPhoneNumber = document.getElementById('customerPhoneNumber')
let profileCloser = document.getElementById('profileCloser');
let profileSetter = document.getElementById('profileSetter');
let leadSetter = document.getElementById('leadSetter'); 
let leadCloser = document.getElementById('leadCloser');

addNewLeadViewSection.forEach((e) =>{
 e.addEventListener('click', (b) => {
    getRepDropdown()
    document.querySelector('#addNewLeadSection').style.display = 'block'
    document.querySelector('#searchProjectSection').style.display = 'none'
    document.querySelector('#profileViewSection').style.display = 'none'

 })   
})

// customerPhoneNumber.addEventListener('onblur', (e) => {
//     let value = e.target.value
//     if(!value){customerPhoneNumber.value = value
//     }
//     let phoneNumber = value.replace(/[^\d]/g, '')
//     let phoneNumberLength = phoneNumber.length
//     if(phoneNumberLength < 4){ customerPhoneNumber.value = phoneNumber} else
//     if(phoneNumberLength < 7) {
//         customerPhoneNumber.value = `(${phoneNumber.slice(0,3)}) ${phoneNumber.slice(3)}`
//     } customerPhoneNumber.value = `(${phoneNumber.slice(0,3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6,10)} `
    
     
// })



saveLeadButton.addEventListener('click', (e) =>{
    getRepDropdown()
    console.log(saveLeadButton.dataset.id);
    let customerLanguage = document.getElementById('customerLanguage').value
    let customerPhoneNumber = document.getElementById('customerPhoneNumber').value
    let customerAddress= document.getElementById('customerAddress').value
    let inputCity= document.getElementById('inputCity').value
    let inputState= document.getElementById('inputState').value
    let customerName= document.getElementById('customerName').value
    let inputZip= document.getElementById('inputZip').value
    let profileBirth= document.getElementById('profileBirth').value

    if(!customerName || !customerAddress || !inputCity || !inputZip || inputState.value === '' ){
        let required = document.querySelectorAll('.required')
        required.forEach((e) => {
            if(e.value != ''){
                e.classList.remove('border-danger')    
            } else {
                e.classList.add('border-danger')    
            }
            
        })
        Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: 'Please enter requiered info',
            showConfirmButton: false,
            timer: 1500
          })
          return
    } else {
        onAuthStateChanged(auth, async(user) => {
            if(user){
                let rep = user.email
                let voltioId = [] 
                // function to get current voltio Id an add new one before save new lead on database        
                const voltioIdDocRef = doc(db, "voltioId", "RfNLJdEPxgQ6WTUb2asd");
                let newVoltioId
                try {
                    const voltioIdDocSnapshot = await getDoc(voltioIdDocRef);

                    if (voltioIdDocSnapshot.exists()) {
                    const currentVoltioId = voltioIdDocSnapshot.data().voltioId;

                    newVoltioId = currentVoltioId + 1;

                    await updateDoc(voltioIdDocRef, { voltioId: newVoltioId });

                    } else {
                    console.log("Document does not exist!");
                    }
                } catch (error) {
                    console.error("Error updating VoltioId: ", error);
                    throw error;
                }
                // function to add new lead to the firestore database, added project
                await addDoc(collection(db, 'leadData'), {
                    customerLanguage: customerLanguage.toUpperCase() ,
                    customerPhoneNumber: customerPhoneNumber.toUpperCase(),
                    customerAddress: customerAddress.toUpperCase(),
                    inputCity: inputCity.toUpperCase(),
                    inputState: inputState.toUpperCase(),
                    customerName: customerName.toUpperCase(),
                    inputZip: inputZip,
                    profileBirth: profileBirth,
                    repName: rep,
                    profileCloser: profileCloser.value,
                    profileSetter: profileSetter.value,
                    voltioIdKey: 'V-'+newVoltioId,
                    status: 'lead',
                    creationDate: new Date(),
                    project: saveLeadButton.dataset.id
                }).then( async() => {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Congrats, new lead has been created',
                        showConfirmButton: false,
                        timer: 1500
                      })
                      
                      // las siguientes 3 lineas se usan para crear un nuevo proyecto en blanco, esto para que se le puedan agregar datos en el futuro
                      const collectionRef = collection(db, 'projectDetails');
                      const documentRef = doc(collectionRef, 'V-'+newVoltioId);
                      await setDoc(documentRef, {});
                      
                      setDataToProfileView('V-'+newVoltioId)
                    document.querySelector('#addNewLeadSection').style.display = 'none'
                    document.querySelector('#searchProjectSection').style.display = 'none'
                    document.querySelector('#profileViewSection').style.display = 'block'
                    
                    document.getElementById('customerName').value = ''
                    document.getElementById('customerPhoneNumber').value = ''
                    document.getElementById('customerAddress').value = ''
                    document.getElementById('inputCity').value = ''
                    document.getElementById('inputState').value = ''
                    document.getElementById('inputZip').value = ''
                    document.getElementById('profileBirth').value = ''
                    profileCloser.value = ''
                    profileSetter.value = ''
                    
                }).catch((error) => {
                    console.log(error);
                })
            } else {
                console.log('no user logged');
            }
        })
    }
    
})

let docId

async function setDataToProfileView(voltioId){
    getRepDropdown()
    
    document.getElementById('titleOfEditLeadView').innerHTML = 'Lead'
    document.getElementById('searchProjectSection').style.display = 'none'
    document.getElementById('profileViewSection').style.display = 'block'
    console.log(voltioId);
    const projectInfo = query(collection(db, 'leadData'), where('voltioIdKey', '==', voltioId));
        const querySnapshoot = await getDocs(projectInfo)
        const allData = querySnapshoot.forEach( async(doc) => {
            let customerNameOnTop = document.getElementById('customerNameOnTop');
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
            profileCloser.value = doc.data().profileCloser
            profileSetter.value = doc.data().profileSetter
            docId = doc.id
        })
    
    const docRef = doc(db, "leadStatus", voltioId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      document.getElementById('proposalStatus').value = docSnap.data().proposalStatus
      document.getElementById('projectType').value = docSnap.data().projectType
      document.getElementById('status').value = docSnap.data().status
      document.getElementById('progress').value = docSnap.data().progress
      document.getElementById('apptDate').value = docSnap.data().apptDate
      document.getElementById('creditStatus').value = docSnap.data().creditStatus
      document.getElementById('ss').value = docSnap.data().ss
      document.getElementById('docs').value = docSnap.data().docs
    } else {
      // doc.data() will be undefined in this case
     console.log("No such document!");
    }
        
}

// GET CLOSER AND SETTER TO ADD NEW LEAD SECTION
// profileCloser
// profileSetter

async function getRepDropdown() {
    const db = getFirestore();
  
    // const userProfileCollection = collection(db, 'userProfile');
  
    // const userProfileSnapshot = await getDocs(userProfileCollection);
    let userEmails = [];
    const q = query(collection(db, "userProfile"));
    const querySnapshot = await getDocs(q);
    userEmails = querySnapshot.docs.map((doc) => doc.data().userEmail);
    
    /*
    userProfileSnapshot.forEach((doc) => {
      userEmails.push(doc.data().userEmail)
    });
    */
    profileCloser.innerHTML = ' '
    profileCloser.appendChild(document.createElement('option'))
    profileSetter.innerHTML = ' '
    profileSetter.appendChild(document.createElement('option'))
    userEmails.forEach(function(item) {
        let el = document.createElement('option');
        el.innerHTML = item
        profileCloser.appendChild(el)
    });
    userEmails.forEach(function(item) {
        let el = document.createElement('option');
        el.innerHTML = item
        profileSetter.appendChild(el)
    });

    return userEmails;
  }
  