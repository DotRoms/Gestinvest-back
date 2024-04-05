import dbClient from '../datamappers/dbClient.js';

async function findAllSymbolsByCategory(categoryId) {
  const result = await dbClient.query('SELECT symbol FROM "asset" WHERE "category_id" = $1', [categoryId]);
  return result.rows;
}

console.log(await findAllSymbolsByCategory(1));

// export default {

//   cryptoSymbol: async () => await assetDatamapper.findAllSymbolsByCategory(1),
//   stockSymbol: async () => await assetDatamapper.findAllSymbolsByCategory(2)
// };
