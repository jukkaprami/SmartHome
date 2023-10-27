// WEB SERVER FOR ELECTRICITY USAGE PLANNING: WEB PAGES AND AN API
// ==============================================================

// LIBRARIES AND MODULES
// ---------------------

// Use Express as web engine
const express = require('express');
// Use Express Handlebars as template engine
const { engine } = require('express-handlebars');

// Home made module to get current price
const cprice = require('./getHomePageData');
const cpriceTable = require('./getHourlyPageData')


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
    let homePageData = {
        'price': 0,
        'wind': 0,
        'temperature': 0
    };

    cprice.getCurrentPrice().then((resultset) => {

        // Set the price value according to the query
        homePageData.price = resultset.rows[0]['price']

        // Render index.handlebars and send dynamic data to the page
        res.render('index', homePageData)
    })

    

});

// Route to hourly data page
app.get('/hourly', (req, res) => {

    // Data will be presented in a table. To loop all rows we need a key for table and for column data
    cpriceTable.getCurrentPriceTable().then((resultset) => {
        let tableData = resultset.rows
        let hourlyPageData = {
            'tableData': tableData
        };
        console.log(hourlyPageData)
        res.render('hourly', hourlyPageData)
    })
    
});

// Route to hourly chart page
app.get('/chart', (req, res) => {

    // Data will be presented in a bar chart. Data will be sent as JSON array to get it work on handlebars page
    let tableHours = [12, 13, 14, 15, 16];
    let jsonTableHours = JSON.stringify(tableHours)
    let tablePrices = [10, 8, 10, 12, 15];
    let jsonTablePrices = JSON.stringify(tablePrices)
    let chartPageData = { 'hours': jsonTableHours, 'prices': jsonTablePrices };

    res.render('chart', chartPageData)

});

app.get('/graph', (req, res) => {

    // Data will be presented in a bar chart. Data will be sent as JSON array
    let tableHours = [12, 13, 14, 15, 16];
    let jsonTableHours = JSON.stringify(tableHours)
    let tablePrices = [10, 8, 10, 12, 15];
    let jsonTablePrices = JSON.stringify(tablePrices)
    let chartPageData = { 'hours': jsonTableHours, 'prices': jsonTablePrices };

    res.render('graph', chartPageData)

});

app.get('/callback', (req, res) => {

    let priceData = {
        'retailPrice': 24.05,
        'taxMultiplier': 1.24
    }

    res.render('callbackesim', priceData);

});

// START THE LISTENER
app.listen(PORT);
console.log('Server started and it will listen TCP port', PORT);