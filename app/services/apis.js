// import 'dotenv/config';
// import axios from 'axios';
// // import cron from 'node-cron';
// import dbClient from '../datamappers/dbClient.js';

// async function findAllSymbolsByCategory(categoryId) {
//   const result = await dbClient.query('SELECT symbol FROM asset WHERE "category_id" = $1', [categoryId]);
//   return result.rows;
// }

// // const cryptoSymbols = await findAllSymbolsByCategory(1);
// const stockSymbols = await findAllSymbolsByCategory(2);
// let cryptoSymbolsString = '';
// function getSymbolForIteration(category) {
//   category.forEach((obj) => {
//     cryptoSymbolsString += `${obj.symbol},`;
//   });
// }

// getSymbolForIteration(stockSymbols);
// const symbolArray = cryptoSymbolsString.split(',');

// // Stocker les symboles par groupe de 40 dans des variables différentes
// const stockGroup1 = symbolArray.slice(0, 40).join(',');
// // const stockGroup2 = symbolArray.slice(40, 80).join(',');
// // const stockGroup3 = symbolArray.slice(80, 120).join(',');

// // Ajoutez autant de groupes que nécessaire
// // console.log('Groupe 1:', stockGroup1);
// // console.log('Groupe 2:', stockGroup2);
// // console.log('Groupe 3:', stockGroup3);

// // function cut(stringContent) {
// //   console.log(stringContent.length);
// // }

// // console.log(cut(cryptoSymbolsString));
// // cron.schedule('0 0 * * *', async () => {
// //   console.log({ crypto: cryptoSymbols, bourse: stockSymbols });
// // });

// // console.log(stockSymbols.length);

// const options = {
//   method: 'GET',
//   url: 'https://yh-finance.p.rapidapi.com/market/v2/get-quotes',
//   params: {
//     region: 'US',
//     symbols: stockGroup1
//   },
//   headers: {
//     'X-RapidAPI-Key': '1b92d523d0msh23c22511d5db90ep1997f0jsnc943a54e2ef7',
//     'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
//   }
// };

// try {
//   const response = await axios.request(options);

//   const arrLength = response.data.quoteResponse.result.length;

//   for (let i = 0; i < arrLength; i += 1) {
//     console.log({ [`${response.data.quoteResponse.result[i].symbol}`]: response.data.quoteResponse.result[i].regularMarketPrice });
//   }
// } catch (error) {
//   console.error(error);
// }

// ------------ Test Factorisation ------------

import axios from 'axios';
import 'dotenv/config';
import dbClient from '../datamappers/dbClient.js';

async function findAllSymbolsByCategory(categoryId) {
  const result = await dbClient.query(
    'SELECT symbol FROM asset WHERE "category_id" = $1',
    [categoryId]
  );
  return result.rows;
}

async function getSymbolsInGroups(categoryId, groupSize) {
  const symbols = await findAllSymbolsByCategory(categoryId);
  const symbolArray = symbols.map((obj) => obj.symbol);

  const groups = [];
  for (let i = 0; i < symbolArray.length; i += groupSize) {
    groups.push(symbolArray.slice(i, i + groupSize).join(','));
  }

  return groups;
}

console.log(await getSymbolsInGroups(2, 40));

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

(async () => {
  const groupSize = 40; // Taille de chaque groupe de symboles
  const categoryId = 2; // L'ID de la catégorie d'actifs que vous utilisez pour récupérer les symboles
  const groups = await getSymbolsInGroups(categoryId, groupSize);

  try {
    const responses = await Promise.all(groups.map(fetchQuotesForGroup));

    // Pour accéder aux données dans chaque réponse
    responses.forEach((response) => {
      for (let i = 0; i < 40; i += 1) {
        const result = {
          [`${response.quoteResponse.result[i].symbol}`]:
            response.quoteResponse.result[i].regularMarketPrice
        }; // Accéder à la propriété "result" de l'objet
        console.log(result); // Faites ce que vous avez à faire avec les données
      }
    });
  } catch (error) {
    console.error(error);
  }
})();

// { [`${response.data.quoteResponse.result[i].symbol}`]: response.data.quoteResponse.result[i].regularMarketPrice }
// { [`${response.quoteResponse.result[i].symbol}`]: response.quoteResponse.result[i].regularMarketPrice }
