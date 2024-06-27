import { getFirestore, doc, getDoc, collection, getDocs, query, where, deleteDoc, orderBy, updateDoc, setDoc, limit, addDoc  } from '../firebase/firebaseJs.js'
import { app, auth, messaging } from '../firebase/config.js'
import { getToken } from '../firebase/firebase-messaging.js'
import { onAuthStateChanged, updateProfile } from '../firebase/firebaseAuth.js';

const db = getFirestore(app) 

requestPermission()

function requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        // Add the public key generated from the console here.
        getToken(messaging, {vapidKey: "BPcJ8vbCULzwgPKx2BehtV1CWhKXrwadjXqescuwKSGSSrQ5FC2yWZ4ZDRWg1ecIC3FfbEqw0Bdnii5v0MHQKXU"})
        .then((currentToken) => {
            if (currentToken) {
                console.log(currentToken);
            // Send the token to your server and update the UI if necessary
            // ...
            } else {
            // Show permission request UI
            console.log('No registration token available. Request permission to generate one.');
            // ...
            }
        }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
            // ...
        });

        } else {
            console.log("no hay permiso para notificacion");
        } 
    })
}


