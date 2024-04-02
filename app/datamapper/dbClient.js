import pg from 'pg';

const { Pool } = pg;

// Grâce à la connexion de type Pool on permet à la BDD d'ouvrir automatiquement une nouvelle connexion pour un nouvel utilisateur/requête HTTP. Ce qui permet de ne pas avoir à attendre que la requête SQL précédente soit terminée pour en lancer une nouvelle.
const client = new Pool();

export default client;
