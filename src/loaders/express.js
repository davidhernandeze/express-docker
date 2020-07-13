import process from 'process'
import stoppable from 'stoppable'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cors from 'cors'
import routes from '../api'
import config from '../config'
import logger from 'pino'

export default ({ app }) => {
  stoppable(app)
  process.on('SIGINT', function onSigint () {
    app.shutdown()
  })
  process.on('SIGTERM', function onSigterm () {
    app.shutdown()
  })
  app.shutdown = function () {
    app.stop(function onServerClosed (err) {
      console.log(err)
      console.log('asdd')
      if (err) {
        logger.error('An error occurred while closing the server: ' + err)
        process.exitCode = 1
      }
    })
    process.exit()
  }

  /**
   * Health Check endpoints
   */
  app.get('/status', (req, res) => {
    res.status(200).end()
  })
  app.head('/status', (req, res) => {
    res.status(200).end()
  })

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy')
  app.use(cors())
  app.use(helmet())

  // "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
  app.use(require('method-override')())

  app.use(bodyParser.json())
  app.use(config.api.prefix, routes())

  app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
  })

  app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      return res
        .status(err.status)
        .send({ message: err.message })
        .end()
    }
    return next(err)
  })
  app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
      errors: {
        message: err.message
      }
    })
  })
}
