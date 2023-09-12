// PROMISE-ESIMERKKI

// Käytetään File System kirjastoa ja sen promise luokkia
//const fs = require('fs');
const fsPromises = require('fs').promises;

// Käytetään fsPromises modulin funktiota tiedoston lukemiseen
fsPromises.readFile("asyncEsim.txt")
    .then(function (result) {
        console.log(result.toString());
    })
    .catch(function (error) {
        console.error(error);
    })