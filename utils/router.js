const url = require('url')
const http = require('http')
const StringDecoder = require('string_decoder').StringDecoder

const routes = {}

const addHandler = (method, path, handler) => {
  if (!routes[path]) {
    routes[path] = {}
  }

  routes[path][method] = handler
}

const parseMetaData = req => {
  const parsedUrl = url.parse(req.url, true)

  return {
    method: req.method.toLowerCase(),
    path: parsedUrl.pathname.replace(/\/+$/g, ''),
    query: (parsedUrl.query) ? parsedUrl.query : {}
  }
}

const sendError = (req, res, httpCode) => {
  res.setHeader('Content-Type', 'text/plain')

  /*
  * A bit overkill perhaps, but the specification requires
  * the Allow header be set when responding with a 405 to indicate
  * which methods are supported by the resource
  */
  if (httpCode === 405) {
    const { path } = parseMetaData(req)
    const allowedMethods = Object.keys(routes[path])

    res.setHeader('Allow', allowedMethods
      .map(method => method.toUpperCase())
      .join(', ')
    )
  }

  res.writeHead(httpCode)
  res.end(http.STATUS_CODES[httpCode])
}

const requestHandler = (req, res) => {
  const {
    method,
    path,
    query
  } = parseMetaData(req)

  if (!routes[path]) {
    return sendError(req, res, 404)
  }

  if (!routes[path][method]) {
    return sendError(req, res, 405)
  }

  const handler = routes[path][method]
  const decoder = new StringDecoder('utf-8')
  
  let buffer = ''
  let payload

  req.on('data', data => buffer += decoder.write(data))
  req.on('end', () => {
    buffer += decoder.end()

    if (req.headers['content-type'] && typeof buffer === 'string' && buffer.length) {
      try {
        payload = JSON.parse(buffer)
      } catch (error) {
        return sendError(400)
      }
    } else {
      payload = buffer
    }

    req.query = query
    req.data = payload

    try {
      handler(req, res)
    } catch (error) {
      console.error(error)
    }
  })
}

module.exports = {
  requestHandler,
  get: (path, handler) => addHandler('get', path, handler),
  post: (path, handler) => addHandler('post', path, handler),
  put: (path, handler) => addHandler('put', path, handler),
  patch: (path, handler) => addHandler('patch', path, handler),
  delete: (path, handler) => addHandler('delete', path, handler)
}