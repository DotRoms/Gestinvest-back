import axios from 'axios';
import 'dotenv/config';
import assetDatamapper from '../../datamappers/asset.datamapper.js';
import groupSymbols from '../update.prices.api.js';

export default {

  // Fonction pour récupérer les prix des cryptomonnaies pour un groupe donné
  async fetchPricesForGroup(group) {
  // Endpoint de l'API CoinMarketCap pour obtenir les dernières cotations des cryptomonnaies spécifiées dans le groupe
    const endpoint = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${group}`;

    // Configuration de l'en-tête de la requête avec votre clé d'API
    const config = {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.API_KEY_CMC
      }
    };

    try {
    // Faire la requête à l'API CoinMarketCap
      const response = await axios.get(endpoint, config);
      return response.data.data;
    } catch (error) {
    // Gestion des erreurs
      console.error(
        `Une erreur est survenue lors de la récupération des prix pour le groupe ${group}:`,
        error
      );
      return null;
    }
  },

  // Fonction pour récupérer les prix des cryptomonnaies et les afficher
  async getPriceCrypto(categoryId, groupSize) {
    const groups = await groupSymbols.getSymbolsInGroups(categoryId, groupSize);

    // Diviser les symboles de cryptomonnaies en groupes

    try {
    // Pour chaque groupe, récupérer les prix des cryptomonnaies
      await Promise.all(
        groups.map(async (group) => {
          const prices = await this.fetchPricesForGroup(group);
          if (prices) {
          // Afficher les prix récupérés
            Object.keys(prices).forEach(async (symbol) => {
              const { price } = prices[symbol].quote.USD;
              const arroundPrice = price.toFixed(8);
              // console.log({ symbol, price: `${arroundPrice}` });
              await assetDatamapper.updatePrices(symbol, arroundPrice);
            });
          }
        })
      );
    } catch (error) {
      console.error('Une erreur est survenue :', error);
    }
  }
};
// Appeler la fonction pour récupérer et afficher les prix des cryptomonnaies
// getPrice(1, 60);
