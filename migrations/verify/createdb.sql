-- SQLBook: Code
-- Verify gestinvest:createdb on pg

BEGIN;

SELECT * FROM "user" WHERE false;
SELECT * FROM "portfolio" WHERE false;
SELECT * FROM "trading_operation_type" WHERE false;
SELECT * FROM "invest_line" WHERE false;
SELECT * FROM "asset" WHERE false;
SELECT * FROM "category" WHERE false;

ROLLBACK;
