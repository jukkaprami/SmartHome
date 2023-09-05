// WEB SERVER FOR ELECTRICITY USAGE PLANNING: WEB PAGES AND AN API
// ==============================================================

// LIBRARIES AND MODULES
// ----------------------

// Use Express as web engine
const express = require("express");
const Express = require(`express`);
// Use Express Handlebars as template engine
const {engine} = require(`express-handlebars`);

// EXPRESS APPLICATION SETTINGS
// -----------------------------

//Create the server
const app = express();
const PORT = process.env.PORT || 8080;

// Set folders paths: publc is for assets and views for pages
app.use(express.static(`public`));
app.set(`views`, `./views`);

// Engine Settings
app.engine(`handlebars`, engine());
app.set(`view engine`, `handlebars`);

// URL ROUTES
// -----------

// Route to home page
app.get('/', (req, res) => {

    // Handlebars needs a key to show data on a page, json is a good way to send it 
    let homePageData = {
        'price': 31.25,
        'wind': 2,
        'temperature': 18
    };

    // Render index data to
    res.render(`index`, homePageData )

});

// Route to hourly data page
app.get('/hourly',(req, res) => {

    // Data will be presented in a table. To loop all rows we need a key for table and for column data
    let hourlyPageData = { 'tableData': [
        {'hour': 13,
        'price': 29.30},
        {'hour': 14,
        'price': 29.99},
        {'hour': 15,
        'price': 30.50},
        {'hour': 16,
        'price': 31.00},
        {'hour': 17,
        'price': 31.50}
    ]};

    
    res.render('hourly', hourlyPageData)
});

// Route to hourly chart page
app.get('/chart',(req,res) => {

    //Data will be presented in bart chart. Data will will be sent as JSON array to get it work handlebars page
    let tableHours = [13, 14, 15, 16, 17];
    let jsonTableHours  = JSON.stringify(tableHours)
    let tablePrices = [29.30, 29.99, 30.50, 31.00, 31.50];
    let jsonTablePrices = JSON.stringify(tablePrices)
    let chartPageData = { 'hours': jsonTableHours, 'prices': jsonTablePrices };

    res.render('chart', chartPageData)

});

app.get('/test',(req,res) => {

    // Data will be presented in a bar chart. Data will be sent as JSON array
    let tableHours = [13, 14, 15, 16, 17];
    let jsonTableHours = JSON.stringify(tableHours)
    let tablePrices = [29.30, 29.99, 30.50, 31.00, 31.50];
    let jsonTablePrices = JSON.stringify(tablePrices)
    let chartPageData = { 'hours': jsonTableHours, 'prices': jsonTablePrices };

    res.render('testCJSv4', chartPageData)

});

// START THE LISTENER
app.listen(PORT);
console.log(`Server started and it will listen TCP port`, PORT);

