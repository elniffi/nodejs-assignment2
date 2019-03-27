const url = require('url')

const routes = {}

const addHandler = (method, path, handler) => {
  if (!routes[method]) {
    routes[method] = {}
  }

  routes[method][path] = handler
}

const parseMetaData = req => {
  const parsedUrl = url.parse(req.url, true)

  return {
    method: req.method.toLowerCase(),
    path: parsedUrl.pathname.replace(/^\/+|\/+$/g, ''),
    query: (parsedUrl.query) ? parsedUrl.query : {},
    headers: (parsedUrl.headers) ? parsedUrl.headers : {}
  }
}

const requestHandler = (req, res) => {
  const metaData = parseMetaData(req)

  // TODO: Actually implement routing
  res.end()
}

module.exports = {
  requestHandler,
  get: (path, handler) => addHandler('get', path, handler),
  post: (path, handler) => addHandler('post', path, handler),
  put: (path, handler) => addHandler('put', path, handler),
  patch: (path, handler) => addHandler('patch', path, handler),
  delete: (path, handler) => addHandler('delete', path, handler)
}