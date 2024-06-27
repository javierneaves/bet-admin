      
      importScripts("https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js")
      importScripts("https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js")
      importScripts("https://www.gstatic.com/firebasejs/9.14.0/firebase-messaging.js")

      
      const firebaseConfig = {
      apiKey: "AIzaSyAjGrPx5FyahRLAAKNkyMS-7oqOVq5uJHo",
      authDomain: "voltioapp2.firebaseapp.com",
      projectId: "voltioapp2",
      storageBucket: "voltioapp2.appspot.com",
      messagingSenderId: "863200029523",
      appId: "1:863200029523:web:d90575429db1b472f80fa6"
      };
      
      // Initialize Firebase
      
      const app = initializeApp(firebaseConfig);
      // se sugiere esto para la verrsion 7
      const messaging = getMessaging(app)
      // Para la version 9 cambia a:
      //const messaging = getMessaging(app);

      //prueba con las dos en desarrollo

      messagings.setBackgroundMessageHandler(function(payload){
        console.log(payload);
      })
