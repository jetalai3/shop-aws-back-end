import { S3 } from 'aws-sdk';
import { S3Event } from 'aws-lambda';
import csvParser from 'csv-parser';

import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { BUCKET_NAME, UPLOAD_FOLDER, PARSED_FOLDER, REGION } from '../../../config.json';

const importFileParser = async (event: S3Event) => {
  try {
    console.log(`START parsing products from event: ${JSON.stringify(event)}`);

    const s3Instance = new S3({ region: REGION });

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

    records.forEach(async (record) => {
      console.log(`Start copying object: ${record}`);

      await s3Instance.copyObject({
        Bucket: BUCKET_NAME,
        CopySource: `${BUCKET_NAME}/${record.s3.object.key}`,
        Key: record.s3.object.key.replace(UPLOAD_FOLDER, PARSED_FOLDER)
      }).promise();
      
      console.log(`Start deleting object: ${record}`);

      await s3Instance.deleteObject({
        Bucket: BUCKET_NAME,
        Key: record.s3.object.key
      }).promise();
      
      console.log(`Deleted object: ${record}`);
    });
    
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
