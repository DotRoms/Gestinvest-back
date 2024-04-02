// Import le framework Express
import express from 'express';

// Import le module cookie-parser
import cookieParser from 'cookie-parser';

// Import le middleware d'authentification
import authMiddleware from './middlewares/auth.middleware.js';

// Import le routeur principal de l'application
import router from './routers/index.api.router.js';

// Initialise une nouvelle instance d'application Express
const app = express();

// Utilise le middleware (boydparser) express.json pour traiter les requêtes au format JSON
app.use(express.json());

// Utilise le middleware (boydparser) express.urlencoded pour traiter les requêtes au format URL-encoded
app.use(express.urlencoded({ extended: true }));

// On utilise cookie-parser pour avoir accès aux cookies dans les requêtes
app.use(cookieParser());

// Utilise le middleware d´authentification pour protéger les routes de l'application
app.use(authMiddleware.isAuth);

// Utilise le routeur princpal pour gérer les routes de l'application
app.use(router);

// Export l'application pour pouvoir l'utiliser dans d'autres modules
export default app;
