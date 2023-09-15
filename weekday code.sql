-- Average prices by weekday name in Finnish

SELECT fin_name AS viikonpäivä,
swe_name AS veckodag ,
eng_name AS "day of week"
ROUND(AVG::numeric, 3) AS keskihinta
	FROM public.weekday_lookup, public.average_by_weekday_num
	WHERE public.weekday_lookup.weekday_number = public.average_by_weekday_num
	ORDER BY vpnumero
	