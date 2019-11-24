const express = require('express')
const cors = require('cors')
const axios = require('axios')
const app = express()
const port = process.env.PORT || 5000

app.use(cors())

app.get('/', (req, res) => {
  res.send('hello world');
})

app.get('/recent-media', (req, res) => {
  axios({
    url: `https://api.instagram.com/v1/users/self/media/recent?access_token\=${process.env.IG_ACCESS_TOKEN}&count=8`
  })
  .then(result => {
    res.send(result.data.data)
  })
  .catch(err => {
    res.status(500)
    res.send({ error: err.message })
  })
})

app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})
