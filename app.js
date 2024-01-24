//WEB SERVER FOR ELECTRICITY USAGE PLANNING: WEB PAGES AND API

// lIBRARIES AND MODULES

// Use Express as web engine
const express = require('express');
// Use Express Handlebars as template engine
const {engine} = require('express-handlebars');

// Get external data with node-fetch for version 2.x
// This version should be installed as follows :npm install node-fetch@2
// const fetch = require('node-fetch')

// Get external data with node-fetch for verion 3.x
// import fetch from 'node-fetch';

// EXPRESS APPLICATION SETTINGS

// Home made module to get current price

const dynamicData = require('./getPageData')

// Create the server
const app = express();
const PORT = process.env.Port || 8080;

// Set folder pahts: public is for assets and views for pages
app.use(express.static('public'));
app.set('views', './views');

// Engine settings
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// URL ROUTES

// Route to home page
app.get('/', (req, res) => {
    
    // Handlebars needs a key to show data on page, json is a good way to send it
    let homePageData = {
        'price': 0,
        'wind_speed': 0,
        'wind_direction': 0,
        'temperature': 0
    };

    dynamicData.getCurrentPrice().then((resultset) => {
        homePageData.price = resultset.rows[0]['price']
        console.log(homePageData.price)
        
        dynamicData.getCurrentTemperature().then((resultset) => {
            homePageData.temperature = resultset.rows[0]['temperature']
            console.log(homePageData.temperature)

            dynamicData.getCurrentWind_direction().then((resultset) => {
                homePageData.wind_direction = resultset.rows[0]['wind_direction']
                console.log(homePageData.resultset)

                dynamicData.getCurrentWind_speed().then((resultset) => {
                    homePageData.wind_speed = resultset.rows[0]['wind_speed']
                    console.log(homePageData.resultset)
                    res.render('index', homePageData)
                })
            })
        })
        
        // Render index.handlebars and send dynamic data to the page
    })


});
// Route to hourly data page
app.get('/hourly', (req, res) => {
    // Data will be presented in a table. To loop all rows we need a key for table and for column
        
    dynamicData.getHourlyPrice().then((resultset) => {
        var tableData = resultset.rows;
        
        /*let tableHours = [];
        let tablePrices = [];

        for (i in tableData) {
            let hourStr = tableData[i]['hour'];
            let hourNr = Number(hourStr)
            tableHours.push(hourNr)

            let priceNr = tableData[i]['price'];
            tablePrices.push(priceNr)
        }

        let jsonTableHours = JSON.stringify(tableHours);
        
        let jsonTablePrices = JSON.stringify(tablePrices);*/
        
        let chartPageData = { /*chartHours': jsonTableHours, 'chartPrices': jsonTablePrices,*/ 'tableData': tableData};
        
        res.render('hourly', chartPageData);
    })
    
});

app.get('/weather_forecast', (req, res) => {
    dynamicData.getWeatherForecast().then((resultset) => {
        var tableData = resultset.rows;
        let weatherForecastData = {'tableData': tableData};
        res.render('weather_forecast', weatherForecastData)
    })    
})

app.get('/weather_observation', (req, res) => {
    dynamicData.getWeatherObservation().then((resultset) => {
        var tableData = resultset.rows;
        let weatherObservationData = {'tableData': tableData};
        res.render('weather_observation', weatherObservationData)
    })
})

app.get('/dildoran_index', (req, res) => {
    let homePageData = {
        'price': 0
    };

    dynamicData.getCurrentPrice().then((resultset) => {
        homePageData.price = resultset.rows[0]['price']
        console.log(homePageData.price)
        res.render('dildoran_index', homePageData)
    })
    

})

// START THE LISTENER
app.listen(PORT);
console.log('Server started and it will listen PCP port', PORT);