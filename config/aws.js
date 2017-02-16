import aws from 'aws-sdk'
import { config } from './environment'

aws.config.update({
  accessKeyId: config.S3_ACCESS_KEY_ID,
  secretAccessKey: S3_ACCESS_KEY,
  region: config.S3_REGION || 'us-east-1'
});

export default aws
