// EXAMPLE HOW TO CONVERT XML TO JS OBJECTS USING CAMARO LIBRARY
// IT HAS BEEN CHOSEN AS AN EXAMPLE DUE TO ITS SPEED
// =======================================================

// LIBRARIES AND MODULES TO IMPORT
// -------------------------------

// Camaro offers functions for transofming and beautifying XML
const { transform, prettyPrint } = require('camaro');

// CLASS DEFINITIONS
// -----------------

// We need a class to differentiate weather objects from each other in an array
class WeatherObject {
  constructor(temperature, windSpeed, windDirection) {
    this.temperature = temperature;
    this.windSpeed = windSpeed;
    this.windDirection = windDirection;
  }
}


// Example data stored directly to a variable
const xmlData = `
<?xml version="1.0" encoding="UTF-8"?>
<wfs:FeatureCollection
  timeStamp="2023-11-07T12:27:03Z"
  numberMatched="1"
  numberReturned="1"
  xmlns:wfs="http://www.opengis.net/wfs/2.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"

  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:om="http://www.opengis.net/om/2.0"
  xmlns:ompr="http://inspire.ec.europa.eu/schemas/ompr/3.0"
  xmlns:omso="http://inspire.ec.europa.eu/schemas/omso/3.0"
  xmlns:gml="http://www.opengis.net/gml/3.2"
  xmlns:gmd="http://www.isotc211.org/2005/gmd"
  xmlns:gco="http://www.isotc211.org/2005/gco"
  xmlns:swe="http://www.opengis.net/swe/2.0"
  xmlns:gmlcov="http://www.opengis.net/gmlcov/1.0"
  xmlns:sam="http://www.opengis.net/sampling/2.0"
  xmlns:sams="http://www.opengis.net/samplingSpatial/2.0"
  xmlns:target="http://xml.fmi.fi/namespace/om/atmosphericfeatures/1.1"
  xsi:schemaLocation="http://www.opengis.net/wfs/2.0 http://schemas.opengis.net/wfs/2.0/wfs.xsd
  http://www.opengis.net/gmlcov/1.0 http://schemas.opengis.net/gmlcov/1.0/gmlcovAll.xsd
  http://www.opengis.net/sampling/2.0 http://schemas.opengis.net/sampling/2.0/samplingFeature.xsd
  http://www.opengis.net/samplingSpatial/2.0 http://schemas.opengis.net/samplingSpatial/2.0/spatialSamplingFeature.xsd
  http://www.opengis.net/swe/2.0 http://schemas.opengis.net/sweCommon/2.0/swe.xsd
  http://inspire.ec.europa.eu/schemas/ompr/3.0 https://inspire.ec.europa.eu/schemas/ompr/3.0/Processes.xsd
  http://inspire.ec.europa.eu/schemas/omso/3.0 https://inspire.ec.europa.eu/schemas/omso/3.0/SpecialisedObservations.xsd
  http://xml.fmi.fi/namespace/om/atmosphericfeatures/1.1 https://xml.fmi.fi/schema/om/atmosphericfeatures/1.1/atmosphericfeatures.xsd">

  <wfs:member>
    <omso:GridSeriesObservation gml:id="WFS-OxZY1EatX4iezMtRa1KcP.1_SgyJTowtoWbbpdOt.Lnl5dsPTTv3c3Trvlw9NGXk6daN_Xls8unW3rs6aeG_Tu6Y9_bLyw58sLSxZc.ndU07ctqf.FWmYJqoTGx8udakWhTjunTRk1cM7LuyVNO3Lan_hVp2CaqEzteXz338slTo15fPffyyX9_bLy78tPTDi2ZYmZsw9MvPpEzNm_Hh2Za1M2m_GkruvTM4a23D4iaefTDux5aVq6EBpbcPiLw349HOcFUcxvbcvTLvoYeWHbl6ZeXOtqvp3ZImnllx9NO_dWtX07slPhly5JtOtapl28MvLD068srW26efPTuz1MvjpWNOwzm1u67Z.an0w9NO_dznCZnDZhx5edZXTry19Wtx64dmnp5k7s2.Jrc.mHpp37qnnhlrc38Mu7Jh6Yb.TDp2eW5z6b.WXJx65eXm_pyV2hZtul0634ueXl2w9NO_dzdOu.XD00ZeTp1o39eWzy6dbeuzpp4b9O7pj39svLDnytDpp25afTLwmaHTTty2t.7LWNVqQwA-">

                 <om:phenomenonTime>
        <gml:TimePeriod gml:id="time1-1-1">
          <gml:beginPosition>2023-11-06T12:00:00Z</gml:beginPosition>
          <gml:endPosition>2023-11-07T12:00:00Z</gml:endPosition>
        </gml:TimePeriod>
      </om:phenomenonTime>
      <om:resultTime>
        <gml:TimeInstant gml:id="time2-1-1">
          <gml:timePosition>2023-11-07T12:00:00Z</gml:timePosition>
        </gml:TimeInstant>
      </om:resultTime>

     <om:procedure xlink:href="http://xml.fmi.fi/inspire/process/opendata_daily"/>
                 <om:parameter>
                <om:NamedValue>
                    <om:name xlink:href="https://inspire.ec.europa.eu/codeList/ProcessParameterValue/value/groundObservation/observationIntent"/>
                    <om:value>
			atmosphere
                    </om:value>
                </om:NamedValue>
            </om:parameter>

     <om:observedProperty  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=WindDirection,WindSpeedMS,Temperature&amp;language=eng"/>
     	<om:featureOfInterest>
        <sams:SF_SpatialSamplingFeature gml:id="sampling-feature-1-1-fmisid">

          <sam:sampledFeature>
		<target:LocationCollection gml:id="sampled-target-1-1">
		    <target:member>
		    <target:Location gml:id="obsloc-fmisid-100949-pos">
		        <gml:identifier codeSpace="http://xml.fmi.fi/namespace/stationcode/fmisid">100949</gml:identifier>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/name">Turku Artukainen</gml:name>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/geoid">-16000132</gml:name>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/wmo">2773</gml:name>
			<target:representativePoint xlink:href="#point-100949"/>					
			
			
			<target:region codeSpace="http://xml.fmi.fi/namespace/location/region">Turku</target:region>	   			
			
		    </target:Location></target:member>
		</target:LocationCollection>
 	   </sam:sampledFeature>
          <sams:shape>
            <gml:MultiPoint gml:id="mp-1-1-fmisid">
              <gml:pointMember>
              <gml:Point gml:id="point-100949" srsName="http://www.opengis.net/def/crs/EPSG/0/4258" srsDimension="2">
                <gml:name>Turku Artukainen</gml:name>
                <gml:pos>60.45439 22.17870 </gml:pos>
            </gml:Point>
	    </gml:pointMember>
	    </gml:MultiPoint>
          </sams:shape>
        </sams:SF_SpatialSamplingFeature>
      </om:featureOfInterest>

           <om:result>
        <gmlcov:MultiPointCoverage gml:id="mpcv1-1-1">
          <gml:domainSet>
            <gmlcov:SimpleMultiPoint gml:id="mp1-1-1" srsName="http://xml.fmi.fi/gml/crs/compoundCRS.php?crs=4258&amp;time=unixtime" srsDimension="3">
              <gmlcov:positions>
                60.45439 22.17870  1699272000
                60.45439 22.17870  1699272600
                60.45439 22.17870  1699273200
                60.45439 22.17870  1699273800
                60.45439 22.17870  1699274400
                60.45439 22.17870  1699275000
                60.45439 22.17870  1699275600
                60.45439 22.17870  1699276200
                60.45439 22.17870  1699276800
                60.45439 22.17870  1699277400
                60.45439 22.17870  1699278000
                60.45439 22.17870  1699278600
                60.45439 22.17870  1699279200
                60.45439 22.17870  1699279800
                60.45439 22.17870  1699280400
                60.45439 22.17870  1699281000
                60.45439 22.17870  1699281600
                60.45439 22.17870  1699282200
                60.45439 22.17870  1699282800
                60.45439 22.17870  1699283400
                60.45439 22.17870  1699284000
                60.45439 22.17870  1699284600
                60.45439 22.17870  1699285200
                60.45439 22.17870  1699285800
                60.45439 22.17870  1699286400
                60.45439 22.17870  1699287000
                60.45439 22.17870  1699287600
                60.45439 22.17870  1699288200
                60.45439 22.17870  1699288800
                60.45439 22.17870  1699289400
                60.45439 22.17870  1699290000
                60.45439 22.17870  1699290600
                60.45439 22.17870  1699291200
                60.45439 22.17870  1699291800
                60.45439 22.17870  1699292400
                60.45439 22.17870  1699293000
                60.45439 22.17870  1699293600
                60.45439 22.17870  1699294200
                60.45439 22.17870  1699294800
                60.45439 22.17870  1699295400
                60.45439 22.17870  1699296000
                60.45439 22.17870  1699296600
                60.45439 22.17870  1699297200
                60.45439 22.17870  1699297800
                60.45439 22.17870  1699298400
                60.45439 22.17870  1699299000
                60.45439 22.17870  1699299600
                60.45439 22.17870  1699300200
                60.45439 22.17870  1699300800
                60.45439 22.17870  1699301400
                60.45439 22.17870  1699302000
                60.45439 22.17870  1699302600
                60.45439 22.17870  1699303200
                60.45439 22.17870  1699303800
                60.45439 22.17870  1699304400
                60.45439 22.17870  1699305000
                60.45439 22.17870  1699305600
                60.45439 22.17870  1699306200
                60.45439 22.17870  1699306800
                60.45439 22.17870  1699307400
                60.45439 22.17870  1699308000
                60.45439 22.17870  1699308600
                60.45439 22.17870  1699309200
                60.45439 22.17870  1699309800
                60.45439 22.17870  1699310400
                60.45439 22.17870  1699311000
                60.45439 22.17870  1699311600
                60.45439 22.17870  1699312200
                60.45439 22.17870  1699312800
                60.45439 22.17870  1699313400
                60.45439 22.17870  1699314000
                60.45439 22.17870  1699314600
                60.45439 22.17870  1699315200
                60.45439 22.17870  1699315800
                60.45439 22.17870  1699316400
                60.45439 22.17870  1699317000
                60.45439 22.17870  1699317600
                60.45439 22.17870  1699318200
                60.45439 22.17870  1699318800
                60.45439 22.17870  1699319400
                60.45439 22.17870  1699320000
                60.45439 22.17870  1699320600
                60.45439 22.17870  1699321200
                60.45439 22.17870  1699321800
                60.45439 22.17870  1699322400
                60.45439 22.17870  1699323000
                60.45439 22.17870  1699323600
                60.45439 22.17870  1699324200
                60.45439 22.17870  1699324800
                60.45439 22.17870  1699325400
                60.45439 22.17870  1699326000
                60.45439 22.17870  1699326600
                60.45439 22.17870  1699327200
                60.45439 22.17870  1699327800
                60.45439 22.17870  1699328400
                60.45439 22.17870  1699329000
                60.45439 22.17870  1699329600
                60.45439 22.17870  1699330200
                60.45439 22.17870  1699330800
                60.45439 22.17870  1699331400
                60.45439 22.17870  1699332000
                60.45439 22.17870  1699332600
                60.45439 22.17870  1699333200
                60.45439 22.17870  1699333800
                60.45439 22.17870  1699334400
                60.45439 22.17870  1699335000
                60.45439 22.17870  1699335600
                60.45439 22.17870  1699336200
                60.45439 22.17870  1699336800
                60.45439 22.17870  1699337400
                60.45439 22.17870  1699338000
                60.45439 22.17870  1699338600
                60.45439 22.17870  1699339200
                60.45439 22.17870  1699339800
                60.45439 22.17870  1699340400
                60.45439 22.17870  1699341000
                60.45439 22.17870  1699341600
                60.45439 22.17870  1699342200
                60.45439 22.17870  1699342800
                60.45439 22.17870  1699343400
                60.45439 22.17870  1699344000
                60.45439 22.17870  1699344600
                60.45439 22.17870  1699345200
                60.45439 22.17870  1699345800
                60.45439 22.17870  1699346400
                60.45439 22.17870  1699347000
                60.45439 22.17870  1699347600
                60.45439 22.17870  1699348200
                60.45439 22.17870  1699348800
                60.45439 22.17870  1699349400
                60.45439 22.17870  1699350000
                60.45439 22.17870  1699350600
                60.45439 22.17870  1699351200
                60.45439 22.17870  1699351800
                60.45439 22.17870  1699352400
                60.45439 22.17870  1699353000
                60.45439 22.17870  1699353600
                60.45439 22.17870  1699354200
                60.45439 22.17870  1699354800
                60.45439 22.17870  1699355400
                60.45439 22.17870  1699356000
                60.45439 22.17870  1699356600
                60.45439 22.17870  1699357200
                60.45439 22.17870  1699357800
                60.45439 22.17870  1699358400
                </gmlcov:positions>
            </gmlcov:SimpleMultiPoint>
          </gml:domainSet>
          <gml:rangeSet>
            <gml:DataBlock>
              <gml:rangeParameters/>
              <gml:doubleOrNilReasonTupleList>
                88.0 0.9 7.7 
                71.0 0.9 7.8 
                97.0 0.8 7.7 
                78.0 1.0 7.8 
                34.0 0.6 7.8 
                45.0 0.3 7.8 
                0.0 0.0 7.9 
                0.0 0.0 7.9 
                101.0 0.3 7.8 
                0.0 0.0 7.8 
                0.0 0.0 7.8 
                0.0 0.0 7.8 
                0.0 0.0 7.8 
                0.0 0.0 7.8 
                0.0 0.0 7.7 
                0.0 0.0 7.7 
                0.0 0.0 7.7 
                0.0 0.0 7.7 
                0.0 0.0 7.7 
                0.0 0.0 7.7 
                0.0 0.0 7.6 
                0.0 0.0 7.6 
                0.0 0.0 7.6 
                0.0 0.0 7.5 
                0.0 0.0 7.6 
                0.0 0.0 7.5 
                260.0 0.4 7.5 
                240.0 0.3 7.5 
                238.0 0.3 7.4 
                232.0 0.7 7.4 
                234.0 1.3 7.4 
                245.0 0.9 7.4 
                252.0 0.5 7.5 
                250.0 0.4 7.5 
                233.0 0.3 7.5 
                242.0 1.1 7.4 
                246.0 0.8 7.6 
                231.0 0.7 7.5 
                228.0 1.2 7.5 
                239.0 1.3 7.5 
                243.0 1.4 7.4 
                250.0 1.3 7.5 
                271.0 1.3 7.5 
                260.0 1.2 7.5 
                244.0 1.1 7.5 
                243.0 0.8 7.4 
                248.0 1.1 7.4 
                262.0 1.3 7.4 
                274.0 1.9 7.3 
                275.0 2.1 7.3 
                291.0 2.0 7.2 
                290.0 1.5 7.2 
                286.0 1.3 7.2 
                288.0 1.3 7.2 
                277.0 1.6 7.2 
                257.0 1.6 7.2 
                252.0 1.1 7.2 
                225.0 1.3 7.1 
                226.0 1.1 7.0 
                240.0 0.8 6.9 
                0.0 0.0 6.9 
                0.0 0.0 6.9 
                240.0 0.4 6.8 
                228.0 0.5 6.8 
                201.0 0.4 6.8 
                286.0 0.3 6.8 
                268.0 0.7 6.9 
                279.0 1.7 6.9 
                282.0 2.1 6.8 
                280.0 1.8 6.8 
                255.0 1.7 6.8 
                278.0 2.2 6.7 
                271.0 2.0 6.7 
                251.0 1.3 6.8 
                260.0 1.4 6.8 
                247.0 1.7 6.8 
                235.0 1.7 6.7 
                242.0 1.9 6.7 
                241.0 2.1 6.6 
                236.0 1.8 6.6 
                240.0 1.6 6.6 
                241.0 1.3 6.6 
                239.0 1.8 6.6 
                239.0 2.0 6.6 
                251.0 1.7 6.6 
                239.0 1.6 6.6 
                245.0 1.6 6.6 
                239.0 1.6 6.6 
                234.0 1.5 6.6 
                239.0 1.6 6.6 
                250.0 1.2 6.6 
                251.0 1.4 6.6 
                259.0 1.9 6.7 
                272.0 1.7 6.6 
                272.0 2.1 6.6 
                275.0 2.3 6.6 
                270.0 1.9 6.5 
                277.0 2.3 6.5 
                263.0 2.3 6.5 
                280.0 1.5 6.5 
                274.0 2.0 6.5 
                262.0 2.1 6.5 
                272.0 2.0 6.5 
                262.0 1.4 6.5 
                265.0 1.7 6.5 
                270.0 1.6 6.5 
                268.0 1.6 6.5 
                275.0 1.4 6.4 
                270.0 2.0 6.4 
                254.0 2.4 6.3 
                260.0 2.5 6.3 
                258.0 2.5 6.3 
                264.0 2.3 6.3 
                271.0 2.1 6.2 
                275.0 2.4 6.2 
                276.0 2.5 6.2 
                271.0 2.0 6.2 
                280.0 2.0 6.2 
                276.0 2.2 6.2 
                290.0 1.6 6.2 
                297.0 2.5 6.3 
                283.0 2.0 6.3 
                286.0 1.9 6.4 
                297.0 1.6 6.4 
                287.0 1.5 6.4 
                294.0 1.4 6.4 
                316.0 1.5 6.5 
                266.0 1.9 6.6 
                277.0 1.6 6.7 
                281.0 1.5 6.7 
                259.0 1.5 6.7 
                270.0 2.5 6.7 
                277.0 2.4 6.6 
                280.0 2.3 6.5 
                276.0 2.0 6.5 
                288.0 1.8 6.5 
                301.0 1.6 6.5 
                296.0 1.8 6.5 
                292.0 1.8 6.5 
                303.0 1.6 6.5 
                305.0 1.6 6.6 
                279.0 1.3 6.7 
                266.0 1.7 6.7 
                278.0 1.1 6.7 
                282.0 2.2 6.6 
                </gml:doubleOrNilReasonTupleList>
            </gml:DataBlock>
          </gml:rangeSet>
          <gml:coverageFunction>
            <gml:CoverageMappingRule>
              <gml:ruleDefinition>Linear</gml:ruleDefinition>
            </gml:CoverageMappingRule>
          </gml:coverageFunction>
          <gmlcov:rangeType>
            <swe:DataRecord>
              <swe:field name="WindDirection"  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=WindDirection&amp;language=eng"/>
              <swe:field name="WindSpeedMS"  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=WindSpeedMS&amp;language=eng"/>
              <swe:field name="Temperature"  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=Temperature&amp;language=eng"/>
              </swe:DataRecord>
          </gmlcov:rangeType>
        </gmlcov:MultiPointCoverage>
      </om:result>

    </omso:GridSeriesObservation>
  </wfs:member>
</wfs:FeatureCollection>

`
// Template is a set of conversion instructions, this retrieves observation data
const dataTemplate = ['wfs:FeatureCollection/wfs:member/omso:GridSeriesObservation/om:result/gmlcov:MultiPointCoverage/gml:rangeSet/gml:DataBlock',
  {
    data: 'gml:doubleOrNilReasonTupleList'
  }];


// Define an asyncroneous function for creating JS-objects from xml data
// Uses xml string and template as arguments, returns an array of JS-objects

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

// Define an empty array for the data to be sent to the database
let weatherDataToDb = []
let weatherData = ''; // An empty string for data

// Call the function, get results and convert to an array of objects
xml2objectArray(xmlData, dataTemplate).then(result => {
  weatherData = result; // When promise is fullfilled store data

  // The result is a single element of multi row text
  weatherString = weatherData[0].data;

  // Data must be splitted to rows and column values
  const cutMark1 = '\n'; // Split string from newline chr
  const cutMark2 = ' '; // Split string by space between columns

  // Data has been dumped as text containing lots of leading and trailing spaces
  // therefore it must be trimmed
  const trimmedWeatherDatarows = []; // An empty array for trimmed data
  const weatherDataRows = weatherString.split(cutMark1); // Split by new lines
  weatherDataRows.forEach(element => {
    trimmedElement = element.trim(); // Remove spaces from start and end of line
    trimmedWeatherDatarows.push(trimmedElement) // Add element to the array
  });

  // Let's remove the 1st element because it is empty
  trimmedWeatherDatarows.shift()

  // There is an empty element at the end of array, remove it also
  trimmedWeatherDatarows.pop()

  // Loop the trimmed array element by element
  trimmedWeatherDatarows.forEach(element => {
    let valueOfInterest = element.split(cutMark2) // Split by space
    let windDirection = Number(valueOfInterest[0]); // Convert values to numeric
    let windSpeed = Number(valueOfInterest[1]);
    let temperature = Number(valueOfInterest[2]);

    // Create a new object to add values to an array as an object
    let objToAdd = new WeatherObject(temperature, windSpeed, windDirection);
    weatherDataToDb.push(objToAdd)
  })

  // Some preliminary tests to chek that all is going as planned 
  console.log(weatherDataToDb) // The whole array
  console.log('4th element has temperature property of', weatherDataToDb[3].temperature) // A single value of object property
  console.log('22nd element has temperature property of',weatherDataToDb[21].temperature)
  console.log('32nd element has wind direction property of',weatherDataToDb[31].windDirection)
});

// A template to get timestamps and positions
timeTemplate = ['wfs:FeatureCollection/wfs:member/omso:GridSeriesObservation/om:result/gmlcov:MultiPointCoverage/gml:domainSet/gmlcov:SimpleMultiPoint',
  {
    data: 'gmlcov:positions'
  }];

/*  
// Get positions and timestamps to the console  
xml2objectArray(xmlData, timeTemplate).then(result => {
  console.log(result)
})
*/

// 

// TODO: Add a function to convert forecast to array of objects

// TODO: Lisää esimerkki prettyPrintin käytöstä