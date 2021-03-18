const express = require('express')
const cors = require('cors')
const axios = require('axios')
const app = express()
const port = process.env.PORT || 3000
const cacheTtl = process.env.CACHE_TTL || 10800

app.use(cors({
  methods: ['GET']
}))

app.get('/', (req, res) => {
  res.json({ message: 'hello world' });
})

app.get('/recent-media', (req, res) => {
  const accessToken = process.env.IG_ACCESS_TOKEN
  const secondsAgo = (timestamp) => {
    return (Date.now() - timestamp)/1000
  }

  if (!accessToken) {
    res
      .status(500)
      .json({ message: 'Required IG_ACCESS_TOKEN environment variable not set' })

      return
  }

  if (app.cache && secondsAgo(app.cache.timestamp) < cacheTtl && !req.query.clear_cache) {
    res.json(app.cache.data)

    return
  }

  axios({
    url: `https://graph.instagram.com/me/media?fields=media_url,permalink&access_token=${accessToken}`
  })
  .then(result => {
    app.cache = {
      timestamp: Date.now(),
      data: result.data.data
    };

    res.json(result.data.data)
  })
  .catch(err => {
    const status = err.response && err.response.status ? err.response.status : 500

    if (app.cache && app.cache.data) {
      console.error(`encountered ${err.response.status}: ${err.message} attempting request media from graph.instagram.com`)

      res.json(app.cache.data)

      return
    }

    res
      .status(status)
      .json({
        message: err.message,
        details: err.response.data
      })
  })
})

app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})

module.exports = app
