module.exports = router => {
  router.get('/hello', (req, res) => {
    res.end()
  })

  router.post('/hello', (req, res) => {
    res.end()
  })

  router.delete('/hello', (req, res) => {
    res.end()
  })
}