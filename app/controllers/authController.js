import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

async function signup(req, res) {
  try {
    // Récupérer les données d'inscription depuis le corps de la requête
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "L'utilisateur existe déjà." });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    user = new User({
      email,
      password: hashedPassword,
    });

    // Sauvegarder l'utilisateur dans la base de données
    await user.save();

    // Générer un token JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Renvoyer le token et d'autres données utilisateur
    res.status(201).json({ token, userId: user.id, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'inscription." });
  }

  return res.json({ message: 'Hello World!' });
}

async function login(req, res) {
  try {
    // Logique pour connecter un utilisateur
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la connexion.' });
  }
}
async function logout(req, res) {
  try {
    // Logique pour connecter un utilisateur
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la deconnexion.' });
  }
}

export { login, logout, signup };
