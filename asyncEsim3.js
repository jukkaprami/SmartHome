// ASYNC-AWAIT ESIMERKKI

// Käytetään fsPromises modulin funktiota tiedoston lukemiseen
const fsPromises = require('fs').promises;

// Määritellään asynkroninen funktio

async function readText() {
  // Odotetaan tiedoston lukemisen päättymistä ja tallennetaan tulos tekstinä
  const data = await fsPromises.readFile('asyncEsim.txt', 'utf8');

  // Tulostetaan teksti konsolille
  console.log(data);
};

// Kutsutaan asynkronista funktiota
readText();