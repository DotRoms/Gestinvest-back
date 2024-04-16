import dbClient from './dbClient.js';

const users = {
  async findAll() {
    const result = await dbClient.query('SELECT * FROM "user"');
    return result.rows;
  },
  async findOne(id) {
    const result = await dbClient.query('SELECT * FROM "user" WHERE id = $1', [id]);
    return result.rows[0];
  },
  async findByEmail(email) {
    const result = await dbClient.query('SELECT * FROM "user" WHERE email = $1', [email]);
    return result.rows[0];
  },
  async create(data) {
    const result = await dbClient.query('INSERT INTO "user" (email, password) VALUES ($1, $2) RETURNING*', [data.email, data.password]);
    return result.rows[0];
  },
  async createPortfolio(data) {
    await dbClient.query('INSERT INTO portfolio (name, user_id) VALUES (\'Mon portefeuille\', $1)', [data.id]);
  },

  async update(id, data) {
    const result = await dbClient.query('UPDATE "user" SET email = $1, first_name = $2, last_name = $3, password = $4, updated_at = $5 WHERE id = $6 RETURNING *', [data.newEmail, data.firstname, data.lastname, data.password, data.updatedAt, id]);
    return result.rows[0];
  },
  async delete(id) {
    await dbClient.query('UPDATE "user" SET email = null, password = null, first_name = null, last_name = null WHERE id = $1', [id]);
  },
  async getPortfolioByUserId(id) {
    const result = await dbClient.query('SELECT portfolio.id FROM "portfolio" WHERE user_id = $1', [id]);
    return result.rows[0];
  }
};
export default users;
