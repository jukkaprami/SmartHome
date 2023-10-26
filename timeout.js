// Schedule to run render every 5 minutes until 4 pm
// =================================================
const schedule = require('node-schedule');

const rule = new schedule.RecurrenceRule();
const microservices = require('./microservices'); 