import { getFirestore, doc, getDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"
import { app } from './firebase.js'
const db = getFirestore(app) 

      const reserva = query(collection(db, 'reservaciones'), where('email', '==', 'neaves2@voltio.us'));
      const querySnapshot = await getDocs(reserva);
      const allData = querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, ' => ', doc.data());
        
      })