const axios = require('axios');

// A class for creating various weather objects containing URL and template
class WeatherObservationTimeValuePair {
    constructor(place, parameterCode, parameterName) {
      this.place = place;
      this.parameterCode = parameterCode;
      this.parameterName = parameterName

      // Creates an URL combining predefined query and place and parametercode like t2m (temperature)
      this.url =
        'https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::observations::weather::timevaluepair&place=' +
        'place=turku' +
        't2m';
  
      // Constant XML path to the begining of time-value-pairs
      this.WFSPath =
        'wfs:FeatureCollection/wfs:member/omso:PointTimeSeriesObservation/om:result/wml2:MeasurementTimeseries/wml2:point/wml2:MeasurementTVP';
    
      // Names for the columns of the resultset
      let names = { timeStamp: 'wml2:time', value: 'number(wml2:value)' };
  
      // Change the name of the value key value to the given parameter name
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
  }}
{
const timeValuePair = new WeatherObservationTimeValuePair('Turku', 't2m', 'temperature');
console.log(timeValuePair.url)
console.log(timeValuePair.xmlTemplate)
timeValuePair.getFMIDataAsXML()
}