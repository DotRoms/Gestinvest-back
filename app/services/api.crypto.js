import axios from 'axios';
import 'dotenv/config';
import dbClient from '../datamappers/dbClient.js';

// On récupère tous les symboles de la table asset
async function findAllSymbolsByCategory(categoryId) {
  const result = await dbClient.query(
    'SELECT symbol FROM asset WHERE "category_id" = $1',
    [categoryId]
  );
  return result.rows;
}

// On met à jour le prix d'un actif en BDD
async function updatePrices(symbol, price) {
  const symb = symbol.toUpperCase();
  await dbClient.query('UPDATE asset SET "price" = $1 WHERE "symbol" = $2', [price, symb]);
}

// On récupère les symboles par groupe de 40 car l'api nous limite à 40 symboles par requête
async function getSymbolsInGroups(categoryId, groupSize) {
  const symbols = await findAllSymbolsByCategory(categoryId);
  const symbolArray = symbols.map((obj) => obj.symbol);

  const groups = [];
  for (let i = 0; i < symbolArray.length; i += groupSize) {
    groups.push(symbolArray.slice(i, i + groupSize).join(','));
  }

  return groups;
}

// On récupère les prix des actifs grace à l'api Yahoo Finance
async function fetchQuotesForGroup(group) {
  const options = {
    method: 'GET',
    url: 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest',
    params: {
      region: 'US',
      symbols: group
    },
    headers: {
      CMC_PRO_API_KEY: '08a94e55-8a2b-4854-922f-91bf04c7f6b6'
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

// On récupère les prix des actifs et on les met à jour en BDD
async function getPrice() {
  const groupSize = 40; // Taille de chaque groupe de symboles
  const categoryId = 2; // L'ID de la catégorie d'actifs que vous utilisez pour récupérer les symboles, 2 en l´occurence correspond au stocks
  const groups = await getSymbolsInGroups(categoryId, groupSize);

  try {
    const responses = await Promise.all(groups.map(fetchQuotesForGroup));
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
    result.forEach((item) => {
      Object.keys(item).forEach(async (key) => {
        await updatePrices(key, item[key]);
      });
    });
  } catch (error) {
    console.error(error);
  }
}

await getPrice();
