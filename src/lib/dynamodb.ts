import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// Initialize the DynamoDB Client
const config: any = {
    region: process.env.AWS_REGION || 'ap-south-1',
};

if (process.env.AWS_ACCESS_KEY && process.env.AWS_SECRET_KEY) {
    config.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    };
}

const client = new DynamoDBClient(config);

// Create the Document Client which simplifies interaction with DynamoDB
// by automatically converting Javascript types to DynamoDB types
export const docClient = DynamoDBDocumentClient.from(client);
