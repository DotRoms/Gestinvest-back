import dashboardDatamapper from '../datamappers/dashboard.datamapper.js';
import calculateAssetInformation from '../utils/scripts.calculate.js';
import assetDatamapper from '../datamappers/asset.datamapper.js';
import userDatamapper from '../datamappers/user.datamapper.js';
import tradingOperationDatamapper from '../datamappers/tradingOperation.datamapper.js';

const dashboard = {
  async dashboardDetail(req, res) {
    const { id } = req.user;
    const allLines = await dashboardDatamapper.findAllTradingLinesByUser(id);
    const assetInformationByUser = calculateAssetInformation.getAssetUserInformation(allLines);
    res.json({ userInformation: assetInformationByUser });
  },

  async openModal(req, res) {
    const allAsset = await assetDatamapper.findAssetNameAndCategory();
    res.json({ allAsset });
  },

  async addLine(req, res) {
    const { data } = req.body;
    const { id } = req.user;
    const portfolioId = await userDatamapper.getPortfolioByUserId(id);
    const tradingType = await tradingOperationDatamapper.getOperationByName(data.tradingOperationType);
    const assetId = await assetDatamapper.getAssetId(data.assetName);
    const allLines = await dashboardDatamapper.findAllTradingLinesByUser(id);
    const assetInformationByUser = calculateAssetInformation.getAssetUserInformation(allLines);

    if (data.tradingOperationType === 'sell') {
      const invalidData = assetInformationByUser.assetUserInformation.find((obj) => obj.assetName.toLowerCase() === data.assetName.toLowerCase() && obj.quantity < data.assetNumber);

      if (invalidData || data.assetNumber === 0) {
        return res.status(400).json({ errorMessage: 'La valeur saisie n\'est pas valide' });
      }
    }

    const newData = {
      assetId: assetId.id,
      portfolioId: portfolioId.id,
      assetNumber: data.assetNumber,
      price: data.price,
      fees: data.fees,
      date: data.date,
      tradingOperationTypeId: tradingType.id
    };
    await dashboardDatamapper.addLine(newData);
    return res.json({ successMessage: 'Ajout bien effectuer' });
  }
};
export default dashboard;
