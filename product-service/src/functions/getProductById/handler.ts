import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import products from 'src/mocks/products';

import schema from './schema';

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const product = products.find(el => el.id === event.pathParameters.id);
  return formatJSONResponse({
    data: product
  });
};

export const main = middyfy(getProductById);
