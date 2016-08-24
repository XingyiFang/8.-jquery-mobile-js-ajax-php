-- Table: reports

DROP TABLE reports;

CREATE TABLE reports
(
  id bigserial NOT NULL,
  lat double precision,
  lng double precision,
  image0 text,
  image1 text,
  desciption text,
  rep_time timestamp without time zone,
  CONSTRAINT reports_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=TRUE
);
ALTER TABLE reports
  OWNER TO postgres;