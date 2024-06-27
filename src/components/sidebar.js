export function generateSidebarElement() {
    const nav = document.createElement("nav");
    nav.className = "sidebar bg-dark bg-gradient norol userLogged shadow-lg";
    nav.id = "sidebar";
    nav.style.display = "block";
  
    const divHeader = document.createElement("div");
    divHeader.className = "sidebar-header bg-transparent shadow-lg";
    nav.appendChild(divHeader);
  
    const logoLink = document.createElement("a");
    logoLink.href = "#";
    logoLink.className = "noble-ui-logo logo-light d-block mb-2";
    divHeader.appendChild(logoLink);
  
    const logoSpan = document.createElement("span");
    logoSpan.textContent = "Voltio";
    logoLink.appendChild(logoSpan);
  
    const dashboardText = document.createTextNode("Dashboard");
    logoLink.appendChild(dashboardText);
  
    const divBody = document.createElement("div");
    divBody.className = "sidebar-body bg-transparent";
    nav.appendChild(divBody);
  
    const ul = document.createElement("ul");
    ul.className = "navbar-nav me-auto my-3 navbar-nav-scroll";
    ul.style.setProperty("--bs-scroll-height", "700px");
    ul.style.setProperty("--bs-scroll-background", "black");
    ul.id = "sideBarMenu";
    divBody.appendChild(ul);
  
    const dashboardMenuSection = document.createElement("div");
    dashboardMenuSection.className = "container";
    dashboardMenuSection.id = "dashboardMenuSection";
    ul.appendChild(dashboardMenuSection);
  
    const dashboardLi = document.createElement("li");
    dashboardLi.className = "nav-item nav-category text-white p-2";
    dashboardLi.textContent = "Main";
    dashboardMenuSection.appendChild(dashboardLi);
  
    const homeLi = document.createElement("li");
    homeLi.className = "nav-item p-2";
    dashboardMenuSection.appendChild(homeLi);
  
    const homeLink = document.createElement("a");
    homeLink.className = "nav-link dashboardView";
    homeLink.setAttribute("data-bs-toggle", "collapse");
    homeLink.setAttribute("role", "button");
    homeLink.setAttribute("aria-expanded", "false");
    homeLink.setAttribute("aria-controls", "dashboard");
    homeLink.setAttribute("onclick", "load_view('dashboard')");
    homeLi.appendChild(homeLink);
  
    const homeIcon = document.createElement("span");
    homeIcon.className = "material-symbols-outlined text-white dashboardView p-2";
    homeIcon.textContent = "home";
    homeLink.appendChild(homeIcon);
  
    const homeTitle = document.createElement("span");
    homeTitle.className = "link-title dashboardView text-white";
    homeTitle.textContent = "Home";
    homeLink.appendChild(homeTitle);
  
    // ... Rest of the elements
  
    return nav;
  }
  