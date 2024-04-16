import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userDatamapper from '../datamappers/user.datamapper.js';

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
    let confirmation;
    let hashedPassword;
    let userUpdated;
    let token;

    // On récupère l'id de l'utilisateur connecté
    const { id } = req.user;

    // On récupère les informations de l'utilisateur depuis la BDD
    const user = await userDatamapper.findOne(id);

    // On test si l'utilisateur a modifié son email
    if (newEmail !== user.email) {
      // On vérifie que l'email est valide avec une regex
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(newEmail)) {
        res.status(400).json({ errorMessage: 'Email invalide' });
        return;
      }

      // On vérifie que l'email n'est pas déjà utilisé
      const alreadyExistingUser = await userDatamapper.findByEmail(newEmail);
      if (alreadyExistingUser) {
        res.status(400).json({ errorMessage: 'Cet email est déjà utilisé' });
        return;
      }
    }

    // On vérifie si le mot de passe corrspond à celui déjà utilisé
    if (password !== user.password) {
      confirmation = req.body.confirmation;

      // On vérifie que les mots de passe correspondent
      if (password !== confirmation) {
        res.status(400).json({ errorMessage: 'Les mots de passe ne correspondent pas' });
        return;
      }

      // Vérifier la complexité du mot de passe avec une regex
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        res.status(400).json({ errorMessage: 'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre, un caractère spécial et avoir une longueur minimale de 8 caractères.' });
        return;
      }

      // On hash le mot de passe avant de le stocker en BDD
      const numberSaltRounds = parseInt(process.env.NB_OF_SALT_ROUNDS, 10);
      hashedPassword = await bcrypt.hash(password, numberSaltRounds);

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
};

export default accountController;
