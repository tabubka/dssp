import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import { CfnOutput } from '@aws-cdk/core';
import { Construct } from 'constructs';

export default class DynamoDBStack extends cdk.Stack {
  constructor(scope: Construct | undefined, id: string | undefined, props: cdk.StackProps | undefined) {
    super(scope, id, props);

    //const app = this.node.root;

    const table = new dynamodb.Table(this, 'Table', {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Use on-demand billing mode
      sortKey: { name: 'statusId', type: dynamodb.AttributeType.STRING },
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
    });

    // Output values
    new CfnOutput(this, 'TableName', {
      value: table.tableName,
      // exportName: // app.logicalPrefixedName('TableName'),
    });
    new CfnOutput(this, 'TableArn', {
      value: table.tableArn,
      // exportName: app.logicalPrefixedName('TableArn'),
    });
  }
}