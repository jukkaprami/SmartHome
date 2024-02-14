const synaptic = require('synaptic');
const neuralNetwork = synaptic.Network;

class SynapticModule {
    constructor() {
        this.neuralNetwork = synaptic.Network;
    }
}

// Create objects to build a neural network
const Trainer = synaptic.Trainer;
const Architect = synaptic.Architect;

// The training data 
const trainData = [
    {
        input: [1,0,0.45,0.1],
         output: [0.23]
        
    },

    {
        input: [1,0.04,0.42,0.11],
         output: [0.22]
    },

    {
        input: [0.3,1,0.4],
        output: [0.28,0.9,0.35]
    },

    {
        input: [1,1,1],
        output: [0.9,0.99,0.95]
    }
]

// Create a perceptron using Architect class
// with 3 neurons for input, 3 for hidden layers
// and 1 for output. You can test network by varying amt of hidden layers
const ptron = new Architect.Perceptron(0.5,0.5,0.5,0);

// Create a trainer using perceptron
const trainer = new Trainer(ptron);

// Train the model
trainer.train(trainData)

// Predict result using the model, result should be near 0.6
let prediction =  ptron.activate([0.5,0.5,0.5,0])
console.log('predicted value', prediction)

module.exports = SynapticModule;