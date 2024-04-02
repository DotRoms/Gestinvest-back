import dbClient from './dbClient.js';

const dashboard = {
  async findAllTradingLinesByUser(userId) {
    const result = await dbClient.query(
      `
        SELECT 
            p.name,
            il.price,
            il.date,
            il.fees,
            il.asset_number,
            tot.name,
            c.name,
            ass.symbol,
            ass.price
        FROM invest_line AS il
        JOIN portfolio AS p 
                        ON portfolio_id = p.id
        JOIN "user" AS u 
                        ON user_id = u.id
        JOIN trading_operation_type AS tot 
                        ON trading_operation_type_id = tot.id
        JOIN asset AS ass 
                        ON asset_id = ass.id
        JOIN category AS c 
                        ON category_id = c.id
        WHERE u.id = $1
        ORDER BY il.date DESC;
        `,
      [userId]
    );
    return result.rows;
  },

  async addLine(data) {
    const result = await dbClient.query(
      'INSERT INTO invest_line (asset_id, portfolio_id, asset_number, price, fees, date, trading_operation_type_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        data.assetId,
        data.portfolioId,
        data.assetNumber,
        data.price,
        data.fees,
        data.date,
        data.tradingOperationTypeId
      ]
    );
    return result.rows[0];
  },

  async UpdateLine(data) {
    const result = await dbClient.query(
      'UPDATE invest_line SET asset_id = $1, portfolio_id = $2, asset_number = $3, price = $4, fees = $5, date = $6, trading_operation_type_id = $7 WHERE id = $8 RETURNING *',
      [
        data.assetId,
        data.portfolioId,
        data.assetNumber,
        data.price,
        data.fees,
        data.date,
        data.tradingOperationTypeId,
        data.id
      ]
    );
    return result.rows[0];
  },

  async deleteLine(lineId) {
    await dbClient.query('DELETE FROM invest_line WHERE id = $1;', [lineId]);
  }
};

export default dashboard;
