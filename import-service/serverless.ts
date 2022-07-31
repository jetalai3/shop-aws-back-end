import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';
import config from './config.json';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    region: 'us-east-1',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iamRoleStatements: [
			{
				Effect: 'Allow',
				Action: 's3:*',
				Resource: {
					'Fn::Join': [
						'',
						[{ 'Fn::GetAtt': ['ImportedFilesBucket', 'Arn'] }, ''],
					],
				},
			},
			{
				Effect: 'Allow',
				Action: 's3:*',
				Resource: {
					'Fn::Join': [
						'',
						[{ 'Fn::GetAtt': ['ImportedFilesBucket', 'Arn'] }, '/*'],
					],
				},
			},
		],
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
		Resources: {
			ImportedFilesBucket: {
				Type: 'AWS::S3::Bucket',
				Properties: {
					BucketName: config.BUCKET_NAME,
					CorsConfiguration: {
						CorsRules: [
							{
								AllowedHeaders: ['*'],
								AllowedMethods: ['PUT', 'DELETE'],
								AllowedOrigins: ['*'],
							},
						],
					},
				},
			},
		},
  },
};

module.exports = serverlessConfiguration;
