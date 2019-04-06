const http = require('http')

const extractMetaData = require('../utils/extract-meta-data')

// middlewares
const queryMiddleware = require('../middlewares/query')
const payloadMiddleware = require('../middlewares/payload')
const jsonMiddleware = require('../middlewares/json')

const defaultMiddlewares = [queryMiddleware, payloadMiddleware, jsonMiddleware]
const routes = {}

const addHandlers = (method, path, handlers) => {
  if (!routes[path]) {
    routes[path] = {}
  }

  if (routes[path][method]) {
    throw new RangeError('route handlers already set')
  }

  routes[path][method] = (Array.isArray(handlers)) ? [...defaultMiddlewares, ...handlers] : [...defaultMiddlewares, handlers]
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
  * Get the handlers for the specific path and method.
  */
  const handlers = routes[path][method]

  for (let i = 0; i < handlers.length; i++) {
    let handler = handlers[i]

    /*
    * If a handler throws an error we need
    * to catch that.
    */
    try {
      /*
      * A handler can either return a promise that at
      * some point resolves or just run synchronously 
      */
      const runNext = await handler(req, res)

      /*
      * By resolving the promise with 'false'
      * the handler can prevent further handlers
      * being run.
      */
      if (runNext === false) {
        break
      }
    } catch (error) {
      console.error(error)
      return sendError(req, res, 500)
    }
  }
}

module.exports = {
  requestHandler,
  get: (path, handler) => addHandlers('get', path, handler),
  post: (path, handler) => addHandlers('post', path, handler),
  put: (path, handler) => addHandlers('put', path, handler),
  patch: (path, handler) => addHandlers('patch', path, handler),
  delete: (path, handler) => addHandlers('delete', path, handler)
}