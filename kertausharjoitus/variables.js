// MUUTTUJAT JA OLIOT
// ==================

// YKSINKERTAISET MUUTTUJAT
// ------------------------

// Määritellään muuttuja antamalla sille arvo
age = 93;
console.log(age); // 93

// Vanhanaikainen tapa määritellä muuttuja: var
var firstName; // Määritellään muuttuja, mutta ei anneta sille arvoa
console.log(firstName); // undefined
firstName = 'Kullervo'; // Muutetaan muuttujan arvoa
console.log(firstName); // Kullervo

// Nykyaikainen tapa muuttujan määrittelyyn: let
let lastName; // Määritellään muuttuja, mutta ei anneta sille arvoa
console.log(lastName); // undefined
lastName = 'Kalske'; // Muutetaan muuttujan arvoa
console.log(lastName); // Kalske
// let lastName = 'Palo'; // Johtaa virheseen, ei voi määritellä uudelleen

// Nykyaikainen tapa muuttujan (vakion) määrittelyyn: const
// Tavoitteena estää muuttujien ja erityisesti vakiona määritellyn funktion ylikirjoittaminen
const fullName = 'Jussi Jurkka'; // Määritellään ja annetaan arvo (pakollista)
//fullName = 'Emmi Jurkka'; // Johtaa virheeseen, ei voi antaa uutta arvoa
// const fullName = 'Joel Rinne' Johtaa virheeseen, ei voi määritellä uudelleen

// MUUTTUJIEN NÄKYVYYS
// -------------------
planet = 'earth'; // Aina globaali, sijainnista riippumatta
var continent = 'Europe'; // Aina globaali, sijainnista riippumatta
const country = 'Finland'; // Globaali, koska ei ole minkään lohkon sisällä
let alliance = 'EU'; // Globaali, koska ei ole minkään lohkon sisällä

function chairOfAlliance() {
  const country = 'Spain'; // Paikallinen, koska lohkon {} sisällä
  planet = 'Mars'; // Globaali muuttuja määritellään uudelleen
  console.log(country, 'is the chair of', alliance, 'council');
}

chairOfAlliance(); // Kutsutaan funktiota, jossa country on Spain
console.log('Global constant country is still', country); // Finland
console.log("Elon Musk wants to create a colony on", planet); // Mars

// Muuttujan tietotyypin voi selvittää typeof-operaattorilla
console.log('country is a', typeof country); // String
console.log('age is a', typeof age); // Number
console.log('chairOfAlliance() is a', typeof chairOfAlliance); // Function, huom ei sulkuja!

// Vakiota voi muuttaa toistorakenteen sisällä
// Muutetaan vakion arvoa 4 kierroksen silmukassa
for (i = 0; i < 4; i++) {
  const element = i; // indeksin kulloinenkin arvo
  console.log('The value of constant named element is now', element);
}

// RAKENTEELLISET MUUTTUJAT
// ------------------------

// Vektori / lista
const teachers = ['Tuomas', 'Jussi', 'Mikko', 'Mika'];
console.log('On mondays', teachers[0], 'will be teaching'); // Ensimmäinen alkio -> Tuomas

// Vektoriin lisääminen ja poistaminen
teachers.push('Mari') // Lisätään Mari
console.log('There is now', teachers.length, 'teachers in the array') // 5
console.log('And now we remove last element who was', teachers.pop()) // Mari
console.log('There is now', teachers.length, 'teachers in the array') // 4
console.log('Remove the first element who was', teachers.shift()) // Tuomas
teachers.unshift('Sirkku') // Lisätään Sirkku vektorin ensimmäiseksi alkioksi
console.log('Lista on nyt:', teachers)

// Vektorin aakkostaminen
console.log('Teachers in alphabetical order are:', teachers.sort())

// Jono ja pino
// ------------

// Jono FiFo (First in, First out)
const jono = [];
let palvelusvuorossa = ''
jono.push('eka'); // Ensimmäinen alkio
jono.push('toka');
palvelusvuorossa = jono.shift() // Ensimmäisenä jonoon tullut (eka)

// Pino LiFo (Last in, First out)
let pino = [];
let kasittelyssa = ''
pino.push('eka')
pino.push('toka')
kasittelyssa = pino.pop() // Viimeisenä pinoon lisätty (toka)

// Moniulotteinen vektori / taulukko
const priceTable = [
  ['milk', 1, 1.13],
  ['electric drill', 100, 124],
];
console.log(priceTable[1][0], 'costs', priceTable[1][2], 'euros incl. VAT');

// Joukko
// Joukko voidaan luoda vakioksi, koska itse joukkoa ei muuteta, ainoastaan sen alkioita
const nerds = new Set(); // Luodaan joukko Set-luokan avulla
nerds.add('Jonne'); // Lisätään alkio joukkoon
nerds.add('Jakke');
nerds.add('Calle');
nerds.add('Jonne'); // Jonnea ei lisätä, koska hän on jo joukossa
console.log(nerds); // Set(3) { 'Jonne', 'Jakke', 'Calle' }
nerds.delete('Calle'); // Poistetaan Calle

// Luodaan funktio, jolla käsitellään joukon jäsentä
// Funktio tarvitsee kaksi argumenttia, indeksin ja joukon
function callNames(index, set) { // set-argumentin voi jättää pois
  console.log('You bloody nerd', index); // Haukutaan yksittäistä alkiota
}

// Käytetään joukon forEach-metodia, jolle annetaan argumentiksi callback-funtio
nerds.forEach(callNames); // Nimitellään kaikkia joukon jäseniä vuorotellen
nerds.clear(); // Tyhjennetään joukko
console.log(nerds); // Set(0) {}

// Avain-arvo-parit eli sanakirjat luodaan Map-luokasta
const contactInfo = new Map();
contactInfo.set('givenname', 'Jonne'); // Asetetaan avain ja arvo
contactInfo.set('surname', 'Janttari');
contactInfo.set('age', 17);

console.log(contactInfo); //Map(3) { 'givenname' => 'Jonne', 'surname' => 'Janttari', 'age' => 17 }

// Haetaan tietoja avainten perusteella
console.log(
  contactInfo.get('givenname'),
  'is',
  contactInfo.get('age'),
  'years old'
);

// OLIOT
// -----

// Yksinkertainen olio ilman luokkaa
const priceEntry = { hour: '10:00:00', price: 1.25 };
console.log(
  'at',
  priceEntry.hour,
  'electricity will cost',
  priceEntry.price,
  'cents'
);

// Luokka on olion malli
class Lecture {
  // Olionmuodostin
  constructor(topic, teacher, room, date) {
    this.topic = topic; // this on viittaus tulevaan olioon
    this.teacher = teacher;
    this.room = room;
    this.date = date;
  }

  // Luokkaan sisältyvä funktio eli metodi
  motto() {
    return 'uusin on paras, vai onko sittenkään?';
  }
}

// Luodaan olio luokasta
const jsKertaus = new Lecture('Kertaus', 'Vainio', 'A253', '10.10.2023');

// Testataan olion ominaisuuksia ja metodeja
console.log(jsKertaus.teacher, 'horisee luokassa', jsKertaus.room);
let message = 'Ja kurssin mottona on "' + jsKertaus.motto().toUpperCase() + '"';
console.log(message);

// Kaikki muuttujat ovat Javascriptissä olioita, joilla on valmiit metodit perustoimintoihin
console.log(
  'Muuttuja fullName on tyypiltään',
  typeof fullName,
  'ja sen arvona on',
  fullName
);
let nameParts = fullName.split(' '); // Katkaistaan merkkijono välilyönnin kohdalta
console.log(nameParts); // [ 'Jussi', 'Jurkka' ]

// Tarvittaessa yksinkertaisen muuttujan voi muös luoda käyttäen alkeisluokkia:
const numberAsStringObject = new String(123);
console.log(
  numberAsStringObject,
  'on tietoyypiltään nyt',
  typeof numberAsStringObject
);
console.log(
  'tekstiobjektimuuttujassa',
  numberAsStringObject,
  'on',
  numberAsStringObject.length,
  'kirjainta'
);