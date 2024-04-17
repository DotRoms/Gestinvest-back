import bcrypt from 'bcrypt';
import userDatamapper from '../datamappers/user.datamapper.js';

export default {
  async checkPassword(password, confirmPassword) {
    // On vérifie que les mots de passe correspondent
    if (password !== confirmPassword) {
      throw new Error('Erreur mot de passe');
    }

    // Vérifier la complexité du mot de passe avec une regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new Error('Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre, un caractère spécial et avoir une longueur minimale de 8 caractères.');
    }

    // On hash le mot de passe avant de le stocker en BDD
    const numberSaltRounds = parseInt(process.env.NB_OF_SALT_ROUNDS, 10);
    const hashedPassword = await bcrypt.hash(password, numberSaltRounds);
    return hashedPassword;
  },

  async checkEmail(email) {
    // On vérifie que l'email est valide avec une regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email invalide');
    }

    // On vérifie que l'email n'est pas déjà utilisé
    const alreadyExistingUser = await userDatamapper.findByEmail(email);
    if (alreadyExistingUser) {
      throw new Error('Cet email est déjà utilisé');
    }
  }
};
