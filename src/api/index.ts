import * as appsync from '@aws-cdk/aws-appsync'
import * as _ from 'lodash'
import * as sst from "@serverless-stack/resources";
import * as cdk from "@aws-cdk/core";
import * as dynamo from '@aws-cdk/aws-dynamodb'


// EVENT

const StatusByIdLambda = (scope: sst.Stack, envVars: { [key: string]: string }) =>
  new  sst.Function(scope, 'StatusByIdLambda', {
    handler: "src/api/status/statusById.handler",
    environment: envVars,
  })

const StatusUpdateLambda = (scope: sst.Stack, envVars: { [key: string]: string }) =>
  new sst.Function(scope, 'StatusUpdateLambda', {
    handler: "src/api/status/statusUpdate.handler",
    environment: envVars,
  })

const StatusCreateLambda = (scope: sst.Stack, envVars: { [key: string]: string }) =>
  new sst.Function(scope, 'StatusCreateLambda', {
    handler: "src/api/status/statusCreate.handler",
    environment: envVars,
  })

const StatusDeleteLambda = (scope: sst.Stack, envVars: { [key: string]: string }) =>
  new sst.Function(scope, 'StatusDeleteLambda', {
    handler: "src/api/status/statusDelete.handler",
    environment: envVars,
  })



export const ResourceName = (logicalId: string, scope?: sst.Stack) => {  
  let prefix = ''
  if (scope) {
    const stack = sst.Stack.of(scope)
    prefix = `${stack.stackName}`
  }

  return `${prefix}-${logicalId}`
}

const GraphQLAPI = (scope: sst.Stack) => {
  const api = new appsync.GraphqlApi(scope, 'GraphQLAPI', {
    // name: 'Kork-PublicAPI',
    name: ResourceName('GraphQLAPI', scope),
    schema: appsync.Schema.fromAsset("graphql/schema.gql"),
    xrayEnabled: true,
    logConfig: {
      excludeVerboseContent: false,
      fieldLogLevel: appsync.FieldLogLevel.ALL,
    }
  })
  return api
}

// ? auto-generate name?
const useLambdaDataSource = (graphqlApi: appsync.GraphqlApi, lambdaFunction: sst.Function, fieldName: string, type: 'Query' | 'Mutation' = 'Query') => {
  graphqlApi.addLambdaDataSource(
    `${_.upperFirst(fieldName)}DataSource`,
    lambdaFunction,
  ).createResolver({
    typeName: type,
    fieldName,
  })
  return lambdaFunction
}

const useVTLDataSource = (
  graphqlApi: appsync.GraphqlApi,
  fieldName: string,
  requestMappingTemplate: string,
  responseMappingTemplate: string,
  typeName: 'Query' | 'Mutation' = 'Query'
) =>
  graphqlApi.addNoneDataSource(_.upperFirst(`${fieldName}DataSource`)).createResolver({
    typeName,
    fieldName,
    requestMappingTemplate: appsync.MappingTemplate.fromString(requestMappingTemplate),
    responseMappingTemplate: appsync.MappingTemplate.fromString(responseMappingTemplate),
  })

  export interface APIStackProps extends sst.StackProps {
    table: dynamo.Table
  }

export const APIStack = (scope: sst.App, props: APIStackProps) => {
  const stack = new sst.Stack(scope, 'DevDSSPAPI', props)

  const graphqlApi = GraphQLAPI(stack)

  // EventByIdLambda(stack)
  // EventUpdateLambda(stack)
  // CommentSendLambda(stack)

  const envVars = {
    DYNAMODB_TABLE: props.table.tableName
  }


  props.table.grantReadData(
  useLambdaDataSource(graphqlApi, StatusByIdLambda(stack, envVars), 'statusById'))
  props.table.grantReadWriteData(
  useLambdaDataSource(graphqlApi, StatusUpdateLambda(stack, envVars), 'statusUpdate', 'Mutation'))
  props.table.grantReadWriteData(
  useLambdaDataSource(graphqlApi, StatusCreateLambda(stack, envVars), 'statusCreate', 'Mutation'))
  props.table.grantReadWriteData(
  useLambdaDataSource(graphqlApi, StatusDeleteLambda(stack, envVars), 'statusDelete', 'Mutation'))

  useVTLDataSource(
    graphqlApi,
    'version',
    `
      {
        "version": "2018-05-29",
        "payload": $util.toJson($context.arguments)
      }
    `,
    `
      #set($version = "1.0.0")
      #return($version)
    `
  )

  new cdk.CfnOutput(stack, 'GraphQLID', {
    value: graphqlApi.apiId
  })
  new cdk.CfnOutput(stack, 'GraphQLAPIURL', {
    value: graphqlApi.graphqlUrl
  })
  new cdk.CfnOutput(stack, 'GraphQLRealTimeURL', {
    value: graphqlApi.graphqlUrl.replace('api', 'realtime-api')
  })
  new cdk.CfnOutput(stack, 'GraphQLAPIKey', {
    value: graphqlApi.apiKey!
  })
}