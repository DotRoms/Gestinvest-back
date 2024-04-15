import dayjs from 'dayjs';

export default {

  // Permet de tronquer un nombre à huit chiffres après la virgule
  truncateToEightDecimals(nombre) {
    return Math.trunc(nombre * 100000000) / 100000000;
  },

  // Permet de tronquer un nombre à deux chiffres après la virgule
  truncateToTwoDecimals(nombre) {
    return Math.trunc(nombre * 100) / 100;
  },

  // Permet de formater la date au format FR jj-mm-aaaa
  formatDateFr(date) {
    const dateToFormat = dayjs(date);
    return dateToFormat.format('DD-MM-YYYY');
  },

  calculate(data) {
    let totalEstimateAsset = 0;
    let totalAssetNumber = 0;
    const { name } = data[0];
    const { symbol } = data[0];
    const assetId = data[0].asset_id;
    const assetLineDetail = [];

    data.forEach((line) => {
      const lineId = line.id;
      const date = this.formatDateFr(line.invest_date);
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
      assetId,
      assetLineDetail
    };
  }
};
