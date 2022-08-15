import { APIGatewayAuthorizerEvent } from 'aws-lambda';
import { middyfy } from '@libs/lambda';

async function basicAuthorizer(event: APIGatewayAuthorizerEvent) {
	console.log(event);

	if (event.type !== 'TOKEN') {
		throw new Error('Error: token value is missing');
	}

	const { authorizationToken = '', methodArn } = event;

	const authorizationTokenValue = authorizationToken.split('Basic ')[1];

	if (!authorizationTokenValue) {
		throw 'Unauthorized';
	}

	const creds = Buffer.from(authorizationTokenValue, 'base64').toString('utf-8').split(':');
  	const [username, password] = creds;

	if (!password || password !== process.env[username]) {
		console.log('Deny');
		return generatePolicy(authorizationTokenValue, 'Deny', methodArn);
	}
	console.log('Allow');
	return generatePolicy(authorizationTokenValue, 'Allow', methodArn);
}

function generatePolicy(principalId: string, effect: string, resource: string) {
	return {
		principalId,
		policyDocument: {
			Version: '2012-10-17',
			Statement: [
				{
					Action: 'execute-api:Invoke',
					Effect: effect,
					Resource: resource,
				},
			],
		},
	};
}

export const main = middyfy(basicAuthorizer);
