self.addEventListener("push", (event) => {
    // Lógica para manejar la recepción de una notificación push
    const payload = event.data.json();
    const title = payload.title;
    const options = {
      body: payload.body,
      
      // otras opciones de configuración de la notificación
    };
    event.waitUntil(self.registration.showNotification(title, options));
  });
  