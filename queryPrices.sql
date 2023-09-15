-- Query to get prices at timestamp greater than 2023-09-14 0:00

SELECT timeslot, price
	FROM public.hourly_price
	WHERE timeslot >= now()
	ORDER BY timeslot;