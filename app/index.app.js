// Import le framework Express
import express from "express";

// Import le routeur principal de l'application
import router from "./routers/index.router.js";

// Initialise une nouvelle instance d'application Express
const app = express();

// Utilise le middleware (boydparser) express.json pour traiter les requêtes au format JSON
app.use(express.json());

// Utilise le middleware (boydparser) express.urlencoded pour traiter les requêtes au format URL-encoded
app.use(express.urlencoded({ extended: true }));

// Utilise le routeur princpal pour gérer les routes de l'application
app.use(router);

// Export l'application pour pouvoir l'utiliser dans d'autres modules
export default app;
