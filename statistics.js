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