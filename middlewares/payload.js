const StringDecoder = require('string_decoder').StringDecoder

module.exports = req => new Promise((resolve, reject) => {
  const decoder = new StringDecoder('utf-8')
  
  let buffer = ''
  let payload
  
  req.on('data', data => buffer += decoder.write(data))
  req.on('end', () => {
    buffer += decoder.end()
  
    if (req.headers['content-type'] === 'application/json' && typeof buffer === 'string' && buffer.length) {
      try {
        payload = JSON.parse(buffer)
      } catch (error) {
        console.error(error)
        reject(false) 
      }
    } else if (buffer) {
      payload = buffer
    } else {
      payload = undefined
    }
  
    req.data = payload
    resolve()
  })  
})
