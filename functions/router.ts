import { Handler, APIGatewayProxyEventV2WithRequestContext, APIGatewayEventRequestContextV2, } from 'aws-lambda';
import { setTodo, getTodo } from './todolist';

export interface queryObject {
    path: string;
    queryStringParameters: string;
    body?: Object;
}

export const handler: Handler = async (event: APIGatewayProxyEventV2WithRequestContext<APIGatewayEventRequestContextV2>) => {
    const method = event.requestContext.http.method;

    if (method === "GET") {
        getTodo(event.queryStringParameters!.id!)
            .then((data) => {
                return {
                    statusCode: 200,
                    body: data,
                };
            })
            .catch((err) => {
                return {
                    statusCode: 500,
                    body: err,
                };
            })
    } else if (method === "POST") {
        setTodo(event.body!)
            .then((data) => {
                return {
                    statusCode: 200,
                    body: data,
                };
            })
            .catch((err) => {
                return {
                    statusCode: 500,
                    body: err,
                };
            })
    } else {
        return {
            statusCode: 400,
            body: "Unsupported method",
        };
    }
}