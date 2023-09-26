// LIBRARIES AND MODULES
// ---------------------

// The pg-pool library for PostgreSQL Server
const Pool = require('pg-pool')

// The node-cron library to schedule API call to porssisahko.net
const cron = require('node-cron');

// Home made library to access price API from porssisahko.net
const getPrices = require('./getNewPrices');

// APP SETTINGS
// ------------

// Create a new pool for Postgres connections
const pool = new Pool({
  user: 'postgres', // In production allways create a new user for the app
  password: 'Q2werty',
  host: '127.0.0.1', // Or localhost or 127.0.0.1 if in the same computer
  database: 'smarthome',
  port: 5432,
});
// GET, PROCESS AND SAVE DATA
// --------------------------

// Use a date variable to keep track of successfull data retrievals
let lastFetchedDate = '1.1.2023'; // Initial value, in production use settings file

// Try to run an operation in 5 minute intervals from 3 to 4 PM
cron.schedule('*/5 15 * * *', () => {
  try {
    let timestamp = new Date(); // Get the current timestamp
    let dateStr = timestamp.toLocaleDateString(); // Take datepart of the timestamp

    // If the date of last sucessfull fetch is not the current day, fetch data
    if (lastFethcedDate != dateStr) {
      getPrices.fetchLatestPriceData().then((json) => {
        //loop trough prices data and pick startDate and price elements
        json.prices.forEach(async (element) => {
          let values = [element.startDate, element.price];

          // Build a SQL clauset to insert values into table
          const sqlClause =
            'INSERT INTO public.hourly_price VALUES ($1, $2) RETURNING *';

          // Run the insert command and echo results to the console
          const res = await pool.query(sqlClause, values);
          console.log('The following data has been saved', res.rows[0]);
        });
      });
      lastFetcheDate = dateStr; // Set fetch date to current date
    } else {
      console.log('Data has been successfully retrieved earlier today');
    }
  } catch (error) {
    console.log('An error occurred, trying again in 5 minutes until 4 PM');
  }
});
