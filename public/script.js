console.log(Array.from(document.querySelectorAll("blockcode")).filter(elem => elem.attributes.src === undefined))


fetch('http://127.0.0.1:8081/test', {
  method: 'POST', // or ‘PUT’
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({"data": "test"}),
})