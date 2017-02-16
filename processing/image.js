import gm from 'gm'
import { config } from '/config/environment'

const pgm = path => {
  const _gm = gm(path)
  const oldWrite = _gm.write
  _gm.write = outputPath => new Promise((resolve, reject) => {
    oldWrite(outputPath, (err, result) => err ? reject(err) : resolve(result))
  })
  return _gm
}

const imageResize = (input, output, x, y = x) => pgm(input)
  .setFormat('jpg')
  .resizeExact(x, y)
  .write(output)
  .then(result => ({
    x,
    y,
    path: output,
  }))

const processSquare = (req, res, next) => {
  const { file } = req
  const processPath = config.TEMP_PROCESSED_FOLDER + file.filename

  req.processed = {}

  const square = imageResize(file.path, `${processPath}square.jpg`, config.SQUARE_DIM)
    .then(item => {
      console.log('square')
      console.log(item)
      req.processed.square = item
    })
  const thumb = imageResize(file.path, `${processPath}thumb.jpg`, config.THUMB_DIM)
    .then(item => {
      console.log('thumb')
      console.log(item)
      req.processed.thumb = item
    })

  Promise.all([square, thumb]).then(() => {
    res.status(200).json(req.file)
  })

  //return next()
}

const processBackground = (req, res, next) => {
  return next()
}

export {
  processSquare,
  processBackground
}
