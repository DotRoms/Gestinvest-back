import pg from 'pg';

const { Pool } = pg;

// Grâce à la connexion de type Pool on permet à la BDD d'ouvrir automatiquement une nouvelle connexion pour un nouvel utilisateur/requête HTTP. Ce qui permet de ne pas avoir à attendre que la requête SQL précédente soit terminée pour en lancer une nouvelle.
const client = new Pool({
  // user: process.env.PG_USER // Nom d'utilisateur
  // host: process.env.PG_HOST, // Adresse de la base de données
  // database: process.env.PG_DATABASE, // Nom de la base de données
  // password: process.env.PG_PASSWORD, // Mot de passe
  // port: process.env.PG_PORT // Port par défaut pour PostgreSQL
  // connectionString: process.env.DATABASE_URL
  // max: 20, // Maximum 20 clients dans le pool
  // idleTimeoutMillis: 30000, // Fermer les clients inactifs après 30 secondes
  // connectionTimeoutMillis: 2000,
  // ssl: {
  //   rejectUnauthorized: false
  // }
});

export default client;
