import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct, Node } from 'constructs';

import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime, FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

import * as path from 'path';

export class TodolistCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Define DynamoDB table
    const table = new Table(this, 'TodoList', {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING
      }
    });

    // Define todo Lambda
    const dynamoLambda = new NodejsFunction(this, "DynamoLambdaHandler", {
      runtime: Runtime.NODEJS_16_X,
      entry: path.join(__dirname, `/../functions/todolist.ts`),
      handler: "handler",
      environment: {
        TABLE_NAME: table.tableName,
      }
    });

    // Grant permissions to the Lambda function to write to DynamoDB table.
    table.grantReadWriteData(dynamoLambda);

    const myFunctionUrl = dynamoLambda.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
      }
    });

    new CfnOutput(this, 'FunctionUrl', {
      value: myFunctionUrl.url,
    });
  }
}
