import { getFirestore, doc, getDoc, collection, getDocs, query, where, deleteDoc, orderBy, updateDoc, setDoc  } from '../firebase/firebaseJs.js'
import { app, auth } from '../firebase/config.js'
import { onAuthStateChanged, updateProfile } from '../firebase/firebaseAuth.js';
const db = getFirestore(app) 
let searchByEmailBtn = document.getElementById('searchByEmailBtn');
let searchByEmail = document.getElementById('searchByEmail');
let updateProfileButton = document.querySelector('#updateProfileButton')
let profileCountry = document.getElementById('profileCountry');
let getUsersModalBtn = document.getElementById('getUsersModalBtn');


onAuthStateChanged(auth, async(user) => {
    
    searchByEmailBtn.addEventListener('click', async function (e) {
        searchUserByMail()   
    });
    
    profileCountry.addEventListener('change', function (e) {
        country()
    });
    
    
    })

    updateProfileButton.addEventListener('click', (e) =>{
        let userEmail = document.getElementById('voltioEmail').value
        
        onAuthStateChanged(auth, async(user) => {
            if(user){
                const users = collection(db, "userProfile");

                console.log(userEmail);
                let userData = []
                userData.displayName = document.getElementById('profileName').value
                userData.userRank = document.getElementById('userRank').value
                userData.userStatus = document.getElementById('userStatus').value
                userData.personalEmail = document.getElementById('personalEmail').value
                userData.userEmail = userEmail
                userData.profileCountry = document.getElementById('profileCountry').value
                userData.profileRouting = document.getElementById('profileRouting').value
                userData.profileCardNumber = document.getElementById('profileCardNumber').value
                userData.profileClabe = document.getElementById('profileClabe').value
                userData.inputMxState = document.getElementById('inputMxState').value
                userData.profileAccountNumber = document.getElementById('profileAccountNumber').value
                userData.profileAddress = document.getElementById('profileAddress').value
                userData.inputCity = document.getElementById('inputCity').value
                userData.inputState = document.getElementById('inputState').value
                userData.inputZip = document.getElementById('inputZip').value
                userData.profileNotes = document.getElementById('profileNotes').value
                userData.profilePhone = document.getElementById('profilePhone').value
                userData.profileSocialPhone = document.getElementById('profileSocialPhone').value
                userData.profileBirth = document.getElementById('profileBirth').value
                userData.profileFranchise = document.getElementById('profileFranchise').value
                userData.profileFranchiseOwner = document.getElementById('profileFranchiseOwner').value
                userData.profileTeam = document.getElementById('profileTeam').value
                userData.accessLevel = document.getElementById('accessLevel').value
                userData.manager = document.getElementById('manager').value;
                
                //console.log(user.uid);
                updateProfileData(userData)
                console.log(userData);
                
            } else{
                console.log('no user logged xxx');
                document.getElementById('navbar').style.display = 'none'
                document.getElementById('navbar').style.display = 'none'
                document.getElementById('navbar-container').style.display = 'none'
                document.getElementById('sidebar').style.display = 'none'
                let userLogged = document.querySelectorAll('.userLogged')
                userLogged.forEach( btn => {
                    btn.style.display = 'none'
                })
                document.getElementById("app").innerHTML='<object type="text/html" data="/src/views/login.html" width="100%" height="100%" ></object>';
            }

            
        })
    })

    async function updateProfileData(userData){
        const docRef = doc(db, 'userProfile', userData.userEmail)
            await updateDoc((docRef),{
                displayName: userData.displayName,
                userRank: userData.userRank,
                userStatus: userData.userStatus,
                personalEmail: userData.personalEmail,
                userEmail: userData.userEmail,
                profileCountry: userData.profileCountry,
                profileRouting: userData.profileRouting,
                profileCardNumber: userData.profileCardNumber,
                profileClabe: userData.profileClabe,
                inputMxState: userData.inputMxState,
                profileAccountNumber: userData.profileAccountNumber,
                profileAddress: userData.profileAddress,
                inputCity: userData.inputCity,
                inputState: userData.inputState,
                inputZip: userData.inputZip,
                profileNotes: userData.profileNotes,
                profilePhone: userData.profilePhone,
                profileSocialPhone: userData.profileSocialPhone,
                profileBirth: userData.profileBirth,
                profileFranchise: userData.profileFranchise,
                profileFranchiseOwner: userData.profileFranchiseOwner,
                profileTeam: userData.profileTeam,
                updated: 'done',
                accessLevel: userData.accessLevel,
                manager: userData.manager

            }).then( async () => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Your data has been saved',
                    showConfirmButton: false,
                    timer: 1500
                    })
                return
            }).catch( (error) => {
                console.log(error);
            })
    }

    getUsersModalBtn.addEventListener('click', function (e) {
        cargarUsuariosEnTabla()
    });

    function cargarUsuariosEnTabla() {
        const tablaUsuarios = document.querySelector("#myModal table tbody");
    
        // Limpiar la tabla
        tablaUsuarios.innerHTML = "";
    
        // Leer la colección "userProfile" de Firestore
        const usuariosRef = collection(db, "userProfile");
        getDocs(usuariosRef)
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
            const usuario = doc.data();
            const displayName = usuario.displayName;
            const userEmail = usuario.userEmail;
            const manager = usuario.manager;
    
            // Crear una nueva fila en la tabla con los datos del usuario
            const fila = document.createElement("tr");
            const celdaNombre = document.createElement("td");
            const celdaEmail = document.createElement("td");
            const celdaManager = document.createElement("td");
            const celdaBoton = document.createElement("td");
            const boton = document.createElement("button");
            const icon = document.createElement("i");
            celdaNombre.textContent = displayName;
            celdaNombre.className = 'editUser'
            celdaNombre.dataset.id = userEmail
            celdaEmail.textContent = userEmail;
            celdaManager.textContent = manager; 
            boton.className = "btn btn-outlined-primary editUser";
            icon.className = 'bi bi-arrow-right-circle-fill editUser'
            icon.dataset.id = userEmail
            boton.dataset.id = userEmail;
    
            celdaBoton.appendChild(boton);
            boton.appendChild(icon)
            fila.appendChild(celdaNombre);
            fila.appendChild(celdaEmail);
            fila.appendChild(celdaManager);
            fila.appendChild(celdaBoton);
    
            tablaUsuarios.appendChild(fila);
            });
            
            let editUser = document.querySelectorAll('.editUser');
            editUser.forEach(function(item) {
                item.addEventListener('click', function (e) {
                    let id = e.target.dataset.id
                    console.log(id);
                    searchByEmail.value = id
                    searchUserByMail()
                    const modal = document.querySelector("#myModal");
                    const modalBootstrap = bootstrap.Modal.getInstance(modal);
                    modalBootstrap.hide();
                });
            });  
        })
        .catch((error) => {
            console.log("Error al cargar los usuarios: ", error);
        });
    }

    async function searchUserByMail(){
        let email = searchByEmail.value.trim().replace(/\s+/g, "").toLowerCase();
        const profileBd = query(collection(db, 'userProfile'), where('userEmail', '==', searchByEmail.value));
        const querySnapshot = await getDocs(profileBd);
        const allData = querySnapshot.forEach( async(doc) => {
            console.log('else');
            document.getElementById('profileName').value = !doc.data().displayName ? '' : doc.data().displayName
            document.getElementById('userRank').value = !doc.data().userRank ? '' : doc.data().userRank
            document.getElementById('userStatus').value = !doc.data().userStatus ? '' : doc.data().userStatus
            document.getElementById('personalEmail').value = !doc.data().personalEmail ? '' : doc.data().personalEmail
            document.getElementById('voltioEmail').value = !doc.data().userEmail ? '' : doc.data().userEmail
            document.getElementById('profileCountry').value = !doc.data().profileCountry ? '' : doc.data().profileCountry
            document.getElementById('profileRouting').value = !doc.data().profileRouting ? '' : doc.data().profileRouting
            document.getElementById('profileAccountNumber').value = !doc.data().profileAccountNumber ? '' : doc.data().profileAccountNumber
            document.getElementById('profileAddress').value = !doc.data().profileAddress ? '' : doc.data().profileAddress
            document.getElementById('profileCardNumber').value = !doc.data().profileCardNumber ? '' : doc.data().profileCardNumber
            document.getElementById('profileClabe').value = !doc.data().profileClabe ? '' : doc.data().profileClabe
            document.getElementById('inputMxState').value = !doc.data().inputMxState ? '' : doc.data().inputMxState
            document.getElementById('inputCity').value = !doc.data().inputCity ? '' : doc.data().inputCity
            document.getElementById('inputState').value = !doc.data().inputState ? '' : doc.data().inputState
            document.getElementById('inputZip').value = !doc.data().inputZip ? '' : doc.data().inputZip
            document.getElementById('profileNotes').value = !doc.data().profileNotes ? '' : doc.data().profileNotes
            document.getElementById('profilePhone').value = !doc.data().profilePhone ? '' : doc.data().profilePhone
            document.getElementById('profileSocialPhone').value = !doc.data().profileSocialPhone ? '' : doc.data().profileSocialPhone
            document.getElementById('profileBirth').value = !doc.data().profileBirth ? '' : doc.data().profileBirth
            document.getElementById('profileFranchise').value = !doc.data().profileFranchise ? '' : doc.data().profileFranchise
            document.getElementById('profileFranchiseOwner').value = !doc.data().profileFranchiseOwner ? '' : doc.data().profileFranchiseOwner
            document.getElementById('profileTeam').value = !doc.data().profileTeam ? '' : doc.data().profileTeam
            document.getElementById('manager').value = !doc.data().manager ? '' : doc.data().manager
            document.getElementById('accessLevel').value = !doc.data().accessLevel ? '' : doc.data().accessLevel
            
            country()
        })
    }

    function country(){
        
        if(profileCountry.value === 'USA'){
            console.log(profileCountry.value);
            document.getElementById('usaSection').style.display = 'block';
            document.getElementById('mxSection').style.display = 'none';
        } else if (profileCountry.value === 'MX') {
            document.getElementById('usaSection').style.display = 'none';
            document.getElementById('mxSection').style.display = 'block';
        }
    }


  