import express from 'express'
import config from './config'

async function startServer () {
  const app = express()
  await require('./loaders').default({ app })

  await app.listen(config.port, err => {
    if (err) {
      console.log(err)
      return
    }
    console.log('The server is ready on port ' + config.port)
  })
}

startServer()
