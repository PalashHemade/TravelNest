import { docClient } from '../dynamodb';
import {
    PutCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand,
    ScanCommand,
    QueryCommand
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const TABLE_NAME = 'users';

export interface UserInput {
    name: string;
    email: string;
    password?: string;
    image?: string;
    role?: 'user' | 'admin' | 'guest';
    provider?: 'credentials' | 'google';
}

export const createUser = async (data: UserInput) => {
    const userId = uuidv4();
    const now = new Date().toISOString();
    const user = {
        userId,
        ...data,
        role: data.role || 'user',
        provider: data.provider || 'credentials',
        createdAt: now,
        updatedAt: now,
    };

    const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: user,
    });

    await docClient.send(command);
    // Return backward compatible object format
    return { ...user, _id: user.userId };
};

export const getUserById = async (userId: string) => {
    const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { userId },
    });

    const response = await docClient.send(command);
    if (!response.Item) return null;
    return { ...response.Item, _id: response.Item.userId };
};

export const getUserByEmail = async (email: string) => {
    // Scan by email since it's not the partition key. In production with large data, a GSI on email would be better.
    const command = new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: {
            ':email': email,
        },
    });

    const response = await docClient.send(command);
    if (!response.Items || response.Items.length === 0) return null;
    const user = response.Items[0];
    return { ...user, _id: user.userId };
};

export const getAllUsers = async () => {
    const command = new ScanCommand({
        TableName: TABLE_NAME,
    });
    const response = await docClient.send(command);
    return (response.Items || []).map(item => ({ ...item, _id: item.userId }));
};

export const updateUser = async (userId: string, data: Partial<UserInput>) => {
    // Build update expression
    let UpdateExpression = 'set updatedAt = :updatedAt';
    const ExpressionAttributeValues: any = {
        ':updatedAt': new Date().toISOString(),
    };
    const ExpressionAttributeNames: any = {};

    let index = 0;
    for (const [key, value] of Object.entries(data)) {
        // 'name', 'role' might be reserved words in DynamoDB, using ExpressionAttributeNames
        const expKey = `#field${index}`;
        const expVal = `:val${index}`;
        UpdateExpression += `, ${expKey} = ${expVal}`;
        ExpressionAttributeNames[expKey] = key;
        ExpressionAttributeValues[expVal] = value;
        index++;
    }

    const command = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { userId },
        UpdateExpression,
        ExpressionAttributeNames: Object.keys(ExpressionAttributeNames).length > 0 ? ExpressionAttributeNames : undefined,
        ExpressionAttributeValues,
        ReturnValues: 'ALL_NEW',
    });

    const response = await docClient.send(command);
    return { ...response.Attributes, _id: response.Attributes?.userId };
};

export const deleteUser = async (userId: string) => {
    const command = new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { userId },
    });

    await docClient.send(command);
    return true;
};
