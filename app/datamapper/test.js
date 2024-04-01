import dbClient from './dbClient.js';

const test = {
  async findOne(id) {
    const result = await dbClient.query(
      'SELECT * FROM "category" WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },
};

console.log(await test.findOne(1));
