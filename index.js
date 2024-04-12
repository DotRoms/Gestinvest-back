// Importe la fonction createServer du module node 'http'
import { createServer } from 'node:http';

// Importe la configuration du module dotenv pour charger les variables d'environnement depuis un fichier .env
import 'dotenv/config';

// Importe l'application principale depuis le chemin spécifié
import app from './app/index.app.js';

// Définit le port sur lequel le serveur écoutera, en utilisant la variable d'environnement PORT si elle est définie, sinon le port par défaut est 3000
const PORT = process.env.PORT || 3000;

// Crée un serveur HTTP un utilisant la fonction createServer de node.js, en passant l'application principale comme gestionnaire de requêtes
const httpServer = createServer(app);

// Fait écouter au serveur HTTP sur le port spécifié, et exécute une fonction de rappel une fois que le serveur est lancé
httpServer.listen(PORT, () => {
  // Vérifie si l'environnement de node n'est pas défini sur 'production'
  if (process.env.NODE_ENV !== 'production') {
    // Affiche un message indiquant que le serveur HTTP a été lancé, avec l'URL d'accès
    console.log(`🚀 HTTP Server launched at httpp://localhost:${PORT} 🎉`);
  }
});
