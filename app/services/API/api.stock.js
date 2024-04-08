import axios from 'axios';
import 'dotenv/config';
import assetDatamapper from '../../datamappers/asset.datamapper.js';
import groupSymbols from '../../utils/update.prices.api.js';

// On récupère les prix des actifs grace à l'api Yahoo Finance
async function fetchQuotesForGroup(group) {
  const options = {
    method: 'GET',
    url: 'https://yh-finance.p.rapidapi.com/market/v2/get-quotes',
    params: {
      region: 'US',
      symbols: group
    },
    headers: {
      'X-RapidAPI-Key': '1b92d523d0msh23c22511d5db90ep1997f0jsnc943a54e2ef7',
      'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
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
async function getPrice(categoryId, groupSize) {
  const groups = await groupSymbols.getSymbolsInGroups(categoryId, groupSize);

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
        await assetDatamapper.updatePrices(key, item[key]);
      });
    });
  } catch (error) {
    console.error(error);
  }
}

await getPrice(2, 40);
