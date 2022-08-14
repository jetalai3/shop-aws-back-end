import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import { main as importProductsFile } from './handler';

describe('importProductsFile tests', () => {
  it('should return success response', async () => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('S3', 'getSignedUrl', 'testUrl');
    const eventMock: any = { queryStringParameters: { name: 'file.csv' } }
    const contextMock: any = {};

    const result = await importProductsFile(eventMock, contextMock);

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("{\"urlForUpload\":\"testUrl\"}");
  });
});