-- Vuoden, kuukauden ja edellisen kuukauden erottaminen
-- Kuluvan ajanhetken aikaleimasta
SELECT EXTRACT(year FROM NOW()) AS vuosi,
	EXTRACT(month FROM NOW()) AS kuukausi,
	EXTRACT (month FROM (NOW)-1 AS edellinen kuukausi,
	avg(hourly_price.price) AS keskihinta,
	stddev_pop(hourly_price.price) as hajonta,
	avg(hourly_price.price) + stddev_pop(hourly_price.price) AS yläraja,
	avg(hourly_price.price) - stddev_pop(hourly_price.price) AS alaraja
	FROM hourly_price
	GROUP BY (EXTRACT(year FROM hourly_price.times)), (EXTRACT(month FROM hourly_price))