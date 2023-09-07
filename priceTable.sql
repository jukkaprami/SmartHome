
CREATE TABLE public.price (
                start TIMESTAMP NOT NULL,
                end_1 TIMESTAMP NOT NULL,
                price REAL NOT NULL,
                CONSTRAINT price_pk PRIMARY KEY (start, end_1)
);
COMMENT ON TABLE public.price IS 'Stores electricity hourly prices and timestamps';
COMMENT ON COLUMN public.price.start IS 'Date and hour when time period starts ';
COMMENT ON COLUMN public.price.end_1 IS 'When time period ends';
COMMENT ON COLUMN public.price.price IS 'Hourly price cents';
