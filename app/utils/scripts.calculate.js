export default {

  getAssetUserInformation(data) {
    const assetUserInformation = [];
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

    const gainOrLossPourcent = ((totalEstimatePortfolio - totalInvestment) / totalInvestment) * 100;
    const gainOrLossMoney = totalEstimatePortfolio - totalInvestment;

    return {
      totalInvestment,
      totalEstimatePortfolio,
      gainOrLossPourcent,
      gainOrLossMoney,
      assetUserInformation
    };
  }
};
