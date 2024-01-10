const axios = require('axios');

const { transform, prettyPrint } = require('camaro');
const Pool = require('pg').Pool;
const settings = require('./database_and_timer_settings.json');
const timeTransformation = require('./FMIconversions');

// Must change DB settings for the current enviroment
const database = settings.database;

const pool = new Pool(
    database
);

class FullWeatherData {
    constructor(latitude, longitude, timestamp, temperature, wind_speed, wind_direction) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.timestamp = timestamp;
        this.temperature = temperature;
        this.wind_speed = wind_speed;
        this.wind_direction = wind_direction;
    }
}

class WeatherForecast {
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
                    console.log(resultList)
                    return resultList
                })
            })             
        })        
    }

    putWeatherObjectToDb() {
        let tableName = 'weather_forecast';
        const sqlClause = 'INSERT INTO public.' + tableName + ' VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING RETURNING *';
        let allWeahterDataToDb = [];
        let trimmedTDRows = [];
        let trimmedWDRows = [];
        const cutMark1 = '\n';
        const cutMark2 = ' ';

        axios
            .request(this.axiosConfig)
            .then((response) => {
                let storeResponse = response;
                let resultList = [];
                transform(response.data, this.timeAndPlaceXmlTemplate).then((result) => {
                    resultList.push(result);   
                }).then(() => {
                    transform(storeResponse.data, this.weatherXmlTemplate).then((result) => {
                        resultList.push(result);
                        // console.log(resultList);
                        let timeData = {data: resultList[0][0]};
                        let weatherInformationData = {data: resultList[1][0]};
                        // console.log(timeData);
                        // console.log(weatherInformationData);
                        let timeDataString = timeData.data
                        let weatherDataString = weatherInformationData.data
                        // console.log(timeDataString);
                        // console.log(weatherDataString);
                        let tDRows = timeDataString.split(cutMark1);
                        let wDRows = weatherDataString.split(cutMark1)
                        // console.log(tDRows);
                        // console.log(wDRows);
                        tDRows.forEach(element => {
                            let trimmedElement = element.trim();
                            trimmedTDRows.push(trimmedElement);
                        });
                        wDRows.forEach(element => {
                            let trimmedElement = element.trim();
                            trimmedWDRows.push(trimmedElement);
                        });
                        trimmedTDRows.shift();
                        trimmedWDRows.shift();
                        trimmedTDRows.pop();
                        trimmedWDRows.pop();
                        // console.log(trimmedTDRows)
                        // console.log(trimmedWDRows)
                        for (let i = 0; i < trimmedTDRows.length; i++) {
                            let splittedTDRow = trimmedTDRows[i].split(cutMark2);
                            splittedTDRow.splice(2, 1);
                            let timeOfInterest = splittedTDRow;
                            let weatherOfInterest = trimmedWDRows[i].split(cutMark2);
                            let latitude = Number(timeOfInterest[0]);
                            let longitude = Number(timeOfInterest[1]);
                            let timestamp = Number(timeOfInterest[2]);
                            let wind_direction = Number(weatherOfInterest[0]);
                            let wind_speed = Number(weatherOfInterest[1]);
                            let temperature = Number(weatherOfInterest[2]);
                    
                            let objToAdd = new FullWeatherData(latitude, longitude, timestamp, temperature, wind_speed, wind_direction)
                            allWeahterDataToDb.push(objToAdd)
                            // console.log(allWeahterDataToDb)
                        }
                        // console.log(allWeahterDataToDb);
                        allWeahterDataToDb.forEach((element) => {
                            let values = [timeTransformation.fmi2isotimestamp(element.timestamp), this.place, element.latitude, element.longitude, element.temperature, element.wind_speed, element.wind_direction];
                            const runQuery = async () => {
                                let resultset = await pool.query(sqlClause, values);
                                return resultset;
                            }
                            runQuery().then((resultset) => {
                                let message = '';
                                if (resultset.rows[0] != undefined) {
                                    message = 'Added a row'
                                }
                                else {
                                    message = 'Skipped an existing row'
                                }
                                console.log(message)

                        })
                        })
                    })

        
                })
                .catch((error) => {
                    console.log(error)
                })

            })
    }
}



test = new WeatherForecast('turku')
// test.getFMIDataAsXML()
// test.readAndConvertToArray()
test.putWeatherObjectToDb()