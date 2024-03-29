-- SQLBook: Code
-- Revert gestinvest:createdb from pg

BEGIN;

DROP TABLE "user", "portfolio", "trading_operation_type", "invest_line", "asset", "category"

COMMIT;
