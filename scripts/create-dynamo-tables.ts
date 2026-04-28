import { configDotenv } from "dotenv";
import { resolve } from "path";
configDotenv({ path: resolve(process.cwd(), ".env.local") });

import { DynamoDBClient, CreateTableCommand, ListTablesCommand } from "@aws-sdk/client-dynamodb";

const config = {
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    }
};

const client = new DynamoDBClient(config as any);

const tablesToCreate = [
    {
        TableName: "users",
        AttributeDefinitions: [{ AttributeName: "userId", AttributeType: "S" }],
        KeySchema: [{ AttributeName: "userId", KeyType: "HASH" }],
        BillingMode: "PAY_PER_REQUEST",
    },
    {
        TableName: "packages",
        AttributeDefinitions: [{ AttributeName: "packageId", AttributeType: "S" }],
        KeySchema: [{ AttributeName: "packageId", KeyType: "HASH" }],
        BillingMode: "PAY_PER_REQUEST",
    },
    {
        TableName: "destinations",
        AttributeDefinitions: [{ AttributeName: "destinationId", AttributeType: "S" }],
        KeySchema: [{ AttributeName: "destinationId", KeyType: "HASH" }],
        BillingMode: "PAY_PER_REQUEST",
    },
    {
        TableName: "blogs",
        AttributeDefinitions: [{ AttributeName: "blogId", AttributeType: "S" }],
        KeySchema: [{ AttributeName: "blogId", KeyType: "HASH" }],
        BillingMode: "PAY_PER_REQUEST",
    },
    {
        TableName: "custom_package_requests",
        AttributeDefinitions: [{ AttributeName: "requestId", AttributeType: "S" }],
        KeySchema: [{ AttributeName: "requestId", KeyType: "HASH" }],
        BillingMode: "PAY_PER_REQUEST",
    },
    {
        TableName: "bookings",
        AttributeDefinitions: [
            { AttributeName: "bookingId", AttributeType: "S" },
            { AttributeName: "userId", AttributeType: "S" }
        ],
        KeySchema: [
            { AttributeName: "bookingId", KeyType: "HASH" },
            { AttributeName: "userId", KeyType: "RANGE" }
        ],
        BillingMode: "PAY_PER_REQUEST",
    }
];

async function createTables() {
    try {
        const listTablesOutput = await client.send(new ListTablesCommand({}));
        const existingTables = listTablesOutput.TableNames || [];

        for (const tableDef of tablesToCreate) {
            if (existingTables.includes(tableDef.TableName)) {
                console.log(`Table ${tableDef.TableName} already exists. Skipping.`);
                continue;
            }
            console.log(`Creating table ${tableDef.TableName}...`);
            await client.send(new CreateTableCommand(tableDef as any));
            console.log(`Successfully completed creation request for ${tableDef.TableName}.`);
        }

        console.log("Database provisioning complete!");
    } catch (error) {
        console.error("Error creating tables:", error);
    }
}

createTables();
