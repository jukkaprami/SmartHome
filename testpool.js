// LIBRARIES AND MODULES
// ---------------------

// The pg-pool library for PostgreSQL Server
const Pool = require('pg-pool')

// Create a new pool for Postgres connections
const pool = new Pool({
  user: 'postgres', // In production allways create a new user for the app
  password: 'Q2werty',
  host: 'localhost', // Or localhost or 127.0.0.1 if in the same computer
  database: 'smarthome',
  port: 5432,
});

const sqlClause = 'SELECT * from public.hourly_price';
let query1 = pool.query(sqlClause, (error, results) => {
    if (error) {
        throw error;
    }   
    console.log(results.rows)
});

const query2 = async () => {
let resultset = await pool.query(sqlClause);
return resultset
}

query2()
.then((resultset) => console.log(resultset.rows[0]))

