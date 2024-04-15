import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import users from '../datamappers/user.datamapper.js';

const authController = {
  async signup(req, res) {
    // Récupérer les données d'inscription depuis le corps de la requête
    const { email, password, confirmation } = req.body;

    // On vérifie que tous les champs sont remplis
    if (!email || !password || !confirmation) {
      res.status(400).json({ errorMessage: 'Veuillez remplir tous les champs' });
      return;
    }

    // On vérifie que l'email est valide avec une regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ errorMessage: 'Email invalide' });
      return;
    }

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

    // On vérifie que l'email n'est pas déjà utilisé
    const alreadyExistingUser = await users.findByEmail(email);
    if (alreadyExistingUser) {
      res.status(400).json({ errorMessage: 'Cet email est déjà utilisé' });
      return;
    }

    // On hash le mot de passe avant de le stocker en BDD
    const numberSaltRounds = parseInt(process.env.NB_OF_SALT_ROUNDS, 10);
    const hashedPassword = await bcrypt.hash(password, numberSaltRounds);

    // On crée le user en BDD
    const newUser = await users.create({ email, password: hashedPassword });
    if (!newUser) {
      res.status(500).json({ errorMessage: 'Erreur lors de la creation de votre portefeuille.' });
    }

    await users.createPortfolio(newUser);
    // Envoi d'un message de succès
    res.status(201).json({ successMessage: 'Votre compte a bien été créé, veuillez à présent vous authentifier' });
  },

  async login(req, res) {
    // On récupère les champs du user depuis le body
    const { email, password } = req.body;

    // On récupère l'utilisateur par son email en BDD
    const user = await users.findByEmail(email);
    // On vérifie que l'utilisateur existe
    if (!user) {
      res.status(400).json({ errorMessage: 'Mauvais couple email / mot de passe' });
      return;
    }

    // On vérifie que le mot de passe correspond
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      res.status(400).json({ errorMessage: 'Mauvais couple email / mot de passe' });
      return;
    }

    // On crée un token JWT qui sera valide 1h
    const token = jwt.sign({ email, user: user.id }, process.env.JWT_PRIVATE_KEY, { expiresIn: '24h' });
    res.status(201).json({ token });
  }
};

export default authController;
