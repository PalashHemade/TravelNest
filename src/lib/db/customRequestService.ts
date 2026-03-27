import { docClient } from '../dynamodb';
import {
    PutCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand,
    ScanCommand
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const TABLE_NAME = 'custom_package_requests';

export const createCustomRequest = async (data: any) => {
    const requestId = uuidv4();
    const now = new Date().toISOString();

    const request = {
        requestId,
        userId: data.user || data.userId, // handle mongoose populate logic where user was an id
        ...data,
        status: data.status || 'pending',
        createdAt: now,
        updatedAt: now,
    };

    const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: request,
    });

    await docClient.send(command);
    return { ...request, _id: request.requestId };
};

export const getCustomRequestById = async (requestId: string) => {
    const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { requestId },
    });

    const response = await docClient.send(command);
    if (!response.Item) return null;
    return { ...response.Item, _id: response.Item.requestId };
};

export const getAllCustomRequests = async () => {
    const command = new ScanCommand({ TableName: TABLE_NAME });
    const response = await docClient.send(command);
    return (response.Items || []).map(item => ({ ...item, _id: item.requestId }));
};

export const updateCustomRequest = async (requestId: string, data: any) => {
    let UpdateExpression = 'set updatedAt = :updatedAt';
    const ExpressionAttributeValues: any = { ':updatedAt': new Date().toISOString() };
    const ExpressionAttributeNames: any = {};
    let index = 0;

    for (const [key, value] of Object.entries(data)) {
        if (key === 'requestId' || key === 'userId' || key === '_id') continue;
        const expKey = `#f${index}`;
        const expVal = `:v${index}`;
        UpdateExpression += `, ${expKey} = ${expVal}`;
        ExpressionAttributeNames[expKey] = key;
        ExpressionAttributeValues[expVal] = value;
        index++;
    }

    const command = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { requestId },
        UpdateExpression,
        ExpressionAttributeNames: Object.keys(ExpressionAttributeNames).length > 0 ? ExpressionAttributeNames : undefined,
        ExpressionAttributeValues,
        ReturnValues: 'ALL_NEW',
    });

    const response = await docClient.send(command);
    return { ...response.Attributes, _id: response.Attributes?.requestId };
};

export const deleteCustomRequest = async (requestId: string) => {
    const command = new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { requestId },
    });
    await docClient.send(command);
    return true;
};
