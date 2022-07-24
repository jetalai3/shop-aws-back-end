import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import createClient from 'src/utils/createClient';
import { ProductNotFoundError } from '../../errors/productNotFound';

import schema from './schema';

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log(JSON.stringify(event));
  const client = createClient();
  try {
    client.connect();
    const queryText = 'SELECT products.*, stocks.count FROM products LEFT JOIN stocks on products.id=stocks.product_id WHERE products.id=$1 ';
    const queryResult = await client.query(queryText, [event.pathParameters.id]);

    if (!queryResult.rows.length) throw new ProductNotFoundError();
    return formatJSONResponse({
      data: queryResult.rows
    });
  } catch (err) {
    return err instanceof ProductNotFoundError ? formatJSONResponse({ message: err.message }, 404) : formatJSONResponse({ message: 'Unknown error.' }, 500);
  } finally {
    client.end();
  };
};

export const main = middyfy(getProductById);
