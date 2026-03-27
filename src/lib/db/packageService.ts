import { docClient } from '../dynamodb';
import {
    PutCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand,
    ScanCommand
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const TABLE_NAME = 'packages';

export const createPackage = async (data: any) => {
    const packageId = uuidv4();
    const now = new Date().toISOString();

    const pkg = {
        packageId,
        ...data,
        rating: data.rating || 0,
        reviewsCount: data.reviewsCount || 0,
        featured: data.featured || false,
        createdAt: now,
        updatedAt: now,
    };

    const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: pkg,
    });

    await docClient.send(command);
    return { ...pkg, _id: pkg.packageId };
};

export const getPackageById = async (packageId: string) => {
    const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { packageId },
    });

    const response = await docClient.send(command);
    if (!response.Item) return null;
    return { ...response.Item, _id: response.Item.packageId };
};

export const getPackageBySlug = async (slug: string) => {
    const command = new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'slug = :slug',
        ExpressionAttributeValues: { ':slug': slug },
    });

    const response = await docClient.send(command);
    if (!response.Items || response.Items.length === 0) return null;
    return { ...response.Items[0], _id: response.Items[0].packageId };
};

export const getAllPackages = async () => {
    const command = new ScanCommand({ TableName: TABLE_NAME });
    const response = await docClient.send(command);
    return (response.Items || []).map(item => ({ ...item, _id: item.packageId }));
};

export const updatePackage = async (packageId: string, data: any) => {
    let UpdateExpression = 'set updatedAt = :updatedAt';
    const ExpressionAttributeValues: any = { ':updatedAt': new Date().toISOString() };
    const ExpressionAttributeNames: any = {};
    let index = 0;

    for (const [key, value] of Object.entries(data)) {
        if (key === 'packageId' || key === '_id') continue;
        const expKey = `#f${index}`;
        const expVal = `:v${index}`;
        UpdateExpression += `, ${expKey} = ${expVal}`;
        ExpressionAttributeNames[expKey] = key;
        ExpressionAttributeValues[expVal] = value;
        index++;
    }

    const command = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { packageId },
        UpdateExpression,
        ExpressionAttributeNames: Object.keys(ExpressionAttributeNames).length > 0 ? ExpressionAttributeNames : undefined,
        ExpressionAttributeValues,
        ReturnValues: 'ALL_NEW',
    });

    const response = await docClient.send(command);
    return { ...response.Attributes, _id: response.Attributes?.packageId };
};

export const deletePackage = async (packageId: string) => {
    const command = new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { packageId },
    });
    await docClient.send(command);
    return true;
};
