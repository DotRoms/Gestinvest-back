-- SQLBook: Code
-- Deploy gestinvest:createdb to pg

BEGIN;

CREATE TABLE "user" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "email" VARCHAR(50) NOT NULL UNIQUE,
  "last_name" VARCHAR(50) DEFAULT '',
  "first_name" VARCHAR(25) DEFAULT '',
  "password" VARCHAR(255) NOT NULL,
  "created_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "portfolio" (
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL,
    "user_id" INT REFERENCES "user"("id"),
    "created_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "trading_operation_type" (
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" VARCHAR(25) NOT NULL UNIQUE,
    "created_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "category" (
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" VARCHAR(25) NOT NULL UNIQUE,
    "created_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "asset" (
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL UNIQUE,
    "Symbol" VARCHAR(5) NOT NULL UNIQUE,
    "price" NUMERIC(15,4) NOT NULL DEFAULT 0,
    "category_id" INT REFERENCES "category"("id"),
    "created_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "invest_line" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "price" NUMERIC(15,4) NOT NULL,
  "date" DATE NOT NULL,
  "fees" NUMERIC(4,2) NOT NULL,
  "asset_number" NUMERIC(20,8) NOT NULL,
  "asset_id" INT REFERENCES "asset"("id"),
  "portfolio_id" INT REFERENCES "portfolio"("id"),
  "trading_operation_type_id" INT REFERENCES "trading_operation_type"("id"),
  "created_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "updated_at" TIMESTAMPTZ
);







COMMIT;
