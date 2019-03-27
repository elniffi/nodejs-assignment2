const path = require('path')
const fs = require('fs')
const http = require('http')
const https = require('https')

const {
  ports
} = require('../config.json')

const config = {
  key: fs.readFileSync(path.join(__dirname, '../certificates/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '../certificates/cert.pem'))
}

module.exports = {
  start: async (requestHandler) => {
    const httpServer = http.createServer(requestHandler)
    const httpsServer = https.createServer(config, requestHandler)
  
    httpServer.listen(ports.http, error => {
      if (error) {
        console.error(`failed to listen to http traffic on ${ports.http}`, error)
      } else {
        console.log(`listening to http traffic on ${ports.http}`)
      }
    })

    httpsServer.listen(ports.https, error => {
      if (error) {
        console.error(`failed to listen to https traffic on ${ports.https}`, error)
      } else {
        console.log(`listening to https traffic on ${ports.https}`)
      }
    })
  }
}