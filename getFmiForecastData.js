const axios = require('axios');

const { transform, prettyPrint } = require('camaro');
const Pool = require('pg').Pool;
const math = require('mathjs')

const settings = require('./database_and_timer_settings.json')

const database = settings.database;

const pool = new Pool(
    database
);

class WeatherForecastTimeValue {
    constructor(place, parameterCode, parameterName) {
        this.place = place;
        this.parameterCode = parameterCode;
        this.parameterName = parameterName

        this.url =
            'https://opendata.fmi.fi/wfs/fin?service=WFS&version=2.0.0&request=GetFeature&storedquery_id=ecmwf::forecast::surface::point::timevaluepair&place='
            + this.place +
            '&parameters=' +
            this.parameterCode;

        this.WFSPath =
            'wfs:FeatureCollection/wfs:member/omso:PointTimeSeriesObservation/om:result/wml2:MeasurementTimeseries/wml2:point/wml2:MeasurementTVP';

        let names = { timeStamp: 'wml2:time', value: 'number(wml2:value)' };

        names[this.parameterName] = names['value']
        delete names['value'] 

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

    getFMIDataAsXML() {
        axios.request(this.axiosConfig).then((response) => {
            console.log(response.data)
        })
    }

    readAndConvertToArray() {
        axios.request(this.axiosConfig).then((response) => {
            transform(response.data, this.xmlTemplate).then((result) => {
                console.log(result)
                return result
            })
        })
    }

    putTimeValuePairsToDb() {
        let tableName = this.parameterName + '_forecast';    
        const sqlClause = 'INSERT INTO public.' + tableName + ' VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING *';
        axios
            .request(this.axiosConfig)
            .then((response) => {
                transform(response.data, this.xmlTemplate)
                    .then((result) => {
                        result.forEach((element) => {
                            let values = [element.timeStamp, element[this.parameterName], this.place]
                            const runQuery = async () => {
                                let resultset = await pool.query(sqlClause, values);
                                return resultset;
                            }
                            runQuery().then((resultset) => {
                                let message = '';
                                if (resultset.rows[0] != undefined) {
                                    message = 'Added a row';
                                }
                                else {
                                    message = 'Skipped an existing row';
                                }
                                console.log(message);
                            })
                        })
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            })    
    }
}

const addTemperature = new WeatherForecastTimeValue('Turku', 'Temperature', 'temperature')
const addWindX = new WeatherForecastTimeValue('Turku', 'WindUMS', 'wind_vector_x')
const addWindY = new WeatherForecastTimeValue('Turku', 'WindVMS', 'wind_vector_y')

// addTemperature.getFMIDataAsXML()
// addWindX.readAndConvertToArray()
// addWindY.readAndConvertToArray()

// temperature = parameter Code 'Temperature'
// Tuulivektorin x-komponentti = 'WindUMS'
// Tuulivektorin y-komponentti = 'WindVMS'

/*addTemperature.putTimeValuePairsToDb()
addWindX.putTimeValuePairsToDb()
addWindY.putTimeValuePairsToDb()*/

// A class for calculating windspeed from wind vectors V and U
class WindVector {
    constructor(wind_x_vector, wind_y_vector) {
        this.wind_x_vector = wind_x_vector;
        this.wind_y_vector = wind_y_vector;
        this.windSpeed = math.sqrt(math.square(this.wind_y_vector) + math.square(this.wind_y_vector))
    }
    windParameters() {
    let windAngle = 0; // Wind blows from opposite direction to vector
    let geographicAngle = 0; // Angle of vector in a map
    
    // atan2 returns angle in radians. Arguments are in (y, x) order!
    let xyAngleRad = math.atan2(this.wind_y_vector, this.wind_x_vector);
    let xyAngleDeg = xyAngleRad * 360 /(2 * math.pi); // convert radians to degrees

    // Convert x-y plane directions to geographic directions. There is a 90 degree shift between x-y and map directions.
    if (xyAngleDeg > 90) {
        geographicAngle = 360 - (xyAngleDeg -90);
    }
    else {
        windAngle = 90 - xyAngleDeg;
    }

    // Wind blow from opposite direction
    if (geographicAngle < 180) {
        windAngle = geographicAngle + 180;
    }
    else {
        windAngle = geographicAngle - 180;
    }

    // Return all calculated parameters
    return {
        xyAngleRad: xyAngleRad, // x-y koordinatiston kulma radianeina (matematiikassa 0 .. 2pi, funktiossa 0 .. pi .. -pi) -> kulman sisäisen kaaren pituus
        xyAngleDeg: xyAngleDeg, // x-y koordinatiston kulma asteena -> kulman sisäisen kaaren pituus
        geographicAngle: geographicAngle, // maantieteellinen suunt mihin tuulivektoori osoittaa asteena
        windAngle: math.round(windAngle), // maantieteellinen suunta mistä tuuli tulee asteena
        windSpeed: math.round(this.windSpeed) // Tuulen nopeus
    }
    }
}

test = new WindVector(-3.6, 0.8)
console.log(test.windParameters())