import { App } from '@aws-cdk/core';
import { APIStack } from './api';
import CognitoStack from "./CognitoStack"
import DynamoDBStack from "./DynamoDBStack"
import S3Stack from './S3Stack';



const devEnv = {
  account: '293400667467',
  region: 'eu-west-1'
};
const app = new App();
const props = { env: devEnv }

new DynamoDBStack(app, 'DevDSSPDynamodbStack', props);

const s3 = new S3Stack(app, 'DevDSSPS3Stack', props)

new CognitoStack(app, 'DevDSSPCognito', { env: devEnv, bucketArn: s3.bucket.bucketArn });

APIStack(app,  props);

app.synth();