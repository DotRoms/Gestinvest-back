import 'dotenv/config';
import cron from 'node-cron';
import cryptoApi from './API/api.crypto.js';
import stockApi from './API/api.stock.js';

// Définir la tâche cron
const task = cron.schedule(
  '25 10 * * *',
  async () => {
    await cryptoApi.getPriceCrypto(1, 60);
    await stockApi.getPriceStock(2, 40);
    // Code à exécuter chaque minute
  },
  {
    scheduled: true,
    timezone: 'Europe/Paris' // Spécifiez votre fuseau horaire si nécessaire
  }
);

// Lancer la tâche cron
export default task;
