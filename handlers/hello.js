module.exports = router => {
  router.get('/hello', (req, res) => {
    res.json({responder: 'GET /hello'})
  })

  router.post('/hello', (req, res) => {
    res.json({responder: 'POST /hello'})
  })

  router.delete('/hello', (req, res) => {
    res.json({responder: 'DELETE /hello'})
  })
}