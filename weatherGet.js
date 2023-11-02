var SERVER_URL = "http://opendata.fmi.fi/wfs";
var STORED_QUERY_OBSERVATION = "fmi::observations::weather::multipointcoverage";
const MetOClient = require('@fmidev/metoclient');

const metoclient = new MetOClient(options);
metoclient.render().then(function (map) {
  metoclient.play({
    delay: 1000,
    time: Date.now()
  });
}).catch(err => {
  // statements to handle any exceptions
});
var connection = new fi.fmi.metoclient.WfsConnection();
if (connection.connect(SERVER_URL, STORED_QUERY_OBSERVATION)) {
    // Connection was properly initialized. So, get the data.
    connection.getData({
        requestParameter : "td",
        begin : new Date(1368172800000),
        end : new Date(1368352800000),
        timestep : 60 * 60 * 1000,
        sites : "Helsinki",
        callback : function(data, errors) {
            // Handle the data and errors object in a way you choose.
            handleCallback(data, errors);
            // Disconnect because the flow has finished.
            connection.disconnect();
        }
    });
