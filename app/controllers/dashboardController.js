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

    // On récupère les données de la requête pour pouvoir les ajout de l'achat ou de la vente d'asset
    const assetName = req.body.asset_name;
    const assetNumber = req.body.asset_number;
    const { price } = req.body;
    const { fees } = req.body;
    const { date } = req.body;

    // On récupère l'id du portfolio de l'utilisateur
    const portfolioId = await userDatamapper.getPortfolioByUserId(id);

    // On récupère l'id du type de l'opération
    const tradingTypeId = await tradingOperationDatamapper.getOperationByName(tradingOperationType);

    // On récupère l'id de l'asset que l'on achète ou vend
    const assetId = await assetDatamapper.getAssetId(assetName);

    // On récupère toutes les lignes d'investissement de l'utilisateur et on fait tout les calculs
    const allLines = await dashboardDatamapper.findAllTradingLinesByUser(id);
    const assetInformationByUser = calculateAssetInformation.getAssetUserInformation(allLines);

    // On vérifie si l'utilisateur ne vend pas plus d'asset qu'il n'en possède
    if (tradingOperationType === 'sell') {
      const invalidData = assetInformationByUser.assetUserInformation.find((obj) => obj.assetName.toLowerCase() === assetName.toLowerCase() && obj.quantity < assetNumber);

      if (invalidData || assetNumber === 0) {
        return res.status(400).json({ errorMessage: 'La valeur saisie n\'est pas valide' });
      }
    }

    // On regroupe la data pour pouvoir les ajouter en base de données
    const newData = {
      assetId: assetId.id,
      portfolioId: portfolioId.id,
      asset_number: assetNumber,
      price,
      fees,
      date,
      tradingOperationTypeId: tradingTypeId.id
    };

    // Une fois les vérifications effectuées, on ajoute la ligne en base de données
    await dashboardDatamapper.addLine(newData);

    // On retourne que l'ajout a bien été effectué
    return res.json({ successMessage: 'Ajout bien effectuer' });
  }
};
export default dashboard;
