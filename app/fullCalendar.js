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
                extendedProps: {    'CantidadApuestas': 'Cantidad de apuestas', 
                                    'TotalDineroApostado': '$566', 
                                    'BonoLiberado': '$1,000', 
                                    'PrimerDeposito': '$1,000', 
                                    'BonoHechoPrimerDeposito': '$1200', 
                                    'BonosRecurrentes': '$136'
                                } 
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
                        const event = info.event;
                        const eventTitle = event.title;
                        const eventStart = event.start;
                        const eventEnd = event.end;
                        const eventColor = event.backgroundColor;
                        const extendedProps = event.extendedProps;
                        // Display event details in the modal
                        const modalTitle = document.getElementById('titulo');
                        const modalBody = document.getElementById('modalBody');

                        modalTitle.textContent = eventTitle;
                        modalBody.innerHTML = `
                            <div class="row mb-3">
                            <h3 class="col-md-4 col-sm-12"><strong>Cliente:</strong> ${eventTitle}</h3>
                            <h3 class="col-md-4 col-sm-12"><strong>Fecha:</strong> ${eventStart.toLocaleString()}</h3>
                            </div>
                            ${eventEnd ? `<p><strong>Fecha de fin:</strong> ${eventEnd.toLocaleString()}</p>` : ''}
                            <!--<pre>${extendedProps.CantidadApuestas}</pre>-->
                            <div class="container mt-5">
                                <div class="accordion" id="accordionExample">
                                    <div class="accordion-item">
                                        <h2 class="accordion-header">
                                        <button
                                            class="accordion-button"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseOne"
                                            aria-expanded="true"
                                            aria-controls="collapseOne"
                                        >
                                            Journal
                                        </button>
                                        </h2>
                                        <div
                                        id="collapseOne"
                                        class="accordion-collapse collapse show"
                                        data-bs-parent="#accordionExample"
                                        >
                                        <div class="accordion-body">
                                            <section>
                                            <!-- Row 1 -->
                                            <div class="row mb-3">
                                                <div class="col-md-4 col-sm-12">
                                                <label for="pantallazo" class="form-label"
                                                    >Pantallazo + Telegram</label
                                                >
                                                <input
                                                    type="file"
                                                    class="form-control"
                                                    id="pantallazo"
                                                    name="pantallazo"
                                                    accept="image/*"
                                                />
                                                </div>
                                                <div class="col-md-4 col-sm-12">
                                                <label for="fechaEvento" class="form-label"
                                                    >Fecha del evento</label
                                                >
                                                <input
                                                    type="date"
                                                    class="form-control"
                                                    id="fechaEvento"
                                                    name="fechaEvento"
                                                />
                                                </div>
                                                <div class="col-md-4 col-sm-12">
                                                <label for="mercado" class="form-label">Mercado</label>
                                                <select class="form-select" id="mercado" name="mercado">
                                                    <option value="opcion1">Opción 1</option>
                                                    <option value="opcion2">Opción 2</option>
                                                </select>
                                                </div>
                                            </div>

                                            <!-- Row 2 -->
                                            <div class="row mb-3">
                                                <div class="col-md-4 col-sm-12">
                                                <label for="cantidadApostada" class="form-label"
                                                    >Cantidad apostada</label
                                                >
                                                <input
                                                    type="number"
                                                    class="form-control"
                                                    id="cantidadApostada"
                                                    name="cantidadApostada"
                                                    step="0.01"
                                                />
                                                </div>
                                                <div class="col-md-4 col-sm-12">
                                                <label for="cuota" class="form-label">Cuota</label>
                                                <input
                                                    type="number"
                                                    class="form-control"
                                                    id="cuota"
                                                    name="cuota"
                                                    step="0.01"
                                                />
                                                </div>
                                                <div class="col-md-4 col-sm-12">
                                                <label for="cuotaMinima" class="form-label">Cuota Minima</label>
                                                <input
                                                    type="number"
                                                    class="form-control"
                                                    id="cuotaMinima"
                                                    name="cuotaMinima"
                                                    step="0.01"
                                                />
                                                </div>
                                            </div>

                                            <!-- Row 3 -->
                                            <div class="row mb-3">
                                                <div class="col-md-4 col-sm-12">
                                                <label for="estadoPartido" class="form-label"
                                                    >Estado del partido</label
                                                >
                                                <select
                                                    class="form-select"
                                                    id="estadoPartido"
                                                    name="estadoPartido"
                                                >
                                                    <option value="enCurso">En curso</option>
                                                    <option value="finalizado">Finalizado</option>
                                                </select>
                                                </div>
                                                <div class="col-md-4 col-sm-12">
                                                <label for="balance" class="form-label">Balance</label>
                                                <input
                                                    type="number"
                                                    class="form-control"
                                                    id="balance"
                                                    name="balance"
                                                    step="0.01"
                                                />
                                                </div>
                                                <div class="col-md-4 col-sm-12">
                                                <label for="saldoApostado" class="form-label"
                                                    >Saldo apostado</label
                                                >
                                                <input
                                                    type="number"
                                                    class="form-control"
                                                    id="saldoApostado"
                                                    name="saldoApostado"
                                                    step="0.01"
                                                />
                                                </div>
                                            </div>

                                            <!-- Row 4 -->
                                            <div class="row mb-3">
                                                <div class="col-md-4 col-sm-12">
                                                <label for="nombreBookie" class="form-label">Nombre Bookie</label>
                                                <select class="form-select" id="nombreBookie" name="nombreBookie">
                                                    <option value="bookie1">Bookie 1</option>
                                                    <option value="bookie2">Bookie 2</option>
                                                </select>
                                                </div>
                                                <div class="col-md-4 col-sm-12">
                                                <label for="limitacion" class="form-label">Limitacion</label>
                                                <select class="form-select" id="limitacion" name="limitacion">
                                                    <option value="true" style="color: red">True</option>
                                                    <option value="false" style="color: green">False</option>
                                                </select>
                                                </div>
                                                <div class="col-md-4 col-sm-12">
                                                <label for="videoCasaLimitada" class="form-label"
                                                    >Video casa limitada</label
                                                >
                                                <textarea
                                                    class="form-control"
                                                    id="videoCasaLimitada"
                                                    name="videoCasaLimitada"
                                                    rows="3"
                                                ></textarea>
                                                </div>
                                                <div class="col-md-4 col-sm-12">
                                                <label for="retiro" class="form-label">Retiro</label>
                                                <input
                                                    type="number"
                                                    class="form-control"
                                                    id="retiro"
                                                    name="retiro"
                                                    step="0.01"
                                                />
                                                </div>
                                            </div>

                                            <!-- Submit Button -->
                                            <div class="mb-3">
                                                <button type="button" class="btn btn-primary" id="agregarJournal">
                                                Agregar
                                                </button>
                                            </div>
                                            <!-- Table -->
                                            <div class="table-responsive">
                                                <table
                                                class="table table-bordered mt-4"
                                                id="resultTable"
                                                style="display: none"
                                                >
                                                <thead>
                                                    <tr>
                                                    <th>Pantallazo + Telegram</th>
                                                    <th>Fecha del evento</th>
                                                    <th>Mercado</th>
                                                    <th>Cantidad apostada</th>
                                                    <th>Cuota</th>
                                                    <th>Cuota Minima</th>
                                                    <th>Estado del partido</th>
                                                    <th>Balance</th>
                                                    <th>Saldo apostado</th>
                                                    <th>Nombre Bookie</th>
                                                    <th>Limitacion</th>
                                                    <th>Video casa limitada</th>
                                                    <th>Retiro</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="resultTableBody"></tbody>
                                                </table>
                                            </div>
                                            </section>
                                        </div>
                                        </div>
                                    </div>
                                    <div class="accordion-item">
                                        <h2 class="accordion-header">
                                        <button
                                            class="accordion-button collapsed"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseTwo"
                                            aria-expanded="false"
                                            aria-controls="collapseTwo"
                                        >
                                            Matched Betting
                                        </button>
                                        </h2>
                                        <div
                                        id="collapseTwo"
                                        class="accordion-collapse collapse"
                                        data-bs-parent="#accordionExample"
                                        >
                                        <div class="accordion-body">
                                            <section>
                                            <div class="table-responsive">
                                                <table class="table table-bordered">
                                                <thead>
                                                    <tr>
                                                    <th>Dia Apuesta</th>
                                                    <th>Partido</th>
                                                    <th>Dia Partido</th>
                                                    <th>Tipo de Bono</th>
                                                    <th>Bookie 1</th>
                                                    <th>Apuesta</th>
                                                    <th>Cuota 1</th>
                                                    <th>Cant Apostada</th>
                                                    <th>Bookie 2</th>
                                                    <th>Apuesta</th>
                                                    <th>Cuota 2</th>
                                                    <th>Cant Apostada</th>
                                                    <th>Estado</th>
                                                    <th>Beneficio</th>
                                                    <th>Comentarios</th>
                                                    <th>Ganador</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <!-- Example row, add your data here -->
                                                    <tr>
                                                    <td>01/07/2024</td>
                                                    <td>Partido 1</td>
                                                    <td>02/07/2024</td>
                                                    <td>Bono 1</td>
                                                    <td>Bookie A</td>
                                                    <td>Apuesta 1</td>
                                                    <td>1.5</td>
                                                    <td>100</td>
                                                    <td>Bookie B</td>
                                                    <td>Apuesta 2</td>
                                                    <td>2.0</td>
                                                    <td>150</td>
                                                    <td>En curso</td>
                                                    <td>50</td>
                                                    <td>Sin comentarios</td>
                                                    <td>Equipo A</td>
                                                    </tr>
                                                    <!-- Add more rows as needed -->
                                                </tbody>
                                                </table>
                                            </div>
                                            </section>
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                        
                            </div>
                        `;
                        
                        const agregarJournal = document.getElementById('agregarJournal');
                        agregarJournal.addEventListener('click', function (e) {
                            mostrarConfirmacion()
                        });
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

function mostrarTabla() {
    console.log('buttton presed');
    const pantallazo = document.getElementById('pantallazo').value;
    const fechaEvento = document.getElementById('fechaEvento').value;
    const mercado = document.getElementById('mercado').value;
    const cantidadApostada = document.getElementById('cantidadApostada').value;
    const cuota = document.getElementById('cuota').value;
    const cuotaMinima = document.getElementById('cuotaMinima').value;
    const estadoPartido = document.getElementById('estadoPartido').value;
    const balance = document.getElementById('balance').value;
    const saldoApostado = document.getElementById('saldoApostado').value;
    const nombreBookie = document.getElementById('nombreBookie').value;
    const limitacion = document.getElementById('limitacion').value;
    const videoCasaLimitada = document.getElementById('videoCasaLimitada').value;
    const retiro = document.getElementById('retiro').value;

    const tableBody = document.getElementById('resultTableBody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${pantallazo}</td>
        <td>${fechaEvento}</td>
        <td>${mercado}</td>
        <td>${cantidadApostada}</td>
        <td>${cuota}</td>
        <td>${cuotaMinima}</td>
        <td>${estadoPartido}</td>
        <td>${balance}</td>
        <td>${saldoApostado}</td>
        <td>${nombreBookie}</td>
        <td style="color: ${limitacion === 'true' ? 'red' : 'green'};">${limitacion}</td>
        <td>${videoCasaLimitada}</td>
        <td>${retiro}</td>
    `;

    tableBody.appendChild(newRow);
    document.getElementById('resultTable').style.display = 'table';
}

function mostrarConfirmacion() {
    Swal.fire({
        title: '¿Desea guardar la información en el Journal?',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'CANCEL',
    }).then((result) => {
        if (result.isConfirmed) {
            // Lógica para guardar la información
            mostrarTabla()
            Swal.fire('Guardado', '', 'success');
        } else {
            // Lógica para cancelar la acción
            Swal.fire('Cancelado', '', 'error');
        }
    });
}
