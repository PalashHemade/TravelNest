import { docClient } from '../dynamodb';
import {
    PutCommand,
    QueryCommand,
    ScanCommand,
    UpdateCommand,
    DeleteCommand
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const TABLE_NAME = 'bookings';

export const createBooking = async (data: any) => {
    const bookingId = uuidv4();
    const now = new Date().toISOString();

    // As per instruction: partitionKey: bookingId, sortKey: userId
    const booking = {
        bookingId,
        userId: data.user || data.userId, // handle mongoose populate logic where user was an id
        ...data,
        status: data.status || 'pending',
        paymentStatus: data.paymentStatus || 'unpaid',
        createdAt: now,
        updatedAt: now,
    };

    const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: booking,
    });

    await docClient.send(command);
    return { ...booking, _id: booking.bookingId };
};

export const getBookingById = async (bookingId: string) => {
    const command = new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'bookingId = :bookingId',
        ExpressionAttributeValues: { ':bookingId': bookingId },
    });

    const response = await docClient.send(command);
    if (!response.Items || response.Items.length === 0) return null;
    return { ...response.Items[0], _id: response.Items[0].bookingId };
};

export const getBookingsByUser = async (userId: string) => {
    // Scan by userId, since it is a sort key, we can't query it without the partition key 
    // unless we use a Global Secondary Index. We use a Data scan here for simplicity in this case 
    // unless a GSI is built on userId.
    const command = new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'userId = :userId OR #user = :userId',
        ExpressionAttributeNames: { '#user': 'user' },
        ExpressionAttributeValues: { ':userId': userId },
    });

    const response = await docClient.send(command);
    return (response.Items || []).map(item => ({ ...item, _id: item.bookingId }));
};

export const getAllBookings = async () => {
    const command = new ScanCommand({
        TableName: TABLE_NAME,
    });
    const response = await docClient.send(command);
    return (response.Items || []).map(item => ({ ...item, _id: item.bookingId }));
};

export const updateBooking = async (bookingId: string, userId: string, data: any) => {
    let UpdateExpression = 'set updatedAt = :updatedAt';
    const ExpressionAttributeValues: any = { ':updatedAt': new Date().toISOString() };
    const ExpressionAttributeNames: any = {};
    let index = 0;

    for (const [key, value] of Object.entries(data)) {
        if (key === 'bookingId' || key === 'userId' || key === '_id') continue;
        const expKey = `#f${index}`;
        const expVal = `:v${index}`;
        UpdateExpression += `, ${expKey} = ${expVal}`;
        ExpressionAttributeNames[expKey] = key;
        ExpressionAttributeValues[expVal] = value;
        index++;
    }

    const command = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { bookingId, userId },
        UpdateExpression,
        ExpressionAttributeNames: Object.keys(ExpressionAttributeNames).length > 0 ? ExpressionAttributeNames : undefined,
        ExpressionAttributeValues,
        ReturnValues: 'ALL_NEW',
    });

    const response = await docClient.send(command);
    return { ...response.Attributes, _id: response.Attributes?.bookingId };
};

export const deleteBooking = async (bookingId: string, userId: string) => {
    const command = new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { bookingId, userId },
    });
    await docClient.send(command);
    return true;
};
