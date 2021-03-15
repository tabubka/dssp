import * as path from 'path'
import * as appsync from '@aws-cdk/aws-appsync'
import * as lambda from '@aws-cdk/aws-lambda-nodejs'
import * as cdk from '@aws-cdk/core'
import * as _ from 'lodash'

// EVENT

const StatusByIdLambda = (scope: cdk.Construct) =>
  new lambda.NodejsFunction(scope, 'StatusByIdLambda', {
    entry: path.resolve(__dirname, 'status/statusById.ts'),
    bundling: {
      sourceMap: true,
    },
  })

const StatusUpdateLambda = (scope: cdk.Construct) =>
  new lambda.NodejsFunction(scope, 'StatusUpdateLambda', {
    entry: path.resolve(__dirname, 'status/statusUpdate.ts'),
    bundling: {
      sourceMap: true,
    },
  })

const StatusCreateLambda = (scope: cdk.Construct) =>
  new lambda.NodejsFunction(scope, 'StatusCreateLambda', {
    entry: path.resolve(__dirname, 'status/statusCreate.ts'),
    bundling: {
      sourceMap: true,
    },
  })

const StatusDeleteLambda = (scope: cdk.Construct) =>
  new lambda.NodejsFunction(scope, 'StatusDeleteLambda', {
    entry: path.resolve(__dirname, 'status/statusDelete.ts'),
    bundling: {
      sourceMap: true,
    },
  })



export const ResourceName = (logicalId: string, scope?: cdk.Construct) => {  
  let prefix = ''
  if (scope) {
    const stack = cdk.Stack.of(scope)
    prefix = `${stack.stackName}`
  }

  return `${prefix}-${logicalId}`
}

const GraphQLAPI = (scope: cdk.Construct) => {
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
const useLambdaDataSource = (graphqlApi: appsync.GraphqlApi, lambdaFunction: lambda.NodejsFunction, fieldName: string, type: 'Query' | 'Mutation' = 'Query') =>
  graphqlApi.addLambdaDataSource(
    `${_.upperFirst(fieldName)}DataSource`,
    lambdaFunction,
  ).createResolver({
    typeName: type,
    fieldName,
  })


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

export const APIStack = (scope: cdk.Construct, props: cdk.StackProps) => {
  const stack = new cdk.Stack(scope, 'DevDSSPAPI', props)

  const graphqlApi = GraphQLAPI(stack)

  // EventByIdLambda(stack)
  // EventUpdateLambda(stack)
  // CommentSendLambda(stack)

  useLambdaDataSource(graphqlApi, StatusByIdLambda(stack), 'statusById')
  useLambdaDataSource(graphqlApi, StatusUpdateLambda(stack), 'statusUpdate', 'Mutation')
  useLambdaDataSource(graphqlApi, StatusCreateLambda(stack), 'statusCreate', 'Mutation')
  useLambdaDataSource(graphqlApi, StatusDeleteLambda(stack), 'statusDelete', 'Mutation')

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