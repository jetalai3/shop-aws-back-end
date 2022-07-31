import { S3 } from 'aws-sdk';
import { S3Event } from 'aws-lambda';
import csvParser from 'csv-parser';

import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

const importFileParser = async (event: S3Event) => {
  try {
    console.log(`START parsing products from event: ${JSON.stringify(event)}`);

    const s3Instance = new S3({ region: 'us-east-1' });

    const records = event.Records; 
    const recordsWithData = records.filter(
      (record) => !!record.s3.object.size
    );

    const recordPromiseArray = recordsWithData.map(record => {
      const { s3: { bucket: { name: bucketName }, object: { key: objectKey }, }, } = record

        const productParsingStream = s3Instance
          .getObject({ Bucket: bucketName, Key: objectKey })
          .createReadStream()
          .pipe(csvParser());

        const recordProcessingPromises = [];
        const logRecord = async (data) => {
          console.log(`Product: ${JSON.stringify(data)}`);
        }
        productParsingStream.on('data', (data) => {
          recordProcessingPromises.push(logRecord(data));
        });

        return new Promise<void>((resolve, reject) => {
          productParsingStream
            .on('end', async () => {
              await Promise.allSettled(recordProcessingPromises);
              resolve();
            })
            .on('error', reject);
        });
      }
    );

    await Promise.allSettled(recordPromiseArray);
    return formatJSONResponse({
      message: 'Finish parsing products',
    });
  } catch (error) {
    console.log(`
      ERROR: ${error.message}\n
      ${JSON.stringify(error)}
    `);
    return formatJSONResponse(
      {
        message: 'Unknown error',
      },
      500
    );
  }
};

export const main = middyfy(importFileParser);
