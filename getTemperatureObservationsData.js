// A MODULE FOR FETCHING FMI OBSERVATIONS AND FORECASTS
// AND SAVING RETRIEVED DATA TO A DATABASE
// ====================================================

// LIBRARIES AND MODULES
// ---------------------

// Axios for using http or https requests to get data
const axios = require('axios');

// Camaro to parse and beautify XML data
const { transform, prettyPrint } = require('camaro');

// Scheduler to fetch temperature forecast data from FMI
const cron = require('node-cron');

// The pg-pool library for PostgreSQL Server
const Pool = require('pg').Pool;

// Module to access DB settings
const AppSettings = require('./handleSettings')


// DATABASE SETTINGS
// -----------------
const appSettings = new AppSettings('settings.json')
const settings = appSettings.readSettings()

// Create a new pool for Postgres connections using settings file parameters
const pool = new Pool({
    user: settings.user,
    password: settings.password,
    host: settings.server,
    database: settings.db,
    port: settings.port
});

// Use a date variable to keep track of successful data retrievals
let lastFetchedDate = '1.1.2023'; // Initial value, in production use settings file
let message = ''
const logFile = 'dataOperations.log'

// Run a function every day in 30 minute intervals
cron.schedule('*/30 * * * *', () => {
    console.log('This will be executed daily at every 30 minutes')

    // If the date of last successful fetch is not the current day, fetch data
    if (lastFetchedDate != dateStr) {
        message = 'Started fetching price data'
                                
          // Loop through temperature data and pick startDate and temperature elements
          json.temperatures.forEach(async (element) => {
            let values = [element.startDate, element.temperature];
          
    }
    
    )

}})

// A class for creating various weather objects containing URL and template
class WeatherObservationTimeValuePair {
    constructor(place, parameterCode, parameterName) {
        this.place = place;
        this.parameterCode = parameterCode;
        this.parameterName = parameterName

        // Creates an URL combining predefined query and place and parametercode like t2m (temperature)
        this.url =
            'https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::observations::weather::hourly::multipointcoverage&place=' +
            place +
            '&parameters=' +
            parameterCode;

        // Constant XML path to the begining of time-value-pairs
        this.WFSPath =
            'wfs:FeatureCollection/wfs:member/omso:GridSeriesObservation/om:result/gmlcov:MultiPointCoverage';
        
        // Names for the columns of the resultset
        let names = { timeStamp: 'wml2:time', value: 'number(wml2:value)' };

        // Change the name of the value key to the given parameter name
        names[this.parameterName] = names['value']
        delete names['value'] // Must be removed

        // Create a template for Camaro transformations
        this.xmlTemplate = [
            this.WFSPath,
            names,
        ];

        this.axiosConfig = {
            method: 'get',
            maxBodyLength: 'infinity',
            url: this.url,
            headers: {},
        };
    }

    // A method to test that weather data is available in a correct form
    getFMIDataAsXML() {
        axios.request(this.axiosConfig).then((response) => {
            console.log(response.data)
        })
    }

    // A method to to convert XML data to an array of objects
    async convertXml2array(xmlData, template) {
        const result = await transform(xmlData, template);
        return result;
    };

    // A method to fethc and convert weather data and save it into a databse
    putTimeValuPairsToDb() {

        // Define the name of table to insert values it will be parameterName and _observation

        // Build correct table name
        const tableName =  'observation_'+ this.parameterName
        // Build a SQL clause to insert data
        const sqlClause = 'INSERT INTO public.' + tableName + ' VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING *';

        // Use Axios to fethc data from FMI
        axios
            .request(this.axiosConfig) // Make the request
            .then((response) => {

                // If promise has been fulfilled convert data to an array
                // XML is in the data portion (ie. body) of the response -> response.data
                transform(response.data, this.xmlTemplate)
                    .then((result) => {

                        // Loop elements of the array
                        result.forEach((element) => {

                            // Create a vector for values 
                            let values = [element.timeStamp, element[this.parameterName], this.place]

                            // Define a function to run SQL clause
                            const runQuery = async () => {
                                let resultset = await pool.query(sqlClause, values);
                                return resultset;
                            }

                            // Call query function and log status of operation
                            runQuery().then((resultset) => {

                                // Define a messaget to be logged to console or log file
                                let message = ''

                                // If there is alredy an observation for this time and place -> row is empty ie. undefined
                                if (resultset.rows[0] != undefined) {
                                    message = 'Added a row' // The message when not undefined
                                }
                                else {
                                    message = 'Skipped an existing row' // The message when undefined
                                }

                                // Log the result of insert operation
                                console.log(message);

                            })

                        })
                    })
                    .catch((error) => {
                        // if rejected handle the error
                        console.log(error);
                    });
            });
    };

}

class WeatherForecastTimeValuePair {
    constructor(place, parameterCode, parameterName) {
        this.place = place;
        this.parameterCode = parameterCode;
        this.parameterName = parameterName

        // Creates an URL combining predefined query and place and parametercode like t2m (temperature)
        this.url =
            'https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::observations::weather::hourly::multipointcoverage&place='
            + place +
            '&parameters=' +
            parameterCode;

        // Constant XML path to the begining of time-value-pairs
        this.WFSPath =
            'wfs:FeatureCollection/wfs:member/omso:GridSeriesObservation/om:result/gmlcov:MultiPointCoverage';

        // Names for the columns of the resultset
        let names = { timeStamp: 'wml2:time', value: 'number(wml2:value)' };

        // Change the name of the value key to the given parameter name
        names[this.parameterName] = names['value']
        delete names['value'] // Must be removed

        // Create a template for Camaro transformations
        this.xmlTemplate = [
            this.WFSPath,
            names,
        ];

        this.axiosConfig = {
            method: 'get',
            maxBodyLength: 'infinity',
            url: this.url,
            headers: {},
        };
    }

    // A method to test that weather data is available in a correct form
    getFMIDataAsXML() {
        axios.request(this.axiosConfig).then((response) => {
            console.log(response.data)
        })
    }

    // A method to to convert XML data to an array of objects
    async convertXml2array(xmlData, template) {
        const result = await transform(xmlData, template);
        return result;
    };

    // A method to fethc and convert weather data and save it into a databse
    putTimeValuPairsToDb() {

        // Define the name of table to insert values it will be parameterName and _observation

        // Build correct table name
        const tableName =  'temperature_'+ this.parameterName

        // Build a SQL clause to insert data
        const sqlClause = 'INSERT INTO public.' + tableName + ' VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING *';

        // Use Axios to fethc data from FMI
        axios
            .request(this.axiosConfig) // Make the request
            .then((response) => {

                // If promise has been fulfilled convert data to an array
                // XML is in the data portion (ie. body) of the response -> response.data
                transform(response.data, this.xmlTemplate)
                    .then((result) => {

                        // Loop elements of the array
                        result.forEach((element) => {

                            // Create a vector for values 
                            let values = [element.timeStamp, element[this.parameterName], this.place]

                            // Define a function to run SQL clause
                            const runQuery = async () => {
                                let resultset = await pool.query(sqlClause, values);
                                return resultset;
                            }

                            // Call query function and log status of operation
                            runQuery().then((resultset) => {

                                // Define a messaget to be logged to console or log file
                                let message = ''

                                // If there is alredy an observation for this time and place -> row is empty ie. undefined
                                if (resultset.rows[0] != undefined) {
                                    message = 'Added a row' // The message when not undefined
                                }
                                else {
                                    message = 'Skipped an existing row' // The message when undefined
                                }

                                // Log the result of insert operation
                                console.log(message);

                            })

                        })
                    })
                    .catch((error) => {
                        // if rejected handle the error
                        console.log(error);
                    });
            });
    };

}
    

// Test reading observation data and storig results to database: Turku temperature
const observationtimeValuePair = new WeatherObservationTimeValuePair('Turku', 't2m');

// Show url to fetch from
console.log(observationtimeValuePair.url);

// Show parsing template to see resultset column names
console.log(observationtimeValuePair.xmlTemplate);
// Show fetched data as XML output
// observationTimeValuePair.getFMIDataAsXML();

// Insert observation data into the database
// observationtimeValuePair.putTimeValuPairsToDb()

// Test reading forecast data and storing results to database: Turku temperatustes
const forecastTimeValuePair = new WeatherForecastTimeValuePair('Turku', 'temperature', 'observation');
console.log(forecastTimeValuePair.url);
console.log(forecastTimeValuePair.xmlTemplate)
    
// Show fetched data as XML output
// forecastTimeValuePair.getFMIDataAsXML()
forecastTimeValuePair.putTimeValuPairsToDb()