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
    await dbClient.query('INSERT INTO "user" (email, password) VALUES ($1, $2)', [data.email, data.password]);
  },
  async update(id, data) {
    const result = await dbClient.query('UPDATE "user" SET email = $1, password = $2, WHERE id = $3 RETURNING *', [data.email, data.password, id]);
    return result.rows[0];
  },
  async delete(id) {
    await dbClient.query('UPDATE "user" SET email = null, password = null, first_name = null, last_name = null WHERE id = $1', [id]);
  }
};
export default users;
