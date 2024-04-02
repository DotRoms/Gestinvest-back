import dashboardDatamapper from '../datamapper/dashboard.datamapper.js';

const dashboard = {

  async dashboardDetail(req, res) {
    const { id } = req.params;
    const allLines = await dashboardDatamapper.findAllTradingLinesByUser(id);

    let allInvest = 0;
    let allSell = 0;
    const assetQuantity = {};

    allLines.forEach((line) => {
      const totalPrice = line.price_invest * line.asset_number;
      const { symbol } = line;
      const quantity = line.asset_number;

      if (line.trading_operation_type === 'buy') {
        allInvest += totalPrice;
        if (assetQuantity.hasOwnProperty(symbol)) {
          assetQuantity[symbol] += quantity;
        } else {
          assetQuantity[symbol] = quantity;
        }
      } else if (line.trading_operation_type === 'sell') {
        allSell += totalPrice;
        // Si vous avez besoin de suivre le nombre d'actions vendues pour chaque symbole, vous pouvez le faire ici
      }
    });

    // assetQuantity.forEach((quantity) => {
    //   for (let i = 0; i < quantity.length; i++) {
    //     const newQuantity = quantity[0] + quantity[i + 1];
    //   }
    // });
    for (const symbol in assetQuantity) {
      let totalQuantity = 0;
      allLines.forEach((line) => {
        if (line.symbol === symbol) {
          totalQuantity += line.asset_number;
        }
      });
      assetQuantity[symbol] = totalQuantity;
    }

    const totalinvest = allInvest - allSell;
    res.json({ totalinvest, assetQuantity });
  }
};

export default dashboard;
