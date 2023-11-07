// A MODULE TO MAKE TIME CONVERSIONS FROM FMI DATA
// ===================================================

/**
 * Converts FMI "unix epoc" to ISO timestamp with time zone
 * @summary Multiplies FMI Epoc by 1000 and converts results to ISO string
 * @param {Int} fmiEpoc - Timestamp from FMI data called unix epoc
 * @returns {Str} ISO formatted timestamp with time zone
 */

const fmi2isotimestamp = (fmiEpoc) => {
    let unixEpoc = 1000 * fmiEpoc
    let isoTimestamp = new Date(unixEpoc);
    return isoTimestamp
}

module.exports = {
    fmi2isotimestamp
}