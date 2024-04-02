export default {
  calculatePourcentGainOrLoss(oldAssetPrice, newAssetPrice) {
    const differencePrice = newAssetPrice - oldAssetPrice;
    const pourcent = (differencePrice / oldAssetPrice) * 100;
    return pourcent;
  },

  calculateMoneyGainOrLoss(totalPrice, gainOrLossPourcent) {
  return totalPrice * gainOrLossPourcent / 100;
  },

  calculateTotalGainByAsset(data) {
    let totalPortfolio = 0;
    data.forEach((asset) => {
      if (asset.quantity > 0) {
        totalPortfolio += asset.gainOrLossMoney * asset.quantity; 
      } 
    });
    console.log(totalPortfolio);
    return totalPortfolio;
  }
};