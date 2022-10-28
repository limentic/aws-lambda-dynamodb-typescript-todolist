import { DynamoDB } from 'aws-sdk';
import { nanoid } from 'nanoid';

const db = new DynamoDB.DocumentClient();
const TABLE_NAME: string = process.env.TABLE_NAME!;

interface todoObject {
    id: string;
    todo: string;
    done: boolean;
}

export async function setTodo(todo: string): Promise<any> {
    if (todo !== '') {
        const todoObject: todoObject = {
            id: nanoid(),
            todo: todo!,
            done: false,
        };

        const params: DynamoDB.DocumentClient.PutItemInput = {
            TableName: TABLE_NAME,
            Item: todoObject,
        };

        await db.put(params).promise();

        Promise.resolve(todoObject);
    }
    Promise.reject('Invalid request');
}

export async function getTodo(id: string): Promise<any> {
    if (id !== '') {
        const params: DynamoDB.DocumentClient.GetItemInput = {
            TableName: TABLE_NAME,
            Key: {
                id: id,
            },
        };

        const data = await db.get(params).promise();

        Promise.resolve(data.Item);
    }
    Promise.reject('Invalid request');
}