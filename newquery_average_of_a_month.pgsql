-- Create a view to show previous month average price
-- and normal price limits
CREATE View public.previous_month_average AS
SELECT keskihinta,
    yläraja,
    alaraja
FROM average_by_year_month_2
WHERE vuosi = EXTRACT(year from NOW()) AND
    kuukausi = EXTRACT(month from NOW()) - 1
