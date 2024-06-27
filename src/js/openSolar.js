const apiURL = 'https://api.opensolar.com';

fetch(apiURL + '/project/' + projectId, {
    headers: {
      'Authorization': 'Bearer ' + apiKey
    }
  })
  .then(response => response.json())
  .then(data => {
    // hacer algo con la respuesta
    console.log(response);
  })
  .catch(error => console.error(error));
  