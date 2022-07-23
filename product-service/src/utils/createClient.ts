import { Client } from 'pg';

const createClient = () => {
    const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
    const dbOptions = {
      host: PG_HOST,
      port: parseInt(PG_PORT),
      database: PG_DATABASE,
      user: PG_USERNAME,
      password: PG_PASSWORD,
    };
  
    return new Client(dbOptions);
}

export default createClient;