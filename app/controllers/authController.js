import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import users from '../datamappers/user.datamapper.js';
import auth from '../utils/auth.js';

const authController = {
  async signup(req, res) {
    // Récupérer les données d'inscription depuis le corps de la requête
    const { email, password, confirmation } = req.body;

    // On vérifie que tous les champs sont remplis
    if (!email || !password || !confirmation) {
      res.status(400).json({ errorMessage: 'Veuillez remplir tous les champs' });
      return;
    }

    // On effectue les vérifs pour l'email
    await auth.checkEmail(email);

    // On effectue les verifs et on hash le password si tout est ok
    const hashedPassword = await auth.checkPassword(password, confirmation);

    // On crée le user en BDD
    const newUser = await users.create({ email, password: hashedPassword });
    if (!newUser) {
      throw new Error('Erreur lors de la creation de votre portefeuille.');
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
      throw new Error('Mauvais couple email / mot de passe');
    }

    // On vérifie que le mot de passe correspond
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new Error('Mauvais couple email / mot de passe');
    }

    // On crée un token JWT qui sera valide 1h
    const token = jwt.sign({ email, user: user.id }, process.env.JWT_PRIVATE_KEY, { expiresIn: '24h' });
    res.status(201).json({ token });
  }
};

export default authController;
