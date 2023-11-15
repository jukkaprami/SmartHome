// EXAMPLE FOR TIME-VALUE-PAIRS FROM XML

// LIBRARIES AND MODULES TO IMPORT
// -------------------------------

// File system services
const fs = require('fs');

// Camaro offers functions for transofming and beautifying XML
const { transform, prettyPrint } = require('camaro');

/**  
* Async function to convert XML data to array of JS-objects
* @summary Returns an array of JS-objects from given XML according to a template
* @param {str} xmlData The xml string to be converted
* @param {[obj]} template instruction how to convert containing structure and tags 
* @return {[obj]} JS-objects containing element names and values in correct datatype
*/
const xml2objectArray = async (xmlData, template) => {
    const result = await transform(xmlData, template);
    return result
}

// XML data
// --------

const rawXMLTemperature = fs.readFileSync('temperature.xml').toString();
const rawXMLWindSpeed = fs.readFileSync('windSpeed.xml').toString();
const rawXMLWinDirection = fs.readFileSync('windDirection.xml').toString();


// Template is a set of conversion instructions, this retrieves time and temperature
const temperatureTemplate = ['wfs:FeatureCollection/wfs:member/omso:PointTimeSeriesObservation/om:result/wml2:MeasurementTimeseries/wml2:point/wml2:MeasurementTVP',
  {
    timeStamp: 'wml2:time',
    temperature: 'wml2:value'
  }];

// Call the function, get results and convert to an array of objects
xml2objectArray(rawXMLTemperature, temperatureTemplate).then(result => {
  weatherData = result; // When promise is fullfilled store data
  console.log(weatherData) // See timestamps and temperatures
});

// This retrieves time and 10 minutes avg. wind speed
const windSpeedTemplate = ['wfs:FeatureCollection/wfs:member/omso:PointTimeSeriesObservation/om:result/wml2:MeasurementTimeseries/wml2:point/wml2:MeasurementTVP',
{
  timeStamp: 'wml2:time',
  windspeed: 'wml2:value'
}];

// Call the function, get results and convert to an array of objects
xml2objectArray(rawXMLWindSpeed, windSpeedTemplate).then(result => {
    weatherData = result; // When promise is fullfilled store data
    console.log(weatherData) // See timestamps and temperatures
  });

  const windDirectionTemplate = ['wfs:FeatureCollection/wfs:member/omso:PointTimeSeriesObservation/om:result/wml2:MeasurementTimeseries/wml2:point/wml2:MeasurementTVP',
  {
    timeStamp: 'wml2:time',
    windDirection: 'wml2:value'
  }];
  
  // Call the function, get results and convert to an array of objects
  xml2objectArray(rawXMLWindDirection, windDirectionTemplate).then(result => {
      weatherData = result; // When promise is fullfilled store data
      console.log(weatherData) // See timestamps and wind directions
    });