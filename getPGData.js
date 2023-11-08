// A MODULE TO RETRIEVE WEB PAGE DATA FROM POSTGRESQL SERVER
// =========================================================

// LIBRARIES AND MODULES
// ---------------------

// The pg-pool library for PostgreSQL Server
const Pool = require('pg').Pool;

// A module for reading database settings from a JSON file
const AppSettings = require('./handleSettings')

// DATABASE SETTINGS
// ------------

const appSettings = new AppSettings('settings.json')
const settings = appSettings.readSettings()

console.log(settings.server)

// Create a new pool for Postgres connections using settings file parameters
const pool = new Pool({
    user: settings.user, 
    password: settings.password,
    host: settings.server, 
    database: settings.db,
    port: settings.port
  });

// Function for running SQL operations asyncronously
const getSqlData = async (sqlClause) => {
let resultset = await pool.query(sqlClause);
return resultset;
}

// Function to close all connections of the pool at the end of server session
const endPool = async () => {
await pool.end()
}
  
getSqlData('SELECT * FROM public.current_prices').then((resultset) => {
    console.log(resultset.rows)
})

module.exports = { 
    getSqlData,
    endPool
}