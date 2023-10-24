// UNIT TEST FOR MODULE statistics.js
// ==================================

// LOAD LIBRARIES AND MODULES
// ==========================

const stats = require('./statistics.js');

// Define array and number of decimals for tests
const testArray = [1, 2, 3, 6];
const numberOfDecimals = 1;

// Create an object for statistical calculations
const startToTest = new stats.Arraystats(testArray, numberOfDecimals);

test('Average should be 3.0', () => {
    expect(startToTest.mean()).toBeCloseTo(3.0);
});

const testArray2 = [1, 2, 2, 2, 3, 4];
const statToTest2 = new stats.Arraystats(testArray2, numberOfDecimals);

// Test mode ie most common value
test('Mode should be 2', () => {
    expect(statTotest2.mode()).toEqual([2]);
});

// Test median ie middlemost element in sorted array
const testArray3 = [1, 2, 2, 2, 2, 3, 4];
const statToTest3 = new stats.Arraystats(testArray3, numberOfDecimals);

test(' Median Should be 2', () => {
    expect(statToTest3.median()).toBe(2);
});

// Test median ie 2 middlemost element in sorted array, even elements in array
const testArray4 = [1, 2, 2, 3, 3, 4];
const statTotest4 = new stats.Arraystats(testArray4, numberOfDecimals);

test(' Median should be 2.5', () => {
    expect(statToTest4.median()).toBe(2.5);
});