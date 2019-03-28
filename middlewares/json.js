module.exports = (req, res) => {
  res.json = data => {
    const jsonString = JSON.stringify(data)

    res.setHeader('Content-Type', 'application/json')
    res.writeHead(200)
    res.end(jsonString)
  }
}