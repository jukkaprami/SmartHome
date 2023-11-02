const Pool = require('pg').Pool;
const cron = require('node-cron');
const priceService = require('./priceService');
const logger = require('./logger')
const settings = require('./database_and_timer_settings.json');

const database = settings.database;
const timer = settings.timer;

const pool = new Pool(
    database
);

let lastFetchedDate = '1.1.2023';

let message = '';
const logFile = 'dataOperationsLog';

cron.schedule(timer, () => {
    try {
        let timestamp = new Date();
        let dateStr = timestamp.toLocaleDateString();

        if (lastFetchedDate != dateStr) {
            /*console.log('Started fetching price data ');*/

            message = 'Started fetching price data';
            console.log(message);
            logger.add2log(message, logFile);


            priceService.fetchLatestPriceData().then((json) => {
                json.prices.forEach(async (element) => {
                    let values = [element.startDate, element.price];
                    const sqlClause = 'INSERT INTO public.hourly_price VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *';
                    const runQuery = async () => {
                        let resultset = await pool.query(sqlClause, values);
                        return resultset;
                    }
                    runQuery().then((resultset) => {
                        if (resultset.rows[0] != undefined) {
                            message = 'Added a row'
                        }
                        else {
                            message = 'Sipped an existing row'
                        }
                        console.log(message);
                        logger.add2log(message, logFile)
                    })
            });
        });
            lastFetchedDate = dateStr;

            message = 'Fetched at ' + lastFetchedDate;
            console.log(message);
            logger.add2log(message, logFile);
           
        } else {
            message = 'Next scheduled event: Data has been successfully retrieved earlier today';
            console.log(message);
            logger.add2log(message, logFile);
        }
    } catch (error) {
        message = 'An error occured (' + error.toString() + '), trying again in 5 minutes until 4 PM';
        console.log(message);
        logger.add2log(message, logFile);
    }
});