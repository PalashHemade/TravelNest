import { docClient } from '../dynamodb';
import {
    PutCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand,
    ScanCommand
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const TABLE_NAME = 'blogs';

export const createBlog = async (data: any) => {
    const blogId = uuidv4();
    const now = new Date().toISOString();

    const blog = {
        blogId,
        ...data,
        createdAt: now,
        updatedAt: now,
    };

    const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: blog,
    });

    await docClient.send(command);
    return { ...blog, _id: blog.blogId };
};

export const getBlogById = async (blogId: string) => {
    const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { blogId },
    });

    const response = await docClient.send(command);
    if (!response.Item) return null;
    return { ...response.Item, _id: response.Item.blogId };
};

export const getBlogBySlug = async (slug: string) => {
    const command = new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'slug = :slug',
        ExpressionAttributeValues: { ':slug': slug },
    });

    const response = await docClient.send(command);
    if (!response.Items || response.Items.length === 0) return null;
    return { ...response.Items[0], _id: response.Items[0].blogId };
};

export const getAllBlogs = async () => {
    const command = new ScanCommand({ TableName: TABLE_NAME });
    const response = await docClient.send(command);
    return (response.Items || []).map(item => ({ ...item, _id: item.blogId }));
};

export const updateBlog = async (blogId: string, data: any) => {
    let UpdateExpression = 'set updatedAt = :updatedAt';
    const ExpressionAttributeValues: any = { ':updatedAt': new Date().toISOString() };
    const ExpressionAttributeNames: any = {};
    let index = 0;

    for (const [key, value] of Object.entries(data)) {
        if (key === 'blogId' || key === '_id') continue;
        const expKey = `#f${index}`;
        const expVal = `:v${index}`;
        UpdateExpression += `, ${expKey} = ${expVal}`;
        ExpressionAttributeNames[expKey] = key;
        ExpressionAttributeValues[expVal] = value;
        index++;
    }

    const command = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { blogId },
        UpdateExpression,
        ExpressionAttributeNames: Object.keys(ExpressionAttributeNames).length > 0 ? ExpressionAttributeNames : undefined,
        ExpressionAttributeValues,
        ReturnValues: 'ALL_NEW',
    });

    const response = await docClient.send(command);
    return { ...response.Attributes, _id: response.Attributes?.blogId };
};

export const deleteBlog = async (blogId: string) => {
    const command = new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { blogId },
    });
    await docClient.send(command);
    return true;
};
