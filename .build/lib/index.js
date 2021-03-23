var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __exportStar = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __exportStar(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};

// lib/index.ts
__markAsModule(exports);
__export(exports, {
  default: () => main
});
var import_core3 = __toModule(require("@aws-cdk/core"));

// src/api/index.ts
var appsync = __toModule(require("@aws-cdk/aws-appsync"));
var _ = __toModule(require("lodash"));
var sst = __toModule(require("@serverless-stack/resources"));
var cdk = __toModule(require("@aws-cdk/core"));
var StatusByIdLambda = (scope, envVars) => new sst.Function(scope, "StatusByIdLambda", {
  handler: "src/api/status/statusById.handler",
  environment: envVars
});
var StatusUpdateLambda = (scope, envVars) => new sst.Function(scope, "StatusUpdateLambda", {
  handler: "src/api/status/statusUpdate.handler",
  environment: envVars
});
var StatusCreateLambda = (scope, envVars) => new sst.Function(scope, "StatusCreateLambda", {
  handler: "src/api/status/statusCreate.handler",
  environment: envVars
});
var StatusDeleteLambda = (scope, envVars) => new sst.Function(scope, "StatusDeleteLambda", {
  handler: "src/api/status/statusDelete.handler",
  environment: envVars
});
var ResourceName = (logicalId, scope) => {
  let prefix = "";
  if (scope) {
    const stack = sst.Stack.of(scope);
    prefix = `${stack.stackName}`;
  }
  return `${prefix}-${logicalId}`;
};
var GraphQLAPI = (scope) => {
  const api = new appsync.GraphqlApi(scope, "GraphQLAPI", {
    name: ResourceName("GraphQLAPI", scope),
    schema: appsync.Schema.fromAsset("graphql/schema.gql"),
    xrayEnabled: true,
    logConfig: {
      excludeVerboseContent: false,
      fieldLogLevel: appsync.FieldLogLevel.ALL
    }
  });
  return api;
};
var useLambdaDataSource = (graphqlApi, lambdaFunction, fieldName, type = "Query") => {
  graphqlApi.addLambdaDataSource(`${_.upperFirst(fieldName)}DataSource`, lambdaFunction).createResolver({
    typeName: type,
    fieldName
  });
  return lambdaFunction;
};
var useVTLDataSource = (graphqlApi, fieldName, requestMappingTemplate, responseMappingTemplate, typeName = "Query") => graphqlApi.addNoneDataSource(_.upperFirst(`${fieldName}DataSource`)).createResolver({
  typeName,
  fieldName,
  requestMappingTemplate: appsync.MappingTemplate.fromString(requestMappingTemplate),
  responseMappingTemplate: appsync.MappingTemplate.fromString(responseMappingTemplate)
});
var APIStack = (scope, props2) => {
  const stack = new sst.Stack(scope, "DevDSSPAPI", props2);
  const graphqlApi = GraphQLAPI(stack);
  const envVars = {
    DYNAMODB_TABLE: props2.table.tableName
  };
  props2.table.grantReadData(useLambdaDataSource(graphqlApi, StatusByIdLambda(stack, envVars), "statusById"));
  props2.table.grantReadWriteData(useLambdaDataSource(graphqlApi, StatusUpdateLambda(stack, envVars), "statusUpdate", "Mutation"));
  props2.table.grantReadWriteData(useLambdaDataSource(graphqlApi, StatusCreateLambda(stack, envVars), "statusCreate", "Mutation"));
  props2.table.grantReadWriteData(useLambdaDataSource(graphqlApi, StatusDeleteLambda(stack, envVars), "statusDelete", "Mutation"));
  useVTLDataSource(graphqlApi, "version", `
      {
        "version": "2018-05-29",
        "payload": $util.toJson($context.arguments)
      }
    `, `
      #set($version = "1.0.0")
      #return($version)
    `);
  new cdk.CfnOutput(stack, "GraphQLID", {
    value: graphqlApi.apiId
  });
  new cdk.CfnOutput(stack, "GraphQLAPIURL", {
    value: graphqlApi.graphqlUrl
  });
  new cdk.CfnOutput(stack, "GraphQLRealTimeURL", {
    value: graphqlApi.graphqlUrl.replace("api", "realtime-api")
  });
  new cdk.CfnOutput(stack, "GraphQLAPIKey", {
    value: graphqlApi.apiKey
  });
};

// src/CognitoStack.ts
var sst2 = __toModule(require("@serverless-stack/resources"));
var import_core = __toModule(require("@aws-cdk/core"));
var iam2 = __toModule(require("@aws-cdk/aws-iam"));
var cognito2 = __toModule(require("@aws-cdk/aws-cognito"));

// src/CognitoAuthRole.ts
var cdk2 = __toModule(require("@aws-cdk/core"));
var iam = __toModule(require("@aws-cdk/aws-iam"));
var cognito = __toModule(require("@aws-cdk/aws-cognito"));
var CognitoAuthRole = class extends cdk2.Construct {
  constructor(scope, id, props2) {
    super(scope, id);
    const {identityPool} = props2;
    this.role = new iam.Role(this, "CognitoDefaultAuthenticatedRole", {
      assumedBy: new iam.FederatedPrincipal("cognito-identity.amazonaws.com", {
        StringEquals: {
          "cognito-identity.amazonaws.com:aud": identityPool.ref
        },
        "ForAnyValue:StringLike": {
          "cognito-identity.amazonaws.com:amr": "authenticated"
        }
      }, "sts:AssumeRoleWithWebIdentity")
    });
    this.role.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "mobileanalytics:PutEvents",
        "cognito-sync:*",
        "cognito-identity:*"
      ],
      resources: ["*"]
    }));
    new cognito.CfnIdentityPoolRoleAttachment(this, "IdentityPoolRoleAttachment", {
      identityPoolId: identityPool.ref,
      roles: {authenticated: this.role.roleArn}
    });
  }
};
var CognitoAuthRole_default = CognitoAuthRole;

// src/CognitoStack.ts
var CognitoStack = class extends sst2.Stack {
  constructor(scope, id, props2) {
    super(scope, id, props2);
    const {bucketArn} = props2;
    const userPool = new cognito2.UserPool(this, "UserPool", {
      selfSignUpEnabled: true,
      autoVerify: {email: true},
      signInAliases: {email: true}
    });
    const userPoolClient = new cognito2.UserPoolClient(this, "UserPoolClient", {
      userPool,
      generateSecret: false
    });
    const identityPool = new cognito2.CfnIdentityPool(this, "IdentityPool", {
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          clientId: userPoolClient.userPoolClientId,
          providerName: userPool.userPoolProviderName
        }
      ]
    });
    const authenticatedRole = new CognitoAuthRole_default(this, "CognitoAuthRole", {
      identityPool
    });
    authenticatedRole.role.addToPolicy(new iam2.PolicyStatement({
      actions: ["s3:*"],
      effect: iam2.Effect.ALLOW,
      resources: [
        bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*"
      ]
    }));
    new import_core.CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId
    });
    new import_core.CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId
    });
    new import_core.CfnOutput(this, "IdentityPoolId", {
      value: identityPool.ref
    });
    new import_core.CfnOutput(this, "AuthenticatedRoleName", {
      value: authenticatedRole.role.roleName
    });
  }
};
var CognitoStack_default = CognitoStack;

// src/DynamoDBStack.ts
var sst3 = __toModule(require("@serverless-stack/resources"));
var dynamodb = __toModule(require("@aws-cdk/aws-dynamodb"));
var import_core2 = __toModule(require("@aws-cdk/core"));
var import_aws_dynamodb = __toModule(require("@aws-cdk/aws-dynamodb"));
var DynamoDBStack = class extends sst3.Stack {
  constructor(scope, id, props2) {
    super(scope, id, props2);
    this.table = new dynamodb.Table(this, "Table", {
      sortKey: {name: "SK", type: dynamodb.AttributeType.STRING},
      partitionKey: {name: "PK", type: dynamodb.AttributeType.STRING}
    });
    const index = 1;
    this.table.addGlobalSecondaryIndex({
      indexName: `GSI${index}`,
      partitionKey: {
        name: `GSI${index}PK`,
        type: import_aws_dynamodb.AttributeType.STRING
      },
      sortKey: {
        name: `GSI${index}SK`,
        type: import_aws_dynamodb.AttributeType.STRING
      }
    });
    new import_core2.CfnOutput(this, "TableName", {
      value: this.table.tableName
    });
    new import_core2.CfnOutput(this, "TableArn", {
      value: this.table.tableArn
    });
  }
};
var DynamoDBStack_default = DynamoDBStack;

// src/S3Stack.ts
var cdk3 = __toModule(require("@aws-cdk/core"));
var sst4 = __toModule(require("@serverless-stack/resources"));
var s3 = __toModule(require("@aws-cdk/aws-s3"));
var S3Stack = class extends sst4.Stack {
  constructor(scope, id, props2) {
    super(scope, id, props2);
    this.bucket = new s3.Bucket(this, "Uploads", {
      cors: [
        {
          maxAge: 3e3,
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.POST, s3.HttpMethods.DELETE, s3.HttpMethods.HEAD]
        }
      ]
    });
    new cdk3.CfnOutput(this, "AttachmentsBucketName", {
      value: this.bucket.bucketName
    });
  }
};
var S3Stack_default = S3Stack;

// lib/index.ts
var app = new import_core3.App();
var props = {};
app.synth();
function main(app2) {
  const database = new DynamoDBStack_default(app2, "DevDSSPDynamodbStack", props);
  const s32 = new S3Stack_default(app2, "DevDSSPS3Stack", props);
  new CognitoStack_default(app2, "DevDSSPCognito", {bucketArn: s32.bucket.bucketArn});
  APIStack(app2, {table: database.table});
}
//# sourceMappingURL=index.js.map
