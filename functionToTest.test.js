// TESTS FOR functionToTest MODULE
// ===============================

// Import the module or library to be tested
const functionsToTest = require('./functionToTest');

// Test function uses a callback, don't forget to put () 
test('bmi with height 1.7 and weight 70 eq 24', () => {
    expect(functionsToTest.bodyMassIndex(1.7, 70)).toBe(24.221453287197235);
});