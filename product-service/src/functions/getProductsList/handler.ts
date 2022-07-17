import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import getProducts from 'src/utils/getProducts';

import schema from './schema';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const productsList = await getProducts();
  return formatJSONResponse({
    data: productsList
  });
};

export const main = middyfy(getProductsList);
