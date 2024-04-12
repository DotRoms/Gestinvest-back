export default {
  // Permet de tronquer un nombre à deux chiffres après la virgule
  truncateToTwoDecimals(nombre) {
    return Math.trunc(nombre * 100) / 100;
  },

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
      const assetPrice = this.truncateToTwoDecimals(parseFloat(line.asset_price));
      const pourcentFees = line.fees;
      const assetName = line.asset_name;
      const { symbol } = line;
      const category = line.name;
      const transactionType = line.trading_operation_type;
      const totalEstimate = buyQuantity * assetPrice;

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
    const gainOrLossPourcent = this.truncateToTwoDecimals(((totalEstimatePortfolio - totalInvestment) / totalInvestment) * 100);

    // On calcule le gain ou la perte en valeur du portefeuille
    const gainOrLossMoney = this.truncateToTwoDecimals(totalEstimatePortfolio - totalInvestment);

    // On calcule la valeur totale du portefeuille par catégorie pour ensuite pouvoir calculer la répartition du portefeuille en pourcentage
    assetUserInformation.forEach((asset) => {
      if (asset.assetCategory === 'crypto') {
        priceByCategory.crypto += asset.totalEstimatedValueByAsset;
      } else if (asset.assetCategory === 'stock') {
        priceByCategory.stock += asset.totalEstimatedValueByAsset;
      }
    });

    // On calcule la répartition du portefeuille, pourcentage de crypto et de stock que l'ont truncate ensuite
    let cryptoPourcent = this.truncateToTwoDecimals((priceByCategory.crypto / (priceByCategory.crypto + priceByCategory.stock)) * 100);
    let stockPourcent = this.truncateToTwoDecimals((priceByCategory.stock / (priceByCategory.stock + priceByCategory.crypto)) * 100);

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
    totalEstimatePortfolio = this.truncateToTwoDecimals(totalEstimatePortfolio);
    console.log(assetUserInformation);
    assetUserInformation.forEach((asset) => {
      asset.totalEstimatedValueByAsset = this.truncateToTwoDecimals(asset.totalEstimatedValueByAsset);
    });

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
