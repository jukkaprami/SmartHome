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
const app = express()
const PORT = process.env.PORT || 8080;

// Set folders paths: publc is for assets and views for pages
app.use(express.static(`public`));
app.set(`views`, `./views`);

// Engine Settings
app.engine(`handlebars`, engine());
app.set(`view engine`, `handlebars`);

// URL ROUTES
// -----------

app.get(`/`, (req, res) => {
    res.render(`index`)
});

// START THE LISTENER
app.listen(PORT);
console.log(`Server started and it will listen TCP port`, PORT);

