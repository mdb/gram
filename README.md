# gram

A micro-y service for fetching one's recent Instagram media, with CORS support.

## Running

```
export IG_ACCESS_TOKEN=<your token>
```

```
npm install
npm run start
```

## Deploying to Heroku

1. login: `heroku login`
2. create an app: `heroku create`
3. deploy: `git push heroku master`
4. configure an access token: `heroku config:set IG_ACCESS_TOKEN=<your token>`
5. give your app a custom name (optional): `heroku apps:rename <your-new-name>`
