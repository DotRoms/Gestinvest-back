/* eslint-disable */
import scriptsCalculate from '../utils/scripts.dashboard.calculate.js';

// On initialise les données pour le test
const testTransactionData = [
  {
    asset_number: 10,
    price_invest: 10,
    asset_price: 100,
    fees: 1,
    asset_name: 'Bitcoin',
    symbol: 'BTC',
    name: 'crypto',
    trading_operation_type: 'buy'
  },
  {
    asset_number: 10,
    price_invest: 0.1,
    asset_price: 100,
    fees: 1,
    asset_name: 'Bitcoin',
    symbol: 'BTC',
    name: 'crypto',
    trading_operation_type: 'sell'
  }
];

// Début des tests 
describe('calculateAssetInformation', () => {
  // On vérifie que la fonction getAssetUserInformation retourne bien les informations attendues
  it('should calculate asset information correctly', () => {
    const result = scriptsCalculate.getAssetUserInformation(testTransactionData);

    // On vérifie que les informations calculées sont bien celles attendues
    expect(result.totalInvestment).toEqual(98.01);
    expect(result.totalEstimatePortfolio).toEqual(0);
    expect(result.gainOrLossPourcent).toEqual(-100);
    expect(result.gainOrLossMoney).toEqual(-98.01);
    expect(result.cryptoPourcent).toEqual(0);
    expect(result.stockPourcent).toEqual(0);
    expect(result.assetUserInformation[0].gainOrLossTotalByAsset).toEqual('negative');
  });
});
