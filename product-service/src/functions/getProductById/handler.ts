import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import getProducts from 'src/utils/getProducts';

import schema from './schema';

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const productslist = await getProducts();
  const product = productslist.find(el => el.id === event.pathParameters.id);
  return formatJSONResponse({
    data: product
  });
};

export const main = middyfy(getProductById);
