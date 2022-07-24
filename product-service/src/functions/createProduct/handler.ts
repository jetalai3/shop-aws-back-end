import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import createClient from 'src/utils/createClient';

import schema from './schema';

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log(JSON.stringify(event));
  const client = createClient();
  try {
    client.connect();
    await client.query('BEGIN')
    const { id, title, description, price, count } = event.body;
    
    const productQueryText = 'INSERT INTO products(id, title, description, price) VALUES($1, $2, $3, $4)';
    await client.query(productQueryText, [id, title, description, price]);

    const stocksQueryText = 'INSERT INTO stocks(product_id, count) VALUES($1, $2)';
    await client.query(stocksQueryText, [id, count]);

    await client.query('COMMIT');
    return formatJSONResponse({
      data: event.body
    }, 201);
  } catch (err) {
    await client.query('ROLLBACK');
    return formatJSONResponse({ message: 'Unknown error.' }, 500);
  } finally {
    client.end();
  };
};

export const main = middyfy(createProduct);
