import aws from '/config/aws'
import { config } from '/config/environment'
const s3 = new aws.S3()

// default options
const defaultOptions = {
  ACL: 'public-read',
  ContentType: 'image/jpeg',
  bucket: config.S3_BUCKET
}

/**
 * Upload a local file to s3
 */
const upload = options => new Promise((resolve, reject) => {
  s3.upload({
    ...defaultOptions
    ...options
  }, (err, data) => err ? reject(err) : resolve(data))
})

/**
 * Middleware filename generator and uploader for S3
 */
const uploadFilesS3 = (req, res) => {
  
}

export {
  upload,
  uploadFilesS3
}
