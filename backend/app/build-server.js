// backend/app/build-server.js
const cors = require('cors')
const morgan = require('morgan')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const api = require('./api')

module.exports = (cb) => {
  const app = express()
  app.disable('x-powered-by')
  app.use(cors())

  // Increase the limit to handle base64 images (50MB should be enough for multiple images)
  app.use(bodyParser.json({ limit: '50mb' }))
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

  // Serve static files from uploads directory
  app.use('/uploads', express.static(path.join(__dirname, '../../uploads')))

  app.use(morgan('[:date[iso]] :method :url :status :response-time ms - :res[content-length]'))
  app.use('/api', api)
  app.use('*', (req, res) => res.status(404).end())
  const server = app.listen(process.env.PORT || 9428, () => cb && cb(server))
}
