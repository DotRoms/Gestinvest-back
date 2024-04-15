export default {

  truncateToEightDecimals(nombre) {
    return Math.trunc(nombre * 100000000) / 100000000;
  },
  truncateToTwoDecimals(nombre) {
    return Math.trunc(nombre * 100) / 100;
  },

  calculate(data) {
    let totalEstimateAsset = 0;
    let totalAssetNumber = 0;
    const { name } = data[0];
    const { symbol } = data[0];
    const assetLineDetail = [];

    data.forEach((line) => {
      const lineId = line.id;
      const date = line.invest_date;
      const priceInvest = parseFloat(line.price_invest);
      const buyQuantity = parseFloat(line.asset_number);
      const operationType = line.trading_operation_type;
      const { fees } = line;

      const totalInvestLineWithoutFees = (buyQuantity * priceInvest);
      const totalInvestLineWithFees = totalInvestLineWithoutFees - (totalInvestLineWithoutFees * (fees / 100));

      if (operationType === 'buy') {
        totalEstimateAsset += totalInvestLineWithFees;
        totalAssetNumber += buyQuantity;
      } else if (operationType === 'sell') {
        totalEstimateAsset -= totalInvestLineWithFees;
        totalAssetNumber -= buyQuantity;
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

    return {
      totalEstimateAsset: this.truncateToTwoDecimals(totalEstimateAsset),
      totalAssetNumber: this.truncateToEightDecimals(totalAssetNumber),
      name,
      symbol,
      assetLineDetail
    };
  }
};
