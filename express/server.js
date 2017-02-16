import express from 'express'
import multer from 'multer'
import bodyParser from 'body-parser'
import jwt from 'express-jwt'
import cors from 'cors'
import { config } from '/config/environment'
import { processSquare, processBackground } from '/processing/image'
import { processFile } from '/processing/file'
import { uploadS3 } from '/aws/s3'
import { returnToken } from '/auth'
import { cleanupFiles } from '/utils/file_helpers'

const app = express()

// middlewares
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// enforce credentials for all uploads so we have a referencing subject
app.use(jwt({ secret: config.AUTH_JWT_SECRET }))

// multer file upload setup
const upload = multer({
  dest: config.TEMP_UPLOAD_FOLDER,
  limits: { fileSize: config.MAX_FILE_SIZE_BYTES }
})

// square and thumbnail combination
app.post('/upload/image/square', upload.single('square'),
  processSquare, uploadS3, returnToken, cleanupFiles)
// larger background image
app.post('/upload/image/background', upload.single('background'),
  processBackground, uploadS3, returnToken, cleanupFiles)
// generic file upload
app.post('/upload/file', upload.single('file'), processFile,
  uploadS3, returnToken, cleanupFiles)

app.listen(config.PORT, function () {
  console.log(`Icepick file server listening on port ${config.PORT}`)
})
