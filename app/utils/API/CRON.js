import 'dotenv/config';
import cron from 'node-cron';
import cryptoApi from './api.crypto.js';
import stockApi from './api.stock.js';

const task = cron.schedule(
  '0 0,12 * * *',
  async () => {
    await cryptoApi.getPriceCrypto(1, 60);
    await stockApi.getPriceStock(2, 40);
  },
  {
    scheduled: true,
    timezone: 'Europe/Paris' // Spécifiez votre fuseau horaire si nécessaire
  }
);

export default task;
