import dashboardDatamapper from '../datamappers/dashboard.datamapper.js';
import calculateAssetInformation from '../utils/scripts.calculate.js';

const dashboard = {
  async dashboardDetail(req, res) {
    const { uuid } = req.params;
    const allLines = await dashboardDatamapper.findAllTradingLinesByUser(uuid);
    const assetInformationByUser = calculateAssetInformation.getAssetUserInformation(allLines);
    res.json(assetInformationByUser);
  }
};

export default dashboard;
