const server = require('./utils/server')
const router = require('./utils/router')

router.get('/hello', (req, res) => {
  res.end()
})

router.post('/hello', (req, res) => {
  res.end()
})

router.delete('/hello', (req, res) => {
  res.end()
})

server.start(router.requestHandler)