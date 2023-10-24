// HARJOITUKSIA
// ============

/* HARJOITUS 1 - YKSINKERTAISET TIETOTYYPIT
Tallennamme tietoja henkilöstä. Mieti, mitkä tiedot ovat muuttuvia ja mitkä pysyviä ja 
päätä sen perusteella, millä komennolla määrittelet muuttujan.
- Pituus
- Paino
- Syntymäaika
*/

// Mallivastatus 1
let height = 1.7 // Let, koska muuttuva tieto
let weight = 70 // Let, koska muuttuva tieto
const dateOfBirth = '1962-06-26' // Henkilön syntymäpäivä ei muutu


/* HARJOITUS 2
Haluamme tallentaa ohjelmoijasta tietoja avain-arvo-pareina:
- Nimi
- Pääasiallinen ohjelmointikieli
- Suuntautuminen: front end, back end tai full stack
- Mielitietokanta
Luo rakenne ja määrittele arvot.
*/

// Mallivastaus 2
const coder = new Map();
coder.set('fullName', 'Jonne Janttari');
coder.set('language', 'JavaScript');
coder.set('preferedJob', 'Backend');
coder.set('favouriteDb', 'PostgreSQL');


/* HARJOITUS 3
Haluamme tallentaa useamman ohjelmoijan tiedot muuttujaan.
Mitä vaihtoehtoja on käytettävissä?
Luo mielestäsi paras rakenne.
Vektori - yksinkertainen ja helposti läpikäytävissä toistorakenteissa
Joukko - estää kaksoisarvot läpikäynti forEach-metodilla (vaatii CB-funktion)
*/

/* HARJOITUS 4
Määrittele luokka ohjelmoijaa varten ja tee siitä olioita vektoriin
*/
class Programmer {
    constructor(name, language, preferredJob, favouriteDb) {
        this.fullName = name // Ominaisuudella ja argumentilla voi olla eri nimi
        this.language = language // tai ne voivat olla saman nimisiä
        this.preferedJob = preferredJob
        this.favouriteDb = favouriteDb
    }
}

const arrayOfCoders = [] // Tyhjä vektori

// Create a new programmer object
const coder1 = new Programmer('Jonne Janttari', 'Python', 'Frontend', 'MySQL');
arrayOfCoders.push(coder1); // Add it to the array

const coder2 = new Programmer('Jakke Jäynä', 'JavaScript', 'Backend', 'PostgreSQL')
arrayOfCoders.push(coder2);

const coder3 = new Programmer('Calle Keckelberg', 'C++', 'Full stack', 'SQLite')
arrayOfCoders.push(coder3);

console.log('Ja koodarit ovat', arrayOfCoders )

/* HARJOITUS 5
Muokkaa luokkaa siten, että oliolle voidaan antaa lista ammatillisten tutkinnonosien
arvosanoista numeromuodossa. Tee metodi, joka laskee näiden keskiarvon ja palauttaa sen.
*/

class ProgrammerWithMethod {
    constructor(name, language, preferedJob, favouriteDb) {
        this.fullName = name; // Ominaisuudella ja argumentilla voi olla eri nimi
        this.language = language; // tai ne voiva olla sanaman nimisiä
        this.preferedJob = preferedJob;
        this.favouriteDb = favouriteDb;
    }

    // Metodi keskiarvon laskemiseksi argumenttina annetusta arvosanalistasta
    calculateAverage(array) {
        let avg = 0; // Alustetaan keskiarvo 0:ksi
        let sum = 0; // Alustetaan summa 0:ksi

        // Käydään alkiot läpi silmukassa
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            sum = sum + element
            
        }

        // Keskiarvo on lukujen summa jaettuna lukumäärällä
        avg = sum / array.length;
        return avg; // Palautetaan laskettu keskiarvo
        } 
}

const coder4 = new ProgrammerWithMethod('Assi Kalma', 'C#', 'Backend', 'MS SQL')
console.log('Assin keskiarvo on', coder4.calculateAverage([2,5,4,5]))

/* Harjoitus 6 luo funktio, joka laskee vektorin alkioiden keskihajonnan perinteisellä tavalla
 Funktiolle annetaan argumenteiksi vektori ja haluttu desimaalien määrä*/

/* Harjoitus 7 Muuta edellisen harjoituksen funktio ES6-muotoon
*/

const stdDev = (array, decimals) => {
    const deviation = mathjs.std(array);
    const roundedDev = mathjs.round(deviation, decimals);
    return roundedDev;
}

console.log(stdDev([1,3,1,3], 1))

/* Harjoitus 8 Määrittele luokka, jossa on metodit keskiarvon,
keskihajonnan ja varianssin, suurimman ja pienimmän arvon laskemiseksi
argumenttina annetusta vektorista. */

/* Keskimäärin voi tarkoittaa montaa eri tavalla laskettua arvoa:
1. Keskiarvo (average) on lukujen summa jaettuna niiden lukumäärällä
2. Keskiluku (mean) luvut järjestetään suuruusjärjestykseen ja otetaan keskimäinen arvo. 
Jos sitä ei ole, otetaan kahden keskimmäisen luvun keskiarvo
3. Tyyppiarvo (mode) arvo, joka esiintyy useimmin listassa
*/

class ArrayStats {
    constructor(array, decimals) {
        this.array = array;
        this.decimals = decimals;
    }

    average() {
        let avg = 0; // Alustetaan keskiarvo 0:ksi
        let sum = 0; // Alustetaan summa 0:ksi

        // Käydään alkiot läpi silmukassa
        for (let index = 0; index < this.array.length; index++) {
            const element = this.array[index];
            sum = sum + element
            
        }

        // Keskiarvo on lukujen summa jaettuna lukumäärällä
        avg = sum / this.array.length;
        return avg; // Palautetaan laskettu keskiarvo
        } 

    
    variance() {
        const arrayVarianve = mathjs.variance(this.array);
        const roundedArrayVariance = mathjs.round(arrayVarianve, this.decimals);
        return roundedArrayVariance;

    }
    stdDev() {
        const arrayDeviation = mathjs.std(this.array);
        const roundeArrayDeviation = mathjs.round(arrayDeviation, this.decimals);
        return roundeArrayDeviation;

    }

    max() {
        const arrayMax= mathjs.max(this.array);
        const roundeArrayMax = mathjs.round(arrayMax, this.decimals);
        return roundeArrayMax;

    }

    min() {
        const arrayMin= mathjs.min(this.array);
        const roundeArrayMin = mathjs.round(arrayMin, this.decimals);
        return roundeArrayMin;
    }

}

const arrayStats = new ArrayStats([1,3,1,3], 1)
console.log('Keskiarvo on', arrayStats.average())
console.log('Varianssi on', arrayStats.variance())
console.log('Keskihajonta on', arrayStats.stdDev())
console.log('Minimi on', arrayStats.min())
console.log('Maksimi on', arrayStats.max())

/* HARJOITUS 9
Tee edellisen tehtävän luokasta CJS kirjasto ja anna se muiden ohjelmien käyttöön export-komennolla
*/
// A CJS LIBRARY TO CALCULATE BASIC STATISTICAL CHARASTERISTICS OF AN ARRAY
// ========================================================================

// LIBRARIES
// ---------

// Statistical operations are based on math.js library
// It is not built-in Math class, need to install this 1st
const mathjs = require('mathjs'); 

// A class to calculate statistical characteristics at given precision
class ArrayStats {
    constructor(array, decimals) {
        this.array = array;
        this.decimals = decimals;
    }


    // Average ie aritmeettinen keskiarvo 
    mean() {
        const arrayMean = mathjs.mean(this.array);
        const roundedMean = mathjs.round(arrayMean, this.decimals);
        return roundedMean


    }

    /* Median ie keskiluku eli järjestetyn lukujonon keskimmäinen arvo 
    (pariton määrä lukuja) tai kahden keskimmäisen arvon keskiarvo 
    (parillinen määrä lukuja)
    */
    median() {
        const arrayMedian = mathjs.median(this.array);
        const roudedArrayMedian = mathjs.round(arrayMedian, this.decimals);
        return roudedArrayMedian;

    }
    // Mode ie tyyppiarvo eli luku, joka esiintyy eniten lukujoukossa
    mode() {
        const arrayMode = mathjs.mode(this.array);
        return arrayMode

    }

    // Variation of popultation ie populaation varianssi
    populationVariance() {
        const arrayVariance = mathjs.variance(this.array, 'uncorrected');
        const roundedArrayVariance = mathjs.round(arrayVariance, this.decimals);
        return roundedArrayVariance;

    }

    // Standard deviation of population ie populaation keskihajonta
    populationStdDev() {
        const arrayDeviation = mathjs.std(this.array, 'uncorrected');
        const roundedArrayDeviation = mathjs.round(arrayDeviation, this.decimals);
        return roundedArrayDeviation;

    }

    // Maximum value of array ie maksimi tai suurin arvo
    max() {
        const arrayMax = mathjs.max(this.array);
        const roundedArrayMax = mathjs.round(arrayMax, this.decimals);
        return roundedArrayMax;

    }

    // Minimum value of array ie minimi tai pienin arvo
    min() {
        const arrayMin = mathjs.min(this.array);
        const roundedArrayMin = mathjs.round(arrayMin, this.decimals);
        return roundedArrayMin;
    }

}

module.exports = {
    ArrayStats
}

/*
TESTATAAN, ETTÄ LUOKKA ON KÄYTETTÄVISSÄ TOISESSA MODUULISSA (suttu.js)
*/

const stats = require('./statistics');

const arrayStats = new stats.ArrayStats([1,2,3,44,44,22,22,22],1)
let average = arrayStats.mean() // Average
let median = arrayStats.median() // Number in the middle of the array
let mode = arrayStats.mode() // The most common number in the array
console.log('Ja vektorin alkioiden keskiarvo on', average)
console.log('Ja vektorin alkioiden keskiluku on', median)
console.log('Ja vektorin yleisin alkio on', mode)