import userDatamapper from '../datamappers/user.datamapper.js';

const accountController = {
  async getUSer(req, res) {
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

    // On récupère l'id de l'utilisateur connecté
    const { id } = req.user;

    // On récupère les informations de l'utilisateur depuis la BDD
    const Oneuser = await userDatamapper.findOne(id);

    // On vérifie que l'email est valide avec une regex

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ errorMessage: 'Email invalide' });
      return;
    }

    // On vérifie que l'email n'est pas déjà utilisé
    const alreadyExistingUser = await userDatamapper.findByEmail(email);
    if (alreadyExistingUser) {
      res.status(400).json({ errorMessage: 'Cet email est déjà utilisé' });
    }
  }
};

export default accountController;
