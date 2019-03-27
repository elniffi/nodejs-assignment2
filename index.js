const server = require('./utils/server')
const router = require('./utils/router')

router.get('/hello', (req, res) => {
  console.log('awwh yeah!')
})

server.start(router.requestHandler)