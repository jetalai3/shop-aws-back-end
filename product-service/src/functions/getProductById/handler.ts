import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { ProductNotFoundError } from 'src/errors/productNotFound';
import getProducts from 'src/utils/getProducts';

import schema from './schema';

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const productslist = await getProducts();
    const product = productslist.find(el => el.id === event.pathParameters.id);
    if (!product) throw new ProductNotFoundError();
    return formatJSONResponse({
      data: product
    });
  } catch (err) {
    return err instanceof ProductNotFoundError ? formatJSONResponse({ message: err.message }, 404) : formatJSONResponse({ message: 'Unknown error.' }, 500);
  };
};

export const main = middyfy(getProductById);
