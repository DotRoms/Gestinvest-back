export default {

   getAssetUserInformation(data) {
    let assetUserInformation = [];
    let totalEstimatePortfolio = 0;
    let totalInvestment = 0;
    
    data.forEach((line) => {
      const buyQuantity = parseFloat(line.asset_number);
      const priceInvest = parseFloat(line.price_invest);
      const assetPrice = parseFloat(line.asset_price);
      const symbol = line.symbol;
      const category = line.name;
      const transactionType = line.trading_operation_type;
      const totalEstimate = buyQuantity * assetPrice;
      
      const totalInvestLine = buyQuantity * priceInvest;

      if (transactionType === "buy") {
        totalInvestment += totalInvestLine;
        const existingAsset = assetUserInformation.find(
          (asset) => asset.symbol === symbol
        );
        if (existingAsset) {
          existingAsset.quantity += buyQuantity;
          existingAsset.totalInvestByAsset += totalInvestLine;
          existingAsset.totalEstimatedValueByAsset += totalEstimate;
          existingAsset.assetCategory = category;

        } else {
          assetUserInformation.push({
            symbol: symbol,
            quantity: buyQuantity,
            totalInvestByAsset: totalInvestLine,
            totalEstimatedValueByAsset: totalEstimate,
            assetCategory: category
          });
        }
      } else if (transactionType === "sell") {
        totalInvestment -= totalInvestLine;
        const existingAsset = assetUserInformation.find(
          (asset) => asset.symbol === symbol
        );
        if (existingAsset) {
          existingAsset.quantity -= buyQuantity;
          existingAsset.totalInvestByAsset -= totalInvestLine;
          existingAsset.totalEstimatedValueByAsset -= totalEstimate;
        } else {
          assetUserInformation.push({
            symbol: symbol,
            quantity: buyQuantity,
            totalInvestByAsset: totalInvestLine,
            totalEstimatedValueByAsset: totalEstimate
          });
        }
      }

    });

    data.forEach((line) => {
      const buyQuantity = line.asset_number;
      const assetPrice = line.asset_price;
      const transactionType = line.trading_operation_type;

      if (transactionType === "buy") {
        totalEstimatePortfolio += buyQuantity * assetPrice;
      } else if (transactionType === "sell") {
        totalEstimatePortfolio -= buyQuantity * assetPrice;
      }

    });

    const gainOrLossPourcent =
      ((totalEstimatePortfolio - totalInvestment) / totalInvestment) * 100;
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