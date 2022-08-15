
import { SQSEvent } from "aws-lambda";
import { SNS } from "aws-sdk";

import { middyfy } from '@libs/lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import createClient from "src/utils/createClient";

const createProduct = async (event: SQSEvent) => {
  try {
    const topicArn = process.env.SNS_ARN;
    const sns = new SNS({ region: process.env.REGION });
    const client = createClient();

    console.log(event.Records);

    const productsToCreate = event.Records.map(({ body }) =>
      JSON.parse(body)
    );

    productsToCreate.map(async (product) => {
      try {
        client.connect();
        await client.query('BEGIN')
        const { id, title, description, price, count } = product;
        
        const productQueryText = 'INSERT INTO products(id, title, description, price) VALUES($1, $2, $3, $4)';
        await client.query(productQueryText, [id, title, description, price]);
    
        const stocksQueryText = 'INSERT INTO stocks(product_id, count) VALUES($1, $2)';
        await client.query(stocksQueryText, [id, count]);
    
        await client.query('COMMIT');
        return formatJSONResponse({
          data: product
        }, 201);
      } catch (err) {
        await client.query('ROLLBACK');
        return formatJSONResponse({ message: 'Unknown error.' }, 500);
      } finally {
        client.end();
      };
    })

    await sns
      .publish({
        TopicArn: topicArn,
        Subject: "Batch created",
        Message: JSON.stringify(productsToCreate),
      })
      .promise();

    return {
      statusCode: 201,
      body: "Products created",
    };
  } catch (error) {
    console.log({
      message: `ERROR: ${error.message}, ${JSON.stringify(error)}`,
    });
    return {
      statusCode: 500,
      body: error.message,
    };
  }
};

export const main = middyfy(createProduct);
