import {
  Handler,
  APIGatewayProxyEventV2WithRequestContext,
  APIGatewayEventRequestContextV2,
} from "aws-lambda";
import { DynamoDB } from "aws-sdk";

import { nanoid } from "nanoid";

const db = new DynamoDB.DocumentClient();
const TABLE_NAME: string = process.env.TABLE_NAME!;

interface todoObject {
  id: string;
  todo: string;
  done: boolean;
}

export const handler: Handler = async (
  event: APIGatewayProxyEventV2WithRequestContext<APIGatewayEventRequestContextV2>
) => {
  const method = event.requestContext.http.method;

  if (method === "GET") {
    return await getTodo(event);
  } else if (method === "POST") {
    return await setTodo(event);
  } else {
    return {
      statusCode: 400,
      body: "Unsupported method",
    };
  }
};

async function setTodo(event: any) {
  try {
    const body = JSON.parse(event.body);
    const todo: todoObject = {
      id: nanoid(),
      todo: body.todo,
      done: false,
    };

    const params: DynamoDB.DocumentClient.PutItemInput = {
      TableName: TABLE_NAME,
      Item: todo,
    };

    await db.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(todo),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify("Internal server error"),
    };
  }
}

async function getTodo(event: any) {
  try {
    const params: DynamoDB.DocumentClient.GetItemInput = {
      TableName: TABLE_NAME,
      Key: {
        id: event.queryStringParameters.id,
      },
    };

    const data = await db.get(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(data.Item),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify("Internal server error"),
    };
  }
}
