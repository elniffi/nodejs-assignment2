const extractMetaData = require('../utils/extract-meta-data')

module.exports = req => new Promise(resolve => {
  const {
    query
  } = extractMetaData(req)
  
  req.query = query

  resolve()
})