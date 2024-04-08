import 'dotenv/config';
import assetDatamapper from '../datamappers/asset.datamapper.js';

const groupSymbols = {

  // On récupère les symbols par groupe de 40 car l'api nous limite à 40 symbols par requête
  /**
   * params {Number} - Id category
   * params {Number} - Number of symbol for one request
   */
  async getSymbolsInGroups(categoryId, groupSize) {
    const symbols = await assetDatamapper.findAllSymbolsByCategory(categoryId);
    const symbolArray = symbols.map((obj) => obj.symbol);

    const groups = [];
    for (let i = 0; i < symbolArray.length; i += groupSize) {
      groups.push(symbolArray.slice(i, i + groupSize).join(','));
    }

    return groups;
  }
};

export default groupSymbols;
