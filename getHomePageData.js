// A MODULE TO RETRIEVE HOME PAGE DATA FROM POSTGRESQL SERVER
// ==========================================================

// LIBRARIES AND MODULES
// ---------------------

// The pg-pool library for PostgreSQL Server
const Pool = require('pg').Pool;

<<<<<<< HEAD
// DATABASE SETTINGS
=======
// APP SETTINGS
>>>>>>> 4050ebef07dc2b918cfbd9c2696568a02ea236d8
// ------------

// Create a new pool for Postgres connections
const pool = new Pool({
    user: 'postgres', // In production always create a new user for the app
    password: 'Q2werty',
    host: 'localhost', // Or localhost or 127.0.0.1 if in the same computer
    database: 'smarthome',
    port: 5432
  });

  // Function for running SQL operations asyncronously
  const getCurrentPrice = async () => {
<<<<<<< HEAD
    let resultset = await pool.query('SELECT price FROM public.current_prices');
    return resultset;
  }
  
module.exports = {getCurrentPrice}    
=======
    let resultset = await pool.query('SELECT price FROM hourly_price');
    return resultset;
  }

  module.exports = {getCurrentPrice}

  
>>>>>>> 4050ebef07dc2b918cfbd9c2696568a02ea236d8
