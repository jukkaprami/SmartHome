// Set the URL for API endpoint: latest prices at 14.00 EET or 15.00 at summer
const LATEST_PRICES_ENDPOINT = 'https://api.porssisahko.net/v1/latest-prices.json';

/* Create a promise for reading data from the API in the background
 and return it as json when ready */
async function fetchLatestPriceData() {
    const response = await fetch(LATEST_PRICES_ENDPOINT);
    const json = await response.json()
    return json;
}

// Get price for a given one hour inteval
function getPriceForDate(date, prices) {
    const matchingPriceEntry = prices.find(
        (price) => new Date(price.startDate) <= date && new Date(price.endDate) > date
    );

    // If not found raise an error
    if (!matchingPriceEntry) {
        throw 'Price for the requested date is missing';
    }

    return matchingPriceEntry.price;
}

// When promise has been fullfilled log results or the error
fetchLatestPriceData()
    .then((json) => console.log(json))
    .catch((err) => console.log(err))