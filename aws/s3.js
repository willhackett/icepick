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
const uploadS3 = (req, res, next) => {
  const { processed, user } = req

  req.uploaded = {}

  const uploads = []
  Object.keys(processed).forEach(key => {
    const item = processed[key]
    const fileStream = fs.readFileSync(config.TEMP_UPLOAD_FOLDER + item.filename)
    const target = item.targetfilename || item.filename
    uploads.push(uploadFile({
      Key: `${user.sub}/${target}`,
      Body: fileStream
    }).then(({ Bucket, Key, Location }) => {
      // set the uploaded details for payload creation
      req.uploaded[key] = {
        bucket: Bucket,
        filename: Key,
        location: Location
      }
    }))
  })

  Promise.all(uploads).then(() => next()).catch(err => next(err))
}

export {
  uploadS3
}
