import dayjs from 'dayjs';
import truncate from './truncate.js';

export default {

  // Permet de formater la date au format FR jj-mm-aa
  formatDateFr(date) {
    const dateToFormat = dayjs(date);
    return dateToFormat.format('DD-MM-YY');
  },

  /**
   * Cette fonction prend en paramètre un tableau d'objets contenant des informations sur un actif
   * @param {Object[]} data - Un tableau d'objets contenant des informations sur un actif
   */

  calculate(data) {
    let totalEstimateAsset = 0;
    let totalAssetNumber = 0;
    let { symbol } = data[0];
    const { name } = data[0];
    const { local } = data[0];
    const { price } = data[0];
    const categoryName = data[0].category_name;
    const assetId = data[0].asset_id;
    const assetLineDetail = [];

    data.forEach((line) => {
      const lineId = line.id;
      const date = this.formatDateFr(line.invest_date);
      const priceInvest = parseFloat(line.price_invest);
      const buyQuantity = parseFloat(line.asset_number);
      const { fees } = line;
      let operationType = line.trading_operation_type;

      const totalInvestLineWithoutFees = (buyQuantity * priceInvest);
      const totalInvestLineWithFees = totalInvestLineWithoutFees - (totalInvestLineWithoutFees * (fees / 100));

      if (operationType === 'buy') {
        totalAssetNumber += buyQuantity;
        operationType = 'Achat';
      } else if (operationType === 'sell') {
        totalAssetNumber -= buyQuantity;
        operationType = 'Vente';
      }

      assetLineDetail.push({
        lineId,
        date,
        operationType,
        buyQuantity,
        priceInvest,
        fees,
        totalInvestLineWithFees
      });
    });

    totalEstimateAsset = totalAssetNumber * price;

    // On retire l'extension .PA pour les actions européen, pour pouvoir utiliser le symbole dans le widget tradingview
    if (categoryName === 'stock') {
      symbol = symbol.replace(/\.PA$/, '');
    }

    /**
     * Les détails calculés d'un actif financier.
     * @typedef {Object} assetDetailsCalculated
     * @property {number} totalEstimateAsset - L'estimation totale de l'actif financier, arrondie à deux décimales.
     * @property {number} totalAssetNumber - Le nombre total d'actifs financiers, arrondi à huit décimales.
     * @property {string} name - Le nom de l'actif financier.
     * @property {string} symbol - Le symbole de l'actif financier.
     * @property {string} local - Utilisé pour setup le widget tradingview.
     * @property {string} categoryName - Le nom de la catégorie de l'actif financier.
     * @property {number} assetId - L'identifiant de l'actif financier.
     * @property {Array.<Object>} assetLineDetail - Les détails de chaque ligne d'opération sur l'actif financier.
     */

    return {
      totalEstimateAsset: truncate.truncateToTwoDecimals(totalEstimateAsset),
      totalAssetNumber: truncate.truncateToEightDecimals(totalAssetNumber),
      name,
      symbol,
      local,
      categoryName,
      assetId,
      assetLineDetail
    };
  }
};
