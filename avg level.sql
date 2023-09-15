-- Calculates average electricity price for weekdays

SELECT EXTRACT (ISODOW FROM timeslot) AS vpnumero, AVG(price)
	FROM public.hourly_price
	GROUP BY vpnumero
	ORDER BY vpnumero