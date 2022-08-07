import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductById from '@functions/getProductById';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from "@functions/catalogBatchProcess";
import config from './config.json';
import sqsConfig from "./sqsConfig.json";
import snsConfig from "./snsConfig.json";

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      SNS_ARN: { Ref: "CatalogBatchSimpleNotificationsTopic" },
      ...config
    },
    iamRoleStatements: [
			{
				Effect: "Allow",
				Action: "sns:*",
				Resource: { Ref: "CatalogBatchSimpleNotificationsTopic" },
			},
		],
  },
  // import the function via paths
  functions: { getProductsList, getProductById, createProduct, catalogBatchProcess: {
    ...catalogBatchProcess,
    events: [
      {
        sqs: {
          arn: { "Fn::GetAtt": ["CatalogBatchSimpleQueue", "Arn"] },
          batchSize: 5,
        },
      },
    ],
  }, },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: true,
      exclude: ['aws-sdk', 'pg-native'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
		Resources: {
			CatalogBatchSimpleQueue: {
				Type: "AWS::SQS::Queue",
				Properties: {
					QueueName: sqsConfig.QUEUE_NAME,
				},
			},
			CatalogBatchSimpleNotificationsTopic: {
				Type: "AWS::SNS::Topic",
				Properties: {
					TopicName: snsConfig.TOPIC_NAME,
				},
			},
			CatalogBatchSimpleNotificationsSuscription: {
				Type: "AWS::SNS::Subscription",
				Properties: {
					Protocol: "email",
					Endpoint: snsConfig.ENDPOINT,
					TopicArn: { Ref: "CatalogBatchSimpleNotificationsTopic" },
				},
			},
		},
		Outputs: {
			CatalogBatchSimpleQueueUrl: {
				Value: { Ref: "CatalogBatchSimpleQueue" },
				Export: {
					Name: { "Fn::Sub": "${AWS::StackName}-CatalogBatchSimpleQueue" },
				},
			},
			CatalogBatchSimpleQueueArn: {
				Value: { "Fn::GetAtt": ["CatalogBatchSimpleQueue", "Arn"] },
				Export: {
					Name: { "Fn::Sub": "${AWS::StackName}-CatalogBatchSimpleQueueArn" },
				},
			},
		},
	},
};

module.exports = serverlessConfiguration;
