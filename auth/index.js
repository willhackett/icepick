import jwt from 'jsonwebtoken'

const returnToken = (req, res, next) => {

  const response = {
    hello: 'there'
  }

  res.status(200).json(response)
  return next()
}

export {
  returnToken
}
