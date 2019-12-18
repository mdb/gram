const express = require('express')
const cors = require('cors')
const axios = require('axios')
const app = express()
const port = process.env.PORT || 3000

app.use(cors())

app.get('/', (req, res) => {
  res.json({ message: 'hello world' });
})

app.get('/recent-media', (req, res) => {
  const accessToken = process.env.IG_ACCESS_TOKEN

  if (!accessToken) {
    res
      .status(500)
      .json({ message: 'Required IG_ACCESS_TOKEN environment variable not set' })

      return
  }

  axios({
    url: `https://api.instagram.com/v1/users/self/media/recent?access_token\=${accessToken}&count=8`
  })
  .then(result => {
    res.json(result.data.data)
  })
  .catch(err => {
    const status = err.response && err.response.status ? err.response.status : 500

    res
      .status(status)
      .json({ message: err.message })
  })
})

app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})

module.exports = app
