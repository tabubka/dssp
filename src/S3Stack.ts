import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import { Construct } from 'constructs';

export default class S3Stack extends cdk.Stack {
  // Public reference to the S3 bucket
  bucket;

  constructor(scope: Construct | undefined, id: string | undefined, props: cdk.StackProps | undefined) {
    super(scope, id, props);

    this.bucket = new s3.Bucket(this, 'Uploads', {
      // Allow client side access to the bucket from a different domain
      cors: [
        {
          maxAge: 3000,
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
          allowedMethods: [ s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.POST, s3.HttpMethods.DELETE, s3.HttpMethods.HEAD],
        },
      ],
    });

    // Export values
    new cdk.CfnOutput(this, 'AttachmentsBucketName', {
      value: this.bucket.bucketName,
    });
  }
}