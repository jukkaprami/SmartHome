// EXAMPLE HOW TO CONVERT XML TO JS OBJECTS USING CAMARO LIBRARY
// IT HAS BEEN CHOSEN AS AN EXAMPLE DUE TO ITS SPEED
// =======================================================

// LIBRARIES AND MODULES TO IMPORT
// -------------------------------

// Camaro offers functions for transofming and beautifying XML
const { transform, prettyPrint } = require('camaro');

// Example data stored directly to a variable
const xmlData = `
<pageData>
<entry>
    <timeStamp>2023-11-03T13:00:00Z</timeStamp>
    <price>2.07</price>
    <temperature>-1.2</temperature>
    <windSpeed>4.8</windSpeed>
</entry>
<entry>
    <timeStamp>2023-11-03T14:00:00Z</timeStamp>
    <price>2.20</price>
    <temperature>-1.0</temperature>
    <windSpeed>5.5</windSpeed>
</entry>
<entry>
    <timeStamp>2023-11-03T15:00:00Z</timeStamp>
    <price>1.83</price>
    <temperature>-0.3</temperature>
    <windSpeed>7.1</windSpeed>
</entry>
</pageData>
`
// Template is a set of conversion instructions 
const template = ['wfs:FeatureCollection/wfs:member/omso:GridSeriesObservation/om:result/gmlcov:MultiPointCoverage/gml:rangeSet/gml:DataBlock/gml:doubleOrNilReasonTupleList'];
{
    data : 'gml:doubleOrNilReasonTupleList';
};

/*(async function () {
    const result = await transform(xmlData, template)
    console.log(result)
    console.log('Temperature on 3rd entry is', result[2].temperature)
})()
*/

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

// Call the function, get results and then log them to the console
xml2objectArray(xmlData, template).then(result => {
    console.log(result)
})

// TODO: Lisää esimerkki prettyPrintin käytöstä