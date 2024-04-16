// import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userDatamapper from '../datamappers/user.datamapper.js';
import auth from '../utils/auth.js';

const accountController = {
  async getUser(req, res) {
    // On récupère l'id de l'utilisateur connecté
    const { id } = req.user;

    // On récupère les informations de l'utilisateur depuis la BDD
    const Oneuser = await userDatamapper.findOne(id);

    // On supprime le mot de passe de l'utilisateur
    res.json({ user: Oneuser });
  },

  async updateUser(req, res) {
    // On récupère les infos du formulaire de mise à jour
    const newEmail = req.body.email;
    const { firstname } = req.body;
    const { lastname } = req.body;
    const { password } = req.body;
    let userUpdated;
    let token;

    // On récupère l'id de l'utilisateur connecté
    const { id } = req.user;

    // On récupère les informations de l'utilisateur depuis la BDD
    const user = await userDatamapper.findOne(id);

    // On test si l'utilisateur a modifié son email
    if (newEmail !== user.email) {
      // On effectue les vérif pour l'email
      await auth.checkEmail(newEmail);

      // On vérifie si le mot de passe corrspond à celui déjà utilisé
      if (password !== user.password) {
        const { confirmation } = req.body;

        // On effectue les vérif sur le password et on le hash
        const hashedPassword = await auth.checkPassword(password, confirmation);

        if (newEmail !== user.email) {
          token = jwt.sign({ email: newEmail, user: user.id }, process.env.JWT_PRIVATE_KEY, { expiresIn: '24h' });
        }

        // On rassemble toute les données
        const dataUser = {
          newEmail,
          firstname,
          lastname,
          password: hashedPassword,
          updatedAt: new Date()
        };

        // On update les infos de l'utilisateur pour les mettre à jour en BDD
        userUpdated = await userDatamapper.update(id, dataUser);
        res.json({ userUpdated, token });
        return;
      }

      if (newEmail !== user.email) {
        token = jwt.sign({ email: newEmail, user: user.id }, process.env.JWT_PRIVATE_KEY, { expiresIn: '24h' });
      }

      // On rassemble toute les données
      const dataUser = {
        newEmail,
        firstname,
        lastname,
        password,
        updatedAt: new Date()
      };

      // On update les infos de l'utilisateur pour les mettre à jour en BDD
      userUpdated = await userDatamapper.update(id, dataUser);
      res.json({ userUpdated, token });
    }
  }
};
export default accountController;
