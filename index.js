const server = require('./utils/server')

const init = async () => {
  try {
    await server.start((req, res) => {
      res.end()
    })
  } catch (error) {
    console.log(error)
  }
}

init()