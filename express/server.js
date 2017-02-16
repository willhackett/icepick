import express from 'express'
import multer from 'multer'
import bodyParser from 'body-parser'
import { config } from '/config/environment'
import { processSquare, processBackground } from '/processing/images'
import { uploadAuth, generateFilenames } from '/auth'

const app = express()

// middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// upload routes
const upload = multer({
  dest: 'temp_uploads/',
  limits: { fileSize: config.MAX_FILE_SIZE_BYTES }
})
// square and thumbnail combination
app.post('/upload/image/square', uploadAuth, upload.single('square'),
  processSquare, generateFilenames, uploadS3, returnToken)
// larger background image
app.post('/upload/image/background', uploadAuth, upload.single('background'),
  processBackground, generateFilenames, uploadS3, returnToken)
// generic file upload
app.post('/upload/file', uploadAuth, upload.single('file'), uploadS3)

app.listen(config.PORT, function () {
  console.log(`Example app listening on port ${config.PORT}`)
})
