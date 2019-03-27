const server = require('./utils/server')

server.start((req, res) => {
  res.end()
})