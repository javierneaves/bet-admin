

function load_view(view, titleText) {
  let title = document.getElementById('title');
  try {
    
    if(view === 'messages'){
      document.getElementById("app").innerHTML= '<object type="text/html" data="src/views/'+ view +
                                                '.html" width="100%" height="100%" alt="menu" id='+view+'></object>';
      title.innerHTML = 'Voltio App '+ titleText                                                
      
                                                
    } else {
      document.getElementById("app").innerHTML= '<object type="text/html" data="src/views/'+ view + 
                                              '.html" width="100%" height="100%"></object>';  
      title.innerHTML = 'Voltio App '+ titleText                                                
    }
    
  } catch (error) {
    document.getElementById("app").innerHTML= '<object type="text/html" data="../src/view/'+ view + 
                                              '.html" width="100%" height="100%" class="messagesMenuCliked"></object>';  
    title.innerHTML = 'Voltio App '+ titleText 
  }
}

function onLoadPage(){
  console.log('loadPage');
  document.getElementById("app").innerHTML='<object type="text/html" data="views/login.html" width="100%" height="100%" ></object>';
}
