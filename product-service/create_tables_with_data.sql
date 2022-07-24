CREATE TABLE IF NOT EXISTS public.products
(
    id uuid NOT NULL,
    title text NOT NULL,
    description text,
    price integer CHECK (price > 0),
    CONSTRAINT products_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.stocks
(
    product_id uuid NOT NULL,
    count integer CHECK (count > 0)
);

ALTER TABLE IF EXISTS public.stocks
    ADD CONSTRAINT stocks_product_id_fkey FOREIGN KEY (product_id)
    REFERENCES public.products (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

INSERT INTO public.products(id, title, description, price) VALUES
('7567ec4b-b10c-48c5-9345-fc73c48a80aa', 'ProductOne', 'Short Product Description1', 1),
('7567ec4b-b10c-48c5-9345-fc73c48a80a0', 'ProductTwo', 'Short Product Description2', 2),
('7567ec4b-b10c-48c5-9345-fc73c48a80a2', 'ProductThree', 'Short Product Description3', 3),
('7567ec4b-b10c-48c5-9345-fc73c48a80a1', 'ProductFour', 'Short Product Description4', 4),
('7567ec4b-b10c-48c5-9345-fc73c48a80a3', 'ProductFive', 'Short Product Description5', 5),
('7567ec4b-b10c-48c5-9345-fc73348a80a1', 'ProductSix', 'Short Product Description6', 6),
('7567ec4b-b10c-48c5-9445-fc73c48a80a2', 'ProductSeven', 'Short Product Description7', 7),
('7567ec4b-b10c-45c5-9345-fc73c48a80a1', 'ProductEight', 'Short Product Description8', 8);

INSERT INTO public.stocks(product_id, count) VALUES
('7567ec4b-b10c-48c5-9345-fc73c48a80aa', 1),
('7567ec4b-b10c-48c5-9345-fc73c48a80a0', 2),
('7567ec4b-b10c-48c5-9345-fc73c48a80a2', 3),
('7567ec4b-b10c-48c5-9345-fc73c48a80a1', 4),
('7567ec4b-b10c-48c5-9345-fc73c48a80a3', 5),
('7567ec4b-b10c-48c5-9345-fc73348a80a1', 6),
('7567ec4b-b10c-48c5-9445-fc73c48a80a2', 7),
('7567ec4b-b10c-45c5-9345-fc73c48a80a1', 8);
