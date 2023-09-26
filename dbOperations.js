// DATABASE OPERATIOS TO SAVE DATA FROM PORSSISAHKO.NET
// ====================================================

// LIBRARIES AND MODULES
const Pool = require('pg').Pool

// Create a pool object with connection details, by default 10 concurrent users
const pool = new Pool({
    user: 'postgres', // In production allways create a new user for the app
    password: 'Q2werty',
    host: '192.168.196.10', // Or localhost or 127.0.0.1 if in the same computer
    database: 'electricity_prices',
    port: 5432
})

// Insert a new record to hourly_price table, direct approach
let time = '2023-09-25T12:30:00Z'
let price = 0.03

pool.query('INSERT INTO public.hourly_price (timeslot, price) VALUES ($1, $2)', [time, price])

// Another way to write SQL clause and use asyncroneous operation

const sqlClause = 'INSERT INTO public.hourly_price (timeslot, price) VALUES ($1, $2) RETURNING *';
let values = ['2023-09-25T12:30:00Z', 0.03];

const res = await pool.query(sqlClause, values);
console.log('tallennettiin seuraavat tiedot', res.rows[0]);

module.exports= {
    pool
}