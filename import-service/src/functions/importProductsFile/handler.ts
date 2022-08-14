import { S3 } from 'aws-sdk';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { BUCKET_NAME, EXPIRATION_TIME, UPLOAD_FOLDER, REGION } from '../../../config.json';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const fileName = event.queryStringParameters.name;

    const s3Instance = new S3({ region: REGION });

    const urlForUpload = await s3Instance.getSignedUrlPromise('putObject', {
      Bucket: BUCKET_NAME,
      Key: `${UPLOAD_FOLDER}/${fileName}`,
      Expires: EXPIRATION_TIME,
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
