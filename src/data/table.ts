import { DynamoDB } from 'aws-sdk'
import { Table } from 'dynamodb-toolbox'

const DocumentClient = new DynamoDB.DocumentClient()

export const table = new Table({
  name: process.env.DYNAMODB_TABLE!,

  partitionKey: 'PK',
  sortKey: 'SK',

  indexes: {
    GSI1: {
        partitionKey: 'GSI1PK',
        sortKey: 'GSI1SK',
      }
  },
  
  DocumentClient,
})