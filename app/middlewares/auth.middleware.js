import jwt from 'jsonwebtoken';
import user from '../datamapper/user.datamapper.js';

export default {
  async authMiddleware(req, res, next) {
    try {
      // Extraire le token des headers de la requête
      const token = req.headers.authorization;

      // Vérifier que le token est préfixé par "Bearer"
      if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ errorMessage: 'Requête non authentifiée' });
      }

      // Vérifier la validité du token et extraire les informations d'identification de l'utilisateur
      const jwtToken = token.slice(7);
      const decodedToken = jwt.verify(jwtToken, process.env.JWT_PRIVATE_KEY);

      // Vérifier si l'utilisateur existe dans la base de données avec les informations extraites
      const userInfo = await user.findByEmail(decodedToken.email);

      if (!user) {
        return res.status(401).json({ errorMessage: 'Utilisateur non trouvé' });
      }

      // Stocker les informations d'identification de l'utilisateur dans l'objet de demande pour une utilisation ultérieure
      req.user = userInfo;

      // Continuer vers la prochaine étape du pipeline middleware
      return next();
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      return res.status(401).json({ errorMessage: 'Erreur d\'authentification' });
    }
  }

};
