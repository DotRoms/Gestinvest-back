import 'dotenv/config';
import cron from 'node-cron';
import cryptoApi from './API/api.crypto.js';
import stockApi from './API/api.stock.js';

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function executeTaskWithRetry() {
  try {
    await cryptoApi.getPriceCrypto(1, 60);
    console.log('midle task');
    await stockApi.getPriceStock(2, 40);
    console.log('done');
  } catch (error) {
    if (error.response && error.response.status === 429) {
      // Si l'erreur est 429, réessayez après un certain délai
      console.log('Too many requests. Retrying after delay...');
      await wait(60000); // Attendre 1 minute avant de réessayer (vous pouvez ajuster cette valeur selon les recommandations de l'API)
      await executeTaskWithRetry(); // Réessayer la tâche
    } else {
      // Gérer d'autres erreurs
      console.error('Error:', error.message);
    }
  }
}

const task = cron.schedule(
  '57 10 * * *',
  async () => {
    console.log('running task');
    await executeTaskWithRetry();
  },
  {
    scheduled: true,
    timezone: 'Europe/Paris' // Spécifiez votre fuseau horaire si nécessaire
  }
);

export default task;
