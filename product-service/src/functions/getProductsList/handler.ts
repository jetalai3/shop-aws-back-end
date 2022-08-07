import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import createClient from 'src/utils/createClient';

import schema from './schema';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log(JSON.stringify(event));
  const client = createClient();
  try {

    await client.connect();
    const queryResult = await client.query(
      `SELECT products.*, stocks.count FROM products LEFT JOIN stocks ON products.id=stocks.product_id`
    );
    return formatJSONResponse({
      data: queryResult.rows
    });
  } catch (err) {
    return formatJSONResponse({ message: 'Unknown error.' }, 500);
  } finally {
    client.end();
  };
};

export const main = middyfy(getProductsList);
