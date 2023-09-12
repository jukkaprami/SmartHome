// CALLBACK-ESIMERKKI

// Käytetään File System -kirjastoa I/O-operaatiohin
const fs = require('fs');

// Synkroninen tiedoston luku, vaihe 1
const dataA = fs.readFileSync('asyncEsim.txt');
//
console.log(dataA.toString());

// Vaihe 2 tehdään kun edellien vaihe on päättynyt
console.log('Tämä on vaihe 2');

// Asynkroninen tiedoston luku, vaihe 3
fs.readFile('asyncEsim.txt', function (err, data) {
    if (err) { 
        console.error(err) }
    else {
        console.log(data.toString())
    } 
})

// Vaihe 4 tehdään ennen kuin vaihe 3 on valmistunut
console.log('Tämä on vaihe 4')