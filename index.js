const process = require('process')
const logger = require('pino')()
const express = require('express')
const helmet = require('helmet')
const stoppable = require('stoppable')

const app = stoppable(express())

app.use(helmet())

process.on('SIGINT', function onSigint () {
  app.shutdown()
})

process.on('SIGTERM', function onSigterm () {
  app.shutdown()
})

app.shutdown = function () {
  app.stop(function onServerClosed (err) {
    if (err) {
      logger.error('An error occurred while closing the server: ' + err)
      process.exitCode = 1
    }
  })
  process.exit()
}

const port = 3000

app.get('/', (req, res) => res.send('Hello Worldy!'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
