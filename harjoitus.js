let height = 1.8
let weight = 80
const dateofBirth = ' 10.10.1980';

const coder = new Map;
coder.set('fullname', 'Matti Meikäläinen');
coder.set('language', 'JavaScript');
coder.set('preferedjob', 'Fullstack developer');
coder.set('favoriteDb', 'MongoDB');

class Programmer {
    constructor(name, language, preferedJob, favouriteDb) {
        this.fullname = name;
        this.languange = language;
        this.preferedJob = preferedJob;
        this.favouriteDb = favouriteDb;
    }
}

const arrayofCoders = []

const coder1 = new Programmer('Matti Meikäläinen', 'JavaScript', 'Fullstack developer', 'MongoDB');
arrayofCoders.push(coder1);
const coder2 = new Programmer('Jari Jokunen', 'Python', 'Backend developer', 'PostgreSQL');
arrayofCoders.push(coder2);


class ProgrammerWithMethod {
    constructor(name, language, preferedJob, favouriteDb) {
        this.fullname = name;
        this.language = language;
        this.preferedJob = preferedJob;
        this.favouriteDb = favouriteDb;
}

calculateAverage(array) {
    let avg = 0;
    let sum = 0;

    for (let index = 0; index < array.lenght; index++) {
        const element = array[index];
        sum = sum + element;
    }

    avg = sum / array.length;
    return avg;
}};