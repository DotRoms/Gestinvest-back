import 'dotenv/config';
import cron from 'node-cron';
import cryptoApi from './api.crypto.js';
import stockApi from './api.stock.js';

const task = cron.schedule(
  '0 0,12 * * *', // Planification de l'exécution de la tâche deux fois par jour, à minuit et midi, heure de Paris
  async () => {
    // Fonction asynchrone exécutée à chaque fois que la tâche est déclenchée
    await cryptoApi.getPriceCrypto(1, 60);
    await stockApi.getPriceStock(2, 40);
  },
  {
    scheduled: true, // Définition de la tâche comme planifiée
    timezone: 'Europe/Paris'
  }
);

export default task;
