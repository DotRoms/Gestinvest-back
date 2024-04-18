import 'dotenv/config';
import assetDatamapper from '../datamappers/asset.datamapper.js';

const groupSymbols = {

  /**
 * Cette fonction prend une catégorie d'actifs identifiée par categoryId
 * et divise les symboles correspondants en groupes de taille groupSize.
 * Elle utilise une méthode asynchrone pour récupérer les symboles,
 * les regroupe en fonction de la taille spécifiée,
 * puis retourne ces groupes de symboles.
 *
 * @param {string} categoryId - L'identifiant de la catégorie des actifs.
 * @param {number} groupSize - La taille de chaque groupe de symboles.
 * @returns {string[]} - Un tableau contenant les groupes de symboles.
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
