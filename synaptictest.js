// SYNAPTIC TEST
// ==============


// LIBRARIES AND MODULES
// ---------------------
const synaptic = require('synaptic')

// Create objects to build a neural network
const Trainer = synaptic.Trainer;
const Architect = synaptic.Architect;

// Define training data, in this example exclusive or function with 2 inputs
// 0,0 -> 0, 0,1 -> 1, 1,0 -> 1, 1,1 -> 0
const trainData = [
    {
        input: [0,0],
        output: [0]
    },
    {
        input: [0,1],
        output: [1]
    },
    
    {
        input: [1,0],
        output: [1]
    },
    {
        input: [1,1],
        output: [0]
    }

]

// Create a perceptron using Architect class
// with 2 neurons for input, 3 for hidden layers
// and 1 for output. You can test network by varying amt of hidden layers
const ptron = new Architect.Perceptron(2,3,1);

// Create a trainer using perceptron
const trainer = new Trainer(ptron);

// Train the model
trainer.train(trainData)

// Predict result using the model, result should be 1 
let prediction =  ptron.activate([1,0])
console.log('Actual value is 1, predicted value', prediction)