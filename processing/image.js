import gm from 'gm'
import { config } from '/config/environment'

// wrap gm callback in promise
const write = (path, gm) => new Promise((resolve, reject) => {
  gm.write(path, (err, result) => err ? reject(err) : resolve(result))
})

// process a square image into a square and thumb processed image
const processSquare = (req, res, next) => {
  const { file } = req,
    squareFile = `${file.filename}_square.jpg`,
    thumbFile = `${file.filename}_thumb.jpg`

  const square = write(config.TEMP_UPLOAD_FOLDER + squareFile, gm(file.path)
    .setFormat('jpg')
    .resizeExact(config.SQUARE_DIM, config.SQUARE_DIM))
  const thumb = write(config.TEMP_UPLOAD_FOLDER + thumbFile, gm(file.path)
    .setFormat('jpg')
    .resizeExact(config.THUMB_DIM, config.THUMB_DIM))

  Promise.all([square, thumb]).then(() => {
    req.processed = {
      square: {
        filename: squareFile
      },
      thumb: {
        filename: thumbFile
      }
    }
    next()
  }).catch(err => next(err))
}

// process a background image
const processBackground = (req, res, next) => {
  const { file } = req,
    backgroundFile = `${file.filename}_background.jpg`

  write(config.TEMP_UPLOAD_FOLDER + backgroundFile, gm(file.path)
    .setFormat('jpg')
    .resize(config.BACKGROUND_DIM_X, config.BACKGROUND_DIM_Y)).then(() => {
      req.processed = {
        background: {
          filename: backgroundFile
        }
      }
      next()
    }).catch(err => next(err))
}

export {
  processSquare,
  processBackground
}
