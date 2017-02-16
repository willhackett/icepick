import aws from '/config/aws'
import fs from 'fs'
import { config } from '/config/environment'

const s3 = new aws.S3()

// default options
const defaultOptions = {
  ACL: 'public-read',
  ContentType: 'image/jpeg',
  Bucket: config.S3_BUCKET
}

/**
 * Upload a local file to s3
 */
const uploadFile = options => new Promise((resolve, reject) => {
  s3.upload({
    ...defaultOptions,
    ...options
  }, (err, data) => err ? reject(err) : resolve(data))
})

/**
 * Middleware filename generator and uploader for S3
 */
const uploadS3 = ({ processed, user }, res, next) => {

  // TODO: remove this for use with proper jwt
  const sub = '555555'

  const uploads = []
  Object.keys(processed).forEach(key => {
    const fileStream = fs.readFileSync(config.TEMP_UPLOAD_FOLDER + processed[key])
    uploads.push(uploadFile({
      Key: `${sub}/${processed[key]}`,
      Body: fileStream
    }))
  })

  Promise.all(uploads).then(() => next()).catch(err => next(err))
}

export {
  uploadS3
}
