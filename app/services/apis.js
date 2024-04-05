import 'dotenv/config';
import dbClient from '../datamappers/dbClient.js';

async function findAllSymbolsByCategory(categoryId) {
  const result = await dbClient.query('SELECT symbol FROM asset WHERE "category_id" = $1', [categoryId]);
  return result.rows;
}

const cryptoSymbols = await findAllSymbolsByCategory(1);
const stockSymbols = await findAllSymbolsByCategory(2);

console.log({ crypto: cryptoSymbols, bourse: stockSymbols });
