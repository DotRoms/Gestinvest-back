// Import le framework Express
import express from 'express';

// import des cors
import cors from 'cors';

// Import du CRON
import task from './utils/API/CRON.js';

// Import le routeur principal de l'application
import router from './routers/index.api.router.js';

// Initialise une nouvelle instance d'application Express
const app = express();

// const corsOptions = {
//   // origin: 'http://localhost:5173',
//   origin: 'https://gestinvest-front-8af1ad4ce95a.herokuapp.com/',
//   optionsSuccessStatus: 200
// };

// On utilise les cors pour communication front-back
app.use(cors());

// Utilise le middleware (boydparser) express.json pour traiter les requêtes au format JSON
app.use(express.json());

// Utilise le middleware (boydparser) express.urlencoded pour traiter les requêtes au format URL-encoded
app.use(express.urlencoded({ extended: true }));

// Utilise le routeur princpal pour gérer les routes de l'application
app.use(router);

// Déclenchenemt du CRON
task.start();

// Export l'application pour pouvoir l'utiliser dans d'autres modules
export default app;
