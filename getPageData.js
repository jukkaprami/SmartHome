const Pool = require('pg').Pool; 
const settings = require('./database_and_timer_settings.json');

const database = settings.database;

const pool = new Pool(
    database
);

const getCurrentPrice = async () => {
    let resultset = await pool.query('SELECT price FROM public.current_prices');
    return resultset;
}

const getHourlyPrice = async () => {
    let resultset = await pool.query('SELECT * FROM public.hourly_page');
    return resultset;
}

/*const getDay = async () => {
    let resultset = await pool.query('SELECT day FROM public.hourly_page');
    return resultset;
}

const getHour = async () => {
    let resultset = await pool.query('SELECT hour FROM public.hourly_page');
    return resultset;
}

const getPrice = async() => {
    let resultset = await pool.query('SELECT price FROM public.hourly_page');
    return resultset
}*/

module.exports = {
    getCurrentPrice,
    getHourlyPrice,
    /*getDay,
    getHour,
    getPrice*/
}