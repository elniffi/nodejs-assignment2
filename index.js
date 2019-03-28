const server = require('./utils/server')
const router = require('./utils/router')

const helloHandler = require('./handlers/hello')

helloHandler(router)

server.start(router.requestHandler)