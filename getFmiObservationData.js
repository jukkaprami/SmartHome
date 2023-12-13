// A MODULE FOR FETCHING FMI OBSERVATIONS AND FORECASTS AND SAVING RETRIEVED DATA TO A DATABASE

// Libraries and Modules

// Axios for using http or http requests to get data
const axios = require('axios');

const { transform, prettyPrint } = require('camaro');
const Pool = require('pg').Pool;
const settings = require('./database_and_timer_settings.json')

const database = settings.database;

const pool = new Pool(
    database
);

// A class for creating various weather observation objects containing URL and template
class WeatherObservationTimeValue {
    constructor(place, parameterCode, parameterName) {
        this.place = place;
        this.parameterCode = parameterCode;
        this.parameterName = parameterName;

        // Creates an URL combining predefined query and place and parametercode like t2m (temperature)
        this.url =
            'https://opendata.fmi.fi/wfs/fin?service=WFS&version=2.0.0&request=GetFeature&storedquery_id=fmi::observations::weather::timevaluepair&place=' +
            this.place +
            '&parameters=' +
            this.parameterCode;

        // Constant XML path to the begining of time-value-pairs
        this.WFSPath =
            'wfs:FeatureCollection/wfs:member/omso:PointTimeSeriesObservation/om:result/wml2:MeasurementTimeseries/wml2:point/wml2:MeasurementTVP';

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

    // A method to test that weather data is aviable in a correct form
    getFMIDataAsXML() {
        axios.request(this.axiosConfig).then((response) => {
            console.log(response.data)
        })
    }           
    
    // A method to convert XML data to an array of objects
    readAndConvertToArray() {
        axios.request(this.axiosConfig).then((response) => {
            transform(response.data, this.xmlTemplate).then((result) => {
                console.log(result)
                return result
            })
        })
        
    }
    // A method to fetch and convert weather data and save it into a database
    putTimeValuePairsToDb() {
        
        // Define the name of table to insert values which will be parameterName and _observation. Build correct table name.
        let tableName = this.parameterName + '_observation';

        // Build a SQL clause to insert data
        const sqlClause = 'INSERT INTO public.' + tableName + ' VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING *';

        // Use Axios to fetch data from FMI
        axios
            .request(this.axiosConfig)
            .then((response) => {
                // If promise has been fulfilled convert data to an array
                // XML is in the data portion (ie. body) of the response -> response.data
                transform(response.data, this.xmlTemplate)
                    .then((result) => {

                        // Loop elements of the array
                        result.forEach((element) => {

                            // Create a vector for values
                            let values = [element.timeStamp, element[this.parameterName], this.place]
                            // console.log(values);

                            // Define a function to run SQL clause
                            const runQuery = async () => {
                                let resultset = await pool.query(sqlClause, values);
                                return resultset;
                            }

                            // Call query function and log status of operation
                            runQuery().then((resultset) => {
                                let message = '';

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
                        console.log(error);
                    })
            })
    };

}

const test = new WeatherObservationTimeValue('Turku', 'wd_10min', 'wind_direction');
// test.getFMIDataAsXML()
test.readAndConvertToArray()

// temperature = parameter Code 't2m'
// wind_speed m/s = 'ws_10min'
// wind_direction asteina = 'wd_10min'
// test.putTimeValuePairsToDb()



