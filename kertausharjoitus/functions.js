// FUNKTIOT JA METODIT
// ===================

// Perinteinen funktiomäärittely function-komennolla
function bmi(weight, height) {
    return weight / (height * height)   
}

let myWeight = 70;
let myHeight = 1.7

let myBmi = bmi(myWeight, myHeight)

console.log('Painoindeksini tänään on', myBmi)

// Moderni määritys (ES6-syntaksi)

const es6bmi = (weight, height) => {
    const bmi = weight / (height * height)
    const roundedBmi = Math.round(bmi)
    return roundedBmi
}

console.log('Jos pituus on 160 ja paino sama, painoindeksi on', es6bmi(160, 1.6))

// Kun funtio kuuluu olioon, siitä käytetään nimitystä metodi

// Class definition
class BodyBuilder {

    // Olionmuodostin
    constructor(name, weight, height) {
        this.name = name
        this.weight = weight
        this.height = height
    }
    // Metodi painoineksin palauttamiseksi
    bmi() {
        return Math.round(this.weight / (this.height * this.height))
    }
}

// Luodaan olio BodyBuilder-luokasta
const bodyBuilder = new BodyBuilder('Jakke', 80, 1.8);

// Käytetään olin bmi-metodia
console.log(bodyBuilder.name, 'on hyvässä kunnossa, painoindeksi on', bodyBuilder.bmi())

// CALLBACK FUNKTIOT
// -----------------

// Pääfuntktio, joka saa argumentikseen toisen funktion (callback)
function goodSportsman(fullName, callback) {
    console.log(fullName, 'kuntoilee ja BMI on', callback);
}

// Callback-funktiona käytettävän funktion määritys
function calculateBmi(weight, height) {
    return Math.round(weight / (height * height));
}

// Käytetään funktioita
goodSportsman('Jakke Jäynä',calculateBmi(90, 1.9))

// Nykyaikaisemmalla kirjoitusasulla esimerkki näyttäisi tältä:

// Pääfunktion määritys
const lazyFellow = (fullName, callback) => {
    console.log(fullName, 'löhöää ja nörtteilee. Hänen painoindeksinsä on', callback);
}

// Callback-funktion määritys
const bmiCalculation = (weight, height) => {
    return Math.round(weight / (height * height));
}

// Funktiokutsu näyttäisi tältä
lazyFellow('Jonne Janttari', bmiCalculation(120, 1.8))