 // ESIMERKKI TESTATTAVASTA FUNKTIOSTA
// ==================================

const bodyMassIndex = (height, weight) => {
    let bmi = weight / (height * height);
    return bmi;
};

// Export all functions (in this example only one)
module.exports = {bodyMassIndex};