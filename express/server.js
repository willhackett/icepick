import express from 'express'
import { config } from '/config/environment'

const app = express()

app.listen(config.PORT, function () {
  console.log(`Example app listening on port ${config.PORT}`)
})
