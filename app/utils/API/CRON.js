import cron from 'node-cron';
import 'dotenv/config';
import stockApi from './api.stock.js';
import cryptoApi from './api.crypto.js';

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
