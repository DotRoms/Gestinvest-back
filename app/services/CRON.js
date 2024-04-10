import cron from 'node-cron';
import 'dotenv/config';
import stockApi from './API/api.stock.js';
import cryptoApi from './API/api.crypto.js';

const task = cron.schedule(
  '24 11 * * *',
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
