// SYNAPTIC TEST 2
// ==============


// LIBRARIES AND MODULES
// ---------------------
const synaptic = require('synaptic')

// Create objects to build a neural network
const Trainer = synaptic.Trainer;
const Architect = synaptic.Architect;

// The training data 
const trainData = [
    {input: [0,0,0], output: [0]},
    {input: [0,0,1], output: [0.14]},
    {input: [0,1,0], output: [0.28]},
    {input: [0,1,1], output: [0.42]},
    {input: [1,0,0], output: [0.56]},
    {input: [1,0,1], output: [0.71]},
    {input: [1,1,0], output: [0.86]},
    {input: [1,1,1], output: [1]}
]

// Create a perceptron using Architect class
// with 3 neurons for input, 3 for hidden layers
// and 1 for output. You can test network by varying amt of hidden layers
const ptron = new Architect.Perceptron(3,4,4,4,1);

// Create a trainer using perceptron
const trainer = new Trainer(ptron);

// Train the model
trainer.train(trainData)

// Predict result using the model, result should be near 0.71
let prediction =  ptron.activate([1,0,1])
console.log('predicted value', prediction)