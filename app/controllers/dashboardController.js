import dashboardDatamapper from "../datamapper/dashboard.datamapper.js";
import calculate from "../utils/scripts.calculate.js";

const dashboard = {
  async dashboardDetail(req, res) {
    const { id } = req.params;
    const allLines = await dashboardDatamapper.findAllTradingLinesByUser(id);
    let totalInvestment = 0;
    let assetUserInformation = [];

    allLines.forEach((line) => {
      const quantity = parseFloat(line.asset_number);
      const totalPrice = line.price_invest * quantity;
      const symbol = line.symbol;
      const todayPrice = line.asset_price;
      const gainOrLossPourcent = calculate.calculatePourcentGainOrLoss(
        totalPrice,
        todayPrice
      );
      const gainOrLossMoney = calculate.calculateMoneyGainOrLoss(
        totalPrice,
        gainOrLossPourcent
      );

      if (line.trading_operation_type === "buy") {
        totalInvestment += totalPrice;
        const existingAsset = assetUserInformation.find(
          (asset) => asset.symbol === symbol
        );
        if (existingAsset) {
          existingAsset.quantity += quantity;
          existingAsset.gainOrLossMoney += gainOrLossMoney;
        } else {
          assetUserInformation.push({
            symbol: symbol,
            quantity: quantity,
            pourcentGainOrLoss: gainOrLossPourcent,
            gainOrLossMoney: gainOrLossMoney,
          });
        }
      } else if (line.trading_operation_type === "sell") {
        totalInvestment -= totalPrice;
        const existingAsset = assetUserInformation.find(
          (asset) => asset.symbol === symbol
        );
        if (existingAsset && existingAsset.quantity >= quantity) {
          existingAsset.quantity -= quantity;
        }
      } else {
        assetUserInformation.push({
          symbol: symbol,
          quantity: quantity,
          pourcentGainOrLoss: gainOrLossPourcent,
          gainOrLossMoney: gainOrLossMoney,
        });
      }
    });

    const totalPortfolio = calculate.calculateTotalGainByAsset(assetUserInformation);
    res.json({
      totalInvestment,
      assetUserInformation,
      totalPortfolio,
    });
  },
};

export default dashboard;
