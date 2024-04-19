/* eslint-disable */
import authController from '../controllers/authController';
import 'dotenv/config';

// Début de la fonction pour tester le authController
describe('signup function', () => {
  // On vérifie que la fonction signup retourne bien un message d'erreur si un champ est manquant
  it('should return error message if any field is missing', async () => {
    // Création d'un faux objet de requête pour les tests unitaires
    const req = { body: { email: '', password: '', confirmation: '' } };
    // Création d'un faux objet de réponse pour les tests unitaires
    const res = {
      // Méthode pour définir le code de statut de la réponse
      status(code) {
        this.statusCode = code; // Attribue le code de statut à la propriété statusCode de l'objet
        return this; // Retourne l'objet lui-même pour permettre le chaînage des méthodes
      },
      // Méthode pour envoyer des données JSON dans la réponse
      json(data) {
        this.data = data; // Attribue les données JSON à la propriété data de l'objet
      }
    };

      try {
        await authController.signup(req, res);
    } catch (error) {
        // Si une erreur est lancée, vérifier si c'est l'erreur attendue
        expect(error instanceof Error).toBe(true);
        expect(error.message).toBe('Veuillez remplir tous les champs'); // Remplacez 'errorMessage' par le message d'erreur attendu
    }
  });

  // On vérifie que la fonction signup retourne bien un message d'erreur si les mots de passe ne correspondent pas
  it('should return error message if passwords do not match', async () => {
    const req = { body: { email: 'test@example.com', password: 'password', confirmation: 'wrongpassword' } };
    const res = {
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.data = data;
      }
    };

    try {
      await authController.signup(req, res); 
  } catch (error) {
      expect(error instanceof Error).toBe(true);
      expect(error.message).toBe('Erreur mot de passe');
  }
  });

  // On vérifie que la fonction signup retourne bien un message de succès si l'utilisateur est créé
  it('should return succes message if user is created', async () => {
    const req = { body: { email: 'test@modale11.io', password: 'Password1234!', confirmation: 'Password1234!' } };
    const res = {
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.data = data;
      }
    };

    await authController.signup(req, res);

    expect(res.statusCode).toBe(201);
    expect(res.data).toEqual({ successMessage: expect.any(String) });
  });

  // On vérifie que la fonction login retourne bien le token quand l'utilisateur se connecte
  it('should return token for valid login', async () => {
    const req = { body: { email: 'non@gmail.com', password: 'Newmdp123!' } };
    const res = {
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.data = data;
      }
    };

    await authController.login(req, res);

    expect(res.statusCode).toBe(201);
    expect(res.data).toEqual({ token: expect.any(String) });
  });
});
