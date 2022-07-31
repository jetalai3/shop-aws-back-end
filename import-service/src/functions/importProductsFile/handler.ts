import { S3 } from 'aws-sdk';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const fileName = event.queryStringParameters.name;

    const s3Instance = new S3({ region: 'us-east-1' });

    const urlForUpload = await s3Instance.getSignedUrlPromise('putObject', {
      Bucket: 'import-service-bucket-jetalai',
      Key: `uploaded/${fileName}`,
      Expires: 60,
      ContentType: 'text/csv',
    });

    return formatJSONResponse({
      urlForUpload,
    });
  } catch (error) {
    return formatJSONResponse(
      {
        message: 'Unknown error',
      },
      500
    );
  }
};

export const main = middyfy(importProductsFile);
