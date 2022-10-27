import { Handler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

import { nanoid } from 'nanoid';

const db = new DynamoDB.DocumentClient();
const TABLE_NAME: string = process.env.TABLE_NAME!;

interface todoObject {
    id: string;
    todo: string;
    done: boolean;
}

export const handler: Handler = async (event, context) => {
    // TODO : Implement router
    const method = event.requestContext.http.method;

    if (method === 'GET') {
        return {
            statusCode: 200,
            body: 'OK'
        };
    } else if (method === 'POST') {
        return await setTodo(event);
    }
}

async function setTodo(event: any) {
    try {
        const body = JSON.parse(event.body);
        const todo: todoObject = {
            id: nanoid(),
            todo: body.todo,
            done: false
        };

        const params: DynamoDB.DocumentClient.PutItemInput = {
            TableName: TABLE_NAME,
            Item: todo
        };

        await db.put(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(todo)
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify('Internal server error')
        };
    }
}