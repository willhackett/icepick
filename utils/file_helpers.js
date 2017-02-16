import fs from 'fs'
import { config } from '/config/environment'

const removeFile = path => {
  fs.unlink(path, err => {
    if(err) { console.log('Error deleting file:', path) }
  })
}

const cleanupFiles = (req, res, next) => {

  removeFile(req.file.path)
  Object.keys(req.processed).forEach(key => {
    const path = config.TEMP_UPLOAD_FOLDER + req.processed[key].filename
    if(path !== req.file.path){
      removeFile(path)
    }
  })

  return next()
}

export {
  cleanupFiles
}
