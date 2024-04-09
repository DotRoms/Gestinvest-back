import dbClient from './dbClient.js';

const assets = {
  // retoune tous les assets
  async findAll() {
    const result = await dbClient.query('SELECT * FROM asset');
    return result.rows;
  },

  async findAllSymbolsByCategory(categoryId) {
    const result = await dbClient.query(
      'SELECT symbol FROM asset WHERE "category_id" = $1',
      [categoryId]
    );
    return result.rows;
  },
  // retourne un asset par son id
  async findOne(id) {
    const result = await dbClient.query('SELECT * FROM asset WHERE "id" = $1', [
      id
    ]);
    return result.rows[0];
  },

  // retourne tous les assets contenant une partie du nom en entrée
  async findAllByPartialName(name) {
    const partialName = name.toLowercase();
    const result = await dbClient.query(
      'SELECT * FROM asset WHERE LOWER("name") LIKE $1 ORDER BY CASE WHEN LOWER("name") = $2 THEN 0 ELSE 1 END',
      [`%${partialName}%`, partialName]
    );
    return result.rows;
  },

  // retourne tous les assets contenant une partie du symbol en entrée
  async findByPartialName(symbol) {
    const partialSymbol = symbol.toLowercase();
    const result = await dbClient.query(
      'SELECT * FROM asset WHERE LOWER("symbol") LIKE $1 ORDER BY CASE WHEN LOWER("symbol") = $2 THEN 0 ELSE 1 END',
      [`%${partialSymbol}%`, partialSymbol]
    );
    return result.rows;
  },

  // retourne un asset par son nom
  async findOneByName(name) {
    const lowerName = name.toLowercase();
    const result = await dbClient.query(
      'SELECT * FROM asset WHERE LOWER("name") = $1',
      [lowerName]
    );
    return result.rows[0];
  },

  // retourne un asset par son symbole
  async findOneBySymbol(symbol) {
    const lowerSymbol = symbol.toLowercase();
    const result = await dbClient.query(
      'SELECT * FROM asset WHERE LOWER("symbol") = $1',
      [lowerSymbol]
    );
    return result.rows[0];
  },

  // retourne un asset par sa catégorie
  async findByCategoryId(category) {
    const result = await dbClient.query(
      'SELECT * FROM asset WHERE "category_id" = $1',
      [category]
    );
    return result.rows;
  },

  // met à jour le prix d'un asset
  async updatePrices(symbol, price) {
    const symb = symbol.toUpperCase();
    await dbClient.query('UPDATE asset SET "price" = $1 WHERE "symbol" = $2', [
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
