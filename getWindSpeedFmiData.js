// A MODULE FOR FETCHING FMI OBSERVATIONS AND FORECASTS
// AND SAVING RETRIEVED DATA TO A DATABASE
// ====================================================

// LIBRARIES AND MODULES
// ---------------------

// Axios for using http or https requests to get data
const axios = require('axios');

// Camaro to parse and beautify XML data
const { transform, prettyPrint } = require('camaro');

// The pg-pool library for PostgreSQL Server
const Pool = require('pg').Pool;

// Math for making calculations
const math = require('mathjs')

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


// A class for creating various weather objects containing URL and template
class WeatherObservationTimeValuePair {
    constructor(place, parameterCode, parameterName) {
        this.place = place;
        this.parameterCode = parameterCode;
        this.parameterName = parameterName

        // Creates an URL combining predefined query and place and parametercode like ws_10min (Windspeed)
        this.url =
            'https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::forecast::edited::weather::scandinavia::point::timevaluepair&place=' +
            place +
            '&parameters=' +
            parameterCode;

        // Constant XML path to the begining of time-value-pairs
        this.WFSPath =
         'wfs:FeatureCollection/wfs:member/omso:PointTimeSeriesObservation/om:result/wml2:MeasurementTimeseries/wml2:point/wml2:MeasurementTVP';

        // Names for the columns of the resultset
        let names = { timeStamp: 'vml:time', value: 'number(vml:value)' };

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
/** 
* A constructon to create weather observation object.
* @param {str} place - Name of the place for the weather station.
* @param {str} parameterCode - Name of the FMI weather parameter eg. t2m.
* @param {str} parameterName - Meaning of the FMI weather parameter eg. temperature.
*/
    constructor(place, parameterCode, parameterName) {
        this.place = place;
        this.parameterCode = parameterCode;
        this.parameterName = parameterName

        // Creates an URL combining predefined query and place and parametercode like t2m (temperature)
        this.url =
            'https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::forecast::edited::weather::scandinavia::point::timevaluepair&place='
            + place +
            '&parameters=' +
            parameterCode;

        // Constant XML path to the begining of time-value-pairs
        this.WFSPath =
            'wfs:FeatureCollection/wfs:member/omso:PointTimeSeriesObservation/om:result/wml2:MeasurementTimeseries/wml2:point/wml2:MeasurementTVP';

        // Names for the columns of the resultset
        let names = { timeStamp: 'vml:time', value: 'number(vml:value)' };

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
        const tableName = 'forecast_'+ this.parameterName

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

// A class for calcultaing windspeed from wind vectors V and U

class WindVector {
    /** 
    * Constructor method.
    * @summary Creates a Wind vector object using wind components u and v
    * @param {float} windU - x-component of wind ie. eastward wind
    * @param {float} windV - y-component of wind ie. southward wind
    */
        
        constructor(windU, windV) {
            this.windU = windU;
            this.windV = windV;
            this.windSpeed = math.sqrt(math.square(this.windV) + math.square(this.windV))
        }
        /** 
        * A method to calculate and return wind angles in different formats.
        * @return {obj} Returns wind vector angles (rad, deg, map, wind angles) and wind speed.
        */
        
        windParameters() {
        // Reset all values
        let windAngle = 0; // Wind blows from opposite direction to vector
        let geographicAngle = 0; // Angle of vector in a map
    
        // atan2 returns angle in radians. Arguments are in (y,x) order!
        let xyAngleRad = math.atan2(this.windV, this.windU); 
        let xyAngleDeg = xyAngleRad * 360 /(2 * math.pi); // convert radians to degrees
        
        // Convert x-y plane directions to geographic directions
        // There is 90 degrees shift between x-y and map directions
        if (xyAngleDeg > 90) {
        geographicAngle = 360 - (xyAngleDeg -90);
        }
    
        else {
            geographicAngle = 90 - xyAngleDeg ;
        }
        
        // Wind blow from opposite direction
        if (geographicAngle < 180) {
            windAngle = geographicAngle + 180;
        }
    
        else {
            windAngle = geographicAngle -180
        }
        
        // Return all calculated parameters
        return {
                xyAngleRad: xyAngleRad,
                xyAngleDeg: xyAngleDeg,
                geographicAngle: geographicAngle,
                windAngle: math.round(windAngle),
                windSpeed: math.round(this.windSpeed)
            };
        }
    }

// Test reading observation data and storig results to database: Turku WindSpeed
const observationtimeValuePair = new WeatherObservationTimeValuePair('Turku', 'ws_10min', 'WindSpeedMS');

// Show url to fetch from
console.log(observationtimeValuePair.url);

// Show parsing template to see resultset column names
console.log(observationtimeValuePair.xmlTemplate);
// Show fetched data as XML output
// observationTimeValuePair.getFMIDataAsXML();

// Insert observation data into the database
// observationtimeValuePair.putTimeValuPairsToDb()

// Test reading forecast data and storig results to database: Turku WindSpeed
const forecastTimeValuePair = new WeatherForecastTimeValuePair('Turku', 'windspeed', 'windspeed')
console.log(forecastTimeValuePair.url);
console.log(forecastTimeValuePair.xmlTemplate)

// Show fetched data as XML output
// forecastTimeValuePair.getFMIDataAsXML()
// forecastTimeValuePair.putTimeValuPairsToDb()

let windVector = new WindVector(3, -4)
console.log(windVector.windParameters())