import axios from 'axios';
import 'dotenv/config';
import assetDatamapper from '../../datamappers/asset.datamapper.js';
import groupSymbols from '../update.prices.api.js';

const RATE_LIMIT_DELAY = 1000; // Délai en millisecondes entre chaque requête (1000 ms = 1 seconde)
let lastRequestTimestamp = 0; // Timestamp de la dernière requête

async function delayIfNeeded() {
  // Obtient le timestamp actuel
  const now = Date.now();
  // Calcule le temps écoulé depuis la dernière requête
  const timeSinceLastRequest = now - lastRequestTimestamp;

  // Vérifie si le temps écoulé est inférieur au délai limite autorisé entre les requêtes
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    // Calcule le délai restant avant de pouvoir effectuer la prochaine requête
    const delay = RATE_LIMIT_DELAY - timeSinceLastRequest;
    // Attend le délai restant avant de résoudre la promesse, ce qui suspend l'exécution
    await new Promise((resolve) => { setTimeout(resolve, delay); });
  }

  // Met à jour le timestamp de la dernière requête pour le prochain contrôle
  lastRequestTimestamp = Date.now();
}

export default {
  // On récupère les prix des actifs et on les met à jour en BDD
  async getPriceStock(categoryId, groupSize) {
    const groups = await groupSymbols.getSymbolsInGroups(categoryId, groupSize);

    try {
      const responses = await Promise.all(groups.map(async (group) => {
        await delayIfNeeded(); // Attendre avant chaque requête
        return this.fetchQuotesForGroup(group);
      }));

      const result = [];
      // Pour accéder aux données dans chaque réponse
      responses.forEach((response) => {
        for (let i = 0; i < response.quoteResponse.result.length; i += 1) {
          result.push({
            [`${response.quoteResponse.result[i].symbol}`]:
            response.quoteResponse.result[i].regularMarketPrice
          });
        }
      });

      // On itère sur le résultat pour récupérer les prix et les mettre à jour en BDD
      result.forEach(async (item) => {
        Object.keys(item).forEach(async (key) => {
          await assetDatamapper.updatePrices(key, item[key]);
        });
      });
    } catch (error) {
      console.error(error);
    }
  },

  // On récupère les prix des actifs grace à l'api Yahoo Finance
  async fetchQuotesForGroup(group) {
    const options = {
      method: 'GET',
      url: 'https://yh-finance.p.rapidapi.com/market/v2/get-quotes',
      params: {
        region: 'US',
        symbols: group
      },
      headers: {
        'X-RapidAPI-Key': process.env.API_KEY_YH,
        'X-RapidAPI-Host': process.env.API_HOST_YH
      }
    };

    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
};
