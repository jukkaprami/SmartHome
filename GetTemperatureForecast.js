const axios = require('axios');

// Camaro to parse and beautify XML data
const { transform, prettyPrint } = require('camaro');

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::observations::weather::timevaluepair&place=turku&parameters=t2m,ws_10min',
  headers: { }
};

axios.request(config)
  
// Camaro template for parsing WFS data in XML format -temperature
const temperatureTemplate = [
    'wfs:FeatureCollection/wfs:member/omso:PointTimeSeriesObservation/om:result/wml2:MeasurementTimeseries/wml2:point/wml2:MeasurementTVP',
    {
      timeStamp: 'wml2:time',
      temperature: 'number(wml2:value)',
    },
];
// Url to use when fethcing temperature data

const temperatureUrl = 'https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::observations::weather::timevaluepair&place=turku&parameters=t2m,ws_10min';

// FUNCTIONS TO GET AND PARSE FMI DATA
// -----------------------------------

/**
 * Async function to convert XML data to an array of JS-objects
 * @summary Returns an array of JS-objects from given XML according to a template
 * @param {str} xmlData The xml string to be converted
 * @param {[obj]} template instruction how to convert containing structure and tags
 * @return {[obj]} JS-objects containing element names and values in correct datatype
 */
const xml2objectArray = async (xmlData, template) => {
  const result = await transform(xmlData, template);
  return result;
};

// Get WFS data from FMI and convert it to an array of time-value-pairs
// --------------------------------------------------------------------

// Set the URL of the end point in Axios configuration

const axiosConfig = config;
axiosConfig.url = temperatureUrl; 

// Call Axios request to get data (and show it)

axios.request(axiosConfig).then((response) => {
  // If promise has been fulfilled convert data to an array
  // XML is in the data portion (ie. body) of the response
  xml2objectArray(response.data, temperatureTemplate)
    .then((result) => {
      // Loop the array and insert values into table
      result.forEach((element) => {
        let values = [element.timeStamp, element.temperature];
        console.log(values);
      });
    })
    .catch((error) => {
      // if rejected handle the error
      console.log(error);
    });
});
