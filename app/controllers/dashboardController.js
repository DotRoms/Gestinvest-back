import assetDatamapper from '../datamappers/asset.datamapper.js';
import dashboardDatamapper from '../datamappers/dashboard.datamapper.js';
import tradingOperationDatamapper from '../datamappers/tradingOperation.datamapper.js';
import userDatamapper from '../datamappers/user.datamapper.js';
import scriptAssetCalculate from '../utils/script.asset.calculate.js';
import calculateAssetInformation from '../utils/scripts.dashboard.calculate.js';
import isDateOk from '../utils/testDate.js';

const dashboard = {
  async dashboardDetail(req, res) {
    // On récupère l'id de l'utilisateur
    const { id } = req.user;

    // On récupère toutes les lignes d'investissement de l'utilisateur et on fait tout les calculs
    const allLines = await dashboardDatamapper.findAllTradingLinesByUser(id);
    const assetInformationByUser = calculateAssetInformation.getAssetUserInformation(allLines);
    const newAssetInformationByUser = assetInformationByUser.assetUserInformation;

    // On vérifie si l'utilisateur réalise une vente équivalente au total des actifs possédé, si égale a 0 alors on supprime la ligne pour ne pas l'afficher sur le dashboard
    newAssetInformationByUser.forEach((obj, index) => {
      if (obj.quantity === 0) {
        newAssetInformationByUser.splice(index, 1);
      }
    });
    res.json({ userInformation: assetInformationByUser });
  },

  async openModal(req, res) {
    // On récupère tout les assets avec leurs catégories
    const allAsset = await assetDatamapper.findAssetNameAndCategory();
    res.json({ allAsset });
  },

  async addLine(req, res) {
    // On récupère les données de la requête pour pouvoir faire l'ajout de l'achat ou de la vente d'asset
    const assetName = req.body.asset_name;
    const assetNumber = req.body.asset_number;
    const { price } = req.body;
    const { fees } = req.body;
    const { date } = req.body;

    // On vérifie que la date envoyée par l'utilisateur n'est pas supérieur à la date actuelle
    const dateCheck = isDateOk(date);
    if (dateCheck) {
      throw new Error('La date n\'est pas valide');
    }

    // On vérifie que tous les champs soient bien remplis
    if (!assetName || !assetNumber || !price || !fees || !date) {
      throw new Error('Veuillez remplir tous les champs');
    }

    // On récupère l'id de l'asset que l'on achète ou vend
    const assetId = await assetDatamapper.getAssetId(assetName);
    if (!assetId) {
      throw new Error('Cet actif n\'est pas répertorié');
    }

    // On récupère l'id de l'utilisateur
    const { id } = req.user;

    // On récupère l'url pour savoir si c'est un achat ou une vente
    const { url } = req;
    // On enleve le / de l'url pour recuperer buy ou sell
    const tradingOperationType = url.substring(1);

    // On récupère l'id du portfolio de l'utilisateur
    const portfolioId = await userDatamapper.getPortfolioByUserId(id);

    // On récupère l'id du type de l'opération
    const tradingTypeId = await tradingOperationDatamapper.getOperationByName(tradingOperationType);

    // On récupère toutes les lignes d'investissement de l'utilisateur et on fait tout les calculs
    const allLines = await dashboardDatamapper.findAllTradingLinesByUser(id);
    const assetInformationByUser = calculateAssetInformation.getAssetUserInformation(allLines);

    if (tradingOperationType === 'sell') {
      const asset = assetInformationByUser.assetUserInformation.find((obj) => obj.assetName.toLowerCase() === assetName.toLowerCase());

      // Vérifie si l'objet existe
      if (!asset) {
        throw new Error('L\'actif spécifié n\'existe pas dans votre portefeuille');
      }

      // Vérifie si la quantité à vendre est valide
      if (asset.quantity < assetNumber) {
        throw new Error('La quantité à vendre dépasse ce que vous possédez');
      }

      // Vérifie si assetNumber est positif
      if (assetNumber <= 0) {
        throw new Error('La quantité à vendre doit être supérieure à zéro');
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
  },

  async assetDetails(req, res) {
    // On récupère le symbole de l'asset depuis les params de la requête
    const symbol = req.params.asset;

    // On récupère l'id de l'utilisateur
    const userId = req.user.id;

    // On récupère toutes les lignes d'investissement de l'utilisateur pour un actif donné
    const assetDetails = await dashboardDatamapper.getAllAssetLineByUser(userId, symbol);

    // On fait les calculs pour avoir le détail de toutes les lignes suivant un actif
    const assetDetailsCalculated = scriptAssetCalculate.calculate(assetDetails);

    res.json({ assetDetailsCalculated });
  }
};
export default dashboard;
