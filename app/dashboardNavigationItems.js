
//cancelarReserva,
let casasDeApuestasTab = document.getElementById("casasDeApuestasTab")
let depRetiTab = document.getElementById("depRetiTab")
let clientesTab = document.getElementById('clientesTab');

let casasDeApuestasSection = document.getElementById("casasDeApuestasSection")
let depRetiSection = document.getElementById("depRetiSection")
let clientesSection = document.getElementById('clientesSection');

clientesTab.addEventListener("click", function () {
    clientesTab.className = "nav-link active"
    casasDeApuestasSection.className = "nav-link"
    depRetiSection.className = "nav-link"

    clientesSection.style.display = "block"
    casasDeApuestasSection.style.display = "none"
    depRetiSection.style.display = 'none'
})

casasDeApuestasTab.addEventListener("click", function () {
    clientesTab.className = "nav-link "
    casasDeApuestasSection.className = "nav-link active"
    depRetiSection.className = "nav-link"
    
    clientesSection.style.display = "none"
    casasDeApuestasSection.style.display = "block"
    depRetiSection.style.display = 'none'
})

depRetiTab.addEventListener("click", function () {
    clientesTab.className = "nav-link"
    casasDeApuestasSection.className = "nav-link"
    depRetiSection.className = "nav-link active"
    
    clientesSection.style.display = "none"
    casasDeApuestasSection.style.display = "none"
    depRetiSection.style.display = 'block'
})
