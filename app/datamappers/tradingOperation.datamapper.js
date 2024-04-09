import dbClient from './dbClient.js';

const tradingOperation = {
  async getOperationByName(name) {
    const result = await dbClient.query('SELECT id FROM "trading_operation_type" WHERE name = $1', [name]);
    return result.rows[0];
  }
};

export default tradingOperation;
