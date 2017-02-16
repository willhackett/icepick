
/**
 * as we expect any uploaded files to be processed, generic files
 * just have a dummy passthrough. This is in case we need to do processing
 * in the future
 */
const processFile = (req, res, next) => {
  const { file } = req
  req.processed = {
    file: {
      filename: file.filename,
      targetfilename: `${file.filename}/${file.originalname}`
    }
  }
  next()
}

export {
  processFile
}
