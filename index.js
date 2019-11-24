const express = require('express')
const cors = require('cors')
const axios = require('axios')
const app = express()
const port = process.env.PORT || 3000

app.use(cors())

app.get('/', (req, res) => {
  res.send({ message: 'hello world' });
})

app.get('/recent-media', (req, res) => {
  const accessToken = process.env.IG_ACCESS_TOKEN

  if (!accessToken) {
    res.status(500)
    res.send({ message: 'Required IG_ACCESS_TOKEN environment variable not set' })
  }

  axios({
    url: `https://api.instagram.com/v1/users/self/media/recent?access_token\=${process.env.IG_ACCESS_TOKEN}&count=8`
  })
  .then(result => {
    res.send(result.data.data)
  })
  .catch(err => {
    res.status(500)
    res.send({ message: err.message })
  })
})

app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})
