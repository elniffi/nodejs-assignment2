const http = require('http')

const extractMetaData = require('../utils/extract-meta-data')

// middlewares
const queryMiddleware = require('../middlewares/query')
const payloadMiddleware = require('../middlewares/payload')

const middlewares = [queryMiddleware, payloadMiddleware]
const routes = {}

const addHandler = (method, path, handler) => {
  if (!routes[path]) {
    routes[path] = {}
  }

  routes[path][method] = handler
}

const sendError = (req, res, httpCode) => {
  res.setHeader('Content-Type', 'text/plain')

  /*
  * A bit overkill perhaps, but the specification requires
  * the Allow header be set when responding with a 405 to indicate
  * which methods are supported by the resource
  */
  if (httpCode === 405) {
    const { path } = extractMetaData(req)
    const allowedMethods = Object.keys(routes[path])

    res.setHeader('Allow', allowedMethods
      .map(method => method.toUpperCase())
      .join(', ')
    )
  }

  res.writeHead(httpCode)
  res.end(http.STATUS_CODES[httpCode])
}

const requestHandler = async (req, res) => {
  /*
  * Basic validation to make sure a handler exists
  * for the path and method, to avoid unnecessary work
  * for the service otherwise.
  */
  const {
    method,
    path
  } = extractMetaData(req)

  if (!routes[path]) {
    return sendError(req, res, 404)
  }

  if (!routes[path][method]) {
    return sendError(req, res, 405)
  }

  /*
  * Run all the middlewares in order, synchronized to avoid race conditions
  * or strangeness by having multiple pices of code modify and interact with the 
  * req and res object.
  */
  try {
    for (let i = 0; i < middlewares.length; i++) {
      let middlware = middlewares[i]
      await middlware(req, res)
    }
  } catch (error) {
    return sendError(req, res, 500)
  }

  /*
  * Last we get the handler and try and run it, with a try/catch 
  * around it just to avoid crashing the server if it fails for some reason.
  */
  const handler = routes[path][method]
  
  try {
    handler(req, res)
  } catch (error) {
    // TODO: Find a way to avoid sending headers multiple times if the handler did it before crashing
    return sendError(req, res, 500)
  }
}

module.exports = {
  requestHandler,
  get: (path, handler) => addHandler('get', path, handler),
  post: (path, handler) => addHandler('post', path, handler),
  put: (path, handler) => addHandler('put', path, handler),
  patch: (path, handler) => addHandler('patch', path, handler),
  delete: (path, handler) => addHandler('delete', path, handler)
}