import dbClient from './dbClient.js';

const assets = {

  async findAllSymbolsByCategory(categoryId) {
    const result = await dbClient.query(
      'SELECT symbol FROM asset WHERE "category_id" = $1',
      [categoryId]
    );
    return result.rows;
  },

  // met à jour le prix d'un asset
  async updatePrices(symbol, price) {
    const symb = symbol.toUpperCase();
    await dbClient.query('UPDATE asset SET "price" = $1, "updated_at" = NOW() WHERE "symbol" = $2', [
      price,
      symb
    ]);
  },

  async findAssetNameAndCategory() {
    const result = await dbClient.query(`
    SELECT 
      asset.name AS asset_name,
      category.name AS category_name
  FROM asset
    JOIN 
      category ON asset.category_id = category.id`);
    return result.rows;
  },

  async getAssetId(assetName) {
    const name = assetName.toLowerCase();
    const result = await dbClient.query('SELECT id FROM asset WHERE LOWER("name") = $1', [name]);
    return result.rows[0];
  }
};

export default assets;
