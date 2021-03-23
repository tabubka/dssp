import * as sst from "@serverless-stack/resources";
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import { CfnOutput } from '@aws-cdk/core';
import { AttributeType } from '@aws-cdk/aws-dynamodb'

export default class DynamoDBStack extends sst.Stack {
  public table: dynamodb.Table

  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    //const app = this.node.root;

    this.table = new dynamodb.Table(this, 'Table', {
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
    });

    const index = 1;

    this.table.addGlobalSecondaryIndex({
      indexName: `GSI${index}`,
      partitionKey: { 
        name: `GSI${index}PK`,
        type: AttributeType.STRING,
      },
      sortKey: {
        name: `GSI${index}SK`,
        type: AttributeType.STRING,
    }
  });

    // Output values
    new CfnOutput(this, 'TableName', {
      value: this.table.tableName,
      // exportName: // app.logicalPrefixedName('TableName'),
    });
    new CfnOutput(this, 'TableArn', {
      value: this.table.tableArn,
      // exportName: app.logicalPrefixedName('TableArn'),
    });
  }
}