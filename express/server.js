import express from 'express'
import multer from 'multer'
import bodyParser from 'body-parser'
import { config } from '/config/environment'
import fileUpload from '/file/upload'

const app = express()

// middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// upload routes
const upload = multer({ dest: 'temp_uploads/' })
app.post('/upload/image/square', upload.single('square'), fileUpload)
app.post('/upload/image/background', upload.single('background'), fileUpload)
app.post('/upload/image/file', upload.single('file'), fileUpload)

app.listen(config.PORT, function () {
  console.log(`Example app listening on port ${config.PORT}`)
})
