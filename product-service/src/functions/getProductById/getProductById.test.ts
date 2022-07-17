import {expect} from '@jest/globals';

import { main as getProductById } from './handler';
import products from '../../mocks/products';

describe('test getProductById function', () => {
    const eventMock: any = { pathParameters: { id: products[0].id } };
    const contextMock: any = {};
    it('should return 200 when product was found', async () => {
        expect((await getProductById(eventMock, contextMock)).statusCode).toEqual(200);
    })
    it('should return correct product instance', async () => {
        expect(JSON.parse((await getProductById(eventMock, contextMock)).body).data).toEqual(products[0]);
    })
    it('should return 404 when product was not found', async () => {
        expect((await getProductById({ pathParameters: { id: 1 }}, contextMock)).statusCode).toEqual(404);
    })
});