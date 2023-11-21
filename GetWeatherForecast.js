const axios = require('axios');

// Camaro to parse and beautify XML data
const { transform, prettyPrint } = require('camaro');

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: '',
  headers: { }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
// Camaro template for parsing WFS data in XML format -temperature
const temperatureTemplate = [
    'wfs:FeatureCollection/wfs:member/omso:PointTimeSeriesObservation/om:result/wml2:MeasurementTimeseries/wml2:point/wml2:MeasurementTVP',
    {
      timeStamp: 'wml2:time',
      temperature: 'number(wml2:value)',
    },
];
// Url to use when fethcing temperature data
const temperatureUrl = 'https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::observations::weather::timevaluepair&place=turku&parameters=t2m';

