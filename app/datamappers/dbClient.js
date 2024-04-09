import pkg from 'pg';

const { Pool } = pkg;

// Grâce à la connexion de type Pool on permet à la BDD d'ouvrir automatiquement une nouvelle connexion pour un nouvel utilisateur/requête HTTP. Ce qui permet de ne pas avoir à attendre que la requête SQL précédente soit terminée pour en lancer une nouvelle.
const client = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum 20 clients dans le pool
  idleTimeoutMillis: 30000, // Fermer les clients inactifs après 30 secondes
  connectionTimeoutMillis: 2000,
  ssl: {
    rejectUnauthorized: false
  }
});

// Gérer les erreurs de connexion à la base de données
// client.on('error', (err) => {
//   console.error('Erreur de connexion à la base de données :', err.stack);
// });

export default client;
