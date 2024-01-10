// AN EXAMPLE MODULE FOR RETRIEVING AND STORING MULTIVALUE OBSERVATIONS AND FORECASTS
// ==================================================================================

// LIBRARIES AND MODULES
// ---------------------

// Axios for using http or https requests to get data
const axios = require('axios');

// Camaro to parse and beautify XML data
const { transform, prettyPrint } = require('camaro');

// The pg-pool library for PostgreSQL Server
const Pool = require('pg').Pool;

// Math for making calculations
const math = require('mathjs');

// Module to access DB settings
const AppSettings = require('./handleSettings');
const { response } = require('express');


// DATABASE SETTINGS
// -----------------
const appSettings = new AppSettings('settings.json');
const settings = appSettings.readSettings();

// Create a new pool for Postgres connections using settings file parameters
const pool = new Pool({
  user: settings.user,
  password: settings.password,
  host: settings.server,
  database: settings.db,
  port: settings.port,
});


// CLASS DEFINITIONS
// -----------------

/**
 * Reads observation or forecast multi valued data from FMI's WFS Server.
 * This is a super class for WeatherObservationTable and WeatherForecastTable
 * classes
 */

class WeatherMultiValueData {
  /**
   * Constructor for the class
   * @param {string} baseUrl - FMI's WFS url without place or parameter list.
   * @param {string} place - A Short name of the weather station
   * @param {[string]} parameters - List of parameters, defaults to an empty list
   */

  constructor(baseUrl, place, parameters = []) {
    this.baseUrl = baseUrl;
    this.place = place;
    this.parameters = parameters;

    // Create a default template for time and location values
    this.timeAndPlaceXmlPath = '';
    this.timeAndPlaceDataTag = '';
    this.timeAndPlaceTemplate = [
      this.timeAndPlaceXmlPath,
      this.timeAndPlaceDataTag,
    ];

    // Create a default template for weather parameters
    this.weatherXmlPath = '';
    this.weatheDataTag = '';
    this.weatheDataTemplate = [this.weatherDataXmlPath, this.weatheDataTag];

    // Convert parameter list to a string
    this.parameterString = this.parameters.toString();

    // Build a WFS query string for Axios request
    // If no parameters used leave parameter portion out of WFS query string
    if (this.parameterString == '') {
      this.wfsQuery = this.baseUrl + '&place=' + this.place;
    } else {
      this.wfsQuery =
        this.baseUrl +
        '&place=' +
        this.place +
        '&parameters=' +
        this.parameterString;
    }

    // Define Axios configuration for http/https get method
    this.axiosConfig = {
      method: 'get',
      maxBodyLength: 'infinity',
      url: this.wfsQuery,
      headers: {},
    };
  }

  /**
   * A method to test that WFS data is available. Data is available as response.data
   */

  testRetrieveData() {
    axios.request(this.axiosConfig).then((response) => {
      console.log(response.data);
    });
  }

  /** 
  * Converts FMI "unix" timestamps to ISO-timestamps with time zone
  * @summary Multiplies FMI timestamp by 1000 and converts results to ISO string
  * @param {string} fmiTimestamp - Timestamp from FMI data (Unix seconds)
  * @return {string} ISO formatted timestamp with time zone
  */

  fmiTime2ISOTimestamp(fmiTimestamp) {
    let NumericFmiTimestamp = parseInt(fmiTimestamp)
    let unixTimestamp = 1000 * fmiTimestamp;
    let isoTimestamp = new Date(unixTimestamp);
    return isoTimestamp
  }

  /**
   * A method to set the path to a tag where time and location data starts. Used in Camaro transformations
   * @param {string} xmlPath - A XML path to start of time and location data
   * @param {string} dataTag - The tag used for actual data
   */

  setTimeAndPlaceTemplate(xmlPath, dataTag) {
    this.timeAndPlaceXmlPath = xmlPath;
    this.timeAndPlaceDataTag = dataTag;
    this.timeAndPlaceTemplate = [
      this.timeAndPlaceXmlPath,
      this.timeAndPlaceDataTag,
    ];
  }

  /**
   * Sets a path and a tag to the begining of weather data
   * @param {string} xmlPath - A XML path to start of weather data
   * @param {string} dataTag - The tag used for actual data
   */

  setWeatherDataTemplate(xmlPath, dataTag) {
    this.weatherDataXmlPath = xmlPath;
    this.weatheDataTag = dataTag;
    this.weatheDataTemplate = [this.weatherDataXmlPath, this.weatheDataTag];
  }
/** 
* Shows FMI multi valued data as table like array
* @summary Shows FMI data as an array on the console
*/
  
  getDataAsArray() {
    // Make Axios request and wait for promise to fullfill
    axios.request(this.axiosConfig).then((response) => {
      // Create an empty array for results. This 3D array will consist 2 table like elements
      // First containing latitude, longitude, empty column and time value in UNIX seconds
      // Second contains weather observation or forecast values in same order as time values
      let resultArray = [];

      // Create an empty 2D array for final results in for inserting into a weather table
      let finalTable = []

      // Make Camaro transformation and wait for promise to get time and place information
      transform(response.data, this.timeAndPlaceTemplate)
        .then((result) => {
          let trimmedTableArrayTime = []; // An empty array for time and location table
          let rowString = result.toString(); // Convert array to a string for splitting
          let rowArray = rowString.split('\n'); // Split by newline to an array -> row
          rowArray.shift(); // Remove the 1 st row which is empty
          rowArray.pop(); // Remove the last row which is also empty
          rowArray.forEach((element) => {
            let trimmedRow = element.trim();
            let columnArray = trimmedRow.split(' ');
            trimmedTableArrayTime.push(columnArray);
          });
          // console.log('Time table data is', trimmedTableArrayTime);
          resultArray.push(trimmedTableArrayTime);
        })

        // When all time and place information has been processed start processing weather data
        .then(() => {
          transform(response.data, this.weatheDataTemplate).then((result) => {
            let trimmedTableArrayValues = []; // An empty array for time and location table
            let rowString = result.toString(); // Convert array to a string for splitting
            let rowArray = rowString.split('\n'); // Split by newline to an array -> row
            rowArray.shift(); // Remove the 1 st row which is empty
            rowArray.pop(); // Remove the last row which is also empty
            rowArray.forEach((element) => {
              let trimmedRow = element.trim();
              let columnArray = trimmedRow.split(' ');
              trimmedTableArrayValues.push(columnArray);
            });
            
            resultArray.push(trimmedTableArrayValues);

            if (resultArray[0].length == resultArray[1].length) {
              
              // Loop rows from time and value data from 3D array
              for (let rowIndex = 0; rowIndex < resultArray[0].length; rowIndex++) {
                const timeRow = resultArray[0][rowIndex]; // Lat, lon and time
                const dataRow = resultArray[1][rowIndex]; // Observations or forecasts
                let finalRow = []; // An empty array to store a row for the final table
                
                // Loop lat, lon and time columns
                for (let columnIndex = 0; columnIndex < timeRow.length; columnIndex++) {
                  const timeColumn = timeRow[columnIndex];
                  finalRow.push(timeColumn); 
                };
                
                // Loop weather columns
                for (let columnIndex = 0; columnIndex < dataRow.length; columnIndex++) {
                  const dataColumn = dataRow[columnIndex];
                  finalRow.push(dataColumn); 
                };

                finalTable.push(finalRow); // Put the row into final table like array
              }
              console.log(finalTable);
                          
            } else {
              consologe.log('Inconsistent data')
            }
  
          });
         
        });
    });
  
  }
}
/**
 * Reads a multi value weather odbservation data from FMI's WFS server and
 * Stores data to an existing table on a PostgreSQL Database.
 * Inherits WeatherMultiValueData class properties and methods
 * @extends WeatherMultiValueData
 */

class BasicWeatherObservationTable extends WeatherMultiValueData {
  /**
   * Constructor for the class
   * @param {string} baseUrl - FMI's WFS url without place or parameter list.
   * @param {string} place - A Short name of the weather station.
   * @param {[string]} parameters - List of parameters, defaults to temperature and windspeed.
   * @param {string} tableName - Name of the observation table, defaults to observation.
   */
  constructor(baseUrl, place, parameters = ['temperature', 'windspeedms'], tableName = 'observation') {
    super(baseUrl, place, parameters);
    this.tableName = tableName;
  }

  /** 
  * Writes raw FMI data to an existing table in which all coluns must be type of char or varchar.
  * @summary Save FMI data to a table without type conversions
  *
  */
  
  writeRawDataToTable() {
      // Make Axios request and wait for promise to fullfill
      axios.request(this.axiosConfig).then((response) => {
        // Create an empty array for results. This 3D array will consist 2 table like elements
        // First containing latitude, longitude, empty column and time value in UNIX seconds
        // Second contains weather observation or forecast values in same order as time values
        let resultArray = [];
  
        // Create an empty 2D array for final results in for inserting into a weather table
        let finalTable = []
  
        // Make Camaro transformation and wait for promise to get time and place information
        transform(response.data, this.timeAndPlaceTemplate)
          .then((result) => {
            let trimmedTableArrayTime = []; // An empty array for time and location table
            let rowString = result.toString(); // Convert array to a string for splitting
            let rowArray = rowString.split('\n'); // Split by newline to an array -> row
            rowArray.shift(); // Remove the 1 st row which is empty
            rowArray.pop(); // Remove the last row which is also empty
            rowArray.forEach((element) => {
              let trimmedRow = element.trim();
              let columnArray = trimmedRow.split(' ');
              trimmedTableArrayTime.push(columnArray);
            });
            // console.log('Time table data is', trimmedTableArrayTime);
            resultArray.push(trimmedTableArrayTime);
          })
  
          // When all time and place information has been processed start processing weather data
          .then(() => {
            transform(response.data, this.weatheDataTemplate).then((result) => {
              let trimmedTableArrayValues = []; // An empty array for time and location table
              let rowString = result.toString(); // Convert array to a string for splitting
              let rowArray = rowString.split('\n'); // Split by newline to an array -> row
              rowArray.shift(); // Remove the 1 st row which is empty
              rowArray.pop(); // Remove the last row which is also empty
              rowArray.forEach((element) => {
                let trimmedRow = element.trim();
                let columnArray = trimmedRow.split(' ');
                trimmedTableArrayValues.push(columnArray);
              });
              // console.log('Value table data is', trimmedTableArrayValues);
              resultArray.push(trimmedTableArrayValues);
  
              if (resultArray[0].length == resultArray[1].length) {
                
                const sqlOperation = 'INSERT INTO '
                const tablePath = 'public.' + this.tableName
                const totalColums = resultArray[0][0].length + resultArray[1][0].length
                const valuePlaceHolderArray = []

                for (let placeindex = 1; placeindex <= totalColums; placeindex++) {
                  const placeHolder = '$'+placeindex;
                  valuePlaceHolderArray.push(placeHolder)  
                }

                const valuePlaceholderString = ' VALUES (' + valuePlaceHolderArray.toString() + ') '
                const conflictString = 'ON CONFLICT DO NOTHING'
                const sqlClause = sqlOperation + tablePath + valuePlaceholderString + conflictString

                // Loop rows from time and value data from 3D array
                for (let rowIndex = 0; rowIndex < resultArray[0].length; rowIndex++) {
                  const timeRow = resultArray[0][rowIndex]; // Lat, lon and time
                  const dataRow = resultArray[1][rowIndex]; // Observations or forecasts
                  let finalRow = []; // An empty array to store a row for the final table
                  
                  // Loop lat, lon, place and time columns
                  for (let columnIndex = 0; columnIndex < timeRow.length; columnIndex++) {
                    let timeColumn = timeRow[columnIndex];

                    // If a column is empty put place in it (3rd column is empty)
                    if (timeColumn == '') {
                      timeColumn = this.place
                    }
                    finalRow.push(timeColumn); 
                  };
                  
                  // Loop weather columns
                  for (let columnIndex = 0; columnIndex < dataRow.length; columnIndex++) {
                    const dataColumn = dataRow[columnIndex];
                    finalRow.push(dataColumn); 
                  };
  
                  const insertToTable = async () => {
                    await pool.query(sqlClause, finalRow);
                  };

                  insertToTable();

                }
                
              } else {
                consologe.log('Inconsistent data')
              }
    
              
            });
           
          });
      });
    
    
  }
/** 
* Writes FMI data to an existing table and convert data to correct datatypes.
* @summary Save data into a table and change datatypes to correct ones
*/
  
  writeTypedDataToTable() {
    // Make Axios request and wait for promise to fullfill
    axios.request(this.axiosConfig).then((response) => {
      // Create an empty array for results. This 3D array will consist 2 table like elements
      // First containing latitude, longitude, empty column and time value in UNIX seconds
      // Second contains weather observation or forecast values in same order as time values
      let resultArray = [];

      // Create an empty 2D array for final results in for inserting into a weather table
      let finalTable = []

      // Make Camaro transformation and wait for promise to get time and place information
      transform(response.data, this.timeAndPlaceTemplate)
        .then((result) => {
          let trimmedTableArrayTime = []; // An empty array for time and location table
          let rowString = result.toString(); // Convert array to a string for splitting
          let rowArray = rowString.split('\n'); // Split by newline to an array -> row
          rowArray.shift(); // Remove the 1 st row which is empty
          rowArray.pop(); // Remove the last row which is also empty
          rowArray.forEach((element) => {
            let trimmedRow = element.trim();
            let columnArray = trimmedRow.split(' ');
            trimmedTableArrayTime.push(columnArray);
          });
          // console.log('Time table data is', trimmedTableArrayTime);
          resultArray.push(trimmedTableArrayTime);
        })

        // When all time and place information has been processed start processing weather data
        .then(() => {
          transform(response.data, this.weatheDataTemplate).then((result) => {
            let trimmedTableArrayValues = []; // An empty array for time and location table
            let rowString = result.toString(); // Convert array to a string for splitting
            let rowArray = rowString.split('\n'); // Split by newline to an array -> row
            rowArray.shift(); // Remove the 1 st row which is empty
            rowArray.pop(); // Remove the last row which is also empty
            rowArray.forEach((element) => {
              let trimmedRow = element.trim();
              let columnArray = trimmedRow.split(' ');
              trimmedTableArrayValues.push(columnArray);
            });
            // console.log('Value table data is', trimmedTableArrayValues);
            resultArray.push(trimmedTableArrayValues);

            if (resultArray[0].length == resultArray[1].length) {
              
              const sqlOperation = 'INSERT INTO '
              const tablePath = 'public.' + this.tableName
              const totalColums = resultArray[0][0].length + resultArray[1][0].length
              const valuePlaceHolderArray = []

              for (let placeindex = 1; placeindex <= totalColums; placeindex++) {
                const placeHolder = '$'+placeindex;
                valuePlaceHolderArray.push(placeHolder)  
              }

              const valuePlaceholderString = ' VALUES (' + valuePlaceHolderArray.toString() + ') '
              const conflictString = 'ON CONFLICT DO NOTHING'
              const sqlClause = sqlOperation + tablePath + valuePlaceholderString + conflictString

              // Loop rows from time and value data from 3D array
              for (let rowIndex = 0; rowIndex < resultArray[0].length; rowIndex++) {
                const timeRow = resultArray[0][rowIndex]; // Lat, lon and time
                const dataRow = resultArray[1][rowIndex]; // Observations or forecasts
                let finalRow = []; // An empty array to store a row for the final table
                
                // Loop lat, lon, place and time columns
                for (let columnIndex = 0; columnIndex < timeRow.length; columnIndex++) {
                  let timeColumn = timeRow[columnIndex];

                  // If a column is empty put the place in it (3rd column is empty)
                  if (timeColumn == '') {
                    timeColumn = this.place
                  }
                  if (columnIndex == 3) {
                    let realTimestamp = this.fmiTime2ISOTimestamp(timeColumn)
                    timeColumn = realTimestamp
                    
                  }
                  finalRow.push(timeColumn); 
                };
                
                // Loop weather columns
                for (let columnIndex = 0; columnIndex < dataRow.length; columnIndex++) {
                  const dataColumn = dataRow[columnIndex];
                  finalRow.push(dataColumn); 
                };

                console.log(finalRow)
                /*
                const insertToTable = async () => {
                  await pool.query(sqlClause, finalRow);
                };

                insertToTable(); */

              }
              
            } else {
              consologe.log('Inconsistent data')
            }
  
            
          });
         
        });
    });
  
  }
}

// -------------------------------TESTING----------------------------------
// Some preliminary tests to see that everything is functioning as expected
// ------------------------------------------------------------------------

// Create a new base object for testing
const baseUrl1 =
  'https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::observations::weather::hourly::multipointcoverage';

const place1 = 'Ajos';

const parameters1 = ['temperature','windspeedms']

// Test Camaro templates to extract data from XML
const timePlacePath1 =
  'wfs:FeatureCollection/wfs:member/omso:GridSeriesObservation/om:result/gmlcov:MultiPointCoverage/gml:domainSet/gmlcov:SimpleMultiPoint';

const timePlaceTag1 = 'gmlcov:positions';

const weatherDataPahth1 =
  'wfs:FeatureCollection/wfs:member/omso:GridSeriesObservation/om:result/gmlcov:MultiPointCoverage/gml:rangeSet/gml:DataBlock';

  const valuesTag1 = 'gml:doubleOrNilReasonTupleList';

// Create a new weather observation object
const obserVationTable = new BasicWeatherObservationTable(baseUrl1, place1)

// Set a path and a tag to time and place data
obserVationTable.setTimeAndPlaceTemplate(timePlacePath1, timePlaceTag1)

// Set a path and a tag to weather observations
obserVationTable.setWeatherDataTemplate(weatherDataPahth1, valuesTag1)

// Check the values of the most important properties
console.log('base URL', obserVationTable.baseUrl)
console.log('Axios configuration', obserVationTable.axiosConfig)
console.log('Time and place template', obserVationTable.timeAndPlaceTemplate)
console.log('Weather data template', obserVationTable.weatheDataTemplate)

// Write observation data to a table
obserVationTable.writeTypedDataToTable()