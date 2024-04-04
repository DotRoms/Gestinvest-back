import dashboardDatamapper from "../datamapper/dashboard.datamapper.js";
import calculateAssetInformation from "../utils/scripts.calculate.js";

const dashboard = {
  async dashboardDetail(req, res) {
    const { id } = req.params;
    const allLines = await dashboardDatamapper.findAllTradingLinesByUser(id);
    
    const assetInformationByUser = calculateAssetInformation.getAssetUserInformation(allLines)
    res.json(assetInformationByUser);
  }
};

export default dashboard;