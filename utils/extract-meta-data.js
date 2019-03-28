const url = require('url')

module.exports = req => {
  const parsedUrl = url.parse(req.url, true)

  return {
    method: req.method.toLowerCase(),
    path: parsedUrl.pathname.replace(/\/+$/g, ''),
    query: (parsedUrl.query) ? parsedUrl.query : {}
  }
}