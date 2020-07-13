const Router = require('express').Router
const route = Router()

export default (app) => {
  app.use('/users', route)

  route.get('/me', (req, res) => {
    return res.json({ user: { name: 'You' } }).status(200)
  })
}
