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

## Usage

`gram` has 2 endpoints:

1. `GET /` - a basic health check

    Example:

    ```bash
    curl  http://localhost:3000
    {"message":"hello world"}
    ```

2. `GET /recent-media` - get the 8 most recent media posts from the Instagram user with whom the `IG_ACCESS_TOKEN` is associated:

    Example:
    ```bash
    curl  http://localhost:3000/recent-media | jq -r '.[0].caption.text'
      % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                     Dload  Upload   Total   Spent    Left  Speed
    100 12652  100 12652    0     0  40194      0 --:--:-- --:--:-- --:--:-- 40292
    Some post caption text.
    ```

## Development & Testing

```
npm install
npm test
```

## Deploying to Heroku

Assuming you have a [Heroku](http://heroku.com/) account and the `heroku` CLI...

1. login: `heroku login`
2. create an app: `heroku create`
3. deploy: `git push heroku master`
4. configure an access token: `heroku config:set IG_ACCESS_TOKEN=<your token>`
5. give your app a custom name (optional): `heroku apps:rename <your-new-name>`
