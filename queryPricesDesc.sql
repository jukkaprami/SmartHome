-- Query all fields (columns) and order results
-- according to the timestamp field to descending order
SELECT *
	FROM public.hourly_price
	ORDER BY timeslot DESC;