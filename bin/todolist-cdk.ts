#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { TodolistCdkStack } from '../lib/todolist-cdk-stack';

const app = new cdk.App();
new TodolistCdkStack(app, 'TodolistCdkStack', {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION 
  }
});