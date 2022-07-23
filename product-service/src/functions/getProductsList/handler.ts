import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import createClient from 'src/utils/createClient';

import schema from './schema';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const client = createClient();
  await client.connect();

  try {
    const queryResult = await client.query(
      `SELECT products.*, stocks.count FROM products LEFT JOIN stocks ON products.id=stocks.product_id`
    );
    return formatJSONResponse({
      data: queryResult.rows
    });
  } catch (err) {
    return formatJSONResponse({ message: 'Unknown error.' }, 500);
  };
};

export const main = middyfy(getProductsList);
