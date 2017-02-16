import jwt from 'jsonwebtoken'
import { config } from '/config/environment'

// returns a token payload to the user in secret file format
const returnToken = (req, res, next) => {

  const payload = {
    sub: req.user.sub,
    files: req.uploaded
  }

  const token = jwt.sign(payload, config.FILE_JWT_SECRET, { expiresIn: '10m' })

  res.status(200).json({ token })
  return next()
}

export {
  returnToken
}
