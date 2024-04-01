import { Client } from 'pg';

const dbClient = new Client(process.env.DATABASE_URL);

dbClient.connect();

export default dbClient;
