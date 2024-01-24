let fmiEpocEsim = 1702379400
/** 
* Converts FMI "unix ecoc" to ISO-timestamp with time zone
* @summary Multiplies FMI Epoc by 1000 and converts results to ISO string
* @param {int} fmiEpoc - Timestamp from FMI data called Unix epoc
* @return {str} ISO formatted timestamp with time zone
*/

const fmi2isotimestamp = (fmiEpoc) => {
    let unixEpoc = 1000 * fmiEpoc;
    let isoTimestamp = new Date(unixEpoc);
    return isoTimestamp
}

console.log(fmi2isotimestamp(fmiEpocEsim))

module.exports = {
    fmi2isotimestamp
}