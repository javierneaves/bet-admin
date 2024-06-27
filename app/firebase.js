      // Import the functions you need from the SDKs you need
      import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
      import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
      // TODO: Add SDKs for Firebase products that you want to use
      // https://firebase.google.com/docs/web/setup#available-libraries
      import { getAuth } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"
      // Your web app's Firebase configuration
      // For Firebase JS SDK v7.20.0 and later, measurementId is optional
      // Your web app's Firebase configuration
      const firebaseConfig = {
        apiKey: "AIzaSyD-BlzGCscVVSCKxIlN8-e3q2xso-jHynw",
        authDomain: "bet-spain.firebaseapp.com",
        projectId: "bet-spain",
        storageBucket: "bet-spain.appspot.com",
        messagingSenderId: "293768920602",
        appId: "1:293768920602:web:5de961a076e15c0c081ba3"
      };

      // Initialize Firebase
      export const app = initializeApp(firebaseConfig);
      export const analytics = getAnalytics(app);
      export const auth = getAuth(app)

     
