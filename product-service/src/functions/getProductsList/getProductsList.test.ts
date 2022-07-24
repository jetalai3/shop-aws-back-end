import {expect} from '@jest/globals';

import { main as getProductsList } from './handler';
import products from '../../mocks/products';

describe('test getProductsList function', () => {
    const eventMock: any = { pathParameters: { id: products[0].id } };
    const contextMock: any = {};
    it('should return 200 when product call was successful', async () => {
        expect((await getProductsList(eventMock, contextMock)).statusCode).toEqual(200);
    })
    it('should return correct product array', async () => {
        expect(JSON.parse((await getProductsList(eventMock, contextMock)).body).data).toEqual(products);
    })
});