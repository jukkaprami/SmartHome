const axios = require('axios');

const { transform, prettyPrint } = require('camaro');
const Pool = require('pg').Pool;
const settings = require('./database_and_timer_settings.json')

const database = settings.database;

const pool = new Pool(
    database
);

class WeatherForecastTimeValue {
    constructor(place) {
        this.place = place;
        this.parameterCode = 'WindDirection,WindSpeedMS,Temperature';

        this.url=
            'https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::observations::weather::hourly::multipointcoverage&place=' +
            this.place +
            '&parameters=' +
            this.parameterCode;

        this.weatherWFSPath =
            'wfs:FeatureCollection/wfs:member/omso:GridSeriesObservation/om:result/gmlcov:MultiPointCoverage/gml:rangeSet/gml:DataBlock';
        this.weatherData =
            'gml:doubleOrNilReasonTupleList';

        this.timeAndPlaceWFSPath =
            'wfs:FeatureCollection/wfs:member/omso:GridSeriesObservation/om:result/gmlcov:MultiPointCoverage/gml:domainSet/gmlcov:SimpleMultiPoint';
        this.timeAndPlaceData =
            'gmlcov:positions'

        this.weatherXmlTemplate = [
            this.weatherWFSPath,
            this.weatherData
        ];

        this.timeAndPlaceXmlTemplate = [
            this.timeAndPlaceWFSPath,
            this.timeAndPlaceData,
        ];

        this.axiosConfig = {
            method: 'get',
            maxBodyLength: 'infinity',
            url: this.url,
            headers: {},
        };
    }
    getFMIDataAsXML() {
        axios.request(this.axiosConfig).then((response) => {
            console.log(response.data)
        })
    }
    readAndConvertToArray() {
        axios.request(this.axiosConfig).then((response) => {
            let storeResponse = response;
            let resultList = [];
            transform(response.data, this.timeAndPlaceXmlTemplate).then((result) => {
                resultList.push(result)   
            }).then(() => {
                transform(storeResponse.data, this.weatherXmlTemplate).then((result) => {
                    resultList.push(result)
                    //console.log(resultList)
                    return resultList
                })
            })             
        })        
    }
}

test = new WeatherForecastTimeValue('turku')
// test.getFMIDataAsXML()
console.log(test.readAndConvertToArray())