// Importación de Firebase Auth y otros módulos necesarios
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { auth } from './firebase.js';
import { showMessages } from "./showMessages.js";

// Variables y elementos del DOM
const myModal = new bootstrap.Modal(document.getElementById('setDateModal', {
    keyboard: false
}));
let serviceSelected = 'No hay servicios seleccionados, desea continuar?';
let btnSelected = document.querySelectorAll('.reservar-servicio');
let reservationText = document.querySelector('#reservationText');
let servicioSeleccionado = document.querySelector('#servicioSeleccionado');

// Agregar eventos a botones de servicio
btnSelected.forEach(btn => {
    btn.addEventListener('click', (e) => {
        serviceSelected = e.target.name;
        servicioSeleccionado.style.display = 'block';
        reservationText.textContent = serviceSelected;
    });
});

// Función principal para actualizar el calendario
export const calendarioUpdate = document.addEventListener('DOMContentLoaded', async function() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Simulación de datos de Firestore para pruebas
            const querySnapshot = [
              {
                userAuth: '2tFOCkpC55aSE1iPaidAikhyBUd2',
                start: '2024-06-26',
                calendarInfo: {'cliente': 'Ana'},
                extendedProps: { 'detalle1': 'valor1', 'detalle2': 'valor2' } // Datos adicionales
              },
              {
                userAuth: '2tFOCkpC55aSE1iPaidAikhyBUd2',
                start: '2024-06-27',
                calendarInfo: {'cliente': 'Javier'},
                extendedProps: { 'detalle1': 'valor1', 'detalle2': 'valor2' } // Datos adicionales
              },
              {
                userAuth: '2tFOCkpC55aSE1iPaidAikhyBUd2',
                start: '2024-06-28',
                calendarInfo: {'cliente': 'Luis'},
                extendedProps: { 'detalle1': 'valor1', 'detalle2': 'valor2' } // Datos adicionales
              }
            ];
            
            let pullData = [];
            querySnapshot.forEach((doc) => {
                console.log(doc.userAuth);
                console.log(user.uid);
                let title = doc.userAuth === user.uid ? doc.calendarInfo.cliente : 'Titulo de otro user';
                let color = doc.userAuth === user.uid ? '#004e23' : '#815A00';
                pullData.push({ title: title, start: doc.start, color: color, extendedProps: doc.extendedProps });
            });

            try {
                var calendarEl = document.getElementById('calendar');
                var calendar = new FullCalendar.Calendar(calendarEl, {
                    slotMinTime: '00:00:00',
                    slotMaxTime: '00:00:00',
                    initialView: 'dayGridMonth',
                    locale: 'es',
                    headerToolbar: {
                        left: 'prev,next',
                        center: 'title',
                        right: 'dayGridMonth'
                    },
                    hiddenDays: [1],
                    buttonIcons: {
                        prev: 'arrow-left',
                        next: 'arrow-right',
                    },
                    eventDrop: function (event, delta, revertFunc, jsEvent, ui, view) {
                        eventDropOrResizeHandler(event, delta, revertFunc, jsEvent, ui, view);
                    },
                    eventResize: function (event, delta, revertFunc, jsEvent, ui, view) {
                        eventDropOrResizeHandler(event, delta, revertFunc, jsEvent, ui, view);
                    },
                    events: [...pullData], // Aquí se utilizaban los datos de Firestore
                    eventOverlap: 'false',
                    eventTimeFormat: { // like '14:30:00'
                        hour: '2-digit',
                        minute: '2-digit',
                        meridiem: false
                    },
                    defaultTimedEventDuration: '02:00',
                    select: function (selectInfo) {
                        let endStr = selectInfo.endStr;
                        reservationButton.dataset.reservationDateEnd = endStr;
                    },
                    /* Se deshabilita la funcion de dar click a la fecha, para que el usuario solo pueda dar click al evento
                    dateClick: async function (info) {
                        let date = new Date(info.date);
                        let today = new Date();
                        let months = ["ENE", "FEB", "MAR", 'ABR', "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
                        let hours = date.getHours();
                        let year = date.getFullYear();
                        let hour = hours;
                        let day = date.getDate();

                        if (hour === 0) {
                            calendar.changeView('timeGridDay', info.dateStr);
                        } else {
                            const myModal = new bootstrap.Modal(document.getElementById('setDateModal', {
                                keyboard: false
                            }));

                            const day = date.getDate();
                            const minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                            let reservationDateDay = day + months[date.getMonth()] + year;
                            let overlapCount = [];
                            let numberOfEmployees = 2;

                            let serviceCheck = document.querySelectorAll('.serviceCheck');

                            let services = [];
                            let concatServices = [];
                            serviceCheck.forEach(function (element) {
                                try {
                                    if (element.checked) {
                                        services.push(element.attributes[4].value);
                                        concatServices.push(' ' + element.attributes[4].value);
                                    }
                                } catch (error) {
                                    console.log(error);
                                }
                            });

                            let reservationDate = 'Hola, te gustaría programar la cita el día ' + day + " de " +
                                months[date.getMonth()] + " del " + date.getFullYear() + " a las " + hour + ":" + minute;
                            document.getElementById('start').innerHTML = overlapCount.length >= numberOfEmployees ? employeesAvailable : reservationDate;
                            document.getElementById('services').innerHTML = serviceSelected;
                            const reservationButton = document.getElementById('reservationButton');
                            if (overlapCount.length >= numberOfEmployees) {
                                reservationButton.style.display = 'none';
                                document.getElementById('services').innerHTML = '';
                            } else if (overlapCount.length < numberOfEmployees) {
                                reservationButton.style.display = 'block';
                                reservationButton.dataset.reservationDate = info.dateStr;
                                reservationButton.dataset.reservationDateDay = reservationDateDay;
                                reservationButton.dataset.reservationStartHour = hour;
                                reservationButton.dataset.reservationEndtHour = hour + 2;
                                reservationButton.dataset.services = services;
                            }
                            if (today <= date) {
                                myModal.show();
                            }
                        }

                        return info.date;
                    }, */
                    eventClick: function (info) {
                      console.log(info);
                        const event = info.event;
                        const eventTitle = event.title;
                        const eventStart = event.start;
                        const eventEnd = event.end;
                        const eventColor = event.backgroundColor;
                        const extendedProps = event.extendedProps;
                        console.log(extendedProps);
                        // Display event details in the modal
                        const modalTitle = document.getElementById('titulo');
                        const modalBody = document.getElementById('modalBody');

                        modalTitle.textContent = eventTitle;
                        modalBody.innerHTML = `
                            <p><strong>Fecha de inicio:</strong> ${eventStart.toLocaleString()}</p>
                            ${eventEnd ? `<p><strong>Fecha de fin:</strong> ${eventEnd.toLocaleString()}</p>` : ''}
                            <p><strong>Color:</strong> <span style="color:${eventColor}">${eventColor}</span></p>
                            <p><strong>Detalles adicionales:</strong></p>
                            <pre>${extendedProps.detalle1}</pre>
                        `;

                        myModal.show();
                    }
                });

                calendar.render();
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log('user is not logged on calendar');
            showMessages('Inicia sesión para ver y crear una cita', 'info');
            return;
        }
    });
});
