import { getFirestore, doc, getDoc, collection, getDocs, query, where, deleteDoc, orderBy, updateDoc, setDoc, addDoc, Timestamp  } from '../firebase/firebaseJs.js'
import { app, auth } from '../firebase/config.js'
import { onAuthStateChanged, updateProfile } from '../firebase/firebaseAuth.js';
 
const db = getFirestore(app) 
let sumByMonth = {}
onAuthStateChanged(auth, async(user)=>{
  if (user) {
    let currentUserEmail = user.email
    getFilteredLeadData()
    // Función para obtener los datos filtrados
    async function getFilteredLeadData() {
      // seccion para obtener el listado de usaurios depende del manager
      const leadRef = collection(db, "leadData");
      const q = query(leadRef, where("profileCloser", "==", currentUserEmail), where('project', '==', 'roofing'));
      
      
      try {
        const querySnapshot = await getDocs(q);
        let countOfLeads = 0
        querySnapshot.forEach((doc) => {
          if(!doc.data().contractDate){
            //console.log('no contract date ' + doc.data().customerName);
          } else{
            //console.log(doc.data().contractDate, doc.data().customerName, doc.data().systemSize + 1);
          
            let firestoreDate = doc.data().contractDate
            let systemSizeSum = !doc.data().systemSize || doc.data().systemSize === ''? 0 : parseFloat(doc.data().systemSize)
            // la siguiente linea es para obtener la grafica de system size ventas
            // let systemSizeSum = !doc.data().systemSize || doc.data().systemSize === ''? 0 : parseFloat(doc.data().systemSize)

            const date = new Date(firestoreDate.seconds * 1000); // Multiplica por 1000 para convertir segundos a milisegundos
            const month = date.toLocaleString('default', { month: 'long' }); // Obtiene el nombre completo del mes
            const year = date.getFullYear(); // Obtiene el año en formato de cuatro dígitos

            

            if(!sumByMonth.hasOwnProperty(month)){
              sumByMonth[month] = 0
            }

            sumByMonth[month] = isNaN(sumByMonth[month]) ? countOfLeads : sumByMonth[month] + (countOfLeads + 1);
            // sumByMonth[month] = isNaN(sumByMonth[month]) ? systemSizeSum : sumByMonth[month] + systemSizeSum;
            
          }
          
          
        })
        createChartBymonth()  
      } catch (error) {
        console.log(error);
      }  
      
    }


  } else {
    console.log('no user logged');    
  }
})

function createChartBymonth(){
  // Obtén la referencia al elemento <div>
  const chartSection = document.getElementById('monthlyChartSection');

  // Crea un elemento <canvas> para la gráfica
  const canvas = document.createElement('canvas');

  // Establece un ancho y alto para el elemento <canvas>
  canvas.width = 400;
  canvas.height = 400;

  // Agrega el elemento <canvas> al elemento <div>
  chartSection.appendChild(canvas);

  // Obtiene el contexto del lienzo
  const ctx = canvas.getContext('2d');

  // Separamos los valores del objeto obtenido en la consulta de firestore

  const labels = Object.keys(sumByMonth);
  const values = Object.values(sumByMonth);

  // Datos de ejemplo para la gráfica de dona
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Leads',
        data: values,
        backgroundColor: ['#078C41'],
      },
    ],
  };

  // Opciones de configuración para la gráfica
  let delayed
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      onComplete: () => {
        delayed = true;
      },
      delay: (context) => {
        let delay = 0;
        if (context.type === 'data' && context.mode === 'default' && !delayed) {
          delay = context.dataIndex * 300 + context.datasetIndex * 100;
        }
        return delay;
      },
    },
  };

  // Crea la gráfica de dona
  new Chart(ctx, {
    type: 'bar',
    data: data,
    options: options,
    label: 'sales'
  });
}
