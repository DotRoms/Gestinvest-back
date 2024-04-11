export default {

  getAssetUserInformation(data) {
    const assetUserInformation = [];

    const priceByCategory = {
      crypto: 0,
      stock: 0
    };

    let totalEstimatePortfolio = 0;
    let totalInvestment = 0;

    data.forEach((line) => {
      const buyQuantity = parseFloat(line.asset_number);
      const priceInvest = parseFloat(line.price_invest);
      const assetPrice = parseFloat(line.asset_price);
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

    const gainOrLossPourcent = Math.round(((totalEstimatePortfolio - totalInvestment) / totalInvestment) * 100);
    const gainOrLossMoney = totalEstimatePortfolio - totalInvestment;

    assetUserInformation.forEach((asset) => {
      if (asset.assetCategory === 'crypto') {
        priceByCategory.crypto += asset.totalEstimatedValueByAsset;
      } else if (asset.assetCategory === 'stock') {
        priceByCategory.stock += asset.totalEstimatedValueByAsset;
      }
    });

    let cryptoPourcent = (priceByCategory.crypto / (priceByCategory.crypto + priceByCategory.stock)) * 100;
    let stockPourcent = (priceByCategory.stock / (priceByCategory.stock + priceByCategory.crypto)) * 100;

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
      assetUserInformation[index].gainOrLossTotalByAsset = gainOrLoss > 0 ? 'positive' : 'negative';
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
