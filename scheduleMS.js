/* A MICROSERVICE FOR SCHEDULING DATA IMPORTS FROM PORSSISAHKO.NET API 
New data is available daily at 12.00 UTC 14.00 localt time or 15.00 when
daylight saving time or summer time is on. */

// LIBRARIES AND MODULES

const cron = require('node-cron') // The scheduling library

// Run a function every day at 15:30 
cron.schedule('30 15 * * *', () => {
    console.log('This will be executed daily at 15:30')
});

// A test to check sceduler: run it every minute
cron.schedule('* * * * *', () => {
    console.log('This will be executed every minute')
});

// A test to check sceduler: run it every hour
cron.schedule('0 * * * *', () => {
    console.log('This will be executed every hour')
});

// A test to check sceduler: run it every 5 minutes
cron.schedule('*/5 * * * *', () => {
    console.log('This will be executed 5 minutes interval')
});

// Running the task every full hour according to a list
cron.schedule('0 15,19,22 * * *', () => {
    console.log("This will be executed at 3, 7 and 10 o'clock PM")
});

// Runnig the task hourly between 15 and 20
cron.schedule('0 15-20 * * *', () => {
    console.log("This will be executed every hour from 3 to 8 o'clock PM")
});

// Use error handling when running a task
cron.schedule('30 15 * * *', () => {
    try {
        console.log('This will be executed daily at 15:30')}
    catch (error) {
        console.log('An error occurred') }
    });


// Fetch data and try again in 5 minute intervals if an attempt fails

// Use a date variable to keep track of successfull data retrievals
let lastFethcedDate = '1.1.2023' // Initial value, in production use settings file

// Try to run an operation in 5 minute intervals from 3 to 4 PM
cron.schedule('*/5 15 * * *', () => {
    try {
        let timestamp = new Date() // Get the current timestamp
        let dateStr = timestamp.toLocaleDateString() // Take datepart of the timestamp

        // If the date of last sucessfull fetch is not the current day, get data
        if (lastFethcedDate != dateStr) {
            console.log('This is an attempt to run scheduled fetch operation');
            lastFethcedDate = dateStr // Set fetch date to current date

        }

        else {
            console.log('Data has been successfully retrieved earlier today')
        }
    }
        
    catch (error) {
        console.log('An error occurred, trying again in 5 minutes until 4 PM');
        
    }
});