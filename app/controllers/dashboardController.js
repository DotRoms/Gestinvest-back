import dashboardDatamapper from '../datamappers/dashboard.datamapper.js';
import calculateAssetInformation from '../utils/scripts.calculate.js';
import assetDatamapper from '../datamappers/asset.datamapper.js';
import userDatamapper from '../datamappers/user.datamapper.js';
import tradingOperationDatamapper from '../datamappers/tradingOperation.datamapper.js';

const dashboard = {
  async dashboardDetail(req, res) {
    // On récupère l'id de l'utilisateur
    const { id } = req.user;

    // On récupère toutes les lignes d'investissement de l'utilisateur et on fait tout les calculs
    const allLines = await dashboardDatamapper.findAllTradingLinesByUser(id);
    const assetInformationByUser = calculateAssetInformation.getAssetUserInformation(allLines);
    res.json({ userInformation: assetInformationByUser });
  },

  async openModal(req, res) {
    // On récupère tout les assets avec leurs catégories
    const allAsset = await assetDatamapper.findAssetNameAndCategory();
    res.json({ allAsset });
  },

  async addLine(req, res) {
    // On récupère l'id de l'utilisateur
    const { id } = req.user;

    // On récupère l'url pour savoir si c'est un achat ou une vente
    const { url } = req;
    const tradingOperationType = url.substring(1, url.indexOf('?'));

    // On récupère les données de la requête (modal achat/vente)
    const { data } = req.body;

    // On récupère l'id du portfolio de l'utilisateur
    const portfolioId = await userDatamapper.getPortfolioByUserId(id);

    // On récupère l'id du type de l'opération
    const tradingTypeId = await tradingOperationDatamapper.getOperationByName(tradingOperationType);

    // On récupère l'id de l'asset que l'on achète ou vend
    const assetId = await assetDatamapper.getAssetId(data.asset_name);

    // On récupère toutes les lignes d'investissement de l'utilisateur et on fait tout les calculs
    const allLines = await dashboardDatamapper.findAllTradingLinesByUser(id);
    const assetInformationByUser = calculateAssetInformation.getAssetUserInformation(allLines);

    // On vérifie si l'utilisateur ne vend pas plus d'asset qu'il n'en possède
    if (data.tradingOperationType === 'sell') {
      const invalidData = assetInformationByUser.assetUserInformation.find((obj) => obj.asset_name.toLowerCase() === data.asset_name.toLowerCase() && obj.quantity < data.asset_number);

      if (invalidData || data.assetNumber === 0) {
        return res.status(400).json({ errorMessage: 'La valeur saisie n\'est pas valide' });
      }
    }

    // On regroupe les data pour pouvoir les ajouter en base de données
    const newData = {
      assetId: assetId.id,
      portfolioId: portfolioId.id,
      asset_number: data.asset_number,
      price: data.price,
      fees: data.fees,
      date: data.date,
      tradingOperationTypeId: tradingTypeId.id
    };

    // Une fois les vérifications effectuées, on ajoute la ligne en base de données
    await dashboardDatamapper.addLine(newData);

    return res.json({ successMessage: 'Ajout bien effectuer' });
  }
};
export default dashboard;
