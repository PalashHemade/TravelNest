import { docClient } from '../dynamodb';
import {
    PutCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand,
    ScanCommand
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const TABLE_NAME = 'destinations';

export const createDestination = async (data: any) => {
    const destinationId = uuidv4();
    const now = new Date().toISOString();

    const destination = {
        destinationId,
        ...data,
        featured: data.featured || false,
        createdAt: now,
        updatedAt: now,
    };

    const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: destination,
    });

    await docClient.send(command);
    return { ...destination, _id: destination.destinationId };
};

export const getDestinationById = async (destinationId: string) => {
    const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { destinationId },
    });

    const response = await docClient.send(command);
    if (!response.Item) return null;
    return { ...response.Item, _id: response.Item.destinationId };
};

export const getAllDestinations = async () => {
    const command = new ScanCommand({ TableName: TABLE_NAME });
    const response = await docClient.send(command);
    return (response.Items || []).map(item => ({ ...item, _id: item.destinationId }));
};

export const updateDestination = async (destinationId: string, data: any) => {
    let UpdateExpression = 'set updatedAt = :updatedAt';
    const ExpressionAttributeValues: any = { ':updatedAt': new Date().toISOString() };
    const ExpressionAttributeNames: any = {};
    let index = 0;

    for (const [key, value] of Object.entries(data)) {
        if (key === 'destinationId' || key === '_id') continue;
        const expKey = `#f${index}`;
        const expVal = `:v${index}`;
        UpdateExpression += `, ${expKey} = ${expVal}`;
        ExpressionAttributeNames[expKey] = key;
        ExpressionAttributeValues[expVal] = value;
        index++;
    }

    const command = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { destinationId },
        UpdateExpression,
        ExpressionAttributeNames: Object.keys(ExpressionAttributeNames).length > 0 ? ExpressionAttributeNames : undefined,
        ExpressionAttributeValues,
        ReturnValues: 'ALL_NEW',
    });

    const response = await docClient.send(command);
    return { ...response.Attributes, _id: response.Attributes?.destinationId };
};

export const deleteDestination = async (destinationId: string) => {
    const command = new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { destinationId },
    });
    await docClient.send(command);
    return true;
};
