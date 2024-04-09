import dashboardDatamapper from '../datamappers/dashboard.datamapper.js';
import calculateAssetInformation from '../utils/scripts.calculate.js';
import assetDatamapper from '../datamappers/asset.datamapper.js';

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
  }

};

export default dashboard;
