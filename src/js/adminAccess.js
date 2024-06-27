import { getStorage , ref, uploadBytes, getDownloadURL } 
from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js"
import { getFirestore, doc, getDoc, collection, getDocs, query, where, deleteDoc, orderBy, updateDoc, setDoc, addDoc  } 
from '../firebase/firebaseJs.js'
import { app, auth } from '../firebase/config.js'
import { onAuthStateChanged, updateProfile } from '../firebase/firebaseAuth.js';
import { getApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
const db = getFirestore(app) 
let rolSuperAdmin = document.querySelectorAll('.rolSuperAdmin')
let rolAdmin = document.querySelectorAll('.rolAdmin')
let rolRep = document.querySelectorAll('.rolRep')
let rolManager = document.querySelectorAll('.rolManager')
let rolRegManager = document.querySelectorAll('.rolRegManager')
let noRol = document.querySelectorAll('.norol')
let accessLevel

onAuthStateChanged(auth, async(user) => {
    if(user){
        const docRef = doc(db, "userProfile", user.email);
        const docSnap = await getDoc(docRef);
        
        accessLevel = docSnap.data().accessLevel
        if (docSnap.exists()) {
            
        if(accessLevel === 'superadmin'){
            console.log("Document data super admin:", docSnap.data());
            rolAdmin.forEach((e)=>{
                e.style.display = 'block'
            })

        }else if(accessLevel === 'admin'){
            console.log('admin');
            rolAdmin.forEach((e)=>{
                e.style.display = 'block'
            })
        }else if(accessLevel === 'regionalmanager'){
            console.log('Regional manager');
            rolAdmin.forEach((e)=>{
                e.style.display = 'none'
            })
        }else if(accessLevel === 'manager'){
            console.log('manager');
            rolAdmin.forEach((e)=>{
                e.style.display = 'none'
            })
        }else if(accessLevel === 'Rep' || !docSnap.data().accessLevel){
            console.log('Rep');
            rolAdmin.forEach((e)=>{
                e.style.display = 'none'
            })
        }

        } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        load_view('profile')
        noRol.forEach((e)=>{
            e.style.display = 'none'
        })

        }

    }else{
        console.log('no user logged');
    }
})