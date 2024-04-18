import truncate from './truncate.js';

export default {

  /**
   * Cette fonction prend en paramètre un tableau d'objets contenant des informations sur les lignes d'investissement de l'utilisateur
   * @param {Object[]} data - Un tableau d'objets contenant des informations sur toutes les lignes d'investissement de l'utilisateur
   */
  // Calcul des informations de l'utilisateur
  getAssetUserInformation(data) {
    const assetUserInformation = [];

    const priceByCategory = {
      crypto: 0,
      stock: 0
    };

    let totalEstimatePortfolio = 0;
    let totalInvestment = 0;

    // On parcourt les lignes de transaction de l'utilisateur pour calculer le détail de son portefeuille par asset
    data.forEach((line) => {
      const buyQuantity = parseFloat(line.asset_number);
      const priceInvest = parseFloat(line.price_invest);
      const assetPrice = truncate.truncateToEightDecimals(parseFloat(line.asset_price));
      const pourcentFees = line.fees;
      const assetName = line.asset_name;
      const { symbol } = line;
      const category = line.name;
      const transactionType = line.trading_operation_type;
      const totalEstimate = truncate.truncateToTwoDecimals(buyQuantity * assetPrice);

      const totalInvestLineWithoutFees = (buyQuantity * priceInvest);
      const totalInvestLineWithFees = totalInvestLineWithoutFees - (totalInvestLineWithoutFees * (pourcentFees / 100));

      if (transactionType === 'buy') {
        totalInvestment += totalInvestLineWithFees;
        const existingAsset = assetUserInformation.find(
          (asset) => asset.symbol === symbol
        );
        if (existingAsset) {
          existingAsset.quantity += buyQuantity;
          existingAsset.totalInvestByAsset += totalInvestLineWithFees;
          existingAsset.totalEstimatedValueByAsset += totalEstimate;
          existingAsset.assetCategory = category;
        } else {
          assetUserInformation.push({
            symbol,
            quantity: buyQuantity,
            totalInvestByAsset: totalInvestLineWithFees,
            totalEstimatedValueByAsset: totalEstimate,
            assetCategory: category,
            assetName,
            assetPrice
          });
        }
      } else if (transactionType === 'sell') {
        totalInvestment -= totalInvestLineWithFees;
        const existingAsset = assetUserInformation.find(
          (asset) => asset.symbol === symbol
        );
        if (existingAsset) {
          existingAsset.quantity -= buyQuantity;
          existingAsset.totalInvestByAsset -= totalInvestLineWithFees;
          existingAsset.totalEstimatedValueByAsset -= totalEstimate;
        } else {
          assetUserInformation.push({
            symbol,
            quantity: buyQuantity,
            totalInvestByAsset: totalInvestLineWithFees,
            totalEstimatedValueByAsset: totalEstimate,
            assetName,
            assetPrice
          });
        }
      }
    });

    // On parcourt les lignes de transaction de l'utilisateur pour calculer la valeur de son portefeuille
    data.forEach((line) => {
      const buyQuantity = line.asset_number;
      const assetPrice = line.asset_price;
      const transactionType = line.trading_operation_type;

      if (transactionType === 'buy') {
        totalEstimatePortfolio += buyQuantity * assetPrice;
      } else if (transactionType === 'sell') {
        totalEstimatePortfolio -= buyQuantity * assetPrice;
      }
    });

    // On calcule le pourcentage de gain ou de perte du portefeuille
    const gainOrLossPourcent = truncate.truncateToTwoDecimals(((totalEstimatePortfolio - totalInvestment) / totalInvestment) * 100);

    // On calcule le gain ou la perte en valeur du portefeuille
    const gainOrLossMoney = truncate.truncateToTwoDecimals(totalEstimatePortfolio - totalInvestment);

    // On calcule la valeur totale du portefeuille par catégorie pour ensuite pouvoir calculer la répartition du portefeuille en pourcentage
    assetUserInformation.forEach((asset) => {
      if (asset.assetCategory === 'crypto') {
        priceByCategory.crypto += asset.totalEstimatedValueByAsset;
      } else if (asset.assetCategory === 'stock') {
        priceByCategory.stock += asset.totalEstimatedValueByAsset;
      }
    });

    // On calcule la répartition du portefeuille, pourcentage de crypto et de stock que l'ont truncate ensuite
    let cryptoPourcent = truncate.truncateToTwoDecimals((priceByCategory.crypto / (priceByCategory.crypto + priceByCategory.stock)) * 100);
    let stockPourcent = truncate.truncateToTwoDecimals((priceByCategory.stock / (priceByCategory.stock + priceByCategory.crypto)) * 100);

    if (Number.isNaN(cryptoPourcent)) {
      cryptoPourcent = 0;
    }
    if (Number.isNaN(stockPourcent)) {
      stockPourcent = 0;
    }

    // On teste si le portefeuille est en gain ou en perte pour afficher la couleur correspondante dans le front
    const gainOrLossTotalPortfolio = (totalEstimatePortfolio - totalInvestment) > 0 ? 'positive' : 'negative';

    assetUserInformation.forEach((asset, index) => {
      const gainOrLoss = asset.totalEstimatedValueByAsset - asset.totalInvestByAsset;
      // On teste si l'asset est en gain ou en perte pour afficher la couleur correspondante dans le front
      assetUserInformation[index].gainOrLossTotalByAsset = gainOrLoss > 0 ? 'positive' : 'negative';
    });

    // On tronque à deux chiffres après la virgule
    totalEstimatePortfolio = truncate.truncateToTwoDecimals(totalEstimatePortfolio);

    /**
     * Les détails du portefeuille de l'utilisateur.
     * @typedef {Object} userInformation
     * @property {number} totalInvestment - Le montant total investi par l'utilisateur.
     * @property {number} totalEstimatePortfolio - L'estimation totale du portefeuille de l'utilisateur.
     * @property {string} gainOrLossTotalPortfolio - La performance globale du portefeuille ('positive' si en gain, 'negative' sinon).
     * @property {number} gainOrLossPourcent - Le pourcentage de gain ou de perte du portefeuille.
     * @property {number} gainOrLossMoney - Le gain ou la perte en valeur du portefeuille.
     * @property {number} cryptoPourcent - Le pourcentage de la valeur du portefeuille investi en crypto-monnaies.
     * @property {number} stockPourcent - Le pourcentage de la valeur du portefeuille investi en actions.
     * @property {Object[]} assetUserInformation - Les détails de chaque actif dans le portefeuille de l'utilisateur.
     * @property {number} assetUserInformation[].quantity - La quantité d'actifs détenue.
     * @property {number} assetUserInformation[].totalInvestByAsset - Le montant total investi dans cet actif.
     * @property {number} assetUserInformation[].totalEstimatedValueByAsset - L'estimation totale de cet actif.
     * @property {string} assetUserInformation[].assetCategory - La catégorie de cet actif.
     * @property {string} assetUserInformation[].assetName - Le nom de cet actif.
     * @property {number} assetUserInformation[].assetPrice - Le prix de cet actif.
     * @property {string} assetUserInformation[].gainOrLossTotalByAsset - La performance de cet actif ('positive' si en gain, 'negative' sinon).
     * @property {string} assetUserInformation[].symbol - Le symbol lié a l'actif
     */

    return {
      totalInvestment,
      totalEstimatePortfolio,
      gainOrLossTotalPortfolio,
      gainOrLossPourcent,
      gainOrLossMoney,
      cryptoPourcent,
      stockPourcent,
      assetUserInformation
    };
  }
};
