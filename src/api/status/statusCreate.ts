import 'source-map-support/register'
import { statusCreate } from '../../data/repos/status'


export const handler = async (event: any) => {

  const status = event.arguments.status

  console.log('LambdaEvent', event)

  const result = await statusCreate({
    ...status 
  })

  console.log('DB', result)

  return result
}
/*
export async function handler() {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const params = {
    TableName: process.env.tableName!,
    Item: {
      id: String,
     userId: String,
     allDay: Boolean,
     statusType: String,
     createdAt: String,
     updatedAt: String,
     startsAt: String,
     endsAt: String,
     message: String
    },
  };

  try {
    await dynamoDb.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
} */