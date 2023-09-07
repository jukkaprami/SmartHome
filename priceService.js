const LATEST_PRICES_ENDPOINT = 'https://api.porssisahko.net/v1/latest-prices.json';

async function fetchLatestPriceData() {
  const response = await fetch(LATEST_PRICES_ENDPOINT);

  return response.json();
}

function getPriceForDate(date, prices) {
  const matchingPriceEntry = prices.find(
    (price) => new Date(price.startDate) <= date && new Date(price.endDate) > date
  );

  if (!matchingPriceEntry) {
    throw 'Price for the requested date is missing';
  }

  return matchingPriceEntry.price;
}

// Note that it's enough to call fetchLatestPriceData() once in 12 hours
const { prices } = await fetchLatestPriceData();

try {
  const now = new Date();
  const price = getPriceForDate(now, prices);

  console.log(`Hinta nyt (${now.toISOString()}): ${price} snt / kWh (sis. alv)`);
} catch (e) {
  console.error(`Hinnan haku epäonnistui, syy: ${e}`);
}