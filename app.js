// WEB SERVER FOR ELECTRICITY USAGE PLANNING: WEB PAGES AND AN API
// ==============================================================

// LIBRARIES AND MODULES
// ---------------------

// Use Express as web engine
const express = require('express');
// Use Express Handlebars as template engine
const { engine } = require('express-handlebars');

// Module to run queries
const query = require('./getPGData');


// EXPRESS APPLICATION SETTINGS
// ----------------------------

// Create the server
const app = express();
const PORT = process.env.PORT || 8080;

// Set folder paths: public is for assets and views is for pages
app.use(express.static('public'));
app.set('views', './views');

// Engine settings
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// URL ROUTES
// ----------


// Route to home page 
app.get('/', (req, res) => {

    // Handlebars needs a key to show data on a page, json is a good way to send it
    // Create key structure and reset values
    let homePageData = {
        'price': 0,
        'wind': 0,
        'temperature': 0
    };

    // Define a query to get current price from the DB
    const currentPriceQuery = 'SELECT price FROM public.current_prices';
    query.getSqlData(currentPriceQuery).then((resultset) => {

        // Set the price value according to the query (1st row, column price)
        homePageData.price = resultset.rows[0]['price']

        // Render index.handlebars and send dynamic data to the page
        res.render('index', homePageData)
    })
});

// Route to hourly data page
app.get('/hourly', (req, res) => {

    // Data will be presented in a table. To loop all rows we need a key for table and for column data
    const priceTableQuery = 'SELECT * FROM public.hourly_page'
    query.getSqlData(priceTableQuery).then((resultset) => {
        let tableData = resultset.rows
        let hourlyPageData = {
            'tableData': tableData
        };
        res.render('hourly', hourlyPageData);
    })

});

// Route to hourly chart page graph.handlebars
app.get('/graph', (req, res) => {

    const chartQuery = 'SELECT hour, price FROM public.hourly_page';
    query.getSqlData(chartQuery).then((resultset) => {
        let xyData = resultset.rows;

        // Create empty arrays for x-axis and y-axis data
        let xData = [];
        let yData = [];

        // Add values to those arrays in a loop
        for (i in xyData) {
            let xvalueStr = xyData[i]['hour'];

            // Time valuest must be converted to numbers for the chart to render
            let xvalue = Number(xvalueStr);
            xData.push(xvalue);

            // Price values are numbers so no need to convert
            let yvalue = xyData[i]['price'];
            yData.push(yvalue);
        }
        // Data will be presented in a bar chart. Data will be sent as JSON array
        xData = JSON.stringify(xData);
        yData = JSON.stringify(yData);

        // X-axis values are called hours and y-axis values prices in the handlebars file
        let chartPageData = { 'hours': xData, 'prices': yData };

        // Render and send dynamic data to the page 
        res.render('graph', chartPageData);
    });


});


// START THE LISTENER
app.listen(PORT);
console.log('Server started and it will listen TCP port', PORT);