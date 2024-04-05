import getSymbols from './getSymbols.js';

const cryptoSymbol = await getSymbols.getAllSymbol(1);
const stockSymbol = await getSymbols.getAllSymbol(2);

console.log(cryptoSymbol, stockSymbol);
