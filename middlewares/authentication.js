const http = require('http')

module.exports = (req, res) => {
  // try and authenticate user
    // try and get the header with token
    // if exists
      // try and validate token
    // else send 401, stop further processing  
  // if success
    // extend req object with user details
    // continue processing
  // else 
    // send 401, stop further processing
  
  // NOTE: just temporary, testing the middleware setup
  res.setHeader('Content-Type', 'text/plain')
  res.writeHead(401)
  res.end(http.STATUS_CODES[401])

  return false  
}