fetch('http://localhost:3000/api/test')
  .then(res => res.json())
  .then(data => {
    console.log('Response from server:', data);
    document.body.innerHTML += `<p>${data.message}</p>`;
  })
  .catch(err => {
    console.error('Fetch error:', err);
    document.body.innerHTML += `<p style="color:red;">Could not connect to server</p>`;
  });
