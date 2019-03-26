const fs = require('fs')
const util = require('util')
const http = require('http')
const https = require('https')

const {
  ports
} = require('../config.json')

const config = {
  key: fs.readFileSync('./certificates/key.pem'),
  cert: fs.readFileSync('./certificates/cert.pem')
}

const listenForHttpTraffic = async httpServer => util.promisify(httpServer.listen)(ports.http)
const listenForHttpsTraffic = async httpsServer => util.promisify(httpsServer.listen)(ports.https)

module.exports = {
  start: async (requestHandler) => {
    const httpServer = http.createServer(requestHandler)
    const httpsServer = https.createServer(config, requestHandler)
  
    return Promise.all([
      listenForHttpTraffic(httpServer),
      listenForHttpsTraffic(httpsServer)
    ])
  }
}