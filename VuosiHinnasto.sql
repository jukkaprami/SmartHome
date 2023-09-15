-- Extract year, month and day for grouping average prices

SELECT EXTRACT (YEAR FROM timeslot) AS vuosi, AVG(price) AS keskihinta
	FROM public.hourly_price
	GROUP BY vuosi;
	